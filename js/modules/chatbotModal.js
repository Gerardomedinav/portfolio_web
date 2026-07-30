/**
 * Módulo de la Interfaz Interactiva de GerAssist (Chatbot Floating Widget con Navegación Inteligente, Accesibilidad y Pre-rellenado)
 */
import { sendMessageToGerAssist } from './botService.js';
import { getLang } from './i18n.js';
import { openProjectModalByName, closeAllProjectModals } from './projects.js';
import { openAccessibilityPanel, closeAccessibilityPanel } from './navigation.js';
import { toggleThemeAction } from './theme.js';
import { 
  triggerTTSAction, 
  setFilterAction, 
  setFontScaleAction, 
  toggleReadingSpacingAction, 
  toggleLinkHighlightAction, 
  toggleAnimationsAction, 
  resetAllAccessibilityAction 
} from './accessibility.js';

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
              ? '¡Hola! 👋 Qué gusto saludarte. Soy <strong>GerAssist</strong>, el asistente personal de <strong>Gerardo Medina</strong>.<br /><br />Estoy aquí para contarte sobre su perfil como <strong>Desarrollador Full Stack & Analista de Datos</strong>, sus estudios en la <strong>UTN</strong> y el <strong>impacto real</strong> de sus proyectos.<br /><br />💡 <em>¡También puedo ajustar la accesibilidad de la web por vos! Decime "agrandar letra", "leer la web", "daltonismo", "alto contraste" o "restablecer accesibilidad".</em>' 
              : "Hi! 👋 Great to meet you. I am <strong>GerAssist</strong>, Gerardo Medina's AI assistant.<br /><br />I am here to tell you about his <strong>Full Stack & Data Analyst</strong> background, his <strong>UTN</strong> studies, and the <strong>real impact</strong> of his projects.<br /><br />💡 <em>I can also adjust the accessibility of the site for you! Ask me to 'increase font size', 'read out loud', 'monochrome filter', 'high contrast', or 'reset accessibility'.</em>"}
          </div>
        </div>

        <!-- Botones de sugerencias rápidas -->
        <div class="bot-quick-pills">
          <button class="bot-pill" data-query="¿Quién es Gerardo y cuál es su perfil?">👤 Perfil & UTN</button>
          <button class="bot-pill" data-query="Agrandar letra de la web">🔍 Agrandar Letra</button>
          <button class="bot-pill" data-query="Leer la web por voz">🔊 Leer por Voz</button>
          <button class="bot-pill" data-query="Activar filtro monocromático (Daltonismo)">👁️ Daltonismo</button>
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
          placeholder="${lang === 'es' ? 'Escribe tu mensaje o comando de accesibilidad...' : 'Type your message or accessibility command...'}" 
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

      // 3. Ejecutar Navegación Inteligente, Accesibilidad y Pre-rellenado si aplica
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
 * Función de Navegación Inteligente, Accesibilidad y Resalte de Secciones
 */
