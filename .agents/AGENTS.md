# AGENTS.md - Memoria del Proyecto Portfolio Web

Este documento sirve como memoria y guía contextual de referencia para cualquier IA o desarrollador que realice modificaciones en el proyecto **Gerardo Medina - Web Portfolio**.

---

## 📌 Resumen General del Proyecto
- **Propietario:** Gerardo Medina (Full Stack Developer Jr.)
- **Descripción:** Portafolio personal web interactivo, accesible y bilingüe (Español / Inglés).
- **Despliegue:** Vercel (configurado con cabeceras de seguridad HTTP).

---

## 🛠️ Tecnologías y Arquitectura

### 1. Frontend & Lenguajes
- **HTML5 Semántico:** Siguiendo directrices de accesibilidad **WCAG 2.1 AA** (`aria-*`, `role`, etiquetas descriptivas, soporte para lectores de pantalla).
- **Vanilla CSS3 (Modular):** Hoja de estilos central `css/main.css` que consolida la arquitectura modular por componentes en `css/` (`style.css`, `header.css`, `nav.css`, `home.css`, `about.css`, `projects.css`, `skills.css`, `contact.css`, `footer.css`, `mediaqueries.css`).
- **Vanilla JavaScript (ES Modules):** Punto de entrada en `js/main.js` y arquitectura modular basada en módulos ES en `js/modules/`:
  - `navigation.js`: Menú responsive, navegación y panel del widget.
  - `theme.js`: Gestión unificada del tema oscuro/claro y sincronización de iconos.
  - `i18n.js`: Motor de internacionalización (ES/EN), sincronización de selectores y previsualización de CV en PDF.
  - `projects.js`: Renderizado dinámico de proyectos reactivo al idioma con modales adaptativos.
  - `skills.js`: Renderizado dinámico de habilidades reactivo al idioma.
  - `contact.js`: Formulario de contacto interactivo con envíos asíncronos directos (AJAX) vía Formspree (`https://formspree.io/f/mvzeyrzq`) hacia correo personal, trampa anti-bots Honeypot `_gotcha` y validación de contenido.
  - `accessibility.js`: Suite avanzada de accesibilidad WCAG 2.1 AA (Lector de voz TTS, Daltonismo/Filtros de color, tamaño de texto A-/A/A+, espaciado de lectura para dislexia, resaltado de enlaces, pausar animaciones TDA y restablecer todo).

### 2. Librerías Externas y CDNs
- **AOS (Animate On Scroll v2.3.4):** Animaciones al hacer scroll.
- **Boxicons (v2.1.4):** Librería de iconos vectoriales para enlaces y widgets.
- **Google Fonts:** Tipografía principal `Poppins`.
- **Google Analytics:** Medición con `gtag.js` (`G-VZPNRD2V49`).

