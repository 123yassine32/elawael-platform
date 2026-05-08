/* ═══════════════════════════════════════════════════════════════════
   MODULE KPI — ElAwail Digital Platform
   Fichier  : js/features/kpi.js
   Rôle     : Score Organisationnel Global + Score de Risque Bénéficiaire
   Standard : Management 4.0 / CLAUDE.md §4 Critiques 4 & 5

   ARCHITECTURE :
   ┌─────────────────────────────────────────────────────┐
   │  calcOrgScore(d, presences) → score 0-100           │
   │    ├─ tauxRealisation  × 35%  (PEI progressif)      │
   │    ├─ tauxPresence     × 25%  (séances + ghiyab)    │
   │    ├─ tauxIndependance × 30%  (ABLLS réel)          │
   │    └─ tauxDossiers     × 10%  (conformité dossiers) │
   │                                                     │
   │  calcRisqueBenef(b, presences) → score 0-100        │
   │    ├─ +40 pts  présence < 50%                       │
   │    ├─ +25 pts  présence 50-70%                      │
   │    ├─ +35 pts  PEI < 30%                            │
   │    ├─ +20 pts  PEI 30-50%                           │
   │    ├─ +15 pts  dossier incomplet                    │
   │    └─ +10 pts  aucune séance ce mois                │
   └─────────────────────────────────────────────────────┘

   NOTE : Implémentation complète dans dashboard.html (monolithe).
          Ce fichier documente l'interface du module pour le PFE.
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/**
 * ════════════════════════════════════════════════════════════════════
 * SCORE ORGANISATIONNEL GLOBAL — Management 4.0
 * ════════════════════════════════════════════════════════════════════
 *
 * @param {object} d         — Résultat de getAdminData()
 * @param {Array}  presences — Tableau ea_presences (loadData)
 * @returns {{
 *   score:            number,   // Score global 0-100
 *   tauxRealisation:  number,   // % PEI réalisé (progressif)
 *   tauxPresence:     number,   // % présence (S2)
 *   tauxIndependance: number,   // % autonomie ABLLS ou niveau moyen
 *   tauxDossiers:     number,   // % dossiers complets
 *   _poids:           object    // { pei, presence, independance, dossiers }
 * }}
 *
 * @example
 *   const d = getAdminData();
 *   const pres = loadData('ea_presences') || [];
 *   const { score, tauxRealisation } = calcOrgScore(d, pres);
 *   // score ∈ [0, 100]
 *   // Excellent ≥ 70 | Bien ≥ 40 | À améliorer < 40
 */
/* function calcOrgScore(d, presences) { ... } */

/**
 * ════════════════════════════════════════════════════════════════════
 * SCORE DE RISQUE BÉNÉFICIAIRE — Alertes pondérées
 * ════════════════════════════════════════════════════════════════════
 *
 * @param {object} b         — Objet bénéficiaire
 * @param {Array}  presences — Tableau ea_presences
 * @returns {{ score: number, raisons: Array<{label, pts}> }}
 *
 * NIVEAUX :
 *   0–30  → 🟢 Stable    (aucune intervention requise)
 *   31–60 → 🟡 Surveiller (suivi renforcé recommandé)
 *   61–100 → 🔴 Urgent   (action immédiate nécessaire)
 */
/* function calcRisqueBenef(b, presences) { ... } */

/**
 * ════════════════════════════════════════════════════════════════════
 * RENDU DES ALERTES DE RISQUE — Section Alertes admin
 * ════════════════════════════════════════════════════════════════════
 * Met à jour le DOM : liste triée par risque décroissant,
 * boutons "Marquer traité" / "Réouvrir", KPIs synthèse.
 */
/* function renderAdminRisques() { ... } */

/**
 * Vide le cache memoïsé des scores de risque.
 * À appeler après toute modification de données (présences, PEI, dossier).
 */
/* function clearRisqueCache() { ... } */

/* ── Exportation pour usage externe (non-module ES5) ──────────────── */
if (typeof window !== 'undefined') {
  window.ElAwailKPI = {
    version: '3.5.0',
    formule: 'PEI×35% + Présence×25% + Indépendance×30% + Dossiers×10%',
    niveaux: {
      excellent:   { min: 70, max: 100, couleur: '#059669', label: 'Excellent'  },
      bien:        { min: 40, max:  69, couleur: '#d97706', label: 'Bien'       },
      ameliorer:   { min:  0, max:  39, couleur: '#dc2626', label: 'À améliorer'}
    },
    risqueNiveaux: {
      stable:      { min:  0, max: 30, couleur: '#059669', label: '🟢 Stable'     },
      surveiller:  { min: 31, max: 60, couleur: '#d97706', label: '🟡 Surveiller' },
      urgent:      { min: 61, max:100, couleur: '#dc2626', label: '🔴 Urgent'     }
    }
  };
}
