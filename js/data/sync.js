/* ═══════════════════════════════════════════════════════════
   SYNCHRONISATION FIRESTORE — ElAwail Digital Platform
   Fichier : js/data/sync.js

   CRITIQUE 2 (CLAUDE.md §4) — Migration localStorage → Firestore

   Stratégie :
   ┌─────────────────────────────────────────────────────────┐
   │  localStorage = cache offline (toujours disponible)      │
   │  Firestore    = source de vérité (multi-appareils)       │
   └─────────────────────────────────────────────────────────┘

   Au démarrage (initSync) :
     A) Firestore vide + localStorage a données → migration UP
     B) Firestore a données + localStorage vide → pull DOWN
     C) Les deux ont données → fusion par id (cloud prioritaire)
     D) Les deux vides → rien

   À chaque saveData() ou savePEIStatus() :
     → _pushToFirestore() en arrière-plan (non bloquant)

   Clés synchronisées :
     • SYNC_KEYS_ARR  : tableaux JSON (presences, notes, etc.)
     • SYNC_KEYS_DICT : objets JSON (pei_statuses, ablls, etc.)
     • SYNC_BUNDLE_EA_FULL : clés ea_pei_full_* (1 doc bundle)
     • SYNC_BUNDLE_EA_TA9  : clés ea_ta9_*      (1 doc bundle)
     • SYNC_BUNDLE_EA_GH   : clés ea_gh_*       (1 doc bundle)
     • Nouveaux bénéficiaires : collection org_new_benef
═══════════════════════════════════════════════════════════ */

/* ── Clés tableau (arrays) ── */
const SYNC_KEYS_ARR = [
  'ea_presences',
  'ea_notes',
  'ea_suivis',
  'ea_rapports',
  'ea_alertes',
  'ea_pei_suivis',
  'ea_pei_rapports',
  'ea_pei_evals'
];

/* ── Clés objet (dicts) — pas de merge par id, remplacement complet ── */
const SYNC_KEYS_DICT = [
  'ea_pei_statuses'
];

/* UID courant — défini dans initSync() */
let _syncUid = null;

/* Timer de debounce pour syncSchedule() */
let _syncDebounceTimers = {};

/* ══════════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
══════════════════════════════════════════════════════════ */

/**
 * Déduplique deux tableaux en fusionnant par champ `id`.
 * Les éléments Firestore ont la priorité en cas de conflit d'id.
 */
function _mergeArrays(local, cloud) {
  const map = new Map();
  (local || []).forEach(item => { if (item && item.id) map.set(item.id, item); });
  (cloud || []).forEach(item => { if (item && item.id) map.set(item.id, item); });
  /* Éléments sans id : garder locaux + cloud sans doublon */
  const withoutId = [
    ...(local  || []).filter(i => !i || !i.id),
    ...(cloud  || []).filter(i => !i || !i.id)
  ];
  return [...map.values(), ...withoutId];
}

/**
 * Chemin Firestore pour les données dynamiques d'un utilisateur.
 */
function _docRef(key) {
  return db.collection('users').doc(_syncUid).collection('data').doc(key);
}

/**
 * Chemin Firestore pour les bundles de clés dynamiques.
 */
function _bundleRef(bundleName) {
  return db.collection('users').doc(_syncUid).collection('bundles').doc(bundleName);
}

/* ══════════════════════════════════════════════════════════
   PUSH FIRESTORE (non bloquant — appelé par saveData)
══════════════════════════════════════════════════════════ */

/**
 * Pousse une clé vers Firestore en arrière-plan.
 * Appelée automatiquement depuis saveData() dans dashboard.html.
 * @param {string} key - Clé localStorage
 * @param {Array|Object} data - Données à sauvegarder
 */
function _pushToFirestore(key, data) {
  if (!_syncUid || typeof db === 'undefined') return;

  _docRef(key)
    .set({
      items:     Array.isArray(data) ? data : data,
      isDict:    !Array.isArray(data),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('[Sync] ✅ Push OK :', key, '—', Array.isArray(data) ? data.length + ' entrées' : 'dict');
    })
    .catch(e => {
      if (e.code === 'permission-denied') {
        console.error('[Sync] ❌ RÈGLES FIRESTORE — accès refusé pour', key,
          '\n→ Firebase Console → Firestore → Règles → ajouter :\n',
          'match /users/{uid}/{col}/{doc} { allow read, write: if request.auth.uid == uid; }');
      } else {
        console.warn('[Sync] ⚠️ Push échoué :', key, e.code);
      }
    });
}

