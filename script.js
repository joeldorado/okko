let diagonalLocked = false;

// === Rutas base-aware ===
// En producción el sitio vive bajo /okko/ (ver <base href>); en local el
// router acepta ambas formas. new URL resuelve contra la base en los dos casos.
const OKKO_BASE = new URL('.', document.baseURI).pathname;            // "/okko/"
const okkoPath = (name) => new URL(name, document.baseURI).pathname;  // "/okko/koi"

// === Limpiar URL al cargar/recargar la página ===
window.addEventListener('DOMContentLoaded', function() {
    // Si la URL tiene /koi o /koa, limpiarla y volver a la base
    const currentPath = window.location.pathname;
    if (currentPath === okkoPath('koi') || currentPath === okkoPath('koa') ||
        currentPath === '/koi' || currentPath === '/koa') {
        history.replaceState(null, '', OKKO_BASE);
    }
});

// === Alterna tema (negro/blanco) con persistencia ===
const bodyRoot = document.getElementById('bodyRoot');
let savedMode = localStorage.getItem('themeMode');
const logoKoi = document.getElementById("logoKoi");
const logoKoa = document.getElementById("logoKoa");

if (savedMode === 'dark') {
    logoKoi.src = "./images/logo.png";  // logo negro para fondo blanco
    logoKoa.src = "./images/logo.png";
} else {
    logoKoi.src = "./images/white-logo.png"; // logo blanco para fondo negro
    logoKoa.src = "./images/white-logo.png";
}

if (!savedMode) {
    savedMode = Math.random() < 0.5 ? 'dark' : 'light';
    localStorage.setItem('themeMode', savedMode);
} else {
    savedMode = savedMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', savedMode);
}

if (savedMode === 'light') {
    bodyRoot.classList.add('light');
    document.documentElement.style.setProperty('--bg-color', '#fff');
    document.documentElement.style.setProperty('--logo-color', '#000');
} else {
    document.documentElement.style.setProperty('--bg-color', '#000');
    document.documentElement.style.setProperty('--logo-color', '#fff');
}

// === Detectar posición del mouse (superior / inferior) ===
const stage = document.getElementById('stage');
const diagTop = document.querySelector('.diagonal-top');

stage.addEventListener('mousemove', (e) => {
    if (diagonalLocked || firstClickDone) return; // Deshabilitar hover después del primer click
    const rect = stage.getBoundingClientRect();
    const d = diagTop.getBoundingClientRect(); // diagonal ya transformada

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // La diagonal visual de tu clip-path va de:
    // punto A = (d.left, d.bottom)
    // punto B = (d.right, d.top)

    const x1 = d.left - rect.left;
    const y1 = d.bottom - rect.top;

    const x2 = d.right - rect.left;
    const y2 = d.top - rect.top;

    // Ecuación de la línea diagonal EXACTA en pantalla
    const diagonalY = y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);

    if (y < diagonalY) {
        stage.classList.add("top");
        stage.classList.remove("bottom");
    } else {
        stage.classList.add("bottom");
        stage.classList.remove("top");
    }
});

stage.addEventListener('mouseleave', () => {
    if (firstClickDone) return; // No hacer nada después del primer click
    stage.classList.remove('top', 'bottom');
    if (savedMode === 'light') {
        logoKoi.src = "./images/logo.png";  // logo negro para fondo blanco
        logoKoa.src = "./images/logo.png";
    } else {
        logoKoi.src = "./images/white-logo.png"; // logo blanco para fondo negro
        logoKoa.src = "./images/white-logo.png";
    }
});

// === Anclar labels KOA/KOI al logo de forma responsive ===
// Fracciones del cuadro del logo (.logo-pos). Ajusta SOLO estos valores para mover los labels.
// side: 'left' ancla por el borde izquierdo; 'right' ancla por el borde derecho (espejo).
const LABEL_ANCHORS = {
    labelTop:    { side: 'left',  xFrac: 0.16, yFrac: 0.58 }, // KOA: borde izq a 16% del logo
    labelBottom: { side: 'right', xFrac: 0.16, yFrac: 0.30 }, // KOI: borde der a 16% (espejo de KOA)
};

