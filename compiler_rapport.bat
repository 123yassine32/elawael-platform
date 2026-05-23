@echo off
:: ============================================================
:: Script de compilation XeLaTeX — Rapport PFE ElAwael
:: Double passe nécessaire pour table des matières + références
:: ============================================================
echo Compilation du rapport PFE en cours...
echo.

:: Première passe
echo [1/2] Première passe XeLaTeX...
xelatex -interaction=nonstopmode rapport_pfe.tex

:: Deuxième passe (pour TOC, références croisées)
echo [2/2] Deuxième passe XeLaTeX...
xelatex -interaction=nonstopmode rapport_pfe.tex

echo.
echo ============================================================
echo  Compilation terminée !
echo  Fichier produit : rapport_pfe.pdf
echo ============================================================
pause
