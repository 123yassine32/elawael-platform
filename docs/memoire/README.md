# Mémoire PFE — ElAwail Digital
## Guide complet d'utilisation

> Auteur : Mohamed Yassine MARZOUK
> Master Leadership Managérial 4.0 — FSJES Tétouan
> Année : 2025-2026

---

## 📁 Structure des fichiers

```
docs/memoire/
├── 00-pages-liminaires.md       (Page garde, dédicaces, résumés, listes)
├── 01-introduction.md           (Introduction générale — 5 pages)
├── 02-partie1-cadre.md          (PARTIE I — 15-17 pages, 3 chapitres)
├── 03-partie2-conception.md     (PARTIE II — 15-17 pages, 3 chapitres)
├── 04-partie3-realisation.md    (PARTIE III — 22-25 pages, 3 chapitres + 18 figures)
├── 05-conclusion.md             (Conclusion générale — 5 pages)
├── 06-bibliographie.md          (Bibliographie — hors comptage)
├── 07-annexes.md                (Annexes techniques — hors comptage)
├── GUIDE_SCREENSHOTS.md         (Guide pour prendre les 18 captures)
├── README.md                    (Ce fichier)
├── _archives/                   (Versions longues précédentes — référence)
└── screenshots/                 (Dossier pour stocker les .png)
```

---

## ✅ Conformité fiche technique PFE

| Critère imposé | Valeur cible | Statut |
|---|---|---|
| Volume corps | 50-80 pages | **~67-72 pages** ✅ |
| Police | Times New Roman | À appliquer dans Word |
| Texte | 12pt | À appliquer dans Word |
| Titres principaux | 14pt gras | À appliquer dans Word |
| Sous-titres | 14pt gras | À appliquer dans Word |
| Interligne | 1,5 | À appliquer dans Word |
| Alignement | Justifié | À appliquer dans Word |
| Marges H/B | 2,5 cm | À appliquer dans Word |
| Marge G | 3 cm | À appliquer dans Word |
| Marge D | 2,5 cm | À appliquer dans Word |
| Pagination | Bas centré/droite | À appliquer dans Word |
| Tableaux numérotés | Oui | ✅ 12 tableaux numérotés |
| Figures numérotées | Oui | ✅ 18 figures + sources |
| Citations sourcées | Oui | ✅ Toutes citées |

---

## 🔧 Procédure de conversion vers Word (.docx)

### Étape 1 : Installer Pandoc (gratuit)

Télécharger Pandoc depuis https://pandoc.org/installing.html et l'installer (Windows).

### Étape 2 : Concaténer les fichiers Markdown

Ouvrir un terminal dans `docs/memoire/` et exécuter :

```bash
cat 00-pages-liminaires.md 01-introduction.md 02-partie1-cadre.md \
    03-partie2-conception.md 04-partie3-realisation.md 05-conclusion.md \
    06-bibliographie.md 07-annexes.md > memoire-complet.md
```

(sur Windows PowerShell)
```powershell
Get-Content 00-*.md,01-*.md,02-*.md,03-*.md,04-*.md,05-*.md,06-*.md,07-*.md | Set-Content memoire-complet.md
```

### Étape 3 : Convertir en .docx

```bash
pandoc memoire-complet.md -o memoire-PFE.docx \
  --reference-doc=template-PFE.docx \
  --table-of-contents
```

### Étape 4 : Mettre en forme dans Word

1. Ouvrir `memoire-PFE.docx` dans Word
2. Sélectionner tout (Ctrl+A)
3. Appliquer :
   - **Police** : Times New Roman 12pt
   - **Interligne** : 1,5
   - **Alignement** : Justifié
4. Mise en page → Marges personnalisées :
   - Haut : 2,5 cm | Bas : 2,5 cm
   - Gauche : 3 cm | Droite : 2,5 cm
5. Insertion → Pied de page → Numéro de page (centré)
6. Vérifier la table des matières et les listes (figures, tableaux)

### Étape 5 : Insérer les captures d'écran

Voir `GUIDE_SCREENSHOTS.md` pour la procédure détaillée. Remplacer les blocs `[FIGURE X — ...]` dans Word par l'image réelle avec sa légende numérotée.

---

## 📸 Captures d'écran à prendre (18 figures)

Voir `GUIDE_SCREENSHOTS.md` pour la procédure étape par étape.

**Préparation** :
1. Connexion en admin
2. Console DevTools (F12) → `genererDonneesDemoS2()` (génère ~32 000 docs en 30s)
3. Hard refresh `Ctrl+Shift+R`
4. Mode F11 plein écran
5. Extension GoFullPage pour pages avec scroll

**Liste rapide** :
- Figure 1 : Page de connexion
- Figure 2 : Cockpit complet (full page)
- Figure 3 : Bannière + KPIs
- Figure 4 : Score Organisationnel
- Figure 5 : Décisions en attente
- Figure 6 : Pipeline insertion
- Figure 7 : Formation Pro JRI
- Figure 8 : Skills Radar
- Figure 9 : Accompagnement Spécialisé
- Figure 10 : Carnet de Stage
- Figure 11 : Grille évaluation
- Figure 12 : Entreprises partenaires
- Figure 13 : Simulation stratégique
- Figure 14 : Comparaison scénarios
- Figure 15 : Rapport institutionnel
- Figure 16 : Heatmap
- Figure 17 : Journal d'audit
- Figure 18 : Synthèse PDF

---

## ⚠️ Avant la soutenance

### Placeholders à remplacer
1. `[Encadrant pédagogique]` → Nom réel de ton prof FSJES (4 occurrences)
2. `[Nom 1]`, `[Nom 2]`, `[Nom 3]` → Membres du jury (page garde + remerciements)
3. Date exacte de soutenance

### Relecture recommandée
- [ ] Vérifier l'orthographe et la grammaire (Antidote ou similaire)
- [ ] Adapter la **personnalisation** (anecdotes terrain, expériences vécues)
- [ ] Vérifier que tous les nombres correspondent à la réalité de l'association
- [ ] Confirmer les **sources** citées avec ton encadrant
- [ ] Faire relire par Mme Dghoughi pour validation des informations sur ElAwael

### Volume final estimé
- Corps : ~67-72 pages ✅ (cible 50-80)
- Annexes : ~10-15 pages
- Bibliographie : ~3-4 pages
- **Total document** : ~85-95 pages

---

## 📞 Support

- **Plateforme** : https://123yassine32.github.io/elawael-platform/
- **Code source** : https://github.com/123yassine32/elawael-platform
- **Document méthodologie simulation** : `docs/METHODOLOGIE_SIMULATION.md`

---

*Bonne soutenance ! 🎓*
