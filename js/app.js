/*
 * CUPRA Training Experience – Pitch-Prototyp
 * Zwei umschaltbare Zustände:
 *   Phase 0 (Figma CUPRA-GLT-27): Intro → Intro-Video → Dashboard → ORIGIN → Story Capsule → Born in Barcelona (Streak Challenge)
 *   Phase 1 (Konzept v2):         Opener → Home → Delta-Profil, K1 Refresher, Archiv, Leaderboard
 * Router über history.pushState, Zustand in localStorage, kein Build-Schritt.
 */
(function () {
  "use strict";

  var CFG = window.CTE_CONFIG || {};
  var P = CFG.points || {};
  var P0 = CFG.p0 || {};
  var STORAGE_KEY = "cte.v3";
  var RING44 = 113.1;
  var RING32 = 97.4;

  var DEFAULT_STATE = {
    phase: typeof CFG.phaseDefault === "number" ? CFG.phaseDefault : 0,
    // Phase 1
    openerSeen: false,
    nuggetSeen: false,
    k1Done: false,
    k1Score: 0,
    badgeEarned: false,
    streakBest: null,
    // Phase 0
    p0: { introSeen: false, nuggetSeen: false, challengeDone: false, challengeScore: 0, badgeEarned: false, bib: { claimed: {}, points: 0 } },
  };

  /* ---------- Helpers ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); }

  /* ---------- State ---------- */

  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var s = Object.assign({}, DEFAULT_STATE, raw ? JSON.parse(raw) : {});
      s.p0 = Object.assign({}, DEFAULT_STATE.p0, s.p0 || {});
      s.p0.bib = Object.assign({ claimed: {}, points: 0 }, s.p0.bib || {});
      return s;
    } catch (e) { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
  }
  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function resetState(keepPhase) {
    var phase = state.phase;
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    if (keepPhase) state.phase = phase;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (keepPhase) saveState();
  }

  function isP0() { return state.phase === 0; }
  // Content Nuggets vergeben keine Punkte. Punkte kommen nur aus Challenges.
  function phasePoints() { return state.k1Done ? state.k1Score : 0; }
  function p0Points() { return state.p0.challengeDone ? state.p0.challengeScore : 0; }
  function badgeCount() { return CFG.phase0.chapters.length + (state.badgeEarned ? 1 : 0); }
  function streakBest() { return state.streakBest === null ? CFG.demo.streakBest : state.streakBest; }

  /* ---------- DOM ---------- */

  var scrollEl = $("#scroll");
  var screens = {};
  $$(".screen").forEach(function (s) { screens[s.getAttribute("data-screen")] = s; });
  var bgs = {};
  $$("[data-bg]").forEach(function (b) { bgs[b.getAttribute("data-bg")] = b; });
  var glow = $("[data-glow]");
  var tabbar = $("[data-tabbar]");
  var sheet = $("[data-sheet]");
  var toast = $("[data-toast]");

  function fillStatic() {
    $$("[data-copy]").forEach(function (el) { var v = CFG.copy[el.getAttribute("data-copy")]; if (v) el.textContent = v; });
    $$("[data-k1]").forEach(function (el) { var v = get(CFG.k1, el.getAttribute("data-k1")); if (v) el.textContent = v; });
    $$("[data-p0]").forEach(function (el) { var v = get(P0, el.getAttribute("data-p0")); if (v != null) el.textContent = v; });
    $$("[data-bib]").forEach(function (el) { var v = get(P0.bib || {}, el.getAttribute("data-bib")); if (v != null) el.textContent = v; });
    $$("[data-demo]").forEach(function (el) { var v = CFG.demo[el.getAttribute("data-demo")]; if (v != null) el.textContent = v; });
    $$("[data-fmt]").forEach(function (el) { var v = P[el.getAttribute("data-fmt")]; if (v != null) el.textContent = fmt(v); });
    var chip = $("[data-delta-chip]"); if (chip) chip.textContent = CFG.delta.k1Chip;
    var fb = $("[data-delta-feedback]"); if (fb) fb.textContent = CFG.delta.feedback;
    var lines = $("[data-opener-lines]");
    if (lines) lines.innerHTML = CFG.copy.openerLines.map(function (l) { return '<p class="opener__line">' + esc(l) + "</p>"; }).join("");
    var ob = $("[data-opener-badges]");
    if (ob) ob.innerHTML = CFG.phase0.chapters.map(function () { return '<img src="/assets/badge-copper.svg" alt="">'; }).join("");
    $$("[data-intro0-lines], [data-opener-carousel]").forEach(function (il) {
      var arr = P0.introLines || [];
      il.innerHTML = arr.concat([arr[0]]).map(function (l, i) {
        return '<p class="intro0__line' + (i === arr.length - 1 ? " intro0__line--last" : "") + '">' + esc(l) + "</p>";
      }).join("");
    });
  }

  function updateCounters() {
    $$("[data-phase-points]").forEach(function (el) { el.textContent = phasePoints(); });
    $$("[data-p0-points]").forEach(function (el) { el.textContent = p0Points(); });
    $$("[data-badge-count]").forEach(function (el) { el.textContent = badgeCount(); });
    $$("[data-streak-best]").forEach(function (el) { el.textContent = streakBest(); });
    $$("[data-phase-toggle] button").forEach(function (b) { b.classList.toggle("is-active", parseInt(b.getAttribute("data-phase"), 10) === state.phase); });
  }

  function setRing(ringEl, pct, done, length) {
    if (!ringEl) return;
    var fill = $("[data-ring-fill]", ringEl);
    if (fill) fill.style.strokeDashoffset = String((length || RING44) * (1 - clamp(pct, 0, 1)));
    var check = $("[data-ring-check]", ringEl);
    if (check) check.hidden = !done;
  }

  function vibrate(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignore */ } }

  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- Router ---------- */

  var PARENT = {
    intro0: "/", introvideo: "/", dashboard: "/", chapter0: "/", nugget0: "/chapter/origin", bib: "/chapter/origin",
    profile: "/", k1: "/", nugget: "/chapter/refresher", cintro: "/chapter/refresher", cplay: "/chapter/refresher/challenge", result: "/", badge: "/",
    archive: "/", leaderboard: "/", home: "/", opener: "/",
  };
  var current = null;

  function normalize(path) {
    path = (path || "/").replace(/\/index\.html$/, "").replace(/\/+$/, "");
    return path === "" ? "/" : path;
  }

  function resolve(path) {
    path = normalize(path);
    if (path === "/profile") return "profile";
    if (isP0()) {
      switch (path) {
        case "/": case "/home": return state.p0.introSeen ? "dashboard" : "intro0";
        case "/intro/video": return "introvideo";
        case "/chapter/origin": return "chapter0";
        case "/chapter/origin/nugget": return "nugget0";
        case "/chapter/origin/challenge": return "bib";
        case "/chapter/origin/result": return state.p0.challengeDone ? "result" : null;
        case "/chapter/origin/badge": return state.p0.challengeDone ? "badge" : null;
        default: return null;
      }
    }
    switch (path) {
      case "/": case "/home": return state.openerSeen ? "home" : "opener";
      case "/chapter/refresher": return "k1";
      case "/chapter/refresher/nugget": return "nugget";
      case "/chapter/refresher/challenge": return "cintro";
      case "/chapter/refresher/challenge/play": return "cplay";
      case "/chapter/refresher/result": return state.k1Done ? "result" : null;
      case "/chapter/refresher/badge": return state.k1Done ? "badge" : null;
      case "/archive": return "archive";
      case "/leaderboard": return "leaderboard";
      default: return null;
    }
  }

  function depth() { return (history.state && typeof history.state.depth === "number") ? history.state.depth : 0; }

  function navigate(path, opts) {
    opts = opts || {};
    path = normalize(path);
    if (opts.replace) history.replaceState({ depth: depth() }, "", path);
    else history.pushState({ depth: depth() + 1 }, "", path);
    render(path);
  }

  function goBack() {
    if (depth() > 0) history.back();
    else navigate(PARENT[current] || "/", { replace: true });
  }

  function render(path) {
    var id = resolve(path);
    if (!id) { history.replaceState({ depth: depth() }, "", "/"); id = resolve("/"); }

    clearTimers();
    closeSheet();
    closeConfirm();
    stopBibTimer();
    setGlow(null);
    stopVideos();

    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== id; });
    var el = screens[id];
    current = id;

    var variant = el.getAttribute("data-bgvariant") || "blur";
    Object.keys(bgs).forEach(function (k) { bgs[k].hidden = k !== variant; });

    var tab = el.getAttribute("data-tab");
    var showTab = !!tab && !isP0();
    tabbar.hidden = !showTab;
    el.classList.toggle("has-tabbar", showTab);
    $$(".tab", tabbar).forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-tab-id") === tab); });

    updateCounters();
    if (enter[id]) enter[id](el);

    window.scrollTo(0, 0);
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  window.addEventListener("popstate", function () { render(location.pathname); });

  function setGlow(kind) {
    if (!glow) return;
    glow.classList.remove("is-correct", "is-wrong");
    if (kind) glow.classList.add(kind === "correct" ? "is-correct" : "is-wrong");
  }

  function stopVideos() {
    $$("video").forEach(function (v) { try { v.pause(); } catch (e) { /* ignore */ } });
  }

  /* ---------- Screens ---------- */

  var enter = {};

  /* ===== PHASE 0 ===== */

  // Textkarussell: „THE ONE" steht, rechts laufen die Zeilen durch die Maske nach oben.
  // loop=false stoppt nach der letzten Zeile.
  function startCarousel(lines, mask, delay, loop) {
    var items = $$(".intro0__line", lines);
    var n = items.length - 1;
    var index = 0;

    function position(i, instant) {
      var item = items[i];
      if (!item) return;
      var center = mask.clientHeight / 2;
      var y = center - (item.offsetTop + item.offsetHeight / 2);
      lines.classList.toggle("no-anim", !!instant);
      lines.style.transform = "translateY(" + y + "px)";
      items.forEach(function (it, k) { it.classList.toggle("is-active", k === i); });
      if (instant) { void lines.offsetHeight; lines.classList.remove("no-anim"); }
    }

    position(0, true);
    function step() {
      index += 1;
      if (index > n) { index = 0; position(0, true); index = 1; }
      if (!loop && index >= n) { return; }
      position(index, false);
      later(step, index === n - 1 ? delay * 1.6 : delay);
    }
    later(step, delay);
  }

  function prepareIntroVideo() {
    var src = CFG.video && CFG.video.intro;
    var video = $("[data-intro-video]");
    if (!src || !video) return;
    if (video.getAttribute("src") !== src) {
      video.setAttribute("src", src);
      if (CFG.video.introPoster) video.setAttribute("poster", CFG.video.introPoster);
      video.preload = "auto";
      try { video.load(); } catch (e) { /* ignore */ }
    }
  }

  enter.intro0 = function (el) {
    prepareIntroVideo();
    var enterBtn = $(".intro0__enter", el);
    enterBtn.classList.remove("is-visible");
    later(function () { enterBtn.classList.add("is-visible"); }, (P0.intro && P0.intro.skipAfterMs) || 2000);
    startCarousel($("[data-intro0-lines]", el), $(".intro0__mask", el), (P0.intro && P0.intro.lineDelayMs) || 1500, true);
  };

  function enterIntro() {
    navigate("/intro/video");
  }

  // INTRO VIDEO: echtes Video, wenn hinterlegt, sonst Platzhalter mit Auto-Weiter
  enter.introvideo = function (el) {
    var video = $("[data-intro-video]", el);
    var fallback = $("[data-intro-fallback]", el);
    var src = CFG.video && CFG.video.intro;
    var unmute = $("[data-intro-unmute]", el);
    unmute.hidden = true;
    if (src) {
      fallback.hidden = true;
      video.hidden = false;
      prepareIntroVideo();
      try { video.currentTime = 0; } catch (e) { /* ignore */ }
      video.onended = finishIntroVideo;
      // Mit Ton starten: der Enter-Tap gilt als Nutzergeste. Wird das blockiert
      // (z. B. Direktaufruf der URL), stumm starten und „Sound on" anbieten.
      video.muted = false;
      var p = video.play();
      if (p && p.catch) {
        p.catch(function () {
          video.muted = true;
          var q = video.play();
          if (q && q.catch) q.catch(function () { /* Skip bleibt */ });
          unmute.hidden = false;
        });
      }
    } else {
      video.hidden = true;
      fallback.hidden = false;
      later(finishIntroVideo, (CFG.video && CFG.video.introFallbackMs) || 6000);
    }
  };

  function finishIntroVideo() {
    state.p0.introSeen = true;
    saveState();
    navigate("/", { replace: true });
  }

  // DASHBOARD
  enter.dashboard = function (el) {
    $("[data-p0-chapters]", el).innerHTML = P0.chapters.map(renderP0Card).join("");
    var ring = $("[data-ring]", el);
    if (ring) setRing(ring, p0Points() / P.chapterMax, state.p0.challengeDone, RING32);
    tickCountdowns();
  };

  function renderP0Card(c) {
    var open = !!c.open;
    var done = open && state.p0.challengeDone;
    var left, stateHtml, attrs, cls;
    if (open) {
      left = '<div class="ring32" data-ring><svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><circle class="ring32__track" cx="16" cy="16" r="15.5"/><circle class="ring32__fill" cx="16" cy="16" r="15.5" data-ring-fill/></svg>' +
        (done ? '<span class="ring32__check" aria-hidden="true">✓</span>' : "") + "</div>";
      stateHtml = (done ? "Completed" : "Open") + " &nbsp;·&nbsp; <b>" + p0Points() + " / " + P.chapterMax + " pts</b>";
      attrs = 'data-nav="/chapter/origin"';
      cls = "";
    } else {
      left = '<div class="ring32 ring32--locked"><svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><circle class="ring32__track" cx="16" cy="16" r="15.5"/></svg><img class="ring32__lock" src="/assets/figma/icon-lock.svg" alt=""></div>';
      stateHtml = 'Unlocks in &nbsp;·&nbsp; <b class="countdown" data-countdown="' + c.id + '" data-countdown-source="p0"></b>';
      attrs = 'data-action="teaser0" data-chapter="' + c.id + '"';
      cls = " ccard--locked";
    }
    return (
      '<li><button type="button" class="ccard' + cls + '" ' + attrs + ">" +
        '<img class="ccard__img" src="' + c.image + '" alt="">' +
        '<div class="ccard__overlay"></div>' +
        '<div class="ccard__text"><p class="overline tr15">' + esc(c.index) + '</p><p class="ccard__name">' + esc(c.name) + '</p><p class="ccard__claim">' + esc(c.claim) + "</p></div>" +
        '<div class="ccard__score">' + left + '<p class="ccard__state">' + stateHtml + "</p></div>" +
      "</button></li>"
    );
  }

  // CHAPTER ORIGIN
  enter.chapter0 = function (el) {
    var done = state.p0.challengeDone;
    $("[data-p0-chapter-state]", el).textContent = P0.chapters[0].index + "  ·  " + (done ? "Completed" : "Open");
    setRing($("[data-ring]", el), p0Points() / P.chapterMax, done, RING32);

    var nug = $('[data-card="nugget0"]', el);
    var ch = $('[data-card="challenge0"]', el);
    nug.classList.toggle("ccrow--hi", !state.p0.nuggetSeen);
    ch.classList.toggle("ccrow--hi", state.p0.nuggetSeen && !done);
    $("[data-card-state]", nug).innerHTML = state.p0.nuggetSeen
      ? '<img src="/assets/figma/icon-check-circle.svg" alt="Watched">'
      : "Watch";
    $("[data-card-state]", ch).innerHTML = done
      ? '<img src="/assets/figma/icon-check-circle.svg" alt="Completed">'
      : "Play";
  };

  // STORY CAPSULE (Kapitel-Video)
  var nugget0Reveal = null;
  enter.nugget0 = function (el) {
    var thumb = $(".vthumb", el);
    var video = $("[data-nugget-video]", el);
    var progress = $("[data-video-progress]", el);
    var src = CFG.video && CFG.video.storyCapsule;
    var revealed = false;

    thumb.classList.remove("is-playing");
    video.hidden = true;
    progress.style.transitionDuration = "0ms";

    nugget0Reveal = function () {
      if (revealed) return;
      revealed = true;
      state.p0.nuggetSeen = true;
      saveState();
      progress.style.transitionDuration = "300ms";
      thumb.classList.add("is-playing");
      updateCounters();
    };

    if (state.p0.nuggetSeen) { revealed = true; thumb.classList.add("is-playing"); return; }

    if (src) {
      // Echtes Video: Tap startet, am Ende gilt der Nugget als gesehen
      if (video.getAttribute("src") !== src) video.setAttribute("src", src);
      video.onended = function () { nugget0Reveal(); };
      video.ontimeupdate = function () {
        if (video.duration) progress.style.transform = "scaleX(" + (video.currentTime / video.duration) + ")";
      };
      nugget0Play = function () {
        video.hidden = false;
        thumb.classList.add("is-playing");
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* ignore */ });
      };
    } else {
      // Mock: Balken läuft, nach revealAfterMs gilt der Nugget als gesehen
      nugget0Play = null;
      later(function () { progress.style.transitionDuration = CFG.nugget.revealAfterMs + "ms"; thumb.classList.add("is-playing"); }, 60);
      later(function () { nugget0Reveal(); }, CFG.nugget.revealAfterMs);
    }
  };
  var nugget0Play = null;

  function nugget0Tap() {
    if (nugget0Play) { nugget0Play(); nugget0Play = null; return; }
    if (nugget0Reveal) nugget0Reveal();
  }

  // Teaser für gesperrte Phase-0-Kapitel
  function openSheet0(chapterId) {
    var c = P0.chapters.filter(function (ch) { return ch.id === chapterId; })[0];
    if (!c) return;
    $("[data-sheet-eyebrow]", sheet).textContent = c.index + " · Locked";
    $("[data-sheet-title]", sheet).textContent = c.name;
    $("[data-sheet-teaser]", sheet).textContent = c.teaser || c.claim;
    var lock = $("[data-sheet-lock]", sheet);
    lock.setAttribute("data-countdown", c.id);
    lock.setAttribute("data-countdown-source", "p0");
    lock.setAttribute("data-countdown-prefix", "Unlocks in ");
    lock.setAttribute("data-countdown-seconds", "");
    sheet.hidden = false;
    tickCountdowns();
  }

  /* ===== BORN IN BARCELONA (Hotspot-Challenge) ===== */

  var B = P0.bib || { districts: [], copy: {}, points: {}, timerMs: 10000 };
  var bib = null; // Laufzustand: { active, attempt, order, deadline, raf }

  function bibClaimedCount() { return Object.keys(state.p0.bib.claimed || {}).length; }
  function bibAllClaimed() { return bibClaimedCount() >= B.districts.length; }
  function bibDistrict(id) { return B.districts.filter(function (d) { return d.id === id; })[0]; }

  enter.bib = function (el) {
    bib = { active: null, attempt: 1, order: [], deadline: 0, raf: null };
    renderBibMap(el);
    renderBibProgress(el);
    if (bibAllClaimed()) {
      showBibResult(el, { label: B.copy.allDone, verdict: "correct", explain: "", points: state.p0.bib.points, finish: true });
    } else {
      showBibState(el, "select");
    }
  };

  function renderBibMap(el) {
    var claimed = state.p0.bib.claimed || {};
    $$(".bib-d", el).forEach(function (g) {
      var id = g.getAttribute("data-district");
      g.classList.remove("is-active", "is-full", "is-half", "is-none", "is-claimed");
      if (claimed[id]) g.classList.add("is-" + claimed[id], "is-claimed");
      if (bib && bib.active === id) g.classList.add("is-active");
    });
  }

  function renderBibProgress(el) {
    var claimed = state.p0.bib.claimed || {};
    var n = bibClaimedCount();
    $("[data-bib-bar]", el).style.width = (n / B.districts.length * 100) + "%";
    $("[data-bib-progress]", el).innerHTML = (B.copy.progress || "{n}/4 districts claimed").replace("{n}", "<b>" + n + "</b>").replace("/4", "/" + B.districts.length);
  }

  function showBibState(el, name) {
    $$("[data-bib-state]", el).forEach(function (st) { st.hidden = st.getAttribute("data-bib-state") !== name; });
  }

  function bibSelect(id) {
    var el = screens.bib;
    var d = bibDistrict(id);
    if (!bib || bib.active || !d || state.p0.bib.claimed[id]) return;
    bib.active = id;
    bib.attempt = 1;
    bib.order = shuffle(d.answers.map(function (a, i) { return i; }));
    renderBibMap(el);
    $("[data-bib-district]", el).textContent = d.name;
    $("[data-bib-question]", el).textContent = d.question;
    $("[data-bib-retry]", el).hidden = true;
    $("[data-bib-answers]", el).innerHTML = bib.order.map(function (ai, k) {
      return '<button type="button" class="ans" data-action="bib-answer" data-answer="' + ai + '">' + esc(d.answers[ai]) + "</button>";
    }).join("");
    showBibState(el, "question");
    startBibTimer(el);
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  function startBibTimer(el) {
    stopBibTimer();
    var total = B.timerMs || 10000;
    bib.deadline = Date.now() + total;
    var timerEl = $("[data-bib-timer]", el);
    var ring = $("[data-bib-timer-ring]", el);
    var num = $("[data-bib-timer-num]", el);
    var CIRC = 87.96;
    function tick() {
      if (!bib || current !== "bib") return;
      var remaining = Math.max(0, bib.deadline - Date.now());
      var f = remaining / total;
      ring.style.strokeDashoffset = String(CIRC * (1 - f));
      num.textContent = String(Math.ceil(remaining / 1000));
      timerEl.classList.toggle("is-warn", f <= 0.5 && f > 0.2);
      timerEl.classList.toggle("is-critical", f <= 0.2);
      if (remaining <= 0) { bibWrong(null, true); return; }
      bib.raf = requestAnimationFrame(tick);
    }
    tick();
  }

  function stopBibTimer() {
    if (bib && bib.raf) { cancelAnimationFrame(bib.raf); bib.raf = null; }
  }

  function bibAnswer(idx) {
    if (!bib || !bib.active) return;
    var d = bibDistrict(bib.active);
    var el = screens.bib;
    stopBibTimer();
    var btn = $('[data-bib-answers] [data-answer="' + idx + '"]', el);
    if (idx === d.correct) {
      if (btn) btn.classList.add("is-correct");
      $$(".ans", el).forEach(function (a) { a.disabled = true; });
      var kind = bib.attempt === 1 ? "full" : "half";
      later(function () { bibClaim(kind); }, 650);
    } else {
      bibWrong(idx, false);
    }
  }

  function bibWrong(idx, timeout) {
    var el = screens.bib;
    var d = bibDistrict(bib.active);
    if (idx != null) {
      var btn = $('[data-bib-answers] [data-answer="' + idx + '"]', el);
      if (btn) btn.classList.add("is-wrong");
    }
    if (bib.attempt === 1) {
      bib.attempt = 2;
      var hint = $("[data-bib-retry]", el);
      hint.textContent = timeout ? B.copy.timeout : B.copy.retry;
      hint.hidden = false;
      startBibTimer(el);
    } else {
      // Zweiter Versuch daneben: richtige Antwort zeigen, Gebiet ohne Kupfer claimen
      var right = $('[data-bib-answers] [data-answer="' + d.correct + '"]', el);
      if (right) right.classList.add("is-outline");
      $$(".ans", el).forEach(function (a) { a.disabled = true; });
      later(function () { bibClaim("none"); }, 900);
    }
  }

  function bibClaim(kind) {
    var el = screens.bib;
    var d = bibDistrict(bib.active);
    var pts = kind === "full" ? B.points.full : kind === "half" ? B.points.half : 0;
    state.p0.bib.claimed[d.id] = kind;
    state.p0.bib.points = (state.p0.bib.points || 0) + pts;
    saveState();
    if (kind === "full") vibrate([30, 40, 30]);
    bib.active = null;
    bib.lastClaimed = d.id;
    $$(".bib-d", el).forEach(function (g) { if (g.getAttribute("data-district") === d.id) g.classList.add("is-" + kind, "is-claimed"); g.classList.remove("is-active"); });
    renderBibProgress(el);
    showBibResult(el, {
      label: kind === "full" ? B.copy.correct : kind === "half" ? B.copy.half : B.copy.none,
      verdict: kind === "none" ? "wrong" : "correct",
      explain: d.explain,
      points: pts,
      finish: bibAllClaimed(),
    });
  }

  function showBibResult(el, o) {
    $("[data-bib-verdict-label]", el).textContent = o.label;
    $("[data-bib-explain]", el).textContent = o.explain || "";
    var gain = $("[data-bib-gain]", el);
    gain.hidden = !o.points;
    $("[data-bib-gain-value]", el).textContent = o.points;
    $("[data-bib-next]", el).textContent = o.finish ? B.copy.finish : B.copy.next;
    $("[data-bib-next]", el).setAttribute("data-finish", o.finish ? "1" : "0");
    showBibState(el, "result");
  }

  function bibNext() {
    var el = screens.bib;
    var finish = $("[data-bib-next]", el).getAttribute("data-finish") === "1";
    if (finish) {
      // Alle vier geclaimt: Karte pulsiert einmal, dann Result der Microsite
      $("[data-bib-map]", el).classList.add("is-pulse");
      state.p0.challengeDone = true;
      state.p0.challengeScore = Math.max(state.p0.challengeScore || 0, state.p0.bib.points || 0);
      saveState();
      later(function () { $("[data-bib-map]", el).classList.remove("is-pulse"); navigate("/chapter/origin/result"); }, 950);
      return;
    }
    showBibState(el, "select");
    renderBibMap(el);
  }

  function bibBack() {
    if (bib && bib.active) {
      openConfirm({
        title: B.copy.leaveTitle, text: B.copy.leaveText, yes: B.copy.leave, no: B.copy.stay,
        onYes: function () { stopBibTimer(); bib.active = null; goBack(); },
      });
      return;
    }
    goBack();
  }

  /* ---------- Bestätigungsdialog ---------- */

  var confirmEl = $("[data-confirm]");
  var confirmYes = null;
  function openConfirm(o) {
    $("[data-confirm-title]", confirmEl).textContent = o.title || "";
    $("[data-confirm-text]", confirmEl).textContent = o.text || "";
    $("[data-confirm-yes]", confirmEl).textContent = o.yes || "OK";
    $("[data-confirm-no]", confirmEl).textContent = o.no || "Cancel";
    confirmYes = o.onYes || null;
    confirmEl.hidden = false;
  }
  function closeConfirm() { confirmEl.hidden = true; confirmYes = null; }

  /* ===== PHASE 1 ===== */

  // OPENER
  enter.opener = function (el) {
    var O = CFG.opener;
    var skip = $(".skip", el);
    var enterBtn = $("[data-opener-enter]", el);
    var n = (P0.introLines || []).length;
    el.classList.remove("phase-claim", "phase-badges", "phase-outro");
    skip.classList.remove("is-visible");
    enterBtn.classList.remove("is-visible");

    startCarousel($("[data-opener-carousel]", el), $(".intro0__mask", el), O.lineDelayMs, false);
    var tClaim = O.lineDelayMs * n + 600;
    var tBadges = tClaim + O.claimHoldMs;
    var tOutro = tBadges + O.badgesHoldMs;
    later(function () { skip.classList.add("is-visible"); }, O.skipAfterMs);
    later(function () { el.classList.add("phase-claim"); }, tClaim);
    later(function () { el.classList.remove("phase-claim"); el.classList.add("phase-badges"); }, tBadges);
    later(function () { el.classList.remove("phase-badges"); el.classList.add("phase-outro"); enterBtn.classList.add("is-visible"); }, tOutro);
    later(finishOpener, tOutro + O.outroHoldMs);
  };

  function finishOpener() {
    state.openerSeen = true;
    saveState();
    navigate("/", { replace: true });
  }

  // HOME
  enter.home = function (el) {
    var cta = $("[data-home-cta]", el);
    cta.removeAttribute("data-action");
    cta.removeAttribute("data-chapter");
    if (state.k1Done && !state.badgeEarned) {
      cta.textContent = "Claim your badge";
      cta.setAttribute("data-nav", "/chapter/refresher/badge");
    } else if (state.k1Done) {
      cta.textContent = "Continue: Chapter 02";
      cta.setAttribute("data-nav", "");
      cta.setAttribute("data-action", "teaser");
      cta.setAttribute("data-chapter", "k2");
    } else {
      cta.textContent = "Continue: Refresher";
      cta.setAttribute("data-nav", "/chapter/refresher");
    }
    $("[data-chapters]", el).innerHTML = CFG.chapters.map(renderP1Card).join("");
    setRing($(".dash-status [data-ring]", el), phasePoints() / P.chapterMax, state.k1Done, RING32);
    var k1ring = $('[data-chapters] [data-ring]', el);
    if (k1ring) setRing(k1ring, phasePoints() / P.chapterMax, state.k1Done, RING32);
    tickCountdowns();
  };

  function imageCard(opts) {
    var left;
    if (opts.state === "locked") {
      left = '<div class="ring32 ring32--locked"><svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><circle class="ring32__track" cx="16" cy="16" r="15.5"/></svg><img class="ring32__lock" src="/assets/figma/icon-lock.svg" alt=""></div>';
    } else {
      left = '<div class="ring32"' + (opts.ring ? " data-ring" : "") + '><svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><circle class="ring32__track" cx="16" cy="16" r="15.5"/>' +
        (opts.ring ? '<circle class="ring32__fill" cx="16" cy="16" r="15.5" data-ring-fill' + (opts.full ? ' style="stroke-dashoffset:0"' : "") + "/>" : "") + "</svg>" +
        (opts.state === "completed" ? '<span class="ring32__check" aria-hidden="true">✓</span>' : "") + "</div>";
    }
    return (
      '<li><button type="button" class="ccard' + (opts.state === "locked" ? " ccard--locked" : "") + '" ' + opts.attrs + ">" +
        '<img class="ccard__img" src="' + opts.image + '" alt="">' +
        '<div class="ccard__overlay"></div>' +
        '<div class="ccard__text"><p class="overline tr15">' + esc(opts.index) + '</p><p class="ccard__name">' + esc(opts.name) + '</p><p class="ccard__claim">' + esc(opts.claim || "") + "</p></div>" +
        '<div class="ccard__score">' + left + '<p class="ccard__state">' + opts.stateHtml + "</p></div>" +
      "</button></li>"
    );
  }

  function renderP1Card(c) {
    var st = chapterState(c);
    var o = { index: c.index, name: c.name, image: c.image, state: st };
    if (c.kind === "scan") {
      o.claim = "Where you stand across five dimensions.";
      o.stateHtml = "Completed &nbsp;·&nbsp; <b>5 dimensions</b>";
      o.attrs = 'data-nav="' + c.nav + '"';
      o.full = true; o.ring = true;
    } else if (c.id === "k1") {
      o.claim = c.sub;
      o.ring = true;
      o.stateHtml = (state.k1Done ? "Completed" : "Open") + " &nbsp;·&nbsp; <b>" + phasePoints() + " / " + P.chapterMax + " pts</b>";
      o.attrs = 'data-nav="' + c.nav + '"';
    } else if (st === "open") {
      o.claim = c.teaser;
      o.stateHtml = "Open &nbsp;·&nbsp; <b>0 / " + P.chapterMax + " pts</b>";
      o.attrs = 'data-action="teaser" data-chapter="' + c.id + '"';
    } else {
      o.claim = c.teaser;
      o.stateHtml = c.lock === "countdown"
        ? 'Unlocks in &nbsp;·&nbsp; <b class="countdown" data-countdown="' + c.id + '"></b>'
        : "<b>" + esc(c.lockText) + "</b>";
      o.attrs = 'data-action="teaser" data-chapter="' + c.id + '"';
    }
    return imageCard(o);
  }

  function chapterState(c) {
    if (c.kind === "scan") return "completed";
    if (c.id === "k1") return state.k1Done ? "completed" : "open";
    if (c.lock === "after-k1") return state.k1Done ? "open" : "locked";
    return "locked";
  }

  function renderChapterRow(c) {
    var st = chapterState(c);
    var left, meta, cls, attrs;
    if (c.kind === "scan") {
      left = '<div class="minibars" aria-hidden="true">' + CFG.delta.dimensions.map(function (d) { return '<i class="b-' + d.band + '"></i>'; }).join("") + "</div>";
      meta = c.hint;
      cls = "row--done";
      attrs = 'data-nav="' + c.nav + '"';
    } else if (c.id === "k1") {
      left = '<div class="ring" data-ring><svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true"><circle class="ring__track" cx="22" cy="22" r="18"/><circle class="ring__fill" cx="22" cy="22" r="18" data-ring-fill/></svg><span class="ring__check" data-ring-check hidden>✓</span></div>';
      meta = (state.k1Done ? "Completed · " : "Open · ") + phasePoints() + " / " + P.chapterMax + " pts";
      cls = state.k1Done ? "row--done" : "row--open";
      attrs = 'data-nav="' + c.nav + '"';
    } else if (st === "open") {
      left = '<div class="ring"><svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true"><circle class="ring__track" cx="22" cy="22" r="18"/></svg></div>';
      meta = "Open · 0 / " + P.chapterMax + " pts";
      cls = "row--open";
      attrs = 'data-action="teaser" data-chapter="' + c.id + '"';
    } else {
      left = '<div class="lock" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>';
      meta = c.lock === "countdown"
        ? '<span class="countdown" data-countdown="' + c.id + '" data-countdown-prefix="Unlocks in "></span>'
        : c.lockText;
      cls = "row--locked";
      attrs = 'data-action="teaser" data-chapter="' + c.id + '"';
    }
    return (
      '<li><button type="button" class="row row--tap ' + cls + '" ' + attrs + ">" +
        left +
        '<div class="row__body"><p class="row__index">' + esc(c.index) + '</p><p class="row__title">' + esc(c.name) + '</p><p class="row__meta">' + meta + "</p></div>" +
        (c.kind === "scan" ? '<span class="row__state row__state--done">✓</span>' : st === "locked" ? "" : '<span class="row__chev">›</span>') +
      "</button></li>"
    );
  }

  // PROFILE (beide Phasen)
  enter.profile = function (el) {
    $("[data-dims]", el).innerHTML = CFG.delta.dimensions.map(function (d) {
      return '<li class="dim dim--' + d.band + '"><div class="dim__head"><span class="dim__name">' + esc(d.name) + '</span><span class="dim__band">' + d.band + '</span></div><div class="dim__bar"><i></i><i></i><i></i></div></li>';
    }).join("");
    $$("[data-phase-points]", el).forEach(function (n) { n.textContent = isP0() ? p0Points() : phasePoints(); });
  };

  // K1
  enter.k1 = function (el) {
    $("[data-k1-state]", el).textContent = "Chapter 01  ·  " + (state.k1Done ? "Completed" : "Open");
    setRing($("[data-ring]", el), phasePoints() / P.chapterMax, state.k1Done, RING32);
    setRowState($('[data-card="nugget"]', el), state.nuggetSeen, !state.nuggetSeen, "Watch");
    setRowState($('[data-card="challenge"]', el), state.k1Done, state.nuggetSeen && !state.k1Done, "Play");
  };

  function setRowState(row, done, highlight, openText) {
    row.classList.toggle("ccrow--hi", !!highlight);
    $("[data-card-state]", row).innerHTML = done
      ? '<img src="/assets/figma/icon-check-circle.svg" alt="Done">'
      : openText;
  }

  // NUGGET (Phase 1)
  var nuggetReveal = null;
  enter.nugget = function (el) {
    var video = $(".vthumb", el);
    var progress = $("[data-video-progress]", el);
    var revealed = false;
    video.classList.remove("is-playing");
    progress.style.transitionDuration = "0ms";

    nuggetReveal = function () {
      if (revealed) return;
      revealed = true;
      state.nuggetSeen = true;
      saveState();
      progress.style.transitionDuration = "300ms";
      video.classList.add("is-playing");
      updateCounters();
    };

    if (state.nuggetSeen) { revealed = true; video.classList.add("is-playing"); return; }
    later(function () { progress.style.transitionDuration = CFG.nugget.revealAfterMs + "ms"; video.classList.add("is-playing"); }, 60);
    later(function () { nuggetReveal(); }, CFG.nugget.revealAfterMs);
  };

  // CHALLENGE INTRO
  enter.cintro = function (el) { $("[data-challenge-done]", el).hidden = !state.k1Done; };

  // CHALLENGE PLAY
  var play = null;
  enter.cplay = function (el) {
    play = { index: 0, phase: "card", points: 0 };
    renderPlay(el);
  };

  function renderPlay(el) {
    var cards = CFG.k1.challenge.cards;
    var c = cards[play.index];
    $("[data-play-points]", el).textContent = play.points;
    $("[data-play-index]", el).textContent = play.index + 1;
    $("[data-play-steps]", el).innerHTML = cards.map(function (card, i) {
      var cls = i < play.index || (i === play.index && play.phase === "feedback")
        ? (card.outcome === "correct" ? "is-done" : "is-wrong")
        : (i === play.index ? "is-current" : "");
      return "<i class=\"" + cls + "\"></i>";
    }).join("");

    var cardEl = $("[data-play-card]", el);
    var fbEl = $("[data-play-feedback]", el);
    if (play.phase === "card") {
      setGlow(null);
      $("[data-play-feature-no]", el).textContent = pad2(play.index + 1);
      $("[data-play-feature]", el).textContent = c.feature;
      $("[data-play-detail]", el).textContent = c.detail;
      cardEl.hidden = false; fbEl.hidden = true;
    } else {
      var ok = c.outcome === "correct";
      setGlow(ok ? "correct" : "wrong");
      var v = $("[data-play-verdict]", el);
      v.className = "verdict " + (ok ? "verdict--correct" : "verdict--wrong");
      $("[data-play-verdict-label]", el).textContent = ok ? "Correct · " + c.verdict : "Not quite · " + c.verdict;
      $("[data-play-feature-2]", el).textContent = c.feature;
      $("[data-play-explain]", el).textContent = c.explain;
      $("[data-action='play-next']", el).textContent = play.index === cards.length - 1 ? "See result" : "Next";
      cardEl.hidden = true; fbEl.hidden = false;
      if (ok) showGain(el, P.perCard);
    }
  }

  function showGain(el, value) {
    var g = $("[data-play-gain]", el);
    $("[data-play-gain-value]", el).textContent = value;
    g.classList.remove("is-leaving");
    g.hidden = false;
    later(function () { g.classList.add("is-leaving"); }, 2000);
    later(function () { g.hidden = true; }, 2350);
  }

  function playAnswer() {
    if (!play || play.phase !== "card") return;
    var c = CFG.k1.challenge.cards[play.index];
    play.phase = "feedback";
    if (c.outcome === "correct") play.points += P.perCard;
    renderPlay(screens.cplay);
  }

  function playNext() {
    if (!play || play.phase !== "feedback") return;
    if (play.index >= CFG.k1.challenge.cards.length - 1) {
      state.k1Done = true;
      state.k1Score = Math.max(state.k1Score || 0, P.challenge);
      saveState();
      navigate("/chapter/refresher/result");
      return;
    }
    play.index += 1;
    play.phase = "card";
    renderPlay(screens.cplay);
  }

  /* ===== RESULT / BADGE (beide Phasen) ===== */

  enter.result = function (el) {
    var p0 = isP0();
    var ctx = p0 ? P0.result : CFG.k1.result;
    var score = p0 ? state.p0.challengeScore : state.k1Score;
    $("[data-result-eyebrow]", el).textContent = p0 ? ctx.eyebrow : "Challenge complete";
    $("[data-result-headline]", el).textContent = ctx.headline;
    $("[data-result-line]", el).textContent = ctx.line;
    var tileLabel = $("[data-result-tile-label]", el);
    var tileValue = $("[data-result-correct]", el);
    if (p0) {
      var cl = state.p0.bib.claimed || {};
      var full = Object.keys(cl).filter(function (k) { return cl[k] === "full"; }).length;
      tileLabel.textContent = "First try";
      tileValue.textContent = full + " / " + (P0.bib.districts || []).length;
    } else {
      var correct = CFG.k1.challenge.cards.filter(function (c) { return c.outcome === "correct"; }).length;
      tileLabel.textContent = "Correct";
      tileValue.textContent = correct + " / " + CFG.k1.challenge.cards.length;
    }
    $("[data-result-cta]", el).setAttribute("data-nav", p0 ? "/chapter/origin/badge" : "/chapter/refresher/badge");
    countUp($("[data-result-score]", el), score, 900);
  };

  function countUp(el, target, duration) {
    var start = null;
    el.textContent = "0";
    function step(ts) {
      if (start === null) start = ts;
      var t = clamp((ts - start) / duration, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  enter.badge = function (el) {
    var ctx = isP0() ? P0.badge : CFG.k1.badge;
    $("[data-badge-name]", el).textContent = ctx.name;
    $("[data-badge-state]", el).textContent = ctx.state;
    $("[data-badge-line]", el).textContent = ctx.line;
    if (isP0()) { if (!state.p0.badgeEarned) { state.p0.badgeEarned = true; saveState(); } }
    else if (!state.badgeEarned) { state.badgeEarned = true; saveState(); }
    later(function () { vibrate([40, 60, 40]); }, 500);
  };

  /* ===== ARCHIVE / LEADERBOARD (Phase 1) ===== */

  enter.archive = function (el) {
    var ch = CFG.phase0.chapters;
    $("[data-phase0-badges]", el).innerHTML = ch.map(function (c) {
      return '<figure><img src="/assets/badge-copper.svg" alt=""><figcaption>' + esc(c.name) + "</figcaption></figure>";
    }).join("");
    $("[data-phase0-chapters]", el).innerHTML = ch.map(function (c, i) {
      return imageCard({ index: "Chapter " + pad2(i + 1), name: c.name, claim: c.claim, image: c.image, state: "completed", ring: true, full: true,
        stateHtml: "Completed &nbsp;·&nbsp; <b>Badge earned</b>", attrs: "disabled" });
    }).join("");
  };

  var boardView = 0;
  enter.leaderboard = function (el) {
    var views = CFG.leaderboard.views;
    $("[data-board-views]", el).innerHTML = views.map(function (v, i) {
      return '<button type="button" data-action="board-view" data-view="' + i + '" class="' + (i === boardView ? "is-active" : "") + '">' + esc(v.label) + "</button>";
    }).join("");
    revealBoard(el);
  };

  function revealBoard(el) {
    var v = CFG.leaderboard.views[boardView];
    var rows = $("[data-board-rows]", el);
    var me = $("[data-board-me]", el);
    var n = v.rows.length;
    rows.innerHTML = v.rows.map(function (r, i) {
      return '<li class="brow" style="animation-delay:' + ((n - 1 - i) * 180 + 200) + 'ms"><span class="brow__rank">' + (i + 1) + '</span><span class="brow__name">' + esc(r[0]) + '</span><span class="brow__pts">' + fmt(r[1]) + '</span><span class="brow__unit">pts</span></li>';
    }).join("");
    me.innerHTML = "";
    later(function () {
      me.innerHTML = '<div class="board__gap">···</div><div class="brow brow--me"><span class="brow__rank">' + v.me[0] + '</span><span class="brow__name">You</span><span class="brow__pts">' + fmt(v.me[1]) + '</span><span class="brow__unit">pts</span></div>';
    }, n * 180 + 400);
  }

  /* ---------- Countdown ---------- */

  function formatCountdown(ms, withSeconds) {
    if (ms <= 0) return "Unlocks soon";
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (d > 0) return d + "d " + pad2(h) + "h " + pad2(m) + "m" + (withSeconds ? " " + pad2(sec) + "s" : "");
    if (h > 0) return h + "h " + pad2(m) + "m" + (withSeconds ? " " + pad2(sec) + "s" : "");
    return pad2(m) + ":" + pad2(sec);
  }
  function unlockTime(id, source) {
    var table = source === "p0" ? P0.unlock : CFG.unlock;
    var t = table && table[id] ? Date.parse(table[id]) : NaN;
    return isFinite(t) ? t : 0;
  }
  function tickCountdowns() {
    var now = Date.now();
    $$("[data-countdown]").forEach(function (el) {
      var remaining = unlockTime(el.getAttribute("data-countdown"), el.getAttribute("data-countdown-source")) - now;
      var prefix = el.getAttribute("data-countdown-prefix") || "";
      el.textContent = (remaining > 0 ? prefix : "") + formatCountdown(remaining, el.hasAttribute("data-countdown-seconds"));
    });
  }
  setInterval(tickCountdowns, 1000);

  /* ---------- Sheet (Phase 1) ---------- */

  function openSheet(chapterId) {
    var c = CFG.chapters.filter(function (ch) { return ch.id === chapterId; })[0];
    if (!c) return;
    var st = chapterState(c);
    $("[data-sheet-eyebrow]", sheet).textContent = c.index + (st === "open" ? " · Open" : " · Locked");
    $("[data-sheet-title]", sheet).textContent = c.name;
    $("[data-sheet-teaser]", sheet).textContent = st === "open"
      ? (c.teaser || "") + " Content of this chapter is not part of the prototype."
      : (c.teaser || "");
    var lock = $("[data-sheet-lock]", sheet);
    lock.removeAttribute("data-countdown");
    lock.removeAttribute("data-countdown-source");
    if (st === "open") lock.textContent = "Open · 0 / " + P.chapterMax + " pts";
    else if (c.lock === "countdown") { lock.setAttribute("data-countdown", c.id); lock.setAttribute("data-countdown-prefix", "Unlocks in "); lock.setAttribute("data-countdown-seconds", ""); }
    else lock.textContent = c.lockText;
    sheet.hidden = false;
    tickCountdowns();
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    var lock = $("[data-sheet-lock]", sheet);
    lock.removeAttribute("data-countdown");
    lock.removeAttribute("data-countdown-source");
  }

  /* ---------- Toast ---------- */

  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove("is-leaving");
    toast.hidden = false;
    setTimeout(function () { toast.classList.add("is-leaving"); }, 3200);
    setTimeout(function () { toast.hidden = true; }, 3600);
  }

  /* ---------- Streak Challenge ---------- */

  function openStreak() {
    var base = CFG.returnBase || location.origin;
    var returnUrl = base.replace(/\/+$/, "") + "/?completed=streak";
    var href;
    try { var u = new URL(CFG.challengeUrl); u.searchParams.set("return", returnUrl); href = u.toString(); }
    catch (e) { href = CFG.challengeUrl + "?return=" + encodeURIComponent(returnUrl); }
    location.href = href;
  }

  /* ---------- Phase / Reset ---------- */

  function setPhase(phase) {
    state.phase = phase === 1 ? 1 : 0;
    saveState();
    history.replaceState({ depth: 0 }, "", "/");
    render("/");
  }

  var logoTaps = [];
  function logoTap() {
    var now = Date.now();
    logoTaps.push(now);
    logoTaps = logoTaps.filter(function (t) { return now - t < 2000; });
    if (logoTaps.length >= 5) { logoTaps = []; resetState(true); vibrate(30); history.replaceState({ depth: 0 }, "", "/"); render("/"); }
  }

  /* ---------- Events ---------- */

  document.addEventListener("click", function (ev) {
    var district = ev.target.closest && ev.target.closest(".bib-d");
    if (district && current === "bib") { bibSelect(district.getAttribute("data-district")); return; }
    var target = ev.target.closest("[data-nav], [data-action]");
    if (!target) return;
    var nav = target.getAttribute("data-nav");
    var action = target.getAttribute("data-action");
    if (nav && !action) { ev.preventDefault(); navigate(nav); return; }
    switch (action) {
      case "back": goBack(); break;
      case "enter-intro": enterIntro(); break;
      case "skip-introvideo": finishIntroVideo(); break;
      case "unmute-intro": (function () { var v = $("[data-intro-video]"); v.muted = false; v.volume = 1; var p = v.play(); if (p && p.catch) p.catch(function () {}); $("[data-intro-unmute]").hidden = true; })(); break;
      case "nugget0-tap": nugget0Tap(); break;
      case "bib-back": bibBack(); break;
      case "bib-next": bibNext(); break;
      case "bib-answer": bibAnswer(parseInt(target.getAttribute("data-answer"), 10)); break;
      case "confirm-no": closeConfirm(); break;
      case "confirm-yes": var fn = confirmYes; closeConfirm(); if (fn) fn(); break;
      case "teaser0": openSheet0(target.getAttribute("data-chapter")); break;
      case "skip-opener": finishOpener(); break;
      case "opener-tap": if (screens.opener.classList.contains("phase-outro")) finishOpener(); break;
      case "logo-tap": logoTap(); break;
      case "teaser": openSheet(target.getAttribute("data-chapter")); break;
      case "close-sheet": closeSheet(); break;
      case "nugget-tap": if (nuggetReveal) nuggetReveal(); break;
      case "play-answer": playAnswer(); break;
      case "play-next": playNext(); break;
      case "open-streak": openStreak(); break;
      case "set-phase": setPhase(parseInt(target.getAttribute("data-phase"), 10)); break;
      case "board-view": boardView = parseInt(target.getAttribute("data-view"), 10) || 0; enter.leaderboard(screens.leaderboard); break;
      case "board-replay": enter.leaderboard(screens.leaderboard); break;
      default: if (nav) navigate(nav);
    }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { closeSheet(); closeConfirm(); } });

  /* ---------- Boot ---------- */

  function boot() {
    fillStatic();
    var params = new URLSearchParams(location.search);
    var showDev = (CFG.dev && CFG.dev.showReplay) || params.get("dev") === "1";
    $$("[data-dev-replay]").forEach(function (el) { el.hidden = !showDev; });
    var path = normalize(location.pathname);
    var toastText = null;

    if (params.has("phase")) {
      var ph = parseInt(params.get("phase"), 10);
      state.phase = ph === 1 ? 1 : 0;
      saveState();
      path = "/";
    }

    if (params.has("reset")) {
      resetState(params.has("phase"));
      history.replaceState({ depth: 0 }, "", "/");
      path = "/";
    } else if (params.get("completed") === "streak" || params.get("completed") === "spirit") {
      var raw = params.get("streak") != null ? params.get("streak") : params.get("score");
      var n = parseInt(raw, 10);
      {
        if (isP0()) state.p0.introSeen = true; else state.openerSeen = true;
        if (isFinite(n)) {
          var prev = state.streakBest === null ? CFG.demo.streakBest : state.streakBest;
          state.streakBest = Math.max(prev, n);
          toastText = n >= prev && n > 0 ? "Streak · New best: " + n : "Streak · " + n + " pts · Best stays " + prev;
        }
        saveState();
        history.replaceState({ depth: 0 }, "", "/");
        path = "/";
      }
    } else if (params.has("phase")) {
      history.replaceState({ depth: 0 }, "", "/");
    } else if (!history.state) {
      history.replaceState({ depth: 0 }, "", path);
    } else if (location.search) {
      history.replaceState(history.state, "", path);
    }

    render(path);
    if (toastText) setTimeout(function () { showToast(toastText); }, 500);
  }

  boot();
})();
