# CLAUDE.md — Mémoire Permanente du Projet ElAwail
# Lire ce fichier EN ENTIER avant toute action

---

## 1. IDENTITÉ DU PROJET

- **Nom** : ElAwail Digital Platform
- **Type** : Plateforme de gestion pour association communautaire marocaine
- **Objectif** : Transition du papier vers un écosystème numérique complet
- **Public** : Bénéficiaires en situation de handicap (enfants, familles)
- **Données** : Ultra-sensibles (CIN, dossiers médicaux, adresses, familles)
- **Contexte académique** : PFE — Master Leadership Managérial 4.0
- **Fichier source** : elawail-portal-v22_S2_AR__5_.html (19 000+ lignes)
- **Budget** : 0 MAD — outils gratuits uniquement
- **Hébergement cible** : GitHub Pages (gratuit)
- **Base de données** : Firebase Firestore (gratuit)
- **Authentification** : Firebase Authentication (gratuit)

---

## 2. RÈGLES ABSOLUES — NE JAMAIS VIOLER

### Ce qu'on ne touche JAMAIS :
- Le design visuel (couleurs, sidebar, topbar, cards, KPIs)
- Les variables CSS : --primary, --success, --danger, --warning, --muted, --border, --card
- Les classes CSS : btn, btn-p, card, card-header, tag, kpi, nav-item, toast, perf-kpi, kpi-big, kpi-lbl, chart-card
- Le système bilingue Français / Arabe et la direction RTL
- Les fonctions JavaScript existantes qui fonctionnent
- Les graphiques Chart.js existants
- La structure des fiches bénéficiaires
- Les données existantes (ne pas supprimer)

### Règle de construction :
> Construire UNIQUEMENT par-dessus l'existant.
> Ne jamais recréer une interface from scratch.
> Le résultat final doit être visuellement identique + amélioré.

### Règle de qualité :
> Chaque fonctionnalité ajoutée = niveau production réelle.
> Pas de prototype. Pas de "pour l'instant".
> Code commenté en français. Sécurité maximale.

---

## 3. FONCTIONS EXISTANTES À RÉUTILISER

Ces fonctions existent déjà dans le HTML — les brancher, pas les recréer :

| Fonction | Rôle |
|---|---|
| `renderKPI()` | Affichage des KPIs par classe |
| `buildInfoAccueil()` | Tableau de bord cadre éducateur |
| `scoreGlobal` | Score individuel bénéficiaire (0-100) |
| `pctHadir` | Taux de présence mensuel |
| `pctIndep` | Taux d'indépendance ABLLS |
| `tauxRealisation` | Taux de réalisation PEI |
| `adminShowSection()` | Navigation panneau admin |
| `showToast()` | Système de notification existant |
| `calcOrgScore()` | À créer — score organisationnel global |

---

## 4. PROBLÈMES CRITIQUES DÉTECTÉS — À CORRIGER EN PRIORITÉ

### CRITIQUE 1 — Sécurité (URGENT)
- **Problème** : 44 mots de passe en clair dans le fichier HTML source
- **Risque** : N'importe qui ouvrant le fichier voit tous les identifiants
- **Solution** : Migrer vers Firebase Authentication
- **Action** :
  - Créer `index.html` avec page login (même style visuel)
  - Mots de passe hashés et sécurisés via Firebase
  - Session persistante (rester connecté après fermeture)
  - Reset mot de passe par email automatique
  - Redirection automatique si non connecté

### CRITIQUE 2 — Données (URGENT)
- **Problème** : Données sensibles codées en dur + localStorage = données perdues
- **Risque** : Changement de navigateur = perte totale des dossiers
- **Solution** : Migrer vers Firebase Firestore
- **Action** :
  - Charger les données dynamiquement depuis Firestore
  - L'affichage reste visuellement identique
  - Sauvegarde automatique de chaque modification
  - Utiliser le toast existant pour confirmer chaque sauvegarde
  - Règles Firestore strictes : non authentifié = accès zéro

### CRITIQUE 3 — Interface (IMPORTANT)
- **Problème** : `alert()` et `confirm()` natifs du navigateur partout
- **Risque** : Interface non professionnelle, expérience utilisateur mauvaise
- **Solution** : Remplacer par le système toast et modals existants
- **Action** :
  - `alert()` → toast vert (succès) existant
  - `confirm()` → modal de confirmation stylisée au style existant
  - Ne jamais utiliser les boîtes natives du navigateur

