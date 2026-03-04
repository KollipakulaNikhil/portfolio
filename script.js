import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion) {
  root.classList.add("reduce-motion");
}

const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b1017, 6, 32);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0.4, 7);

const ambient = new THREE.HemisphereLight(0x8fd7ff, 0x0b1017, 0.7);
scene.add(ambient);

const keyLight = new THREE.PointLight(0x4fd1ff, 2.4, 26);
keyLight.position.set(4, 3, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xffb454, 1.6, 20);
rimLight.position.set(-4, -2, 4);
scene.add(rimLight);

const group = new THREE.Group();
scene.add(group);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.05, 2),
  new THREE.MeshStandardMaterial({
    color: 0x142232,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0x0f263d,
    emissiveIntensity: 0.7,
  })
);
group.add(core);

const ringA = new THREE.Mesh(
  new THREE.TorusGeometry(2.1, 0.06, 24, 260),
  new THREE.MeshStandardMaterial({
    color: 0x7be3ff,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x0b2332,
    emissiveIntensity: 0.6,
  })
);
ringA.rotation.x = Math.PI / 2.4;
group.add(ringA);

const ringB = new THREE.Mesh(
  new THREE.TorusGeometry(1.4, 0.04, 18, 200),
  new THREE.MeshStandardMaterial({
    color: 0xffb454,
    metalness: 0.4,
    roughness: 0.4,
    emissive: 0x2a1605,
    emissiveIntensity: 0.5,
  })
);
ringB.rotation.x = Math.PI / 3.4;
ringB.rotation.y = Math.PI / 5;
group.add(ringB);

const shield = new THREE.Mesh(
  new THREE.SphereGeometry(2.6, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x4fd1ff,
    transparent: true,
    opacity: 0.08,
    roughness: 0.12,
    metalness: 0.2,
    emissive: 0x0b2332,
    emissiveIntensity: 0.35,
  })
);
shield.material.side = THREE.DoubleSide;
group.add(shield);

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.15, 0.12, 140, 16),
  new THREE.MeshStandardMaterial({
    color: 0x7be3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    emissive: 0x0b2332,
    emissiveIntensity: 0.45,
  })
);
knot.rotation.x = Math.PI / 4;
group.add(knot);

const holoRing = new THREE.Mesh(
  new THREE.RingGeometry(2.0, 2.45, 64),
  new THREE.MeshBasicMaterial({
    color: 0x4fd1ff,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  })
);
holoRing.rotation.x = Math.PI / 2.2;
group.add(holoRing);

const satellites = new THREE.Group();
group.add(satellites);

const satelliteGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
const satelliteMat = new THREE.MeshStandardMaterial({
  color: 0x7df9c2,
  metalness: 0.25,
  roughness: 0.35,
  emissive: 0x0b2a22,
  emissiveIntensity: 0.6,
});

for (let i = 0; i < 4; i += 1) {
  const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
  sat.userData = {
    radius: 2.9 + i * 0.25,
    speed: 0.45 + i * 0.12,
    offset: (Math.PI * 2 * i) / 4,
    height: i % 2 === 0 ? 0.35 : -0.35,
  };
  sat.rotation.set(Math.random(), Math.random(), Math.random());
  satellites.add(sat);
}

const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0x4fd1ff,
  emissive: 0x0a3348,
  emissiveIntensity: 0.8,
  metalness: 0.4,
  roughness: 0.3,
});

const orbs = [];
for (let i = 0; i < 7; i += 1) {
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), orbMaterial);
  orb.userData = {
    radius: 2.4 + Math.random() * 0.7,
    speed: 0.4 + Math.random() * 0.4,
    offset: Math.random() * Math.PI * 2,
    height: (Math.random() - 0.5) * 1.6,
  };
  group.add(orb);
  orbs.push(orb);
}

const grid = new THREE.GridHelper(14, 30, 0x1a3652, 0x0f1c2a);
grid.position.y = -1.7;
grid.rotation.x = Math.PI / 2;
const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
gridMaterials.forEach((material) => {
  material.opacity = 0.25;
  material.transparent = true;
});
scene.add(grid);

const starGeo = new THREE.BufferGeometry();
const starCount = 900;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 40;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 30;
  starPositions[i3 + 2] = -10 - Math.random() * 30;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0x5a6b82, size: 0.06 })
);
scene.add(stars);

const mistGeo = new THREE.BufferGeometry();
const mistCount = 320;
const mistPositions = new Float32Array(mistCount * 3);
for (let i = 0; i < mistCount; i += 1) {
  const i3 = i * 3;
  mistPositions[i3] = (Math.random() - 0.5) * 12;
  mistPositions[i3 + 1] = (Math.random() - 0.5) * 10;
  mistPositions[i3 + 2] = (Math.random() - 0.5) * 12;
}
mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
const mist = new THREE.Points(
  mistGeo,
  new THREE.PointsMaterial({
    color: 0x2bd0ff,
    size: 0.12,
    opacity: 0.35,
    transparent: true,
  })
);
scene.add(mist);

