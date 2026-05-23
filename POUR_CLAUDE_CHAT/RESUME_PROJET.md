# RÉSUMÉ COMPLET DU PROJET — À ENVOYER À CLAUDE CHAT
## Plateforme ElAwael Digital Platform — PFE Master Leadership Managérial 4.0

---

## 1. IDENTITÉ DE L'ÉTUDIANT

- **Nom complet :** Mohamed Yassine Marzouk
- **Filière :** Master Leadership Managérial 4.0
- **Établissement :** Faculté des Sciences Juridiques, Économiques et Sociales — Université Abdelmalek Essaadi, Tétouan
- **Encadrant académique :** M. Abdelmonaim Tlidi
- **Année universitaire :** 2025-2026

---

## 2. LE STAGE

- **Organisation :** Association El Awael (جمعية الأوائل)
- **Centre du stage :** Centre de Martil (l'association a 3 centres : Martil, M'diq, Fnideq — siège à Fnideq)
- **Responsable d'accueil :** Mme Kaoutar Dghoughi, Directrice du centre de Martil
- **Durée :** 12 mars 2026 au 12 juin 2026 (3 mois)
- **Mission de l'association :** Prise en charge, éducation spécialisée et réhabilitation des enfants en situation de handicap (déficiences intellectuelles, TSA, handicaps moteurs, troubles sensoriels)

---

## 3. SUJET DU RAPPORT

> **"Innovation managériale et transformation digitale dans les associations sociales : Entre performance organisationnelle et impact humain"**

---

## 4. PROBLÉMATIQUE CENTRALE

Comment la transformation digitale, articulée aux principes du Management 4.0, peut-elle constituer un levier d'innovation managériale pour une association sociale, en conciliant performance organisationnelle et préservation de l'impact humain auprès des bénéficiaires ?

---

## 5. SITUATION AVANT LE STAGE (AS-IS)

L'association gérait tout manuellement avec les problèmes critiques suivants :

| N° | Problème | Gravité |
|----|----------|---------|
| 1 | 44 mots de passe en clair dans un fichier HTML accessible | CRITIQUE |
| 2 | Données sur localStorage (perdues si changement de navigateur) | CRITIQUE |
| 3 | Aucun indicateur de pilotage (KPIs) — décision intuitive | IMPORTANT |
| 4 | Alertes uniquement réactives, pas de détection précoce | IMPORTANT |
| 5 | Export limité à `window.print()` | IMPORTANT |
| 6 | Interface avec `alert()` / `confirm()` natifs du navigateur | MOYEN |
| 7 | Registres de présences manuscrits | IMPORTANT |
| 8 | PEI (Projet Éducatif Individualisé) sur papier/Word | IMPORTANT |
| 9 | Reporting direction : 3-4 heures par rapport | IMPORTANT |

---

## 6. SOLUTION DÉVELOPPÉE : ElAwael Digital Platform

### Description générale
Plateforme web de gestion numérique intégrée, 100% gratuite, déployée sur GitHub Pages, connectée à Firebase.

### Technologies utilisées (budget : 0 MAD)
- **Base de données :** Firebase Firestore (cloud, temps réel)
- **Authentification :** Firebase Authentication (JWT, sessions sécurisées)
- **Stockage fichiers :** Firebase Storage
- **Hébergement :** GitHub Pages (déploiement automatique via GitHub Actions)
- **Frontend :** HTML5 + CSS3 + JavaScript pur (sans framework)
- **Graphiques :** Chart.js 4.4.1
- **Langue :** Bilingue Français / Arabe avec support RTL

### Architecture des fichiers
```
elawael-platform/
├── index.html          → Page login sécurisée
├── dashboard.html      → Tableau de bord principal (26 000+ lignes)
├── js/config/firebase.js
├── js/auth/login.js
├── js/data/beneficiaires.js
├── js/features/kpi.js
├── js/features/simulation.js
├── js/features/audit.js
├── assets/logo/logo_elawael.png
└── .github/workflows/deploy.yml
```

---

## 7. MODULES FONCTIONNELS DÉVELOPPÉS

### Module 1 — Authentification et sécurité
- Login sécurisé avec Firebase Auth
- 3 rôles : ADMIN / GESTIONNAIRE / ÉDUCATEUR / CONSULTANT
- Persistance de session (LocalStorage via Firebase)
- Reset mot de passe par email automatique
- Règles Firestore : accès zéro pour non-authentifiés

### Module 2 — Tableau de bord décisionnel (KPIs)
8 indicateurs en temps réel :
- 🎯 Réalisation PEI
- 📅 Taux de présence
- 🚨 Bénéficiaires à risque élevé
- ⚖️ Ratio cadre/bénéficiaire
- 👨‍🏫 Cadres actifs ce mois
- 🔔 Alertes non résolues
- 📵 Sans séance ce mois
- 📋 Conformité des dossiers

