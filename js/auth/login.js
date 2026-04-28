/* ═══════════════════════════════════════════════════════════
   AUTHENTIFICATION — ElAwail Digital Platform
   Fichier : js/auth/login.js
═══════════════════════════════════════════════════════════ */

/* ── Rôles attribués selon l'email — pas de Firestore au login ── */
const ROLES_PAR_EMAIL = {
  'admin@elawail.ma':        { role: 'ADMIN',        nom: 'Administrateur ElAwail',  teacherId: 'admin',        classeIcon: '🛡️', classeColor: '#7c3aed' },
  'gestionnaire@elawail.ma': { role: 'GESTIONNAIRE', nom: 'Gestionnaire ElAwail',    teacherId: 'gestionnaire', classeIcon: '✏️', classeColor: '#059669' },
  'consultant@elawail.ma':   { role: 'CONSULTANT',   nom: 'Consultant ElAwail',      teacherId: 'consultant',   classeIcon: '👁',  classeColor: '#d97706' }
};

/**
 * Convertit un identifiant (username ou email) en email Firebase.
 * "admin" → "admin@elawail.ma"
 */
function identifiantVersEmail(identifiant) {
  if (!identifiant) return '';
  const val = identifiant.trim().toLowerCase();
  return val.includes('@') ? val : val + '@elawail.ma';
}

/**
 * Construit le profil utilisateur depuis l'email — sans aucun appel Firestore.
 * Les comptes institutionnels ont un rôle prédéfini.
 * Les éducateurs reçoivent le rôle EDUCATEUR par défaut.
 */
function creerProfilDepuisEmail(email, uid) {
  const base = {
    uid,
    email,
    classe:      '',
    classeColor: '#1b3a6b',
    classeIcon:  '📚',
    stats:       { niveaux: 2, modules: 4 },
    matiere:     '',
    nameAr:      ''
  };

  if (ROLES_PAR_EMAIL[email]) {
    return Object.assign({}, base, ROLES_PAR_EMAIL[email]);
  }

  const teacherId = email.split('@')[0].toLowerCase();
  return Object.assign({}, base, {
    nom:       teacherId,
    role:      'EDUCATEUR',
    teacherId
  });
}

/**
 * Connexion Firebase — chemin direct sans Firestore bloquant.
 * 1. Firebase Auth (avec timeout 15s)
 * 2. Profil construit depuis l'email
 * 3. Firestore mis à jour en arrière-plan (sans bloquer)
 * 4. Redirection vers dashboard.html
 */
async function doLogin() {
  const identifiant = document.getElementById('login-user').value.trim();
  const motDePasse  = document.getElementById('login-pass').value;
  const errEl       = document.getElementById('login-error');
  const btnEl       = document.getElementById('btn-login');
  const spinner     = document.getElementById('login-spinner');
  const L           = LANG_LOGIN[currentLang];

  if (!identifiant || !motDePasse) {
    errEl.textContent = L.errLogin;
    errEl.classList.add('show');
    return;
  }

  errEl.classList.remove('show');
  btnEl.disabled = true;
  spinner.style.display = 'block';
  document.getElementById('btn-login-text').textContent = '...';

  const email = identifiantVersEmail(identifiant);

  /* Timeout 15 secondes — évite le spinner infini */
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject({ code: 'TIMEOUT' }), 15000)
  );

  try {
    /* ── 1. Auth Firebase (avec timeout) ── */
    const credential = await Promise.race([
      auth.signInWithEmailAndPassword(email, motDePasse),
      timeout
    ]);

    const uid = credential.user.uid;

    /* ── 2. Profil depuis l'email — aucun Firestore bloquant ── */
    const profil = creerProfilDepuisEmail(email, uid);

    /* ── 3. Stocker dans sessionStorage ── */
    sessionStorage.setItem('ea_user_profil', JSON.stringify(profil));

    /* ── 4. Firestore en arrière-plan (non bloquant) ── */
    _sauvegarderProfilFirestore(uid, profil);

    /* ── 5. Rediriger vers le dashboard ── */
    window.location.href = 'dashboard.html';

  } catch (err) {
    btnEl.disabled = false;
    spinner.style.display = 'none';
    document.getElementById('btn-login-text').textContent = L.btnLogin;

    if (err.code === 'TIMEOUT') {
      errEl.textContent = '❌ Délai dépassé — vérifiez votre connexion internet';
    } else if (['auth/wrong-password','auth/user-not-found','auth/invalid-credential','auth/invalid-email'].includes(err.code)) {
      errEl.textContent = L.errLogin;
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
    } else if (err.code === 'auth/too-many-requests') {
      errEl.textContent = '❌ Trop de tentatives — réessayez dans quelques minutes';
    } else if (err.code === 'auth/network-request-failed') {
      errEl.textContent = '❌ Pas de connexion réseau — vérifiez votre internet';
    } else if (err.code === 'auth/operation-not-allowed') {
      errEl.textContent = '❌ Connexion par email non activée dans Firebase';
    } else {
      errEl.textContent = L.errService + ' (' + (err.code || 'inconnu') + ')';
      console.error('[Auth] Erreur :', err.code, err.message);
    }
    errEl.classList.add('show');
  }
}

