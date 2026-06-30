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

  /* ===============================
     DETECCIÓN WEBP
  =============================== */
  const webpSupported = (() => {
    const c = document.createElement("canvas");
    return (c.getContext && c.getContext("2d"))
      ? c.toDataURL("image/webp").indexOf("data:image/webp") === 0
      : false;
  })();

  // Convierte .jpg → .webp si el browser lo soporta
  function wp(path) {
    return webpSupported ? path.replace(/\.jpg$/i, ".webp") : path;
  }

  /* ===============================
     DATOS DE PROYECTOS (25 PROYECTOS)
  =============================== */

  // Thumbnails 300px — para preview en cards del grid
  const thumbPool = [
    "./images/slides/KOI/thumb/_MG_0582-2.jpg",
    "./images/slides/KOI/thumb/_MG_0623.jpg",
    "./images/slides/KOI/thumb/7.jpg",
    "./images/slides/KOI/thumb/Escena_9.jpg",
    "./images/slides/KOI/thumb/Jardin.jpg",
    "./images/slides/KOI/thumb/JORGE_TORRES_BRIARA_FACHADA_HD.jpg",
    "./images/slides/KOI/thumb/JORGE_TORRES_BRIARA_ROOF_HD.jpg",
    "./images/slides/KOI/thumb/JORGE_TORRES_BRIARA_SALA_COMEDOR_HD.jpg",
    "./images/slides/KOI/thumb/M1_Recamara.jpg",
    "./images/slides/KOI/thumb/TF1_1500.jpg",
    "./images/slides/KOI/thumb/Trasera.jpg",
    "./images/slides/KOA/thumb/_MG_0490.jpg",
    "./images/slides/KOA/thumb/_MG_0571.jpg",
    "./images/slides/KOA/thumb/Alberca.jpg",
    "./images/slides/KOA/thumb/Escena_7.jpg",
    "./images/slides/KOA/thumb/Fachada_Trasera.jpg",
    "./images/slides/KOA/thumb/H1.jpg",
    "./images/slides/KOA/thumb/H16.jpg",
    "./images/slides/KOA/thumb/Interior_mod_1.jpg",
    "./images/slides/KOA/thumb/JORGE_TORRES_BRIARA_RECAMARA_BANO_HD.jpg",
    "./images/slides/KOA/thumb/JT_BRI_SC_HD.jpg",
  ];

  // Large 1600px — para galería fullscreen
  const lgPool = [
    "./images/slides/KOI/lg/_MG_0582-2.jpg",
    "./images/slides/KOI/lg/_MG_0623.jpg",
    "./images/slides/KOI/lg/7.jpg",
    "./images/slides/KOI/lg/Escena_9.jpg",
    "./images/slides/KOI/lg/Jardin.jpg",
    "./images/slides/KOI/lg/JORGE_TORRES_BRIARA_FACHADA_HD.jpg",
    "./images/slides/KOI/lg/JORGE_TORRES_BRIARA_ROOF_HD.jpg",
    "./images/slides/KOI/lg/JORGE_TORRES_BRIARA_SALA_COMEDOR_HD.jpg",
    "./images/slides/KOI/lg/M1_Recamara.jpg",
    "./images/slides/KOI/lg/TF1_1500.jpg",
    "./images/slides/KOI/lg/Trasera.jpg",
    "./images/slides/KOA/lg/_MG_0490.jpg",
    "./images/slides/KOA/lg/_MG_0571.jpg",
    "./images/slides/KOA/lg/Alberca.jpg",
    "./images/slides/KOA/lg/Escena_7.jpg",
    "./images/slides/KOA/lg/Fachada_Trasera.jpg",
    "./images/slides/KOA/lg/H1.jpg",
    "./images/slides/KOA/lg/H16.jpg",
    "./images/slides/KOA/lg/Interior_mod_1.jpg",
    "./images/slides/KOA/lg/JORGE_TORRES_BRIARA_RECAMARA_BANO_HD.jpg",
    "./images/slides/KOA/lg/JT_BRI_SC_HD.jpg",
  ];

  // Generar 25 proyectos mezclados
  const proyectos = [];
  const empresas = ["KOA", "KOI"];

  for (let i = 1; i <= 25; i++) {
    const empresa = empresas[Math.floor(Math.random() * empresas.length)];
    const hasKey = Math.random() < 0.3;

    // Thumbnail para card (pequeño, rápido)
    const img = wp(thumbPool[Math.floor(Math.random() * thumbPool.length)]);

    // Galería de 3-5 imágenes en alta resolución
    const gallerySize = Math.floor(Math.random() * 3) + 3;
    const gallerySet = Array.from({ length: gallerySize }, () =>
      wp(lgPool[Math.floor(Math.random() * lgPool.length)])
    );

    proyectos.push({
      id: i,
      empresa: empresa,
      titulo: `Proyecto ${empresa} ${i}`,
      subtitulo: empresa === "KOA" ? "Diseño Funcional" : "Arquitectura Contemporánea",
      hasKey: hasKey,
      imagen: img,
      images: gallerySet,
      descripcion: `Este es un proyecto destacado de ${empresa}.`
    });
  }

  /* ===============================
     SHUFFLE ARRAY (Fisher-Yates)
  =============================== */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /* ===============================
     FUNCIÓN PARA ABRIR MODAL DE PROYECTOS
  =============================== */
  window.openProjectsModal = function (theme, source) {
    currentTheme = theme || "dark";
    currentSource = source || "";

    // Aplicar tema al modal
    $projectsModal.removeClass("theme-dark theme-light from-header from-footer")
      .addClass(`theme-${currentTheme}`);

    // Aplicar clase según el origen (header o footer)
    if (source === "header") {
      $projectsModal.addClass("from-header");
    } else if (source === "footer") {
      $projectsModal.addClass("from-footer");
    }

    // Mostrar modal
    $projectsModal.removeClass("hidden").addClass("active");

    // Ocultar galería individual, mostrar grid
    $accessScreen.addClass("hidden");
    $galleryScreen.addClass("hidden");

    // Reordenar cards aleatoriamente cada vez que se abre
    shuffleArray(proyectos);

    // Renderizar proyectos
    renderProjects();

    // Bloquear scroll del body
    $("body").css("overflow", "hidden");
  };

  /* ===============================
     RENDERIZAR GRID DE PROYECTOS
  =============================== */
  function renderProjects() {
    console.log("renderProjects called with theme:", currentTheme);
    $projectsGrid.empty();

    // Array para almacenar todas las tarjetas y aplicar delays aleatorios
    const allCards = [];

    // Renderizar los 25 proyectos
    const _t = (window.i18n && window.i18n.t) ? window.i18n.t.bind(window.i18n) : (k) => k;

    let activeCount = 0;
    proyectos.forEach((p) => {
      // Determinar si el proyecto está activo según el tema
      const isActive =
        (currentTheme === "dark" && p.empresa === "KOA") ||
        (currentTheme === "light" && p.empresa === "KOI");

      if (isActive) activeCount++;

      const cardPrefix      = _t("projects.cardPrefix");
      const cardSubtitulo   = _t(`projects.cardSub${p.empresa}`);
      const disabledLabel   = `${_t("projects.disabledPrefix")} ${p.empresa}`;
      const cardTitulo      = `${cardPrefix} ${p.empresa} ${p.id}`;

      const card = $(`
        <div class="project-card ${isActive ? "" : "disabled"}"
             data-id="${p.id}"
             data-empresa="${p.empresa}"
             data-empresa-disabled="${disabledLabel}">
          <img src="${p.imagen}" alt="${cardTitulo}">
          <div class="card-overlay"></div>
          <div class="project-info">
            <h3>${cardTitulo}</h3>
            <p>${cardSubtitulo}</p>
          </div>
          ${p.hasKey ? '<i class="fa-solid fa-key key-icon"></i>' : ""}
        </div>
      `);

      // Event handlers para tarjetas activas y disabled
      if (isActive) {
        // Tarjetas activas abren el detalle directamente
        card.on("click", () => {
          console.log("Card clicked:", p.titulo, p.id);
          openProjectDetail(p);
        });
      } else {
        // Tarjetas disabled cambian el tema y luego abren el detalle
        card.on("click", () => {
          console.log("Disabled card clicked:", p.titulo, p.id, p.empresa);
          handleDisabledCardClick(p);
        });
      }

      $projectsGrid.append(card);
      allCards.push(card);
    });

    console.log(`Rendered ${activeCount} active projects out of ${proyectos.length} total`);

    // Agregar 5 placeholders para completar el grid (2 filas de 10 + 1 de 5)
    // for (let i = 0; i < 5; i++) {
    //   const placeholder = $(`
    //     <div class="project-placeholder theme-${currentTheme}"></div>
    //   `);
    //   $projectsGrid.append(placeholder);
    // }

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
     MANEJAR CLICK EN TARJETA DISABLED
  =============================== */
  function handleDisabledCardClick(project) {
    // Determinar el nuevo tema basado en la empresa del proyecto
    const newTheme = project.empresa === "KOI" ? "light" : "dark";
    const newThemeName = project.empresa === "KOI" ? "koi" : "koa";

    console.log(`Cambiando tema de ${currentTheme} a ${newTheme} para proyecto ${project.titulo}`);

    // Animar opacidad del modal mientras cambia el tema
    const projectsModal = document.getElementById('projectsModal');

    const modalsToAnimate = [];
    if (projectsModal && projectsModal.classList.contains('active')) {
      modalsToAnimate.push(projectsModal);
    }

    // Animar opacidad de los modales
    modalsToAnimate.forEach(modal => {
      gsap.to(modal, {
        duration: 0.6,
        opacity: 0.8,
        ease: "power2.inOut"
      });
    });

    // Cambiar tema global (header, footer, diagonales)
    if (typeof updateHeaderFooterTheme === 'function') {
      updateHeaderFooterTheme(newThemeName);
    }
    if (typeof showSlides === 'function') {
      showSlides(newThemeName);
    }
    localStorage.setItem('themeMode', newTheme);

    // Animar header y footer
    const mainHeader = document.getElementById('mainHeader');
    const mainFooter = document.getElementById('mainFooter');

    if (newThemeName === 'koi') {
      gsap.to(mainHeader, { duration: 0.6, opacity: 1, ease: "power2.inOut" });
      gsap.to(mainFooter, { duration: 0.6, opacity: 0.5, ease: "power2.inOut" });
    } else {
      gsap.to(mainFooter, { duration: 0.6, opacity: 1, ease: "power2.inOut" });
      gsap.to(mainHeader, { duration: 0.6, opacity: 0.5, ease: "power2.inOut" });
    }

    // Actualizar el tema del modal de proyectos (esto re-renderiza las tarjetas con animación)
    setTimeout(() => {
      window.updateProjectsTheme(newTheme);

      // Restaurar opacidad
      modalsToAnimate.forEach(modal => {
        gsap.to(modal, {
          duration: 0.6,
          opacity: 1,
          ease: "power2.inOut"
        });
      });

      // Solo cambiar tema y re-renderizar, NO abrir el detalle
    }, 600);
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
    }, 600);
  }

  // Cerrar modal completo
  function closeProjectsModal() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    $projectsModal.addClass("closing");

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
      renderProjects();
    }
  });

  // Detail modal solo se cierra con la X (no al hacer click fuera)

  /* ===============================
     ACTUALIZAR TEMA DESDE EXTERIOR
  =============================== */
  window.updateProjectsTheme = function (theme) {
    currentTheme = theme;

    // Quitar from-header/from-footer para que el color del nuevo tema tome efecto
    $projectsModal
      .removeClass("theme-dark theme-light from-header from-footer")
      .addClass(`theme-${currentTheme}`);

    if ($projectsModal.hasClass("active") && !$projectsModal.hasClass("detail-active")) {
      $(".project-card").removeClass("pop-in");
      renderProjects();
    }
  };

});
