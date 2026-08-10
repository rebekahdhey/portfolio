const { gsap, CustomEase, ScrollToPlugin, ScrollTrigger } = window;

if (!gsap) {
  console.error("GSAP did not load correctly.");
} else {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, CustomEase);

  if (CustomEase) {
    CustomEase.create("hop", "0.85, 0, 0.15, 1");
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  setTimeout(() => {
    document.documentElement.classList.remove("loading");
  }, 4000);

  fetch('about/about.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('about-container').innerHTML = html;
      initSmoothNav();
      initAboutReveal();
      initAboutTextAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load about section:', err));

  fetch('skills/skills.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('skills-container').innerHTML = html;
      initSmoothNav();
      initSkillsAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load skills section:', err));

  document.addEventListener("DOMContentLoaded", () => {
    initGradientBg();
    wrapWords(".full-name"); // <-- must run BEFORE the timeline references .word

    const counterProgress = document.querySelector(".counter h1");
    const counter = { value: 0 };

    if (!counterProgress) {
      console.error("Counter element not found.");
      return;
    }

    const counterTl = gsap.timeline({ delay: 0.5 });
    const overlayTextTl = gsap.timeline({ delay: 0.75 });
    const revealTl = gsap.timeline({ delay: 0.5 });

    counterTl.to(counter, {
      value: 100,
      duration: 5,
      ease: "power2.out",
      onUpdate: () => {
        counterProgress.textContent = Math.floor(counter.value);
      },
    });

    overlayTextTl.to(".overlay-text", {
      y: 0,
      duration: 0.75,
      ease: "hop",
    })
    .to(".overlay-text", {
      y: "-2rem",
      duration: 0.75,
      ease: "hop",
      delay: 0.75,
    })
    .to(".overlay-text", {
      y: "-4rem",
      duration: 0.75,
      ease: "hop",
      delay: 0.75,
    });

    revealTl.to(".img", {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 1,
      ease: "hop",
    }).to(".hero-images", {
      gap: "0.75vw",
      duration: 1,
      delay: 0.5,
      ease: "hop",
    })
    .to(".img", {
      scale: 1,
      duration: 1,
      ease: "hop",
    }, "<")
    .to(".img:not(.hero-img)", {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      ease: "hop",
    })
    .to(".hero-img", {
      y: "-5vw",
      scale: 2,
      duration: 1,
      ease: "hop",
    })
    .to(".hero-overlay", {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "hop",
    })
    .to(".full-name .word", {
      y: "0",
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    }, "-0.5")
    .to(".full-name", {
      scale: 0.7,
      duration: 0.75,
      ease: "hop",
    }, "<")
    .to(".full-name", {
      opacity: 0,
      y: "-1rem",
      duration: 0.75,
      ease: "hop",
      delay: 1,
    })
    .to(".nickname", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "hop",
      onComplete: () => {
        document.documentElement.classList.remove("loading");
      },
    }, "<+0.1");
  });
}

function wrapWords(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="word">${w}</span>`)
      .join(' ');
  });
}

function initSmoothNav() {
  document.querySelectorAll('.nav-items a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: targetEl, offsetY: 0 },
        ease: "hop",
      });
    });
  });
}

function initAboutReveal() {
  const aboutSection = document.querySelector("#about");
  if (!aboutSection) return;

  gsap.set(aboutSection, { opacity: 0, y: 60 });

  gsap.to(aboutSection, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "hop",
    scrollTrigger: {
      trigger: aboutSection,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
}

function initGradientBg() {
  const canvas = document.getElementById("gradient-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function draw() {
    pos.x += (mouse.x - pos.x) * 0.05;
    pos.y += (mouse.y - pos.y) * 0.05;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const radius = Math.max(width, height) * 0.45;
    const gradient = ctx.createRadialGradient(
      pos.x, pos.y, 0,
      pos.x, pos.y, radius
    );
    gradient.addColorStop(0, "rgba(40, 40, 40, 0.7)");
    gradient.addColorStop(0.5, "rgba(75, 75, 75, 0.4)");
    gradient.addColorStop(1, "rgba(110, 110, 110, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = width / 2;
    mouse.y = height / 2;
  });

  resize();
  draw();
}