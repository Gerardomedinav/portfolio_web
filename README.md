# 🚀 Portafolio Web Interactivo, Accesible & Bilingüe | Gerardo Medina

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Security Grade](https://img.shields.io/badge/Security--Headers-Grade%20A-brightgreen?style=for-the-badge)](https://securityheaders.com/)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1_AA-100%25-blue?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Performance](https://img.shields.io/badge/Performance-96%25-orange?style=for-the-badge)](https://pagespeed.web.dev/)

Bienvenido al repositorio del **Portafolio Web Profesional de Gerardo Medina** (Full Stack Developer Jr.).

Este proyecto destaca mis proyectos y habilidades a la vez que sirve como caso de estudio en **Desarrollo Web Moderno, Accesibilidad Universal (WCAG 2.1 AA), Internacionalización (i18n), Comunicación Asíncrona (AJAX Formspree), Endurecimiento de Seguridad (Hardening)** y **Optimización de Rendimiento (PageSpeed)**.

---

## ✨ Funcionalidades Principales

### ✉️ 1. Formulario de Contacto Directo (AJAX + Formspree)
* **Envío Asíncrono en Tiempo Real:** Integración directa por Fetch/AJAX con Formspree hacia `gerardomedinavv@gmail.com` sin recargar la página ni abrir clientes de correo externos.
* **Experiencia de Usuario Fluida:** Indicador de carga dinámico en el botón de envío y alertas en pantalla personalizadas en español e inglés.
* **Seguridad y Filtro Anti-Spam:** Trampa Honeypot `_gotcha` para neutralizar bots automáticos y validación de longitud de contenido.
* **Diseño Simétrico de Tarjetas Gemelas:** Maquetación equilibrada con badges de información de contacto (Email, Teléfono/WhatsApp, Ubicación) y sombreado responsivo (`box-shadow`).

### 🌐 2. Internacionalización (i18n - Español / Inglés)
* **Motor Reactivo sin Recarga:** Cambio de idioma instantáneo (`es` / `en`) mediante eventos personalizados `languageChange`.
* **Sincronización Total:** Sincroniza simultáneamente los selectores del encabezado y del panel de accesibilidad, placeholders de formularios y textos de proyectos.
* **Previsualización de CV en PDF:** Apertura nativa del currículum en PDF en una nueva pestaña adaptado al idioma activo (`CV_Gerardo_Medina_Villalba_español.pdf` y `CV_Gerardo_Medina_Villalba_EN.pdf`).
* **Persistencia:** Guarda la preferencia de idioma en `localStorage`.

### ♿ 3. Suite Avanzada de Accesibilidad (WCAG 2.1 AA) & Imágenes Bilingües
Panel flotante interactivo (`.widget-panel`) integrado estéticamente con el tema visual:
* **👁️ Auditoría de Imágenes 100% Accesibles:** Cada imagen del sitio (*estática o dinámica*) posee un texto alternativo (`alt`) descriptivo y reactivo en tiempo real al cambio de idioma (`data-i18n-alt`).
* **🔊 Lector de Voz (TTS):** Síntesis de voz nativa mediante Web Speech API para escuchar el contenido del sitio.
* **🎨 Filtro de Daltonismo:** Modo monocromático / escala de grises para usuarios con visibilidad reducida.
* **🔤 Escalado Tipográfico Dinámico:** Controles para ajustar el tamaño de fuente (`A-`, `A`, `A+`).
* **📖 Espaciado de Lectura (Dislexia):** Optimización del interlineado y espaciado de texto para facilitar la lectura.
* **🔗 Resaltado de Hipervínculos:** Indicadores visuales destacados en todos los enlaces interactivos.
* **⏸️ Pausar Animaciones (TDA / Concentración):** Desactivación instantánea de todo tipo de movimiento y efectos para personas con TDA o trastornos de atención.
* **🔄 Restablecimiento y Persistencia:** Botón global para reiniciar ajustes y guardado automático en `localStorage`.

### 🌓 4. Modo Oscuro / Claro
* **Sincronización Unificada:** Alternancia fluida de tema visual mediante la clase `.dark` en el `body`.
* **Detección Automática:** Detección de la preferencia del sistema operativo (`prefers-color-scheme`).
* **Persistencia:** Mantiene la selección del usuario en `localStorage`.

### 💼 5. Secciones Interactivas Dinámicas
* **Proyectos Dinámicos (`proyectos.json`):** Renderizado reactivo de tarjetas con elevación y sombras responsivas (`box-shadow`), enlaces a GitHub/Demo y modales popover adaptativos con scroll interno aislado.
* **Habilidades Dinámicas (`skill.json`):** Clasificación por Lenguajes, Frameworks y Herramientas con animación de entrada meteorito multidireccional y onda de choque expansiva en el impacto (`@keyframes shockwaveRipple` y `@keyframes shockwaveHover`).
* **Navegación Responsive:** Menú colapsable estilo *hamburger* para dispositivos móviles.

---

## ⚡ Rendimiento y Auditoría (PageSpeed Insights)

Auditado con **Google PageSpeed Insights (Lighthouse)** logrando métricas en el percentil superior:

* 🚀 **Performance: 96%** – Carga crítica optimizada con LCP (Largest Contentful Paint) de solo **0.7s**.
* ♿ **Accessibility: 100%** – Cumplimiento estricto de WCAG 2.1 AA con etiquetas semánticas y soportes `aria-*`.
* 🛡️ **Best Practices: 92%** – Código sin vulnerabilidades y mejores prácticas de la industria.
* 🔍 **SEO: 91%** – Meta-etiquetas descriptivas, Open Graph y arquitectura limpia.

---

## 🛡️ Ciberseguridad & Endurecimiento (Security Grade A)

Evaluación basada en marcos de seguridad como **NIST SP 800-30**, logrando la calificación **Grade A** en *Security Headers* mediante la configuración estricta en `vercel.json`:

* **Content-Security-Policy (CSP):** Mitigación proactiva contra ataques de inyección y XSS.
* **X-Frame-Options (DENY):** Protección contra ataques de Clickjacking.
* **X-Content-Type-Options (nosniff):** Prevención de vulnerabilidades MIME.
* **Referrer-Policy & Permissions-Policy:** Control estricto de origen y permisos de características.

---

## 🛠️ Tecnologías y Arquitectura

* **Frontend:** HTML5 Semántico, Vanilla CSS3 (Modular por componentes), Vanilla JavaScript (ES Modules).
* **Servicios Backend:** Formspree AJAX API (`https://formspree.io/f/mvzeyrzq`).
* **Librerías:** 
  * [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) - Animaciones al scroll.
  * [Boxicons](https://boxicons.com/) - Iconografía vectorial.
  * [Google Fonts](https://fonts.google.com/) - Tipografía Poppins.
* **Analítica & Despliegue:** Google Analytics 4 (`gtag.js`), Vercel Edge Network.

---

## 📂 Estructura del Proyecto

```
portfolio_web/
├── .agents/                  # Memoria y regla del proyecto para agentes de IA (AGENTS.md)
├── assets/
│   ├── icon/                 # Iconos de marcas y favicons
│   ├── img/                  # Imágenes de proyectos y sobre mí
│   ├── json/
│   │   ├── proyectos.json    # Datos dinámicos multilingües de proyectos
│   │   └── skill.json        # Datos dinámicos de habilidades
│   ├── CV_Gerardo_Medina_Villalba_EN.pdf
│   └── CV_Gerardo_Medina_Villalba_español.pdf
├── css/
│   ├── main.css              # Importador central de módulos CSS
│   ├── style.css             # Reset, variables globales y widget de accesibilidad
│   ├── header.css            # Estilos del encabezado
│   ├── nav.css               # Navegación y menú responsive
│   ├── home.css              # Sección de inicio
│   ├── about.css             # Sección Sobre mí
│   ├── projects.css          # Tarjetas de proyectos y modales popover
│   ├── skills.css            # Sección de habilidades
│   ├── contact.css           # Sección de contacto (Tarjetas gemelas y responsive)
│   ├── footer.css            # Pie de página
│   └── mediaqueries.css      # Adaptabilidad responsive / Breakpoints
├── js/
│   ├── main.js               # Punto de entrada de ES Modules
│   └── modules/
│       ├── navigation.js     # Menú móvil y controladores de nav
│       ├── theme.js          # Control unificado Modo Oscuro/Claro
│       ├── i18n.js           # Motor de traducción y vista de CV
│       ├── projects.js       # Renderizado reactivo de proyectos y modales
│       ├── skills.js         # Renderizado dinámico de habilidades
│       ├── contact.js        # Manejo de contacto por AJAX Formspree y validaciones
│       └── accessibility.js  # Lector de voz, daltonismo, tipografía y WCAG
├── index.html                # Documento HTML principal
├── vercel.json               # Configuración de cabeceras de seguridad y despliegue
├── package.json              # Gestión de dependencias (aos)
└── README.md                 # Documentación principal del repositorio
```

---

## 🚀 Ejecución en Entorno Local

Para ejecutar el portafolio en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Gerardomedinav/portfolio_web.git
   cd portfolio_web
   ```

2. **Iniciar un servidor HTTP local:**
   Puedes usar `npx http-server` o `python`:
   ```bash
   npx http-server -p 8080
   # O con Python:
   python -m http.server 8080
   ```

3. **Abrir en el navegador:**
   Accede a [`http://localhost:8080`](http://localhost:8080).

---

## 👤 Autor

* **Gerardo Medina** - *Full Stack Developer Jr.*
* **LinkedIn:** [Gerardo Medina](https://www.linkedin.com/in/gerardomedinav/)
* **GitHub:** [@Gerardomedinav](https://github.com/Gerardomedinav)

---
*Desarrollado enfocado en alta velocidad, accesibilidad universal y seguridad por diseño.*