function positionDiagonalLabels() {
    const box = document.querySelector('.logo-pos');
    if (!box) return;                      // null-guard (labels removidos tras el click)
    const w = box.clientWidth;
    const h = box.clientHeight;
    if (!w || !h) return;
    for (const id in LABEL_ANCHORS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const a = LABEL_ANCHORS[id];
        if (a.side === 'right') {           // ancla por el borde derecho (espejo)
            el.style.right = (w * a.xFrac) + 'px';
            el.style.left  = 'auto';
        } else {                            // ancla por el borde izquierdo
            el.style.left  = (w * a.xFrac) + 'px';
            el.style.right = 'auto';
        }
        el.style.top = (h * a.yFrac) + 'px';
    }
}

// rAF-debounced para resize/orientation
let _labelRaf = 0;
function scheduleLabelReposition() {
    if (_labelRaf) cancelAnimationFrame(_labelRaf);
    _labelRaf = requestAnimationFrame(positionDiagonalLabels);
}

window.addEventListener('load', positionDiagonalLabels);
window.addEventListener('resize', scheduleLabelReposition);
window.addEventListener('orientationchange', scheduleLabelReposition);
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionDiagonalLabels); // el ancho del texto depende de Gotham
}

stage.addEventListener('mousemove', (e) => {
    if (firstClickDone) return; // Deshabilitar hover de logo después del primer click
    const rect = stage.getBoundingClientRect();
    const mid = rect.height / 2;

    if (e.clientY < mid) {
        // diagonal-top (fondo blanco)
        logoKoi.src = "./images/koi-logo.png";
        logoKoa.src = "./images/koi-logo.png";
    } else {
        // diagonal-bottom (fondo negro)
        logoKoi.src = "./images/koi-logo.png";
        logoKoa.src = "./images/koi-logo.png";
    }
});

function animateTitle() {
    const title = document.querySelector('.okko-title');
    if (!title || !title.dataset || !title.dataset.text) {
        console.warn('Title element or data-text attribute not found');
        return;
    }
    const text = title.dataset.text;

    // borrar cualquier contenido previo
    title.innerHTML = "";

    // crear un span por cada letra
    [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.transitionDelay = (i * 0.20) + "s"; // velocidad letra
        title.appendChild(span);
    });

    // disparar animación ya montados
    requestAnimationFrame(() => {
        title.querySelectorAll("span").forEach(span => {
            span.style.opacity = 1;
            span.style.transform = "translateY(0)";
        });
    });
}

// ejecutar al cargar
window.addEventListener("load", animateTitle);

// === Slider de imágenes ===
function startSlider(containerId, interval = 4000) {
    const container = document.getElementById(containerId);
    const slides = container.querySelectorAll(".slide-img");
    let index = 0;

    slides[index].classList.add("active");

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, interval);
}

// Iniciar sliders - DESACTIVADO: Ahora se usa animación CSS automática
// startSlider("koaSlides");
// startSlider("koiSlides");

// === Click en diagonales (click inicial) ===
$(document).on('click', '#top', function () {
    if (!firstClickDone) {
        selectDiagonal("top");
    }
});

$(document).on('click', '#bottom', function () {
    if (!firstClickDone) {
        selectDiagonal("bottom");
    }
});

