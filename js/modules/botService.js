/**
 * Módulo de Servicio e Inteligencia para GerAssist (Búsqueda Local FAQ + Serverless AI API)
 */
const STORAGE_BOT_SESSION_KEY = 'gerassist_session_count';
const STORAGE_BOT_LIMIT_TIME_KEY = 'gerassist_session_limit_time';
const MAX_SESSION_MESSAGES = 20;
const COOLDOWN_MINUTES = 30;

let botKnowledgeData = null;

/**
 * Carga la base de conocimiento local en JSON
 */
export async function getBotKnowledge() {
  if (botKnowledgeData) return botKnowledgeData;
  try {
    const res = await fetch('./assets/json/bot_knowledge.json');
    if (res.ok) {
      botKnowledgeData = await res.json();
      return botKnowledgeData;
    }
  } catch (e) {
    console.error('Error cargando bot_knowledge.json:', e);
  }
  return null;
}

/**
 * Control de límite de mensajes por sesión de usuario (Anti-Abuso y Ahorro de Tokens)
 */
export function getSessionMessageCount() {
  try {
    const count = sessionStorage.getItem(STORAGE_BOT_SESSION_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function incrementSessionMessageCount() {
  try {
    const current = getSessionMessageCount();
    sessionStorage.setItem(STORAGE_BOT_SESSION_KEY, (current + 1).toString());
    return current + 1;
  } catch (e) {
    return 1;
  }
}

/**
 * Calcula los minutos restantes para poder volver a chatear con GerAssist
 */
export function getRemainingCooldownMinutes() {
  try {
    const limitTime = localStorage.getItem(STORAGE_BOT_LIMIT_TIME_KEY);
    if (!limitTime) return COOLDOWN_MINUTES;

    const elapsedMs = Date.now() - parseInt(limitTime, 10);
    const elapsedMinutes = elapsedMs / (1000 * 60);

    if (elapsedMinutes >= COOLDOWN_MINUTES) {
      resetSessionLimit();
      return 0;
    }

    return Math.ceil(COOLDOWN_MINUTES - elapsedMinutes);
  } catch (e) {
    return COOLDOWN_MINUTES;
  }
}

/**
 * Reinicia los contadores de límite de sesión
 */
export function resetSessionLimit() {
  try {
    sessionStorage.removeItem(STORAGE_BOT_SESSION_KEY);
    localStorage.removeItem(STORAGE_BOT_LIMIT_TIME_KEY);
  } catch (e) {}
}

export function isSessionLimitReached() {
  const count = getSessionMessageCount();
  if (count < MAX_SESSION_MESSAGES) {
    return false;
  }

  const remaining = getRemainingCooldownMinutes();
  if (remaining <= 0) {
    return false;
  }

  return true;
}

/**
 * Busca coincidencias locales directas en FAQs (0 COSTO DE TOKENS)
 */
export async function findLocalFaqMatch(userQuery) {
  const knowledge = await getBotKnowledge();
  if (!knowledge || !knowledge.faqs) return null;

  const queryLower = userQuery.toLowerCase().trim();

  for (const faq of knowledge.faqs) {
    if (faq.keywords && faq.keywords.some(kw => queryLower.includes(kw.toLowerCase()))) {
      return faq.answer;
    }
  }

  return null;
}

/**
 * Envía el mensaje del usuario al endpoint Serverless /api/chat
 */
export async function sendMessageToGerAssist(message, conversationHistory = []) {
  // 1. Probar primero búsqueda local FAQ (0 tokens)
  const localMatch = await findLocalFaqMatch(message);
  if (localMatch) {
    return { reply: localMatch, fromFaq: true };
  }

  // 2. Verificar límite de mensajes por sesión (20 consultas)
  if (isSessionLimitReached()) {
    if (!localStorage.getItem(STORAGE_BOT_LIMIT_TIME_KEY)) {
      try {
        localStorage.setItem(STORAGE_BOT_LIMIT_TIME_KEY, Date.now().toString());
      } catch (e) {}
    }

    const remainingMinutes = getRemainingCooldownMinutes();
    const timeMsg = remainingMinutes > 0
      ? `en aproximadamente **${remainingMinutes} minuto${remainingMinutes === 1 ? '' : 's'}** (o al actualizar tu navegador)`
      : `en breve`;

    return {
      reply: `Ha alcanzado el límite de **20 consultas** por sesión para optimizar el servicio y proteger los recursos. Podrás volver a interactuar con **GerAssist** ${timeMsg}.<br /><br />Mientras tanto, podés contactar a Gerardo Medina de forma inmediata a través del **Formulario de Contacto**, su perfil de **[LinkedIn](https://www.linkedin.com/in/gerardomedinav/)** o enviando un correo a **gerardomedinavv@gmail.com**. ¡Estará encantado de responderte!`,
      limitReached: true
    };
  }

  // 3. Incrementar contador de sesión
  incrementSessionMessageCount();

  // 4. Preparar contexto acotado
  const knowledge = await getBotKnowledge();
  let relevantContext = '';
  if (knowledge && knowledge.profile) {
    relevantContext = `Perfil: ${knowledge.profile.name} - ${knowledge.profile.title}.
Títulos: ${knowledge.profile.degrees.join(', ')}.
Trayectoria: ${knowledge.profile.experience}
Visión: ${knowledge.profile.vision}`;
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        context: relevantContext,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor (/api/chat): ${response.status}`);
    }

    const data = await response.json();
    return { reply: data.reply || 'No se pudo obtener respuesta.' };
  } catch (error) {
    console.error('Error llamando a GerAssist AI:', error);
    // Fallback inteligente local en caso de fallo de red
    return {
      reply: `¡Hola! Soy **GerAssist**. Gerardo Medina es un **Desarrollador Full Stack & Analista de Datos** con fuerte enfoque en **Accesibilidad Web (WCAG 2.1 AA)**, trabajo en equipo e impacto real. Cursa la Licenciatura en Educación Tecnológica en la UTN. Te sugiero escribirle directamente desde la sección Contacto.`
    };
  }
}
