let diagonalLocked = false;

// === Limpiar URL al cargar/recargar la página ===
window.addEventListener('DOMContentLoaded', function() {
    // Si la URL tiene /koi o /koa, limpiarla y volver a /
    const currentPath = window.location.pathname;
    if (currentPath === '/koi' || currentPath === '/koa') {
        history.replaceState(null, '', '/');
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

    // Cambiar URL del navegador según el proyecto seleccionado
    if (side === "top") {
        // KOI - cambiar URL a /koi
        history.pushState({ project: 'koi' }, '', '/koi');
    } else {
        // KOA - cambiar URL a /koa
        history.pushState({ project: 'koa' }, '', '/koa');
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
            // Remover la animación del keyframe para que GSAP tome control
            top.style.animation = "none";
        }, 1.6)
        .to(top, {
            duration: 3.0,
            filter: "grayscale(0%) brightness(1)",
            ease: "power2.inOut"
        }, 1.8)
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
            // Remover la animación del keyframe para que GSAP tome control
            bottom.style.animation = "none";
        }, 1.6)
        .to(bottom, {
            duration: 3.0,
            filter: "grayscale(0%) brightness(1)",
            ease: "power2.inOut"
        }, 1.8)
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

// Función para mostrar slides con animación (solo para clicks en header/footer DESPUÉS del primer click)
function showSlides(slideType) {
    const koiSlides = document.getElementById('koiSlides');
    const koaSlides = document.getElementById('koaSlides');
    const top = document.getElementById("top");
    const bottom = document.getElementById("bottom");

    // Matar TODAS las animaciones de GSAP
    gsap.killTweensOf([top, bottom, koiSlides, koaSlides]);

    if (slideType === 'koi') {
        // FORZAR reset removiendo atributo style completamente
        top.removeAttribute('style');
        bottom.removeAttribute('style');
        koiSlides.removeAttribute('style');
        koaSlides.removeAttribute('style');

        // Asegurar que top tenga la clase expand para ocupar toda la pantalla
        top.classList.add('expand', 'active');
        bottom.classList.remove('expand', 'active');
        bottom.classList.add('inactive');

        // Aplicar estados necesarios manualmente SIN GSAP
        top.setAttribute('style', 'display: block !important; opacity: 1 !important; visibility: visible !important; filter: none !important;');
        bottom.setAttribute('style', 'display: block !important; opacity: 0 !important; visibility: hidden !important;');
        koiSlides.setAttribute('style', 'display: block !important;');
        koaSlides.setAttribute('style', 'display: none !important;');

        // DESACTIVADO: Las imágenes ahora se animan automáticamente con CSS
        // const koiImages = koiSlides.querySelectorAll('.slide-img');
        // const hasActive = Array.from(koiImages).some(img => img.classList.contains('active'));
        // if (!hasActive && koiImages.length > 0) {
        //     koiImages[0].classList.add('active');
        // }

        // SOLO animar el slide container, NO las diagonales
        setTimeout(() => {
            gsap.fromTo(koiSlides,
                { y: -100, opacity: 0 },
                { duration: 1.2, y: 0, opacity: 1, ease: "power3.out" }
            );
        }, 50);

    } else if (slideType === 'koa') {
        // FORZAR reset removiendo atributo style completamente
        top.removeAttribute('style');
        bottom.removeAttribute('style');
        koiSlides.removeAttribute('style');
        koaSlides.removeAttribute('style');

        // Asegurar que bottom tenga la clase expand para ocupar toda la pantalla
        bottom.classList.add('expand', 'active');
        top.classList.remove('expand', 'active');
        top.classList.add('inactive');

        // Aplicar estados necesarios manualmente SIN GSAP
        bottom.setAttribute('style', 'display: block !important; opacity: 1 !important; visibility: visible !important; filter: none !important;');
        top.setAttribute('style', 'display: block !important; opacity: 0 !important; visibility: hidden !important;');
        koaSlides.setAttribute('style', 'display: block !important;');
        koiSlides.setAttribute('style', 'display: none !important;');

        // DESACTIVADO: Las imágenes ahora se animan automáticamente con CSS
        // const koaImages = koaSlides.querySelectorAll('.slide-img');
        // const hasActive = Array.from(koaImages).some(img => img.classList.contains('active'));
        // if (!hasActive && koaImages.length > 0) {
        //     koaImages[0].classList.add('active');
        // }

        // SOLO animar el slide container, NO las diagonales
        setTimeout(() => {
            gsap.fromTo(koaSlides,
                { y: 100, opacity: 0 },
                { duration: 1.2, y: 0, opacity: 1, ease: "power3.out" }
            );
        }, 50);
    }
}