### Module 3 — Score Organisationnel Global (SOG)
Indicateur synthétique 0-100 :
```
SOG = (Réalisation PEI × 40%) + (Présence × 30%) + (Indépendance × 20%) + (Dossiers × 10%)
```
- ≥ 70 = Excellent (vert)
- ≥ 40 = Bien (orange)
- < 40 = À améliorer (rouge)

### Module 4 — Gestion des bénéficiaires
- Dossiers numériques complets (identité, handicap, PEI, présences)
- Score de risque individuel automatique (0-100)
- Critères de risque : présence < 50% (+40pts), PEI < 30% (+35pts), etc.

### Module 5 — Suivi PEI et présences
- Suivi des objectifs individualisés par bénéficiaire
- Évaluation ABLLS (Assessment of Basic Language and Learning Skills)
- Registre de présences numérique (présent / absent excusé / absent non excusé / malade / vacances)

### Module 6 — Simulation stratégique
- 3 leviers ajustables (présence +30%, PEI +30%, autonomie +20%)
- Score simulé recalculé en temps réel
- Scénarios : Plan urgence / Effort équilibré / Viser Excellent

### Module 7 — Heatmap des risques
- Vue cartographique par classe (vert/orange/rouge)
- Clic sur une classe → filtre automatique des bénéficiaires

### Module 8 — Journal d'audit complet
- Traçabilité de toutes les actions (connexion, modifications, exports, suppressions)
- Horodatage + identification utilisateur
- Stocké dans Firestore collection `audit_logs`

### Module 9 — Dashboard institutionnel
- 5 KPIs visuels pour partenaires/financeurs/ministère
- Export PDF du rapport mensuel
- Graphique évolution 6 mois (Chart.js)

---

## 8. IMPACT MESURÉ APRÈS DÉPLOIEMENT

| Indicateur | Avant | Après | Évolution |
|-----------|-------|-------|-----------|
| Temps de production d'un rapport | 3-4 heures | < 5 minutes | ↓ 97% |
| Complétude des dossiers | ~45% | >92% | +47 pts |
| Détection bénéficiaire à risque | Plusieurs semaines | Temps réel | Immédiat |
| Traçabilité des actions | Nulle | Complète | 100% |
| Sécurité des données | Insuffisante | Conforme | OK |
| Accessibilité (déplacement) | Locale | Tout navigateur | Cloud |
| Coût de la solution | — | 0 MAD/mois | Gratuit |
| Gain de temps / éducateur | — | ~5h30/semaine | Libéré |

### Satisfaction utilisateurs (n=5 utilisateurs, juin 2026)
- Facilité de prise en main : 80% satisfaits
- Clarté de l'interface : 100% satisfaits
- Utilité des KPIs : 100% satisfaits
- Gain de temps perçu : 100% satisfaits
- Souhait de continuer : 100% satisfaits

---

## 9. CADRE THÉORIQUE MOBILISÉ

### Innovation managériale
- Birkinshaw & Mol (2006) : 4 dimensions (processus, structure, pratiques, systèmes)
- Hamel (2006) : source d'avantage concurrentiel durable

### Transformation digitale
- Westerman, Bonnet & McAfee (2014) : modèle de maturité digitale (Débutants → Digirati)
- Distinction numérisation / digitalisation / transformation digitale
- El Awael : profil initial "Débutant" → accompagné vers "Conservateur/Leader"

### Management 4.0
- 5 piliers : Pilotage par les données / Agilité / Collaboration numérique / Automatisation / Transparence
- Roblek, Meško & Krapež (2016)

### Contexte marocain
- +230 000 associations enregistrées (SGG 2024)
- >70% sans système d'information formalisé
- Bentaleb et al. (2019) : difficultés de digitalisation des OSC marocaines

---

## 10. MÉTHODOLOGIE DE PROJET

- **Diagnostic :** Observation participante + entretiens semi-directifs + analyse documentaire + cartographie processus
- **Développement :** Méthode agile — 4 sprints de 2 semaines (avril-mai 2026)
- **Évaluation :** Design avant/après + questionnaire satisfaction utilisateurs
- **Analyse des besoins :** Méthode MoSCoW
- **Analyse stratégique :** SWOT

---

## 11. LIMITES ET RECOMMANDATIONS

### Limites
- Dépendance à la connectivité internet
- Échantillon d'évaluation limité (n=5)
- Pas d'application mobile native
- Durabilité liée à la motivation des équipes

### Recommandations
1. Désigner un référent numérique interne
2. Procédures opérationnelles standards pour la saisie
3. Extension aux centres de M'diq et Fnideq
4. Version Progressive Web App (PWA)
5. Formalisation du reporting institutionnel

---

## 12. URL ET RESSOURCES

- **Plateforme en ligne :** https://123yassine32.github.io/elawael-platform/
- **Code source :** GitHub (dépôt elawael-platform)
- **51 commits** réalisés sur le projet
- **26 000+ lignes** de code dans dashboard.html
