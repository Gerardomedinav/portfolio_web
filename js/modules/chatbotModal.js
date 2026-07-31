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

    <!-- Nube flotante explicativa (Tooltip GerAssist) -->
    <div class="bot-tooltip-bubble" id="bot-tooltip-bubble" role="tooltip" data-i18n="botTooltip">
      ${lang === 'es' ? '🤖 GerAssist – Asistente Virtual e IA Guía del Portafolio' : '🤖 GerAssist – AI Virtual Assistant & Portfolio Guide'}
    </div>

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
        <div class="bot-header-actions">
          <button id="gerassist-auto-tts-toggle" class="bot-header-action-btn" aria-label="Lectura por voz de respuestas" title="Activar/desactivar voz automática de GerAssist">
            <i class="bx bx-volume-mute"></i>
            <span class="bot-tts-status-text">${lang === 'es' ? 'Voz Off' : 'Voice Off'}</span>
          </button>
          <button id="gerassist-close-btn" class="bot-close-btn" aria-label="Cerrar ventana de chat">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>

      <!-- Área de Mensajes -->
      <div id="gerassist-messages" class="bot-messages-container">
        <!-- Mensaje de bienvenida inicial -->
        <div class="bot-message-wrapper bot-message--bot">
          <div class="bot-msg-avatar"><i class="bx bx-bot"></i></div>
          <div class="bot-msg-bubble">
            ${lang === 'es' 
              ? '¡Hola! 👋 Qué gusto saludarte. Soy <strong>GerAssist</strong>, el asistente personal y guía interactivo de <strong>Gerardo Medina</strong>.<br /><br />Estoy aquí para acompañarte y contarte sobre su perfil como <strong>Desarrollador Full Stack & Analista de Datos</strong>, su formación en la <strong>UTN y UNAF</strong>, sus <strong>proyectos de impacto real</strong> y cómo usar las herramientas de accesibilidad.<br /><br />💡 <em>¿Te gustaría que recorramos sus proyectos destacados, sus habilidades o preferís que agendemos una reunión o entrevista con Gerardo?</em>' 
              : "Hi! 👋 Great to meet you. I am <strong>GerAssist</strong>, Gerardo Medina's AI guide.<br /><br />I am here to show you his <strong>Full Stack & Data Analyst</strong> background, his <strong>UTN & UNAF</strong> studies, and the <strong>real impact</strong> of his projects.<br /><br />💡 <em>Would you like to explore his featured projects, skills, or schedule a meeting with Gerardo?</em>"}
            <div class="bot-msg-actions">
              <button type="button" class="bot-speak-btn" aria-label="Escuchar mensaje en voz alta" title="Escuchar respuesta">
                <i class="bx bx-volume-full"></i> <span>${lang === 'es' ? 'Escuchar' : 'Listen'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de sugerencias rápidas -->
        <div class="bot-quick-pills">
          <button class="bot-pill" data-query="¿Quién es Gerardo y cuál es su perfil?">👤 Perfil & UTN</button>
          <button class="bot-pill" data-query="Ver proyectos de Gerardo">📂 Proyectos</button>
          <button class="bot-pill" data-query="¿Qué funciones de accesibilidad tenés y cómo te las pido?">♿ Accesibilidad</button>
          <button class="bot-pill" data-query="Quiero coordinar una reunión o entrevista con Gerardo">📅 Cita / Contacto</button>
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
          placeholder="${lang === 'es' ? 'Escribe o dicta tu mensaje aquí...' : 'Type or dictate your message here...'}" 
          autocomplete="off" 
          required 
        />
        <button type="button" id="gerassist-mic-btn" class="bot-mic-btn" aria-label="Dictar mensaje por voz (Micrófono)" title="Dictar por voz (Micrófono)">
          <i class="bx bx-microphone"></i>
        </button>
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
  const autoTtsToggleBtn = widgetContainer.querySelector('#gerassist-auto-tts-toggle');
  const chatForm = widgetContainer.querySelector('#gerassist-form');
  const inputEl = widgetContainer.querySelector('#gerassist-input');
  const micBtn = widgetContainer.querySelector('#gerassist-mic-btn');
  const messagesContainer = widgetContainer.querySelector('#gerassist-messages');
  const typingEl = widgetContainer.querySelector('#gerassist-typing');
  const ctaContactForm = widgetContainer.querySelector('#bot-cta-contact-form');

  let isAutoSpeechActive = false;

  if (autoTtsToggleBtn) {
    autoTtsToggleBtn.addEventListener('click', () => {
      isAutoSpeechActive = !isAutoSpeechActive;
      autoTtsToggleBtn.classList.toggle('active', isAutoSpeechActive);
      const icon = autoTtsToggleBtn.querySelector('i');
      const textSpan = autoTtsToggleBtn.querySelector('.bot-tts-status-text');

      if (isAutoSpeechActive) {
        if (icon) icon.className = 'bx bx-volume-full';
        if (textSpan) textSpan.textContent = lang === 'es' ? 'Voz On' : 'Voice On';
        autoTtsToggleBtn.setAttribute('title', lang === 'es' ? 'Voz de GerAssist activada (Haz clic para silenciar)' : 'GerAssist voice enabled (Click to mute)');
        
        // Reproducir el último mensaje de GerAssist si existe
        const lastBotBubble = messagesContainer.querySelector('.bot-message--bot:last-child .bot-msg-bubble');
        if (lastBotBubble) {
          const clone = lastBotBubble.cloneNode(true);
          const actions = clone.querySelector('.bot-msg-actions');
          if (actions) actions.remove();
          const speakBtn = lastBotBubble.querySelector('.bot-speak-btn');
          speakBotMessage(clone.innerText, speakBtn);
        }
      } else {
        if (icon) icon.className = 'bx bx-volume-mute';
        if (textSpan) textSpan.textContent = lang === 'es' ? 'Voz Off' : 'Voice Off';
        autoTtsToggleBtn.setAttribute('title', lang === 'es' ? 'Voz de GerAssist desactivada (Haz clic para activar)' : 'GerAssist voice disabled (Click to enable)');
        stopBotMessage();
      }
    });
  }

  // Inicializar micrófono y dictado por voz
  if (inputEl && micBtn) {
    setupSpeechRecognition(inputEl, micBtn);
  }

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
    widgetContainer.classList.toggle('window-open', !windowEl.hidden);
    if (!windowEl.hidden && inputEl) {
      setTimeout(() => inputEl.focus(), 150);
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.hidden = true;
    widgetContainer.classList.remove('window-open');
  });

  // Escuchador de clics en enlaces y reproductor de voz dentro de la conversación
  messagesContainer.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('.bot-speak-btn');
    if (speakBtn) {
      const bubble = speakBtn.closest('.bot-msg-bubble');
      if (bubble) {
        const clone = bubble.cloneNode(true);
        const actionsInClone = clone.querySelector('.bot-msg-actions');
        if (actionsInClone) actionsInClone.remove();
        speakBotMessage(clone.innerText, speakBtn);
      }
      return;
    }

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

      // Reproducción automática de voz si está activada
      if (isAutoSpeechActive) {
        speakBotMessage(result.reply);
      }

      // 3. Ejecutar Navegación Inteligente, Accesibilidad y Pre-rellenado si aplica
      handleSmartNavigationAndFill(userText, result.reply);
    } else {
      appendMessage(messagesContainer, 'bot', 'Disculpa, no pude procesar esa consulta. Puedes escribir a Gerardo directamente desde la sección Contacto.');
    }
  });
}