// Click en header para cambiar tema y slider
mainHeader.addEventListener('click', function(e) {
    // Si se hace click en un link del menú, no cambiar tema aquí
    if (!e.target.closest('a')) {
        // Cambiar a tema KOI (claro) solo si NO está ya activo
        const isKoiActive = mainHeader.classList.contains('theme-koi') &&
                           parseFloat(window.getComputedStyle(mainHeader).opacity) >= 0.9;

        if (!isKoiActive) {
            // Animar transición de header y footer
            gsap.to(mainHeader, {
                duration: 0.6,
                opacity: 1,
                ease: "power2.inOut"
            });
            gsap.to(mainFooter, {
                duration: 0.6,
                opacity: 0.5,
                ease: "power2.inOut"
            });

            // Cambiar tema de header y footer
            updateHeaderFooterTheme('koi');
            // Mostrar slides de KOI con animación desde arriba
            showSlides('koi');
            // Actualizar localStorage
            localStorage.setItem('themeMode', 'light');
            // Actualizar URL
            history.pushState({ project: 'koi' }, '', '/koi');

            // ===== VALIDACIÓN: Adaptar modales de proyectos si están abiertos =====
            const projectsModal = document.getElementById('projectsModal');
            const projectDetailModal = document.getElementById('projectDetailModal');

            // Si alguno de los modales está abierto, animar el cambio de tema
            if ((projectsModal && projectsModal.classList.contains('active')) ||
                (projectDetailModal && projectDetailModal.classList.contains('active'))) {

                // Animar ambos modales si están abiertos
                const modalsToAnimate = [];
                if (projectsModal && projectsModal.classList.contains('active')) {
                    modalsToAnimate.push(projectsModal);
                }
                if (projectDetailModal && projectDetailModal.classList.contains('active')) {
                    modalsToAnimate.push(projectDetailModal);
                }

                // Animar opacidad de los modales abiertos
                modalsToAnimate.forEach(modal => {
                    gsap.to(modal, {
                        duration: 0.6,
                        opacity: 0.8,
                        ease: "power2.inOut"
                    });
                });

                // Después de la animación, actualizar tema
                setTimeout(() => {
                    if (typeof window.updateProjectsTheme === 'function') {
                        window.updateProjectsTheme('light');
                    }

                    // Restaurar opacidad
                    modalsToAnimate.forEach(modal => {
                        gsap.to(modal, {
                            duration: 0.6,
                            opacity: 1,
                            ease: "power2.inOut"
                        });
                    });
                }, 600);
            }
        }
    }
});

// Click en footer para cambiar tema y slider
mainFooter.addEventListener('click', function(e) {

    // Si se hace click en un link del menú, no cambiar tema aquí
    if (!e.target.closest('a')) {
        // Cambiar a tema KOA (oscuro) solo si NO está ya activo
        const isKoaActive = mainFooter.classList.contains('theme-koa') &&
                           parseFloat(window.getComputedStyle(mainFooter).opacity) >= 0.9;

        if (!isKoaActive) {
            // Animar transición de header y footer
            gsap.to(mainFooter, {
                duration: 0.6,
                opacity: 1,
                ease: "power2.inOut"
            });
            gsap.to(mainHeader, {
                duration: 0.6,
                opacity: 0.5,
                ease: "power2.inOut"
            });

            // Cambiar tema de header y footer
            updateHeaderFooterTheme('koa');
            // Mostrar slides de KOA con animación desde abajo
            showSlides('koa');
            // Actualizar localStorage
            localStorage.setItem('themeMode', 'dark');
            // Actualizar URL
            history.pushState({ project: 'koa' }, '', '/koa');

            // ===== VALIDACIÓN: Adaptar modales de proyectos si están abiertos =====
            const projectsModal = document.getElementById('projectsModal');
            const projectDetailModal = document.getElementById('projectDetailModal');

            // Si alguno de los modales está abierto, animar el cambio de tema
            if ((projectsModal && projectsModal.classList.contains('active')) ||
                (projectDetailModal && projectDetailModal.classList.contains('active'))) {

                // Animar ambos modales si están abiertos
                const modalsToAnimate = [];
                if (projectsModal && projectsModal.classList.contains('active')) {
                    modalsToAnimate.push(projectsModal);
                }
                if (projectDetailModal && projectDetailModal.classList.contains('active')) {
                    modalsToAnimate.push(projectDetailModal);
                }

                // Animar opacidad de los modales abiertos
                modalsToAnimate.forEach(modal => {
                    gsap.to(modal, {
                        duration: 0.6,
                        opacity: 0.8,
                        ease: "power2.inOut"
                    });
                });

                // Después de la animación, actualizar tema
                setTimeout(() => {
                    if (typeof window.updateProjectsTheme === 'function') {
                        window.updateProjectsTheme('dark');
                    }

                    // Restaurar opacidad
                    modalsToAnimate.forEach(modal => {
                        gsap.to(modal, {
                            duration: 0.6,
                            opacity: 1,
                            ease: "power2.inOut"
                        });
                    });
                }, 600);
            }
        }
    }
});

// Click en items del menú (header y footer)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Cerrar modal de proyectos si está abierto
        const openModal = document.getElementById('projectsModal');
        if (openModal && openModal.classList.contains('active')) {
            const closeBtn = openModal.querySelector('.projects-close-btn');
            if (closeBtn) {
                closeBtn.click();
            } else {
                openModal.classList.remove('active');
                openModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
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
        if (event.state.project === 'koi') {
            showSlides('koi');
            updateHeaderFooterTheme('koi');
        } else if (event.state.project === 'koa') {
            showSlides('koa');
            updateHeaderFooterTheme('koa');
        }
    } else {
        // Si no hay estado (volvió a la página inicial), recargar la página
        window.location.href = '/';
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

// === Reproductor de música ===
const audioPlayer = new Audio();

document.addEventListener('click', (e) => {
    const track = e.target.closest('.music-track');
    if (!track) return;
    e.preventDefault();

    const src = track.dataset.src;
    const isPlaying = !audioPlayer.paused && audioPlayer.src.endsWith(src.split('/').pop());

    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.src = src;
        audioPlayer.play();
    }
});

