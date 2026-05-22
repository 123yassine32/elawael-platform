/* ═══════════════════════════════════════════════════════════════════
   MODULE CADRES — ElAwail Digital Platform
   Fichier  : js/data/cadres.js
   Rôle     : CRUD cadres encadrants — chargement et synchronisation Firestore
   Standard : CLAUDE.md §7 Architecture

   COLLECTION FIRESTORE :
     cadres/{uid}
       - teacherId  : string  (identifiant unique cadre, ex: "ahjam")
       - name       : string  (nom complet)
       - email      : string  (email Firebase Auth)
       - classe     : string  (classe principale encadrée)
       - tel        : string  (téléphone professionnel)
       - specialite : string  (domaine de compétence)
       - dateEntree : string  (date d'entrée dans l'association)
       - statut     : string  ("actif" | "inactif" | "congé")
       - _updatedAt : timestamp

   ACCÈS PAR RÔLE :
     ADMIN / GESTIONNAIRE → tous les cadres (lecture + écriture)
     CONSULTANT           → lecture seule (PII masqués)
     EDUCATEUR            → ses propres données uniquement

   NOTE : Implémentation complète dans dashboard.html (monolithe).
          Ce fichier documente l'interface du module pour le PFE.
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Constantes ────────────────────────────────────────────────────── */

const CADRES_COLLECTION = 'cadres';

/* ── Champs PII des cadres (masqués pour CONSULTANT) ─────────────── */
const CADRES_PII_FIELDS = ['tel', 'email', 'dateEntree'];

/* ── Champs publics (visibles pour tous les rôles auth) ──────────── */
const CADRES_PUBLIC_FIELDS = ['teacherId', 'name', 'classe', 'specialite', 'statut'];

/* ── Interface du module ─────────────────────────────────────────── */

/**
 * Charge tous les cadres depuis Firestore et les synchronise avec
 * le tableau USERS en mémoire.
 *
 * @param {string} role      — Rôle de l'utilisateur connecté
 * @param {string} teacherId — teacherId de l'éducateur (si role = EDUCATEUR)
 * @returns {Promise<void>}
 */
/* function loadCadres(role, teacherId) { ... } */

/**
 * Sauvegarde les données d'un cadre dans Firestore.
 *
 * @param {object} cadre — Objet cadre (doit avoir teacherId)
 * @returns {Promise<boolean>} true si succès
 */
/* function saveCadre(cadre) { ... } */

/**
 * Supprime un cadre de Firestore (ADMIN uniquement).
 * L'opération est auditée automatiquement.
 *
 * @param {string} teacherId — ID du cadre à supprimer
 * @returns {Promise<boolean>} true si succès
 */
/* function deleteCadre(teacherId) { ... } */

/* ── Métadonnées du module ─────────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.ElAwailCadres = {
    version:       '3.5.0',
    collection:    CADRES_COLLECTION,
    piiFields:     CADRES_PII_FIELDS,
    publicFields:  CADRES_PUBLIC_FIELDS,
    roles_ecriture: ['ADMIN', 'GESTIONNAIRE'],
    roles_lecture:  ['ADMIN', 'GESTIONNAIRE', 'CONSULTANT', 'EDUCATEUR']
  };
}

console.log('[Cadres] js/data/cadres.js v3.5.0 chargé ✓');
