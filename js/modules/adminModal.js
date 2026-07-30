/**
 * Módulo del Panel de Administración y Modales CRUD (Login + Banner + About + Projects + Skills + Contact/Footer + Alt Text)
 */
import { isAuthenticated, login, logout, changePassword } from './auth.js';
import { getBannerData, saveBannerData, resetBannerData, getAboutData, saveAboutData, resetAboutData, getProjectsData, saveProjectsData, resetProjectsData, getSkillsData, saveSkillsData, resetSkillsData, getContactData, saveContactData, resetContactData } from './dataStore.js';
import { getLang } from './i18n.js';

let modalContainer = null;

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

export function closeAdminModal() {
  if (modalContainer) {
    modalContainer.style.display = 'none';
    modalContainer.innerHTML = '';
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

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

async function renderCrudPanel(container) {
  const lang = getLang();
  const bannerData = getBannerData();
  const aboutData = getAboutData();
  let projectsData = await getProjectsData();
  let skillsData = await getSkillsData();
  const contactData = getContactData();

  let uploadedProfileImg = bannerData.profileImg || '';
  let uploadedCvEs = bannerData.cv?.es || '';
  let uploadedCvEn = bannerData.cv?.en || '';
  let uploadedAboutPhotoImg = aboutData.photoImg || '';

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
          <i class="bx bx-home"></i> ${lang === 'es' ? '1. Banner' : '1. Banner'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-about" role="tab" aria-selected="false">
          <i class="bx bx-user"></i> ${lang === 'es' ? '2. Sobre Mí' : '2. About Me'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-projects" role="tab" aria-selected="false">
          <i class="bx bx-briefcase"></i> ${lang === 'es' ? '3. Proyectos' : '3. Projects'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-skills" role="tab" aria-selected="false">
          <i class="bx bx-code-alt"></i> ${lang === 'es' ? '4. Habilidades' : '4. Skills'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-contact" role="tab" aria-selected="false">
          <i class="bx bx-envelope"></i> ${lang === 'es' ? '5. Contacto & Footer' : '5. Contact & Footer'}
        </button>
        <button type="button" class="admin-tab" data-tab="tab-security" role="tab" aria-selected="false">
          <i class="bx bx-key"></i> ${lang === 'es' ? 'Clave' : 'Key'}
        </button>
      </div>

      <!-- Pestaña 1: Banner / Inicio -->
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

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-image-add"></i> Archivos Multimedia & Accesibilidad</h4>
          <div class="admin-form-grid">
            <div class="admin-field admin-field--full">
              <label>Foto de Perfil Principal:</label>
              <div class="admin-file-picker-group">
                <div class="admin-preview-thumb">
                  <img id="profile-img-preview" src="${uploadedProfileImg}" alt="Previsualización" />
                </div>
                <div class="admin-file-input-wrapper">
                  <input type="file" id="banner-img-file" accept="image/*" class="admin-file-hidden" />
                  <label for="banner-img-file" class="admin-btn admin-btn--secondary">
                    <i class="bx bx-cloud-upload"></i> Seleccionar Foto de Perfil
                  </label>
                  <span id="banner-img-filename" class="admin-file-name">Imagen activa</span>
                </div>
              </div>
            </div>

            <div class="admin-field">
              <label for="banner-img-alt-es">Texto Alt Foto (Español):</label>
              <input type="text" id="banner-img-alt-es" value="${escapeAttr(bannerData.profileImgAlt?.es || 'Fotografía de Gerardo Medina, desarrollador Full Stack')}" required />
            </div>

            <div class="admin-field">
              <label for="banner-img-alt-en">Alt Text Photo (English):</label>
              <input type="text" id="banner-img-alt-en" value="${escapeAttr(bannerData.profileImgAlt?.en || 'Photograph of Gerardo Medina, Full Stack Developer')}" required />
            </div>

            <div class="admin-field">
              <label>CV en Español (PDF):</label>
              <input type="file" id="banner-cv-file-es" accept=".pdf" class="admin-file-hidden" />
              <label for="banner-cv-file-es" class="admin-btn admin-btn--secondary">
                <i class="bx bx-file"></i> Subir PDF Español
              </label>
              <span id="banner-cves-filename" class="admin-file-name">CV Español activo</span>
            </div>

            <div class="admin-field">
              <label>CV en Inglés (PDF):</label>
              <input type="file" id="banner-cv-file-en" accept=".pdf" class="admin-file-hidden" />
              <label for="banner-cv-file-en" class="admin-btn admin-btn--secondary">
                <i class="bx bx-file"></i> Subir PDF Inglés
              </label>
              <span id="banner-cven-filename" class="admin-file-name">CV Inglés activo</span>
            </div>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-link"></i> Redes Sociales</h4>
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
              <i class="bx bx-refresh"></i> Restablecer Inicio
            </button>
            <button type="submit" class="admin-btn admin-btn--primary">
              <i class="bx bx-save"></i> Guardar Cambios de Inicio
            </button>
          </div>
        </form>
      </div>

      <!-- Pestaña 2: Sobre Mí -->
      <div id="tab-about" class="admin-tab-content" role="tabpanel" style="display:none;">
        <form id="admin-about-form" class="admin-form">
          <h4 class="admin-section-subtitle"><i class="bx bx-detail"></i> Títulos y Descripción (Español)</h4>
          <div class="admin-field">
            <label for="about-subtitle-es">Subtítulo (Español):</label>
            <input type="text" id="about-subtitle-es" value="${escapeAttr(aboutData.subtitle?.es || '')}" required />
          </div>
          <div class="admin-field">
            <label for="about-text-es">Texto Biográfico (Español):</label>
            <textarea id="about-text-es" rows="6" class="admin-textarea" required>${escapeAttr(aboutData.text?.es || '')}</textarea>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-world"></i> Títulos y Descripción (Inglés)</h4>
          <div class="admin-field">
            <label for="about-subtitle-en">Subtitle (English):</label>
            <input type="text" id="about-subtitle-en" value="${escapeAttr(aboutData.subtitle?.en || '')}" required />
          </div>
          <div class="admin-field">
            <label for="about-text-en">Biographical Text (English):</label>
            <textarea id="about-text-en" rows="6" class="admin-textarea" required>${escapeAttr(aboutData.text?.en || '')}</textarea>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-image"></i> Fotografía Secundaria & Accesibilidad</h4>
          <div class="admin-form-grid">
            <div class="admin-field admin-field--full">
              <label>Foto de Sobre Mí:</label>
              <div class="admin-file-picker-group">
                <div class="admin-preview-thumb">
                  <img id="about-img-preview" src="${uploadedAboutPhotoImg}" alt="Previsualización Sobre Mí" />
                </div>
                <div class="admin-file-input-wrapper">
                  <input type="file" id="about-img-file" accept="image/*" class="admin-file-hidden" />
                  <label for="about-img-file" class="admin-btn admin-btn--secondary">
                    <i class="bx bx-cloud-upload"></i> Seleccionar Imagen de Sobre Mí
                  </label>
                  <span id="about-img-filename" class="admin-file-name">Imagen activa</span>
                </div>
              </div>
            </div>

            <div class="admin-field">
              <label for="about-img-alt-es">Texto Alt Foto (Español):</label>
              <input type="text" id="about-img-alt-es" value="${escapeAttr(aboutData.photoImgAlt?.es || 'Fotografía de Gerardo Medina')}" required />
            </div>

            <div class="admin-field">
              <label for="about-img-alt-en">Alt Text Photo (English):</label>
              <input type="text" id="about-img-alt-en" value="${escapeAttr(aboutData.photoImgAlt?.en || 'Photograph of Gerardo Medina')}" required />
            </div>
          </div>

          <div id="admin-about-status" class="admin-status" style="display:none;"></div>

          <div class="admin-footer-btn-group">
            <button type="button" id="admin-reset-about-btn" class="admin-btn admin-btn--danger">
              <i class="bx bx-refresh"></i> Restablecer Sobre Mí
            </button>
            <button type="submit" class="admin-btn admin-btn--primary">
              <i class="bx bx-save"></i> Guardar Cambios de Sobre Mí
            </button>
          </div>
        </form>
      </div>

      <!-- Pestaña 3: Proyectos CRUD -->
      <div id="tab-projects" class="admin-tab-content" role="tabpanel" style="display:none;">
        <div class="admin-projects-toolbar">
          <h4 class="admin-section-subtitle" style="margin:0;"><i class="bx bx-briefcase"></i> Lista de Proyectos Publicados (${projectsData.length})</h4>
          <button type="button" id="btn-add-new-project" class="admin-btn admin-btn--primary">
            <i class="bx bx-plus-circle"></i> + Agregar Nuevo Proyecto
          </button>
        </div>

        <div id="project-editor-container" class="admin-subcard" style="display:none;">
          <h4 id="project-editor-title" class="admin-subcard-title">Crear Nuevo Proyecto</h4>
          <form id="project-editor-form" class="admin-form">
            <input type="hidden" id="project-edit-index" value="-1" />
            <div class="admin-form-grid">
              <div class="admin-field">
                <label for="proj-title-es">Título (Español):</label>
                <input type="text" id="proj-title-es" required />
              </div>
              <div class="admin-field">
                <label for="proj-title-en">Título (Inglés):</label>
                <input type="text" id="proj-title-en" required />
              </div>
              <div class="admin-field">
                <label for="proj-github">URL Repositorio GitHub:</label>
                <input type="url" id="proj-github" required />
              </div>
              <div class="admin-field">
                <label for="proj-demo">URL Demo en Vivo:</label>
                <input type="url" id="proj-demo" required />
              </div>
            </div>

            <div class="admin-field admin-field--full" style="margin-top:0.75rem;">
              <label>Imagen / Portada del Proyecto:</label>
              <div class="admin-file-picker-group">
                <div class="admin-preview-thumb admin-preview-thumb--square">
                  <img id="proj-img-preview" src="./assets/img/projects/siga_formosa.png" alt="Previsualización proyecto" />
                </div>
                <div class="admin-file-input-wrapper">
                  <input type="file" id="proj-img-file" accept="image/*" class="admin-file-hidden" />
                  <label for="proj-img-file" class="admin-btn admin-btn--secondary">
                    <i class="bx bx-image-add"></i> Seleccionar Imagen desde Equipo
                  </label>
                  <span id="proj-img-filename" class="admin-file-name">Imagen actual</span>
                </div>
              </div>
            </div>

            <div class="admin-form-grid" style="margin-top:0.5rem;">
              <div class="admin-field">
                <label for="proj-img-alt-es">Texto Alt Portada (Español):</label>
                <input type="text" id="proj-img-alt-es" placeholder="ej: Captura de portada del proyecto..." />
              </div>
              <div class="admin-field">
                <label for="proj-img-alt-en">Alt Text Cover (English):</label>
                <input type="text" id="proj-img-alt-en" placeholder="e.g. Thumbnail screenshot..." />
              </div>
            </div>

            <div class="admin-field" style="margin-top:0.75rem;">
              <label for="proj-desc-es">Descripción Completa (Español):</label>
              <textarea id="proj-desc-es" rows="4" class="admin-textarea" required></textarea>
            </div>
            <div class="admin-field">
              <label for="proj-desc-en">Descripción Completa (Inglés):</label>
              <textarea id="proj-desc-en" rows="4" class="admin-textarea" required></textarea>
            </div>

            <div class="admin-footer-btn-group">
              <button type="button" id="btn-cancel-project" class="admin-btn admin-btn--secondary">
                Cancelar
              </button>
              <button type="submit" class="admin-btn admin-btn--primary">
                <i class="bx bx-check"></i> Guardar Proyecto
              </button>
            </div>
          </form>
        </div>

        <div id="projects-items-list" class="admin-projects-list"></div>
        <div id="admin-projects-status" class="admin-status" style="display:none; margin-top:1rem;"></div>

        <div class="admin-footer-btn-group" style="margin-top:1.5rem;">
          <button type="button" id="admin-reset-projects-btn" class="admin-btn admin-btn--danger">
            <i class="bx bx-refresh"></i> Restablecer Todos los Proyectos por Defecto
          </button>
        </div>
      </div>

      <!-- Pestaña 4: Habilidades (Skills) CRUD -->
      <div id="tab-skills" class="admin-tab-content" role="tabpanel" style="display:none;">
        <div class="admin-projects-toolbar">
          <div class="admin-category-selector">
            <button type="button" class="admin-cat-btn active" data-category="languages">Lenguajes (${skillsData.languages?.length || 0})</button>
            <button type="button" class="admin-cat-btn" data-category="frameworks">Frameworks (${skillsData.frameworks?.length || 0})</button>
            <button type="button" class="admin-cat-btn" data-category="tools">Herramientas (${skillsData.tools?.length || 0})</button>
          </div>
          <button type="button" id="btn-add-new-skill" class="admin-btn admin-btn--primary">
            <i class="bx bx-plus-circle"></i> + Agregar Tecnología
          </button>
        </div>

        <div id="skill-editor-container" class="admin-subcard" style="display:none;">
          <h4 id="skill-editor-title" class="admin-subcard-title">Agregar Nueva Tecnología</h4>
          <form id="skill-editor-form" class="admin-form">
            <input type="hidden" id="skill-edit-category" value="languages" />
            <input type="hidden" id="skill-edit-index" value="-1" />
            <div class="admin-form-grid">
              <div class="admin-field">
                <label for="skill-category-select">Categoría:</label>
                <select id="skill-category-select" class="admin-select">
                  <option value="languages">Lenguajes de Programación</option>
                  <option value="frameworks">Frameworks y Librerías</option>
                  <option value="tools">Herramientas y Entornos</option>
                </select>
              </div>
              <div class="admin-field">
                <label for="skill-name">Nombre de la Tecnología:</label>
                <input type="text" id="skill-name" placeholder="ej: Node.js" required />
              </div>
              <div class="admin-field admin-field--full">
                <label for="skill-link">URL Sitio Oficial / Documentación:</label>
                <input type="url" id="skill-link" placeholder="https://nodejs.org" required />
              </div>
            </div>

            <div class="admin-field admin-field--full" style="margin-top:0.75rem;">
              <label>Logo / Icono de la Tecnología:</label>
              <div class="admin-file-picker-group">
                <div class="admin-preview-thumb">
                  <img id="skill-img-preview" src="./assets/icon/icons8-javascript.svg" alt="Previsualización logo" />
                </div>
                <div class="admin-file-input-wrapper">
                  <input type="file" id="skill-img-file" accept="image/*" class="admin-file-hidden" />
                  <label for="skill-img-file" class="admin-btn admin-btn--secondary">
                    <i class="bx bx-image-add"></i> Seleccionar Logo desde Equipo
                  </label>
                  <span id="skill-img-filename" class="admin-file-name">Logo actual</span>
                </div>
              </div>
            </div>

            <div class="admin-form-grid" style="margin-top:0.5rem;">
              <div class="admin-field">
                <label for="skill-img-alt-es">Texto Alt Logo (Español):</label>
                <input type="text" id="skill-img-alt-es" placeholder="ej: Logo de Node.js..." />
              </div>
              <div class="admin-field">
                <label for="skill-img-alt-en">Alt Text Logo (English):</label>
                <input type="text" id="skill-img-alt-en" placeholder="e.g. Logo of Node.js..." />
              </div>
            </div>

            <div class="admin-footer-btn-group" style="margin-top:1rem;">
              <button type="button" id="btn-cancel-skill" class="admin-btn admin-btn--secondary">
                Cancelar
              </button>
              <button type="submit" class="admin-btn admin-btn--primary">
                <i class="bx bx-check"></i> Guardar Tecnología
              </button>
            </div>
          </form>
        </div>

        <div id="skills-items-list" class="admin-projects-list"></div>
        <div id="admin-skills-status" class="admin-status" style="display:none; margin-top:1rem;"></div>

        <div class="admin-footer-btn-group" style="margin-top:1.5rem;">
          <button type="button" id="admin-reset-skills-btn" class="admin-btn admin-btn--danger">
            <i class="bx bx-refresh"></i> Restablecer Habilidades por Defecto
          </button>
        </div>
      </div>

      <!-- Pestaña 5: Contacto & Footer -->
      <div id="tab-contact" class="admin-tab-content" role="tabpanel" style="display:none;">
        <form id="admin-contact-form" class="admin-form">
          <h4 class="admin-section-subtitle"><i class="bx bx-envelope"></i> Formulario de Contacto & Datos Directos</h4>
          <div class="admin-form-grid">
            <div class="admin-field admin-field--full">
              <label for="contact-endpoint">Endpoint Formspree (URL de envíos AJAX):</label>
              <input type="url" id="contact-endpoint" value="${escapeAttr(contactData.formspreeEndpoint || 'https://formspree.io/f/mvzeyrzq')}" required />
            </div>

            <div class="admin-field">
              <label for="contact-phone">Teléfono / WhatsApp:</label>
              <input type="text" id="contact-phone" value="${escapeAttr(contactData.phone || '')}" required />
            </div>

            <div class="admin-field">
              <label for="contact-location-es">Ubicación (Español):</label>
              <input type="text" id="contact-location-es" value="${escapeAttr(contactData.location?.es || '')}" required />
            </div>

            <div class="admin-field admin-field--full">
              <label for="contact-location-en">Location (English):</label>
              <input type="text" id="contact-location-en" value="${escapeAttr(contactData.location?.en || '')}" required />
            </div>
          </div>

          <h4 class="admin-section-subtitle" style="margin-top: 1.2rem;"><i class="bx bx-copyright"></i> Pie de Página (Footer Copyright)</h4>
          <div class="admin-field">
            <label for="footer-copy-es">Copyright Text (Español):</label>
            <input type="text" id="footer-copy-es" value="${escapeAttr(contactData.footerCopyright?.es || '')}" required />
          </div>
          <div class="admin-field">
            <label for="footer-copy-en">Copyright Text (English):</label>
            <input type="text" id="footer-copy-en" value="${escapeAttr(contactData.footerCopyright?.en || '')}" required />
          </div>

          <div id="admin-contact-status" class="admin-status" style="display:none;"></div>

          <div class="admin-footer-btn-group">
            <button type="button" id="admin-reset-contact-btn" class="admin-btn admin-btn--danger">
              <i class="bx bx-refresh"></i> Restablecer Contacto & Footer
            </button>
            <button type="submit" class="admin-btn admin-btn--primary">
              <i class="bx bx-save"></i> Guardar Cambios de Contacto
            </button>
          </div>
        </form>
      </div>

      <!-- Pestaña 6: Seguridad / Clave -->
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

  // === Lógica Pestaña 3: Proyectos ===
  const projectsListContainer = container.querySelector('#projects-items-list');
  const projectEditorContainer = container.querySelector('#project-editor-container');
  const projectEditorTitle = container.querySelector('#project-editor-title');
  const projectEditorForm = container.querySelector('#project-editor-form');
  const projectEditIndexInput = container.querySelector('#project-edit-index');

  let currentProjectImgData = '';

  function renderProjectsAdminList() {
    if (!projectsListContainer) return;
    projectsListContainer.innerHTML = '';

    if (projectsData.length === 0) {
      projectsListContainer.innerHTML = '<p class="admin-empty-text">No hay proyectos registrados.</p>';
      return;
    }

    projectsData.forEach((proj, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-project-item';
      const title = (proj.title && (proj.title[lang] || proj.title.es)) || 'Proyecto Sin Título';

      item.innerHTML = `
        <div class="admin-project-thumb">
          <img src="${proj.image}" alt="${title}" />
        </div>
        <div class="admin-project-info">
          <h5>${title}</h5>
          <span class="admin-project-links-preview">${proj.demo ? 'Demo Activa' : 'Sin Demo'} | ${proj.github ? 'GitHub OK' : 'Sin Repo'}</span>
        </div>
        <div class="admin-project-actions">
          <button type="button" class="admin-icon-btn btn-edit-proj" data-index="${idx}" title="Editar proyecto">
            <i class="bx bx-edit"></i>
          </button>
          <button type="button" class="admin-icon-btn admin-icon-btn--danger btn-del-proj" data-index="${idx}" title="Eliminar proyecto">
            <i class="bx bx-trash"></i>
          </button>
        </div>
      `;

      projectsListContainer.appendChild(item);
    });

    projectsListContainer.querySelectorAll('.btn-edit-proj').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        openProjectEditor(index);
      });
    });

    projectsListContainer.querySelectorAll('.btn-del-proj').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.dataset.index, 10);
        const projTitle = projectsData[index]?.title?.es || 'este proyecto';
        if (confirm(`¿Estás seguro de eliminar el proyecto "${projTitle}"?`)) {
          projectsData.splice(index, 1);
          saveProjectsData(projectsData);
          renderProjectsAdminList();
        }
      });
    });
  }

  function openProjectEditor(index = -1) {
    projectEditIndexInput.value = index;
    const projImgPreview = container.querySelector('#proj-img-preview');
    const projImgFilename = container.querySelector('#proj-img-filename');

    if (index >= 0 && projectsData[index]) {
      const proj = projectsData[index];
      projectEditorTitle.textContent = `Editar Proyecto: ${proj.title?.es || ''}`;
      container.querySelector('#proj-title-es').value = proj.title?.es || '';
      container.querySelector('#proj-title-en').value = proj.title?.en || '';
      container.querySelector('#proj-github').value = proj.github || '';
      container.querySelector('#proj-demo').value = proj.demo || '';
      container.querySelector('#proj-desc-es').value = proj.description?.es || '';
      container.querySelector('#proj-desc-en').value = proj.description?.en || '';
      container.querySelector('#proj-img-alt-es').value = proj.imageAlt?.es || '';
      container.querySelector('#proj-img-alt-en').value = proj.imageAlt?.en || '';

      currentProjectImgData = proj.image || '';
      if (projImgPreview) projImgPreview.src = currentProjectImgData;
      if (projImgFilename) projImgFilename.textContent = 'Imagen actual retenida';
    } else {
      projectEditorTitle.textContent = '+ Agregar Nuevo Proyecto';
      projectEditorForm.reset();
      projectEditIndexInput.value = -1;
      currentProjectImgData = './assets/img/projects/siga_formosa.png';
      if (projImgPreview) projImgPreview.src = currentProjectImgData;
      if (projImgFilename) projImgFilename.textContent = 'Selecciona una portada';
    }

    projectEditorContainer.style.display = 'block';
    projectEditorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const projImgFileInput = container.querySelector('#proj-img-file');
  const projImgPreview = container.querySelector('#proj-img-preview');
  const projImgFilename = container.querySelector('#proj-img-filename');

  if (projImgFileInput) {
    projImgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        projImgFilename.textContent = `Imagen: ${file.name}`;
        currentProjectImgData = await readFileAsDataURL(file);
        if (projImgPreview) projImgPreview.src = currentProjectImgData;
      }
    });
  }

  const btnAddNewProject = container.querySelector('#btn-add-new-project');
  if (btnAddNewProject) {
    btnAddNewProject.addEventListener('click', () => openProjectEditor(-1));
  }

  const btnCancelProject = container.querySelector('#btn-cancel-project');
  if (btnCancelProject) {
    btnCancelProject.addEventListener('click', () => {
      projectEditorContainer.style.display = 'none';
    });
  }

  if (projectEditorForm) {
    projectEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const editIndex = parseInt(projectEditIndexInput.value, 10);

      const altEs = container.querySelector('#proj-img-alt-es').value.trim();
      const altEn = container.querySelector('#proj-img-alt-en').value.trim();

      const newProjObj = {
        title: {
          es: container.querySelector('#proj-title-es').value.trim(),
          en: container.querySelector('#proj-title-en').value.trim()
        },
        image: currentProjectImgData || './assets/img/projects/siga_formosa.png',
        imageAlt: {
          es: altEs,
          en: altEn
        },
        github: container.querySelector('#proj-github').value.trim(),
        demo: container.querySelector('#proj-demo').value.trim(),
        description: {
          es: container.querySelector('#proj-desc-es').value.trim(),
          en: container.querySelector('#proj-desc-en').value.trim()
        }
      };

      if (editIndex >= 0 && editIndex < projectsData.length) {
        projectsData[editIndex] = newProjObj;
      } else {
        projectsData.unshift(newProjObj);
      }

      saveProjectsData(projectsData);
      renderProjectsAdminList();
      projectEditorContainer.style.display = 'none';
    });
  }

  const btnResetProjects = container.querySelector('#admin-reset-projects-btn');
  if (btnResetProjects) {
    btnResetProjects.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de restablecer la lista de proyectos a los originales por defecto?')) {
        await resetProjectsData();
        projectsData = await getProjectsData();
        renderProjectsAdminList();
      }
    });
  }

  renderProjectsAdminList();

  // === Lógica Pestaña 4: Habilidades (Skills) ===
  let activeSkillCategory = 'languages';
  const skillsListContainer = container.querySelector('#skills-items-list');
  const skillEditorContainer = container.querySelector('#skill-editor-container');
  const skillEditorTitle = container.querySelector('#skill-editor-title');
  const skillEditorForm = container.querySelector('#skill-editor-form');
  const skillEditIndexInput = container.querySelector('#skill-edit-index');
  const skillEditCategoryInput = container.querySelector('#skill-edit-category');
  const skillCategorySelect = container.querySelector('#skill-category-select');

  let currentSkillImgData = '';

  function renderSkillsAdminList() {
    if (!skillsListContainer) return;
    skillsListContainer.innerHTML = '';

    const list = skillsData[activeSkillCategory] || [];

    if (list.length === 0) {
      skillsListContainer.innerHTML = '<p class="admin-empty-text">No hay tecnologías registradas en esta categoría.</p>';
      return;
    }

    list.forEach((skill, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-project-item';

      item.innerHTML = `
        <div class="admin-project-thumb">
          <img src="${skill.image}" alt="${skill.name}" />
        </div>
        <div class="admin-project-info">
          <h5>${skill.name}</h5>
          <span class="admin-project-links-preview">${skill.link ? skill.link : 'Sin Link'}</span>
        </div>
        <div class="admin-project-actions">
          <button type="button" class="admin-icon-btn btn-edit-skill" data-index="${idx}" title="Editar tecnología">
            <i class="bx bx-edit"></i>
          </button>
          <button type="button" class="admin-icon-btn admin-icon-btn--danger btn-del-skill" data-index="${idx}" title="Eliminar tecnología">
            <i class="bx bx-trash"></i>
          </button>
        </div>
      `;

      skillsListContainer.appendChild(item);
    });

    skillsListContainer.querySelectorAll('.btn-edit-skill').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        openSkillEditor(activeSkillCategory, index);
      });
    });

    skillsListContainer.querySelectorAll('.btn-del-skill').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        const skillName = skillsData[activeSkillCategory][index]?.name || 'esta tecnología';
        if (confirm(`¿Estás seguro de eliminar "${skillName}"?`)) {
          skillsData[activeSkillCategory].splice(index, 1);
          saveSkillsData(skillsData);
          renderSkillsAdminList();
          updateCategoryCounters();
        }
      });
    });
  }

  function updateCategoryCounters() {
    const catBtns = container.querySelectorAll('.admin-cat-btn');
    if (catBtns.length >= 3) {
      catBtns[0].textContent = `Lenguajes (${skillsData.languages?.length || 0})`;
      catBtns[1].textContent = `Frameworks (${skillsData.frameworks?.length || 0})`;
      catBtns[2].textContent = `Herramientas (${skillsData.tools?.length || 0})`;
    }
  }

  const catBtns = container.querySelectorAll('.admin-cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSkillCategory = btn.dataset.category;
      renderSkillsAdminList();
    });
  });

  function openSkillEditor(category = 'languages', index = -1) {
    skillEditCategoryInput.value = category;
    skillEditIndexInput.value = index;
    if (skillCategorySelect) skillCategorySelect.value = category;

    const skillImgPreview = container.querySelector('#skill-img-preview');
    const skillImgFilename = container.querySelector('#skill-img-filename');

    if (index >= 0 && skillsData[category] && skillsData[category][index]) {
      const skill = skillsData[category][index];
      skillEditorTitle.textContent = `Editar Tecnología: ${skill.name}`;
      container.querySelector('#skill-name').value = skill.name || '';
      container.querySelector('#skill-link').value = skill.link || '';
      container.querySelector('#skill-img-alt-es').value = skill.imageAlt?.es || '';
      container.querySelector('#skill-img-alt-en').value = skill.imageAlt?.en || '';

      currentSkillImgData = skill.image || '';
      if (skillImgPreview) skillImgPreview.src = currentSkillImgData;
      if (skillImgFilename) skillImgFilename.textContent = 'Logo actual retenido';
    } else {
      skillEditorTitle.textContent = '+ Agregar Nueva Tecnología';
      skillEditorForm.reset();
      skillEditCategoryInput.value = category;
      skillEditIndexInput.value = -1;
      if (skillCategorySelect) skillCategorySelect.value = category;
      currentSkillImgData = './assets/icon/icons8-javascript.svg';
      if (skillImgPreview) skillImgPreview.src = currentSkillImgData;
      if (skillImgFilename) skillImgFilename.textContent = 'Selecciona un logo';
    }

    skillEditorContainer.style.display = 'block';
    skillEditorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const skillImgFileInput = container.querySelector('#skill-img-file');
  const skillImgPreview = container.querySelector('#skill-img-preview');
  const skillImgFilename = container.querySelector('#skill-img-filename');

  if (skillImgFileInput) {
    skillImgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        skillImgFilename.textContent = `Logo: ${file.name}`;
        currentSkillImgData = await readFileAsDataURL(file);
        if (skillImgPreview) skillImgPreview.src = currentSkillImgData;
      }
    });
  }

  const btnAddNewSkill = container.querySelector('#btn-add-new-skill');
  if (btnAddNewSkill) {
    btnAddNewSkill.addEventListener('click', () => openSkillEditor(activeSkillCategory, -1));
  }

  const btnCancelSkill = container.querySelector('#btn-cancel-skill');
  if (btnCancelSkill) {
    btnCancelSkill.addEventListener('click', () => {
      skillEditorContainer.style.display = 'none';
    });
  }

  if (skillEditorForm) {
    skillEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetCategory = skillCategorySelect ? skillCategorySelect.value : activeSkillCategory;
      const editIndex = parseInt(skillEditIndexInput.value, 10);

      const altEs = container.querySelector('#skill-img-alt-es').value.trim();
      const altEn = container.querySelector('#skill-img-alt-en').value.trim();

      const newSkillObj = {
        id: container.querySelector('#skill-name').value.trim().toLowerCase().replace(/\s+/g, '-'),
        name: container.querySelector('#skill-name').value.trim(),
        image: currentSkillImgData || './assets/icon/icons8-javascript.svg',
        imageAlt: {
          es: altEs,
          en: altEn
        },
        link: container.querySelector('#skill-link').value.trim()
      };

      if (!skillsData[targetCategory]) skillsData[targetCategory] = [];

      if (editIndex >= 0 && editIndex < skillsData[targetCategory].length) {
        skillsData[targetCategory][editIndex] = newSkillObj;
      } else {
        skillsData[targetCategory].unshift(newSkillObj);
      }

      saveSkillsData(skillsData);
      activeSkillCategory = targetCategory;

      catBtns.forEach(b => {
        if (b.dataset.category === activeSkillCategory) b.classList.add('active');
        else b.classList.remove('active');
      });

      renderSkillsAdminList();
      updateCategoryCounters();
      skillEditorContainer.style.display = 'none';
    });
  }

  const btnResetSkills = container.querySelector('#admin-reset-skills-btn');
  if (btnResetSkills) {
    btnResetSkills.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de restablecer todas las habilidades a los valores por defecto?')) {
        await resetSkillsData();
        skillsData = await getSkillsData();
        renderSkillsAdminList();
        updateCategoryCounters();
      }
    });
  }

  renderSkillsAdminList();

  // === Lógica Pestaña 5: Contacto & Footer ===
  const contactForm = container.querySelector('#admin-contact-form');
  const contactStatus = container.querySelector('#admin-contact-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newData = {
        formspreeEndpoint: container.querySelector('#contact-endpoint').value.trim(),
        phone: container.querySelector('#contact-phone').value.trim(),
        location: {
          es: container.querySelector('#contact-location-es').value.trim(),
          en: container.querySelector('#contact-location-en').value.trim()
        },
        footerCopyright: {
          es: container.querySelector('#footer-copy-es').value.trim(),
          en: container.querySelector('#footer-copy-en').value.trim()
        }
      };

      const success = saveContactData(newData);
      contactStatus.style.display = 'block';

      if (success) {
        contactStatus.className = 'admin-status admin-status--success';
        contactStatus.innerHTML = '<i class="bx bx-check-circle"></i> ¡Cambios guardados en Contacto & Footer!';
      } else {
        contactStatus.className = 'admin-status admin-status--error';
        contactStatus.innerHTML = '<i class="bx bx-error-circle"></i> Error guardando los cambios.';
      }
    });
  }

  const btnResetContact = container.querySelector('#admin-reset-contact-btn');
  if (btnResetContact) {
    btnResetContact.addEventListener('click', () => {
      if (confirm('¿Restablecer la información de Contacto & Footer a los valores por defecto?')) {
        resetContactData();
        renderCrudPanel(container);
      }
    });
  }

  // Escuchadores de Archivos Generales
  const imgFileInput = container.querySelector('#banner-img-file');
  const imgPreview = container.querySelector('#profile-img-preview');
  const imgFilename = container.querySelector('#banner-img-filename');
  if (imgFileInput) {
    imgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        imgFilename.textContent = `Seleccionado: ${file.name}`;
        uploadedProfileImg = await readFileAsDataURL(file);
        if (imgPreview) imgPreview.src = uploadedProfileImg;
      }
    });
  }

  const aboutImgFileInput = container.querySelector('#about-img-file');
  const aboutImgPreview = container.querySelector('#about-img-preview');
  const aboutImgFilename = container.querySelector('#about-img-filename');
  if (aboutImgFileInput) {
    aboutImgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        aboutImgFilename.textContent = `Seleccionado: ${file.name}`;
        uploadedAboutPhotoImg = await readFileAsDataURL(file);
        if (aboutImgPreview) aboutImgPreview.src = uploadedAboutPhotoImg;
      }
    });
  }

  const cvEsFileInput = container.querySelector('#banner-cv-file-es');
  const cvEsFilename = container.querySelector('#banner-cves-filename');
  if (cvEsFileInput) {
    cvEsFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        cvEsFilename.textContent = `PDF: ${file.name}`;
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
        cvEnFilename.textContent = `PDF: ${file.name}`;
        uploadedCvEn = await readFileAsDataURL(file);
      }
    });
  }

  const closeBtn = container.querySelector('#admin-close-x');
  if (closeBtn) closeBtn.addEventListener('click', closeAdminModal);

  const logoutBtn = container.querySelector('#admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      renderLoginModal(container);
    });
  }

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

  // Submit Banner
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
      profileImgAlt: {
        es: container.querySelector('#banner-img-alt-es').value.trim(),
        en: container.querySelector('#banner-img-alt-en').value.trim()
      },
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
      bannerStatus.innerHTML = '<i class="bx bx-check-circle"></i> ¡Cambios guardados en la sección Inicio!';
    } else {
      bannerStatus.className = 'admin-status admin-status--error';
      bannerStatus.innerHTML = '<i class="bx bx-error-circle"></i> Error guardando los cambios.';
    }
  });

  // Reset Banner
  const resetBannerBtn = container.querySelector('#admin-reset-banner-btn');
  if (resetBannerBtn) {
    resetBannerBtn.addEventListener('click', () => {
      if (confirm('¿Restablecer Inicio a los valores por defecto?')) {
        resetBannerData();
        renderCrudPanel(container);
      }
    });
  }

  // Submit About Me
  const aboutForm = container.querySelector('#admin-about-form');
  const aboutStatus = container.querySelector('#admin-about-status');

  aboutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newData = {
      subtitle: {
        es: container.querySelector('#about-subtitle-es').value.trim(),
        en: container.querySelector('#about-subtitle-en').value.trim()
      },
      text: {
        es: container.querySelector('#about-text-es').value.trim(),
        en: container.querySelector('#about-text-en').value.trim()
      },
      photoImg: uploadedAboutPhotoImg,
      photoImgAlt: {
        es: container.querySelector('#about-img-alt-es').value.trim(),
        en: container.querySelector('#about-img-alt-en').value.trim()
      }
    };

    const success = saveAboutData(newData);
    aboutStatus.style.display = 'block';

    if (success) {
      aboutStatus.className = 'admin-status admin-status--success';
      aboutStatus.innerHTML = '<i class="bx bx-check-circle"></i> ¡Cambios guardados en la sección Sobre Mí!';
    } else {
      aboutStatus.className = 'admin-status admin-status--error';
      aboutStatus.innerHTML = '<i class="bx bx-error-circle"></i> Error guardando los cambios.';
    }
  });

  // Reset About Me
  const resetAboutBtn = container.querySelector('#admin-reset-about-btn');
  if (resetAboutBtn) {
    resetAboutBtn.addEventListener('click', () => {
      if (confirm('¿Restablecer la sección Sobre Mí a los valores por defecto?')) {
        resetAboutData();
        renderCrudPanel(container);
      }
    });
  }

  // Submit Pass
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
    if (!e.detail.loggedIn) {
      if (modalContainer && modalContainer.style.display === 'flex') {
        renderLoginModal(modalContainer);
      }
      if (e.detail.reason === 'inactivity') {
        alert(getLang() === 'es'
          ? '🔒 Por motivos de seguridad, su sesión de administración se ha cerrado automáticamente tras 15 minutos de inactividad.'
          : '🔒 For security reasons, your admin session was automatically logged out after 15 minutes of inactivity.');
      }
    }
  });
}
