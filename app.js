const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const navToggle = $(".nav-toggle");
const navList = $(".nav-list");
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-list a").forEach((a) =>
    a.addEventListener("click", () => {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

const prefersLight =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches;
const storedTheme = localStorage.getItem("theme");
const initialLight = storedTheme ? storedTheme === "light" : prefersLight;
if (initialLight) document.documentElement.classList.add("light");
const modeBtn = $("#modeToggle");
if (modeBtn) {
  const syncIcon = () =>
    (modeBtn.textContent = document.documentElement.classList.contains("light")
      ? "🌞"
      : "🌙");
  syncIcon();
  modeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    const theme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    localStorage.setItem("theme", theme);
    syncIcon();
  });
}

const header = document.querySelector("[data-elevate]");
const elevate = () => {
  if (!header) return;
  if (window.scrollY > 12) header.classList.add("elevated");
  else header.classList.remove("elevated");
};
elevate();
window.addEventListener("scroll", elevate, { passive: true });

const revealEls = $$("[data-reveal]");
if (revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "40px" },
  );
  revealEls.forEach((el) => io.observe(el));
}

const decor1 = $(".decor-1");
const decor2 = $(".decor-2");
const parallax = () => {
  const y = window.scrollY || 0;
  if (decor1) decor1.style.transform = `translateY(${y * 0.06}px)`;
  if (decor2) decor2.style.transform = `translateY(${y * 0.1}px)`;
};
parallax();
window.addEventListener("scroll", parallax, { passive: true });

const tiltEls = $$("[data-tilt]");
const bound = 8;
tiltEls.forEach((el) => {
  let on = false;
  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    const rx = (dy * bound).toFixed(2);
    const ry = (-dx * bound).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const onEnter = () => {
    on = true;
    el.style.transition = "transform .12s ease";
  };
  const onLeave = () => {
    on = false;
    el.style.transition = "transform .4s ease";
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mousemove", (e) => on && onMove(e));
  el.addEventListener("mouseleave", onLeave);
});
