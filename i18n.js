/* =====================================================
   i18n.js — Sistema de traducción ESP / ENG
   Default: español  |  Persiste en localStorage
   ===================================================== */
(function () {
  "use strict";

  var dict = {
    es: {
      nav: {
        nosotros:  "Nosotros",
        proyectos: "Proyectos",
        contacto:  "Contacto",
        intro:     "Intro",
        cancion2:  "Canción 2",
        cancion3:  "Canción 3"
      },
      projects: {
        title:          "PROYECTOS",
        subtitle:       "Explora nuestra selección de proyectos destacados",
        protectedTitle: "Proyecto Protegido",
        protectedMsg:   "Ingresa el código de acceso para ver este proyecto:",
        disabledPrefix: "Disponible en",
        wrongCode:      "Código incorrecto",
        cardSubKOA:     "Diseño Funcional",
        cardSubKOI:     "Arquitectura Contemporánea",
        cardPrefix:     "Proyecto",
        filterAll:       "Todos",
        catCasas:        "Casas",
        catDesarrollos:  "Desarrollos",
        catDiseno:       "Diseño",
        catEdificios:    "Edificios"
      },
      contact: {
        title:         "CONTACTO",
        nombre:        "Nombre",
        apellido:      "Apellido",
        correo:        "Correo",
        telefono:      "Teléfono",
        comentario:    "Comentario",
        enviar:        "Enviar",
        errNombre:     "Campo requerido",
        errApellido:   "Campo requerido",
        errCorreo:     "Correo inválido",
        errTelefono:   "Teléfono inválido (8-15 dígitos)",
        errComentario: "Campo requerido",
        success:       "¡Mensaje enviado correctamente!",
        error:         "Error al enviar el mensaje, intenta más tarde."
      },
      about: {
        KOI: {
          subtitle: "Arquitectura Contemporánea",
          p1: "En KOI, creemos que la arquitectura debe ser una extensión natural del entorno que la rodea. Nuestro enfoque se centra en diseños minimalistas que celebran la luz, el espacio y la funcionalidad.",
          p2: "Cada proyecto es una oportunidad para reimaginar cómo vivimos y nos relacionamos con nuestro entorno. Utilizamos materiales nobles, líneas limpias y una paleta cromática serena para crear espacios que inspiran tranquilidad y contemplación.",
          p3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        KOA: {
          subtitle: "Diseño Funcional",
          p1: "KOA representa la fusión perfecta entre forma y función. Nuestra filosofía se basa en crear espacios que no solo sean visualmente impactantes, sino que también respondan de manera inteligente a las necesidades de quienes los habitan.",
          p2: "Trabajamos con una paleta de materiales audaces, texturas contrastantes y geometrías precisas para desarrollar proyectos que desafían las convenciones mientras mantienen un profundo respeto por la funcionalidad y el confort.",
          p3: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
      }
    },

    en: {
      nav: {
        nosotros:  "About",
        proyectos: "Projects",
        contacto:  "Contact",
        intro:     "Intro",
        cancion2:  "Song 2",
        cancion3:  "Song 3"
      },
      projects: {
        title:          "PROJECTS",
        subtitle:       "Explore our selection of featured projects",
        protectedTitle: "Protected Project",
        protectedMsg:   "Enter the access code to view this project:",
        disabledPrefix: "Available in",
        wrongCode:      "Incorrect code",
        cardSubKOA:     "Functional Design",
        cardSubKOI:     "Contemporary Architecture",
        cardPrefix:     "Project",
        filterAll:       "All",
        catCasas:        "Houses",
        catDesarrollos:  "Developments",
        catDiseno:       "Design",
        catEdificios:    "Buildings"
      },
      contact: {
        title:         "CONTACT",
        nombre:        "First Name",
        apellido:      "Last Name",
        correo:        "Email",
        telefono:      "Phone",
        comentario:    "Comment",
        enviar:        "Send",
        errNombre:     "Required field",
        errApellido:   "Required field",
        errCorreo:     "Invalid email",
        errTelefono:   "Invalid phone (8-15 digits)",
        errComentario: "Required field",
        success:       "Message sent successfully!",
        error:         "Error sending message, please try again later."
      },
      about: {
        KOI: {
          subtitle: "Contemporary Architecture",
          p1: "At KOI, we believe architecture should be a natural extension of its surrounding environment. Our approach focuses on minimalist designs that celebrate light, space, and functionality.",
          p2: "Each project is an opportunity to reimagine how we live and relate to our surroundings. We use noble materials, clean lines, and a serene color palette to create spaces that inspire tranquility and contemplation.",
          p3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        KOA: {
          subtitle: "Functional Design",
          p1: "KOA represents the perfect fusion of form and function. Our philosophy is built on creating spaces that are not only visually striking, but also respond intelligently to the needs of those who inhabit them.",
          p2: "We work with bold material palettes, contrasting textures, and precise geometries to develop projects that challenge conventions while maintaining a deep respect for functionality and comfort.",
          p3: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
      }
    }
  };

  var currentLang = localStorage.getItem("lang") || "es";

  /* --- Helper: obtener string por key dotted --- */
  function t(key) {
    var keys = key.split(".");
    var val = dict[currentLang];
    for (var i = 0; i < keys.length; i++) {
      if (val == null) return key;
      val = val[keys[i]];
    }
    return val != null ? String(val) : key;
  }

  /* --- Aplicar traducciones al DOM --- */
  function apply() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var text = t(key);
      if (text !== key) el.textContent = text;
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === currentLang);
    });

    /* Notificar a scripts dinámicos (about, proyectos, etc.) */
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: currentLang } }));
  }

  /* --- Cambiar idioma --- */
  function setLang(lang) {
    if (lang !== "es" && lang !== "en") return;
    currentLang = lang;
    localStorage.setItem("lang", lang);
    apply();
  }

  /* --- API pública --- */
  window.i18n = {
    t:       t,
    setLang: setLang,
    getLang: function () { return currentLang; },
    apply:   apply
  };

  /* --- Inicializar cuando el DOM esté listo --- */
  document.addEventListener("DOMContentLoaded", function () {
    apply();

    /* Delegar clicks en botones de idioma */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".lang-btn");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        setLang(btn.getAttribute("data-lang"));
      }
    });
  });

})();
