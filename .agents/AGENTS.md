# AGENTS.md - Memoria del Proyecto Portfolio Web

Este documento sirve como memoria y guía contextual de referencia para cualquier IA o desarrollador que realice modificaciones en el proyecto **Gerardo Medina - Web Portfolio**.

---

## 📌 Resumen General del Proyecto
- **Propietario:** Gerardo Medina (Full Stack Developer Jr. & Data Analyst / Data Scientist profile)
- **Descripción:** Portafolio personal web interactivo, accesible, bilingüe (Español / Inglés), con Asistente Virtual Inteligente (`GerAssist`) basado en Prompt Engineering, IA y Control Interactivo del DOM, y Panel de Administración CRUD Criptográfico Multisección.
- **Despliegue:** Vercel (configurado con cabeceras de seguridad HTTP, Content-Security-Policy y Vercel Serverless Functions para IA).

---

## 🛠️ Tecnologías y Arquitectura

### 1. Frontend & Lenguajes
- **HTML5 Semántico:** Siguiendo directrices de accesibilidad **WCAG 2.1 AA** (`aria-*`, `role`, etiquetas descriptivas, soporte para lectores de pantalla).
- **Vanilla CSS3 (Modular):** Hoja de estilos central `css/main.css` que consolida la arquitectura modular por componentes (`style.css`, `header.css`, `nav.css`, `home.css`, `about.css`, `projects.css`, `skills.css`, `contact.css`, `footer.css`, `mediaqueries.css`).
- **Vanilla JavaScript (ES Modules):** Punto de entrada en `js/main.js` y arquitectura modular en `js/modules/`:
  - `navigation.js`: Menú responsive lateral (`drawer`), overlay, control de video y sincronización de paneles.
  - `theme.js`: Gestión unificada del tema oscuro/claro y sincronización de iconos.
  - `i18n.js`: Motor de internacionalización (ES/EN), sincronización de selectores, tooltips bilingües y previsualización de CV en PDF.
  - `projects.js`: Renderizado dinámico de proyectos reactivo al almacén de datos con modales adaptativos.
  - `skills.js`: Renderizado dinámico de habilidades reactivo al almacén de datos.
  - `auth.js`: Sistema de autenticación de administrador con cifrado criptográfico SHA-256 nativo, gestión de sesiones y cambio de contraseña.
  - `dataStore.js`: Almacén centralizado de datos reactivos del sitio.
  - `home.js`: Renderizado dinámico del Banner / Inicio.
  - `about.js`: Renderizado dinámico de Sobre Mí.
  - `footerContact.js`: Renderizado dinámico de la información de contacto directa y pie de página.
  - `botService.js`: Motor de IA RAG-lite local (0 tokens para FAQs), gestor de rate-limiting por sesión (máximo 20 preguntas) y conector con `/api/chat`.
  - `chatbotModal.js`: Interfaz flotante interactiva de `GerAssist` con historial, indicación de escritura, control directo del DOM (scroll suave a secciones, apertura automatizada de modales de proyectos específicos, pre-rellenado de contacto y comandos de accesibilidad).
  - `adminModal.js`: Inyección dinámica del modal de Login y del panel de administración CRUD multisección.
  - `contact.js`: Formulario de contacto interactivo con envíos asíncronos directos (AJAX) vía Formspree.
  - `accessibility.js`: Suite avanzada de accesibilidad WCAG 2.1 AA (Lector de voz TTS, Daltonismo/Filtros de color, tamaño de texto A-/A/A+, espaciado de lectura para dislexia, resaltado de enlaces, pausar animaciones TDAH y restablecer todo).
  - `preloader.js`: Pantalla de carga inteligente con anillo SVG de progreso (0% a 100%), inicialización secuencial de módulos y transición de desenfoque.

### 2. Backend Serverless & IA con Control Interactivo del DOM
- **Prompt Engineering & Guía Empático:** Persona servicial, empática y promocional que resalta el perfil de **Data Analyst / Data Scientist**, la **Accesibilidad Universal (WCAG 2.1 AA)**, el **Impacto Real en Proyectos** y los estudios universitarios: **Técnico Universitario en Programación (UTN)**, **Técnico en Análisis y Diseño de Software (UNAF)**, **Licenciatura en Educación Tecnológica (UTN - en curso)** y el proyecto **SIGA Formosa** desarrollado para la **UTN Sede Formosa**.
- **Acciones Interactivas de GerAssist:**
  - **Scroll Suave Automático (`handleSmartNavigationAndFill`):** Posiciona la pantalla sobre `#home`, `#about`, `#projects`, `#skills`, `#contact` según la intención de la conversación.
  - **Apertura Automatizada de Proyecto Especificado:** Abre la ventana emergente de un proyecto solo cuando el usuario menciona su nombre específico (*SIGA Formosa*, *Nexo Emprendedor*, *ProyeCoins*, *Data Analytics con Python*, etc.).
  - **Comandos de Accesibilidad:** Ejecuta ajustes visuales y de audio en tiempo real al recibir comandos como *"agrandar letra"*, *"alto contraste"*, *"activar lector"*, *"modo dislexia"*, *"restablecer accesibilidad"*.
  - **Pre-rellenado de Formulario:** Prepara mensajes en la sección de contacto para agendar entrevistas o citas laborales.

---

## 📂 Estructura de Directorios

```
portfolio_web/
├── .agents/
│   └── AGENTS.md             # Reglas y memoria de proyecto para agentes de IA
├── api/
│   └── chat.js               # Función Serverless Node.js (Proxy de IA seguro)
├── assets/
│   ├── icon/                 # Iconos e imágenes de marca
│   ├── img/                  # Imágenes de proyectos y sobre mí
│   ├── json/
│   │   ├── bot_knowledge.json# Base de conocimientos estructurada para GerAssist
│   │   ├── proyectos.json    # Datos dinámicos de proyectos
│   │   └── skill.json        # Datos dinámicos de habilidades
│   ├── CV_Gerardo_Medina_Villalba_EN.pdf
│   └── CV_Gerardo_Medina_Villalba_espanol.pdf
├── css/
│   ├── main.css              # Hoja de estilos principal
│   ├── style.css             # Estilos globales, modales CRUD y widget GerAssist
│   ├── header.css            # Estilos de encabezado
│   ├── nav.css               # Menú móvil, drawer y animaciones de enlace
│   ├── home.css              # Sección de inicio y video
│   ├── about.css             # Sección sobre mí
│   ├── projects.css          # Modales adaptativos y tarjetas de proyectos
│   ├── skills.css            # Grid de habilidades
│   ├── contact.css           # Formulario de contacto
│   ├── footer.css            # Pie de página
│   └── mediaqueries.css      # Adaptación responsive
├── js/
│   ├── main.js               # Punto de entrada principal ES Modules
│   └── modules/
│       ├── navigation.js
│       ├── theme.js
│       ├── i18n.js
│       ├── projects.js
│       ├── skills.js
│       ├── auth.js
│       ├── dataStore.js
│       ├── home.js
│       ├── about.js
│       ├── footerContact.js
│       ├── botService.js     # Lógica RAG local y consumo de /api/chat
│       ├── chatbotModal.js   # Interfaz interactiva de GerAssist (Navegación & Comandos)
│       ├── adminModal.js
│       ├── contact.js
│       ├── accessibility.js
│       └── preloader.js
├── server.js                 # Servidor estático Node.js para pruebas locales
├── index.html                # Documento HTML principal
├── vercel.json               # Configuración de despliegue Vercel
├── .gitignore                # Protección de variables .env
└── README.md                 # Documentación técnica del proyecto
```
