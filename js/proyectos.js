// proyectos.js (LIMPIO)
$(document).ready(function () {
  const bodyRoot = $("#bodyRoot");
  const toggleTheme = $("#toggleTheme");
  const projectsGrid = $("#projectsGrid");

  // 1) THEME MODE
  let theme = localStorage.getItem("themeMode") || "dark";
  applyTheme(theme);

  toggleTheme.on("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("themeMode", theme);
    applyTheme(theme);
    renderProjects();
  });

  function applyTheme(mode) {
    if (mode === "light") bodyRoot.addClass("light");
    else bodyRoot.removeClass("light");
  }

  // 2) DATA
  const proyectos = [];
  const urls = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1529429612779-c8e40ef2f36c?auto=format&fit=crop&w=1600&q=80",
  ];

  const imagePool = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80",
  ];

  for (let i = 1; i <= 50; i++) {
    const empresa = i % 2 === 0 ? "KOA" : "KOI";
    const hasKey = Math.random() < 0.3;
    const img = urls[Math.floor(Math.random() * urls.length)];
    const gallerySet = Array.from({ length: 5 }, () =>
      imagePool[Math.floor(Math.random() * imagePool.length)]
    );

    proyectos.push({
      id: i,
      empresa,
      titulo: `Proyecto ${i}`,
      subtitulo: empresa === "KOA" ? "Diseño KOA" : "Diseño KOI",
      hasKey,
      imagen: img,
      images: gallerySet,
    });
  }

  // 3) RENDER
  function renderProjects() {
    projectsGrid.empty();

    proyectos.forEach((p) => {
      const isActive =
        (theme === "dark" && p.empresa === "KOA") ||
        (theme === "light" && p.empresa === "KOI");

      const card = $(`
        <div class="project-card ${isActive ? "" : "disabled"}"
             data-empresa="${p.empresa}"
             data-empresa-disabled="Disponible en ${p.empresa}">
          <img src="${p.imagen}" alt="${p.titulo}">
          <div class="overlay"></div>
          <div class="project-info">
            <h3>${p.titulo}</h3>
            <p>${p.subtitulo}</p>
          </div>
          ${p.hasKey ? '<i class="fa-solid fa-key key-icon"></i>' : ""}
        </div>
      `);

      if (isActive) {
        card.on("click", () => {
          if (typeof window.openProjectGallery === "function") {
            window.openProjectGallery(p.images);
          } else {
            console.warn("openProjectGallery no existe. Verifica que modal.js se cargue después.");
          }
        });
      } else {
        // Click en card bloqueada → cambiar al tema del proyecto y re-renderizar
        card.on("click", (e) => {
          e.stopPropagation();
          const targetTheme = p.empresa === "KOA" ? "dark" : "light";
          const targetKey   = p.empresa.toLowerCase(); // 'koi' | 'koa'

          theme = targetTheme;
          localStorage.setItem("themeMode", targetTheme);
          applyTheme(targetTheme);
          renderProjects();

          // Sincronizar header/footer y slides con script.js
          if (typeof updateHeaderFooterTheme === "function") updateHeaderFooterTheme(targetKey);
          if (typeof showSlides === "function") showSlides(targetKey);
        });
      }

      projectsGrid.append(card);
    });
  }

  renderProjects();
});
