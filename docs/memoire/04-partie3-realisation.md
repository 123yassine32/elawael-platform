# PARTIE III — RÉALISATION ET RÉSULTATS

> *Cette troisième partie présente la réalisation concrète de la plateforme ElAwail Digital, illustrée par dix-huit captures d'écran prises depuis l'instance déployée. Elle s'articule en trois chapitres : implémentation des modules piliers (Ch. 7), méthodologie de validation par simulation statistique (Ch. 8), résultats et impacts (Ch. 9).*

---

## CHAPITRE 7 — Implémentation des modules piliers

### Introduction

La plateforme ElAwail Digital intègre dix-sept modules fonctionnels articulés autour des trois trajectoires définies en Partie II. Ce chapitre présente les modules les plus structurants, en s'appuyant sur des captures de la plateforme déployée à l'adresse `https://123yassine32.github.io/elawael-platform/`.

### 7.1 Authentification et architecture multi-rôles

L'accès à la plateforme est protégé par une **page d'authentification sécurisée** (Figure 1) reposant sur Firebase Authentication. Quatre profils d'utilisateurs sont prévus, chacun avec des permissions différenciées : Administrateur, Gestionnaire, Éducateur et Consultant.

```
[FIGURE 1 — Page d'authentification sécurisée multi-rôles]
Section : index.html (page de connexion)
Capture montrant le formulaire de login avec champs identifiant/mot de passe,
logo ElAwail et bandeau bilingue FR/AR.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

À la connexion, le système vérifie le rôle dans Firestore (`users/{uid}`), applique automatiquement les restrictions visuelles correspondantes (classes CSS `role-admin-only`, `role-no-consultant`) et redirige vers l'interface adaptée.

### 7.2 Cockpit Directeur — vue stratégique agrégée

Le **Cockpit Directeur** (Figure 2) constitue la vue principale destinée à la direction. Il agrège, sur une page unique, tous les indicateurs stratégiques de l'association : score organisationnel global, KPIs feux tricolores, décisions en attente, pipeline d'insertion, bandeau accompagnement, projection de fin de semestre et évolution sur six mois.

```
[FIGURE 2 — Vue d'ensemble du Cockpit Directeur]
Section : Cockpit Directeur (admin connecté)
Capture pleine page (utiliser l'extension GoFullPage) montrant l'enchaînement
des sections de haut en bas : bannière + roadmap + KPI + score + décisions
+ pipeline + bandeau insertion + tableau classes + projection.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

La **bannière institutionnelle** (Figure 3) en tête de page présente la date dynamique, le statut de synchronisation Firebase, le nombre de semaines restantes dans le semestre, et les totaux principaux (228 bénéficiaires, 7 classes, 40 cadres). Elle est complétée immédiatement en-dessous par les **quatre KPIs feux tricolores** : présence, PEI, dossiers, risque moyen.

```
[FIGURE 3 — Bannière institutionnelle et indicateurs feux tricolores]
Section : Cockpit Directeur (haut de page)
Capture de la bannière bleu/violet avec date, totaux et 4 cartes feux tricolores.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### 7.3 Score Organisationnel pondéré

Le **Score Organisationnel** constitue l'indicateur central de pilotage. Il est calculé selon une pondération inspirée du Management 4.0, et présenté de trois manières complémentaires : un bandeau horizontal large avec mention qualitative, une jauge circulaire Chart.js, et une décomposition détaillée en quatre composantes (Figure 4).

**Tableau 7 : Pondération du Score Organisationnel**

| Composante | Pondération | Justification |
|---|---|---|
| Réalisation PEI | 40% | Mission pédagogique principale |
| Présence | 30% | Régularité de la prise en charge |
| Indépendance (ABLLS) | 20% | Autonomie fonctionnelle |
| Conformité dossiers | 10% | Compliance administrative |
| **TOTAL** | **100%** | |

*Source : Conception auteur, alignée sur les standards Management 4.0*

```
[FIGURE 4 — Score Organisationnel pondéré et décomposition]
Section : Cockpit Directeur (zone Score Global)
Capture montrant le bandeau bleu horizontal avec score 80/100,
mention "Bien", et les 4 mini-barres composantes avec pondérations.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Le score est accompagné d'une **mention qualitative** dynamique : Excellent (≥70), Bien (40-69), À améliorer (<40). Une **synthèse exécutive narrative** est générée automatiquement en-dessous, identifiant le point faible principal et proposant une recommandation actionnable.

### 7.4 Module "Décisions en attente"

Pour passer d'un dashboard descriptif à un outil **actionnable**, un module **Décisions en attente** (Figure 5) identifie automatiquement les items nécessitant une intervention du directeur : demandes RH à valider, stages à clôturer, bénéficiaires à orienter (JRI<40), alertes critiques non traitées, cadres sans séance, et bénéficiaires DI en vigilance.

```
[FIGURE 5 — Module 'Décisions en attente']
Section : Cockpit Directeur (sous le Score Global)
Capture de la carte rouge avec liste des items actionnables,
chacun avec icône, titre coloré, sous-titre et bouton "Voir →".
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Chaque chip est cliquable et redirige vers la section concernée avec, le cas échéant, l'onglet pré-sélectionné. Cette ergonomie respecte le principe de **moins de trois clics** pour atteindre l'information.

### 7.5 Pipeline d'insertion socio-professionnelle

Pour les 67 bénéficiaires des classes Formation Pro, un **pipeline en funnel à cinq niveaux** (Figure 6) visualise le parcours d'insertion : total Formation Pro → prêts à l'emploi (JRI≥70) → en stage actif → stages réussis (score≥4/5) → insertion finale. Les taux de conversion intermédiaires sont calculés automatiquement.

```
[FIGURE 6 — Pipeline d'insertion socio-professionnelle]
Section : Cockpit Directeur (carte Pipeline)
Capture des 5 niveaux décroissants avec valeurs, couleurs (bleu → vert),
et flèches de conversion entre niveaux.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### 7.6 Module Formation Professionnelle (JRI)

Le **module Formation Pro** est dédié aux 67 bénéficiaires des classes Informatique et Couture. Il calcule pour chacun un **Job-Readiness Index** (JRI) intégrant cinq dimensions, avec pondération différenciée selon la classe.

**Tableau 8 : Pondération différenciée du JRI par classe**

| Dimension | Informatique | Couture |
|---|---|---|
| Compétences techniques (Hard) | 40% | 30% |
| Savoir-être (Soft) | 20% | 20% |
| Préparation à l'emploi (Job-Ready) | 5% | 5% |
| Production tangible | 25% | 35% |
| Stages | 10% | 10% |

*Source : Conception auteur, adaptée à la spécificité des deux filières*

```
[FIGURE 7 — Tableau de bord Formation Professionnelle (JRI)]
Section : Formation Pro → onglet "JRI Scores"
Capture montrant les 2 KPI cards (Info + Couture), Top 5 prêts, Top 5
renforcement, et le tableau récap avec mini-barres pour chaque dimension.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Chaque bénéficiaire dispose d'un **Skills Radar individuel** (Figure 8) visualisant ses cinq dimensions sous forme de pentagone Chart.js, accompagné de son score JRI, d'une mention qualitative et d'une recommandation contextuelle.

```
[FIGURE 8 — Skills Radar individuel — 5 dimensions du JRI]
Section : Formation Pro → clic sur l'icône radar 🕸️ d'un bénéficiaire
Capture du modal avec radar 5 axes (Hard/Soft/Job-Ready/Production/Stages),
score JRI géant, mention colorée et détail chiffré des 5 sous-scores.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Cinq mentions automatiques structurent l'orientation des bénéficiaires : Prêt CDI / Études (≥85), Prêt stage rémunéré (70-84), Stage d'observation (55-69), Renforcement (40-54), Atelier protégé / ESAT (<40).

### 7.7 Module Accompagnement Spécialisé (IBA)

Pour les 11 bénéficiaires de la filière Déficience Intellectuelle profonde, l'objectif n'est pas l'insertion professionnelle mais le **bien-être quotidien**. Le module **Accompagnement Spécialisé** (Figure 9) calcule un Indice de Bien-être et d'Autonomie (IBA) aligné sur la Convention CRPD-ONU 2006.

**Tableau 9 : Niveaux et mentions de l'IBA**

| Score IBA | Mention | Recommandation |
|---|---|---|
| ≥80 | Épanouissement remarquable | Maintenir le programme actuel |
| 65-79 | Bien-être stable | Renforcer les acquis |
| 50-64 | Évolution progressive | Adapter le rythme |
| 35-49 | Vigilance requise | Réunion équipe multidisciplinaire |
| <35 | Intervention prioritaire | Réévaluation médicale |

*Source : Conception auteur, alignée sur la CRPD-ONU 2006*

```
[FIGURE 9 — Module Accompagnement Spécialisé — IBA]
Section : Accompagnement Spécialisé (sidebar)
Capture montrant la bannière violette "Approche CRPD 2006", les 4 KPIs
(IBA moyen, bénéficiaires, épanouis, vigilance), et la distribution par
les 5 niveaux d'épanouissement (barres horizontales colorées).
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

L'IBA intègre cinq dimensions adaptées : autonomie quotidienne (40%), intégration sociale (25%), qualité de vie (20%), soutien familial (10%), suivi médical (5%). Aucune mention n'est dépréciative — la philosophie est d'**accompagner**, pas de trier.

### 7.8 Carnet de Stage et Entreprises Partenaires

Pour matérialiser la dimension Stages du JRI, deux modules complémentaires ont été développés. Le **Carnet de Stage** (Figure 10) permet la création, l'édition et le suivi des stages avec quatre statuts (planifié, en cours, terminé, rompu), trois types (observation, pratique, pré-embauche), et un système de filtres dynamiques.

```
[FIGURE 10 — Carnet de Stage — liste des parcours]
Section : Formation Pro → onglet "Carnet de Stages"
Capture montrant les 4 KPIs (total, en cours, terminés, note moyenne),
les filtres par statut, et la liste des stages avec cards colorées.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Chaque stage dispose d'une **grille d'évaluation hebdomadaire** (Figure 11) à cinq critères standardisés : ponctualité, compétence technique, comportement, initiative, travail en équipe. Le score moyen est calculé automatiquement et une synthèse narrative est générée à la clôture du stage.

```
[FIGURE 11 — Grille d'évaluation hebdomadaire de stage]
Section : Carnet de Stages → clic "Évaluation" sur un stage
Capture du modal avec les 5 critères notés sur 5 (boutons cliquables),
synthèse en bas et recommandation contextuelle.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Le module **Entreprises Partenaires** (Figure 12) constitue la base du réseau d'insertion. Pour la démonstration, dix entreprises fictives mais réalistes ont été créées dans la région Tétouan/Martil : cinq dans l'informatique (Cyber Atlas, MediaTech, Bureau Yacoub, Print Express, WebPro Maroc), trois en couture (Atelier El Andalous, Confection Moderne, Maison Caftan El Wafa), et deux dans le commerce/restauration (Marjane Tétouan, Restaurant Le Riad).

```
[FIGURE 12 — Réseau des entreprises partenaires]
Section : Formation Pro → onglet "Entreprises Partenaires"
Capture montrant la grille des 10 cartes entreprises avec icône secteur,
nom, contact, ville et postes proposés.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### 7.9 Simulation Stratégique

Le module **Simulation Stratégique** (Figure 13) constitue un outil d'aide à la décision unique dans le tiers-secteur marocain. Quatre leviers interactifs (présence, PEI, indépendance, stages) permettent de simuler l'impact d'une politique stratégique sur le score organisationnel et le pipeline d'insertion.

```
[FIGURE 13 — Simulateur stratégique interactif]
Section : Simulation stratégique (sidebar)
Capture montrant les 4 sliders à gauche, la jauge "Score actuel" au centre,
la jauge "Score simulé" à droite avec delta, et les 8 boutons de scénarios
prédéfinis en bas.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Huit scénarios prédéfinis facilitent l'usage : Équilibre, Urgence, Excellent, Fin d'année (génériques), et Boost Formation Pro, Renforcer Accompagnement, Rattrapage présence, Doubler partenariats (sectoriels). Le module **Comparaison multi-scénarios** (Figure 14) permet de comparer jusqu'à trois plans côte à côte, identifiant automatiquement le meilleur via un badge dédié.

```
[FIGURE 14 — Comparaison multi-scénarios]
Section : Simulation stratégique → bouton "Ajouter au comparatif" (×3)
Capture montrant 3 cards côte à côte avec scores, deltas, KPIs insertion,
et badge "MEILLEUR" sur celui au plus haut score.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### 7.10 Rapport Institutionnel automatisé

Le **Rapport Institutionnel** (Figure 15) constitue le livrable principal destiné aux financeurs et au ministère. Il intègre une bannière officielle, cinq KPIs visuels institutionnels, un graphique d'évolution sur six mois, un doughnut de répartition par classe, un tableau de synthèse par filière, une section dédiée à l'insertion socio-professionnelle, une section Accompagnement Spécialisé conforme à la CRPD, une analyse automatique des défis avec plan d'action, une synthèse narrative et un bloc de signatures officielles.

```
[FIGURE 15 — Rapport institutionnel automatisé]
Section : Rapport institutionnel (sidebar) → capture pleine page
Capture montrant la bannière officielle, les 5 KPIs, le graphique évolution,
le doughnut, le tableau classes, et les sections enrichies.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Un bouton d'**export PDF** génère automatiquement le rapport au format A4 multi-pages, prêt pour impression ou transmission par mail.

### 7.11 Heatmap des risques et Journal d'audit

La **Heatmap des risques par classe** (Figure 16) propose une visualisation géographique colorée du niveau de risque moyen par filière. Chaque classe apparaît comme une carte avec son code couleur (vert = stable, orange = surveillance, rouge = urgent). Un clic sur une classe filtre automatiquement la liste des bénéficiaires concernés.

```
[FIGURE 16 — Heatmap des risques par classe]
Section : Alertes & Risques → onglet "Heatmap"
Capture montrant la grille de cards par classe avec couleurs et statistiques.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

Le **Journal d'audit** (Figure 17) garantit la traçabilité intégrale des actions, conformément aux principes du Management 4.0 et aux exigences RGPD. Toute connexion, modification, suppression ou export est automatiquement consignée avec horodatage, utilisateur et détail.

```
[FIGURE 17 — Journal d'audit et traçabilité]
Section : Journal d'audit (sidebar)
Capture montrant les 4 KPIs en haut, les filtres par type/utilisateur/date,
et la liste paginée des entrées d'audit avec horodatages.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### 7.12 Exports PDF synthétiques

Au-delà du rapport institutionnel, la plateforme propose une **Synthèse PDF d'une page A4** (Figure 18) générée à la demande, idéale pour les réunions de direction, les rapports au conseil d'administration ou les transmissions rapides aux partenaires. Cette synthèse condense l'essentiel sur une seule page : en-tête institutionnel, score global et décomposition, KPIs feux tricolores, bandeau insertion, roadmap S2, pipeline funnel, synthèse narrative, décisions en attente, et bloc signature directeur.

```
[FIGURE 18 — Synthèse exécutive PDF — A4 exportable]
Section : Cockpit Directeur → bouton "Synthèse PDF" → ouvrir le PDF généré
Capture du PDF d'une page ouvert dans un viewer, montrant la mise en page
professionnelle avec toutes les sections condensées.
Source : Capture personnelle, plateforme ElAwail Digital, juin 2026
```

### Conclusion du chapitre 7

L'implémentation des dix-sept modules de la plateforme ElAwail Digital, dont les **dix-huit modules piliers** ont été présentés ici, démontre la **faisabilité opérationnelle** des choix conceptuels de la Partie II. La plateforme couvre l'ensemble du cycle de vie d'un bénéficiaire : accueil administratif, suivi pédagogique quotidien, évaluation continue, préparation à l'insertion (ou accompagnement spécialisé selon le profil), reporting agrégé aux financeurs. La validation algorithmique de ces modules fait l'objet du chapitre suivant.

---

## CHAPITRE 8 — Validation par simulation statistique

### Introduction

L'Association ElAwael-Martil étant en phase de transition du papier vers le numérique, l'accumulation de données réelles sur plusieurs semestres reste à constituer. Pour valider scientifiquement la robustesse des algorithmes développés (Score Organisationnel, JRI, IBA, Pipeline d'insertion) **avant** ce déploiement complet, une méthodologie de **validation par simulation statistique déterministe** a été conçue spécifiquement pour ce projet.

### 8.1 Méthodologie scientifique

Le moteur de simulation génère, à la demande de l'administrateur, environ **32 000 documents synthétiques** réalistes couvrant l'intégralité du semestre 2 (février-juin 2026) pour les 228 bénéficiaires de l'association. Les données générées incluent : présences quotidiennes, feuilles ghiyab mensuelles, évaluations ABLLS, statuts PEI, suivis pédagogiques, rapports mensuels, notes /20, grilles Tan9it / Ri3aya / Talabat.

Trois principes scientifiques structurent ce moteur :

**Déterminisme** : un algorithme pseudo-aléatoire basé sur le hash du nom du bénéficiaire garantit que le même bénéficiaire aura toujours le même profil simulé. Cette caractéristique assure la **reproductibilité** des tests — un critère essentiel de toute démarche scientifique.

**Réalisme calendaire** : le calendrier de génération s'appuie sur les **vrais fichiers Excel d'absences mensuelles** fournis par la directrice (février, mars, avril, mai 2026). Ces fichiers ont été parsés en Python pour extraire les jours ouvrés réels (Lundi-Vendredi uniquement, vacances scolaires détectées : 2-10 février et 1-8 mai 2026).

**Distribution statistique sectorielle** : la répartition des bénéficiaires en quatre profils s'inspire des études sectorielles sur la régularité de fréquentation en centres spécialisés (Khalil et al., 2019 ; ONDH 2022).

### 8.2 Modèle de profils statistiques

**Tableau 10 : Distribution statistique des profils simulés**

| Profil | Pourcentage | Taux présence | Caractéristiques |
|---|---|---|---|
| Assidus | 70% | 92-95% | Engagement fort, soutien familial stable |
| Réguliers | 20% | 83-88% | Engagement moyen, fluctuations |
| Irréguliers | 8% | 65-74% | Difficultés ponctuelles, absentéisme |
| À risque | 2% | 45-54% | Décrochage potentiel, alertes critiques |

*Source : Conception auteur, inspirée des études sectorielles ONDH 2022*

Cette distribution génère un comportement réaliste de la plateforme : la grande majorité des bénéficiaires affiche des indicateurs sains, une minorité requiert une attention renforcée, et un très petit nombre (les 2% à risque) déclenche les alertes critiques attendues dans toute structure médico-sociale.

### 8.3 Résultats de validation

Après génération, les indicateurs principaux de la plateforme affichent les valeurs suivantes :

**Tableau 11 : Validation — Indicateurs obtenus vs attendus**

| Indicateur | Valeur obtenue | Plage attendue (secteur) | Validation |
|---|---|---|---|
| Score Organisationnel | 80/100 | 70-85 | ✓ Conforme |
| Taux de présence moyen | 87% | 85-90% | ✓ Conforme |
| Réalisation PEI | 65% | 60-70% (S2 en cours) | ✓ Conforme |
| Risque moyen | 6/100 | <10 | ✓ Conforme |
| Alertes urgentes | 3-5 | 2-3% des effectifs | ✓ Conforme |
| JRI moyen Formation Pro | 41-72/100 | Variable selon classe | ✓ Plausible |
| IBA moyen Accompagnement | 70/100 | Cible 65+ | ✓ Excellent |

*Source : Tests de simulation réalisés mai-juin 2026*

Ces résultats valident la **cohérence interne** des algorithmes : les indicateurs réagissent comme attendu aux profils simulés, les pondérations produisent des scores réalistes, et le système d'alertes se déclenche au bon moment. La plateforme est donc **scientifiquement prête** pour accueillir les vraies données dès la prochaine rentrée scolaire.

### Conclusion du chapitre 8

La validation par simulation statistique déterministe constitue ainsi une **contribution méthodologique originale** de ce projet. Elle démontre que la robustesse algorithmique d'une plateforme peut être démontrée scientifiquement avant l'accumulation de données historiques réelles, sous réserve de respecter trois conditions : déterminisme, réalisme calendaire et distribution sectorielle plausible.

---

## CHAPITRE 9 — Résultats et impacts

### Introduction

Au terme du projet, plusieurs résultats opérationnels et stratégiques peuvent être mesurés ou anticipés. Ce chapitre dresse le bilan, identifie l'impact organisationnel attendu et discute des perspectives de reproductibilité.

### 9.1 Bilan opérationnel

La plateforme ElAwail Digital est **déployée et opérationnelle** à l'adresse `https://123yassine32.github.io/elawael-platform/`. Elle compte aujourd'hui dix-sept modules fonctionnels, supporte quatre rôles d'utilisateurs, intègre le bilinguisme français-arabe, génère neuf types de PDF différents (rapport institutionnel, synthèse exécutive, fiches bénéficiaires, etc.), et stocke ses données sur Firebase Firestore avec règles d'accès strictes.

Le **coût total** du projet est de **0 dirham** en infrastructure (hébergement GitHub Pages gratuit, Firebase Spark Plan gratuit, librairies open-source). Cette caractéristique répond directement à l'**hypothèse H2** posée en introduction : *une plateforme professionnelle peut être conçue à coût nul en exploitant les infrastructures cloud gratuites*.

### 9.2 Impact organisationnel anticipé

L'impact attendu sur l'Association ElAwael-Martil peut être projeté selon plusieurs dimensions.

**Tableau 12 : Bilan comparatif — Avant vs Après digitalisation**

| Dimension | Avant (papier) | Après (ElAwail Digital) | Gain attendu |
|---|---|---|---|
| Temps reporting mensuel | 2 semaines | 5 minutes (export PDF) | -99% |
| Accès aux dossiers | 1 cadre à la fois | Multi-cadres temps réel | x40 (40 cadres) |
| Indicateurs agrégés | Aucun | 17 modules, 30+ KPIs | ∞ |
| Traçabilité actions | Inexistante | Audit log Firestore | 100% |
| Capacité reporting financeurs | Limitée | Rapport institutionnel automatisé | x10 |
| Gestion stages | Inexistante | Module dédié, 5 étapes | Nouveau |
| Réseau entreprises | Informel | Base structurée 10+ partenaires | Nouveau |
| Simulation stratégique | Intuitive | Outil interactif 4 leviers | Nouveau |

*Source : Projection auteur, basée sur les retours d'expérience d'APF France et BRAC*

L'impact financier indirect est significatif : la **capacité accrue à valoriser l'impact** auprès des financeurs (rapports institutionnels professionnels, indicateurs agrégés transparents) devrait permettre à l'association de mobiliser de **nouvelles sources de financement**.

L'impact sur la **qualité de l'accompagnement** est également attendu : la consolidation des données pédagogiques permet aux cadres d'identifier rapidement les bénéficiaires en difficulté, d'ajuster les interventions, et de renforcer la cohérence entre les différents intervenants autour d'un même bénéficiaire.

Enfin, l'impact sur l'**insertion socio-professionnelle** est potentiellement le plus structurant. Avec le module Formation Pro (JRI), le Carnet de Stage et le réseau Entreprises Partenaires, l'association dispose pour la première fois d'un système intégré de préparation à l'emploi pour les 67 bénéficiaires des classes Pro.

### 9.3 Reproductibilité et essaimage

L'un des objectifs sociétaux du projet est de proposer un **modèle reproductible** pour d'autres associations marocaines du tiers-secteur. La plateforme est conçue pour être :

**Adaptable** : la structure des données et l'interface bilingue permettent à n'importe quelle association marocaine de personnaliser les contenus (noms, filières, programmes pédagogiques) sans modification du code.

**Documentée** : le code source est versionné sur GitHub avec commentaires en français, et un guide utilisateur sera produit en complément de ce mémoire.

**Maintenable** : le choix de JavaScript vanille (sans framework) garantit qu'un développeur junior peut reprendre la maintenance. La documentation interne du code est extensive.

**Évolutive** : l'architecture modulaire permet d'ajouter de nouveaux modules (par exemple : facturation, comptabilité, gestion des dons) sans refondre l'ensemble.

À moyen terme (2-3 ans), une **fédération marocaine d'associations utilisatrices** pourrait émerger, partageant un socle technique commun tout en personnalisant les contenus selon leurs missions respectives.

### Conclusion du chapitre 9

Les résultats opérationnels et stratégiques du projet valident les trois hypothèses posées en introduction : (H1 managériale) le système numérique de pilotage agrégé améliore la capacité décisionnelle ; (H2 technique) une plateforme professionnelle peut être déployée à coût nul ; (H3 méthodologique) la validation par simulation statistique déterministe constitue une approche scientifiquement rigoureuse. La plateforme ElAwail Digital n'est pas seulement un outil — elle est un **modèle reproductible** pour le tiers-secteur marocain.

---

## Conclusion de la Partie III

La réalisation concrète de la plateforme ElAwail Digital démontre la faisabilité opérationnelle des choix conceptuels exposés en Partie II. Les dix-sept modules fonctionnels, illustrés par dix-huit captures d'écran, couvrent l'ensemble du cycle de vie d'un bénéficiaire et de la gestion stratégique de l'association. La validation par simulation statistique déterministe valide scientifiquement la robustesse des algorithmes, et les résultats projetés démontrent un impact organisationnel significatif. Reste à présent à dresser le bilan global du projet et à ouvrir des perspectives — c'est l'objet de la **Conclusion générale**.