function selectDiagonal(side) {
    const top = document.getElementById("top");
    const bottom = document.getElementById("bottom");
    const overlayTop = document.getElementById("overlayTop");
    const overlayBottom = document.getElementById("overlayBottom");
    const logoWrap = document.querySelector(".logo-wrap");
    const okkoTitle = document.querySelector(".okko-title");
    const labelTop = document.getElementById("labelTop");
    const labelBottom = document.getElementById("labelBottom");
    const koiSlides = document.getElementById('koiSlides');
    const koaSlides = document.getElementById('koaSlides');

    // Marcar que ya se hizo el primer click
    firstClickDone = true;

    // Cambiar URL del navegador según el proyecto seleccionado (base-aware)
    if (side === "top") {
        history.pushState({ project: 'koi' }, '', okkoPath('koi'));
    } else {
        history.pushState({ project: 'koa' }, '', okkoPath('koa'));
    }

    // Apagar interacciones
    top.style.pointerEvents = "none";
    bottom.style.pointerEvents = "none";

    // Asegurar que ambos slides tengan display block
    koiSlides.style.display = 'block';
    koaSlides.style.display = 'block';

    // DESACTIVADO: Las imágenes ahora se animan automáticamente con CSS
    // const koiImages = koiSlides.querySelectorAll('.slide-img');
    // if (koiImages.length > 0 && !Array.from(koiImages).some(img => img.classList.contains('active'))) {
    //     koiImages[0].classList.add('active');
    // }

    // const koaImages = koaSlides.querySelectorAll('.slide-img');
    // if (koaImages.length > 0 && !Array.from(koaImages).some(img => img.classList.contains('active'))) {
    //     koaImages[0].classList.add('active');
    // }

    // Timeline de GSAP para sincronizar todo
    const tl = gsap.timeline();

    if (side === "top") {
        // Click en diagonal-top → primero desaparece KOA (rápido), luego KOI (lento)

        // Sincronizar animaciones con transiciones suaves y elegantes
        // KOA desaparece primero (parte bottom-right)
        tl.to(logoKoa, {
            duration: 0.8,
            autoAlpha: 0,
            scale: 0.95,
            ease: "power2.in"
        }, 0)
        // KOI desaparece después más lento (parte top-left)
        .to(logoKoi, {
            duration: 1.8,
            autoAlpha: 0,
            scale: 0.90,
            ease: "power3.inOut"
        }, 0.5)
        .to([okkoTitle, labelTop, labelBottom], {
            duration: 1.0,
            autoAlpha: 0,
            y: -40,
            ease: "power3.out"
        }, 0.1)
        .to(bottom, {
            duration: 1.8,
            autoAlpha: 0,
            ease: "power3.inOut"
        }, 0)
        .to(top, {
            duration: 2.4,
            scale: 1.05,
            ease: "power4.out"
        }, 0.4)
        .add(() => {
            top.classList.add("expand", "active");
            bottom.classList.add("inactive");
        }, 0.4)
        .add(() => {
            // Mostrar el overlay de la diagonal bottom
            gsap.set(overlayBottom, {
                opacity: 1
            });
        }, 0.2)
        .to(overlayBottom, {
            duration: 2.8,
            clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)",
            ease: "power4.inOut",
            onComplete: () => {
                overlayBottom.style.opacity = 0;
            }
        }, 0.2)
        .add(() => {
            // Eliminar solo componentes innecesarios, NO las diagonales
            logoWrap.remove();
            okkoTitle.remove();
            labelTop.remove();
            labelBottom.remove();
            overlayBottom.remove();
            document.querySelector(".overlay").remove();
        }, 2.5);

        // Color claro (blanco)
        localStorage.setItem('themeMode', 'light');

        // Mostrar header y footer después de la animación
        setTimeout(() => {
            showHeaderFooter();
            updateHeaderFooterTheme('koi');
        }, 1800);

    } else {
        // Click en diagonal-bottom → primero desaparece KOI (rápido), luego KOA (lento)

        // Sincronizar animaciones con transiciones suaves y elegantes
        // KOI desaparece primero (parte top-left)
        tl.to(logoKoi, {
            duration: 0.8,
            autoAlpha: 0,
            scale: 0.95,
            ease: "power2.in"
        }, 0)
        // KOA desaparece después más lento (parte bottom-right)
        .to(logoKoa, {
            duration: 1.8,
            autoAlpha: 0,
            scale: 0.90,
            ease: "power3.inOut"
        }, 0.5)
        .to([okkoTitle, labelTop, labelBottom], {
            duration: 1.0,
            autoAlpha: 0,
            y: 40,
            ease: "power3.out"
        }, 0.1)
        .to(top, {
            duration: 1.8,
            autoAlpha: 0,
            ease: "power3.inOut"
        }, 0)
        .to(bottom, {
            duration: 2.4,
            scale: 1.05,
            ease: "power4.out"
        }, 0.4)
        .add(() => {
            bottom.classList.add("expand", "active");
            top.classList.add("inactive");
        }, 0.4)
        .add(() => {
            // Mostrar el overlay de la diagonal top
            gsap.set(overlayTop, {
                opacity: 1
            });
        }, 0.2)
        .to(overlayTop, {
            duration: 2.8,
            clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)",
            ease: "power4.inOut",
            onComplete: () => {
                overlayTop.style.opacity = 0;
            }
        }, 0.2)
        .add(() => {
            // Eliminar solo componentes innecesarios, NO las diagonales
            logoWrap.remove();
            okkoTitle.remove();
            labelTop.remove();
            labelBottom.remove();
            overlayTop.remove();
            document.querySelector(".overlay").remove();
        }, 2.5);

        // Color oscuro (negro)
        localStorage.setItem('themeMode', 'dark');

        // Mostrar header y footer después de la animación
        setTimeout(() => {
            showHeaderFooter();
            updateHeaderFooterTheme('koa');
        }, 1800);
    }
}


