/* ═══════════════════════════════════════════════════════════════════
   MODULE DOCUMENTS — ElAwail Digital Platform
   Fichier  : js/features/documents.js
   Rôle     : Upload / download des pièces justificatives bénéficiaires
   Standard : CLAUDE.md §7 Architecture

   STOCKAGE :
   ┌─────────────────────────────────────────────────────────────┐
   │  Firebase Storage :                                         │
   │    beneficiaires/{teacherId}/{nomBenef}/{filename}          │
   │                                                             │
   │  Firestore (métadonnées) :                                  │
   │    documents/{docId}                                        │
   │      - benefNom   : string  (clé de jointure)              │
   │      - teacherId  : string                                  │
   │      - filename   : string                                  │
   │      - type       : string  (CIN | médical | PEI | autre)  │
   │      - url        : string  (URL de téléchargement signé)   │
   │      - taille     : number  (en octets)                     │
   │      - uploadedBy : string  (email utilisateur)             │
   │      - _uploadedAt: timestamp                               │
   └─────────────────────────────────────────────────────────────┘

   TYPES DE DOCUMENTS :
   ┌──────────────┬────────────────────────────────────────────┐
   │ CIN          │ Carte d'identité nationale                 │
   │ medical      │ Certificat médical / diagnostic            │
   │ pei          │ Document PEI (Plan Éducatif Individualisé) │
   │ autorisation │ Autorisation parentale                     │
   │ photo        │ Photo d'identité                           │
   │ autre        │ Tout autre document                        │
   └──────────────┴────────────────────────────────────────────┘

   ACCÈS PAR RÔLE :
     ADMIN / GESTIONNAIRE → upload + download + suppression
     EDUCATEUR            → upload + download (ses bénéficiaires)
     CONSULTANT           → lecture seule (pas d'accès aux documents médicaux)

   SÉCURITÉ Firebase Storage Rules :
     - Authentification obligatoire
     - Taille max : 10 MB par fichier
     - Types autorisés : pdf, jpg, jpeg, png, doc, docx

   NOTE : Implémentation complète dans dashboard.html (monolithe).
          Ce fichier documente l'interface du module pour le PFE.
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Constantes ────────────────────────────────────────────────────── */

const DOC_MAX_SIZE_MB = 10;
const DOC_TYPES_ALLOWED = ['application/pdf', 'image/jpeg', 'image/png',
                           'image/jpg', 'application/msword',
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/* ── Interface du module ─────────────────────────────────────────── */

/**
 * Ouvre le dialogue d'upload et envoie un fichier vers Firebase Storage.
 * Affiche une barre de progression et un toast de confirmation.
 *
 * @param {string} benefNom   — Nom du bénéficiaire
 * @param {string} teacherId  — ID du cadre encadrant
 * @param {string} type       — Type de document (CIN, medical, etc.)
 * @returns {Promise<string|null>} URL du fichier uploadé, ou null si annulé
 *
 * @example
 *   uploadDocument('Ahmed El Fassi', 'ahjam', 'medical');
 */
/* function uploadDocument(benefNom, teacherId, type) { ... } */

/**
 * Télécharge un document depuis Firebase Storage.
 * Déclenche le téléchargement navigateur directement.
 *
 * @param {string} url      — URL Firebase Storage
 * @param {string} filename — Nom du fichier suggéré
 */
/* function downloadDocument(url, filename) { ... } */

/**
 * Supprime un document de Firebase Storage et de Firestore.
 * ADMIN et GESTIONNAIRE uniquement.
 *
 * @param {string} docId  — ID du document dans Firestore
 * @param {string} url    — URL Firebase Storage à supprimer
 * @returns {Promise<boolean>} true si succès
 */
/* function deleteDocument(docId, url) { ... } */

/**
 * Charge la liste des documents d'un bénéficiaire.
 *
 * @param {string} benefNom  — Nom du bénéficiaire
 * @param {string} teacherId — ID du cadre encadrant
 * @returns {Promise<Array>} liste des documents avec métadonnées
 */
/* function listDocuments(benefNom, teacherId) { ... } */

/**
 * Rend le panel documents dans la fiche bénéficiaire.
 * Affiche la liste, les boutons upload/download/supprimer.
 *
 * @param {string} benefNom  — Nom du bénéficiaire
 * @param {string} teacherId — ID du cadre
 * @param {string} containerId — ID du conteneur DOM cible
 */
/* function renderDocuments(benefNom, teacherId, containerId) { ... } */

/* ── Métadonnées du module ─────────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.ElAwailDocuments = {
    version:       '3.5.0',
    stockage:      'Firebase Storage',
    maxSizeMB:     DOC_MAX_SIZE_MB,
    typesAutorisés: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    typesDocuments: ['CIN', 'medical', 'pei', 'autorisation', 'photo', 'autre'],
    roles_upload:   ['ADMIN', 'GESTIONNAIRE', 'EDUCATEUR'],
    roles_delete:   ['ADMIN', 'GESTIONNAIRE']
  };
}

console.log('[Documents] js/features/documents.js v3.5.0 chargé ✓');
