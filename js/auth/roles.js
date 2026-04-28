/* ═══════════════════════════════════════════════════════════
   GESTION DES RÔLES ET PERMISSIONS — ElAwail Digital Platform
   Fichier : js/auth/roles.js

   3 rôles institutionnels + 1 rôle opérationnel :
   ─────────────────────────────────────────────────────────
   ADMIN        → Tout voir + modifier + supprimer + gérer utilisateurs
   GESTIONNAIRE → Voir + modifier — pas de suppression
   CONSULTANT   → Lecture seule — CIN / téléphone / adresse masqués
   EDUCATEUR    → Sa classe uniquement — pas de panneau admin
═══════════════════════════════════════════════════════════ */

const PERMISSIONS = {
  ADMIN: {
    peutLire:          true,
    peutModifier:      true,
    peutSupprimer:     true,
    peutGererUsers:    true,
    peutExporter:      true,
    masquerPII:        false,   // CIN, téléphone, adresse visibles
    voirToutesClasses: true,
    voirPanneauAdmin:  true
  },
  GESTIONNAIRE: {
    peutLire:          true,
    peutModifier:      true,
    peutSupprimer:     false,
    peutGererUsers:    false,
    peutExporter:      true,
    masquerPII:        false,
    voirToutesClasses: true,
    voirPanneauAdmin:  true
  },
  CONSULTANT: {
    peutLire:          true,
    peutModifier:      false,
    peutSupprimer:     false,
    peutGererUsers:    false,
    peutExporter:      false,
    masquerPII:        true,    // CIN, téléphone, adresse masqués
    voirToutesClasses: true,
    voirPanneauAdmin:  false
  },
  EDUCATEUR: {
    peutLire:          true,
    peutModifier:      true,
    peutSupprimer:     false,
    peutGererUsers:    false,
    peutExporter:      false,
    masquerPII:        false,
    voirToutesClasses: false,   // Sa classe uniquement
    voirPanneauAdmin:  false
  }
};

/**
 * Retourne l'objet de permissions pour un rôle donné.
 * Si le rôle est inconnu, retourne les permissions EDUCATEUR (minimales).
 */
function getPermissions(role) {
  return PERMISSIONS[role] || PERMISSIONS.EDUCATEUR;
}

/**
 * Vérifie si l'utilisateur courant peut faire une action.
 * @param {string} action  - Clé dans PERMISSIONS (ex: 'peutSupprimer')
 * @param {object} profil  - Profil utilisateur depuis sessionStorage
 */
function peutFaire(action, profil) {
  if (!profil || !profil.role) return false;
  const perms = getPermissions(profil.role);
  return !!perms[action];
}

/**
 * Génère le badge HTML du rôle pour l'afficher dans la sidebar.
 * Utilise les variables CSS et classes du dashboard existant.
 */
function badgeRole(role) {
  const config = {
    ADMIN: {
      style: 'background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff',
      label: '🛡️ Admin'
    },
    GESTIONNAIRE: {
      style: 'background:#ecfdf5;color:#059669;border:1px solid #bbf7d0',
      label: '✏️ Gestionnaire'
    },
    CONSULTANT: {
      style: 'background:#fffbeb;color:#d97706;border:1px solid #fde68a',
      label: '👁 Consultant'
    },
    EDUCATEUR: {
      style: 'background:#eff4ff;color:#1b3a6b;border:1px solid #bfdbfe',
      label: '📚 Éducateur'
    }
  };
  const cfg = config[role] || config.EDUCATEUR;
  return `<span style="font-size:10px;font-weight:800;padding:3px 10px;border-radius:100px;${cfg.style}">${cfg.label}</span>`;
}

/**
 * Masque une donnée personnelle sensible (PII) selon le rôle.
 * Pour le rôle CONSULTANT : CIN, téléphone, adresse sont remplacés par •••••
 * @param {string} valeur   - La valeur à afficher
 * @param {object} profil   - Profil utilisateur
 */
function masquerPII(valeur, profil) {
  if (!profil) return '•••••';
  const perms = getPermissions(profil.role);
  if (perms.masquerPII) return '•••••';
  return valeur != null ? valeur : '—';
}

/**
 * Applique les restrictions d'interface selon le rôle courant.
 * Masque les boutons d'action selon les permissions.
 * @param {object} profil - Profil utilisateur depuis sessionStorage
 */
function appliquerRestrictions(profil) {
  if (!profil) return;
  const perms = getPermissions(profil.role);

  // Masquer les boutons de suppression pour non-ADMIN
  if (!perms.peutSupprimer) {
    document.querySelectorAll('[data-role="btn-supprimer"]').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Masquer la gestion des utilisateurs pour non-ADMIN
  if (!perms.peutGererUsers) {
    document.querySelectorAll('[data-role="btn-gerer-users"]').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Masquer les exports pour CONSULTANT
  if (!perms.peutExporter) {
    document.querySelectorAll('[data-role="btn-exporter"]').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Rendre les formulaires en lecture seule pour CONSULTANT
  if (!perms.peutModifier) {
    document.querySelectorAll('[data-role="form-saisie"]').forEach(el => {
      el.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(input => {
        input.disabled = true;
      });
    });
  }
}

console.log('[Rôles] Système de permissions initialisé ✓');
