# -*- coding: utf-8 -*-
"""Cache le bouton 'Générer données démo S2' dans le Cockpit."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

old = 'onclick="genererDonneesDemoS2()" style="border-color:#7c3aed;color:#7c3aed;background:rgba(124,58,237,.07)" title="Générer données démo S2 (présences/ABLLS/ghiyab) pour tous les bénéficiaires">Générer données démo S2</button>'
new = 'onclick="genererDonneesDemoS2()" style="display:none;border-color:#7c3aed;color:#7c3aed;background:rgba(124,58,237,.07)" title="[Outil méthodologique - caché par défaut] Accessible via console DevTools : genererDonneesDemoS2()">Outil méthodologique de simulation</button>'

if old not in html:
    print("ERR : ancien texte non trouvé. Le bouton a peut-être déjà été modifié.")
    sys.exit(1)

html = html.replace(old, new)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Bouton 'Générer données démo S2' caché du Cockpit.")
print("Reste accessible via la console DevTools : genererDonneesDemoS2()")
