# -*- coding: utf-8 -*-
"""Nettoyage PRÉCIS : retire UNIQUEMENT les emojis décoratifs.
Préserve les emojis avec valeur explicative ou exécutive.
"""
import re, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

orig_size = len(html)
counter = Counter()

# ════════════════════════════════════════════════════════════════════
# EMOJIS À PRÉSERVER (fonctionnels — NE PAS TOUCHER)
# ════════════════════════════════════════════════════════════════════
PRESERVE = {
    # Statut visuel critique
    '🟢', '🟡', '🟠', '🔴',
    # Statuts d'objectifs PEI
    '✅', '❌', '🔄', '⭕',
    # Avertissement/alerte (fonctionnel)
    '⚠', '⚠️', '🚨', '🔔',
    # Checkmark explicatif
    '✓',
    # Flèches directionnelles (tendances + funnel)
    '↗', '↘', '↑', '↓', '→', '←', '↺',
    # Badge sémantique
    '🏆',
    # Action buttons (icônes uniques sur des boutons)
    '➕', '➖', '✏', '✏️', '🗑', '🗑️', '⚙', '⚙️',
    '📥', '📤',  # download/upload
}

# ════════════════════════════════════════════════════════════════════
# EMOJIS À SUPPRIMER (décoratifs uniquement)
# ════════════════════════════════════════════════════════════════════
KILL = [
    # Charts décoratifs dans titres
    '📊', '📈', '📉',
    # Documents décoratifs
    '📋', '📝', '📒', '📄', '📁',
    # Cibles/lancements décoratifs
    '🎯', '🚀', '🌟', '💡', '⚡',
    # Thèmes éducatifs décoratifs
    '🎓', '🧠', '📚',
    # Étoiles/sparkles
    '⭐', '✨',
    # Divers déco
    '🎲', '🏷', '🏷️', '📅', '📌', '📍', '🎚', '🎚️',
    '🔍', '🔎', '🗂', '🗂️',
    '🤝', '🙋', '🙋‍♀️', '🙋‍♂️', '👀', '👔', '🌱',
    '👥', '👤', '👨‍🏫', '👨🏫', '👩‍🏫', '👩🏫',
    '👨‍💼', '👩‍💼', '🧑‍🏫',
    '🏢', '🛒', '🍽', '🎨', '🏥', '🏫', '🏠',
    '⚖', '⚖️', '🕸', '🕸️', '🛠', '🛠️', '🔧', '🔨',
    '🌟', '✨', '🆕', '📵',
]

def remove_emoji_in_context(html, emoji, contexts):
    """Supprime emoji dans des contextes spécifiques (titres, labels)."""
    count = 0
    for pat, repl in contexts:
        # Construire pattern complet avec l'emoji
        full_pat = pat.replace('EMOJI', re.escape(emoji))
        matches = re.findall(full_pat, html)
        if matches:
            html = re.sub(full_pat, repl, html)
            count += len(matches)
    return html, count

# Contextes où supprimer (avec espace après l'emoji)
contexts = [
    # Card titles
    (r'(class="card-title"[^>]*>)EMOJI\s+', r'\1'),
    # Section titles
    (r'(class="adm-section-title"[^>]*>)EMOJI\s+', r'\1'),
    # Span data-i18n
    (r'(<span data-i18n="[^"]+">)EMOJI\s+', r'\1'),
    # KPI labels
    (r'(class="kpi-label"[^>]*>)EMOJI\s+', r'\1'),
    # Toast messages (single quotes)
    (r"(showToast\(')EMOJI\s+", r"\1"),
    # InnerHTML template literals
    (r'(innerHTML\s*=\s*`)EMOJI\s+', r'\1'),
    (r'(innerHTML\s*=\s*")EMOJI\s+', r'\1'),
    # Direct text in divs (start of element content)
    (r'(>)EMOJI\s+([A-ZaeiouéàèA-Za-zÀ-ÿ])', r'\1\2'),
    # Dans les options et boutons
    (r"(>)EMOJI\s+([A-Za-zÀ-ÿ])", r"\1\2"),
]

total = 0
for emoji in KILL:
    if emoji in PRESERVE:
        continue
    html, n = remove_emoji_in_context(html, emoji, contexts)
    if n > 0:
        counter[emoji] += n
        total += n

# Sauvegarder
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Nettoyage PRÉCIS terminé :")
print(f"  Total remplacements : {total}")
print(f"  Diff : {len(html) - orig_size:+} chars")
print(f"\n  Emojis décoratifs supprimés (top 20) :")
for emo, n in counter.most_common(20):
    print(f"    {emo}  ×{n}")
