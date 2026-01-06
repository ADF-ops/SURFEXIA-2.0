/* ===============================

SURFEXIA - Premium JavaScript (tracking + UX)

================================ */

// ===== CONFIGURATION =====
const CONFIG = {
  revealThreshold: 0.15,
  headerScrollThreshold: 50,
  smoothScrollOffset: 90,
  revealStagger: 90
};

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector(".site-header");
function updateHeaderOnScroll() {
  if (!header) return;
  const currentScrollY = window.scrollY || 0;
  if (currentScrollY > CONFIG.headerScrollThreshold) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
}

// ===== SCROLL PROGRESS =====
const scrollProgress = document.getElementById("scrollProgress");
function updateScrollProgress() {
  if (!scrollProgress) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

// ===== BURGER MENU =====
const burger = document.getElementById("burger");
const navMobile = document.getElementById("navMobile");

function openMobileNav() {
  if (!burger || !navMobile) return;
  navMobile.classList.add("open");
  burger.classList.add("active");
  burger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  if (!burger || !navMobile) return;
  navMobile.classList.remove("open");
  burger.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function toggleMobileNav(e) {
  if (!burger || !navMobile) return;
  if (e) e.stopPropagation();
  if (navMobile.classList.contains("open")) closeMobileNav();
  else openMobileNav();
}

if (burger && navMobile) {
  if (!burger.getAttribute("aria-expanded")) burger.setAttribute("aria-expanded", "false");
  if (!burger.getAttribute("aria-controls") && navMobile.id) burger.setAttribute("aria-controls", navMobile.id);

  burger.addEventListener("click", toggleMobileNav);

  navMobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMobileNav());
  });

  document.addEventListener("click", (e) => {
    if (!navMobile.classList.contains("open")) return;
    if (!navMobile.contains(e.target) && !burger.contains(e.target)) closeMobileNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
}

// ===== REVEAL (IntersectionObserver) =====
function initRevealAnimations() {
  const elements = Array.from(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  elements.forEach((el) => {
    if (!el.dataset.revealDelay) el.dataset.revealDelay = "0";
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("active"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = Number(el.dataset.revealDelay || 0);
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("active");
      io.unobserve(el);
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -10% 0px"
  });

  const groups = new Map();
  elements.forEach((el) => {
    const group = el.closest(".section") || el.closest(".container") || document.body;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });

  groups.forEach((els) => {
    els.forEach((el, idx) => {
      if (el.dataset.revealDelay && el.dataset.revealDelay !== "0") return;
      el.dataset.revealDelay = String(idx * CONFIG.revealStagger);
    });
  });

  elements.forEach((el) => io.observe(el));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#" || targetId === "#!") {
        e.preventDefault();
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      document.querySelectorAll(".nav-desktop a, .nav-mobile a").forEach((link) => link.classList.remove("active"));
      this.classList.add("active");

      if (navMobile && navMobile.classList.contains("open")) closeMobileNav();

      const targetPosition = targetElement.offsetTop - CONFIG.smoothScrollOffset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });
}

// ===== PARALLAX HERO =====
const heroSection = document.querySelector(".hero");
const heroImage = heroSection ? heroSection.querySelector("img") : null;

function updateHeroParallax() {
  if (!heroImage || !heroSection) return;
  const scrolled = window.scrollY || 0;
  const heroHeight = heroSection.offsetHeight;

  if (scrolled < heroHeight) {
    const parallaxSpeed = 0.28;
    const maxTransform = heroHeight * 0.14;
    const transformY = Math.min(scrolled * parallaxSpeed, maxTransform);
    heroImage.style.transform = `translate(-50%, -50%) translateY(${transformY}px) scale(1.02)`;
  }
}

// ===== ACTIVE NAV LINK =====
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = (currentPath.split("/").pop() || "index.html").split("?")[0].split("#")[0];
  const currentHash = window.location.hash;

  const navLinks = document.querySelectorAll(".nav-desktop a, .nav-mobile a");
  navLinks.forEach((link) => link.classList.remove("active"));

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref || linkHref === "#" || linkHref === "#!") return;

    if (currentHash && linkHref === currentHash) {
      link.classList.add("active");
      return;
    }

    if (linkHref.startsWith("#")) return;

    const linkPage = linkHref.split("/").pop().split("?")[0].split("#")[0];

    if (linkHref.includes("etudes-cas")) {
      if (currentPath.includes("/etudes-cas/") || currentPage === "etudes-cas.html") link.classList.add("active");
      return;
    }

    if (linkHref.includes("blog")) {
      if (currentPath.includes("/blog/") || currentPage === "blog.html") link.classList.add("active");
      return;
    }

    if ((linkHref === "index.html" || linkHref === "./index.html") && currentPage === "index.html") {
      link.classList.add("active");
      return;
    }

    if (linkPage === currentPage) link.classList.add("active");
  });
}
window.addEventListener("hashchange", setActiveNavLink);

// ===== LAZY LOADING =====
function initLazyLoading() {
  if (!("IntersectionObserver" in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.style.opacity = "0";
        img.style.transition = "opacity 0.6s ease";
        img.onload = () => { img.style.opacity = "1"; };
      }
      observer.unobserve(img);
    });
  }, { rootMargin: "50px" });

  document.querySelectorAll("img[data-src]").forEach((img) => imageObserver.observe(img));
}

// ===== CARD HOVER EFFECT =====
function initCardHover() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (card.classList.contains("card-step") || card.classList.contains("offer-card")) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 22;
      const rotateY = (centerX - x) / 22;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// ===== PERFORMANCE =====
function checkConnectionSpeed() {
  if (!("connection" in navigator)) return;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return;

  if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
    document.documentElement.style.setProperty("--transition-base", "none");
    document.documentElement.style.setProperty("--transition-slow", "none");
  }
}

// ===== TRACKING (Formspree) =====
// contact.html must include: <input type="hidden" name="source" id="leadSource" value="contact-page">
function applyLeadSourceTracking() {
  const input = document.getElementById("leadSource");
  if (!input) return;

  const params = new URLSearchParams(window.location.search);
  const src = params.get("src");

  if (src) {
    input.value = src;
    return;
  }

  // Optional: <form data-default-source="menu">
  const form = input.closest("form");
  const defaultSrc = form ? form.getAttribute("data-default-source") : null;
  if (defaultSrc && !input.value) input.value = defaultSrc;
}

// ===== RAF SCROLL LOOP =====
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateHeaderOnScroll();
    updateScrollProgress();
    updateHeroParallax();
    ticking = false;
  });
}, { passive: true });

// ===== INIT =====
window.addEventListener("load", () => {
  checkConnectionSpeed();
  initRevealAnimations();
  initSmoothScroll();
  initLazyLoading();
  initCardHover();
  setActiveNavLink();
  applyLeadSourceTracking();

  updateHeaderOnScroll();
  updateScrollProgress();
  updateHeroParallax();
});

// Debug
window.SURFEXIA = { version: "2.2.0", config: CONFIG };
