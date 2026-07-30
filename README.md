# 🚀 Portafolio Web Interactivo, Accesible & Bilingüe | Gerardo Medina

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Security Grade](https://img.shields.io/badge/Security--Headers-Grade%20A-brightgreen?style=for-the-badge)](https://securityheaders.com/)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1_AA-100%25-blue?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Performance](https://img.shields.io/badge/Performance-96%25-orange?style=for-the-badge)](https://pagespeed.web.dev/)
[![AI Assistant](https://img.shields.io/badge/AI_Assistant-GerAssist-blueviolet?style=for-the-badge)](https://github.com/Gerardomedinav/portfolio_web)

Bienvenido al repositorio oficial del **Portafolio Web Profesional de Gerardo Medina** (Full Stack Developer Jr. & Data Analyst / Data Scientist profile).

Este proyecto destaca mis proyectos y habilidades a la vez que sirve como caso de estudio completo en **Desarrollo Web Moderno, Prompt Engineering & Orquestación de IA, Accesibilidad Universal (WCAG 2.1 AA), Internacionalización (i18n), Comunicación Asíncrona (AJAX Formspree), Endurecimiento de Seguridad (Hardening)** y un **Sistema de Administración CRUD Multisección Criptográfico Reactivo**.

---

## ✨ Funcionalidades Principales y Arquitectura

### 🤖 1. Asistente Virtual Inteligente con Prompt Engineering (`GerAssist`)
El portafolio incluye a **`GerAssist`**, un chatbot con Inteligencia Artificial integrado mediante una arquitectura híbrida de alto rendimiento:
* **Prompt Engineering & Diseño de Persona Empática:** Diseñado mediante ingeniería de prompts avanzada para actuar como un embajador servicial, empático y comercial. Resalta el perfil analítico de Gerardo (**Data Analyst / Data Scientist**), su enfoque en **Accesibilidad Universal (WCAG 2.1 AA)**, sus títulos universitarios en Programación, Análisis y Diseño de Software, y sus estudios de **Licenciatura en Educación Tecnológica en la UTN**.
* **Orquestación Multi-Proveedor de IA:** Capa de servicio abstracta capaz de intercalar en tiempo real entre modelos como **Anthropic Claude API**, **Groq (Llama 3)**, **OpenRouter** y **Google Gemini API**.
* **Arquitectura Híbrida RAG-Lite & Optimización de Tokens:**
  - *Nivel 1 (0 Costo de Tokens):* Búsqueda en tiempo real sobre una base de conocimiento en JSON (`assets/json/bot_knowledge.json`) para responder FAQs de forma instantánea sin consumir créditos de API.
  - *Nivel 2 (Rate Limiting y Anti-Abuso):* Control de sesión en `sessionStorage` que limita las consultas abiertas a un máximo de 20 por usuario (con temporizador de reactivación de 30 min), acotando el contexto inyectado al modelo.
  - *Nivel 3 (Fallback Directo a Contacto):* Redirección amigable con botones de acción directa hacia el **Formulario de Contacto**, **LinkedIn** y **Gmail**.
* **Protección de Credenciales (Serverless Edge in `/api/chat.js`):** La API Key se ejecuta únicamente del lado del servidor en Vercel, garantizando cero exposición de llaves en el navegador o repositorio.

### 🔑 2. Sistema de Administración CRUD Multisección (Fases 0 a 5)
* **Autenticación Criptográfica Nativa (SHA-256):** Verificación de claves con la Web Crypto API (`crypto.subtle.digest`) con token de sesión en `sessionStorage`. El HTML del panel no existe en la página hasta ingresar la clave correcta (previniendo inspección en DevTools).
* **Edición Limpia en Texto Plano:** Formulario intuitivo sin etiquetas HTML expuestas. Los campos dividen Saludos, Nombres y Profesiones en texto limpio y el código aplica los colores y formato automáticamente.
* **Carga Directa de Archivos Locales (`<input type="file">`):** Selector de archivos de la computadora con previsualización en tiempo real para foto de perfil, foto de Sobre Mí, portadas de proyectos, logos y PDFs de CVs.
* **Gestión de Texto Alternativo (Alt Text WCAG 2.1 AA):** Todos los cargadores de imagen permiten ingresar o modificar el **Texto Alt bilingüe (ES / EN)** para garantizar accesibilidad completa.
* **Pestañas CRUD Organizadas:**
  1. **Banner / Inicio:** Saludos, Nombre, Profesión, Foto de Perfil, CVs en PDF y Redes Sociales.
  2. **Sobre Mí:** Subtítulos, Biografía Completa y Fotografía Secundaria.
  3. **Proyectos:** Lista interactiva para **Crear, Editar, Eliminar y Reordenar proyectos** con portadas y enlaces.
  4. **Habilidades / Skills:** Clasificación por Lenguajes, Frameworks y Herramientas para agregar/editar tecnologías.
  5. **Contacto & Footer:** Endpoint AJAX de Formspree, Teléfono/WhatsApp, Ubicación y Copyright del pie de página.
  6. **Seguridad / Clave:** Cambio seguro de contraseña de administrador.

### ✉️ 3. Formulario de Contacto Directo (AJAX + Formspree)
* **Envío Asíncrono en Tiempo Real:** Integración directa por Fetch/AJAX con Formspree hacia `gerardomedinavv@gmail.com` sin recargar la página ni abrir clientes de correo externos.
* **Seguridad y Filtro Anti-Spam:** Trampa Honeypot `_gotcha` para neutralizar bots automáticos y validación de contenido.

### 🌐 4. Internacionalización (i18n - Español / Inglés)
* **Motor Reactivo sin Recarga:** Cambio de idioma instantáneo (`es` / `en`) mediante eventos personalizados `languageChange`.
* **Previsualización de CV en PDF:** Apertura nativa del currículum en PDF en una nueva pestaña adaptado al idioma activo (`CV_Gerardo_Medina_Villalba_español.pdf` y `CV_Gerardo_Medina_Villalba_EN.pdf`).

### ♿ 5. Suite Avanzada de Accesibilidad (WCAG 2.1 AA)
Panel flotante interactivo (`.widget-panel`) integrado estéticamente con el tema visual:
* **👁️ Auditoría de Imágenes 100% Accesibles:** Cada imagen del sitio posee un texto alternativo (`alt`) descriptivo y reactivo en tiempo real al cambio de idioma (`data-i18n-alt`).
* **🔊 Lector de Voz (TTS):** Síntesis de voz nativa mediante Web Speech API para escuchar el contenido del sitio.
* **🎨 Filtro de Daltonismo:** Modo monocromático / escala de grises para usuarios con visibilidad reducida.
* **🔤 Escalado Tipográfico Dinámico:** Controles para ajustar el tamaño de fuente (`A-`, `A`, `A+`).
* **📖 Espaciado de Lectura (Dislexia):** Optimización del interlineado y espaciado de texto para facilitar la lectura.
* **🔗 Resaltado de Hipervínculos:** Indicadores visuales destacados en todos los enlaces interactivos.
### ⏳ 6. Pantalla de Carga Inteligente y Preloader Interactivo (`preloader.js`)
* **Anillo de Progreso SVG Dinámico:** Indicador circular animado en SVG con contador en tiempo real (`0%` a `100%`).
* **Secuencia de Carga por Módulos:** Muestra de forma altamente visual e intuitiva la inicialización paso a paso de los componentes (*Arquitectura CSS, Almacén DataStore, Proyectos, Habilidades y Conexión con el Asistente GerAssist*).
* **Transición Fluida de Desvanecimiento:** Desaparición elegante con efecto de desenfoque y desenfoque óptico una vez alcanzado el 100%, garantizando una interacción fluida en redes móviles y servicios Jamstack como Vercel.

---

## 🛠️ Tecnologías Utilizadas

- **Inteligencia Artificial & Prompt Engineering:** Prompt Design Empático, Anthropic Claude API, Groq / Llama 3, OpenRouter, Google Gemini API, RAG-Lite Local JSON Engine.
- **Frontend Core:** HTML5 Semántico, Vanilla CSS3 (Variables CSS, Flexbox, CSS Grid, Modulares), Vanilla JavaScript (ES Modules).
- **Seguridad & Hashing:** Web Crypto API (`crypto.subtle.digest` SHA-256), Vercel Serverless Functions (`/api/chat.js`), Content Security Policy (CSP), HTTP Headers en `vercel.json`.
- **Formularios & Estado:** AJAX / Fetch API (`URLSearchParams`), Formspree, Web Storage API (`localStorage` & `sessionStorage`).
- **Accesibilidad & Librerías:** WCAG 2.1 AA, Web Speech API (TTS), Boxicons, AOS (Animate On Scroll).

---

## 📂 Arquitectura de Archivos

```
portfolio_web/
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
│   └── CV_Gerardo_Medina_Villalba_español.pdf
├── css/
│   ├── main.css              # Hoja de estilos principal
│   ├── style.css             # Estilos globales, modales CRUD y widget GerAssist
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
│       ├── botService.js     # Motor RAG local y consumidor de /api/chat
│       ├── chatbotModal.js   # Interfaz interactiva de GerAssist (Chatbot UI)
│       ├── auth.js           # Autenticación SHA-256 de Administrador
│       ├── dataStore.js      # Almacén central de datos reactivos
│       ├── home.js           # Renderizado dinámico del Banner
│       ├── about.js          # Renderizado dinámico de Sobre Mí
│       ├── footerContact.js  # Renderizado dinámico de Contacto y Footer
│       └── adminModal.js     # Panel de Administración CRUD Multisección
├── index.html                # Documento HTML5 principal
├── vercel.json               # Configuración de despliegue y seguridad Vercel (CSP)
├── .gitignore                # Reglas para ignorar .env y credenciales de IA
└── README.md                 # Documentación técnica del proyecto
```

---

## 💻 Ejecución Local

Para ejecutar el proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Gerardomedinav/portfolio_web.git
   cd portfolio_web
   ```
2. Inicia un servidor web local:
   ```bash
   npx http-server -p 8080
   ```
3. Abre en tu navegador `http://localhost:8080` e interactúa con **`GerAssist`** en la esquina inferior derecha.
