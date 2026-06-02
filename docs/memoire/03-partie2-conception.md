# PARTIE II — DIAGNOSTIC ET CONCEPTION

> *Cette deuxième partie présente la démarche de transition de la phase théorique à la phase opérationnelle. Elle articule trois chapitres : le diagnostic de l'existant à l'Association ElAwael-Martil (Ch. 4), la conception fonctionnelle de la solution (Ch. 5) et son architecture technique (Ch. 6).*

---

## CHAPITRE 4 — Diagnostic de l'existant

### Introduction

Toute démarche de transformation digitale rigoureuse commence par un **diagnostic préalable** des processus existants. Ce chapitre présente l'audit mené entre janvier et mars 2026 au sein de l'Association ElAwael-Martil, identifiant les dysfonctionnements et cartographiant les besoins.

### 4.1 Méthodologie d'audit

L'audit a été conduit selon une triple approche : (1) **observation participante** de l'auteur dans le cadre de ses fonctions de formateur en informatique, lui permettant d'identifier les processus de l'intérieur ; (2) **entretiens semi-directifs** avec Madame Kaoutar Dghoughi, directrice, et avec six cadres éducateurs représentant les différentes filières ; (3) **analyse documentaire** des outils existants (registres papier, fichiers Excel mensuels d'absences, dossiers bénéficiaires, programmes pédagogiques individualisés).

### 4.2 Cartographie des processus actuels

Le diagnostic révèle une réalité organisationnelle fondée presque exclusivement sur des outils non numériques.

**Gestion des bénéficiaires** : Chaque bénéficiaire dispose d'un dossier physique conservé dans un classeur (informations personnelles, certificats médicaux, autorisations familiales). La mise à jour de ces dossiers est manuelle, sujette aux oublis, et l'information n'est pas accessible simultanément à plusieurs cadres.

**Suivi pédagogique** : Le Programme Éducatif Individualisé (PEI) de chaque bénéficiaire est rédigé annuellement en début de semestre. Le suivi quotidien des objectifs est consigné par chaque cadre dans ses propres carnets, sans consolidation centrale. L'évaluation de la progression se fait à intervalles irréguliers et reste largement subjective.

**Présences et absences** : Les présences sont saisies quotidiennement sur des **fiches mensuelles Excel** (الغياب اليومي), une feuille par éducatrice et par mois. Chaque feuille comporte un tableau avec les bénéficiaires en lignes et les jours en colonnes (codes P = présent, A = absent). Ces fichiers sont stockés localement sur les ordinateurs des cadres, sans sauvegarde systématique ni consolidation à l'échelle de l'association.

**Évaluations standardisées** : Les évaluations ABLLS-R, Tan9it, Ri3aya datiya et Talabat sont consignées sur des grilles papier conservées dans les classeurs des cadres. Aucune agrégation ni comparaison inter-bénéficiaires n'est possible sans un travail manuel considérable.

**Reporting administratif** : Les rapports mensuels et semestriels sont rédigés manuellement par la direction à partir des données remontées oralement ou par feuilles papier. Le délai de production d'un rapport institutionnel dépasse régulièrement deux semaines de travail administratif.

**Gestion des stages et insertion** : Pour les 67 bénéficiaires des filières Formation Professionnelle (Informatique et Couture), il n'existe **aucun système de gestion des stages**. Les contacts avec d'éventuelles entreprises d'accueil sont informels, sans formalisation de conventions, sans grille d'évaluation employeur, sans suivi de l'insertion.

### 4.3 Identification des dysfonctionnements

**Tableau 5 : Diagnostic préalable — Points forts et faiblesses**

| Dimension | Points forts existants | Faiblesses identifiées |
|---|---|---|
| Équipe humaine | Engagement, expérience, stabilité | Surcharge administrative, isolement |
| Pédagogie | Outils standardisés (PEI, ABLLS) | Pas d'agrégation, suivi subjectif |
| Présences | Saisie disciplinée par cadres | Non centralisé, pas de consolidation |
| Évaluations | Multi-grilles riches | Pas de calcul de score global |
| Reporting | Volonté de transparence | Délais > 2 semaines, dépendance manuelle |
| Insertion Pro | 67 bénéficiaires concernés | Pas de gestion stages, pas de partenariats formalisés |
| Gouvernance | Direction visionnaire | Pas de tableau de bord directorial |
| Pilotage stratégique | Objectifs clairs | Pas d'indicateurs agrégés, décisions intuitives |

*Source : Diagnostic auteur, janvier-mars 2026*

Quatre dysfonctionnements structurants émergent : (1) **perte d'information** entre cadres faute de système central ; (2) **invisibilité opérationnelle** de la direction qui ne dispose pas d'une vue agrégée en temps réel ; (3) **incapacité à valoriser l'impact** auprès des financeurs faute d'indicateurs synthétiques ; (4) **absence totale d'outils pour l'insertion socio-professionnelle**, alors que c'est l'objectif final des 67 bénéficiaires des classes Pro.

### 4.4 Cartographie des besoins

Le diagnostic permet d'identifier six besoins prioritaires : (1) un **système centralisé** accessible à tous les cadres en temps réel ; (2) des **indicateurs agrégés** synthétisant la performance multidimensionnelle de l'association ; (3) une **traçabilité intégrale** des actions à des fins d'audit et de transparence ; (4) un **module dédié à l'insertion** pour les Formation Pro ; (5) un **système d'export automatisé** pour les rapports institutionnels ; (6) un **outil d'aide à la décision** pour la direction (simulation, projection).

À ces besoins fonctionnels s'ajoutent des **contraintes structurelles fortes** : (1) budget zéro (financement extérieur exclu) ; (2) compatibilité avec les compétences informatiques variables des cadres ; (3) sécurité des données personnelles ultra-sensibles (CIN, dossiers médicaux, adresses) ; (4) maintien du bilinguisme français-arabe ; (5) accessibilité mobile et desktop.

### Conclusion du chapitre 4

Le diagnostic révèle ainsi une organisation **mûre pour la transformation digitale** : engagement humain réel, outils standardisés existants, direction ouverte, mais absence totale d'infrastructure numérique de pilotage. Les six besoins identifiés et les contraintes structurelles constituent le cahier des charges fonctionnel de la solution à concevoir, présentée dans le chapitre suivant.

---

## CHAPITRE 5 — Conception de la solution

### Introduction

Sur la base du diagnostic, ce chapitre présente la conception fonctionnelle de la plateforme **ElAwail Digital** : vision, objectifs, modélisation des modules et choix méthodologiques.

### 5.1 Vision et objectifs de la solution

La vision retenue se résume en une phrase : *Doter l'Association ElAwael-Martil d'un système d'information intégré, accessible à coût nul, transformant la gestion administrative en pilotage stratégique data-driven, tout en préservant l'humanité de la relation éducative.*

Six objectifs opérationnels en découlent : (1) **digitaliser intégralement** les processus papier (présences, suivis, rapports) ; (2) **agréger les données** en indicateurs synthétiques (Score Organisationnel, JRI, IBA) ; (3) **automatiser les reportings** vers les financeurs et l'administration ; (4) **professionnaliser l'insertion** socio-professionnelle des 67 bénéficiaires Formation Pro ; (5) **renforcer la traçabilité** et la transparence ; (6) **outiller la décision** stratégique de la direction.

### 5.2 Modélisation fonctionnelle

La plateforme s'organise autour de **trois niveaux de pilotage** correspondant aux trois trajectoires possibles d'un bénéficiaire :

**Niveau 1 — Pilotage pédagogique (PEI)** : couvre tous les 228 bénéficiaires de l'association, particulièrement ceux des filières Autisme, Déficience intellectuelle, Déficience auditive et IMC. Indicateur central : taux de réalisation des objectifs PEI individualisés.

**Niveau 2 — Pilotage de l'insertion (JRI)** : couvre exclusivement les **67 bénéficiaires des classes Formation Professionnelle** (Informatique et Couture). Indicateur central : Job-Readiness Index (Indice d'Employabilité) intégrant cinq dimensions — compétences techniques, savoir-être, préparation à l'emploi, production tangible, expérience en stage.

