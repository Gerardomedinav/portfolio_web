/**
 * Módulo de Autenticación de Administrador (Cifrado SHA-256 + Sesión Segura + Auto-Logout por Inactividad)
 */

// Hash SHA-256 de la contraseña oficial de administración ("Germedi_993")
const DEFAULT_PASS_HASHES = [
  "0dceb90769e35d35977d00f7d4100b3920c410ca4197f4bb7c1c31e8b27a9098" // SHA-256 de "Germedi_993"
];

const HASH_KEY = "portfolio_admin_hash";
const SESSION_KEY = "portfolio_admin_logged";
const LAST_ACTIVITY_KEY = "portfolio_admin_last_activity";

// Tiempo de inactividad permitido antes de cerrar sesión automáticamente (15 minutos)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

let inactivityTimer = null;
let activityListenersAttached = false;

/**
 * Genera el hash SHA-256 de una cadena de texto de forma nativa
 */
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifica si la sesión de administrador está activa y no ha expirado por inactividad
 */
export function isAuthenticated() {
  const logged = sessionStorage.getItem(SESSION_KEY) === "true";
  if (!logged) return false;

  // Verificar si la sesión expiró por inactividad prolongada
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity, 10);
    if (elapsed > INACTIVITY_TIMEOUT_MS) {
      logout('inactivity');
      return false;
    }
  }

  return true;
}

/**
 * Registra o actualiza el sello de tiempo de la última actividad del usuario
 */
function updateLastActivity() {
  if (sessionStorage.getItem(SESSION_KEY) !== "true") return;
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  resetInactivityTimer();
}

/**
 * Reinicia el temporizador de inactividad de 15 minutos
 */
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    if (isAuthenticated()) {
      logout('inactivity');
    }
  }, INACTIVITY_TIMEOUT_MS);
}

/**
 * Conecta los eventos globales para detectar actividad e interactividad
 */
function attachActivityListeners() {
  if (activityListenersAttached) return;

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(evt => {
    window.addEventListener(evt, updateLastActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      isAuthenticated(); // Valida si la sesión expiró mientras la pestaña estuvo en segundo plano
    }
  });

  activityListenersAttached = true;
}

/**
 * Desconecta los escuchadores de actividad
 */
function detachActivityListeners() {
  if (!activityListenersAttached) return;
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  events.forEach(evt => {
    window.removeEventListener(evt, updateLastActivity);
  });
  activityListenersAttached = false;
}

/**
 * Intenta iniciar sesión con la contraseña proporcionada
 */
export async function login(password) {
  if (!password) return false;
  const cleanPass = password.trim();
  const inputHash = await sha256(cleanPass);

  const customHash = localStorage.getItem(HASH_KEY);

  let isValid = false;
  if (customHash) {
    isValid = (inputHash === customHash) || DEFAULT_PASS_HASHES.includes(inputHash);
  } else {
    isValid = DEFAULT_PASS_HASHES.includes(inputHash);
  }

  if (isValid) {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    // Si inició sesión con la nueva clave oficial, actualizar el hash personalizado almacenado
    if (DEFAULT_PASS_HASHES.includes(inputHash)) {
      localStorage.setItem(HASH_KEY, inputHash);
    }

    attachActivityListeners();
    resetInactivityTimer();

    document.dispatchEvent(new CustomEvent("adminAuthChange", { detail: { loggedIn: true } }));
    return true;
  }

  return false;
}

/**
 * Cierra la sesión activa de administrador
 */
export function logout(reason = 'user') {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }

  detachActivityListeners();

  document.dispatchEvent(new CustomEvent("adminAuthChange", { detail: { loggedIn: false, reason } }));
}

/**
 * Cambia la contraseña del administrador previa verificación de la clave actual
 */
export async function changePassword(currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    return { success: false, message: "Todos los campos son obligatorios." };
  }

  const cleanNew = newPassword.trim();
  if (cleanNew.length < 4) {
    return { success: false, message: "La nueva contraseña debe tener al menos 4 caracteres." };
  }

  const currentHash = await sha256(currentPassword.trim());
  const customHash = localStorage.getItem(HASH_KEY);

  let isCurrentValid = false;
  if (customHash) {
    isCurrentValid = (currentHash === customHash) || DEFAULT_PASS_HASHES.includes(currentHash);
  } else {
    isCurrentValid = DEFAULT_PASS_HASHES.includes(currentHash);
  }

  if (!isCurrentValid) {
    return { success: false, message: "La contraseña actual no es correcta." };
  }

  const newHash = await sha256(cleanNew);
  localStorage.setItem(HASH_KEY, newHash);
  return { success: true, message: "Contraseña actualizada exitosamente." };
}

// Iniciar escuchadores de actividad si hay una sesión previa activa al cargar
if (typeof window !== 'undefined') {
  if (isAuthenticated()) {
    attachActivityListeners();
    resetInactivityTimer();
  }
}
