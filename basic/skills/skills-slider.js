function initSkillsAnimation() {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const words = item.querySelectorAll(".word");
    words.forEach(splitIntoChars);

    item.addEventListener("mouseenter", () => revealChars(item, true));
    item.addEventListener("mouseleave", () => revealChars(item, false));
  });

  function splitIntoChars(word) {
    const text = word.textContent;
    word.textContent = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.display = "inline-block";
      span.style.willChange = "transform, text-shadow, color";
      span.textContent = char === " " ? "\u00A0" : char;
      word.appendChild(span);
    });
  }

  function revealChars(item, isEntering) {
    const chars = item.querySelectorAll(".char");

    gsap.killTweensOf(chars);

    gsap.to(chars, {
      y: isEntering ? -6 : 0,
      color: isEntering ? "#000000" : "#1a1a1a",
      textShadow: isEntering
        ? "0.4px 0 0 currentColor, -0.4px 0 0 currentColor"
        : "0 0 0 currentColor",
      duration: 0.5,
      ease: "hop",
      stagger: {
        each: 0.015,
        from: "start",
      },
    });
  }
}