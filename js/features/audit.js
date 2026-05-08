/* ═══════════════════════════════════════════════════════════════════
   MODULE AUDIT — ElAwail Digital Platform
   Fichier  : js/features/audit.js
   Rôle     : Journal d'audit complet — Traçabilité totale des actions
   Standard : CLAUDE.md §5 Module 4 / Sécurité maximale

   ARCHITECTURE :
   ┌───────────────────────────────────────────────────────────┐
   │  auditLog(type, action, detail)                           │
   │    ├─ Stocke dans localStorage (ea_audit_logs)           │
   │    └─ Synchronise vers Firestore (audit_logs/{doc})      │
   │                                                           │
   │  Chaque entrée du journal :                               │
   │  {                                                        │
   │    ts:     timestamp ISO 8601                            │
   │    user:   email de l'utilisateur connecté               │
   │    type:   clé de AUDIT_TYPES (connexion, benef, etc.)   │
   │    action: description courte de l'action                │
   │    detail: élément concerné (nom bénéficiaire, etc.)     │
   │  }                                                        │
   └───────────────────────────────────────────────────────────┘

   TYPES D'ACTIONS TRACÉES :
   ┌─────────────────┬──────────────────────────────────────────┐
   │ connexion       │ Connexion / Déconnexion                  │
   │ benef           │ Ajout / Modification / Suppression       │
   │ document        │ Upload / Suppression document            │
   │ export          │ Tout export de données                   │
   │ pei             │ Modification objectifs PEI               │
   │ presence        │ Saisie / Modification présences          │
   │ admin           │ Actions admin (rôles, config)            │
   │ systeme         │ Erreurs, synchronisation                 │
   └─────────────────┴──────────────────────────────────────────┘

   SÉCURITÉ :
   - Règle Firestore : `create` autorisé pour tout utilisateur auth
   - `update` et `delete` interdits → journal IMMUABLE
   - Lecture réservée aux rôles ADMIN et GESTIONNAIRE

   NOTE : Implémentation complète dans dashboard.html (monolithe).
          Ce fichier documente l'interface du module pour le PFE.
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Types d'actions — icônes et libellés bilingues ─────────────── */

/**
 * Dictionnaire des types d'audit.
 * Chaque type a : icon (emoji), label (FR/AR via I18N), color (hex).
 *
 * @type {Object.<string, {icon: string, label: string, color: string}>}
 */
/*
const AUDIT_TYPES = {
  connexion: { icon: '🔑', label: 'Connexion',         color: '#2563eb' },
  benef:     { icon: '👤', label: 'Bénéficiaire',      color: '#7c3aed' },
  document:  { icon: '📄', label: 'Document',          color: '#d97706' },
  export:    { icon: '📥', label: 'Export',            color: '#059669' },
  pei:       { icon: '🎯', label: 'PEI',               color: '#0891b2' },
  presence:  { icon: '📅', label: 'Présence',          color: '#16a34a' },
  admin:     { icon: '🛡️', label: 'Administration',    color: '#dc2626' },
  systeme:   { icon: '⚙️', label: 'Système',           color: '#6b7280' }
};
*/

/* ── Enregistrement d'une action ────────────────────────────────── */

/**
 * Enregistre une entrée dans le journal d'audit.
 * Stockage dual : localStorage (immédiat) + Firestore (asynchrone).
 *
 * @param {string} type   — Clé de AUDIT_TYPES
 * @param {string} action — Description courte (ex: 'Ajout bénéficiaire')
 * @param {string} detail — Élément concerné (ex: nom du bénéficiaire)
 *
 * @example
 *   auditLog('benef', 'Ajout bénéficiaire', 'Youssef El Fassi');
 *   auditLog('export', 'Export Excel membres', 'ElAwail_Membres_08-05-2026.xlsx');
 *   auditLog('connexion', 'Connexion', 'admin@elawail.ma');
 */
/* function auditLog(type, action, detail) { ... } */

/* ── Interface du journal ───────────────────────────────────────── */

/**
 * Initialise et affiche la section journal d'audit.
 * Charge les entrées depuis localStorage, applique les filtres,
 * met à jour les KPIs (total, aujourd'hui, utilisateurs actifs, suppressions).
 */
/* function renderAuditJournal() { ... } */

/**
 * Re-rend la liste filtrée du journal (appelé à chaque changement de filtre).
 * Gère le regroupement par jour avec date bilingue FR/AR.
 */
/* function auditRender() { ... } */

/**
 * Réinitialise tous les filtres du journal.
 */
/* function auditClearFilters() { ... } */

/**
 * Applique un préréglage temporel aux filtres.
 * @param {'today'|'week'|'month'} preset
 */
/* function auditSetPreset(preset) { ... } */

/**
 * Exporte le journal filtré en PDF.
 * @fires téléchargement  Journal_Audit_[date].pdf
 */
/* function auditExportPDF() { ... } */

/* ── Limites du journal ─────────────────────────────────────────── */

/**
 * Nombre maximum d'entrées conservées dans localStorage.
 * Les entrées les plus anciennes sont supprimées au-delà.
 * @constant {number}
 */
const AUDIT_MAX_ENTRIES = 500;

/**
 * Durée de rétention dans localStorage (30 jours).
 * Les entrées Firestore sont conservées indéfiniment.
 * @constant {number}
 */
const AUDIT_RETENTION_DAYS = 30;

/* ── Métadonnées du module ─────────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.ElAwailAudit = {
    version:        '3.5.0',
    stockage:       ['localStorage (ea_audit_logs)', 'Firestore (audit_logs)'],
    immuable:       true,
    maxEntries:     AUDIT_MAX_ENTRIES,
    retentionJours: AUDIT_RETENTION_DAYS,
    roles_lecture:  ['ADMIN', 'GESTIONNAIRE'],
    roles_ecriture: ['ADMIN', 'GESTIONNAIRE', 'EDUCATEUR', 'CONSULTANT']
  };
}
