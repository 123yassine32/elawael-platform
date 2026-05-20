/* ═══════════════════════════════════════════════════════════
   SYNCHRONISATION FIRESTORE — ElAwail Digital Platform
   Fichier : js/data/sync.js   v3.5.1

   Chemin unifié : userData/{uid}/keys/{clé}
   (aligné avec _pushToFirestore et saveData de dashboard.html)

   Responsabilités de ce fichier :
     ┌───────────────────────────────────────────────────────┐
     │ initSync(uid)     → lecture Firestore au démarrage    │
     │ syncSchedule()    → push debounced (PEI, ABLLS…)     │
     │ _syncBundle()     → bundles de clés dynamiques        │
     │ _loadNewBenef()   → nouveaux bénéficiaires (Firestore)│
     │ syncSaveNewBenef()→ sauvegarder un nouveau bénéf.     │
     └───────────────────────────────────────────────────────┘

   NOTE : _pushToFirestore et saveData sont dans dashboard.html.
          Ce module ne redéfinit pas ces fonctions pour éviter
          tout conflit de chemin Firestore.
═══════════════════════════════════════════════════════════ */

'use strict';

/* UID courant — défini dans initSync() */
let _syncUid = null;

/* Timer de debounce pour syncSchedule() */
let _syncDebounceTimers = {};

/* ══════════════════════════════════════════════════════════
   CHEMINS FIRESTORE
══════════════════════════════════════════════════════════ */

/**
 * Chemin pour les bundles de clés dynamiques.
 * (ea_pei_full_*, ea_ta9_*, ea_gh_*, ea_watha2iq_*)
 */
function _bundleRef(bundleName) {
  return db.collection('userData').doc(_syncUid).collection('bundles').doc(bundleName);
}

/* ══════════════════════════════════════════════════════════
   UTILITAIRES BUNDLE
══════════════════════════════════════════════════════════ */

/**
 * Lit depuis localStorage toutes les clés correspondant à un préfixe.
 * @param {string} prefix - ex: 'ea_pei_full_'
 * @returns {object} { clé: valeur }
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
 * @param {object} bundle
 */
function _applyBundle(bundle) {
  if (!bundle) return;
  Object.entries(bundle).forEach(([k, v]) => {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch(e) { console.warn('[Sync] Erreur écriture bundle :', k); }
  });
}

