/* ═══════════════════════════════════════════════════════════
   CONFIGURATION FIREBASE — ElAwail Digital Platform
   Fichier : js/config/firebase.js
═══════════════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey:            "AIzaSyAM29BVKLyohD9WnmUcOIhZPb_HIqnR_XY",
  authDomain:        "elawael-platform-df2e3.firebaseapp.com",
  projectId:         "elawael-platform-df2e3",
  storageBucket:     "elawael-platform-df2e3.firebasestorage.app",
  messagingSenderId: "43664796026",
  appId:             "1:43664796026:web:6f1ce1da9a692d7b278ec3"
};

/* ── Initialisation Firebase ── */
firebase.initializeApp(firebaseConfig);

/* ── Instances exportées — utilisées dans tous les modules ── */
const db   = firebase.firestore();
const auth = firebase.auth();

/* ── Session : SESSION (compatible file:// et localhost) ── */
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .catch(() => { /* Silencieux — fallback navigateur */ });

console.log('[Firebase] Initialisé ✓ — projet : elawael-platform-df2e3');
