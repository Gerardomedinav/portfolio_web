/**
 * Módulo de la Interfaz Interactiva de GerAssist (Chatbot Floating Widget)
 */
import { sendMessageToGerAssist } from './botService.js';
import { getLang } from './i18n.js';

let widgetContainer = null;
let conversationHistory = [];

export function renderChatbotWidget() {
  if (widgetContainer) return;

  const lang = getLang();

  widgetContainer = document.createElement('div');
  widgetContainer.id = 'gerassist-widget-root';
  widgetContainer.className = 'bot-widget-root';

  widgetContainer.innerHTML = `
    <!-- Botón flotante GerAssist -->
    <button id="gerassist-toggle-btn" class="bot-toggle-btn" aria-label="Abrir asistente virtual GerAssist" title="Hablá con GerAssist (IA)">
      <div class="bot-avatar-badge">
        <i class="bx bx-bot"></i>
      </div>
      <span class="bot-btn-text">GerAssist</span>
      <span class="bot-online-indicator"></span>
    </button>

    <!-- Ventana de Chat Desplegable -->
    <div id="gerassist-window" class="bot-window" hidden role="dialog" aria-labelledby="gerassist-header-title">
      <!-- Header de GerAssist -->
      <div class="bot-header">
        <div class="bot-header-info">
          <div class="bot-avatar-large">
            <i class="bx bx-bot"></i>
          </div>
          <div>
            <h4 id="gerassist-header-title" class="bot-title">GerAssist <span class="bot-tag">IA</span></h4>
            <p class="bot-subtitle">${lang === 'es' ? 'Asistente de Gerardo Medina' : "Gerardo Medina's AI Assistant"}</p>
          </div>
        </div>
        <button id="gerassist-close-btn" class="bot-close-btn" aria-label="Cerrar ventana de chat">
          <i class="bx bx-x"></i>
        </button>
      </div>

      <!-- Área de Mensajes -->
      <div id="gerassist-messages" class="bot-messages-container">
        <!-- Mensaje de bienvenida inicial -->
        <div class="bot-message-wrapper bot-message--bot">
          <div class="bot-msg-avatar"><i class="bx bx-bot"></i></div>
          <div class="bot-msg-bubble">
            ${lang === 'es' 
              ? '¡Hola! 👋 Soy **GerAssist**, el asistente inteligente de **Gerardo Medina**.\n\nMe encantaría hablarte un poco más sobre Gerardo, su perfil como **Desarrollador Full Stack & Analista de Datos (Data Scientist)**, su pasión por la **Accesibilidad (WCAG 2.1 AA)**, sus estudios en la **UTN** y el **impacto real** de sus proyectos. ¿Qué te interesaría saber más sobre él?' 
              : "Hi! 👋 I am **GerAssist**, Gerardo Medina's AI assistant.\n\nI would love to tell you more about Gerardo, his **Full Stack & Data Analyst / Data Scientist** profile, his passion for **Accessibility (WCAG 2.1 AA)**, his **UTN** studies, and the **real impact** of his work. What would you like to know about him?"}
          </div>
        </div>

        <!-- Botones de sugerencias rápidas -->
        <div class="bot-quick-pills">
          <button class="bot-pill" data-query="¿Quién es Gerardo y cuál es su perfil?">👤 Perfil & UTN</button>
          <button class="bot-pill" data-query="¿Qué enfoque tiene en Análisis de Datos y Accesibilidad?">📊 Datos & Accesibilidad</button>
          <button class="bot-pill" data-query="¿Cuáles son los proyectos de Gerardo?">💻 Proyectos & Impacto</button>
          <button class="bot-pill" data-query="¿Cómo puedo contactar a Gerardo?">📩 Contactar a Gerardo</button>
        </div>
      </div>

      <!-- Indicador de Escritura -->
      <div id="gerassist-typing" class="bot-typing-indicator" style="display:none;">
        <div class="bot-dots">
          <span></span><span></span><span></span>
        </div>
        <span class="bot-typing-text">GerAssist está pensando...</span>
      </div>

      <!-- Formulario de Entrada -->
      <form id="gerassist-form" class="bot-input-form">
        <input 
          type="text" 
          id="gerassist-input" 
          placeholder="${lang === 'es' ? 'Escribe tu mensaje aquí...' : 'Type your message here...'}" 
          autocomplete="off" 
          required 
        />
        <button type="submit" class="bot-send-btn" aria-label="Enviar mensaje">
          <i class="bx bx-paper-plane"></i>
        </button>
      </form>

      <!-- Footer CTA Directo -->
      <div class="bot-cta-footer">
        <a href="#contact" class="bot-cta-link" id="bot-cta-contact-form">
          <i class="bx bx-envelope"></i> Formulario
        </a>
        <a href="https://www.linkedin.com/in/gerardomedinav/" target="_blank" rel="noopener noreferrer" class="bot-cta-link">
          <i class="bx bxl-linkedin"></i> LinkedIn
        </a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=gerardomedinavv@gmail.com" target="_blank" rel="noopener noreferrer" class="bot-cta-link">
          <i class="bx bxl-gmail"></i> Gmail
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  const toggleBtn = widgetContainer.querySelector('#gerassist-toggle-btn');
  const windowEl = widgetContainer.querySelector('#gerassist-window');
  const closeBtn = widgetContainer.querySelector('#gerassist-close-btn');
  const chatForm = widgetContainer.querySelector('#gerassist-form');
  const inputEl = widgetContainer.querySelector('#gerassist-input');
  const messagesContainer = widgetContainer.querySelector('#gerassist-messages');
  const typingEl = widgetContainer.querySelector('#gerassist-typing');
  const ctaContactForm = widgetContainer.querySelector('#bot-cta-contact-form');

  if (ctaContactForm) {
    ctaContactForm.addEventListener('click', () => {
      windowEl.hidden = true;
    });
  }

  // Alternar apertura/cierre de la ventana
  toggleBtn.addEventListener('click', () => {
    const isHidden = windowEl.hidden;
    windowEl.hidden = !isHidden;
    if (!windowEl.hidden && inputEl) {
      setTimeout(() => inputEl.focus(), 150);
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.hidden = true;
  });

  // Sugerencias rápidas (Pills)
  widgetContainer.querySelectorAll('.bot-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.dataset.query;
      if (query && inputEl) {
        inputEl.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Enviar mensaje
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Agregar mensaje del usuario a la pantalla
    appendMessage(messagesContainer, 'user', userText);
    inputEl.value = '';

    // Mostrar indicador de carga
    typingEl.style.display = 'flex';
    scrollToBottom(messagesContainer);

    // Guardar en historial acotado (últimos 4 mensajes)
    conversationHistory.push({ role: 'user', content: userText });
    if (conversationHistory.length > 8) conversationHistory = conversationHistory.slice(-8);

    // 2. Obtener respuesta del servicio
    const result = await sendMessageToGerAssist(userText, conversationHistory);

    typingEl.style.display = 'none';

    if (result && result.reply) {
      appendMessage(messagesContainer, 'bot', result.reply);
      conversationHistory.push({ role: 'assistant', content: result.reply });
    } else {
      appendMessage(messagesContainer, 'bot', 'Disculpa, no pude procesar esa consulta. Puedes escribir a Gerardo directamente desde la sección Contacto.');
    }

    scrollToBottom(messagesContainer);
  });
}

function appendMessage(container, sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `bot-message-wrapper bot-message--${sender}`;

  const formattedText = formatMarkdownText(text);

  if (sender === 'bot') {
    wrapper.innerHTML = `
      <div class="bot-msg-avatar"><i class="bx bx-bot"></i></div>
      <div class="bot-msg-bubble">${formattedText}</div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="bot-msg-bubble">${formattedText}</div>
    `;
  }

  container.appendChild(wrapper);
}

function formatMarkdownText(str) {
  return String(str || '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, '<br />');
}

function scrollToBottom(el) {
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
}

export function initChatbot() {
  renderChatbotWidget();
}