/**
 * Version debounced de _pushToFirestore — évite les appels répétés.
 * Appelée depuis savePEIStatus(), savePEIFullDomaines() dans dashboard.html.
 * @param {string} key  - Clé à synchroniser
 * @param {*}      data - Valeur à écrire
 * @param {number} delay - Délai en ms (défaut : 2000)
 */
function syncSchedule(key, data, delay) {
  if (!_syncUid || typeof db === 'undefined') return;
  clearTimeout(_syncDebounceTimers[key]);
  _syncDebounceTimers[key] = setTimeout(() => {
    _pushToFirestore(key, data);
    delete _syncDebounceTimers[key];
  }, delay || 2000);
}

/* ══════════════════════════════════════════════════════════
   SYNC DES BUNDLES (clés dynamiques nombreuses)
══════════════════════════════════════════════════════════ */

/**
 * Lit depuis localStorage toutes les clés correspondant à un préfixe
 * et les emballe dans un objet { clé: valeur }.
 */
function _readBundle(prefix) {
  const bundle = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      try { bundle[k] = JSON.parse(localStorage.getItem(k)); }
      catch(e) { bundle[k] = localStorage.getItem(k); }
    }
  }
  return bundle;
}

/**
 * Applique un bundle (objet {clé:valeur}) dans localStorage.
 */
function _applyBundle(bundle) {
  if (!bundle) return;
  Object.entries(bundle).forEach(([k, v]) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch(e) {
      console.warn('[Sync] Erreur écriture bundle clé :', k);
    }
  });
}

/**
 * Synchronise un bundle de clés dynamiques (push si local, pull si cloud).
 * @param {string} prefix      - Préfixe des clés (ex: 'ea_ta9_')
 * @param {string} bundleName  - Nom du document Firestore
 */
