const root = document.documentElement;
const stageImage = document.querySelector("#stageImage");
const stageKicker = document.querySelector("#stageKicker");
const stageTitle = document.querySelector("#stageTitle");
const chapters = document.querySelectorAll("[data-stage]");
const sceneCards = document.querySelectorAll(".scene-card");

const stageMap = {
  hero: {
    src: "./assets/product-side-hero.png?v=20260531-newviews",
    alt: "Maison Ignis 侧面产品渲染",
    kicker: "00 / HERO REVEAL",
    title: "Heat made quiet",
  },
  product: {
    src: "./assets/product-profile.png?v=20260531-newviews",
    alt: "Maison Ignis 侧面产品视图",
    kicker: "01 / PRODUCT REVEAL",
    title: "Seamless warm shell",
  },
  function: {
    src: "./assets/product-top.png?v=20260531-newviews",
    alt: "Maison Ignis 顶部产品视图",
    kicker: "02 / THERMAL SYSTEM",
    title: "Sensors under softness",
  },
  scenes: {
    src: "./assets/product-front.png?v=20260531-newviews",
    alt: "Maison Ignis 鞋头产品视图",
    kicker: "03 / WINTER SCENES",
    title: "From street to cafe",
  },
  feeling: {
    src: "./assets/product-back.png?v=20260531-newviews",
    alt: "Maison Ignis 后跟产品视图",
    kicker: "04 / DAILY FEELING",
    title: "Comfort that stays on",
  },
  value: {
    src: "./assets/product-sole.png?v=20260531-newviews",
    alt: "Maison Ignis 鞋底产品视图",
    kicker: "05 / VALUE LINE",
    title: "Warmth, ease, style",
  },
  access: {
    src: "./assets/product-side-hero.png?v=20260531-newviews",
    alt: "Maison Ignis 白色保暖鞋侧面",
    kicker: "06 / EARLY ACCESS",
    title: "Join the first winter",
  },
};

let activeStage = "product";
let pointerFrame = 0;
let scrollFrame = 0;

function setStage(stageName) {
  const stage = stageMap[stageName];

  if (!stage || activeStage === stageName || !stageImage) {
    return;
  }

  activeStage = stageName;
  stageImage.classList.add("stage-changing");

  window.setTimeout(() => {
    stageImage.src = stage.src;
    stageImage.alt = stage.alt;
    stageKicker.textContent = stage.kicker;
    stageTitle.textContent = stage.title;
    stageImage.classList.remove("stage-changing");
  }, 180);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const stageObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
      setStage(visibleEntries[0].target.dataset.stage);
    }
  },
  {
    rootMargin: "-38% 0px -38% 0px",
    threshold: [0.1, 0.3, 0.5, 0.7],
  },
);

chapters.forEach((chapter) => {
  stageObserver.observe(chapter);
});

function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--progress", progress.toFixed(4));

  sceneCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const depth = Number(card.dataset.depth || 0.2);
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    card.style.setProperty("--scene-y", `${centerOffset * depth * 0.18}px`);
  });
}

window.addEventListener("scroll", () => {
  window.cancelAnimationFrame(scrollFrame);
  scrollFrame = window.requestAnimationFrame(updateScrollEffects);
});

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(scrollFrame);
  scrollFrame = window.requestAnimationFrame(updateScrollEffects);
});

window.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.cancelAnimationFrame(pointerFrame);
  pointerFrame = window.requestAnimationFrame(() => {
    const shiftX = (window.innerWidth / 2 - event.clientX) * 0.012;
    const shiftY = (window.innerHeight / 2 - event.clientY) * 0.01;
    root.style.setProperty("--shift-x", `${shiftX}px`);
    root.style.setProperty("--shift-y", `${shiftY}px`);
  });
});

const emailForm = document.querySelector("#emailForm");
const emailInput = document.querySelector("#emailInput");
const formNote = document.querySelector("#formNote");

emailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!email) {
    formNote.textContent = "请输入邮箱，用于加入 Maison Ignis 早期访问名单。";
    return;
  }

  formNote.textContent = "已在本地记录这次意向。接入后端接口后即可正式收集。";
  emailForm.reset();
});

updateScrollEffects();
