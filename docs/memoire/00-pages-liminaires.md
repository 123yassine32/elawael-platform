# PAGES LIMINAIRES

---

## PAGE DE GARDE

```
═════════════════════════════════════════════════════════
                  ROYAUME DU MAROC
        UNIVERSITÉ ABDELMALEK ESSAÂDI
        FACULTÉ DES SCIENCES JURIDIQUES,
        ÉCONOMIQUES ET SOCIALES — TÉTOUAN
═════════════════════════════════════════════════════════


               MÉMOIRE DE FIN D'ÉTUDES
                 pour l'obtention du
            MASTER EN LEADERSHIP MANAGÉRIAL 4.0


          ──────────────────────────────────────


              CONCEPTION ET RÉALISATION
            D'UNE PLATEFORME NUMÉRIQUE
              DE PILOTAGE STRATÉGIQUE
              POUR UNE ASSOCIATION DE
       PERSONNES EN SITUATION DE HANDICAP

      Cas pratique : Association ElAwael-Martil


          ──────────────────────────────────────


    Préparé et soutenu par :
              Mohamed Yassine MARZOUK

    Sous la direction de :
              M./Mme [Encadrant pédagogique]
              Professeur — FSJES Tétouan

    Tutrice professionnelle :
              Mme Kaoutar DGHOUGHI
              Directrice — Association ElAwael-Martil

    Membres du jury :
              Pr. [Nom 1] — Président
              Pr. [Nom 2] — Encadrant
              Pr. [Nom 3] — Examinateur


            Année universitaire 2025 — 2026

═════════════════════════════════════════════════════════
```

---

## DÉDICACES

À mes chers parents, source intarissable d'amour et de soutien, qui m'ont transmis les valeurs du travail et de la persévérance.

À ma famille, pour ses encouragements indéfectibles tout au long de ce parcours.

À mes professeurs de la FSJES Tétouan, qui m'ont fourni les cadres conceptuels nécessaires à ce travail.

À tous les bénéficiaires de l'Association ElAwael-Martil et à leurs familles, dont le courage quotidien constitue ma plus grande source d'inspiration.

À toutes les personnes en situation de handicap au Maroc, dans l'espoir que ce travail contribue, à sa mesure, à l'amélioration de leur quotidien.

*Mohamed Yassine MARZOUK*

---

## REMERCIEMENTS

Au terme de ce projet de fin d'études, j'exprime ma profonde reconnaissance à toutes les personnes qui ont contribué à sa réalisation.

Mes remerciements s'adressent en premier lieu à **M./Mme [Encadrant pédagogique]**, mon encadrant à la Faculté des Sciences Juridiques, Économiques et Sociales de Tétouan, pour ses précieux conseils, sa rigueur scientifique et la qualité de son accompagnement.

Je tiens à exprimer ma plus vive gratitude à **Madame Kaoutar DGHOUGHI**, Directrice de l'Association ElAwael-Martil et tutrice professionnelle de ce projet, pour sa confiance, son engagement humanitaire et son ouverture au numérique qui ont rendu possible ce travail.

Je remercie chaleureusement **l'équipe pédagogique et administrative de l'Association ElAwael-Martil** — 40 éducateurs, éducatrices et formateurs — pour leur accueil et le partage de leur expertise terrain.

Mes remerciements vont également aux **bénéficiaires de l'association** qui m'ont profondément touché par leur courage et leur résilience.

J'adresse mes sincères remerciements aux **membres du jury** — les Professeurs **[Nom 1], [Nom 2] et [Nom 3]** — pour le temps consacré à l'évaluation de ce mémoire.

Je remercie enfin le **corps professoral du Master en Leadership Managérial 4.0** de la FSJES Tétouan, ma **famille** et mes **amis** pour leur soutien constant.

À toutes et tous, MERCI.

*Mohamed Yassine MARZOUK — Tétouan, juin 2026*

---

## RÉSUMÉ

