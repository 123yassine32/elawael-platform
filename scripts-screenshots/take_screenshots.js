/**
 * Script automatique de captures d'écran — ElAwael Digital Platform
 * Stratégie : connexion réelle avec odghoughi + promotion ADMIN via sessionStorage hook
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs   = require('fs');

const CHROME_PATH     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PLATFORM_URL    = 'https://123yassine32.github.io/elawael-platform/';
const DASHBOARD_URL   = 'https://123yassine32.github.io/elawael-platform/dashboard.html';
const SCREENSHOTS_DIR = 'C:\\Users\\PC\\Desktop\\elawael-platform\\screenshots';

// Compte cadre avec mot de passe connu
const LOGIN_EMAIL = 'odghoughi@elawail.ma';
const LOGIN_USER  = 'odghoughi';
const LOGIN_PASS  = 'Dghoughi2025';
const KNOWN_UID   = 'bT03ePAzAnQUNB2rkRd3YwGhs6g1';

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const delay = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, filename, label) {
  const fp = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: fp });
  console.log(`  ✓ ${label} → ${filename}`);
}

async function main() {
  console.log('=== ElAwael Digital Platform — Captures automatiques ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1400,900',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();

  // Désactiver la détection de headless Chrome
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36');
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('[Auth]') || t.includes('error') || t.includes('Erreur')) {
      console.log('  [Browser]', t.substring(0, 100));
    }
  });

  try {
    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 1 : Page login + capture
    // ═══════════════════════════════════════════════════════════════
    console.log('[1] Page login...');
    await page.goto(PLATFORM_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForFunction(() => {
      const box = document.getElementById('login-box-main');
      return box && box.style.display !== 'none' && box.style.display !== '';
    }, { timeout: 20000 }).catch(() => {});
    await delay(1000);
    await shot(page, 'sc_login.png', 'Page login');

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 2 : Connexion avec hook sessionStorage → ADMIN
    // ═══════════════════════════════════════════════════════════════
    console.log('[2] Injection hook sessionStorage + connexion...');

    // Injecter un hook qui PROMEUT le rôle en ADMIN avant que le login
    // stocke le profil dans sessionStorage
    await page.evaluate(() => {
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'ea_user_profil') {
          try {
            const profil = JSON.parse(value);
            // Promouvoir en ADMIN
            profil.role       = 'ADMIN';
            profil.nom        = 'Administrateur ElAwail';
            profil.teacherId  = 'admin';
            profil.classeIcon = '🛡️';
            profil.classeColor= '#7c3aed';
            value = JSON.stringify(profil);
            console.log('[HOOK] Profil promu en ADMIN');
          } catch(e) { console.log('[HOOK] Erreur parse:', e.message); }
        }
        return origSetItem.call(this, key, value);
      };
      console.log('[HOOK] sessionStorage.setItem intercepté');
    });

    // Remplir le formulaire de connexion
    await page.waitForSelector('#login-user', { visible: true, timeout: 10000 });
    await page.evaluate(() => {
      document.getElementById('login-user').value = '';
      document.getElementById('login-pass').value = '';
    });
    await page.focus('#login-user');
    await page.keyboard.type(LOGIN_USER, { delay: 80 });
    await page.focus('#login-pass');
    await page.keyboard.type(LOGIN_PASS, { delay: 80 });
    await delay(300);

    console.log(`  → Connexion avec ${LOGIN_USER}...`);
    await page.click('#btn-login');

    // Attendre la navigation vers dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 })
      .catch(() => {});

    await delay(3000);
    const urlAfter = page.url();
    console.log(`  URL: ${urlAfter}`);

    // ═══════════════════════════════════════════════════════════════
    // ÉTAPE 3 : Vérifier on est sur le dashboard
    // ═══════════════════════════════════════════════════════════════
    if (!urlAfter.includes('dashboard')) {
      // Vérifier l'erreur éventuelle
      const loginErr = await page.evaluate(() => {
        const el = document.getElementById('login-error');
        return el ? el.textContent.trim() : '';
      });
      if (loginErr) console.log(`  ⚠ Erreur: ${loginErr}`);
      await shot(page, 'debug_login_fail.png', 'Debug login fail');
      await browser.close();
      return;
    }

    console.log('  ✓ Connecté et sur le dashboard !');

    // Attendre que les données Firestore se chargent
    await page.waitForFunction(() => {
      const navEl = document.querySelector('.nav-item, .sidebar a, nav');
      return navEl !== null;
    }, { timeout: 15000 }).catch(() => {});
    await delay(3000);

    // Vérifier le rôle actuel
    const role = await page.evaluate(() => {
      try {
        const p = JSON.parse(sessionStorage.getItem('ea_user_profil'));
        return p && p.role;
      } catch(e) { return 'unknown'; }
    });
    console.log(`  Rôle actuel: ${role}`);

    // ─── BASCULER EN FRANÇAIS ─────────────────────────────────────
    console.log('  → Basculement en Français...');
    const langSwitched = await page.evaluate(() => {
      // 1. Cibler précisément le bouton langue par son id
      const langBtn = document.getElementById('lang-toggle-btn');
      if (langBtn) { langBtn.click(); return `Cliqué #lang-toggle-btn`; }
      // 2. Appeler directement la fonction de langue
      if (typeof toggleLang === 'function') { toggleLang(); return 'toggleLang()'; }
      if (typeof setLang === 'function') { setLang('fr'); return 'setLang(fr)'; }
      // 3. Forcer currentLang = 'fr' et ré-appliquer
      if (typeof currentLang !== 'undefined') {
        window.currentLang = 'fr';
        if (typeof applyLang === 'function') applyLang('fr');
        return 'currentLang=fr forcé';
      }
      return 'non trouvé';
    });
    console.log(`  Lang: ${langSwitched}`);
    await delay(2000);
    // Vérifier la langue actuelle
    const langNow = await page.evaluate(() => {
      return typeof currentLang !== 'undefined' ? currentLang : document.documentElement.lang || 'unknown';
    });
    console.log(`  Langue maintenant: ${langNow}`);
    // Si toujours en AR, forcer FR
    if (langNow === 'ar') {
      await page.evaluate(() => {
        if (typeof toggleLang === 'function') toggleLang();
        else if (typeof setLang === 'function') setLang('fr');
      });
      await delay(1500);
    }

    // ═══════════════════════════════════════════════════════════════
    // CAPTURES DU TABLEAU DE BORD
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[3] Vue d\'ensemble / KPIs...');
    // Naviguer vers le panneau admin (lوحة قيادة المدير ou Vue d'ensemble)
    await navSidebar(['lوحة', 'lوح', 'tableau de bord', 'vue d\'ensemble', 'accueil', 'director', 'admin']);
    await delay(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, 'sc_kpi.png', 'Tableau de bord KPIs admin');
    await shot(page, 'dashboard.png', 'Dashboard principal');

    // ─── Fonction de navigation dans la sidebar ────────────────────
    async function navSidebar(keywords) {
      const found = await page.evaluate((kws) => {
        const all = [...document.querySelectorAll('.nav-item, nav a, li[onclick], div[onclick], button, a')];
        for (const el of all) {
          if (!el.offsetParent) continue; // skip hidden
          const text = (el.textContent || '').trim().toLowerCase();
          const onclick = (el.getAttribute('onclick') || '').toLowerCase();
          const href = (el.getAttribute('href') || '').toLowerCase();
          const all_text = text + ' ' + onclick + ' ' + href;
          if (kws.some(k => all_text.includes(k.toLowerCase()))) {
            el.click();
            return text.substring(0, 50);
          }
        }
        return null;
      }, keywords);
      console.log(`  nav → ${found ? `"${found}"` : 'non trouvé'}`);
      await delay(2500);
    }

    // ═══════════════════════════════════════════════════════════════
    // SCORE ORGANISATIONNEL GLOBAL
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[4] Score Organisationnel Global...');
    await navSidebar(['score', 'sog', 'organisationnel', 'global']);
    await shot(page, 'sc_sog.png', 'Score Organisationnel Global');

    // ═══════════════════════════════════════════════════════════════
    // BÉNÉFICIAIRES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[5] Bénéficiaires...');
    await navSidebar(['bénéficiaires', 'beneficiaires', 'membres', 'enfants']);
    await shot(page, 'sc_benef.png', 'Gestion bénéficiaires');
    await shot(page, 'beneficiaires.png', 'Liste bénéficiaires');

    // ═══════════════════════════════════════════════════════════════
    // SIMULATION
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[6] Simulation décisionnelle...');
    await navSidebar(['simulation', 'décisionnel', 'what-if', 'stratégique']);
    await shot(page, 'sc_simulation.png', 'Simulation stratégique');

    // ═══════════════════════════════════════════════════════════════
    // ALERTES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[7] Alertes...');
    await navSidebar(['alerte', 'risque', 'urgence']);
    await shot(page, 'alertes.png', 'Centre alertes');

    // ═══════════════════════════════════════════════════════════════
    // VUE D'ENSEMBLE
    // ═══════════════════════════════════════════════════════════════
    console.log('\n[8] Vue d\'ensemble...');
    await navSidebar(['vue d\'ensemble', 'accueil', 'administration', 'tableau de bord', 'général']);
    await delay(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, 'overview.png', 'Vue d\'ensemble admin');
    await shot(page, 'portal.png', 'Portail admin');
    await shot(page, 'dashboard2.png', 'Dashboard vue 2');

    console.log('\n✅ Toutes les captures terminées !');
    console.log(`📁 ${SCREENSHOTS_DIR}`);
    console.log('\nFichiers produits :');
    fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png') && !f.startsWith('debug')).forEach(f => {
      const size = Math.round(fs.statSync(path.join(SCREENSHOTS_DIR, f)).size / 1024);
      console.log(`  ${f} (${size} KB)`);
    });

  } catch (err) {
    console.error('\n❌ Erreur fatale:', err.message);
    try {
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'debug_fatal.png') });
    } catch(_) {}
  } finally {
    await browser.close();
  }
}

main();