function appendMessage(container, sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `bot-message-wrapper bot-message--${sender}`;

  const formattedText = formatMarkdownText(text);
  const lang = getLang();

  if (sender === 'bot') {
    wrapper.innerHTML = `
      <div class="bot-msg-avatar"><i class="bx bx-bot"></i></div>
      <div class="bot-msg-bubble">
        ${formattedText}
        <div class="bot-msg-actions">
          <button type="button" class="bot-speak-btn" aria-label="Escuchar respuesta en voz alta" title="Escuchar respuesta">
            <i class="bx bx-volume-full"></i> <span>${lang === 'es' ? 'Escuchar' : 'Listen'}</span>
          </button>
        </div>
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="bot-msg-bubble">${formattedText}</div>
    `;
  }

  container.appendChild(wrapper);

  // Si el mensaje es del bot, desplazarse suavemente al inicio del mensaje DENTRO del contenedor del chat
  if (sender === 'bot') {
    setTimeout(() => {
      container.scrollTo({
        top: wrapper.offsetTop - container.offsetTop - 10,
        behavior: 'smooth'
      });
    }, 60);
  } else {
    scrollToBottom(container);
  }

  return wrapper;
}

export function stopBotMessage() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  const lang = getLang();
  document.querySelectorAll('.bot-speak-btn').forEach(b => {
    b.classList.remove('speaking');
    const iconEl = b.querySelector('i');
    const textSpan = b.querySelector('span');
    if (iconEl) iconEl.className = 'bx bx-volume-full';
    if (textSpan) textSpan.textContent = lang === 'es' ? 'Escuchar' : 'Listen';
  });
}

