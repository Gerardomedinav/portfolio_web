# AGENTS.md - Memoria del Proyecto Portfolio Web

Este documento sirve como memoria y guía contextual de referencia para cualquier IA o desarrollador que realice modificaciones en el proyecto **Gerardo Medina - Web Portfolio**.

---

## 📌 Resumen General del Proyecto
- **Propietario:** Gerardo Medina (Full Stack Developer Jr.)
- **Descripción:** Portafolio personal web interactivo, accesible, bilingüe (Español / Inglés) y con Panel de Administración CRUD Criptográfico Multisección.
- **Despliegue:** Vercel (configurado con cabeceras de seguridad HTTP y Content-Security-Policy).

---

## 🛠️ Tecnologías y Arquitectura

### 1. Frontend & Lenguajes
- **HTML5 Semántico:** Siguiendo directrices de accesibilidad **WCAG 2.1 AA** (`aria-*`, `role`, etiquetas descriptivas, soporte para lectores de pantalla).
- **Vanilla CSS3 (Modular):** Hoja de estilos central `css/main.css` que consolida la arquitectura modular por componentes en `css/` (`style.css`, `header.css`, `nav.css`, `home.css`, `about.css`, `projects.css`, `skills.css`, `contact.css`, `footer.css`, `mediaqueries.css`).
- **Vanilla JavaScript (ES Modules):** Punto de entrada en `js/main.js` y arquitectura modular basada en módulos ES en `js/modules/`:
  - `navigation.js`: Menú responsive, navegación y panel del widget.
  - `theme.js`: Gestión unificada del tema oscuro/claro y sincronización de iconos.
  - `i18n.js`: Motor de internacionalización (ES/EN), sincronización de selectores y previsualización de CV en PDF.
  - `projects.js`: Renderizado dinámico de proyectos reactivo al almacén de datos con modales adaptativos.
  - `skills.js`: Renderizado dinámico de habilidades reactivo al almacén de datos.
  - `auth.js`: Sistema de autenticación de administrador con cifrado criptográfico SHA-256 nativo, gestión de sesiones y cambio de contraseña.
  - `dataStore.js`: Almacén centralizado de datos reactivos del sitio (Banner, About, Proyectos, Habilidades, Contacto y Footer) con persistencia local y reseteo por defecto.
  - `home.js`: Renderizado dinámico del Banner / Inicio reactivo a cambios de estado e idioma.
  - `about.js`: Renderizado dinámico de Sobre Mí reactivo a cambios de estado e idioma.
  - `footerContact.js`: Renderizado dinámico de la información de contacto directa y pie de página.
  - `adminModal.js`: Inyección dinámica del modal de Login y del panel de administración CRUD multisección con pestañas interactivas, carga de archivos locales y configuración de texto Alt bilingüe.
  - `contact.js`: Formulario de contacto interactivo con envíos asíncronos directos (AJAX) vía Formspree (`https://formspree.io/f/mvzeyrzq`) hacia correo personal, trampa anti-bots Honeypot `_gotcha` y validación de contenido.
  - `accessibility.js`: Suite avanzada de accesibilidad WCAG 2.1 AA (Lector de voz TTS, Daltonismo/Filtros de color, tamaño de texto A-/A/A+, espaciado de lectura para dislexia, resaltado de enlaces, pausar animaciones TDA y restablecer todo).

---

## 📂 Estructura de Directorios

```
portfolio_web/
├── .agents/
│   └── AGENTS.md             # Reglas y memoria de proyecto para agentes de IA
├── assets/
│   ├── icon/                 # Iconos e imágenes de marca
│   ├── img/                  # Imágenes de proyectos y sobre mí
│   ├── json/
│   │   ├── proyectos.json    # Datos dinámicos de proyectos (multilingüe)
│   │   └── skill.json        # Datos dinámicos de habilidades
│   ├── CV_Gerardo_Medina_Villalba_EN.pdf
│   └── CV_Gerardo_Medina_Villalba_español.pdf
├── css/
│   ├── main.css              # Hoja de estilos principal
│   ├── style.css             # Estilos globales, variables y modales CRUD
│   ├── header.css            # Estilos de cabecera
│   ├── nav.css               # Estilos de navegación y menú responsive
│   ├── home.css              # Sección Inicio
│   ├── about.css             # Sección Sobre mí
│   ├── projects.css          # Sección Proyectos y modales popover
│   ├── skills.css            # Sección Habilidades
│   ├── contact.css           # Sección Contacto
│   ├── footer.css            # Estilos del pie de página
│   └── mediaqueries.css      # Adaptación responsive / breakpoints
├── js/
│   ├── main.js               # Punto de entrada principal ES Modules
│   └── modules/
│       ├── navigation.js     # Menú móvil, navlinks y panel widget
│       ├── theme.js          # Control unificado de Modo Oscuro/Claro
│       ├── i18n.js           # Diccionario y motor de traducción
│       ├── projects.js       # Renderizado dinámico de proyectos
│       ├── skills.js         # Renderizado dinámico de habilidades
│       ├── auth.js           # Autenticación SHA-256 de Administrador
│       ├── dataStore.js      # Almacén central de datos reactivos
│       ├── home.js           # Renderizado dinámico de Inicio / Banner
│       ├── about.js          # Renderizado dinámico de Sobre Mí
│       ├── footerContact.js  # Renderizado dinámico de Contacto y Footer
│       ├── adminModal.js     # Modal de Login y Panel CRUD Multisección
│       └── accessibility.js  # Lector de voz, daltonismo, tipografía y WCAG
├── index.html                # Documento HTML principal
├── vercel.json               # Configuración de despliegue y seguridad Vercel (CSP)
├── README.md                 # Documentación técnica del proyecto
└── AGENTS.md                 # Memoria del proyecto para agentes de IA
```
