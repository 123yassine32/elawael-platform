# -*- coding: utf-8 -*-
"""2ème passage : nettoyer les emojis dans KPI labels, toast, et autres contextes visibles."""
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

PATH = r"C:\Users\PC\Desktop\elawael-platform\dashboard.html"
with open(PATH, 'r', encoding='utf-8') as f:
    html = f.read()

orig = html

# Patterns dans des attributs HTML visibles
patterns_html = [
    # kpi-label > emoji + texte
    (r'class="kpi-label"[^>]*>([📊📈📋📝📒🎯🚀🌟💡⚡🔔🎓🧠⭐🎲⚖️⚖🕸️🕸👥👤👨‍🏫👨🏫🏢✂✂️💻🚨⚠⚠️✏✏️🗑🗑️⏰🔧👔🤝🙋👀🌱🆕⬇️⬆️➕➖]\s+)',
       'class="kpi-label">'),

    # data-i18n text starting with emoji
    (r'(data-i18n="[^"]+">)([📊📈📋📝📒🎯🚀🌟💡⚡🔔🎓🧠⭐🎲⚖️⚖🕸️🕸👥👤👨‍🏫👨🏫🏢✂✂️💻🚨⚠⚠️✏✏️🗑🗑️⏰🔧👔🤝🙋👀🌱🆕⬇️⬆️➕➖🆕📵📊]\s+)',
       r'\1'),

    # textContent dans showToast — supprime emoji + espace au début
    (r"showToast\('([📊📈📋📝📒🎯🚀🌟💡⚡🔔🎓🧠⭐🎲⚖️⚖🕸️🕸👥👤👨‍🏫👨🏫🏢✂✂️💻🚨⚠⚠️✏✏️🗑🗑️⏰🔧👔🤝🙋👀🌱🆕📵📊]\s*)",
       "showToast('"),

    # innerHTML avec emoji + espace au début
    (r'innerHTML\s*=\s*`([📊📈📋📝📒🎯🚀🌟💡⚡🔔🎓🧠⭐🎲⚖️⚖🕸️🕸👥👤👨‍🏫👨🏫🏢✂✂️💻🚨⚠⚠️✏✏️🗑🗑️⏰🔧👔🤝🙋👀🌱🆕📵📊]\s+)',
       'innerHTML = `'),

    # textContent ou label dans inner divs avec emoji prefix
    # Ex : <div ...>📅 Calendrier</div> → <div ...>Calendrier</div>
    # Mais on garde quand l'emoji est SUIVI d'une valeur (ex: "🔴 5 alertes")
    # Ciblons donc le pattern : emoji + espace + LETTRES (pas chiffres)
    (r'>([📊📈📋📝📒🎯🚀🌟💡⚡🔔🎓🧠⭐🎲⚖️⚖🕸️🕸🏢✂✂️💻🆕📵])\s+([A-Za-zÀ-ÿ])', r'>\2'),
]

total_replacements = 0
for pat, rep in patterns_html:
    count = len(re.findall(pat, html))
    if count > 0:
        html = re.sub(pat, rep, html)
        total_replacements += count

# Sauvegarder
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ 2ème passage :")
print(f"  Remplacements : {total_replacements}")
print(f"  Diff : {len(html) - len(orig):+} chars")
