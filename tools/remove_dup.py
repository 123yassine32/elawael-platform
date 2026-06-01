# -*- coding: utf-8 -*-
"""Supprime le bloc 'Risque par classe + Alertes urgentes' du Cockpit."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# Marker start
start_marker = '<!-- ══ Ligne décisionnelle — Risque par classe + Alertes urgentes ══ -->'
# End marker (after the last div of the row)
end_marker = 'id="adm-auto-alertes"></div> </div> </div> </div>'

start_idx = html.find(start_marker)
if start_idx < 0:
    print("ERR: start marker not found")
    sys.exit(1)

end_idx = html.find(end_marker, start_idx)
if end_idx < 0:
    print("ERR: end marker not found")
    sys.exit(1)

end_idx += len(end_marker)

before = html[:start_idx]
removed = html[start_idx:end_idx]
after = html[end_idx:]

print(f"Bloc à supprimer : {len(removed)} caractères")
print(f"Premier 200 chars : {removed[:200]}")
print(f"Derniers 200 chars : {removed[-200:]}")

# Replacement = just a comment
replacement = '<!-- Bloc Risque par classe + Alertes urgentes SUPPRIMÉ — couvert par Heatmap + Tableau classes + Décisions en attente -->'

new_html = before + replacement + after
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"✅ Sauvegardé. Diff: -{len(removed)} +{len(replacement)} = {len(replacement) - len(removed)} chars")
