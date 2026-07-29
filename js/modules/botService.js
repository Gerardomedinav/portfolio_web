/**
 * Módulo de Servicio e Inteligencia para GerAssist (Búsqueda Local FAQ + Serverless AI API)
 */
const STORAGE_BOT_SESSION_KEY = 'gerassist_session_count';
const MAX_SESSION_MESSAGES = 10;

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

export function isSessionLimitReached() {
  return getSessionMessageCount() >= MAX_SESSION_MESSAGES;
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

  // 2. Verificar límite de mensajes por sesión
  if (isSessionLimitReached()) {
    return {
      reply: `Ha alcanzado el límite de 10 preguntas por sesión para proteger los recursos. Por favor, póngase en contacto directamente con Gerardo Medina a través del **Formulario de Contacto**, [LinkedIn](https://www.linkedin.com/in/gerardomedinav/) o enviando un correo a **gerardomedinavv@gmail.com**. ¡Estará encantado de responderte!`,
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
