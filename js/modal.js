/* =====================================================
   MODAL GALLERY CAROUSEL – 3 SLOTS (PREV / ACTIVE / NEXT)
   ===================================================== */
   (function () {

    let galleryImages = [];
    let currentIndex = 0;
  
    // Modal
    const modal = document.getElementById("projectDetailModal");
    const closeBtn = document.getElementById("projectDetailCloseBtn");
    const galleryScreen = document.getElementById("projectGalleryScreen");
  
    // Carousel
    const track = galleryScreen.querySelector(".carousel-track");
    const prevBtn = document.getElementById("projectPrevBtn");
    const nextBtn = document.getElementById("projectNextBtn");
  
    if (!modal || !galleryScreen || !track) {
      console.warn("[modal.js] Carousel DOM incompleto");
      return;
    }
  
    /* ===============================
       HELPERS
    =============================== */
    const clamp = (i, len) => (i + len) % len;
  
    function normalizeImages(images) {
      if (!Array.isArray(images) || images.length === 0) return [];
      if (images.length === 1) return [images[0], images[0], images[0]];
      if (images.length === 2) return [images[0], images[1], images[0]];
      return images;
    }
  
    /* ===============================
       BUILD BASE STRUCTURE
    =============================== */
    function buildCarousel() {
      track.innerHTML = `
        <div class="carousel-item carousel-prev"><img /></div>
        <div class="carousel-item carousel-active"><img /></div>
        <div class="carousel-item carousel-next"><img /></div>
      `;
    }
  
    /* ===============================
       RENDER IMAGES INTO SLOTS
    =============================== */
    function render() {
      const items = {
        prev: track.querySelector(".carousel-prev img"),
        active: track.querySelector(".carousel-active img"),
        next: track.querySelector(".carousel-next img")
      };
  
      const len = galleryImages.length;
  
      items.prev.src   = galleryImages[clamp(currentIndex - 1, len)];
      items.active.src = galleryImages[currentIndex];
      items.next.src   = galleryImages[clamp(currentIndex + 1, len)];
    }
  
    /* ===============================
       ROTATE SLOTS (KEY FIX 🔥)
    =============================== */
    function rotate(direction) {
      const prev  = track.querySelector(".carousel-prev");
      const active = track.querySelector(".carousel-active");
      const next  = track.querySelector(".carousel-next");
  
      prev.classList.remove("carousel-prev", "carousel-active", "carousel-next");
      active.classList.remove("carousel-prev", "carousel-active", "carousel-next");
      next.classList.remove("carousel-prev", "carousel-active", "carousel-next");
  
      if (direction === "next") {
        prev.classList.add("carousel-next");
        active.classList.add("carousel-prev");
        next.classList.add("carousel-active");
        currentIndex = clamp(currentIndex + 1, galleryImages.length);
      } else {
        prev.classList.add("carousel-active");
        active.classList.add("carousel-next");
        next.classList.add("carousel-prev");
        currentIndex = clamp(currentIndex - 1, galleryImages.length);
      }
  
      render();
    }
  
    /* ===============================
       PUBLIC API
    =============================== */
    window.openProjectGallery = function (images) {
      galleryImages = normalizeImages(images);
      currentIndex = 0;
  
      buildCarousel();
      render();
  
      galleryScreen.classList.remove("hidden");
      modal.classList.remove("hidden");
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };
  
    /* ===============================
       EVENTS
    =============================== */
    prevBtn?.addEventListener("click", () => rotate("prev"));
    nextBtn?.addEventListener("click", () => rotate("next"));
  
    track.addEventListener("click", (e) => {
      if (e.target.closest(".carousel-prev")) rotate("prev");
      if (e.target.closest(".carousel-next")) rotate("next");
    });
  
    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("active");
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeBtn.click();
      }
    });
  
  })();
  