### CRITIQUE 4 — KPIs non décisionnels (IMPORTANT)
- **Problème** : KPIs descriptifs — le directeur voit des chiffres mais ne peut pas décider
- **Solution** : Ajouter Score Organisationnel Global
- **Formule** :
  ```
  Score = (moy_realisation × 40%) +
          (moy_presence    × 30%) +
          (moy_independance × 20%) +
          (taux_dossiers   × 10%)
  ```
- **Action** :
  - Brancher sur `scoreGlobal`, `pctHadir`, `pctIndep` existants
  - Jauge circulaire Chart.js doughnut dans panneau admin
  - Couleur dynamique : vert ≥70 / orange ≥40 / rouge <40
  - Mention : Excellent / Bien / À améliorer / Critique

### CRITIQUE 5 — Alertes trop basiques (IMPORTANT)
- **Problème** : Alertes uniquement si score < 30% — pas de priorisation
- **Solution** : Score de risque pondéré par bénéficiaire (0-100)
- **Règles de calcul** :
  ```
  + 40 pts → présence < 50%
  + 25 pts → présence entre 50% et 70%
  + 35 pts → réalisation PEI < 30%
  + 20 pts → réalisation entre 30% et 50%
  + 15 pts → dossier incomplet (champs manquants)
  + 10 pts → aucune séance ce mois-ci
  ```
- **Niveaux** : 0-30 = Stable (vert) / 31-60 = Surveiller (orange) / 61-100 = Urgent (rouge)
- **Action** : Afficher dans section alertes existante, triée par risque décroissant

### CRITIQUE 6 — Export limité (MOYEN)
- **Problème** : Seul `window.print()` disponible — pas de vrai export
- **Solution** : Ajouter exports professionnels réels
- **Action** :
  - Bouton Excel → `ElAwail_Membres_[date].xlsx`
  - Bouton PDF fiche → `Fiche_[nom]_[date].pdf`
  - Rapport mensuel → `Rapport_ElAwail_[mois]_[année].pdf`
  - Utiliser les classes `btn-p` existantes pour les boutons

---

## 5. MODULES STRATÉGIQUES À AJOUTER (Management 4.0)

### MODULE 1 — Heatmap des risques par classe
- Nouvel onglet dans le panneau admin existant
- Grille colorée : une case par classe avec niveau de risque moyen
- Vert / Orange / Rouge selon score moyen de la classe
- Clic sur une case → filtre automatiquement la liste des bénéficiaires
- Utiliser les classes `card` et variables CSS existantes

### MODULE 2 — Simulation décisionnelle
- Nouvel onglet admin : "Simulation stratégique"
- Score actuel affiché à gauche (fixe, non modifiable)
- 3 sliders interactifs :
  - `+X%` présence (0 à +30%)
  - `+X%` réalisation PEI (0 à +30%)
  - `+X%` indépendance (0 à +20%)
- Score simulé recalculé en temps réel à droite
- Variation en % affichée entre avant et après
- Bouton "Réinitialiser" pour revenir aux valeurs réelles

### MODULE 3 — Dashboard Financeur / Ministère
- Vue "Rapport institutionnel" dans panneau admin
- 5 KPIs visuels : Score global / Bénéficiaires suivis /
  Taux présence / Objectifs réalisés / Conformité dossiers
- Graphique évolution sur 6 mois (Chart.js ligne — déjà chargé)
- Bouton "Exporter PDF" → `Rapport_ElAwail_[mois]_[année].pdf`
- Style épuré, professionnel, lisible par des partenaires externes

### MODULE 4 — Journal d'audit complet
- Nouvel onglet "Journal" dans la sidebar existante (même style nav-item)
- Enregistrer automatiquement chaque action :
  - Connexion / Déconnexion
  - Ajout / Modification / Suppression bénéficiaire
  - Upload / Suppression document
  - Export de données
  - Changement de rôle utilisateur
