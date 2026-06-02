# ANNEXES

---

## ANNEXE A — Spécifications techniques détaillées de la plateforme

### A.1 Inventaire des dix-sept modules implémentés

| N° | Module | Sidebar | Fonction principale |
|---|---|---|---|
| 1 | Cockpit Directeur | DÉCISION | Vue agrégée temps réel |
| 2 | Simulation stratégique | DÉCISION | Aide à la décision interactive |
| 3 | Rapport institutionnel | DÉCISION | Reporting financeur automatisé |
| 4 | Bénéficiaires & Classes | PILOTAGE | Gestion fiches individuelles |
| 5 | PEI Global | PILOTAGE | Suivi des objectifs pédagogiques |
| 6 | Formation Professionnelle | PILOTAGE | JRI + Skills Radar + Stages + Entreprises |
| 7 | Accompagnement Spécialisé | PILOTAGE | IBA aligné CRPD-ONU 2006 |
| 8 | Alertes & Risques | PILOTAGE | Hub : alertes + heatmap + recommandations |
| 9 | Équipe & RH | ORGANISATION | Cadres + contrats + formations + demandes |
| 10 | Journal d'audit | ORGANISATION | Traçabilité intégrale |
| 11 | Archives annuelles | ORGANISATION | Historique pluri-semestriel |
| 12 | Gestion utilisateurs | ORGANISATION | Comptes Firestore (admin only) |
| 13 | Carnet de Stage | (sous Formation Pro) | CRUD stages + évaluations |
| 14 | Entreprises Partenaires | (sous Formation Pro) | Réseau insertion |
| 15 | Recommandations | (sous Alertes) | Consultants externes |
| 16 | Heatmap des risques | (sous Alertes) | Vue par classe |
| 17 | Exports PDF | Transversal | 9 types de PDF différents |

*Source : Inventaire fonctionnel auteur, plateforme ElAwail Digital, juin 2026*

### A.2 Modèle de données Firestore

```
firestore/
├── users/{uid}                          # Profils utilisateurs
│   ├── role: 'admin' | 'gestionnaire' | 'educateur' | 'consultant'
│   ├── teacherId: string
│   └── lastLogin: timestamp
│
├── userData/{uid}/keys/{key}            # Données privées par utilisateur
│   ├── ea_presences                     # Présences saisies
│   ├── ea_suivis                        # Suivis pédagogiques
│   ├── ea_notes                         # Notes /20
│   └── ea_pei_statuses                  # Statuts PEI
│
├── org_shared/{teacherId__key}          # Données partagées (admin lit tout)
│   ├── lamnasra__ea_presences
│   ├── lamnasra__ea_suivis
│   └── global__ea_entreprises
│
├── beneficiaires/{docId}                # PII bénéficiaires
│   ├── nom, ddn, handicap
│   ├── tel, adresse, tuteur
│   └── _updatedAt
│
├── audit_logs/{id}                      # Journal d'audit
│   ├── ts, user, role
│   ├── type, action, detail
│   └── uid
│
└── rh_demandes/{id}                     # Demandes RH
    ├── teacherId, nomCadre, classe
    ├── type, priorite, motif
    └── statut, noteAdmin
```

### A.3 Stack technique complet

| Couche | Technologies | Versions |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ | Standards W3C |
| Graphiques | Chart.js | 4.4.1 |
| Authentification | Firebase Auth | 10.x |
| Base de données | Firebase Firestore | NoSQL |
| Stockage fichiers | Firebase Storage | 10.x |
| Hébergement | GitHub Pages | — |
| CI/CD | GitHub Actions | — |
| Versioning | Git + GitHub | — |
| Génération PDF | jsPDF + html2canvas | 2.5 + 1.4 |
| Tableurs | SheetJS (xlsx) | 0.18 |

---

## ANNEXE B — Captures d'écran complémentaires

> *Cette annexe regroupe les captures d'écran additionnelles non intégrées dans le corps du mémoire. Numérotation : Figure A.1, A.2, etc.*

