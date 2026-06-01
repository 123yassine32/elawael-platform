# -*- coding: utf-8 -*-
"""Compte tous les emojis encore présents pour identifier les décoratifs restants."""
import re, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# Pattern pour matcher la plupart des emojis Unicode
emoji_pat = re.compile(
    "[\U0001F300-\U0001F9FF"  # Symbols/pictographs + supplemental
    "\U0001FA00-\U0001FAFF"   # Symbols-A,B
    "☀-➿"           # Misc symbols + dingbats
    "⌀-⏿"           # Misc technical (incl ⚙)
    "✀-➿"           # Dingbats
    "]"
)

found = Counter()
for m in emoji_pat.finditer(html):
    found[m.group()] += 1

print(f"Total emojis distincts trouvés : {len(found)}")
print(f"Total occurrences emojis : {sum(found.values())}")
print(f"\nTop 30 emojis encore présents :")
for emo, n in found.most_common(30):
    print(f"  {emo}  ×{n}")