Le présent mémoire porte sur la conception et la réalisation d'une plateforme numérique de pilotage stratégique pour l'Association ElAwael-Martil, organisation à but non lucratif accueillant 228 personnes en situation de handicap dans la région Tanger-Tétouan-Al Hoceima. Face à la fracture numérique du tiers-secteur médico-social marocain (gestion manuelle des dossiers, absence d'indicateurs agrégés, défaut de traçabilité), ce projet propose une réponse intégrée fondée sur les principes du Management 4.0.

La solution développée, **ElAwail Digital**, est une plateforme web déployée à coût nul sur GitHub Pages et adossée à Firebase Firestore. Elle intègre 17 modules fonctionnels, dont : un Cockpit Directeur agrégeant un Score Organisationnel pondéré (40% PEI + 30% présence + 20% indépendance + 10% dossiers) ; un module de Formation Professionnelle avec Indice d'Employabilité (JRI) pour les 67 bénéficiaires des filières Informatique et Couture ; un module Accompagnement Spécialisé aligné sur la Convention CRPD-ONU 2006 pour les 11 bénéficiaires en situation de handicap profond (Indice IBA) ; un Carnet de Stage avec grille d'évaluation employeur ; et un simulateur stratégique interactif à 4 leviers.

La validation algorithmique a été menée par un moteur de simulation statistique déterministe, générant 32 000 documents selon une distribution réaliste à 4 profils. Les indicateurs obtenus (Score 80/100, présence 87%, conversion d'insertion estimée) démontrent la robustesse de la solution et sa pertinence opérationnelle.

Ce projet propose un modèle reproductible pour la digitalisation des associations du tiers-secteur marocain, démontrant qu'une transformation numérique de qualité est possible même dans un contexte de ressources financières limitées.

**Mots-clés** : Management 4.0, Transformation digitale, Handicap, Tiers-secteur, Pilotage stratégique, Score Organisationnel, JRI, IBA, Association, Maroc.

---

## ABSTRACT

This thesis presents the design and implementation of a strategic management digital platform for the ElAwael-Martil Association, a non-profit organization providing care to 228 people with disabilities in the Tangier-Tetouan-Al Hoceima region of Morocco. To address the digital divide of the Moroccan medical-social third sector—manual file management, lack of aggregated indicators, insufficient traceability—this project proposes an integrated answer grounded in Management 4.0 principles.

The solution, **ElAwail Digital**, is a web platform freely deployed on GitHub Pages and backed by Firebase Firestore. It features 17 functional modules: a Director's Cockpit aggregating a weighted Organizational Score (40% IEP + 30% attendance + 20% independence + 10% files); a Vocational Training module with a Job-Readiness Index (JRI) for 67 beneficiaries in IT and Sewing classes; a Specialized Support module aligned with the UN CRPD 2006 Convention for 11 beneficiaries with profound disabilities (Well-being and Autonomy Index – IBA); an Internship Logbook with employer evaluation grid; and an interactive 4-lever strategic simulator.

Algorithmic validation was conducted through a deterministic statistical simulation engine, generating 32,000 documents according to a realistic 4-profile distribution. The indicators obtained (Score 80/100, attendance rate 87%, estimated insertion conversion rate) demonstrate the robustness of the solution and its operational relevance.

This project proposes a reproducible model for digitalizing third-sector associations in Morocco, demonstrating that quality digital transformation is achievable even in resource-constrained contexts.

**Keywords**: Management 4.0, Digital Transformation, Disability, Third Sector, Strategic Management, Organizational Score, JRI, IBA, Non-profit, Morocco.

---

## ملخص

تتناول هذه المذكرة تصميم وتطوير منصة رقمية للقيادة الاستراتيجية لفائدة جمعية الأوائل بمرتيل، الجمعية ذات النفع العام التي تستقبل 228 شخصا في وضعية إعاقة بجهة طنجة-تطوان-الحسيمة. لمواجهة الفجوة الرقمية للقطاع الثالث الطبي-الاجتماعي بالمغرب — التدبير اليدوي للملفات، غياب المؤشرات المجمعة، نقص التتبع — يقترح هذا المشروع جوابا متكاملا قائما على مبادئ القيادة التدبيرية 4.0.

الحل المطور، **ElAwail Digital**، عبارة عن منصة ويب منشورة مجانا على GitHub Pages ومدعومة بـ Firebase Firestore. تتضمن 17 وحدة وظيفية، من بينها لوحة قيادة المدير التي تجمع نقطة تنظيمية مرجحة (40% PEI + 30% الحضور + 20% الاستقلالية + 10% الملفات)، ووحدة التكوين المهني مع مؤشر القابلية للتشغيل (JRI) لـ 67 مستفيدا بقسمي المعلوميات والخياطة، ووحدة المرافقة المتخصصة المتماشية مع اتفاقية الأمم المتحدة CRPD 2006 لـ 11 مستفيدا في وضعية إعاقة عميقة (مؤشر IBA)، ودفتر التداريب مع شبكة تقييم رب العمل، ومحاكي استراتيجي تفاعلي بأربعة محاور.

تم التحقق من متانة الخوارزميات عبر محرك محاكاة إحصائي حتمي، يولد 32 ألف وثيقة وفق توزيع واقعي لأربعة أنماط. تبرهن النتائج المحصلة على ملاءمة الحل وعمليته.

**الكلمات المفتاحية** : القيادة التدبيرية 4.0، التحول الرقمي، الإعاقة، القطاع الثالث، القيادة الاستراتيجية، النقطة التنظيمية، JRI، IBA، جمعية، المغرب.

---

## LISTE DES ABRÉVIATIONS

| Abréviation | Signification |
|---|---|
| **ABLLS-R** | Assessment of Basic Language and Learning Skills - Revised |
| **API** | Application Programming Interface |
| **CDD/CDI** | Contrat à Durée Déterminée / Indéterminée |
| **CIN** | Carte d'Identité Nationale |
| **CRPD** | Convention on the Rights of Persons with Disabilities (ONU, 2006) |
| **DI** | Déficience Intellectuelle |
| **ESAT** | Établissement et Service d'Aide par le Travail |
| **FSJES** | Faculté des Sciences Juridiques, Économiques et Sociales |
| **HCP** | Haut Commissariat au Plan |
| **IBA** | Indice de Bien-être et d'Autonomie |
| **JRI** | Job-Readiness Index |
| **KPI** | Key Performance Indicator |
| **ONDH** | Observatoire National du Développement Humain |
| **OMS** | Organisation Mondiale de la Santé |
| **ONU** | Organisation des Nations Unies |
| **PEI** | Programme Éducatif Individualisé |
| **PFE** | Projet de Fin d'Études |
| **PII** | Personally Identifiable Information |
| **PSH** | Personnes en Situation de Handicap |
| **RGPD** | Règlement Général sur la Protection des Données |
| **RGPH** | Recensement Général de la Population et de l'Habitat |
| **TSA** | Trouble du Spectre Autistique |
| **UI / UX** | User Interface / User Experience |

---

## LISTE DES FIGURES

| N° | Titre | Page |
|---|---|---|
| Figure 1 | Page d'authentification sécurisée multi-rôles | — |
| Figure 2 | Vue d'ensemble du Cockpit Directeur | — |
| Figure 3 | Bannière institutionnelle et indicateurs feux tricolores | — |
| Figure 4 | Score Organisationnel pondéré et décomposition | — |
| Figure 5 | Module 'Décisions en attente' | — |
| Figure 6 | Pipeline d'insertion socio-professionnelle | — |
| Figure 7 | Tableau de bord Formation Professionnelle (JRI) | — |
| Figure 8 | Skills Radar individuel — 5 dimensions du JRI | — |
| Figure 9 | Module Accompagnement Spécialisé — IBA | — |
| Figure 10 | Carnet de Stage — liste des parcours | — |
| Figure 11 | Grille d'évaluation hebdomadaire de stage | — |
| Figure 12 | Réseau des entreprises partenaires | — |
| Figure 13 | Simulateur stratégique interactif | — |
| Figure 14 | Comparaison multi-scénarios | — |
| Figure 15 | Rapport institutionnel automatisé | — |
| Figure 16 | Heatmap des risques par classe | — |
| Figure 17 | Journal d'audit et traçabilité | — |
| Figure 18 | Synthèse exécutive PDF — A4 exportable | — |

---

## LISTE DES TABLEAUX

| N° | Titre | Page |
|---|---|---|
| Tableau 1 | Statistiques nationales sur le handicap au Maroc | — |
| Tableau 2 | Évolution juridique du cadre marocain du handicap | — |
| Tableau 3 | Piliers du Management 4.0 et applications | — |
| Tableau 4 | Effectifs et répartition des filières — ElAwael | — |
| Tableau 5 | Diagnostic préalable — Points forts et faiblesses | — |
| Tableau 6 | Architecture technique de la plateforme | — |
| Tableau 7 | Pondération du Score Organisationnel | — |
| Tableau 8 | Pondération différenciée du JRI par classe | — |
| Tableau 9 | Niveaux et mentions de l'IBA | — |
| Tableau 10 | Distribution statistique des profils simulés | — |
| Tableau 11 | Validation — Indicateurs obtenus vs attendus | — |
| Tableau 12 | Bilan comparatif — Avant vs Après digitalisation | — |

---

## SOMMAIRE

```
Pages liminaires .................................................. i-x

Introduction générale .............................................. 1

PARTIE I — CADRE THÉORIQUE ET CONTEXTUEL ......................... 6
  Chapitre 1 : Le secteur du handicap au Maroc                       8
  Chapitre 2 : Management 4.0 et tiers-secteur                       13
  Chapitre 3 : L'Association ElAwael-Martil                         18

PARTIE II — DIAGNOSTIC ET CONCEPTION                              22
  Chapitre 4 : Diagnostic de l'existant                             24
  Chapitre 5 : Conception de la solution                            29
  Chapitre 6 : Architecture technique                               34

PARTIE III — RÉALISATION ET RÉSULTATS                             39
  Chapitre 7 : Implémentation des modules piliers                   41
  Chapitre 8 : Validation par simulation statistique                52
  Chapitre 9 : Résultats et impacts                                 56

Conclusion générale .............................................. 62
Bibliographie .................................................... 67
Annexes .......................................................... 71
```