/**
 * Synchronise un bundle de clés dynamiques (push si local, pull si cloud, fusion sinon).
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
      console.log(`[Sync] Bundle UP [${bundleName}] : ${localCount} clés → Firestore`);
      _bundleRef(bundleName).set({
        bundle: localBundle,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.warn('[Sync] Bundle UP échoué :', bundleName, e.code));
      return;
    }

    if (cloudCount > 0 && localCount === 0) {
      console.log(`[Sync] Bundle DOWN [${bundleName}] : ${cloudCount} clés → localStorage`);
      _applyBundle(cloudBundle);
      return;
    }

    /* Fusion : cloud prioritaire pour les clés existantes */
    const merged = Object.assign({}, localBundle, cloudBundle);
    _applyBundle(merged);
    _bundleRef(bundleName).set({
      bundle: merged,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('[Sync] Bundle fusion push échoué :', bundleName, e.code));
    console.log(`[Sync] Bundle fusion [${bundleName}] : ${localCount} local + ${cloudCount} cloud`);

  } catch(e) {
    if (e.code !== 'permission-denied') {
      console.warn(`[Sync] Bundle sync échoué [${bundleName}] :`, e.code || e.message);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   NOUVEAUX BÉNÉFICIAIRES
══════════════════════════════════════════════════════════ */

/**
 * Sauvegarde un nouveau bénéficiaire dans Firestore (org_new_benef).
 * Appelée depuis adminSaveNewBenef() dans dashboard.html.
 * @param {object} benef - Objet bénéficiaire
 */
function syncSaveNewBenef(benef) {
  if (!_syncUid || typeof db === 'undefined') return;

  const { theo_s1, prat_s1, theo_s2, prat_s2, theo_rep, prat_rep, ...coreData } = benef;
  const nomNorm = (benef.nom || '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9؀-ۿ_]/g, '');
  const docId   = nomNorm + '_' + Date.now();

  db.collection('org_new_benef').doc(docId)
    .set({ ...coreData, addedBy: _syncUid, addedAt: firebase.firestore.FieldValue.serverTimestamp() })
    .then(() => console.log('[Sync] Nouveau bénéficiaire sauvegardé :', benef.nom))
    .catch(e => {
      console.warn('[Sync] Erreur sauvegarde bénéficiaire :', e.code);
      /* Fallback localStorage */
      const existing = JSON.parse(localStorage.getItem('ea_new_benef') || '[]');
      existing.push({ ...coreData, _savedAt: new Date().toISOString() });
      localStorage.setItem('ea_new_benef', JSON.stringify(existing));
    });
}

/**
 * Charge les nouveaux bénéficiaires depuis Firestore et les ajoute à BENEFICIAIRES.
 */
async function _loadNewBenef() {
  if (typeof db === 'undefined') return;
  try {
    const snap = await db.collection('org_new_benef').get();
    if (snap.empty) return;

    const nomsExistants = new Set(
      (typeof BENEFICIAIRES !== 'undefined' ? BENEFICIAIRES : []).map(b => b.nom)
    );
    let nbAjoutes = 0;

    snap.forEach(doc => {
      const { addedBy, addedAt, ...benef } = doc.data();
      if (!nomsExistants.has(benef.nom)) {
        if (typeof BENEFICIAIRES !== 'undefined') BENEFICIAIRES.push(benef);
        nomsExistants.add(benef.nom);
        nbAjoutes++;
      }
    });

    if (nbAjoutes > 0) console.log(`[Sync] ${nbAjoutes} nouveau(x) bénéficiaire(s) chargé(s)`);

  } catch(e) {
    /* Fallback localStorage */
    const local = JSON.parse(localStorage.getItem('ea_new_benef') || '[]');
    if (local.length && typeof BENEFICIAIRES !== 'undefined') {
      const nomsExistants = new Set(BENEFICIAIRES.map(b => b.nom));
      local.forEach(b => {
        if (!nomsExistants.has(b.nom)) { BENEFICIAIRES.push(b); nomsExistants.add(b.nom); }
      });
    }
    if (e.code && e.code !== 'permission-denied') {
      console.warn('[Sync] _loadNewBenef :', e.code || e.message);
    }
  }
}

/* ══════════════════════════════════════════════════════════
   PUSH DEBOUNCED (pour PEI, ABLLS, etc.)
══════════════════════════════════════════════════════════ */

/**
 * Version debounced de _pushToFirestore — évite les appels répétés.
 * Utilisée par savePEIStatus(), savePEIFullDomaines() dans dashboard.html.
 * Appelle _pushToFirestore qui est défini dans dashboard.html
 * (chemin : userData/{uid}/keys/{key}).
 * @param {string} key   - Clé à synchroniser
 * @param {*}      data  - Valeur à écrire
 * @param {number} delay - Délai en ms (défaut : 2000)
 */
function syncSchedule(key, data, delay) {
  if (!_syncUid || typeof _pushToFirestore === 'undefined') return;
  clearTimeout(_syncDebounceTimers[key]);
  _syncDebounceTimers[key] = setTimeout(() => {
    _pushToFirestore(key, data);
    delete _syncDebounceTimers[key];
  }, delay || 2000);
}

/* ══════════════════════════════════════════════════════════
   POINT D'ENTRÉE PRINCIPAL
══════════════════════════════════════════════════════════ */

/**
 * Initialise la synchronisation complète au démarrage du dashboard.
 * Appelée depuis window.onload dans dashboard.html.
 *
 * Stratégie :
 *   1. Lire toutes les clés depuis userData/{uid}/keys/ (cloud → localStorage)
 *   2. Synchroniser les bundles de clés dynamiques
 *   3. Charger les nouveaux bénéficiaires depuis org_new_benef
 *   Timeout 8s : si Firestore ne répond pas → on continue avec localStorage.
 *
 * @param {string} uid - UID Firebase de l'utilisateur connecté
 */
async function initSync(uid) {
  _syncUid = uid;

  if (typeof db === 'undefined' || !uid) {
    console.warn('[Sync] db non disponible — mode localStorage uniquement');
    document.dispatchEvent(new CustomEvent('ea:firebase-ready'));
    return;
  }

  console.log('[Sync] Démarrage synchronisation Firestore — uid :', uid);

  /* Timer de sécurité 8 secondes */
  let _timeoutId;
  const timeoutPromise = new Promise(resolve => {
    _timeoutId = setTimeout(() => {
      console.warn('[Sync] Timeout 8s — on continue avec les données locales');
      document.dispatchEvent(new CustomEvent('ea:firebase-ready'));
      resolve();
    }, 8000);
  });

  const syncPromise = (async () => {
    try {
      /* ── 1. Clés scalaires : userData/{uid}/keys/ ── */
      const snap = await db.collection('userData').doc(uid).collection('keys').get();
      let loaded = 0;

      if (snap && !snap.empty) {
        snap.forEach(doc => {
          const key  = doc.id;
          const data = doc.data();
          if (!data || !data.value) return;
          try {
            const cloudTs  = data.updatedAt || '';
            const localRaw = localStorage.getItem(key);
            let   localTs  = '';
            if (localRaw) {
              try {
                const arr = JSON.parse(localRaw);
                if (Array.isArray(arr) && arr.length && arr[0] && arr[0].date) {
                  localTs = arr.map(x => x.date || '').sort().reverse()[0] || '';
                }
              } catch(e) { /* JSON invalide */ }
            }
            /* Cloud prioritaire si plus récent ou si localStorage vide */
            if (!localRaw || cloudTs > localTs) {
              localStorage.setItem(key, data.value);
              loaded++;
            }
          } catch(e) { /* ignore */ }
        });

        if (loaded > 0) {
          localStorage.setItem('ea_sync_ts', Date.now().toString());
          console.log('[Sync] Chargé depuis Firestore :', loaded, 'clé(s)');
        }
      }

      /* ── 2. Bundles de clés dynamiques ── */
      await Promise.all([
        _syncBundle('ea_pei_full_',  'ea_pei_full_bundle'),
        _syncBundle('ea_ta9_',       'ea_ta9_bundle'),
        _syncBundle('ea_gh_',        'ea_gh_bundle'),
        _syncBundle('ea_watha2iq_',  'ea_watha2iq_bundle'),
      ]);

      /* ── 3. Nouveaux bénéficiaires ajoutés via formulaire ── */
      await _loadNewBenef();

      localStorage.setItem('ea_sync_ts', Date.now().toString());
      console.log('[Sync] Synchronisation complète terminée');

    } catch(e) {
      const code = e && e.code ? e.code : '';
      if (code !== 'permission-denied' && code !== 'unavailable') {
        console.warn('[Sync] Erreur synchronisation :', e.message || e);
      } else if (code === 'permission-denied') {
        console.error('[Sync] RÈGLES FIRESTORE manquantes — vérifier Firebase Console\n' +
          '→ Ajouter : match /userData/{uid}/{col}/{doc=**} { allow read,write: if request.auth.uid == uid; }');
      }
    }

    document.dispatchEvent(new CustomEvent('ea:firebase-ready'));
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

       // Données personnelles par utilisateur (clés + bundles)
       match /userData/{uid}/{col}/{doc=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }

       // Profils utilisateurs
       match /users/{uid} {
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

console.log('[Sync] Module chargé v3.5.1 — chemin unifié userData/{uid}/keys/');