// ============================================
// HEADER & FOOTER MANAGEMENT
// ============================================

const mainHeader = document.getElementById('mainHeader');
const mainFooter = document.getElementById('mainFooter');
const headerLogoImg = document.querySelector('.header-logo-img');
const footerNav = document.getElementById('footerNav');

// Función para actualizar el tema del header y footer
function updateHeaderFooterTheme(theme) {

    // Remover clases previas
    mainHeader.classList.remove('theme-koi', 'theme-koa');
    mainFooter.classList.remove('theme-koi', 'theme-koa');

    if (theme === 'koi') {
        // Tema KOI (blanco)
        // Header: fondo blanco, opacity 1, muestra textos con logo negro
        mainHeader.classList.add('theme-koi');
        headerLogoImg.src = './images/logo.png';

        // Footer: fondo negro, opacity 0.5, esconde textos, solo logo blanco
        mainFooter.classList.add('theme-koi');

    } else if (theme === 'koa') {
        // Tema KOA (negro)
        // Header: fondo blanco, opacity 0.5, esconde textos, solo logo negro
        mainHeader.classList.add('theme-koa');
        headerLogoImg.src = './images/logo.png';

        // Footer: fondo negro, opacity 1, muestra textos con logo blanco
        mainFooter.classList.add('theme-koa');
    }
}

// Mostrar header y footer cuando inicie la animación grayscale
function showHeaderFooter() {
    mainHeader.classList.add('show');
    mainFooter.classList.add('show');
}

// Función para cambiar tema con animación smooth
function toggleTheme() {
    const currentTheme = mainHeader.classList.contains('theme-koi') ? 'koi' : 'koa';
    const newTheme = currentTheme === 'koi' ? 'koa' : 'koi';

    // Aplicar el nuevo tema con transición suave
    updateHeaderFooterTheme(newTheme);
}

// Variable para saber si ya se hizo el primer click
let firstClickDone = false;

// === Transición de tema: cover slide direccional (sin destello) ===
const okkoReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Al terminar la reveal (5s), fijar el estado estable a color con .reveal-done.
// Sin esto el fill-mode "forwards" retiene el filter animado y bloquea .hero-dim,
// y la reveal se re-dispararía en cada cambio de tema.
['top', 'bottom'].forEach(id => {
    const diagonal = document.getElementById(id);
    if (diagonal) {
        diagonal.addEventListener('animationend', (e) => {
            if (e.animationName === 'diagonalReveal') {
                diagonal.classList.add('reveal-done');
            }
        });
    }
});

let okkoPendingThemeFinalize = null; // guard para clicks rápidos / popstate
let okkoThemeTween = null;           // referencia al tween en vuelo para matarlo directo

// direction: 'left' = entra desde la izquierda (KOI), 'right' = desde la derecha (KOA)
// El entrante se desliza ENCIMA del saliente, que queda quieto hasta ser cubierto.
// Se tweenea la variable CSS --slideX porque el transform de .diagonal.expand
// lleva !important y GSAP no puede pisarlo con transform inline.
function okkoThemeSlide(incoming, outgoing, direction) {
    const startX = direction === 'left' ? '-100vw' : '100vw';

    const finalize = () => {
        okkoPendingThemeFinalize = null;
        okkoThemeTween = null;
        // Saliente: ya cubierto. display:block para que su ciclo de imágenes siga corriendo.
        outgoing.classList.remove('expand', 'active', 'theme-sliding', 'theme-incoming');
        outgoing.classList.add('inactive');
        outgoing.setAttribute('style', 'display: block !important; opacity: 0 !important; visibility: hidden !important;');
        incoming.style.setProperty('--slideX', '0vw');
    };

    if (okkoReducedMotion) { finalize(); return; }

    gsap.set(incoming, { '--slideX': startX });
    okkoPendingThemeFinalize = finalize;
    okkoThemeTween = gsap.to(incoming, {
        '--slideX': '0vw',
        duration: 0.9,
        ease: 'power3.out',
        // Solo finaliza si este slide sigue siendo el vigente — un onComplete
        // rezagado de un slide ya reemplazado no debe tocar el estado.
        onComplete: () => { if (okkoPendingThemeFinalize === finalize) finalize(); }
    });
}