export function speakBotMessage(rawText, speakBtn = null) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;

  // Si el botón ya está reproduciendo, al volver a hacer clic se DETIENE la voz
  if (speakBtn && speakBtn.classList.contains('speaking')) {
    stopBotMessage();
    return;
  }

  stopBotMessage();

  if (synth.paused) {
    try { synth.resume(); } catch (e) {}
  }

  const cleanText = String(rawText || '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/gu, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n+/g, '. ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const lang = getLang();
  utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voices = synth.getVoices();
  if (voices && voices.length > 0) {
    const targetLang = lang === 'es' ? 'es' : 'en';
    const matched = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(targetLang));
    if (matched) utterance.voice = matched;
  }

  if (speakBtn) {
    speakBtn.classList.add('speaking');
    const iconEl = speakBtn.querySelector('i');
    const textSpan = speakBtn.querySelector('span');
    if (iconEl) iconEl.className = 'bx bx-volume-full bx-tada';
    if (textSpan) textSpan.textContent = lang === 'es' ? 'Detener' : 'Stop';

    utterance.onstart = () => {
      speakBtn.classList.add('speaking');
    };
    utterance.onend = () => {
      stopBotMessage();
    };
    utterance.onerror = (err) => {
      console.warn('Error en emisión de voz:', err);
      stopBotMessage();
    };
  }

  synth.speak(utterance);
}

function setupSpeechRecognition(inputEl, micBtn) {
  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

  if (!SpeechRecognition) {
    micBtn.setAttribute('title', 'Dictado por voz no disponible en este navegador');
    micBtn.style.opacity = '0.5';
    micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      alert('Tu navegador no soporta el reconocimiento de voz nativo (Web Speech API). Te recomendamos utilizar Google Chrome, Microsoft Edge o Safari.');
    });
    return;
  }

  let activeRecognition = null;
  let isListening = false;

  function stopMic() {
    isListening = false;
    micBtn.classList.remove('listening');
    micBtn.setAttribute('title', 'Dictar por voz (Micrófono)');
    const lang = getLang();
    inputEl.placeholder = lang === 'es' ? 'Escribe o dicta tu mensaje...' : 'Type or dictate your message...';
  }

  micBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening && activeRecognition) {
      try {
        activeRecognition.stop();
      } catch (err) {}
      stopMic();
      return;
    }

    let audioStream = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn('Error accediendo al micrófono:', err);
        inputEl.placeholder = getLang() === 'es' ? 'Permiso de micrófono requerido 🔒' : 'Microphone permission required 🔒';
        stopMic();
        return;
      }
    }

    try {
      activeRecognition = new SpeechRecognition();
      activeRecognition.continuous = false;
      activeRecognition.interimResults = true;
      activeRecognition.lang = getLang() === 'es' ? 'es-AR' : 'en-US';

      activeRecognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        micBtn.setAttribute('title', 'Escuchando... Haz clic para detener');
        inputEl.placeholder = getLang() === 'es' ? 'Escuchando... Hablá ahora 🎙️' : 'Listening... Speak now 🎙️';
      };

      activeRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        inputEl.value = transcript;
      };

      activeRecognition.onerror = (event) => {
        console.warn('Error en SpeechRecognition:', event.error);
        stopMic();
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          inputEl.placeholder = getLang() === 'es' ? 'Micrófono denegado en sistema/navegador 🔒' : 'Microphone blocked by system/browser 🔒';
        } else if (event.error === 'network') {
          inputEl.placeholder = getLang() === 'es' ? 'Error de red en reconocimiento de voz 🌐' : 'Network error in speech recognition 🌐';
        }
      };

      activeRecognition.onend = () => {
        stopMic();
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
        }
        if (inputEl.value.trim()) {
          inputEl.focus();
        }
      };

      activeRecognition.start();
    } catch (e) {
      console.warn('Error al iniciar el reconocimiento de voz:', e);
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      stopMic();
    }
  });
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
 * Función de Navegación Inteligente, Accesibilidad y Resalte de Secciones con Scroll Suave
 */
