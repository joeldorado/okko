// PARALLAX effect with limits
document.addEventListener("mousemove", (e) => {
    const moveLimit = 20; // Maximum pixels to move
    const x = (e.clientX / window.innerWidth - 0.5) * moveLimit;
    const y = (e.clientY / window.innerHeight - 0.5) * moveLimit;

    document.querySelectorAll(".panel-image").forEach((img) => {
        img.style.transform = `scale(1.2) translate(${x}px, ${y}px)`;
    });
});

// MOBILE TOUCH (panel A/B)
const koi = document.getElementById("koi");
const koa = document.getElementById("koa");

koi.addEventListener("touchstart", () => {
    koi.classList.add("active-touch");
    koa.classList.remove("active-touch");
});

koa.addEventListener("touchstart", () => {
    koa.classList.add("active-touch");
    koi.classList.remove("active-touch");
});
