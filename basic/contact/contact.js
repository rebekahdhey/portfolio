function initContactAnimation() {
  const yearEl = document.getElementById("contact-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: 0 },
        ease: "hop",
      });
    });
  }
}