### Figure A.1 — Authentification : page d'erreur (mauvais mot de passe)
*[Placeholder pour capture : tentative de connexion avec mauvais identifiants → message d'erreur clair en français]*

### Figure A.2 — Fiche détaillée d'un bénéficiaire (vue admin)
*[Placeholder pour capture : page complète d'un bénéficiaire avec onglets Présences / Suivis / Notes / Rapports / PEI / Documents]*

### Figure A.3 — Module PEI Global : tableau par classe enrichi
*[Placeholder pour capture : section PEI Global montrant le détail par classe avec compteurs done / in-progress / new]*

### Figure A.4 — Évaluation ABLLS-R pour un bénéficiaire
*[Placeholder pour capture : grille d'évaluation ABLLS avec items مستقل / بمساعدة / لا يقوم]*

### Figure A.5 — Module Équipe & RH (vue admin)
*[Placeholder pour capture : onglet Demandes RH avec liste des demandes en attente, contrats et formations]*

### Figure A.6 — Système d'alertes (page complète)
*[Placeholder pour capture : section Alertes & Risques avec liste détaillée des 5 types d'alertes]*

### Figure A.7 — Archives annuelles
*[Placeholder pour capture : section Archives montrant les semestres archivés et le bouton "Démarrer nouvelle année"]*

### Figure A.8 — Gestion des utilisateurs (vue admin uniquement)
*[Placeholder pour capture : liste des comptes Firestore avec rôles, dernière connexion, actions]*

### Figure A.9 — Vue mobile responsive
*[Placeholder pour capture : adaptation mobile à 375px avec menu hamburger]*

### Figure A.10 — Génération démo (console développeur)
*[Placeholder pour capture : console Chrome DevTools montrant l'exécution de genererDonneesDemoS2()]*

---

## ANNEXE C — Méthodologie de simulation statistique (extrait du code)

### C.1 Fonction de hash déterministe

```javascript
/**
 * Pseudo-aléatoire déterministe basé sur le hash du nom du bénéficiaire.
 * Garantit la reproductibilité scientifique des tests.
 */
function _demoRand(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 10000) / 10000;
}
```

### C.2 Attribution déterministe du profil

```javascript
/**
 * Distribution statistique sectorielle :
 * 70% assidus, 20% réguliers, 8% irréguliers, 2% à risque
 */
function _demoProfilBenef(nom) {
  const r = _demoRand(nom + 'profile') * 100;
  if (r < 70) return { type: 'assidu',     tauxPresMin: 92, tauxPresMax: 95 };
  if (r < 90) return { type: 'regulier',   tauxPresMin: 83, tauxPresMax: 88 };
  if (r < 98) return { type: 'irregulier', tauxPresMin: 65, tauxPresMax: 74 };
  return         { type: 'risque',     tauxPresMin: 45, tauxPresMax: 54 };
}
```

### C.3 Calendrier réel S2 extrait des fichiers Excel

```javascript
/**
 * 92 jours ouvrés du semestre 2 (Lun-Ven, vacances exclues).
 * Extraits des fichiers الغياب اليومي fournis par la directrice.
 */
const _DEMO_S2_JOURS_OUVRES = [
  '2026-02-11','2026-02-12','2026-02-13',  // Semaine 2 fév
  '2026-02-16','2026-02-17','2026-02-18','2026-02-19','2026-02-20',
  // ... 92 jours au total
  '2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26'
];
```

---

## ANNEXE D — Pondérations et formules des indicateurs

### D.1 Score Organisationnel

```
Score = (PEI × 40%) + (Présence × 30%) + (Indépendance × 20%) + (Dossiers × 10%)

Où :
- PEI         = (objectifs done × 100 + in-progress × 50) / total
- Présence    = % présences observées (S2 en cours)
- Indépendance = % items ABLLS "مستقل"
- Dossiers    = % dossiers admin complets
```

### D.2 Job-Readiness Index (JRI)

```
JRI_Info     = Hard×40% + Production×25% + Soft×20% + Stages×10% + JobReady×5%
JRI_Couture  = Production×35% + Hard×30% + Soft×20% + Stages×10% + JobReady×5%

Mention :
- ≥85 : Prêt CDI / Études supérieures
- 70-84 : Prêt stage rémunéré
- 55-69 : Stage d'observation
- 40-54 : Renforcement
- <40  : Atelier protégé / ESAT
```

### D.3 Indice de Bien-être & Autonomie (IBA)

```
IBA = (Autonomie × 40%) + (Social × 25%) + (Bien-être × 20%) + (Famille × 10%) + (Médical × 5%)

Mention :
- ≥80 : Épanouissement remarquable
- 65-79 : Bien-être stable
- 50-64 : Évolution progressive
- 35-49 : Vigilance requise
- <35  : Intervention prioritaire
```

---

## ANNEXE E — Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Données personnelles par utilisateur
    match /userData/{uid}/{col}/{doc=**} {
      allow read, write: if request.auth != null
                          && request.auth.uid == uid;
    }

    // Profils utilisateurs
    match /users/{uid} {
      allow read, write: if request.auth != null;
    }

    // Journal d'audit
    match /audit_logs/{doc} {
      allow read, write: if request.auth != null;
    }

    // Demandes RH
    match /rh_demandes/{doc} {
      allow read, write: if request.auth != null;
    }

    // Bénéficiaires (PII)
    match /beneficiaires/{doc} {
      allow read, write: if request.auth != null;
    }

    // Collection partagée
    match /org_shared/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ANNEXE F — Guide utilisateur (extrait)

### F.1 Première connexion administrateur

1. Accéder à `https://123yassine32.github.io/elawael-platform/`
2. Saisir identifiants admin fournis par l'équipe technique
3. Au premier accès, parcourir la sidebar pour découvrir les modules
4. Cliquer sur "Cockpit Directeur" pour la vue d'ensemble
5. Pour générer les données de démonstration : ouvrir la console DevTools (F12) et taper `genererDonneesDemoS2()`

### F.2 Saisir une présence (rôle éducateur)

1. Se connecter avec son compte éducateur
2. Aller dans la section "Présences" du portail
3. Sélectionner la date, le type de séance et les bénéficiaires
4. Cocher Présent (P) ou Absent (A) pour chacun
5. Cliquer "Enregistrer" — la donnée est synchronisée temps réel

### F.3 Générer un rapport institutionnel PDF

1. Connecté en admin, aller dans "Rapport institutionnel"
2. Vérifier que les indicateurs reflètent la période souhaitée
3. Cliquer sur le bouton "Exporter PDF"
4. Le PDF multi-pages se télécharge automatiquement
5. Nommer le fichier de manière explicite avant transmission

---

## ANNEXE G — Liste exhaustive des bénéficiaires (extrait)

> *Pour des raisons de confidentialité (RGPD-like), la liste complète des 228 bénéficiaires n'est pas reproduite ici. Les données sont accessibles uniquement aux utilisateurs autorisés via la plateforme.*

Extrait illustratif (10 bénéficiaires sur 228, anonymisés) :

| ID interne | Filière | Cadre | Niveau |
|---|---|---|---|
| BEN-001 | Autisme | Dina E. | Avancé |
| BEN-002 | Informatique | Mohamed Y. M. | Intermédiaire |
| BEN-003 | Couture | Iqrar Z. | Avancé |
| BEN-004 | DI profonde | Qadouri M. | (IBA) |
| BEN-005 | IMC | Asmaa S. | Adapté |
| BEN-006 | Déficience auditive | Firouz | (signes) |
| BEN-007 | Informatique | Mohamed Y. M. | Débutant |
| BEN-008 | Autisme | Youssra A. | Intermédiaire |
| BEN-009 | DI | Iman R. | Adapté |
| BEN-010 | Couture | Hanane S. | Débutant |

*Source : Extraction anonymisée, plateforme ElAwail Digital, juin 2026*

---

*Fin des annexes — Document de 75 pages hors annexes*