// Función para mostrar slides con animación (solo para clicks en header/footer DESPUÉS del primer click)
function showSlides(slideType) {
    const koiSlides = document.getElementById('koiSlides');
    const koaSlides = document.getElementById('koaSlides');
    const top = document.getElementById("top");
    const bottom = document.getElementById("bottom");

    // Si hay un slide en vuelo, matarlo y saltarlo a su estado final primero
    if (okkoThemeTween) { okkoThemeTween.kill(); okkoThemeTween = null; }
    if (okkoPendingThemeFinalize) okkoPendingThemeFinalize();
    gsap.killTweensOf([top, bottom, koiSlides, koaSlides]);

    const incoming = slideType === 'koi' ? top : bottom;
    const outgoing = slideType === 'koi' ? bottom : top;
    const direction = slideType === 'koi' ? 'left' : 'right';

    // Limpiar clases del slide anterior en ambos lados
    top.classList.remove('theme-sliding', 'theme-incoming');
    bottom.classList.remove('theme-sliding', 'theme-incoming');

    // SALIENTE: no tocar — sigue expand/active/visible en z-index 1 hasta finalize().

    // ENTRANTE: fullscreen, visible, encima, aparcado fuera de pantalla vía --slideX
    incoming.classList.remove('inactive');
    // reveal-done: la reveal de 5s es solo para la entrada desde el landing,
    // no debe re-correr (con flash gris) en cada cambio de tema.
    incoming.classList.add('expand', 'active', 'theme-sliding', 'theme-incoming', 'reveal-done');
    incoming.setAttribute('style', 'display: block !important; opacity: 1 !important; visibility: visible !important; filter: none !important;');

    // Ambos slide containers quedan display:block tras el primer reveal → los ciclos
    // de imágenes nunca se reinician y el lado entrante siempre está pintado.
    koiSlides.setAttribute('style', 'display: block !important;');
    koaSlides.setAttribute('style', 'display: block !important;');

    okkoThemeSlide(incoming, outgoing, direction);

    // Reafirmar el estado de blur del hero (el setAttribute de arriba lo pisa)
    updateHeroDim();
}

// Re-tematizar el modal Proyectos deslizando (sin cerrar) cuando esté abierto
// y en el lado contrario al tema. Los locks de las cards siguen al tema.
function syncProjectsModalTheme(brand) {
    const isKoi = brand === 'koi';
    const modal = document.getElementById('projectsModal');
    if (modal && modal.classList.contains('active') &&
        !modal.classList.contains(isKoi ? 'from-header' : 'from-footer') &&
        typeof window.slideProjectsToTheme === 'function') {
        window.slideProjectsToTheme(isKoi ? 'light' : 'dark', isKoi ? 'header' : 'footer');
    }
}

// Pipeline única de cambio de tema del sitio — compartida por header, footer,
// cards bloqueadas y el switch de marca del modal Proyectos.
// brand: 'koi' (claro) | 'koa' (oscuro)
window.applySiteTheme = function (brand) {
    const isKoi = brand === 'koi';
    const activeEl = isKoi ? mainHeader : mainFooter;
    const otherEl = isKoi ? mainFooter : mainHeader;

    // Cambiar solo si NO está ya activo
    const alreadyActive = activeEl.classList.contains(isKoi ? 'theme-koi' : 'theme-koa') &&
        parseFloat(window.getComputedStyle(activeEl).opacity) >= 0.9;

    if (!alreadyActive) {
        // Animar transición de header y footer
        gsap.to(activeEl, {
            duration: 0.6,
            opacity: 1,
            ease: "power2.inOut"
        });
        gsap.to(otherEl, {
            duration: 0.6,
            opacity: 0.8,
            ease: "power2.inOut"
        });

        // Cambiar tema de header y footer
        updateHeaderFooterTheme(brand);
        // Mostrar slides con animación direccional
        showSlides(brand);
        // Actualizar localStorage
        localStorage.setItem('themeMode', isKoi ? 'light' : 'dark');
        // Actualizar URL (base-aware)
        history.pushState({ project: brand }, '', okkoPath(brand));
    }

    syncProjectsModalTheme(brand);
};