- Format : `[Date & heure] [Utilisateur] [Action] [Élément concerné]`
- Filtres : par date, par utilisateur, par type d'action
- Journal en lecture seule pour tous (même l'admin)
- Stocké dans Firestore collection séparée `audit_logs`
- Export du journal en PDF pour rapports officiels

---

## 6. SYSTÈME DE RÔLES UTILISATEURS

| Rôle | Permissions |
|---|---|
| **ADMIN** | Tout voir + modifier + supprimer + exporter + gérer utilisateurs |
| **GESTIONNAIRE** | Voir + modifier — pas de suppression — pas de gestion utilisateurs |
| **CONSULTANT** | Lecture seule — CIN / téléphone / adresse masqués |

- Comptes de test à créer :
  - `admin@elawail.ma`
  - `gestionnaire@elawail.ma`
  - `consultant@elawail.ma`
- Afficher le rôle dans la sidebar (là où est le profil éducateur)

---

## 7. ARCHITECTURE FINALE DES FICHIERS

```
elawail-platform/
├── CLAUDE.md                        ← Ce fichier
├── index.html                       ← Page login (même style)
├── dashboard.html                   ← Dashboard (identique à l'existant)
├── elawail-portal-v22...html        ← Fichier original (ne pas supprimer)
│
├── css/
│   └── style.css                    ← CSS extrait sans modification
│
├── js/
│   ├── config/
│   │   └── firebase.js              ← Configuration Firebase (clés API)
│   ├── auth/
│   │   ├── login.js                 ← Connexion / logout / session
│   │   └── roles.js                 ← Vérification et gestion des rôles
│   ├── data/
│   │   ├── beneficiaires.js         ← CRUD bénéficiaires Firestore
│   │   ├── cadres.js                ← CRUD cadres encadrants
│   │   └── sync.js                  ← Synchronisation temps réel
│   ├── features/
│   │   ├── kpi.js                   ← Score organisationnel + risques
│   │   ├── documents.js             ← Upload / download fichiers
│   │   ├── export.js                ← Export Excel / PDF
│   │   ├── audit.js                 ← Journal d'audit
│   │   └── simulation.js            ← Module décisionnel
│   └── app.js                       ← JS principal existant
│
├── assets/
│   └── logo/                        ← Logo de l'association
│
└── .github/
    └── workflows/
        └── deploy.yml               ← Déploiement automatique GitHub Pages
```

---

## 8. CONTRAINTES TECHNIQUES

| Contrainte | Valeur |
|---|---|
| Budget | 0 MAD — tout gratuit |
| Langage | JavaScript pur (pas de framework) |
| Graphiques | Chart.js 4.4.1 (déjà chargé — réutiliser) |
| Navigateurs | Chrome, Firefox, Safari, Edge 2023+ |
| Mobile | Responsive — breakpoint 768px |
| Langue du code | Commentaires en français |
| Variables | Français ou anglais (pas de mélange) |
| RTL | Support arabe sur toutes les nouvelles pages |
| Hébergement | GitHub Pages |
| Base de données | Firebase Firestore |
| Authentification | Firebase Authentication |
| Stockage fichiers | Firebase Storage |

---

## 9. ORDRE D'EXÉCUTION OBLIGATOIRE

```
PHASE 1 — Corrections critiques (dans cet ordre)
  1. Sécurité → Firebase Authentication + page login
  2. Données  → Firebase Firestore + migration
  3. Interface → Remplacer alert() par toasts
  4. KPIs      → Score organisationnel global
  5. Alertes   → Score de risque pondéré
  6. Export    → Excel + PDF réels

PHASE 2 — Modules stratégiques (dans cet ordre)
  1. Heatmap des risques par classe
  2. Simulation décisionnelle
  3. Dashboard Financeur / Ministère
  4. Journal d'audit complet

PHASE 3 — Architecture et déploiement
  1. Restructuration propre des fichiers
  2. Configuration GitHub Pages
  3. Déploiement automatique

PHASE 4 — Mobile responsive
  1. Media queries sans toucher au CSS desktop
  2. Sidebar → hamburger menu
  3. Tableaux → cartes sur mobile
  4. Test sur 375px et 414px
```

---

## 10. PROCESSUS DE TRAVAIL OBLIGATOIRE

### Avant de commencer quoi que ce soit :
1. Lire ce fichier CLAUDE.md en entier
2. Lire le fichier HTML source en entier
3. Identifier les fonctions existantes à réutiliser
4. Résumer en 10 points ce qui a été compris
5. Lister exactement ce qui va être modifié vs ajouté
6. **Attendre la validation avant de coder**

### Pendant le travail :
- Travailler phase par phase, étape par étape
- Après chaque étape → montrer les changements
- Attendre le "OK, continue" avant de passer à la suivante
- Si un doute → poser la question avant de coder
- Si besoin d'une clé Firebase ou info externe → demander

### Livraison de chaque étape :
- Montrer les fichiers modifiés
- Expliquer en 3 lignes ce qui a changé
- Dire comment tester que ça fonctionne
- Signaler si une action manuelle est requise

---

## 11. PHRASE DE DÉMARRAGE

Quand tu lis ce fichier, commence par dire :
> "J'ai lu CLAUDE.md. Je connais le projet ElAwail.
> Je vais maintenant lire le fichier HTML source
> et te présenter mon analyse complète avant de
> toucher une seule ligne de code."

---

*Fichier créé pour le projet ElAwail — Master Leadership Managérial 4.0*
*Ne pas supprimer — Ne pas modifier sans validation*
