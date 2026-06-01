# -*- coding: utf-8 -*-
"""Nettoyage stratégique des emojis décoratifs (préservation des fonctionnels)."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

orig_size = len(html)

# Emojis décoratifs à supprimer quand ils apparaissent EN DÉBUT de titre/label
# Pattern : emoji + espace optionnel au début d'un texte dans une class card-title,
# adm-section-title, ou label
DECORATIVE_EMOJIS_TO_REMOVE = [
    '📊', '📈', '📉', '📋', '📝', '📒', '📥', '📤', '📄',
    '🎯', '🚀', '🌟', '💡', '⚡', '🔔', '🎓', '🧠',
    '⭐', '✨', '🎲', '🏷', '📅', '📌', '📍', '🎚', '🎚️',
    '⚖', '⚖️', '🕸', '🕸️', '🔍', '🔎', '🗂', '🗂️',
    '🤝', '🙋', '👀', '🔧', '👔', '🌱', '👥', '👤',
    '🏢', '🛒', '🍽', '🛠', '🎨', '✂', '✂️', '💻',
    '🚨', '⚠', '⚠️', '✏', '✏️', '🗑', '🗑️',
    '🟢', '🟡', '🟠', '🔴',  # Note: ces feux tricolores sont parfois fonctionnels
]

# Remplacements ciblés dans les titres/labels visibles (haute valeur AI-tell)
# On enlève emoji + espace en début dans les chaînes longues
replacements_count = 0

# Pattern 1: dans card-title — emoji + espace → vide
# Ex: <div class="card-title">📊 Évolution... → <div class="card-title">Évolution...
def clean_title(match):
    global replacements_count
    full = match.group(0)
    inner = match.group(1)
    # Supprimer emoji + espace au début
    cleaned = re.sub(r'^[\U0001F300-\U0001FAFF☀-➿⌀-⏿✀-➿⬀-⯿︀-️]+\s*', '', inner)
    if cleaned != inner:
        replacements_count += 1
    return full.replace(inner, cleaned, 1)

# Cibler les titres de section et card-title
patterns = [
    # card-title content
    r'<div class="card-title"[^>]*>([^<]+)</div>',
    # adm-section-title content
    r'<div class="adm-section-title"[^>]*>([^<]+)</div>',
    r'<span data-i18n="[^"]+">([^<]+)</span>',
]

for pat in patterns:
    html = re.sub(pat, clean_title, html)

# Nettoyer aussi les emojis isolés dans des messages narratifs (synthèse, recommandations)
# Pattern : remplacer emojis spécifiques au début de strings JS
JS_STRING_PATTERNS = [
    (r"'📊 ", "'"),
    (r"'📈 ", "'"),
    (r"'📋 ", "'"),
    (r"'📝 ", "'"),
    (r"'📒 ", "'"),
    (r"'🎯 ", "'"),
    (r"'🚀 ", "'"),
    (r"'🌟 ", "'"),
    (r"'💡 ", "'"),
    (r"'⚡ ", "'"),
    (r"'🔔 ", "'"),
    (r"'🎓 ", "'"),
    (r"'🧠 ", "'"),
    (r"'⭐ ", "'"),
    (r"'🎲 ", "'"),
    (r"'⚖️ ", "'"),
    (r"'⚖ ", "'"),
    (r"'🕸️ ", "'"),
    (r"'🕸 ", "'"),
    (r'"📊 ', '"'),
    (r'"📈 ', '"'),
    (r'"📋 ', '"'),
    (r'"📝 ', '"'),
    (r'"📒 ', '"'),
    (r'"🎯 ', '"'),
    (r'"🚀 ', '"'),
]

for pat, rep in JS_STRING_PATTERNS:
    count = len(re.findall(pat, html))
    if count > 0:
        html = re.sub(pat, rep, html)
        replacements_count += count

# Sauvegarder
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

new_size = len(html)
print(f"✅ Nettoyage emojis :")
print(f"  Remplacements effectués : {replacements_count}")
print(f"  Taille avant : {orig_size:,} chars")
print(f"  Taille après : {new_size:,} chars")
print(f"  Diff : {new_size - orig_size:+} chars")
