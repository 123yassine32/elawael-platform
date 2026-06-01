const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, combined = '', count = 0;
while ((m = re.exec(html)) !== null) {
  combined += '/* ── BLOC ' + count + ' (pos ' + m.index + ') ── */\n' + m[1] + '\n\n';
  count++;
}
fs.writeFileSync(path.join(__dirname, 'extracted.js'), combined);
console.log('Inline scripts extraits:', count, '· total chars:', combined.length);

try {
  new Function(combined);
  console.log('✓ Syntaxe JS valide');
} catch (e) {
  console.log('✗ Erreur:', e.message);
  // Try to locate
  const lines = combined.split('\n');
  const m2 = e.message.match(/line (\d+)/);
  if (m2) {
    const ln = parseInt(m2[1]);
    for (let i = Math.max(0, ln-3); i < Math.min(lines.length, ln+3); i++) {
      console.log((i === ln-1 ? '>>>' : '   '), i+1, ':', lines[i].substring(0,100));
    }
  }
}
