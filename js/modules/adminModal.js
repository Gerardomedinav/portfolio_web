/**
 * Módulo del Panel de Administración y Modales CRUD (Login + Banner Editor Limpio con Carga de Archivos)
 */
import { isAuthenticated, login, logout, changePassword } from './auth.js';
import { getBannerData, saveBannerData, resetBannerData } from './dataStore.js';
import { getLang } from './i18n.js';

let modalContainer = null;

/**
 * Crea o recupera el contenedor modal principal para inyección dinámica
 */
function getModalContainer() {
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'admin-modal-overlay';
    modalContainer.className = 'admin-overlay';
    modalContainer.style.display = 'none';
    document.body.appendChild(modalContainer);
  }
  return modalContainer;
}

/**
 * Abre la ventana modal según el estado de autenticación
 */
export function openAdminModal() {
  const container = getModalContainer();
  container.innerHTML = '';
  container.style.display = 'flex';

  if (!isAuthenticated()) {
    renderLoginModal(container);
  } else {
    renderCrudPanel(container);
  }
}

/**
 * Cierra la ventana modal
 */
export function closeAdminModal() {
  if (modalContainer) {
    modalContainer.style.display = 'none';
    modalContainer.innerHTML = '';
  }
}

/**
 * Convierte un archivo local cargado a DataURL (Base64)
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Renderiza la interfaz de inicio de sesión (Login)
 */
function renderLoginModal(container) {
  const lang = getLang();

  container.innerHTML = `
    <div class="admin-modal-card admin-login-card" role="dialog" aria-labelledby="admin-login-title" aria-modal="true">
      <button type="button" class="admin-close-btn" id="admin-close-x" aria-label="Cerrar ventana">
        <i class="bx bx-x"></i>
      </button>

      <div class="admin-login-header">
        <div class="admin-icon-badge">
          <i class="bx bx-lock-alt"></i>
        </div>
        <h3 id="admin-login-title">${lang === 'es' ? 'Acceso de Administrador' : 'Admin Access'}</h3>
        <p>${lang === 'es' ? 'Ingresá tu contraseña para acceder al panel de edición.' : 'Enter your password to access the editing panel.'}</p>
      </div>

      <form id="admin-login-form" class="admin-form">
        <div class="admin-field">
          <label for="admin-pass-input">${lang === 'es' ? 'Contraseña / PIN:' : 'Password / PIN:'}</label>
          <div class="admin-input-wrapper">
            <input 
              type="password" 
              id="admin-pass-input" 
              placeholder="${lang === 'es' ? 'Ingresá tu clave...' : 'Enter your password...'}" 
              required 
              autocomplete="current-password"
            />
            <button type="button" id="toggle-pass-visibility" class="admin-eye-btn" aria-label="Mostrar u ocultar contraseña">
              <i class="bx bx-show"></i>
            </button>
          </div>
        </div>

        <div id="admin-login-status" class="admin-status" style="display:none;"></div>

        <button type="submit" class="admin-btn admin-btn--primary">
          <i class="bx bx-log-in"></i> ${lang === 'es' ? 'Iniciar Sesión' : 'Log In'}
        </button>
      </form>
    </div>
  `;

  // Eventos de Login
  const closeBtn = container.querySelector('#admin-close-x');
  if (closeBtn) closeBtn.addEventListener('click', closeAdminModal);

  const toggleEye = container.querySelector('#toggle-pass-visibility');
  const passInput = container.querySelector('#admin-pass-input');
  if (toggleEye && passInput) {
    toggleEye.addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
      toggleEye.querySelector('i').className = type === 'password' ? 'bx bx-show' : 'bx bx-hide';
    });
  }

  const loginForm = container.querySelector('#admin-login-form');
  const statusDiv = container.querySelector('#admin-login-status');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passValue = passInput.value;

    statusDiv.style.display = 'block';
    statusDiv.className = 'admin-status admin-status--info';
    statusDiv.textContent = lang === 'es' ? 'Verificando contraseña...' : 'Verifying password...';

    const success = await login(passValue);

    if (success) {
      statusDiv.className = 'admin-status admin-status--success';
      statusDiv.textContent = lang === 'es' ? '¡Acceso concedido!' : 'Access granted!';
      setTimeout(() => {
        renderCrudPanel(container);
      }, 400);
    } else {
      statusDiv.className = 'admin-status admin-status--error';
      statusDiv.textContent = lang === 'es' ? 'Contraseña incorrecta. Por favor intenta de nuevo.' : 'Incorrect password. Please try again.';
      passInput.value = '';
      passInput.focus();
    }
  });

  setTimeout(() => {
    if (passInput) passInput.focus();
  }, 100);
}

