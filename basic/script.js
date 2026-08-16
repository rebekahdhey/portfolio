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
    syncTouch: true,  
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
    .catch(err => console.error('Failed to load experience section:', err));

  fetch('projects/projects.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('projects-container').innerHTML = html;
      initSmoothNav();
      initProjectsAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load projects section:', err));

  fetch('skills/skills.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('skills-container').innerHTML = html;
      initSmoothNav();
      initSkillsAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load skills section:', err));

  fetch('contact/contact.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('contact-container').innerHTML = html;
      initSmoothNav();
      initContactAnimation();
      ScrollTrigger.refresh();
    })
    .catch(err => console.error('Failed to load contact section:', err));

  document.addEventListener("DOMContentLoaded", () => {
    initCursorGlow(); // was: initGradientBg();
    initNavActiveState();
    initNavTheme();
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

    const dockLeft = window.matchMedia("(min-width: 901px)").matches
      ? "24vw"
      : "50vw";

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
      // width: 0,
      // marginInline: 0,
      duration: 1,
      stagger: 0.1,
      ease: "hop",
    })
    .to(".hero-overlay", {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "hop",
    }, "-=0.5")
    .to(".hero-images", {
      left: dockLeft,
      duration: 1,
      ease: "hop",
    }, "-=0.5")
    .to(".face-mockup", {
      yPercent: -100,
      duration: 1,
      ease: "hop",
    }, "-=0.2")
    .to(".full-name .word", {
      y: "0",
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    }, "-=0.5")
    .to(".profession", {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "hop",
    }, "-=0.25")
    .to(".hero-bio", {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "hop",
      onComplete: () => {
        document.documentElement.classList.remove("loading");
      },
    }, "-=0.35");
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

function initNavActiveState() {
  const navLinks = document.querySelectorAll('.nav-items a[href^="#"]');
  if (!navLinks.length) return;

  function getSections() {
    return Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
  }

  function updateActive() {
    const sections = getSections();
    if (!sections.length) return;

    const viewportPosition = window.innerHeight * 0.4;
    let activeIndex = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportPosition) {
        activeIndex = index;
      }
    });

    navLinks.forEach(link => link.classList.remove('active'));
    if (navLinks[activeIndex]) {
      navLinks[activeIndex].classList.add('active');
    }
  }

  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
}

function initNavTheme() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Temporarily hides nav so elementFromPoint sees what's actually behind it
  function sampleElementAt(x, y) {
    const prevVisibility = nav.style.visibility;
    nav.style.visibility = 'hidden';
    const el = document.elementFromPoint(x, y);
    nav.style.visibility = prevVisibility;
    return el;
  }

  // Walks up the tree until it finds a non-transparent background-color
  function getEffectiveBackground(el) {
    while (el) {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      el = el.parentElement;
    }
    return 'rgb(255, 255, 255)';
  }

  function luminanceOf(rgbString) {
    const nums = rgbString.match(/[\d.]+/g);
    if (!nums) return 255;
    const [r, g, b] = nums.map(Number);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function updateNavTheme() {
    const x = window.innerWidth / 2;
    const y = 40; // just below the nav's top padding
    const el = sampleElementAt(x, y);
    const bg = el ? getEffectiveBackground(el) : 'rgb(255, 255, 255)';
    const isDarkBg = luminanceOf(bg) < 130;

    nav.classList.toggle('nav-on-dark', isDarkBg);
  }

  updateNavTheme();

  // Runs every frame so it stays correct through GSAP/clip-path/scroll
  // animations, not just on native scroll events
  function loop() {
    updateNavTheme();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  window.addEventListener('resize', updateNavTheme);
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