// Click en header para cambiar tema y slider
mainHeader.addEventListener('click', function(e) {
    // Si se hace click en un link del menú, no cambiar tema aquí
    if (!e.target.closest('a')) {
        window.applySiteTheme('koi');
    }
});

// Click en footer para cambiar tema y slider
mainFooter.addEventListener('click', function(e) {
    // Si se hace click en un link del menú, no cambiar tema aquí
    if (!e.target.closest('a')) {
        window.applySiteTheme('koa');
    }
});

// Click en items del menú (header y footer)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Cerrar Proyectos si está abierto (al navegar a otra sección)
        const openModal = document.getElementById('projectsModal');
        if (openModal && openModal.classList.contains('active') && !this.classList.contains('proyectos-link')) {
            if (window.closeProjectsModal) {
                window.closeProjectsModal();
            } else {
                openModal.classList.remove('active');
                openModal.classList.add('hidden');
            }
            document.body.style.overflow = '';
        }

        // Ignorar los links de "Nosotros" (manejados por el modal)
        if (this.id === 'koiAbout' || this.id === 'koaAbout') {
            return;
        }

        e.preventDefault();
        const href = this.getAttribute('href');

        // NO cambiar tema al hacer click en links del menú
        // Solo navegar sin cambiar el tema

        // Si es un hash (#nosotros, #contactos), hacer scroll
        if (href && href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (href && !href.startsWith('#')) {
            // Si es una URL, navegar
            window.location.href = href;
        }
    });
});

// Manejar el botón "atrás" del navegador
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.project) {
        // Si hay un estado guardado, mostrar el proyecto correspondiente
        const brand = event.state.project;
        if (brand === 'koi' || brand === 'koa') {
            showSlides(brand);
            updateHeaderFooterTheme(brand);
            localStorage.setItem('themeMode', brand === 'koi' ? 'light' : 'dark');
            syncProjectsModalTheme(brand);
        }
    } else {
        // Si no hay estado (volvió a la página inicial), recargar en la base
        window.location.href = OKKO_BASE;
    }
});

// === Blur en header/footer opuesto al activo cuando proyectos está abierto ===
const projectsModal = document.getElementById('projectsModal');

if (projectsModal) {
    const observer = new MutationObserver(() => {
        const isOpen = projectsModal.classList.contains('active');

        mainHeader.classList.remove('modal-blur');
        mainFooter.classList.remove('modal-blur');

        if (isOpen) {
            setTimeout(() => {
                const koiActive = mainHeader.classList.contains('theme-koi');
                if (koiActive) {
                    mainFooter.classList.add('modal-blur');
                } else {
                    mainHeader.classList.add('modal-blur');
                }
            }, 100);
        }
    });

    observer.observe(projectsModal, { attributes: true, attributeFilter: ['class'] });
}

// === Hero: difuminar SOLO cuando hay contenido abierto ===
// Limpio = color HD nítido; con Contacto/Nosotros/Proyectos abierto se atenúa.
function isContentOpen() {
    const projects = document.getElementById('projectsModal');
    const contact = document.getElementById('contactOverlay');
    const about = document.getElementById('aboutOverlay');
    return !!((projects && projects.classList.contains('active')) ||
              (contact && contact.classList.contains('is-active')) ||
              (about && about.classList.contains('is-active')));
}

function updateHeroDim() {
    const dim = isContentOpen();
    document.querySelectorAll('.diagonal.expand').forEach(diagonal => {
        if (dim) {
            // reveal-done corta la reveal si sigue corriendo (fill-mode retendría el filter)
            diagonal.classList.add('reveal-done', 'hero-dim');
            // Inline con !important: showSlides fija "filter: none !important" inline
            // en cada cambio de tema y pisaría la clase.
            diagonal.style.setProperty('filter', 'blur(6px) brightness(0.7)', 'important');
        } else {
            diagonal.classList.remove('hero-dim');
            diagonal.style.removeProperty('filter');
        }
    });
}

['projectsModal', 'contactOverlay', 'aboutOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        new MutationObserver(updateHeroDim)
            .observe(el, { attributes: true, attributeFilter: ['class'] });
    }
});

// El control de sonido vive en el toggle simple de index.html (#musicHeader / #musicFooter).

