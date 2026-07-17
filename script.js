/* ============================================================
   PROPOSAL EXPERIENCE — SCRIPT
   Sections:
     1. State + helpers
     2. Ambient background (stars + floating hearts)
     3. Language gate + selection
     4. Screen navigation
     5. Reveal sequencing (screen 5)
     6. NO button dodge + YES button growth
     7. Celebration: confetti, heart explosion, music, vibration
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- 1. State ---------------- */
  const state = {
    lang: null,
    stepIndex: 0,
    noPressCount: 0,
    musicEnabled: false
  };

  const SCREEN_ORDER = [
    "screen-welcome",
    "screen-1",
    "screen-2",
    "screen-3",
    "screen-4",
    "screen-5",
    "celebrate"
  ];

  const t = (key) => (TRANSLATIONS[state.lang] && TRANSLATIONS[state.lang][key]) || TRANSLATIONS.en[key] || "";

  /* ---------------- 2. Ambient background ---------------- */

  function buildStars() {
    const layer = document.getElementById("stars-canvas");
    const count = window.innerWidth < 640 ? 26 : 46;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      const scale = 0.6 + Math.random() * 1.2;
      s.style.transform = `scale(${scale})`;
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }

  function buildFloatingHearts(container, count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.style.left = Math.random() * 100 + "%";
      h.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      h.style.animationDuration = (10 + Math.random() * 10) + "s";
      h.style.animationDelay = (Math.random() * -20) + "s";
      const size = 12 + Math.random() * 18;
      h.style.fontSize = size + "px";
      h.textContent = Math.random() > 0.5 ? "❤" : "♥";
      frag.appendChild(h);
    }
    container.appendChild(frag);
  }

  function initAmbient() {
    buildStars();
    buildFloatingHearts(document.getElementById("hearts-canvas"), window.innerWidth < 640 ? 10 : 16);
  }

  /* ---------------- 3. Language gate + selection ---------------- */

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val) el.innerHTML = val.replace(/\n/g, "<br>");
    });
  }

  function initGate() {
    const gate = document.getElementById("gate");
    const continueBtn = document.getElementById("gate-continue");
    continueBtn.addEventListener("click", () => {
      gate.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      gate.style.opacity = "0";
      gate.style.transform = "scale(1.03)";
      setTimeout(() => {
        gate.classList.add("hidden");
      }, 600);
    });
  }

  function initLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        spawnRipple(e, btn);
        const lang = btn.getAttribute("data-lang");
        setLanguage(lang);
        setTimeout(() => goToStep(1), 250);
      });
    });
  }

  function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.setAttribute("lang", lang);
    applyTranslations();
    const switcher = document.getElementById("lang-switch");
    switcher.textContent = "🌐 " + lang.toUpperCase();
    switcher.classList.add("show");
  }

  function initLangSwitch() {
    const switcher = document.getElementById("lang-switch");
    switcher.addEventListener("click", () => {
      goToStep(0);
    });
  }

  /* ---------------- 4. Screen navigation ---------------- */

  function goToStep(index) {
    if (index === state.stepIndex) return;
    const currentId = SCREEN_ORDER[state.stepIndex];
    const nextId = SCREEN_ORDER[index];
    const currentEl = document.getElementById(currentId);
    const nextEl = document.getElementById(nextId);

    if (currentEl) {
      currentEl.classList.add("leaving");
      currentEl.classList.remove("active");
      setTimeout(() => currentEl.classList.remove("leaving"), 700);
    }
    if (nextEl) {
      // Force reflow so the transition plays even if styles were just set
      void nextEl.offsetWidth;
      nextEl.classList.add("active");
    }
    state.stepIndex = index;
    updateProgress();

    if (nextId === "screen-5") {
      startRevealSequence();
    }
  }

  function updateProgress() {
    const dots = document.querySelectorAll("#progress .dot");
    dots.forEach((d, i) => d.classList.toggle("on", i === state.stepIndex));
  }

  function initNextButtons() {
    document.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        spawnRipple(e, btn);
        const target = parseInt(btn.getAttribute("data-next"), 10);
        goToStep(target);
      });
    });
  }

  function spawnRipple(e, el) {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    el.style.position = el.style.position || "relative";
    el.style.overflow = "hidden";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  /* ---------------- 5. Reveal sequencing (screen 5) ---------------- */

  let revealPlayed = false;

  function startRevealSequence() {
    if (revealPlayed) return;
    revealPlayed = true;
    const nameEl = document.getElementById("reveal-name");
    const lineEl = document.getElementById("reveal-line1");
    const qEl = document.getElementById("reveal-question");
    const decisionRow = document.getElementById("decision-row");

    setTimeout(() => nameEl.classList.add("show"), 200);
    setTimeout(() => lineEl.classList.add("show"), 900);
    setTimeout(() => {
      qEl.classList.add("show");
      decisionRow.classList.add("show");
    }, 2900);
  }

  /* ---------------- 6. NO button dodge + YES growth ---------------- */

  function initDecisionButtons() {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const caption = document.getElementById("no-caption");
    const row = document.getElementById("decision-row");

    let morphed = false;

    yesBtn.addEventListener("click", (e) => {
      spawnRipple(e, yesBtn);
      goToStep(6);
      launchCelebration();
    });

    noBtn.addEventListener("mouseenter", () => { if (!morphed) dodgeNo(); });
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (morphed) {
        spawnRipple(e, noBtn);
        goToStep(6);
        launchCelebration();
        return;
      }
      dodgeNo();
    });
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (morphed) {
        spawnRipple(e, noBtn);
        goToStep(6);
        launchCelebration();
        return;
      }
      dodgeNo();
    }, { passive: false });

    function dodgeNo() {
      state.noPressCount++;
      const messages = t("noMessages");
      const msg = messages[Math.min(state.noPressCount - 1, messages.length - 1)];
      caption.style.opacity = 0;
      setTimeout(() => {
        caption.textContent = msg;
        caption.style.opacity = 1;
      }, 150);

      // Grow YES, shrink/transform NO the more it's "pressed"
      const growth = Math.min(state.noPressCount * 0.06, 0.5);
      yesBtn.style.transform = `scale(${1 + growth})`;

      if (state.noPressCount >= 6) {
        morphNoIntoYes();
        return;
      }

      const rowRect = row.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const maxX = Math.max(rowRect.width - btnRect.width, 40);
      const maxY = Math.max(140 - btnRect.height, 20);
      const randX = (Math.random() - 0.5) * maxX;
      const randY = (Math.random() - 0.5) * maxY;
      const randRotate = (Math.random() - 0.5) * 40;

      noBtn.style.position = "relative";
      noBtn.style.left = randX + "px";
      noBtn.style.top = randY + "px";
      noBtn.style.transform = `rotate(${randRotate}deg) scale(${Math.max(1 - state.noPressCount * 0.08, 0.55)})`;
    }

    function morphNoIntoYes() {
      morphed = true;
      caption.textContent = "";
      noBtn.style.transition = "all 0.8s var(--ease-premium)";
      noBtn.style.left = "0px";
      noBtn.style.top = "0px";
      noBtn.style.transform = "scale(1)";
      noBtn.style.background = "linear-gradient(135deg, #7FD9A8, #4FBE86)";
      noBtn.style.color = "#fff";
      noBtn.style.border = "none";
      noBtn.textContent = t("yesBtn");
    }
  }

  /* ---------------- 7. Celebration ---------------- */

  let celebrationPlayed = false;

  function launchCelebration() {
    if (celebrationPlayed) return;
    celebrationPlayed = true;

    document.body.style.overflow = "hidden";

    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 80, 40, 160]);
    }

    fireConfetti();
    fireHeartExplosion();
    tryEnableMusic();

    const msg1 = document.getElementById("celebrate-msg1");
    const msg2 = document.getElementById("celebrate-msg2");
    const msg3 = document.getElementById("celebrate-msg3");
    const sign = document.getElementById("celebrate-sign");

    setTimeout(() => msg1.classList.add("show"), 300);
    setTimeout(() => msg2.classList.add("show"), 2600);
    setTimeout(() => msg3.classList.add("show"), 5200);
    setTimeout(() => sign.classList.add("show"), 7600);
  }

  function fireConfetti() {
    const colors = ["#F6A9C6", "#E7D8F7", "#FFEBC8", "#FFD9E3", "#ffffff"];
    const count = window.innerWidth < 640 ? 60 : 100;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        const size = 6 + Math.random() * 8;
        piece.style.width = size + "px";
        piece.style.height = size * (0.4 + Math.random() * 0.6) + "px";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        document.body.appendChild(piece);

        const duration = 2400 + Math.random() * 1800;
        const drift = (Math.random() - 0.5) * 200;
        const rotate = Math.random() * 720 - 360;

        piece.animate([
          { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${drift}px, 100vh) rotate(${rotate}deg)`, opacity: 0.9 }
        ], { duration, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" });

        setTimeout(() => piece.remove(), duration + 100);
      }, i * 18);
    }
  }

  function fireHeartExplosion() {
    const count = window.innerWidth < 640 ? 22 : 34;
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "heart-piece";
      piece.textContent = "❤";
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.fontSize = (16 + Math.random() * 22) + "px";
      piece.style.color = ["#F6A9C6", "#E7A8D0", "#FFB3C6"][Math.floor(Math.random() * 3)];
      document.body.appendChild(piece);

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const distance = 120 + Math.random() * (window.innerWidth < 640 ? 160 : 260);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 60;
      const duration = 1200 + Math.random() * 900;

      piece.animate([
        { transform: "translate(-50%,-50%) scale(0.3)", opacity: 1 },
        { transform: `translate(${dx - 50}%, ${dy - 50}%) scale(1.1) rotate(${(Math.random()-0.5)*80}deg)`, opacity: 0 }
      ], { duration, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" });

      setTimeout(() => piece.remove(), duration + 100);
    }
  }

  /* ---------------- Music ---------------- */

  function initMusicToggle() {
    const toggle = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-music");
    toggle.addEventListener("click", () => {
      if (state.musicEnabled) {
        audio.pause();
        state.musicEnabled = false;
        toggle.textContent = "🔇";
        toggle.setAttribute("aria-label", t("musicOff"));
      } else {
        audio.volume = 0.35;
        audio.play().then(() => {
          state.musicEnabled = true;
          toggle.textContent = "🔊";
          toggle.setAttribute("aria-label", t("musicOn"));
        }).catch(() => {
          /* Autoplay blocked or file missing — stay silent, icon unchanged */
        });
      }
    });
  }

  function tryEnableMusic() {
    const audio = document.getElementById("bg-music");
    const toggle = document.getElementById("music-toggle");
    if (state.musicEnabled) return;
    audio.volume = 0.35;
    audio.play().then(() => {
      state.musicEnabled = true;
      toggle.textContent = "🔊";
    }).catch(() => {
      /* Browser requires an explicit tap — the toggle button remains available */
    });
  }

  /* ---------------- Init ---------------- */

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage("en"); // default until chosen; gate/welcome screens still show language picker
    document.getElementById("lang-switch").classList.remove("show");
    initAmbient();
    initGate();
    initLanguageButtons();
    initLangSwitch();
    initNextButtons();
    initDecisionButtons();
    initMusicToggle();
    updateProgress();
    document.getElementById(SCREEN_ORDER[0]).classList.add("active");
  });
})();
