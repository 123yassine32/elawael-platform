# -*- coding: utf-8 -*-
"""3ème passage : nettoyage aggressif des emojis encore présents."""
import re, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

orig = html
orig_size = len(html)

# Liste des emojis à supprimer (avec espace après)
# On garde uniquement : 🟢🟡🔴🟠 (status), ✅❌🔄 (statuts objectifs), 🏆 (badge)
# Et les emojis nav-icon de la sidebar (qui sont dans <span class="nav-icon">)

EMOJIS_TO_KILL = [
    # Picto déco classique
    '📊', '📈', '📉', '📋', '📝', '📒', '📥', '📤', '📄', '📁', '📌', '📍',
    '🎯', '🚀', '🌟', '💡', '⚡', '🔔', '🎓', '🧠', '⭐', '✨', '🎲',
    '🏷', '🏷️', '📅', '🎚', '🎚️',
    # Outils & symboles
    '⚖', '⚖️', '🕸', '🕸️', '🔍', '🔎', '🗂', '🗂️', '🛠', '🛠️',
    '🔧', '🔨', '⚙', '⚙️',
    # Gens & rôles
    '🤝', '🙋', '🙋‍♀️', '🙋‍♂️', '👀', '👔', '🌱', '👥', '👤',
    '👨‍🏫', '👨🏫', '👩‍🏫', '👩🏫', '👨‍💼', '👩‍💼', '🧑‍🏫',
    # Lieux & secteurs
    '🏢', '🛒', '🍽', '🎨', '🏥', '🏫', '🏠',
    # Actions
    '🚨', '⚠', '⚠️', '✏', '✏️', '🗑', '🗑️', '↻', '↺',
    '➕', '➖', '✂', '✂️', '💾', '📥', '📤',
    # Indicateurs (sauf tricolores fonctionnels)
    '🟣', '🔵', '⚪', '⚫', '🟤',
    # Misc
    '🔥', '💯', '✓', '➡', '➡️', '⬅', '⬅️', '⬆', '⬆️', '⬇', '⬇️',
    '↗', '↘', '↑', '↓',  # gardés ailleurs mais souvent décoratifs ici
    # Symboles divers
    '📞', '☎', '📧', '✉', '📨',
    # Sport / Activités
    '🏃', '🏊', '🎵', '🎶',
    # Trans / Logistique
    '🚌', '🚐', '🚗',
]

# Remplacements ciblés : emoji + espace optionnel → vide
total_replacements = 0
counter = Counter()
for emo in EMOJIS_TO_KILL:
    # Match emoji suivi d'un espace optionnel (un seul)
    pat1 = re.compile(re.escape(emo) + r'\s')
    count = len(pat1.findall(html))
    if count > 0:
        html = pat1.sub('', html)
        total_replacements += count
        counter[emo] += count
    # Aussi sans espace (emoji isolé)
    pat2 = re.compile(re.escape(emo))
    count = len(pat2.findall(html))
    if count > 0:
        html = pat2.sub('', html)
        total_replacements += count
        counter[emo] += count

# Sauvegarder
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ 3ème passage agressif :")
print(f"  Remplacements totaux : {total_replacements}")
print(f"  Diff taille : {len(html) - orig_size:+} chars")
print(f"\n  Top 15 emojis supprimés :")
for emo, n in counter.most_common(15):
    print(f"    {emo}  ×{n}")