/**
 * Renderiza el panel completo CRUD de administración (Sin HTML expuesto + Selector de Archivos)
 */
function renderCrudPanel(container) {
  const lang = getLang();
  const bannerData = getBannerData();

  // Variables auxiliares para los archivos cargados temporalmente
  let uploadedProfileImg = bannerData.profileImg || '';
  let uploadedBgVideo = bannerData.bgVideo || '';
  let uploadedCvEs = bannerData.cv?.es || '';
  let uploadedCvEn = bannerData.cv?.en || '';

  container.innerHTML = `
    <div class="admin-modal-card admin-crud-card" role="dialog" aria-labelledby="admin-crud-title" aria-modal="true">
      <div class="admin-crud-header">
        <div class="admin-crud-title-group">
          <i class="bx bx-slider-alt"></i>
          <h3 id="admin-crud-title">${lang === 'es' ? 'Panel de Administración de Contenidos' : 'Content Management Panel'}</h3>
        </div>
        <div class="admin-crud-actions">
          <button type="button" id="admin-logout-btn" class="admin-btn admin-btn--secondary" title="Cerrar sesión">
            <i class="bx bx-log-out"></i> ${lang === 'es' ? 'Cerrar Sesión' : 'Logout'}
          </button>
          <button type="button" class="admin-close-btn" id="admin-close-x" aria-label="Cerrar ventana">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>

      <!-- Pestañas de navegación -->
      <div class="admin-tabs" role="tablist">
        <button type="button" class="admin-tab active" data-tab="tab-banner" role="tab" aria-selected="true">
          <i class="bx bx-home"></i> ${lang === 'es' ? '1. Banner / Inicio' : '1. Banner / Home'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-security" role="tab" aria-selected="false">
          <i class="bx bx-key"></i> ${lang === 'es' ? 'Seguridad / Clave' : 'Security / Key'}
        </button>
      </div>

      <!-- Contenido Pestaña 1: Banner / Inicio -->
      <div id="tab-banner" class="admin-tab-content active" role="tabpanel">
        <form id="admin-banner-form" class="admin-form">
          <h4 class="admin-section-subtitle"><i class="bx bx-text"></i> Texto e Identidad (Español)</h4>
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="banner-greeting-es">Saludo (ej: Hola,):</label>
              <input type="text" id="banner-greeting-es" value="${escapeAttr(bannerData.greeting?.es || 'Hola,')}" required />
            </div>
            <div class="admin-field">
              <label for="banner-name-es">Nombre a destacar:</label>
              <input type="text" id="banner-name-es" value="${escapeAttr(bannerData.name?.es || 'Gerardo')}" required />
            </div>
            <div class="admin-field admin-field--full">
              <label for="banner-role-es">Profesión / Especialidad:</label>
              <input type="text" id="banner-role-es" value="${escapeAttr(bannerData.role?.es || 'Full Stack Developer Jr.')}" required />
            </div>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1rem;"><i class="bx bx-world"></i> Texto e Identidad (Inglés)</h4>
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="banner-greeting-en">Greeting (e.g. Hi,):</label>
              <input type="text" id="banner-greeting-en" value="${escapeAttr(bannerData.greeting?.en || 'Hi,')}" required />
            </div>
            <div class="admin-field">
              <label for="banner-name-en">Highlighted Name:</label>
              <input type="text" id="banner-name-en" value="${escapeAttr(bannerData.name?.en || 'Gerardo')}" required />
            </div>
            <div class="admin-field admin-field--full">
              <label for="banner-role-en">Profession / Title:</label>
              <input type="text" id="banner-role-en" value="${escapeAttr(bannerData.role?.en || 'Full Stack Developer Jr.')}" required />
            </div>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-image-add"></i> Archivos Multimedia (Cargar desde tu equipo)</h4>
          <div class="admin-form-grid">
            <!-- Cargar Foto de Perfil -->
            <div class="admin-field admin-field--full">
              <label>Foto de Perfil:</label>
              <div class="admin-file-picker-group">
                <div class="admin-preview-thumb">
                  <img id="profile-img-preview" src="${uploadedProfileImg}" alt="Previsualización" />
                </div>
                <div class="admin-file-input-wrapper">
                  <input type="file" id="banner-img-file" accept="image/*" class="admin-file-hidden" />
                  <label for="banner-img-file" class="admin-btn admin-btn--secondary">
                    <i class="bx bx-cloud-upload"></i> Seleccionar Imagen de Perfil
                  </label>
                  <span id="banner-img-filename" class="admin-file-name">Imagen actual activa</span>
                </div>
              </div>
            </div>

            <!-- Cargar CV Español -->
            <div class="admin-field">
              <label>CV en Español (PDF):</label>
              <input type="file" id="banner-cv-file-es" accept=".pdf" class="admin-file-hidden" />
              <label for="banner-cv-file-es" class="admin-btn admin-btn--secondary">
                <i class="bx bx-file"></i> Subir PDF Español
              </label>
              <span id="banner-cves-filename" class="admin-file-name">CV Español activo</span>
            </div>

            <!-- Cargar CV Inglés -->
            <div class="admin-field">
              <label>CV en Inglés (PDF):</label>
              <input type="file" id="banner-cv-file-en" accept=".pdf" class="admin-file-hidden" />
              <label for="banner-cv-file-en" class="admin-btn admin-btn--secondary">
                <i class="bx bx-file"></i> Subir PDF Inglés
              </label>
              <span id="banner-cven-filename" class="admin-file-name">CV Inglés activo</span>
            </div>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-link"></i> Redes Sociales y Contacto</h4>
          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="banner-social-linkedin">URL LinkedIn:</label>
              <input type="url" id="banner-social-linkedin" value="${escapeAttr(bannerData.social?.linkedin || '')}" required />
            </div>

            <div class="admin-field">
              <label for="banner-social-github">URL GitHub:</label>
              <input type="url" id="banner-social-github" value="${escapeAttr(bannerData.social?.github || '')}" required />
            </div>

            <div class="admin-field admin-field--full">
              <label for="banner-social-email">Enlace de Correo (Gmail):</label>
              <input type="text" id="banner-social-email" value="${escapeAttr(bannerData.social?.email || '')}" required />
            </div>
          </div>

          <div id="admin-banner-status" class="admin-status" style="display:none;"></div>

          <div class="admin-footer-btn-group">
            <button type="button" id="admin-reset-banner-btn" class="admin-btn admin-btn--danger">
              <i class="bx bx-refresh"></i> Restablecer Valores por Defecto
            </button>
            <button type="submit" class="admin-btn admin-btn--primary">
              <i class="bx bx-save"></i> Guardar Cambios Directamente
            </button>
          </div>
        </form>
      </div>

      <!-- Contenido Pestaña 2: Seguridad / Clave -->
      <div id="tab-security" class="admin-tab-content" role="tabpanel" style="display:none;">
        <form id="admin-pass-form" class="admin-form">
          <div class="admin-field">
            <label for="pass-current">Contraseña Actual:</label>
            <input type="password" id="pass-current" required />
          </div>
          <div class="admin-field">
            <label for="pass-new">Nueva Contraseña:</label>
            <input type="password" id="pass-new" required minlength="4" />
          </div>
          <div class="admin-field">
            <label for="pass-confirm">Confirmar Nueva Contraseña:</label>
            <input type="password" id="pass-confirm" required minlength="4" />
          </div>

          <div id="admin-pass-status" class="admin-status" style="display:none;"></div>

          <button type="submit" class="admin-btn admin-btn--primary">
            <i class="bx bx-check-shield"></i> Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  `;

  // Escuchadores de eventos para los File Inputs (Foto, Video y PDFs)
  const imgFileInput = container.querySelector('#banner-img-file');
  const imgPreview = container.querySelector('#profile-img-preview');
  const imgFilename = container.querySelector('#banner-img-filename');

  if (imgFileInput) {
    imgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        imgFilename.textContent = `Archivo seleccionado: ${file.name}`;
        uploadedProfileImg = await readFileAsDataURL(file);
        if (imgPreview) imgPreview.src = uploadedProfileImg;
      }
    });
  }

  const cvEsFileInput = container.querySelector('#banner-cv-file-es');
  const cvEsFilename = container.querySelector('#banner-cves-filename');
  if (cvEsFileInput) {
    cvEsFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        cvEsFilename.textContent = `PDF cargado: ${file.name}`;
        uploadedCvEs = await readFileAsDataURL(file);
      }
    });
  }

  const cvEnFileInput = container.querySelector('#banner-cv-file-en');
  const cvEnFilename = container.querySelector('#banner-cven-filename');
  if (cvEnFileInput) {
    cvEnFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        cvEnFilename.textContent = `PDF cargado: ${file.name}`;
        uploadedCvEn = await readFileAsDataURL(file);
      }
    });
  }

  // Escuchadores de eventos en el panel CRUD
  const closeBtn = container.querySelector('#admin-close-x');
  if (closeBtn) closeBtn.addEventListener('click', closeAdminModal);

  const logoutBtn = container.querySelector('#admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      renderLoginModal(container);
    });
  }

  // Cambio de pestañas
  const tabs = container.querySelectorAll('.admin-tab');
  const tabContents = container.querySelectorAll('.admin-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(tc => tc.style.display = 'none');

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetEl = container.querySelector(`#${targetId}`);
      if (targetEl) targetEl.style.display = 'block';
    });
  });

  // Formulario Banner Submit
  const bannerForm = container.querySelector('#admin-banner-form');
  const bannerStatus = container.querySelector('#admin-banner-status');

  bannerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newData = {
      greeting: {
        es: container.querySelector('#banner-greeting-es').value.trim(),
        en: container.querySelector('#banner-greeting-en').value.trim()
      },
      name: {
        es: container.querySelector('#banner-name-es').value.trim(),
        en: container.querySelector('#banner-name-en').value.trim()
      },
      role: {
        es: container.querySelector('#banner-role-es').value.trim(),
        en: container.querySelector('#banner-role-en').value.trim()
      },
      profileImg: uploadedProfileImg,
      cv: {
        es: uploadedCvEs,
        en: uploadedCvEn
      },
      social: {
        linkedin: container.querySelector('#banner-social-linkedin').value.trim(),
        github: container.querySelector('#banner-social-github').value.trim(),
        email: container.querySelector('#banner-social-email').value.trim()
      }
    };

    const success = saveBannerData(newData);
    bannerStatus.style.display = 'block';

    if (success) {
      bannerStatus.className = 'admin-status admin-status--success';
      bannerStatus.innerHTML = '<i class="bx bx-check-circle"></i> ¡Cambios guardados con éxito en la sección Inicio!';
    } else {
      bannerStatus.className = 'admin-status admin-status--error';
      bannerStatus.innerHTML = '<i class="bx bx-error-circle"></i> No se pudieron guardar los cambios.';
    }
  });

  // Restablecer valores por defecto del Banner
  const resetBtn = container.querySelector('#admin-reset-banner-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de restablecer la sección Inicio a los valores por defecto?')) {
        resetBannerData();
        renderCrudPanel(container);
      }
    });
  }

  // Formulario Cambiar Contraseña Submit
  const passForm = container.querySelector('#admin-pass-form');
  const passStatus = container.querySelector('#admin-pass-status');

  passForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPass = container.querySelector('#pass-current').value;
    const newPass = container.querySelector('#pass-new').value;
    const confirmPass = container.querySelector('#pass-confirm').value;

    passStatus.style.display = 'block';

    if (newPass !== confirmPass) {
      passStatus.className = 'admin-status admin-status--error';
      passStatus.textContent = 'Las nuevas contraseñas no coinciden.';
      return;
    }

    const result = await changePassword(currentPass, newPass);

    if (result.success) {
      passStatus.className = 'admin-status admin-status--success';
      passStatus.textContent = result.message;
      passForm.reset();
    } else {
      passStatus.className = 'admin-status admin-status--error';
      passStatus.textContent = result.message;
    }
  });
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function initAdminModal() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer && modalContainer.style.display === 'flex') {
      closeAdminModal();
    }
  });

  document.addEventListener('adminAuthChange', (e) => {
    if (modalContainer && modalContainer.style.display === 'flex') {
      if (!e.detail.loggedIn) {
        renderLoginModal(modalContainer);
      }
    }
  });
}