/**
 * Sauvegarde le profil dans Firestore en arrière-plan.
 * N'est jamais attendue — ne bloque pas le login.
 */
function _sauvegarderProfilFirestore(uid, profil) {
  if (typeof db === 'undefined') return;
  db.collection('users').doc(uid).get()
    .then(doc => {
      if (!doc.exists) {
        return db.collection('users').doc(uid).set(profil);
      }
    })
    .then(() => enregistrerAudit(uid, profil.nom, 'CONNEXION', 'Système'))
    .catch(e => console.warn('[Firestore] Opération arrière-plan échouée (non bloquant) :', e.code));
}

/**
 * Déconnexion — Firebase signOut + redirection.
 */
async function doLogout() {
  try {
    const profilStr = sessionStorage.getItem('ea_user_profil');
    if (profilStr && typeof db !== 'undefined') {
      const p = JSON.parse(profilStr);
      enregistrerAudit(p.uid, p.nom, 'DÉCONNEXION', 'Système').catch(() => {});
    }
    sessionStorage.removeItem('ea_user_profil');
    if (typeof auth !== 'undefined') await auth.signOut();
  } catch (e) {
    console.warn('[Auth] Erreur déconnexion :', e);
  }
  window.location.href = 'index.html';
}

/**
 * Garde de session pour dashboard.html.
 */
function verifierSession(callback) {
  auth.onAuthStateChanged(async user => {
    if (!user) { window.location.href = 'index.html'; return; }
    const profilStr = sessionStorage.getItem('ea_user_profil');
    if (profilStr) {
      if (callback) callback(JSON.parse(profilStr));
      return;
    }
    const profil = creerProfilDepuisEmail(user.email, user.uid);
    sessionStorage.setItem('ea_user_profil', JSON.stringify(profil));
    if (callback) callback(profil);
  });
}

/**
 * Envoie un email de réinitialisation du mot de passe.
 */
async function envoyerResetEmail() {
  const emailInput = document.getElementById('modal-reset-email');
  const email = emailInput ? emailInput.value.trim() : '';
  const L = LANG_LOGIN[currentLang];
  if (!email || !email.includes('@')) { showLoginToast(L.errEmail, '#dc2626'); return; }
  try {
    await auth.sendPasswordResetEmail(email);
    fermerModalReset();
    showLoginToast(L.toastReset, '#059669');
  } catch (err) {
    showLoginToast(err.code === 'auth/user-not-found'
      ? '❌ Aucun compte trouvé avec cet email'
      : L.errService, '#dc2626');
  }
}

/**
 * Enregistre une action dans l'audit Firestore (non bloquant).
 */
async function enregistrerAudit(uid, nom, action, element) {
  try {
    await db.collection('audit_logs').add({
      uid, utilisateur: nom || 'Inconnu', action,
      element: element || '—',
      horodatage: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    /* Silencieux — l'audit ne bloque jamais */
  }
}

console.log('[Auth] Module chargé ✓');