### 3. Funcionalidades Principales
- **Internacionalización (i18n):** Administrada por `js/modules/i18n.js`. Soporta `es` y `en`. Sincroniza selectores del header y del widget, guardando preferencia en `localStorage` ('lang'). Emite eventos `languageChange` para actualización reactiva del DOM sin recargar.
- **Previsualización de CV en PDF:** El enlace al CV abre el PDF correspondiente en nueva pestaña (`target="_blank" rel="noopener noreferrer"`) permitiendo previsualización nativa antes de cualquier descarga.
- **Modo Oscuro / Claro:** Administrado por `js/modules/theme.js`. Soporta preferencia del sistema (`matchMedia`) y guarda en `localStorage` ('theme'). Alterna de forma consistente la clase `.dark` en el `body`.
- **Proyectos Dinámicos:** Carga desde `assets/json/proyectos.json` en `js/modules/projects.js` con modales popover adaptativos y aislados. Diseñado con tarjetas interactivas dotadas de elevación y sombreado responsivo (`box-shadow`), e ingreso animado multidireccional con AOS (`fade-right`, `fade-down`, `fade-left`, `fade-up`, `zoom-in-*`).
- **Habilidades Dinámicas:** Carga desde `assets/json/skill.json` en `js/modules/skills.js` clasificadas por lenguajes, frameworks y herramientas, con animación de entrada tipo meteorito multidireccional y onda de choque expansiva en el impacto (`@keyframes shockwaveRipple`), también reactiva al hacer hover sobre los logos (`@keyframes shockwaveHover`). Incluye sombra sutil blanca (`drop-shadow`) en modo oscuro para recortar y resaltar los logos de color negro.
- **Suite Avanzada de Accesibilidad y Modal Panel:** Controlada por `js/modules/accessibility.js` y estilizada en `css/style.css`. Posee un modal interactivo (`.widget-panel`) integrado con sombra sofisticada (`box-shadow: 0 16px 36px rgba(0, 120, 255, 0.16)...`) en consonancia visual con las tarjetas de proyectos para modo claro y oscuro (`rgba(0, 170, 255, 0.22)`). Incluye:
  - **Lector de voz (TTS):** Síntesis de voz Web Speech API para lectura de contenido.
  - **Filtro de Daltonismo:** Filtro monocromático / escala de grises.
  - **Escalado de Texto:** Controles dinámicos (A- / A / A+).
  - **Espaciado de Lectura:** Optimizado para dislexia y facilidad de lectura.
  - **Resaltado de Enlaces:** Indicadores visuales claros para hipervínculos.
  - **Pausar Animaciones (TDA / Concentración):** Desactivación instantánea de todo tipo de movimiento, keyframes, scroll y hover para personas con TDA o trastornos de concentración (`body.disable-animations`).
  - **Restablecimiento Global y Persistencia:** Botón para reiniciar ajustes y guardado automático en `localStorage`.

### 4. Seguridad y Despliegue
- **`vercel.json`:** Define cabeceras HTTP strictly configuradas (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`).

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
│   ├── main.css              # Hoja de estilos principal (importa todos los módulos)
│   ├── style.css             # Estilos globales, variables CSS, reset y widget de accesibilidad (con sombra coherente con tarjetas)
│   ├── header.css            # Estilos de cabecera
│   ├── nav.css               # Estilos de navegación y menú responsive
│   ├── home.css              # Sección Inicio
│   ├── about.css             # Sección Sobre mí
│   ├── projects.css          # Sección Proyectos y modales popover (con tarjetas y box-shadow)
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
│       └── accessibility.js  # Lector de voz, daltonismo, tipografía y WCAG
├── index.html                # Documento HTML principal
├── vercel.json               # Configuración de despliegue y seguridad Vercel
├── .prettierrc.json          # Formato de código
├── package.json              # Gestión de dependencias (aos)
└── AGENTS.md                 # Memoria y directrices del proyecto para IA y desarrolladores
```

---

## 📋 Reglas y Convenciones para Futuras Modificaciones

1. **Accesibilidad Obligatoria:**
   - Todo nuevo elemento interactivo (`<button>`, `<a>`, `<input>`) debe incluir un atributo `aria-label` o `aria-labelledby` descriptivo tanto en español como en inglés según el idioma activo.
   - Las imágenes deben tener texto `alt` significativo.

2. **Multilingüe (i18n):**
   - Si se añade un nuevo elemento de texto en HTML, agregarlo a los objetos `texts` y `translations` in `js/modules/i18n.js` tanto en `es` como en `en`, y asignarle el atributo `data-i18n` correspondiente en `index.html`.
   - Si se añade un nuevo proyecto, actualizar `assets/json/proyectos.json` con los campos en ambos idiomas.

3. **Estilos Modularizados y Diseño Visual:**
   - Importar o mantener las reglas CSS dentro de sus respectivos módulos en `css/` vinculados a través de `css/main.css`.
   - Utilizar las variables CSS globales definidas en `css/style.css` para colores, fuentes y z-index.
   - Mantener la coherencia estética de elevación (`box-shadow`), bordes responsivos y comportamiento en modo claro/oscuro entre tarjetas de contenido y componentes modales/widgets.

4. **Compatibilidad con Modo Oscuro:**
   - Asegurar que cualquier nueva clase CSS considere el estado `.dark` en el `body`.

5. **Actualizaciones de Proyectos y Skills:**
   - Para añadir proyectos o habilidades, editar únicamente los archivos JSON en `assets/json/` sin modificar la lógica JavaScript de renderizado.
