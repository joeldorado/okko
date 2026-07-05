/* =====================================================
   PROYECTOS MODULE - MODAL FULLSCREEN
   ===================================================== */

$(document).ready(function () {

  /* ===============================
     VARIABLES GLOBALES
  =============================== */
  // Modal único con dos paneles
  const $projectsModal = $("#projectsModal");
  const $projectsGrid  = $("#projectsGridModal");
  const $closeBtn      = $("#projectsCloseBtn");
  const $detailCloseBtn = $("#projectDetailCloseBtn");
  const $accessScreen  = $("#projectAccessScreen");
  const $galleryScreen = $("#projectGalleryScreen");
  const $accessInput   = $("#projectAccessInput");
  const $accessError   = $("#projectAccessError");

  let currentProject = null;
  let galleryImages = [];
  let currentIndex = 0;
  let currentTheme = "dark"; // se actualiza desde el index
  let currentSource = ""; // "header" o "footer"
  let gridStale = false; // el grid quedó con locks de otro tema mientras el detalle estaba abierto

  /* ===============================
     CATEGORÍAS = FILTROS
     El orden aquí define el orden de la barra de filtros.
  =============================== */
  const CATEGORIES = [
    { key: "all",          i18n: "projects.filterAll" },
    { key: "casas",        i18n: "projects.catCasas" },
    { key: "desarrollos",  i18n: "projects.catDesarrollos" },
    { key: "diseno",       i18n: "projects.catDiseno" },
    { key: "edificios",    i18n: "projects.catEdificios" },
  ];

  // Filtro activo actual (persistente entre re-render / re-tema)
  let currentFilter = "all";

  /* ===============================
     SWITCH MAYOR — MARCA (KOA = negros, KOI = blancos)
     Ya no filtra: refleja el tema activo del sitio y al click lo cambia
     (misma pipeline que header/footer). Las 4 cards siempre visibles;
     las de la otra marca quedan brand-locked con frost glass.
  =============================== */
  const BRANDS = [
    { key: "koa", label: "KOA" },
    { key: "koi", label: "KOI" },
  ];

  // Marca activa derivada del tema: light = KOI, dark = KOA
  function activeBrand() {
    return currentTheme === "light" ? "koi" : "koa";
  }

  function isBrandLocked(p) {
    return p.brand !== activeBrand();
  }

  /* ===============================
     DATOS DE PROYECTOS (CATÁLOGO REAL)
     cover  → thumbnail para la card del grid
     images → galería en alta resolución (peek carousel)
     Casa Lumen es el proyecto de referencia; el resto crece con el tiempo.
  =============================== */
  function galleryOf(slug, count) {
    return Array.from({ length: count }, (_, i) =>
      `./images/proyectos/${slug}/lg/${i + 1}.jpg`);
  }

  // brand: clasificación visual del proyecto — "koa" = negros/oscuros, "koi" = blancos/claros
  const proyectos = [
    {
      id: 1,
      slug: "casa-lumen",
      categoria: "casas",
      brand: "koi",
      titulo: "Casa Lumen",
      cover: "./images/proyectos/casa-lumen/thumb/cover.jpg",
      images: galleryOf("casa-lumen", 7),
    },
    {
      id: 2,
      slug: "dm-centenario",
      categoria: "desarrollos",
      brand: "koa",
      titulo: "DM Centenario",
      cover: "./images/proyectos/dm-centenario/thumb/cover.jpg",
      images: galleryOf("dm-centenario", 5),
    },
    {
      id: 3,
      slug: "el-tigrillo",
      categoria: "edificios",
      brand: "koi",
      titulo: "El Tigrillo",
      cover: "./images/proyectos/el-tigrillo/thumb/cover.jpg",
      images: galleryOf("el-tigrillo", 6),
    },
    {
      id: 4,
      slug: "md1",
      categoria: "diseno",
      brand: "koa",
      titulo: "MD1",
      cover: "./images/proyectos/md1/thumb/cover.jpg",
      images: galleryOf("md1", 4),
      hasKey: true,
    },
  ];

  /* ===============================
     FUNCIÓN PARA ABRIR MODAL DE PROYECTOS
  =============================== */
  window.openProjectsModal = function (theme) {
    currentTheme = theme || "dark";
    // El origen se deriva del TEMA (no del click): light entra por el lado
    // KOI (header/izquierda) y dark por el KOA (footer/derecha), para que las
    // reglas from-* (!important) siempre coincidan con los locks de las cards.
    currentSource = currentTheme === "light" ? "header" : "footer";
    gridStale = false;

    // Aplicar tema al modal
    $projectsModal.removeClass("theme-dark theme-light from-header from-footer")
      .addClass(`theme-${currentTheme}`)
      .addClass(currentSource === "header" ? "from-header" : "from-footer");

    // Mostrar modal — reflow entre quitar hidden (display:none) y activar para que
    // el slide de entrada anime desde el estado aparcado (translateX ±100%)
    $projectsModal.removeClass("hidden");
    void $projectsModal[0].offsetWidth; // reflow
    $projectsModal.addClass("active");

    // Ocultar galería individual, mostrar grid
    $accessScreen.addClass("hidden");
    $galleryScreen.addClass("hidden");

    // Barra de filtros + grid
    renderFilters();
    renderProjects();

    // Marcar "Proyectos" como sección activa en header y footer nav
    $(".proyectos-link").addClass("nav-current");

    // Precargar en segundo plano las fotos de la galería (para abrir detalle instantáneo)
    preloadGalleryImages();

    // Proyectos vive entre header/footer; el grid scrollea internamente (sin lock global)
  };

  /* ===============================
     PRECARGA DE FOTOS DE GALERÍA (en segundo plano)
     Recorre proyectos[].images una sola vez con concurrencia limitada, de modo
     que al abrir un proyecto las imágenes 'lg' ya estén en cache.
  =============================== */
  let galleryPreloadStarted = false;
  function preloadGalleryImages() {
    if (galleryPreloadStarted) return;
    galleryPreloadStarted = true;
    const urls = [];
    proyectos.forEach(p => (p.images || []).forEach(src => urls.push(src)));
    let i = 0;
    const CONCURRENCY = 4;
    const next = () => {
      if (i >= urls.length) return;
      const img = new Image();
      const done = () => next();
      img.onload = done;
      img.onerror = done;
      img.src = urls[i++];
    };
    const start = () => { for (let k = 0; k < CONCURRENCY; k++) next(); };
    if ("requestIdleCallback" in window) requestIdleCallback(start);
    else setTimeout(start, 300);
  }

  /* ===============================
     TRADUCTOR CORTO (fallback a la clave)
  =============================== */
  function _t(key) {
    return (window.i18n && window.i18n.t) ? window.i18n.t(key) : key;
  }

  // Etiqueta de categoría legible desde la clave interna
  function categoryLabel(key) {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat ? _t(cat.i18n) : key;
  }

  /* ===============================
     RENDERIZAR BARRAS DE FILTROS
     Fila 1 (mayor): marca KOA/KOI · Fila 2: categorías
  =============================== */
  const $projectsFilters = $("#projectsFilters");
  const $projectsBrandFilters = $("#projectsBrandFilters");

  function renderFilters() {
    // Fila mayor — switch de tema por marca (KOA / KOI)
    $projectsBrandFilters.empty();
    BRANDS.forEach((b) => {
      const $btn = $(`
        <button type="button" class="brand-btn${b.key === activeBrand() ? " active" : ""}"
                data-brand="${b.key}"><span class="brand-swatch brand-swatch-${b.key}" aria-hidden="true"></span><span class="brand-btn-label">${b.label}</span></button>
      `);
      $btn.on("click", () => {
        if (b.key === activeBrand()) return;
        if (typeof window.applySiteTheme === "function") window.applySiteTheme(b.key);
      });
      $projectsBrandFilters.append($btn);
    });

    // Fila de categorías
    $projectsFilters.empty();
    CATEGORIES.forEach((cat) => {
      const $btn = $(`
        <button type="button" class="filter-btn${cat.key === currentFilter ? " active" : ""}"
                data-filter="${cat.key}" data-i18n="${cat.i18n}">${categoryLabel(cat.key)}</button>
      `);
      $btn.on("click", () => setFilter(cat.key));
      $projectsFilters.append($btn);
    });
  }

  // Sincronizar el switch de marca con el tema vigente (sin re-render de la fila)
  function syncBrandSwitch() {
    $projectsBrandFilters.find(".brand-btn").removeClass("active")
      .filter(`[data-brand="${activeBrand()}"]`).addClass("active");
  }

  function setFilter(key) {
    if (key === currentFilter) return;
    currentFilter = key;
    $projectsFilters.find(".filter-btn").removeClass("active")
      .filter(`[data-filter="${key}"]`).addClass("active");
    renderProjects();
  }

  /* ===============================
     RENDERIZAR GRID DE PROYECTOS (catálogo real, filtrado por categoría)
  =============================== */
  function renderProjects() {
    $projectsGrid.empty();

    const allCards = [];
    // Siempre se muestran TODAS las marcas; solo filtra la categoría.
    // Las cards de la otra marca van brand-locked (frost glass, click = toggle de tema).
    const visible = proyectos.filter((p) =>
      currentFilter === "all" || p.categoria === currentFilter);

    visible.forEach((p) => {
      const brandLocked = isBrandLocked(p);
      const lockBadge = p.hasKey
        ? `<div class="card-lock" aria-hidden="true"><i class="fa-solid fa-lock"></i></div>`
        : "";
      const lockInline = p.hasKey
        ? `<i class="fa-solid fa-lock project-info-lock" aria-hidden="true"></i> `
        : "";
      const brandLockOverlay = brandLocked
        ? `<div class="brand-lock-overlay">
             <span class="brand-lock-hint">
               <span data-i18n="projects.disabledPrefix">${_t("projects.disabledPrefix")}</span>
               <strong>${p.brand.toUpperCase()}</strong>
             </span>
           </div>`
        : "";
      const card = $(`
        <div class="project-card${p.hasKey ? " is-locked" : ""}${brandLocked ? " is-brand-locked" : ""}" data-id="${p.id}" data-categoria="${p.categoria}" data-brand="${p.brand}">
          <img src="${p.cover}" alt="${p.titulo}" loading="lazy">
          <div class="card-overlay"></div>
          ${lockBadge}
          <div class="project-info">
            <h3>${lockInline}${p.titulo}</h3>
            <p>${categoryLabel(p.categoria)}</p>
          </div>
          ${brandLockOverlay}
        </div>
      `);

      // El lock se evalúa en click-time: card bloqueada = toggle de tema del
      // sitio a su marca (no abre el proyecto); card activa = abrir detalle.
      card.on("click", () => {
        if (isBrandLocked(p)) {
          if (typeof window.applySiteTheme === "function") window.applySiteTheme(p.brand);
          return;
        }
        openProjectDetail(p);
      });

      $projectsGrid.append(card);
      allCards.push(card);
    });

    // Aplicar efecto pop con delays aleatorios
    applyPopEffect(allCards);
  }

  /* ===============================
     APLICAR EFECTO POP CON DELAYS ALEATORIOS
  =============================== */
  function applyPopEffect(cards) {
    // Generar delays aleatorios para cada tarjeta
    cards.forEach((card) => {
      // Delay aleatorio entre 0ms y 600ms (distribuido aleatoriamente, no en orden)
      const randomDelay = Math.random() * 600;

      setTimeout(() => {
        card.addClass("pop-in");
      }, randomDelay);
    });
  }

  /* ===============================
     ABRIR DETALLE DE PROYECTO (NIVEL 2)
  =============================== */
  function openProjectDetail(project) {
    currentProject = project;

    // Deslizar al panel 2 (detalle)
    $projectsModal.addClass("detail-active");

    if (project.hasKey) {
      $accessScreen.removeClass("hidden");
      $galleryScreen.addClass("hidden");
      $accessInput.val("").focus();
      $accessError.text("");
    } else {
      showGallery(project);
    }
  }

  /* ===============================
     FULLSCREEN PEEK CAROUSEL — Swiper.js
  =============================== */
  let swiperInstance = null;

  /* ===============================
     MOSTRAR GALERÍA
  =============================== */
  function showGallery(project) {
    $accessScreen.addClass("hidden");

    galleryImages = Array.isArray(project.images) && project.images.length
      ? project.images
      : [project.imagen];

    currentIndex = 0;

    // Insertar slides
    const $wrapper = $("#swiperWrapper");
    $wrapper.empty();
    galleryImages.forEach(src => {
      $wrapper.append(`<div class="swiper-slide"><img src="${src}" alt="Proyecto" draggable="false"></div>`);
    });

    $galleryScreen.removeClass("hidden hide").addClass("show");

    // Destruir instancia previa si existe
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    // Inicializar Swiper
    swiperInstance = new Swiper("#projectSwiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 0,       /* imágenes pegadas */
      grabCursor: true,
      loop: galleryImages.length > 2,
      speed: 650,
      navigation: {
        nextEl: "#projectNextBtn",
        prevEl: "#projectPrevBtn",
      },
      keyboard: { enabled: true, onlyInViewport: true },
    });
  }

  // Stub para compatibilidad con código existente
  function navigateCarousel() {}

  /* ===============================
     VALIDAR CÓDIGO DE ACCESO
  =============================== */
  $accessInput.on("input", function () {
    const value = $(this).val();

    if (value.length === 6) {
      // Código correcto simulado: "123456"
      // En producción, aquí iría la llamada AJAX
      if (value === "123456") {
        showGallery(currentProject);
      } else {
        $accessError.text(window.i18n ? window.i18n.t("projects.wrongCode") : "Código incorrecto");
        setTimeout(() => {
          $accessInput.val("");
          $accessError.text("");
        }, 2000);
      }
    }
  });

  // Swiper maneja navegación, arrows, touch y drag automáticamente.

  /* ===============================
     CERRAR MODALES
  =============================== */

  // Cerrar detalle — vuelve al grid (Panel 1) con slide suave
  function closeDetailModal() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    // Deslizar de vuelta al panel 1
    $projectsModal.removeClass("detail-active");

    // Resetear estado del detalle tras la transición
    setTimeout(() => {
      $accessScreen.addClass("hidden");
      $galleryScreen.removeClass("show hide").addClass("hidden");
      currentProject = null;
      if (gridStale) {
        gridStale = false;
        $(".project-card").removeClass("pop-in");
        renderProjects();
        syncBrandSwitch();
      }
    }, 600);
  }

  // Cerrar modal completo
  function closeProjectsModal() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    $projectsModal.addClass("closing");
    $(".proyectos-link").removeClass("nav-current");

    setTimeout(() => {
      $projectsModal.removeClass("active closing detail-active").addClass("hidden");
      $accessScreen.addClass("hidden");
      $galleryScreen.removeClass("show hide").addClass("hidden");
      $("body").css("overflow", "");
      currentProject = null;
    }, 500);
  }

  // Eventos de cierre
  $closeBtn.on("click", closeProjectsModal);
  $detailCloseBtn.on("click", closeDetailModal);

  // Exponer para cerrar Proyectos desde el logo / menú del header o footer
  window.closeProjectsModal = closeProjectsModal;
  window.isProjectsOpen = () => $projectsModal.hasClass("active");

  // Cerrar con ESC
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      if ($projectsModal.hasClass("detail-active")) {
        closeDetailModal();
      } else if ($projectsModal.hasClass("active")) {
        closeProjectsModal();
      }
    }
  });

  // Cerrar al hacer click fuera del contenido
  $projectsModal.on("click", function (e) {
    if ($(e.target).is($projectsModal)) {
      closeProjectsModal();
    }
  });

  // Re-renderizar cards al cambiar idioma
  document.addEventListener("langchange", function () {
    if ($projectsModal.hasClass("active") && !$projectsModal.hasClass("detail-active")) {
      renderFilters();
      renderProjects();
    }
  });

  // Detail modal solo se cierra con la X (no al hacer click fuera)

  /* ===============================
     RE-TEMATIZAR DESLIZANDO (sin cerrar)
     Cambia el tema del modal abierto y lo hace entrar deslizándose desde el
     lado nuevo: header (KOI) desde la izquierda, footer (KOA) desde la derecha.
  =============================== */
  window.slideProjectsToTheme = function (theme, source) {
    if (!$projectsModal.hasClass("active")) return;
    const el = $projectsModal[0];
    currentTheme = theme;
    currentSource = source;

    $projectsModal
      .removeClass("theme-dark theme-light from-header from-footer")
      .addClass(`theme-${theme}`)
      .addClass(source === "header" ? "from-header" : "from-footer");

    // Saltar (sin transición) al lado nuevo fuera de pantalla, re-render, luego deslizar a 0
    el.style.transition = "none";
    el.style.transform = source === "header" ? "translateX(-100%)" : "translateX(100%)";

    syncBrandSwitch();
    if (!$projectsModal.hasClass("detail-active")) {
      $(".project-card").removeClass("pop-in");
      renderProjects();
    } else {
      gridStale = true; // re-render diferido: los locks se actualizan al volver del detalle
    }

    void el.offsetWidth; // reflow: fija el estado aparcado
    requestAnimationFrame(() => {
      el.style.transition = "";
      el.style.transform = "";
    });
  };

});
