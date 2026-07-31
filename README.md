# 🚀 Portafolio Web Interactivo, Accesible & Bilingüe | Gerardo Medina

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Security Grade](https://img.shields.io/badge/Security--Headers-Grade%20A-brightgreen?style=for-the-badge)](https://securityheaders.com/)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1_AA-100%25-blue?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Analytics](https://img.shields.io/badge/Google_Analytics-GA4-orange?style=for-the-badge)](https://analytics.google.com/)
[![AI Assistant](https://img.shields.io/badge/AI_Assistant-GerAssist-blueviolet?style=for-the-badge)](https://github.com/Gerardomedinav/portfolio_web)

Bienvenido al repositorio oficial del **Portafolio Web Profesional de Gerardo Medina** (Full Stack Developer Jr. & Data Analyst / Data Scientist profile).

Este proyecto destaca la trayectoria, proyectos y habilidades de Gerardo Medina, sirviendo como caso de estudio completo en **Desarrollo Web Moderno, Prompt Engineering & Orquestación de IA con Control Interactivo de la Interfaz, Analítica Web Global (Google Analytics 4), Endurecimiento de Seguridad (Grade A), Accesibilidad Universal (WCAG 2.1 AA), Internacionalización (i18n), Comunicación Asíncrona (AJAX Formspree)** y un **Sistema de Administración CRUD Multisección Criptográfico Reactivo**.

---

## ✨ Funcionalidades Principales y Arquitectura

### 🤖 1. Asistente Virtual Inteligente (`GerAssist`) con Control Interactivo del DOM
**`GerAssist`** es un **asistente virtual empático e interactivo** que reacciona en tiempo real a las consultas del usuario para controlar la interfaz web y guiar la navegación:

* **Navegación Inteligente y Scroll Suave Automático (`handleSmartNavigationAndFill`):**
  - Al mencionar secciones del sitio (*Inicio, Sobre mí, Proyectos, Habilidades, Contacto o Accesibilidad*), GerAssist realiza de forma automática un **scroll suave (`scrollIntoView({ behavior: 'smooth' })`)** posicionando la vista exactamente sobre la sección correspondiente.
* **Apertura Automatizada de Modales de Proyectos:**
  - Si el usuario menciona la palabra general *"proyectos"*, el asistente desplaza la pantalla suavemente a la sección `#projects` para mostrar el catálogo completo.
  - Si el usuario menciona el **nombre específico de un proyecto** (*SIGA Formosa*, *Nexo Emprendedor*, *ProyeCoins*, *Data Analytics con Python*, *Ahorcado*, *EntreVigas*, *ByteZar*, *Planificador*, *Código Urbano*, *Catálogo*), GerAssist **abre automáticamente la ventana modal flotante** con los detalles y enlaces de ese proyecto específico.
* **Ejecución Directa de Comandos de Accesibilidad:**
  - GerAssist atiende instrucciones por texto o dictado por voz para activar herramientas de accesibilidad en tiempo real:
    - 🔊 **Audio y Lectura:** *"activar lector"*, *"leer la web por voz"*, *"detener voz"*.
    - 👁️ **Filtros Visuales:** *"alto contraste"*, *"invertir colores"*, *"modo monocromático"*, *"filtro de daltonismo"*.
    - 🔍 **Texto y Enfoque:** *"agrandar letra"*, *"reducir letra"*, *"modo dislexia"*, *"resaltar enlaces"*, *"pausar animaciones"*, *"restablecer accesibilidad"*.
* **Pre-rellenado del Formulario de Contacto:**
  - Al solicitar agendar una entrevista o reunión con Gerardo, GerAssist prepara automáticamente el borrador en la sección de contacto.
* **Prompt Engineering & Tono de Guía Empático:**
  - Diseñado sin términos comerciales agresivos. Actúa como un guía servicial y empático que promociona el perfil de Gerardo (**Técnico en Programación - UTN**, **Técnico en Análisis de Software - UNAF**, **Licenciatura en Ed. Tecnológica - UTN (en curso)** y **Data Analyst / Data Scientist**), proponiendo coordinar reuniones antes de finalizar su mensaje y manteniendo la conversación abierta sin frases de cierre.
* **Orquestación Multi-Proveedor de IA & RAG-Lite:**
  - *Nivel 1 (0 Costo de Tokens):* Búsqueda instantánea en base de conocimiento estructurada (`assets/json/bot_knowledge.json`).
  - *Nivel 2 (Cascade Pipeline Edge Serverless):* Función Node.js en Vercel (`/api/chat.js`) que alterna entre **Google Gemini API**, **Groq (Llama 3)**, **OpenRouter**, **Ollama** y **Anthropic Claude**.
  - *Nivel 3 (Rate Limiting por Sesión):* Máximo 20 consultas por usuario en `sessionStorage` para optimizar costos de token.

### 📊 2. Analítica Web Global (Google Analytics 4 - GA4)
* **Medición de Audiencia Global:** Integración nativa de Google Analytics 4 (`gtag.js` ID `G-VZPNRD2V49`) para rastrear en tiempo real el tráfico de visitas, volumen de sesiones, permanencia y distribución geográfica de los visitantes de todo el mundo.
* **Seguridad en la Transmisión de Eventos:** Configuración permisiva en Content Security Policy (CSP) en `vercel.json` (`connect-src` a `https://www.google-analytics.com` y `https://*.google.com`), asegurando la recolección sin vulnerar las reglas de seguridad.

### 🛡️ 3. Endurecimiento de Seguridad (Security Hardening Grade A)
* **Cabeceras HTTP de Alta Seguridad:** Configuración en `vercel.json` con `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin` y `Content-Security-Policy (CSP)` estricta.
* **Autenticación Criptográfica SHA-256 Nativa:** Protección del panel CRUD con cifrado `crypto.subtle.digest` en el cliente. El HTML del panel no existe en el DOM hasta verificar la clave.
* **Protección de Llaves de IA (Serverless Edge):** La API Key de IA se ejecuta únicamente del lado del servidor en `/api/chat.js` en Vercel, impidiendo la exposición de credenciales en el navegador o repositorio.
* **Filtro Anti-Spam:** Trampa Honeypot `_gotcha` en envíos AJAX de Formspree para neutralizar bots.

### 💬 4. Nubes Flotantes Explicativas (Tooltips Interactivos)
* **Indicación Visual en Hover:** Al posicionar el cursor sobre el botón flotante de Accesibilidad (`#widget-toggle`) o sobre GerAssist (`#gerassist-toggle-btn`), aparece suavemente una **nube explicativa (tooltip con puntero)** que detalla la función de cada herramienta en español e inglés (`data-i18n`).
* **Supresión Inteligente:** La nube se oculta automáticamente al abrir el modal de chat o el panel de accesibilidad para evitar obstruir los elementos interactivos del formulario o del asistente.

### 📱 5. Menú Lateral Responsive (`Drawer`) & Alta Legibilidad en Modo Oscuro
* **Diseño Drawer Flotante:** Menú lateral compacto (`width: 85%; max-width: 340px; top: 3.5rem; height: calc(100vh - 3.5rem)`), centrado vertical y horizontalmente.
* **Botón Único de Salida (`X`):** Eliminación de duplicidad de botones, con conmutación limpia de íconos en el encabezado.
* **Control de Apilamiento Z-Index:** Ajuste de jerarquía CSS que posiciona el menú sobre el telón traslúcido (`.nav__overlay`), permitiendo toques y clics instantáneos sin bloqueos.
* **Respuesta Táctil & Animaciones:** Micro-animaciones diferenciadas para estado flotante (`:hover`), sección activa (`.active`) y pulsación (`:active`).

### 🔑 6. Sistema de Administración CRUD Multisección Criptográfico (Fases 0 a 5)
* **Autenticación SHA-256 Nativa:** Verificación de clave de administrador cifrada con la Web Crypto API y sesión en `sessionStorage`.
* **Carga de Archivos Locales & Alt Text WCAG 2.1 AA:** Selector de archivos con previsualización en tiempo real para imágenes de perfil, proyectos, logos y PDFs de currículums, con gestión obligatoria de Texto Alt bilingüe.
* **Pestañas CRUD Organizadas:**
  1. **Banner / Inicio:** Nombres, Profesiones, Fotos de Perfil, CVs en PDF y Redes.
  2. **Sobre Mí:** Subtítulos, Biografía Completa y Fotografía Secundaria.
  3. **Proyectos:** Creación, edición, eliminación y reordenamiento de proyectos.
  4. **Habilidades / Skills:** Gestión por Lenguajes, Frameworks y Herramientas.
  5. **Contacto & Footer:** Endpoint de Formspree, WhatsApp, Ubicación y Copyright.
  6. **Seguridad:** Cambio seguro de contraseña de administrador.

### ✉️ 7. Formulario de Contacto Directo (AJAX + Formspree)
* **Envío Asíncrono en Tiempo Real:** Formulario con Fetch/AJAX directo a `gerardomedinavv@gmail.com` con trampa Honeypot `_gotcha` anti-spam.

### 🌐 8. Internacionalización (i18n - Español / Inglés)
* **Cambio de Idioma Instantáneo:** Motor reactivo sin recarga mediante eventos `languageChange`.
* **Rutas PDF ASCII:** Currículums bilingües en PDF (`CV_Gerardo_Medina_Villalba_espanol.pdf` y `CV_Gerardo_Medina_Villalba_EN.pdf`).

### ♿ 9. Suite Avanzada de Accesibilidad Universal (WCAG 2.1 AA)
* **Lector de Voz (TTS)** nativo vía Web Speech API.
* **Filtros de Color / Daltonismo** (Monocromático, Alto Contraste, Inversión de colores).
* **Ajustes de Texto** (Escalado A-/A+, espaciado para dislexia, resaltado de hipervínculos).
* **Pausador de Animaciones (TDAH)** y botón de restablecimiento total.

---

## 🛠️ Tecnologías Utilizadas

- **Analítica & Data Science:** Google Analytics 4 (GA4 - `gtag.js`), Data Analytics con Python, SQL, Dashboards de métricas.
- **Inteligencia Artificial & Prompt Engineering:** Prompt Design Empático, Anthropic Claude API, Groq / Llama 3, OpenRouter, Google Gemini API, RAG-Lite Local JSON Engine.
- **Frontend Core:** HTML5 Semántico (WCAG 2.1 AA), Vanilla CSS3 Modular (Variables CSS, Flexbox, Grid), Vanilla JavaScript (ES Modules).
- **Seguridad & Hashing:** Web Crypto API (SHA-256), Vercel Serverless Functions (`/api/chat.js`), Content Security Policy (CSP), HTTP Security Headers (Grade A).
- **Formularios & Estado:** Fetch API, Formspree, Web Storage API (`localStorage` & `sessionStorage`).
- **Accesibilidad & Librerías:** Web Speech API (TTS), Boxicons, AOS (Animate On Scroll).

---

## 📂 Arquitectura de Archivos

```
portfolio_web/
├── .agents/
│   └── AGENTS.md             # Reglas y memoria de proyecto para agentes de IA
├── api/
│   └── chat.js               # Endpoint Serverless Node.js en Vercel (Proxy seguro de IA)
├── assets/
│   ├── icon/                 # Iconos vectoriales y marcas
│   ├── img/                  # Imágenes de proyectos y perfiles
│   ├── json/
│   │   ├── bot_knowledge.json# Base de conocimiento estructurada para GerAssist
│   │   ├── proyectos.json    # Datos dinámicos de proyectos
│   │   └── skill.json        # Datos dinámicos de habilidades
│   ├── CV_Gerardo_Medina_Villalba_EN.pdf
│   └── CV_Gerardo_Medina_Villalba_espanol.pdf
├── css/
│   ├── main.css              # Hoja de estilos principal (Importa la arquitectura modular)
│   ├── style.css             # Estilos globales, modales CRUD y widget GerAssist
│   ├── header.css            # Estilos del encabezado
│   ├── nav.css               # Menú responsive, drawer y animaciones de enlace
│   ├── home.css              # Sección de inicio y fondo de video
│   ├── about.css             # Sección sobre mí
│   ├── projects.css          # Modales adaptativos y tarjetas de proyectos
│   ├── skills.css            # Grid interactivo de habilidades
│   ├── contact.css           # Formulario de contacto
│   ├── footer.css            # Pie de página
│   └── mediaqueries.css      # Adaptación responsive universal
├── js/
│   ├── main.js               # Punto de entrada ES Modules
│   └── modules/
│       ├── navigation.js     # Menú móvil, drawer, overlay y control de video
│       ├── theme.js          # Control de Modo Oscuro/Claro
│       ├── i18n.js           # Diccionario y motor de traducción
│       ├── projects.js       # Renderizado dinámico y modales de proyectos
│       ├── skills.js         # Renderizado dinámico de habilidades
│       ├── accessibility.js  # Suite de accesibilidad WCAG
│       ├── contact.js        # Formulario AJAX Formspree
│       ├── botService.js     # Motor RAG local y consumidor de /api/chat
│       ├── chatbotModal.js   # Interfaz interactiva de GerAssist (Navegación & Comandos)
│       ├── auth.js           # Autenticación SHA-256 de Administrador
│       ├── dataStore.js      # Almacén central de datos reactivos
│       ├── home.js           # Renderizado dinámico del Banner
│       ├── about.js          # Renderizado dinámico de Sobre Mí
│       ├── footerContact.js  # Renderizado dinámico de Contacto y Footer
│       ├── adminModal.js     # Panel de Administración CRUD Multisección
│       └── preloader.js      # Pantalla de carga e inicialización modular
├── server.js                 # Servidor estático Node.js para pruebas locales
├── index.html                # Documento HTML5 principal (Incluye GA4 gtag.js)
├── vercel.json               # Configuración de despliegue, CSP y seguridad Vercel
├── .gitignore                # Protección de credenciales y archivos temporales
└── README.md                 # Documentación técnica del proyecto
```

---

## 💻 Ejecución Local

Para ejecutar el proyecto en tu entorno local:

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/Gerardomedinav/portfolio_web.git
   cd portfolio_web
   ```
2. Iniciá el servidor Node.js local:
   ```bash
   node server.js
   ```
3. Abrí en tu navegador `http://localhost:3000` e interactuá con **`GerAssist`**, la analítica y la suite de accesibilidad.
