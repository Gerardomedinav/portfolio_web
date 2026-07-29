/**
 * Módulo de Autenticación de Administrador (Cifrado SHA-256 + Sesión Segura)
 */

// Hashes permitidos para la clave inicial ("admin123" y "admin")
const DEFAULT_PASS_HASHES = [
  "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // SHA-256 de "admin123"
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"  // SHA-256 de "admin"
];

const HASH_KEY = "portfolio_admin_hash";
const SESSION_KEY = "portfolio_admin_logged";

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
 * Verifica si la sesión de administrador está activa
 */
export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
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
    isValid = (inputHash === customHash);
  } else {
    isValid = DEFAULT_PASS_HASHES.includes(inputHash);
  }

  if (isValid) {
    sessionStorage.setItem(SESSION_KEY, "true");
    document.dispatchEvent(new CustomEvent("adminAuthChange", { detail: { loggedIn: true } }));
    return true;
  }
  return false;
}

/**
 * Cierra la sesión activa de administrador
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.dispatchEvent(new CustomEvent("adminAuthChange", { detail: { loggedIn: false } }));
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
    isCurrentValid = (currentHash === customHash);
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
