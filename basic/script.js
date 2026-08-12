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

  fetch('experience/experience.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('experience-container').innerHTML = html;
      initSmoothNav();
      initExperienceAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load about section:', err));

  fetch('projects/projects.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('projects-container').innerHTML = html;
      initSmoothNav();
      initProjectsAnimation();
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
    initCursorGlow(); // was: initGradientBg();
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

function initCursorGlow() {
  if (window.matchMedia("(max-width: 900px)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.07;
    glowY += (mouseY - glowY) * 0.07;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();
}