**Niveau 3 — Pilotage de l'accompagnement (IBA)** : couvre les **11 bénéficiaires de la filière Déficience Intellectuelle profonde**, pour qui l'objectif n'est pas l'insertion professionnelle mais le bien-être quotidien, conformément à la Convention CRPD-ONU 2006. Indicateur central : Indice de Bien-être et d'Autonomie (IBA) intégrant cinq dimensions — autonomie quotidienne, intégration sociale, qualité de vie, soutien familial, suivi médical.

Cette **différenciation des trajectoires** constitue l'innovation conceptuelle majeure du projet : refuser une mesure de performance unique pour tous, et adapter les indicateurs au projet de vie réel de chaque bénéficiaire.

À ces trois niveaux s'ajoute un **pilotage transversal** assuré par : le **Cockpit Directeur** (vue agrégée pour la direction), la **Simulation Stratégique** (aide à la décision interactive), le **Rapport Institutionnel** (livrable financeur), le **Journal d'Audit** (traçabilité), la **Heatmap des risques** (vue par classe), et le **Système d'exports PDF**.

### 5.3 Choix méthodologiques

Plusieurs choix structurants ont guidé la conception :

**Approche itérative agile** : développement par cycles courts (sprints d'une semaine), avec mises en production fréquentes et validation continue par la directrice. Cette méthode permet d'éviter l'« effet tunnel » des projets longs et d'ajuster les fonctionnalités à mesure que les usages se révèlent.

**Architecture progressive** : la plateforme a été construite par couches successives — fondations (authentification, données), modules métier (PEI, suivis, présences), indicateurs agrégés (Score, JRI, IBA), pilotage stratégique (Cockpit, Simulation), et reportings (exports PDF).

**Bilinguisme natif** : conception bilingue français-arabe dès le départ, avec basculement de direction (LTR/RTL) et traduction de tous les libellés. Cette caractéristique répond à la réalité linguistique marocaine et à la mission de l'association.

**Multi-rôles avec restrictions** : quatre rôles d'utilisateurs sont prévus — Administrateur (accès complet), Gestionnaire (modification sans suppression), Éducateur (accès à ses propres bénéficiaires), Consultant (lecture seule avec masquage des données personnelles sensibles).

**Mobile-first responsive** : interface adaptative fonctionnant sur smartphones (≥375px), tablettes et postes de travail, sans nécessiter d'application native à installer.

**Open data interne, données sensibles protégées** : les indicateurs agrégés sont transparents et partagés ; les données personnelles identifiables (PII) sont chiffrées et soumises à des règles d'accès strictes (RGPD-like).

### Conclusion du chapitre 5

La conception fonctionnelle d'ElAwail Digital s'articule autour de **trois trajectoires différenciées** (PEI, JRI, IBA) complétées par des modules transversaux de pilotage stratégique. Les choix méthodologiques — agilité, architecture progressive, bilinguisme, multi-rôles — répondent aux contraintes structurelles identifiées. L'architecture technique présentée dans le chapitre suivant traduit ces choix en réalisations concrètes.

---

## CHAPITRE 6 — Architecture technique

### Introduction

Ce chapitre présente les choix techniques de la plateforme ElAwail Digital : stack technologique, modèle de données, sécurité et conformité.

### 6.1 Stack technologique

L'architecture retenue est **trois-tiers**, séparant la présentation, la logique applicative et la persistance des données.

**Tableau 6 : Architecture technique de la plateforme ElAwail Digital**

| Couche | Technologie | Justification |
|---|---|---|
| Présentation (client) | HTML5, CSS3, JavaScript vanille | Léger, universel, pas de framework lourd |
| Graphiques interactifs | Chart.js 4.4 | Open-source, riche, performant |
| Logique applicative | JavaScript ES6+ modulaire | Compétences disponibles, pas de compilation |
| Authentification | Firebase Auth | Gratuit, sécurité industrielle |
| Persistance des données | Firebase Firestore (NoSQL) | Temps réel, scalable, gratuit (plan Spark) |
| Hébergement | GitHub Pages | Gratuit, HTTPS, CI/CD intégré |
| Versioning | Git + GitHub | Traçabilité du code, déploiement automatique |
| Documents PDF | jsPDF + html2canvas | Génération côté client sans serveur |
| Tableurs | SheetJS (xlsx) | Import/export Excel natif |

*Source : Synthèse auteur, choix d'architecture du projet*

Le choix de **JavaScript vanille** (sans framework comme React ou Vue) répond à plusieurs impératifs : (1) charge cognitive minimale pour la maintenance future par d'autres développeurs ; (2) absence de processus de compilation ; (3) compatibilité maximale avec tous les navigateurs ; (4) déploiement sans build sur GitHub Pages.

Le couple **Firebase + GitHub Pages** constitue le cœur du choix « budget zéro » : Firebase Spark Plan offre gratuitement 1 Go de stockage Firestore, 50 000 lectures/jour et 20 000 écritures/jour — largement suffisant pour une association de 228 bénéficiaires. GitHub Pages héberge le site statique gratuitement avec HTTPS automatique.

### 6.2 Modèle de données

Les données sont organisées dans **plusieurs collections Firestore** distinctes :

**Collections privées par utilisateur** (`userData/{uid}/keys/{clé}`) : chaque utilisateur stocke ses propres données dans une collection privée accessible uniquement par lui (règle Firestore stricte). Cette architecture garantit la confidentialité des données métier sensibles.

**Collections partagées en lecture multi-rôles** : les données nécessitant une consolidation administrateur sont stockées dans des collections accessibles à l'admin :
- `org_shared/{teacherId}__{clé}` : données partagées des cadres (présences, suivis, notes, évaluations) consolidées par l'admin
- `audit_logs/{doc}` : journal d'audit global avec traçabilité de chaque action
- `rh_demandes/{id}` : demandes de ressources humaines (congés, formations, attestations)
- `beneficiaires/{docId}` : données PII sensibles des bénéficiaires (handicap, adresse, tuteurs)

Cette **séparation par sensibilité** permet de respecter le principe de moindre privilège tout en garantissant la consolidation nécessaire au pilotage stratégique.

### 6.3 Sécurité et conformité

La sécurité de la plateforme repose sur plusieurs mécanismes complémentaires :

**Authentification** : Firebase Authentication, avec gestion des sessions, persistance configurable, et possibilité de reset par email. Aucun mot de passe en clair n'est stocké côté application.

**Règles Firestore** : règles déclaratives strictes garantissant que chaque utilisateur ne peut accéder qu'aux données qui le concernent. Exemple : un éducateur ne peut lire que ses propres bénéficiaires et son propre journal de présences ; un admin peut tout lire mais sans modifier les données privées des autres.

**Chiffrement** : toutes les communications client-serveur sont en HTTPS (TLS 1.3). Firebase chiffre également les données au repos sur ses serveurs.

**Audit log** : chaque action sensible (connexion, modification, suppression, export) est automatiquement journalisée avec horodatage, utilisateur, type d'action et détail. Ce journal d'audit est consultable par l'admin et constitue un élément clé de la conformité RGPD-like.

**Masquage des données sensibles** : pour le rôle Consultant (audit externe), les champs personnels identifiables (CIN, téléphone, adresse) sont masqués automatiquement à l'affichage. Cette fonctionnalité respecte le principe de minimisation des données.

**Sauvegarde** : la base Firestore étant hébergée par Google avec réplication multi-zones, le risque de perte de données est extrêmement faible. Une procédure d'export Excel mensuel complète cette sauvegarde implicite.

### Conclusion du chapitre 6

L'architecture technique de la plateforme ElAwail Digital combine ainsi **performance, sécurité, scalabilité et gratuité**. Le choix de JavaScript vanille, de Firebase Firestore et de GitHub Pages constitue une **stack moderne mais frugale**, parfaitement adaptée aux contraintes d'une association à budget contraint. Les mécanismes de sécurité multi-couches garantissent la protection des données personnelles sensibles tout en assurant l'accès consolidé nécessaire au pilotage stratégique.

---

## Conclusion de la Partie II

Au terme de cette partie, le projet est défini sur le plan fonctionnel et technique. Le **diagnostic** révèle une association mûre pour la transformation, avec six besoins prioritaires et des contraintes structurelles fortes. La **conception** propose une architecture autour de trois trajectoires différenciées (PEI, JRI, IBA) complétées par des modules transversaux. L'**architecture technique** mobilise un stack moderne et frugal (JavaScript + Firebase + GitHub Pages), permettant un déploiement à coût nul tout en garantissant performance et sécurité.

La **Partie III** présente la réalisation concrète de ces choix : implémentation des modules piliers illustrée par des captures d'écran de la plateforme déployée, méthodologie de validation par simulation statistique, et résultats obtenus.