function handleSmartNavigationAndFill(userText, botReply) {
  const userLower = (userText || '').toLowerCase().trim();
  const botLower = (botReply || '').toLowerCase().trim();

  // --- 0. COMANDOS DIRECTOS DE ACCESIBILIDAD EJECUTADOS POR GERASSIST ---

  // A. Control de Tamaño de Fuente / Letra
  if (userLower.includes('agrandar') || userLower.includes('aumentar') || userLower.includes('ampliar') || userLower.includes('letra grande') || userLower.includes('texto grande') || userLower.includes('fuente grande') || userLower.includes('mas grande') || userLower.includes('más grande')) {
    setFontScaleAction('increase');
    return;
  }
  if (userLower.includes('reducir') || userLower.includes('achicar') || userLower.includes('letra chica') || userLower.includes('letra pequeña') || userLower.includes('texto pequeño') || userLower.includes('mas pequeña') || userLower.includes('más pequeña') || userLower.includes('mas chica') || userLower.includes('más chica')) {
    setFontScaleAction('decrease');
    return;
  }
  if (userLower.includes('restablecer letra') || userLower.includes('letra normal') || userLower.includes('fuente normal')) {
    setFontScaleAction('reset');
    return;
  }

  // B. Lector por Voz (TTS)
  if (userLower.includes('detener voz') || userLower.includes('pausar voz') || userLower.includes('parar voz') || userLower.includes('callar voz') || userLower.includes('detener lectura') || userLower.includes('parar lectura')) {
    triggerTTSAction('stop');
    return;
  }
  if (userLower.includes('leer') || userLower.includes('escuchar') || userLower.includes('voz') || userLower.includes('lector') || userLower.includes('hablar') || userLower.includes('leeme') || userLower.includes('léeme')) {
    triggerTTSAction('play');
    return;
  }

  // C. Filtros de Color y Daltonismo
  if (userLower.includes('monocrom') || userLower.includes('daltonis') || userLower.includes('daltónic') || userLower.includes('daltonic') || userLower.includes('grises') || userLower.includes('blanco y negro')) {
    setFilterAction('monochrome');
    return;
  }
  if (userLower.includes('alto contraste') || userLower.includes('contraste alto')) {
    setFilterAction('contrast');
    return;
  }
  if (userLower.includes('invertir') || userLower.includes('inversion') || userLower.includes('inversión')) {
    setFilterAction('invert');
    return;
  }
  if (userLower.includes('sin filtro') || userLower.includes('filtro normal') || userLower.includes('colores normales') || userLower.includes('quitar filtro')) {
    setFilterAction('normal');
    return;
  }

  // D. Espaciado para Dislexia
  if (userLower.includes('dislex') || userLower.includes('espaciado')) {
    toggleReadingSpacingAction(true);
    return;
  }

  // E. Resaltar Enlaces
  if (userLower.includes('resaltar') || userLower.includes('destacar link') || userLower.includes('destacar enlace')) {
    toggleLinkHighlightAction(true);
    return;
  }

  // F. Pausar Animaciones (TDAH)
  if (userLower.includes('animacion') || userLower.includes('animación') || userLower.includes('tdah') || userLower.includes('detener movimiento')) {
    toggleAnimationsAction(true);
    return;
  }

  // G. Restablecer Accesibilidad Completa
  if (userLower.includes('restablecer accesib') || userLower.includes('limpiar accesib') || userLower.includes('reiniciar accesib') || userLower.includes('restablecer todo')) {
    resetAllAccessibilityAction();
    return;
  }

  // H. Modo Oscuro / Modo Claro / Tema
  if (userLower.includes('modo oscuro') || userLower.includes('tema oscuro') || userLower.includes('oscuro')) {
    toggleThemeAction('dark');
    return;
  }
  if (userLower.includes('modo claro') || userLower.includes('tema claro') || userLower.includes('claro')) {
    toggleThemeAction('light');
    return;
  }
  if (userLower.includes('cambiar tema') || userLower.includes('cambiar modo')) {
    toggleThemeAction();
    return;
  }

  // 1. Detección de Intención de Accesibilidad General -> Abrir panel de accesibilidad y cerrar modales
  const accessKeywords = ['accesibil', 'wcag', 'panel de accesib', 'widget'];
  if (accessKeywords.some(kw => userLower.includes(kw))) {
    closeAllProjectModals();
    openAccessibilityPanel();
    return;
  }

  // 2. Detección de Intención de Proyectos -> Cerrar accesibilidad y modales anteriores, abrir el nuevo proyecto
  const projectKeywords = [
    'siga', 'analytics', 'python', 'nexo', 'proyecoins',
    'ahorcado', 'entrevigas', 'bytezar', 'planificador', 'codigo urbano', 'catalogo',
    'proyecto', 'proyectos'
  ];

  if (projectKeywords.some(kw => userLower.includes(kw))) {
    closeAccessibilityPanel();
    closeAllProjectModals();

    const opened = openProjectModalByName(userLower);

    if (!opened) {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    return;
  }

  // 3. Detección de Intención de Contactar -> Cerrar accesibilidad y modales anteriores, desplazar a #contact y pre-rellenar
  if (
    userLower.includes('contact') || 
    userLower.includes('contrat') || 
    userLower.includes('email') || 
    userLower.includes('correo') ||
    userLower.includes('escribir') ||
    userLower.includes('mensaje') ||
    botLower.includes('vías oficiales')
  ) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    setTimeout(() => triggerContactAutoFill(), 500);
    return;
  }

  // 4. Detección de Intención de Sobre Mí / UTN -> Cerrar accesibilidad y modales de proyectos, desplazar a #about
  if (userLower.includes('sobre mi') || userLower.includes('utn') || userLower.includes('perfil') || userLower.includes('estudios') || userLower.includes('trayectoria')) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  // 5. Detección de Intención de Habilidades -> Cerrar accesibilidad y modales de proyectos, desplazar a #skills
  if (userLower.includes('habilidad') || userLower.includes('skills') || userLower.includes('tecnolog') || userLower.includes('framework') || userLower.includes('herramienta')) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  // 6. Detección de Intención de CV / Currículum -> Cerrar accesibilidad y modales, desplazar a #home donde se encuentra el botón de descarga de CV
  const cvKeywords = ['cv', 'curriculum', 'currículum', 'resume', 'hoja de vida', 'descargar cv', 'ver cv'];
  if (cvKeywords.some(kw => userLower.includes(kw))) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }
}

/**
 * Pre-rellena el formulario de contacto con un borrador personalizado y desplaza al usuario
 */
export function triggerContactAutoFill(customDraftMessage = null) {
  // 1. Cerrar automáticamente cualquier modal de proyecto o panel de accesibilidad abierto
  closeAccessibilityPanel();
  closeAllProjectModals();

  const contactSection = document.getElementById('contact');

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