function handleSmartNavigationAndFill(userText, botReply) {
  const userLower = (userText || '').toLowerCase().trim();
  const botLower = (botReply || '').toLowerCase().trim();
  const fullText = userLower + ' ' + botLower;

  // --- 0. COMANDOS DIRECTOS DE ACCESIBILIDAD EJECUTADOS POR GERASSIST ---

  // A. Control de Tamaño de Fuente / Letra
  if (userLower.includes('agrandar') || userLower.includes('aumentar') || userLower.includes('ampliar') || userLower.includes('letra grande') || userLower.includes('texto grande') || userLower.includes('fuente grande') || userLower.includes('mas grande') || userLower.includes('más grande')) {
    setFontScaleAction('increase');
    return;
  }
  if (userLower.includes('reducir') || userLower.includes('disminuir') || userLower.includes('achicar') || userLower.includes('bajar') || userLower.includes('letra chica') || userLower.includes('letra pequeña') || userLower.includes('texto pequeño') || userLower.includes('mas pequeña') || userLower.includes('más pequeña') || userLower.includes('mas chica') || userLower.includes('más chica')) {
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

  // 2. Detección de Intención de Proyectos
  // Solo se abre un modal de proyecto específico cuando el usuario menciona EXPLÍCITAMENTE el nombre de ese proyecto en particular.
  // Si el usuario pregunta por "proyectos" en general, solo se desplaza suavemente a la sección #projects sin abrir ningún modal.
  const specificProjectNames = [
    'siga', 'nexo', 'proyecoins', 'ahorcado', 'entrevigas',
    'bytezar', 'planificad', 'codigo urbano', 'código urbano', 'catalogo', 'catálogo', 'analytics'
  ];

  const mentionsSpecificProject = specificProjectNames.some(name => userLower.includes(name));

  if (mentionsSpecificProject) {
    closeAccessibilityPanel();
    closeAllProjectModals();

    openProjectModalByName(userLower);

    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // Si se menciona la palabra general "proyecto" o "proyectos" (o al hacer clic en el botón de sugerencia rápida)
  if (fullText.includes('proyecto') || fullText.includes('proyectos')) {
    closeAccessibilityPanel();
    closeAllProjectModals();

    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // 3. Detección de Intención de Contactar / Cita / Entrevista -> Desplazar a #contact y autofill
  if (
    fullText.includes('contact') || 
    fullText.includes('contrat') || 
    fullText.includes('cita') ||
    fullText.includes('reunion') ||
    fullText.includes('reunión') ||
    fullText.includes('entrevista') ||
    fullText.includes('email') || 
    fullText.includes('correo') ||
    fullText.includes('escribir') ||
    fullText.includes('mensaje') ||
    fullText.includes('vías oficiales')
  ) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    setTimeout(() => triggerContactAutoFill(), 400);
    return;
  }

  // 4. Detección de Intención de Sobre Mí / UTN / Estudios -> Scroll suave a #about
  if (
    fullText.includes('sobre mi') || 
    fullText.includes('sobre mí') || 
    fullText.includes('utn') || 
    fullText.includes('unaf') || 
    fullText.includes('perfil') || 
    fullText.includes('estudios') || 
    fullText.includes('trayectoria') ||
    fullText.includes('educacion') ||
    fullText.includes('educación')
  ) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // 5. Detección de Intención de Habilidades / Skills -> Scroll suave a #skills
  if (
    fullText.includes('habilidad') || 
    fullText.includes('skills') || 
    fullText.includes('tecnolog') || 
    fullText.includes('framework') || 
    fullText.includes('herramienta') ||
    fullText.includes('javascript') ||
    fullText.includes('docker') ||
    fullText.includes('sql')
  ) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // 6. Detección de Intención de CV / Currículum -> Scroll suave a #home donde se ubica el botón de descarga
  const cvKeywords = ['cv', 'curriculum', 'currículum', 'resume', 'hoja de vida', 'descargar cv', 'ver cv'];
  if (cvKeywords.some(kw => fullText.includes(kw))) {
    closeAccessibilityPanel();
    closeAllProjectModals();
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
