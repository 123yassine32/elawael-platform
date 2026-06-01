# Guide des captures d'écran pour le mémoire PFE

> Procédure standardisée pour produire des captures professionnelles de la plateforme ElAwail Digital
> à intégrer dans la Partie III du mémoire.

---

## ⚙️ Préparation avant captures

### Configuration recommandée
1. **Navigateur** : Google Chrome dernière version
2. **Résolution écran** : minimum 1920 × 1080 pixels
3. **Zoom navigateur** : 100% (Ctrl+0 pour réinitialiser)
4. **Mode** : F11 plein écran pour éviter la barre du navigateur
5. **Extension** : "GoFullPage" (gratuit) pour capturer des pages entières (scrolling)

### Données pré-remplies
Avant de prendre les captures :
1. Connecte-toi en **admin**
2. Ouvre la **console DevTools** (F12)
3. Exécute : `genererDonneesDemoS2()` (~30s)
4. Attends le toast "✅ Démo générée"
5. Hard refresh (`Ctrl+Shift+R`)

### Conventions de nommage
- Format : `Figure_XX_NomCapture.png`
- Stocker dans : `docs/memoire/screenshots/`
- Résolution minimale : 1600×1000px

---

## 📋 Liste des 15 captures piliers

### Figure 1 — Page de connexion sécurisée
**Section** : `index.html` (page d'accueil)
**Comment** : Déconnecte-toi → tu arrives sur la page login
**Légende** : "Figure 1 : Page d'authentification sécurisée — gestion multi-rôles via Firebase Auth"

### Figure 2 — Vue globale du Cockpit Directeur
**Section** : Cockpit Directeur (admin connecté)
**Comment** : Capture pleine page avec scroll (utilise GoFullPage)
**Légende** : "Figure 2 : Vue d'ensemble du Cockpit Directeur — 9 zones décisionnelles intégrées"

### Figure 3 — Bannière institutionnelle + Roadmap Semestre
**Section** : Cockpit Directeur (haut de page)
**Comment** : Capture la bannière bleue + roadmap S2 + 4 KPIs feux tricolores
**Légende** : "Figure 3 : Bannière exécutive avec roadmap semestrielle et indicateurs feux tricolores"

### Figure 4 — Score Organisationnel détaillé
**Section** : Cockpit Directeur (Score Strip bleu + Jauge + Décomposition)
**Comment** : Capture la zone Score Global avec les 4 mini-barres composantes
**Légende** : "Figure 4 : Score Organisationnel pondéré (40% PEI + 30% Présence + 20% Indép. + 10% Dossiers)"

### Figure 5 — Section Décisions en attente
**Section** : Cockpit Directeur (carte rouge "Décisions en attente")
**Comment** : Capture la liste avec items actionnables
**Légende** : "Figure 5 : Module 'Décisions en attente' — actions directeur identifiées automatiquement"

### Figure 6 — Bandeau Insertion + Pipeline
**Section** : Cockpit Directeur (carte violette + funnel)
**Comment** : Capture les 5 KPIs Insertion + le funnel 5 niveaux
**Légende** : "Figure 6 : Pipeline d'insertion socio-professionnelle à 5 étapes avec taux de conversion"

### Figure 7 — Formation Professionnelle (JRI)
**Section** : Formation Pro → onglet JRI Scores
**Comment** : Capture les 2 KPI cards (Info + Couture) + Top 5 prêts + tableau
**Légende** : "Figure 7 : Tableau de bord Formation Professionnelle — Score JRI individuel"

### Figure 8 — Skills Radar individuel
**Section** : Formation Pro → clic sur 🕸️ d'un bénéficiaire
**Comment** : Capture le modal avec le radar Chart.js à 5 axes
**Légende** : "Figure 8 : Skills Radar — visualisation des 5 dimensions du JRI pour un bénéficiaire"

### Figure 9 — Accompagnement Spécialisé (IBA)
**Section** : Accompagnement Spécialisé
**Comment** : Capture la bannière CRPD + KPIs + distribution barres
**Légende** : "Figure 9 : Module Accompagnement Spécialisé — Indice IBA aligné sur la CRPD 2006"

### Figure 10 — Carnet de Stage
**Section** : Formation Pro → onglet Carnet de Stages
**Comment** : Capture la liste des stages + KPIs en haut
**Légende** : "Figure 10 : Carnet de Stage — gestion des parcours d'insertion en entreprise"

### Figure 11 — Grille d'évaluation hebdomadaire stage
**Section** : Stage → clic sur ⭐ Évaluation
**Comment** : Capture le modal avec les 5 critères de notation
**Légende** : "Figure 11 : Grille d'évaluation hebdomadaire — 5 critères standardisés (employeur)"

### Figure 12 — Entreprises Partenaires
**Section** : Formation Pro → onglet Entreprises
**Comment** : Capture les 10 cartes entreprises démo
**Légende** : "Figure 12 : Réseau de 10 entreprises partenaires démo (Tétouan/Martil)"

### Figure 13 — Simulation Stratégique
**Section** : Simulation stratégique
**Comment** : Capture les 4 sliders + score actuel/simulé + scénarios
**Légende** : "Figure 13 : Simulateur stratégique interactif avec 8 scénarios prédéfinis"

### Figure 14 — Comparaison multi-scénarios
**Section** : Simulation → ajouter 3 scénarios au comparatif
**Comment** : Capture les 3 cards côte à côte avec badge MEILLEUR
**Légende** : "Figure 14 : Comparaison multi-scénarios — aide à la décision stratégique"

### Figure 15 — Rapport Institutionnel
**Section** : Rapport institutionnel (pleine page)
**Comment** : Capture en pleine page (GoFullPage) ou bien quelques sections clés
**Légende** : "Figure 15 : Rapport institutionnel automatisé — destiné aux financeurs"

### Figure 16 — Heatmap des risques
**Section** : Alertes & Risques → onglet Heatmap
**Comment** : Capture la grille colorée par classe
**Légende** : "Figure 16 : Heatmap des risques par classe — visualisation géographique"

### Figure 17 — Journal d'audit
**Section** : Journal d'audit
**Comment** : Capture les KPIs + liste des entrées (avec filtres visibles)
**Légende** : "Figure 17 : Journal d'audit — traçabilité intégrale conforme RGPD"

### Figure 18 — Synthèse PDF exportée
**Section** : Cockpit → bouton "📥 Synthèse PDF" → ouvrir le PDF généré
**Comment** : Capture du PDF ouvert dans un viewer
**Légende** : "Figure 18 : Synthèse exécutive A4 — export PDF automatisé pour la direction"

---

## 🎨 Conseils qualité

### Éviter
- ❌ Capture avec ta barre d'adresse Chrome visible
- ❌ Tabs ouverts en haut
- ❌ Bookmark bar visible
- ❌ Captures floues / pixellisées
- ❌ Texte coupé sur les bords

### Privilégier
- ✅ Mode F11 plein écran
- ✅ Bookmark bar masquée (Ctrl+Shift+B)
- ✅ Format PNG (pas JPG pour la netteté du texte)
- ✅ Au moins 1600 px de large
- ✅ Vérifier la lisibilité du texte petit

---

## 📝 Intégration dans le mémoire

Une fois les captures prises et nommées :
1. Place-les dans `docs/memoire/screenshots/`
2. Dans le document Word final, insère-les avec :
   - **Titre numéroté** : "Figure X : ..." (gras, centré, Times New Roman 12)
   - **Source** : "Source : Capture personnelle, plateforme ElAwail Digital, [Date]"
   - **Taille** : 80-90% largeur de la page
   - **Alignement** : centré

### Modèle Word à utiliser

```
[Image centrée — 85% largeur]

Figure X : Titre descriptif de la figure
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```
