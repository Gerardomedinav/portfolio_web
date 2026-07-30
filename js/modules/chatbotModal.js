/**
 * Módulo de la Interfaz Interactiva de GerAssist (Chatbot Floating Widget con Navegación Inteligente y Pre-rellenado de Contacto)
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
              ? '¡Hola! 👋 Qué gusto saludarte. Soy <strong>GerAssist</strong>, el asistente personal de <strong>Gerardo Medina</strong>.<br /><br />Estoy aquí para contarte sobre su perfil como <strong>Desarrollador Full Stack & Analista de Datos</strong>, sus estudios en la <strong>UTN</strong> y el <strong>impacto real</strong> de sus proyectos. ¿Sobre qué te gustaría saber más?' 
              : "Hi! 👋 Great to meet you. I am <strong>GerAssist</strong>, Gerardo Medina's AI assistant.<br /><br />I am here to tell you about his <strong>Full Stack & Data Analyst</strong> background, his <strong>UTN</strong> studies, and the <strong>real impact</strong> of his projects. What would you like to know more about?"}
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
        <button type="button" class="bot-cta-link" id="bot-cta-contact-form">
          <i class="bx bx-envelope"></i> Formulario
        </button>
        <a href="https://www.linkedin.com/in/gerardomedinav/" target="_blank" rel="noopener noreferrer" class="bot-cta-link">
          <i class="bx bxl-linkedin"></i> LinkedIn
        </a>
        <a href="mailto:gerardomedinavv@gmail.com" target="_blank" rel="noopener noreferrer" class="bot-cta-link">
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
    ctaContactForm.addEventListener('click', (e) => {
      e.preventDefault();
      triggerContactAutoFill();
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

  // Escuchador de clics en enlaces dentro de la conversación
  messagesContainer.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a');
    if (targetLink) {
      const href = targetLink.getAttribute('href') || '';
      if (href === '#contact' || href.includes('#contact')) {
        e.preventDefault();
        triggerContactAutoFill();
      } else if (href.startsWith('#')) {
        e.preventDefault();
        const targetSec = document.querySelector(href);
        if (targetSec) {
          windowEl.hidden = true;
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
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

    // Guardar en historial acotado (últimos 8 mensajes)
    conversationHistory.push({ role: 'user', content: userText });
    if (conversationHistory.length > 8) conversationHistory = conversationHistory.slice(-8);

    // 2. Obtener respuesta del servicio
    const result = await sendMessageToGerAssist(userText, conversationHistory);

    typingEl.style.display = 'none';

    if (result && result.reply) {
      appendMessage(messagesContainer, 'bot', result.reply);
      conversationHistory.push({ role: 'assistant', content: result.reply });

      // 3. Ejecutar Navegación Inteligente y Pre-rellenado de Contacto si aplica
      handleSmartNavigationAndFill(userText, result.reply);
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
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((#.*?)\)/g, '<a href="$2" class="bot-internal-link">$1</a>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, '<br />');
}

function scrollToBottom(el) {
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
}

/**
 * Función de Navegación Inteligente y Resalte de Secciones
 */
function handleSmartNavigationAndFill(userText, botReply) {
  const userLower = (userText || '').toLowerCase().trim();
  const botLower = (botReply || '').toLowerCase().trim();

  // 1. Detección de Intención de Contactar -> Desplazar a #contact y pre-rellenar formulario
  if (
    userLower.includes('contact') || 
    userLower.includes('contrat') || 
    userLower.includes('email') || 
    userLower.includes('correo') ||
    userLower.includes('escribir') ||
    userLower.includes('mensaje') ||
    botLower.includes('vías oficiales')
  ) {
    // Si la consulta fue sobre contacto, ofrecer desplazamiento suave a la sección
    setTimeout(() => triggerContactAutoFill(), 1200);
    return;
  }

  // 2. Detección de Intención de Proyectos -> Desplazar a #projects y resaltar tarjeta específica
  const projectKeywords = [
    'proyecto', 'proyectos', 'siga', 'analytics', 'python', 'nexo', 'proyecoins',
    'ahorcado', 'entrevigas', 'bytezar', 'planificador', 'codigo urbano', 'catalogo'
  ];

  if (projectKeywords.some(kw => userLower.includes(kw))) {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });

      // Buscar si mencionó un proyecto específico para resaltarlo en pantalla
      const projectCards = document.querySelectorAll('.project__card, .projects__name, .skills__name');
      projectCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (
          (userLower.includes('siga') && cardText.includes('siga')) ||
          (userLower.includes('python') && cardText.includes('python')) ||
          (userLower.includes('nexo') && cardText.includes('nexo')) ||
          (userLower.includes('proyecoins') && cardText.includes('proyecoins')) ||
          (userLower.includes('ahorcado') && cardText.includes('ahorcado')) ||
          (userLower.includes('entrevigas') && cardText.includes('entrevigas')) ||
          (userLower.includes('bytezar') && cardText.includes('bytezar'))
        ) {
          card.classList.remove('highlight-pulse');
          void card.offsetWidth;
          card.classList.add('highlight-pulse');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
    return;
  }

  // 3. Detección de Intención de Sobre Mí / UTN -> Desplazar a #about
  if (userLower.includes('sobre mi') || userLower.includes('utn') || userLower.includes('perfil') || userLower.includes('estudios') || userLower.includes('trayectoria')) {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  // 4. Detección de Intención de Habilidades -> Desplazar a #skills
  if (userLower.includes('habilidad') || userLower.includes('skills') || userLower.includes('tecnolog') || userLower.includes('framework') || userLower.includes('herramienta')) {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }
}

/**
 * Pre-rellena el formulario de contacto con un borrador personalizado y desplaza al usuario
 */
export function triggerContactAutoFill(customDraftMessage = null) {
  const contactSection = document.getElementById('contact');
  const windowEl = document.getElementById('gerassist-window');

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });

    const messageInput = document.querySelector('textarea[name="message"]');
    const subjectInput = document.querySelector('input[name="subject"]');
    const nameInput = document.querySelector('input[name="name"]');

    if (messageInput) {
      const defaultDraft = `¡Hola Gerardo! Estuve navegando por tu portafolio web y conversando con GerAssist. Me interesa ponerme en contacto contigo para conversar sobre una propuesta laboral / proyecto de desarrollo y análisis de datos.`;
      messageInput.value = customDraftMessage || defaultDraft;
    }

    if (subjectInput && !subjectInput.value) {
      subjectInput.value = `Contacto directo - Vía GerAssist`;
    }

    // Ocultar modal del bot para visibilidad completa del formulario
    if (windowEl) windowEl.hidden = true;

    setTimeout(() => {
      if (nameInput && !nameInput.value) {
        nameInput.focus();
      } else if (messageInput) {
        messageInput.focus();
      }
    }, 450);
  }
}

export function initChatbot() {
  renderChatbotWidget();
}
