# 🚀 Portafolio Web Interactivo, Accesible & Bilingüe | Gerardo Medina

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Security Grade](https://img.shields.io/badge/Security--Headers-Grade%20A-brightgreen?style=for-the-badge)](https://securityheaders.com/)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1_AA-100%25-blue?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Performance](https://img.shields.io/badge/Performance-96%25-orange?style=for-the-badge)](https://pagespeed.web.dev/)

Bienvenido al repositorio del **Portafolio Web Profesional de Gerardo Medina** (Full Stack Developer Jr.).

Este proyecto destaca mis proyectos y habilidades a la vez que sirve como caso de estudio en **Desarrollo Web Moderno, Accesibilidad Universal (WCAG 2.1 AA), Internacionalización (i18n), Comunicación Asíncrona (AJAX Formspree), Endurecimiento de Seguridad (Hardening)** y un **Sistema de Administración CRUD Multisección Criptográfico**.

---

## ✨ Funcionalidades Principales

### 🔑 1. Sistema de Administración CRUD Multisección (Fases 0 a 5)
El portafolio incluye un **Panel de Administración Inteligente y Seguro** accesible mediante el icono de la llave (🔑) en el encabezado:
* **Seguridad Criptográfica Nativa (SHA-256):** Autenticación mediante `crypto.subtle.digest` con contraseñas hash guardadas de forma segura. El HTML del panel no existe en la página hasta ingresar la clave correcta (previniendo inspección en DevTools).
* **Edición Limpia en Texto Plano:** Formulario intuitivo sin etiquetas HTML expuestas. Los campos dividen Saludos, Nombres y Profesiones en texto limpio y el código aplica los colores y formato automáticamente.
* **Carga Directa de Archivos Locales (`<input type="file">`):** Selector de archivos de la computadora con previsualización en tiempo real para fotos de perfil, imágenes de proyectos, logos y PDFs de CVs.
* **Gestión de Texto Alternativo (Alt Text WCAG 2.1 AA):** Todos los cargadores de imagen permiten ingresar o modificar el **Texto Alt bilingüe (ES / EN)** para garantizar la accesibilidad completa.
* **Pestañas CRUD Organizadas:**
  1. **Banner / Inicio:** Saludos, Nombre, Profesión, Foto de Perfil, CVs en PDF y Redes Sociales.
  2. **Sobre Mí:** Subtítulos, Biografía Completa y Fotografía Secundaria.
  3. **Proyectos:** Lista interactiva para **Crear, Editar, Eliminar y Reordenar proyectos** con portadas y enlaces.
  4. **Habilidades / Skills:** Clasificación por Lenguajes, Frameworks y Herramientas para agregar/editar tecnologías.
  5. **Contacto & Footer:** Endpoint AJAX de Formspree, Teléfono/WhatsApp, Ubicación y Copyright del pie de página.
  6. **Seguridad / Clave:** Cambio seguro de contraseña de administrador.

### ✉️ 2. Formulario de Contacto Directo (AJAX + Formspree)
* **Envío Asíncrono en Tiempo Real:** Integración directa por Fetch/AJAX con Formspree hacia `gerardomedinavv@gmail.com` sin recargar la página ni abrir clientes de correo externos.
* **Experiencia de Usuario Fluida:** Indicador de carga dinámico en el botón de envío y alertas en pantalla personalizadas en español e inglés.
* **Seguridad y Filtro Anti-Spam:** Trampa Honeypot `_gotcha` para neutralizar bots automáticos y validación de contenido.

### 🌐 3. Internacionalización (i18n - Español / Inglés)
* **Motor Reactivo sin Recarga:** Cambio de idioma instantáneo (`es` / `en`) mediante eventos personalizados `languageChange`.
* **Sincronización Total:** Sincroniza simultáneamente los selectores del encabezado y del panel de accesibilidad, placeholders de formularios y textos de proyectos.
* **Previsualización de CV en PDF:** Apertura nativa del currículum en PDF en una nueva pestaña adaptado al idioma activo (`CV_Gerardo_Medina_Villalba_español.pdf` y `CV_Gerardo_Medina_Villalba_EN.pdf`).

### ♿ 4. Suite Avanzada de Accesibilidad (WCAG 2.1 AA)
Panel flotante interactivo (`.widget-panel`) integrado estéticamente con el tema visual:
* **👁️ Auditoría de Imágenes 100% Accesibles:** Cada imagen del sitio posee un texto alternativo (`alt`) descriptivo y reactivo en tiempo real al cambio de idioma (`data-i18n-alt`).
* **🔊 Lector de Voz (TTS):** Síntesis de voz nativa mediante Web Speech API para escuchar el contenido del sitio.
* **🎨 Filtro de Daltonismo:** Modo monocromático / escala de grises para usuarios con visibilidad reducida.
* **🔤 Escalado Tipográfico Dinámico:** Controles para ajustar el tamaño de fuente (`A-`, `A`, `A+`).
* **📖 Espaciado de Lectura (Dislexia):** Optimización del interlineado y espaciado de texto para facilitar la lectura.
* **🔗 Resaltado de Hipervínculos:** Indicadores visuales destacados en todos los enlaces interactivos.
* **⏸️ Pausar Animaciones (TDA / Concentración):** Desactivación instantánea de todo tipo de movimiento y efectos para personas con TDA o trastornos de atención.

### 🌓 5. Modo Oscuro / Claro
* **Sincronización Unificada:** Alternancia fluida de tema visual mediante la clase `.dark` en el `body`.
* **Detección Automática:** Detección de la preferencia del sistema operativo (`prefers-color-scheme`).

---

## 📂 Arquitectura de Archivos

```
portfolio_web/
├── assets/
│   ├── icon/                 # Iconos vectoriales y marcas
│   ├── img/                  # Imágenes de proyectos y perfiles
│   ├── json/
│   │   ├── proyectos.json    # Datos dinámicos de proyectos
│   │   └── skill.json        # Datos dinámicos de habilidades
│   ├── CV_Gerardo_Medina_Villalba_EN.pdf
│   └── CV_Gerardo_Medina_Villalba_español.pdf
├── css/
│   ├── main.css              # Hoja de estilos principal
│   ├── style.css             # Estilos globales, variables y modales CRUD
│   ├── header.css            # Cabecera
│   ├── nav.css               # Menú responsive
│   ├── home.css              # Sección Inicio
│   ├── about.css             # Sección Sobre mí
│   ├── projects.css          # Sección Proyectos y popovers
│   ├── skills.css            # Sección Habilidades
│   ├── contact.css           # Sección Contacto
│   └── footer.css            # Pie de página
├── js/
│   ├── main.js               # Punto de entrada ES Modules
│   └── modules/
│       ├── navigation.js     # Menú móvil y navlinks
│       ├── theme.js          # Control de Modo Oscuro/Claro
│       ├── i18n.js           # Diccionario y motor de traducción
│       ├── projects.js       # Renderizado dinámico de proyectos
│       ├── skills.js         # Renderizado dinámico de habilidades
│       ├── accessibility.js  # Suite de accesibilidad WCAG
│       ├── contact.js        # Formulario AJAX Formspree
│       ├── auth.js           # Autenticación SHA-256 de Administrador
│       ├── dataStore.js      # Almacén central de datos reactivos
│       ├── home.js           # Renderizado dinámico del Banner
│       ├── about.js          # Renderizado dinámico de Sobre Mí
│       ├── footerContact.js  # Renderizado dinámico de Contacto y Footer
│       └── adminModal.js     # Panel de Administración CRUD Multisección
├── index.html                # Documento HTML5 principal
├── vercel.json               # Configuración de despliegue y seguridad Vercel (CSP)
└── README.md                 # Documentación del proyecto
```