const clock = new THREE.Clock();
const pointer = { x: 0, y: 0 };

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.8;
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.6;
});

let scrollTarget = window.scrollY;
let scrollCurrent = scrollTarget;
let projectSpinOffset = 0;

window.addEventListener(
  "scroll",
  () => {
    scrollTarget = window.scrollY;
  },
  { passive: true }
);

function updateScrollVars() {
  scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollCurrent / maxScroll : 0;
  root.style.setProperty("--scroll", progress.toFixed(3));
  const spinMax = reduceMotion ? 90 : 540;
  const spin = progress * spinMax + projectSpinOffset;
  root.style.setProperty("--spin", `${spin}deg`);
  return progress;
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

function animate() {
  const time = clock.getElapsedTime();
  const speed = reduceMotion ? 0.15 : 1;
  const scrollProgress = updateScrollVars();

  group.rotation.y = time * 0.25 * speed + scrollProgress * 1.6;
  group.rotation.x = Math.sin(time * 0.3) * 0.2;
  group.position.y = Math.sin(time * 0.2) * 0.08;
  ringA.rotation.z = time * 0.2 * speed;
  ringB.rotation.y = time * 0.3 * speed;
  shield.rotation.y = time * 0.08 * speed;
  knot.rotation.y = time * 0.25 * speed;
  knot.rotation.z = time * 0.2 * speed;
  holoRing.rotation.z = time * 0.15 * speed;

  orbs.forEach((orb) => {
    const { radius, speed: orbSpeed, offset, height } = orb.userData;
    const angle = time * orbSpeed * speed + offset;
    orb.position.set(
      Math.cos(angle) * radius,
      height + Math.sin(angle * 1.4) * 0.4,
      Math.sin(angle) * radius
    );
  });

  satellites.children.forEach((sat) => {
    const { radius, speed: satSpeed, offset, height } = sat.userData;
    const angle = time * satSpeed * speed + offset + scrollProgress * 2;
    sat.position.set(
      Math.cos(angle) * radius,
      height + Math.sin(angle * 1.6) * 0.3,
      Math.sin(angle) * radius
    );
    sat.rotation.x = time * 0.6 * speed;
    sat.rotation.y = time * 0.45 * speed;
  });

  mist.rotation.y = time * 0.05 * speed;
  stars.rotation.y = time * 0.02 * speed;

  camera.position.x += (pointer.x - camera.position.x) * 0.04;
  camera.position.y += (pointer.y - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll("[data-reveal]").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

if (!reduceMotion) {
  const tiltTargets = document.querySelectorAll("[data-tilt]");
  tiltTargets.forEach((el) => {
    let rect = null;
    el.addEventListener("pointermove", (event) => {
      rect = rect || el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * 12).toFixed(2);
      const rotateY = (x * 12).toFixed(2);
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener("pointerleave", () => {
      rect = null;
      el.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

const carousel = document.querySelector(".carousel");
const carouselCards = Array.from(document.querySelectorAll(".carousel-card"));
const consoleCards = Array.from(document.querySelectorAll(".console-card"));
const projectTabs = Array.from(document.querySelectorAll(".project-tab"));

if (carousel && carouselCards.length > 0) {
  const countValue = Number(
    getComputedStyle(carousel).getPropertyValue("--count").trim()
  );
  const total = Number.isFinite(countValue) && countValue > 0 ? countValue : carouselCards.length;
  const step = 360 / total;

  const setActiveProject = (index) => {
    projectSpinOffset = -index * step;
    carouselCards.forEach((card) => {
      const active = Number(card.dataset.project) === index;
      card.classList.toggle("is-active", active);
    });
    consoleCards.forEach((card) => {
      const active = Number(card.dataset.project) === index;
      card.classList.toggle("active", active);
    });
    projectTabs.forEach((tab) => {
      const active = Number(tab.dataset.projectTab) === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  setActiveProject(0);

  projectTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.projectTab);
      if (!Number.isNaN(index)) {
        setActiveProject(index);
      }
    });
  });

  carouselCards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.project);
      if (!Number.isNaN(index)) {
        setActiveProject(index);
      }
    });
  });
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');
const topbar = document.querySelector(".topbar");
const getNavOffset = () => (topbar ? topbar.getBoundingClientRect().height + 16 : 90);

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + diff * eased);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") {
      return;
    }
    const target = document.querySelector(href);
    if (!target) {
      return;
    }
    event.preventDefault();
    const targetY = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - getNavOffset()
    );
    if (reduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    smoothScrollTo(targetY);
  });
});

