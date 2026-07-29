/**
 * Módulo de Manejo del Formulario de Contacto (AJAX URLSearchParams Formspree)
 */
import { getLang } from './i18n.js';

// URL Endpoint Real de Formspree vinculado a gerardomedinavv@gmail.com
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzeyrzq';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('contact-form-status');
  if (!form || !statusDiv) return;

  // Limpiar cualquier residuo previo de bloqueos de localStorage
  try {
    localStorage.removeItem('portfolio_contact_submissions');
  } catch (e) {}

  // Guardar HTML original del botón de envío para restauración limpia
  const submitBtn = form.querySelector('button[type="submit"]');
  const defaultBtnHTML = submitBtn ? submitBtn.innerHTML : '<i class="bx bx-paper-plane"></i> Enviar Mensaje';

  // Ocultar alerta de estado anterior cuando el usuario empiece a escribir un nuevo mensaje
  form.addEventListener('input', () => {
    if (statusDiv.style.display !== 'none' && !submitBtn.disabled) {
      statusDiv.style.display = 'none';
      statusDiv.textContent = '';
      statusDiv.className = 'contact__status';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lang = getLang();

    // 1. Validación de contenido mínimo
    const messageInput = form.querySelector('textarea[name="message"]');
    const messageText = messageInput ? messageInput.value.trim() : '';

    if (messageText.length < 5) {
      const shortMsgError = lang === 'es'
        ? 'Por favor escribe un mensaje un poco más detallado.'
        : 'Please write a slightly more detailed message.';
      
      statusDiv.className = 'contact__status contact__status--error';
      statusDiv.innerHTML = `<i class="bx bx-info-circle"></i> ${shortMsgError}`;
      statusDiv.style.display = 'block';
      if (messageInput) messageInput.focus();
      return;
    }

    // Textos de estado
    const loadingText = lang === 'es' ? 'Enviando mensaje...' : 'Sending message...';
    const successMessage = lang === 'es'
      ? '¡Gracias por escribir! Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo a la brevedad.'
      : 'Thank you for writing! Your message has been sent successfully. I will get back to you shortly.';
    const errorMessage = lang === 'es'
      ? 'Hubo un inconveniente al procesar la solicitud. Por favor intenta de nuevo en un momento.'
      : 'There was an issue processing your request. Please try again in a moment.';

    // Estado enviando en el botón
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${loadingText}`;
    }

    statusDiv.className = 'contact__status contact__status--info';
    statusDiv.textContent = loadingText;
    statusDiv.style.display = 'block';

    const formData = new FormData(form);

    try {
      // Envío en formato URLSearchParams (El estándar óptimo aceptado por Formspree)
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusDiv.className = 'contact__status contact__status--success';
        statusDiv.innerHTML = `<i class="bx bx-check-circle"></i> ${successMessage}`;
        form.reset();
      } else {
        const data = await response.json();
        console.error('Error de Formspree:', data);
        throw new Error(data.error || 'Error en el envío');
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      statusDiv.className = 'contact__status contact__status--error';
      statusDiv.innerHTML = `<i class="bx bx-error-circle"></i> ${errorMessage}`;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = defaultBtnHTML;
      }
    }
  });
}
