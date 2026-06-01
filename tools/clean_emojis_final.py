# -*- coding: utf-8 -*-
"""Nettoyage FINAL : retire les ~50 emojis décoratifs restants."""
import re, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

orig_size = len(html)
counter = Counter()

# Liste précise d'emojis décoratifs encore présents
DECORATIVES = ['🎯', '📅', '📒', '📊', '🚀', '📂', '🏫', '☀']
# 🏢 — ON GARDE (utilisé dans contexte 'entreprises')
# ✂ — ON GARDE (utilisé dans contexte 'Couture')
# 🧠 — ON GARDE (utilisé dans contexte 'Accompagnement')
# 💻 — ON GARDE (utilisé dans contexte 'Informatique')

for emo in DECORATIVES:
    # Remplacer emoji + espace par vide (la plupart des cas)
    pat1 = re.compile(re.escape(emo) + r'\s')
    n1 = len(pat1.findall(html))
    if n1 > 0:
        html = pat1.sub('', html)
        counter[emo] += n1
    # Emoji isolé sans espace
    pat2 = re.compile(re.escape(emo))
    n2 = len(pat2.findall(html))
    if n2 > 0:
        html = pat2.sub('', html)
        counter[emo] += n2

total = sum(counter.values())

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Nettoyage FINAL :")
print(f"  Total supprimés : {total}")
print(f"  Diff : {len(html) - orig_size:+} chars")
print(f"\n  Détail :")
for emo, n in counter.most_common():
    print(f"    {emo}  ×{n}")
