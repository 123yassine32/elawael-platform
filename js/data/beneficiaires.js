/* ═══════════════════════════════════════════════════════════════════
   BENEFICIAIRES — Chargement Firestore & Migration automatique
   Fichier : js/data/beneficiaires.js  —  v3.5.1
   ───────────────────────────────────────────────────────────────────
   OBJECTIF :
     Sécuriser les données PII (handicap, tel, ddn, age) en les
     stockant dans Firestore au lieu du HTML public.

   FLOW :
     1. Première connexion ADMIN → migration automatique des données
        codées en dur vers la collection Firestore `beneficiaires/`
     2. Chaque connexion → chargement depuis Firestore + enrichissement
        du tableau BENEFICIAIRES en mémoire (overlay)
     3. En cas d'erreur Firestore → fallback silencieux sur les données
        locales (compatibilité descendante garantie)

   COLLECTION FIRESTORE :
     beneficiaires/{id}
       - nom       : string  (clé de jointure)
       - teacherId : string
       - handicap  : string  (diagnostic médical)
       - ddn       : string  (date de naissance)
       - tel       : string  (téléphone tuteur)
       - sexe      : string
       - age       : number
       - tuteur    : string  (nom tuteur légal)
       - adresse   : string
       - _migratedAt : timestamp
       - _updatedAt  : timestamp

   ACCÈS PAR RÔLE :
     ADMIN / GESTIONNAIRE → tous les bénéficiaires
     EDUCATEUR            → uniquement ses propres bénéficiaires
     CONSULTANT           → tous (PII masqués côté client par roles.js)
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Namespace pour éviter les conflits ── */
const EaBenefModule = (function () {

  /* ──────────────────────────────────────────
     CONSTANTES
  ────────────────────────────────────────── */
  const COLLECTION   = 'beneficiaires';
  const FLAG_KEY     = 'ea_benef_migrated_v1';   /* localStorage — évite re-migration */
  const BATCH_SIZE   = 400;                       /* Firestore : max 500 ops/batch    */
  const TIMEOUT_MS   = 12000;                     /* Timeout chargement Firestore     */

  /* Champs PII à extraire du tableau BENEFICIAIRES et à stocker dans Firestore */
  const PII_FIELDS   = ['handicap', 'ddn', 'tel', 'sexe', 'age', 'tuteur', 'adresse'];

  /* Champs non-PII à conserver dans le HTML (utilisés pour la navigation et les filtres) */
  const SAFE_FIELDS  = ['nom', 'nomLatin', 'teacherId', 'type', 'niveau', 'niv_label',
                        'dossier', 's1_dossier', 'pei_domaines',
                        'theo_s1', 'prat_s1', 'theo_s2', 'prat_s2',
                        'theo_rep', 'prat_rep', 'classe'];

  /* ──────────────────────────────────────────
     UTILITAIRES
  ────────────────────────────────────────── */

  /**
   * Génère un ID Firestore stable à partir de teacherId + nom.
   * Ex: "ahjam_siraj_el_bakkali"
   */
  function makeDocId(teacherId, nom) {
    const clean = (s) => (s || '')
      .toLowerCase()
      .replace(/[أإآ]/g, 'a')
      .replace(/[ًَُِّْ]/g, '')       /* harakat */
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 60);
    return clean(teacherId) + '_' + clean(nom);
  }

  /**
   * Retourne une promesse qui timeout après ms milliseconds.
   */
  function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout Firestore ' + ms + 'ms')), ms)
    );
    return Promise.race([promise, timeout]);
  }

  /**
   * Log conditionnel (désactivé en production si window.EA_DEBUG !== true).
   */
  function log(msg, data) {
    if (window.EA_DEBUG || window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
      if (data !== undefined) console.log('[Benef]', msg, data);
      else                    console.log('[Benef]', msg);
    }
  }

  /* ──────────────────────────────────────────
     MIGRATION — Première connexion ADMIN
  ────────────────────────────────────────── */

  /**
   * Migre les données PII du tableau BENEFICIAIRES (HTML) vers Firestore.
   * Opération idempotente — utilise set() avec merge:true.
   * Déclenchée uniquement si :
   *   - rôle === ADMIN
   *   - localStorage FLAG_KEY absent (évite re-migration à chaque connexion)
   *   - La collection Firestore est vide
   */
  async function migrateIfNeeded(role) {
    /* Seul l'ADMIN peut migrer */
    if (!role || role.toUpperCase() !== 'ADMIN') return;

    /* Déjà migré lors d'une session précédente ? */
    if (localStorage.getItem(FLAG_KEY) === '1') {
      log('Migration déjà effectuée (flag localStorage présent)');
      return;
    }

    /* Vérifier si la collection est vide dans Firestore */
    try {
      const snap = await withTimeout(
        db.collection(COLLECTION).limit(1).get(),
        5000
      );
      if (!snap.empty) {
        /* Collection non vide → marquer comme migré */
        localStorage.setItem(FLAG_KEY, '1');
        log('Collection Firestore non vide — migration ignorée');
        return;
      }
    } catch (e) {
      console.warn('[Benef] Impossible de vérifier la collection :', e.message);
      return; /* Ne pas bloquer l'expérience si Firestore inaccessible */
    }

    /* Récupérer BENEFICIAIRES depuis le contexte global */
    const source = window.BENEFICIAIRES;
    if (!Array.isArray(source) || source.length === 0) {
      console.warn('[Benef] BENEFICIAIRES introuvable ou vide — migration annulée');
      return;
    }

    console.info('[Benef] Démarrage migration', source.length, 'bénéficiaires → Firestore…');
    const ts = firebase.firestore.FieldValue.serverTimestamp();
    let migrated = 0;
    let errors   = 0;

    try {
      /* Découper en batches de BATCH_SIZE */
      for (let i = 0; i < source.length; i += BATCH_SIZE) {
        const chunk = source.slice(i, i + BATCH_SIZE);
        const batch = db.batch();

        chunk.forEach(b => {
          if (!b || !b.nom || !b.teacherId) return;

          const docId  = makeDocId(b.teacherId, b.nom);
          const docRef = db.collection(COLLECTION).doc(docId);

          /* Extraire uniquement les champs PII + identifiants */
          const data = {
            nom:       b.nom,
            teacherId: b.teacherId,
            _migratedAt: ts,
            _updatedAt:  ts
          };
          PII_FIELDS.forEach(f => {
            if (b[f] !== undefined && b[f] !== null) data[f] = b[f];
          });

          batch.set(docRef, data, { merge: true });
          migrated++;
        });

        await withTimeout(batch.commit(), 10000);
        log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${migrated} docs écrits`);
      }

      /* Marquer la migration comme terminée */
      localStorage.setItem(FLAG_KEY, '1');
      console.info('[Benef] ✅ Migration terminée —', migrated, 'bénéficiaires → Firestore');

    } catch (e) {
      errors++;
      console.error('[Benef] ❌ Erreur migration :', e);
      /* Ne pas marquer FLAG_KEY → la migration retentée à la prochaine connexion */
    }
  }

  /* ──────────────────────────────────────────
     CHARGEMENT — Enrichissement depuis Firestore
  ────────────────────────────────────────── */

  /**
   * Charge les données PII depuis Firestore et les fusionne dans BENEFICIAIRES.
   * Chaque entrée du tableau BENEFICIAIRES en mémoire est enrichie des champs
   * stockés dans Firestore (overlay non-destructif).
   *
   * @param {string} uid    UID Firebase de l'utilisateur connecté
   * @param {string} role   Rôle : ADMIN | GESTIONNAIRE | CONSULTANT | EDUCATEUR
   * @param {string} [teacherId]  teacherId de l'éducateur (requis si role === EDUCATEUR)
   */
  async function loadAndEnrich(uid, role, teacherId) {
    const target = window.BENEFICIAIRES;
    if (!Array.isArray(target)) {
      console.warn('[Benef] BENEFICIAIRES introuvable — chargement ignoré');
      return;
    }

    try {
      let query;
      const r = (role || '').toUpperCase();

      if (r === 'EDUCATEUR' && teacherId) {
        /* L'éducateur ne charge que SES bénéficiaires */
        query = db.collection(COLLECTION)
                  .where('teacherId', '==', teacherId);
      } else if (['ADMIN', 'GESTIONNAIRE', 'CONSULTANT'].includes(r)) {
        /* Les rôles supérieurs voient tout */
        query = db.collection(COLLECTION);
      } else {
        /* Rôle inconnu → charger ses propres données seulement */
        if (!teacherId) return;
        query = db.collection(COLLECTION)
                  .where('teacherId', '==', teacherId);
      }

      const snap = await withTimeout(query.get(), TIMEOUT_MS);

      if (snap.empty) {
        log('Aucune donnée Firestore trouvée — données locales conservées');
        return;
      }

      /* Construire un Map {teacherId+'_'+nom → data} pour la fusion */
      const firestoreMap = new Map();
      snap.forEach(doc => {
        const d = doc.data();
        if (d.nom && d.teacherId) {
          firestoreMap.set(d.teacherId + '||' + d.nom, d);
        }
      });

      /* Enrichir chaque entrée de BENEFICIAIRES */
      let enriched = 0;
      target.forEach(b => {
        if (!b || !b.nom || !b.teacherId) return;
        const key  = b.teacherId + '||' + b.nom;
        const data = firestoreMap.get(key);
        if (!data) return;

        /* Overlay : Firestore écrase les champs PII locaux */
        PII_FIELDS.forEach(f => {
          if (data[f] !== undefined) b[f] = data[f];
        });
        enriched++;
      });

      log(`Enrichissement terminé — ${enriched}/${target.length} bénéficiaires mis à jour depuis Firestore`);

      /* Signaler que les données sont prêtes */
      window.dispatchEvent(new CustomEvent('ea:beneficiaires-loaded', {
        detail: { count: enriched, role: role }
      }));

    } catch (e) {
      console.warn('[Benef] Impossible de charger depuis Firestore :', e.message,
                   '— données locales conservées en fallback');
    }
  }

  /* ──────────────────────────────────────────
     SAUVEGARDE — Mise à jour d'un bénéficiaire
  ────────────────────────────────────────── */

  /**
   * Sauvegarde les champs PII d'un bénéficiaire dans Firestore.
   * Appelée après modification dans l'interface (formulaire fiche bénéficiaire).
   *
   * @param {Object} benef  Objet bénéficiaire (doit avoir nom + teacherId)
   * @returns {Promise<boolean>} true si succès
   */
  async function saveBeneficiaire(benef) {
    if (!benef || !benef.nom || !benef.teacherId) return false;

    const docId  = makeDocId(benef.teacherId, benef.nom);
    const docRef = db.collection(COLLECTION).doc(docId);

    const data = {
      nom:        benef.nom,
      teacherId:  benef.teacherId,
      _updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    PII_FIELDS.forEach(f => {
      if (benef[f] !== undefined) data[f] = benef[f];
    });

    try {
      await withTimeout(docRef.set(data, { merge: true }), 5000);
      log('Bénéficiaire sauvegardé :', benef.nom);
      return true;
    } catch (e) {
      console.error('[Benef] Erreur sauvegarde :', e);
      return false;
    }
  }

  /* ──────────────────────────────────────────
     POINT D'ENTRÉE PRINCIPAL
  ────────────────────────────────────────── */

  /**
   * Initialise le module bénéficiaires :
   *  1. Migration automatique si ADMIN et collection vide
   *  2. Chargement et enrichissement depuis Firestore
   *
   * @param {string} uid       UID Firebase
   * @param {string} role      Rôle de l'utilisateur
   * @param {string} teacherId teacherId (pour les éducateurs)
   */
  async function init(uid, role, teacherId) {
    if (!uid) return;

    log('init()', { uid: uid.slice(0, 8) + '…', role, teacherId });

    /* Étape 1 : migration si nécessaire (ADMIN seulement) */
    await migrateIfNeeded(role);

    /* Étape 2 : chargement + enrichissement */
    await loadAndEnrich(uid, role, teacherId);
  }

  /* ── API publique ── */
  return {
    init,
    save:         saveBeneficiaire,
    loadAndEnrich,
    migrateIfNeeded,
    makeDocId
  };

})();

/* ── Alias global pour appel simple depuis dashboard.html ── */
function initBeneficiaires(uid, role, teacherId) {
  return EaBenefModule.init(uid, role, teacherId);
}

function saveBeneficiaireFirestore(benef) {
  return EaBenefModule.save(benef);
}

console.log('[Benef] js/data/beneficiaires.js v3.5.1 chargé ✓');