async function _syncBundle(prefix, bundleName) {
  try {
    const localBundle = _readBundle(prefix);
    const localCount  = Object.keys(localBundle).length;

    const doc = await _bundleRef(bundleName).get();
    const cloudBundle = doc.exists ? (doc.data().bundle || {}) : {};
    const cloudCount  = Object.keys(cloudBundle).length;

    if (cloudCount === 0 && localCount === 0) return;

    if (cloudCount === 0 && localCount > 0) {
      /* Migration UP */
      console.log(`[Sync] Bundle UP [${bundleName}] : ${localCount} clés → Firestore`);
      _bundleRef(bundleName).set({
        bundle: localBundle,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.warn('[Sync] Bundle UP échoué :', bundleName, e.code));
      return;
    }

    if (cloudCount > 0 && localCount === 0) {
      /* Pull DOWN */
      console.log(`[Sync] Bundle DOWN [${bundleName}] : ${cloudCount} clés → localStorage`);
      _applyBundle(cloudBundle);
      return;
    }

    /* Fusion : cloud prioritaire pour les clés existantes des deux côtés */
    const merged = Object.assign({}, localBundle, cloudBundle);
    console.log(`[Sync] Bundle fusion [${bundleName}] : ${localCount} local + ${cloudCount} cloud`);
    _applyBundle(merged);
    _bundleRef(bundleName).set({
      bundle: merged,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('[Sync] Bundle fusion push échoué :', bundleName, e.code));

  } catch(e) {
    if (e.code === 'permission-denied') {
      console.error('[Sync] ❌ Règles Firestore manquantes pour bundle :', bundleName);
    } else {
      console.warn('[Sync] ⚠️ Bundle sync échoué :', bundleName, e.code || e.message);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   SYNC DES NOUVEAUX BÉNÉFICIAIRES
══════════════════════════════════════════════════════════ */

/**
 * Sauvegarde un nouveau bénéficiaire dans Firestore.
 * Appelée depuis adminSaveNewBenef() dans dashboard.html.
 * @param {Object} benef - Objet bénéficiaire (sans theo/prat)
 */
function syncSaveNewBenef(benef) {
  if (!_syncUid || typeof db === 'undefined') return;

  /* Retirer les données volumineuses statiques avant stockage */
  const { theo_s1, prat_s1, theo_s2, prat_s2, theo_rep, prat_rep, ...coreData } = benef;
  const nomNorm = (benef.nom || '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9؀-ۿ_]/g, '');
  const docId   = nomNorm + '_' + Date.now();

  db.collection('org_new_benef').doc(docId)
    .set({
      ...coreData,
      addedBy:   _syncUid,
      addedAt:   firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('[Sync] ✅ Nouveau bénéficiaire sauvegardé :', benef.nom);
    })
    .catch(e => {
      console.warn('[Sync] ⚠️ Erreur sauvegarde bénéficiaire :', e.code);
      /* Fallback : sauvegarder dans localStorage */
      const existing = JSON.parse(localStorage.getItem('ea_new_benef') || '[]');
      existing.push({ ...coreData, _savedAt: new Date().toISOString() });
      localStorage.setItem('ea_new_benef', JSON.stringify(existing));
    });
}

/**
 * Charge les nouveaux bénéficiaires depuis Firestore et les ajoute à BENEFICIAIRES.
 * Les bénéficiaires déjà présents (même nom) sont ignorés.
 */
async function _loadNewBenef() {
  if (typeof db === 'undefined') return;
  try {
    const snap = await db.collection('org_new_benef').get();
    if (snap.empty) return;

    const nomsExistants = new Set(BENEFICIAIRES.map(b => b.nom));
    let nbAjoutes = 0;

    snap.forEach(doc => {
      const data = doc.data();
      /* Ignorer les champs Firestore et les bénéficiaires déjà chargés */
      const { addedBy, addedAt, ...benef } = data;
      if (!nomsExistants.has(benef.nom)) {
        BENEFICIAIRES.push(benef);
        nomsExistants.add(benef.nom);
        nbAjoutes++;
      }
    });

    if (nbAjoutes > 0) {
      console.log(`[Sync] ✅ ${nbAjoutes} nouveau(x) bénéficiaire(s) chargé(s) depuis Firestore`);
    }
  } catch(e) {
    /* Fallback localStorage */
    const local = JSON.parse(localStorage.getItem('ea_new_benef') || '[]');
    if (local.length) {
      const nomsExistants = new Set(BENEFICIAIRES.map(b => b.nom));
      local.forEach(b => {
        if (!nomsExistants.has(b.nom)) {
          BENEFICIAIRES.push(b);
          nomsExistants.add(b.nom);
        }
      });
      console.log(`[Sync] Nouveaux bénéficiaires chargés depuis localStorage (fallback)`);
    }
    if (e.code !== 'permission-denied') {
      console.warn('[Sync] _loadNewBenef :', e.code || e.message);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   SYNC DES CLÉS TABLEAU (arrays)
══════════════════════════════════════════════════════════ */

/**
 * Synchronise une clé tableau avec Firestore.
 * Fusionne si les deux côtés ont des données.
 */
async function _syncKey(key) {
  try {
    const doc = await _docRef(key).get();

    const cloudData = doc.exists ? (doc.data().items || []) : [];
    const localRaw  = localStorage.getItem(key);
    const localData = localRaw ? JSON.parse(localRaw) : [];

    const cloudCount = cloudData.length;
    const localCount = localData.length;

    if (cloudCount === 0 && localCount === 0) return;

    if (cloudCount === 0 && localCount > 0) {
      /* A) Migration UP */
      console.log(`[Sync] UP ${key} : ${localCount} entrées locales → Firestore`);
      _pushToFirestore(key, localData);
      return;
    }

    if (cloudCount > 0 && localCount === 0) {
      /* B) Pull DOWN */
      console.log(`[Sync] DOWN ${key} : ${cloudCount} entrées cloud → localStorage`);
      localStorage.setItem(key, JSON.stringify(cloudData));
      return;
    }

    /* C) Fusion */
    const merged = _mergeArrays(localData, cloudData);
    console.log(`[Sync] Fusion ${key} : ${localCount} + ${cloudCount} → ${merged.length}`);
    localStorage.setItem(key, JSON.stringify(merged));
    _pushToFirestore(key, merged);

  } catch(e) {
    if (e.code === 'permission-denied') {
      console.error('[Sync] ❌ Règles Firestore manquantes pour :', key,
        '\n→ Firebase Console → Firestore → Règles → ajouter accès users/{uid}/data/{doc}');
    } else {
      console.warn(`[Sync] ⚠️ Erreur sync [${key}] :`, e.code || e.message);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   SYNC DES CLÉS DICT (objects)
══════════════════════════════════════════════════════════ */

/**
 * Synchronise une clé objet (dict) avec Firestore.
 * Le cloud est prioritaire (remplace le local si présent).
 */
async function _syncDictKey(key) {
  try {
    const doc = await _docRef(key).get();

    const cloudData = doc.exists ? (doc.data().items || null) : null;
    const localRaw  = localStorage.getItem(key);
    const localData = localRaw ? JSON.parse(localRaw) : null;

    if (!cloudData && !localData) return;

    if (!cloudData && localData) {
      /* Migration UP */
      console.log(`[Sync] UP dict ${key}`);
      _pushToFirestore(key, localData);
      return;
    }

    if (cloudData && !localData) {
      /* Pull DOWN */
      console.log(`[Sync] DOWN dict ${key}`);
      localStorage.setItem(key, JSON.stringify(cloudData));
      return;
    }

    /* Fusion : merger les deux dicts (cloud prioritaire) */
    const merged = Object.assign({}, localData, cloudData);
    localStorage.setItem(key, JSON.stringify(merged));
    _pushToFirestore(key, merged);
    console.log(`[Sync] Fusion dict ${key}`);

  } catch(e) {
    console.warn(`[Sync] ⚠️ Erreur sync dict [${key}] :`, e.code || e.message);
  }
}

/* ══════════════════════════════════════════════════════════
   POINT D'ENTRÉE PRINCIPAL
══════════════════════════════════════════════════════════ */

/**
 * Initialise la synchronisation complète au démarrage du dashboard.
 * Appelée depuis window.onload dans dashboard.html (déjà câblé ligne 6932).
 *
 * Timeout 8s : si Firestore ne répond pas → on continue avec localStorage.
 * @param {string} uid - UID Firebase de l'utilisateur connecté
 */
async function initSync(uid) {
  _syncUid = uid;

  if (typeof db === 'undefined') {
    console.warn('[Sync] db non disponible — mode localStorage uniquement');
    return;
  }

  console.log('[Sync] 🚀 Démarrage synchronisation Firestore — uid :', uid);

  /* ── Timer de sécurité 8 secondes ── */
  let _timeoutId;
  const timeoutPromise = new Promise(resolve => {
    _timeoutId = setTimeout(() => {
      console.warn('[Sync] ⏱ Timeout 8s — on continue avec les données locales');
      resolve();
    }, 8000);
  });

  /* ── Synchronisation complète ── */
  const syncPromise = (async () => {

    /* 1. Clés tableau : presences, notes, suivis, rapports, alertes... */
    await Promise.all(SYNC_KEYS_ARR.map(key => _syncKey(key)));

    /* 2. Clés dict : pei_statuses */
    await Promise.all(SYNC_KEYS_DICT.map(key => _syncDictKey(key)));

    /* 3. Bundles de clés dynamiques nombreuses */
    await Promise.all([
      _syncBundle('ea_pei_full_',  'ea_pei_full_bundle'),   /* Domaines PEI par bénéficiaire */
      _syncBundle('ea_ta9_',       'ea_ta9_bundle'),         /* Évaluations ABLLS */
      _syncBundle('ea_gh_',        'ea_gh_bundle'),          /* Feuilles de ghiyab */
      _syncBundle('ea_watha2iq_',  'ea_watha2iq_bundle'),    /* Notes documents */
    ]);

    /* 4. Nouveaux bénéficiaires ajoutés via formulaire */
    await _loadNewBenef();

    console.log('[Sync] ✅ Synchronisation complète terminée');
  })();

  /* Race : sync OU timeout */
  await Promise.race([syncPromise, timeoutPromise]);
  clearTimeout(_timeoutId);
}

/* ══════════════════════════════════════════════════════════
   RÈGLES FIRESTORE RECOMMANDÉES
   À copier dans Firebase Console → Firestore → Règles
══════════════════════════════════════════════════════════
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Données personnelles par utilisateur
       match /users/{uid}/{col}/{doc=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       // Nouveaux bénéficiaires — tous les utilisateurs auth
       match /org_new_benef/{doc} {
         allow read, write: if request.auth != null;
       }
       // Journal d'audit — tous les utilisateurs auth
       match /audit_logs/{doc} {
         allow read, write: if request.auth != null;
       }
     }
   }
══════════════════════════════════════════════════════════ */

console.log('[Sync] Module chargé ✓ — v2.0 CRITIQUE 2');
