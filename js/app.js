/*
 * CUPRA Training Experience – Pitch-Prototyp
 * Router, Zustand, Screens, Countdown, Reset, Rückkehr aus der Streak Challenge.
 * Vanilla JS, kein Build-Schritt.
 */
(function () {
  "use strict";

  var CFG = window.CTE_CONFIG || {};
  var P = CFG.points || {};
  var STORAGE_KEY = "cte.state";
  var RING_LENGTH = 113.1; // 2 * PI * r(18)

  var DEFAULT_STATE = {
    introSeen: false,
    dropSeen: false,
    spiritDone: false,
    challengeScore: 0,
    badgeEarned: false,
  };

  /* ---------- Helpers ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- State (localStorage, Private-Mode-sicher) ---------- */

  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULT_STATE);
      return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULT_STATE);
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function resetState() {
    state = Object.assign({}, DEFAULT_STATE);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  function totalPoints() {
    return (state.dropSeen ? P.drop : 0) + (state.spiritDone ? state.challengeScore : 0);
  }

  function scoreFromParams(params) {
    var n;
    if (params.has("score")) {
      n = parseInt(params.get("score"), 10);
      if (isFinite(n)) return clamp(n, 0, P.challengeMax);
    }
    if (params.has("streak")) {
      n = parseInt(params.get("streak"), 10);
      if (isFinite(n)) return clamp(n * P.perStreak, 0, P.challengeMax);
    }
    return P.fallbackScore;
  }

  /* ---------- DOM ---------- */

  var app = $("#app");
  var screens = {};
  $$(".screen").forEach(function (s) { screens[s.getAttribute("data-screen")] = s; });
  var sheet = $("[data-sheet]");

  function fillCopy() {
    $$("[data-copy]").forEach(function (el) {
      var key = el.getAttribute("data-copy");
      if (CFG.copy && CFG.copy[key]) el.textContent = CFG.copy[key];
    });
    $$("[data-chapter-max]").forEach(function (el) { el.textContent = P.chapterMax; });
  }

  function updatePoints() {
    var total = totalPoints();
    $$("[data-total-points]").forEach(function (el) { el.textContent = total; });
    $$("[data-badge-dot]").forEach(function (el) { el.hidden = !state.badgeEarned; });
  }

  function setRing(ringEl, pct, done) {
    var fill = $("[data-ring-fill]", ringEl) || $(".ring__fill", ringEl);
    if (fill) fill.style.strokeDashoffset = String(RING_LENGTH * (1 - clamp(pct, 0, 1)));
    ringEl.classList.toggle("ring--done", !!done);
  }

  function vibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignore */ }
  }

  /* ---------- Timers pro Screen ---------- */

  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- Router ---------- */

  var PARENT = {
    chapter: "/",
    drop: "/chapter/origin",
    challenge: "/chapter/origin",
    profile: "/",
    result: "/",
    badge: "/",
    home: "/",
    intro: "/",
  };

  var current = null;

  function normalize(path) {
    path = (path || "/").replace(/\/index\.html$/, "").replace(/\/+$/, "");
    return path === "" ? "/" : path;
  }

  function resolve(path) {
    switch (normalize(path)) {
      case "/":
      case "/home": return state.introSeen ? "home" : "intro";
      case "/chapter/origin": return "chapter";
      case "/chapter/origin/drop": return "drop";
      case "/chapter/origin/challenge": return "challenge";
      case "/result": return state.spiritDone ? "result" : null;
      case "/badge": return state.spiritDone ? "badge" : null;
      case "/profile": return "profile";
      default: return null;
    }
  }

  function depth() {
    return (history.state && typeof history.state.depth === "number") ? history.state.depth : 0;
  }

  function navigate(path, opts) {
    opts = opts || {};
    path = normalize(path);
    if (opts.replace) {
      history.replaceState({ depth: depth() }, "", path);
    } else {
      history.pushState({ depth: depth() + 1 }, "", path);
    }
    render(path);
  }

  function goBack() {
    if (depth() > 0) {
      history.back();
    } else {
      navigate(PARENT[current] || "/", { replace: true });
    }
  }

  function render(path) {
    var id = resolve(path);
    if (!id) {
      history.replaceState({ depth: depth() }, "", "/");
      id = resolve("/");
    }

    clearTimers();
    closeSheet();

    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== id; });
    current = id;

    updatePoints();
    if (enter[id]) enter[id](screens[id]);

    window.scrollTo(0, 0);
    if (app) app.scrollTop = 0;
  }

  window.addEventListener("popstate", function () {
    render(location.pathname);
  });

  /* ---------- Screens ---------- */

  var enter = {};

  // INTRO
  enter.intro = function (el) {
    var intro = $(".intro", el);
    var lines = $$(".intro__line", el);
    var skip = $(".intro__skip", el);
    var d = CFG.intro.lineDelayMs;
    var start = 400;

    intro.classList.remove("is-final");
    skip.classList.remove("is-visible");
    lines.forEach(function (l) { l.classList.remove("is-in", "is-past"); });

    lines.forEach(function (line, i) {
      later(function () {
        line.classList.add("is-in");
        if (i > 0) lines[i - 1].classList.add("is-past");
      }, start + i * d);
    });
    later(function () { skip.classList.add("is-visible"); }, CFG.intro.skipAfterMs);
    later(function () { intro.classList.add("is-final"); }, start + lines.length * d);
    later(finishIntro, start + lines.length * d + CFG.intro.holdMs);
  };

  function finishIntro() {
    state.introSeen = true;
    saveState();
    navigate("/", { replace: true });
  }

  // HOME
  enter.home = function (el) {
    var status = $("[data-home-status]", el);
    var cta = $("[data-home-cta]", el);
    var list = $("[data-chapters]", el);

    status.hidden = !state.spiritDone;
    if (state.spiritDone) renderBadgeRow($("[data-badge-row]", el));

    if (state.spiritDone && !state.badgeEarned) {
      cta.textContent = "Claim your badge";
      cta.setAttribute("data-nav", "/badge");
    } else {
      cta.textContent = (state.spiritDone || state.dropSeen) ? "Continue: ORIGIN" : "Start: ORIGIN";
      cta.setAttribute("data-nav", "/chapter/origin");
    }

    list.innerHTML = CFG.chapters.map(renderChapterCard).join("");
    var ring = $("[data-ring]", list);
    if (ring) setRing(ring, totalPoints() / P.chapterMax, state.spiritDone);
    tickCountdowns();
  };

  function renderChapterCard(c, i) {
    var index = pad2(i + 1);
    if (c.open) {
      var total = totalPoints();
      var stateText = state.spiritDone
        ? "Completed · " + total + " / " + P.chapterMax + " pts"
        : "Open · " + total + " / " + P.chapterMax + " pts";
      return (
        '<li><button type="button" class="chapter chapter--open' + (state.spiritDone ? " chapter--done" : "") + '" data-nav="/chapter/origin">' +
          '<div class="ring" data-ring>' +
            '<svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">' +
              '<circle class="ring__track" cx="22" cy="22" r="18"/>' +
              '<circle class="ring__fill" cx="22" cy="22" r="18" data-ring-fill/>' +
            '</svg>' +
            (state.spiritDone
              ? '<span class="ring__check" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M5 12l5 5 9-10"/></svg></span>'
              : "") +
          '</div>' +
          '<div><p class="chapter__index">Chapter ' + index + '</p><p class="chapter__name">' + c.name + '</p><p class="chapter__claim">' + c.claim + '</p>' +
          '<p class="chapter__state">' + stateText + '</p></div>' +
        '</button></li>'
      );
    }
    return (
      '<li><button type="button" class="chapter chapter--locked" data-action="teaser" data-chapter="' + c.id + '" aria-label="' + c.name + ', locked">' +
        '<div class="lock" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
        '</div>' +
        '<div><p class="chapter__index">Chapter ' + index + '</p><p class="chapter__name">' + c.name + '</p><p class="chapter__claim">' + c.claim + '</p>' +
        '<p class="chapter__state countdown" data-countdown="' + c.id + '" data-countdown-prefix="Unlocks in "></p></div>' +
      '</button></li>'
    );
  }

  function renderBadgeRow(el) {
    if (!el) return;
    el.innerHTML = CFG.chapters.map(function (c) {
      var earned = c.open && state.badgeEarned;
      return '<img src="' + (earned ? "/assets/badge-origin.svg" : "/assets/badge-locked.svg") + '" alt="' + c.name + (earned ? " badge earned" : " badge locked") + '">';
    }).join("");
  }

  // CHAPTER ORIGIN
  enter.chapter = function (el) {
    var ring = $("[data-ring]", el);
    if (ring) setRing(ring, totalPoints() / P.chapterMax, state.spiritDone);

    var drop = $('[data-card="drop"]', el);
    var spirit = $('[data-card="spirit"]', el);
    setCardState(drop, state.dropSeen, "Watched", "Watch");
    setCardState(spirit, state.spiritDone, "Done · " + state.challengeScore + " pts", "Play");
  };

  function setCardState(card, done, doneText, openText) {
    if (!card) return;
    var st = $("[data-card-state]", card);
    card.classList.toggle("card--done", done);
    st.className = "card__state " + (done ? "card__state--done" : "card__state--open");
    st.innerHTML = done
      ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' + doneText
      : openText;
  }

  // CONTENT DROP
  var dropReveal = null;

  enter.drop = function (el) {
    var video = $(".video", el);
    var pill = $("[data-drop-pill]", el);
    var progress = $("[data-video-progress]", el);
    var revealed = false;

    video.classList.remove("is-playing");
    pill.hidden = true;
    progress.style.transitionDuration = "0ms";

    dropReveal = function () {
      if (revealed) return;
      revealed = true;
      state.dropSeen = true;
      saveState();
      pill.hidden = false;
      progress.style.transitionDuration = "300ms";
      video.classList.add("is-playing");
      updatePoints();
    };

    if (state.dropSeen) {
      // Bereits gesehen: Zustand direkt zeigen, ohne erneute Wartezeit
      revealed = true;
      pill.hidden = false;
      video.classList.add("is-playing");
      return;
    }

    // Autoplay-Mock: Balken läuft, nach revealAfterMs erscheint der Bonus
    later(function () {
      progress.style.transitionDuration = CFG.drop.revealAfterMs + "ms";
      video.classList.add("is-playing");
    }, 60);
    later(function () { dropReveal(); }, CFG.drop.revealAfterMs);
  };

  // CHALLENGE INTERSTITIAL
  enter.challenge = function (el) {
    var link = $("[data-challenge-link]", el);
    link.href = buildChallengeUrl();
    $("[data-challenge-done]", el).hidden = !state.spiritDone;
  };

  function buildChallengeUrl() {
    var base = CFG.returnBase || location.origin;
    var returnUrl = base.replace(/\/+$/, "") + "/?completed=spirit";
    try {
      var url = new URL(CFG.challengeUrl);
      url.searchParams.set("return", returnUrl);
      return url.toString();
    } catch (e) {
      return CFG.challengeUrl + "?return=" + encodeURIComponent(returnUrl);
    }
  }

  // RESULT
  enter.result = function (el) {
    var scoreEl = $("[data-result-score]", el);
    var feedback = $("[data-result-feedback]", el);
    var target = state.challengeScore;
    feedback.textContent = target >= P.perStreak * 3 ? CFG.copy.resultFeedback : CFG.copy.resultFeedbackLow;
    countUp(scoreEl, target, 900);
  };

  function countUp(el, target, duration) {
    var startTime = null;
    function step(ts) {
      if (startTime === null) startTime = ts;
      var t = clamp((ts - startTime) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  // BADGE
  enter.badge = function () {
    if (!state.badgeEarned) {
      state.badgeEarned = true;
      saveState();
    }
    later(function () { vibrate([40, 60, 40]); }, 500);
  };

  // PROFILE
  enter.profile = function (el) {
    $("[data-chapters-done]", el).textContent = state.spiritDone ? 1 : 0;
    var grid = $("[data-badge-grid]", el);
    grid.innerHTML = CFG.chapters.map(function (c) {
      var earned = c.open && state.badgeEarned;
      return (
        '<figure class="' + (earned ? "is-earned" : "") + '">' +
          '<img src="' + (earned ? "/assets/badge-origin.svg" : "/assets/badge-locked.svg") + '" alt="' + c.name + (earned ? " badge earned" : " badge locked") + '">' +
          '<figcaption>' + c.name + '</figcaption>' +
        '</figure>'
      );
    }).join("");
  };

  /* ---------- Countdown ---------- */

  function formatCountdown(ms, withSeconds) {
    if (ms <= 0) return "Unlocks soon";
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (d > 0) return d + "d " + pad2(h) + "h " + pad2(m) + "m" + (withSeconds ? " " + pad2(sec) + "s" : "");
    if (h > 0) return h + "h " + pad2(m) + "m" + (withSeconds ? " " + pad2(sec) + "s" : "");
    return pad2(m) + ":" + pad2(sec);
  }

  function unlockTime(id) {
    var iso = CFG.unlock && CFG.unlock[id];
    var t = iso ? Date.parse(iso) : NaN;
    return isFinite(t) ? t : 0;
  }

  function tickCountdowns() {
    var now = Date.now();
    $$("[data-countdown]").forEach(function (el) {
      var id = el.getAttribute("data-countdown");
      var prefix = el.getAttribute("data-countdown-prefix") || "";
      var withSeconds = el.hasAttribute("data-countdown-seconds");
      var remaining = unlockTime(id) - now;
      el.textContent = (remaining > 0 ? prefix : "") + formatCountdown(remaining, withSeconds);
    });
  }

  setInterval(tickCountdowns, 1000);

  /* ---------- Teaser Sheet ---------- */

  function openSheet(chapterId) {
    var c = CFG.chapters.filter(function (ch) { return ch.id === chapterId; })[0];
    if (!c || !sheet) return;
    $("[data-sheet-title]", sheet).textContent = c.name;
    $("[data-sheet-claim]", sheet).textContent = c.claim;
    $("[data-sheet-teaser]", sheet).textContent = c.teaser || "";
    var cd = $("[data-sheet-countdown]", sheet);
    cd.setAttribute("data-countdown", c.id);
    cd.setAttribute("data-countdown-prefix", "Unlocks in ");
    cd.setAttribute("data-countdown-seconds", "");
    sheet.hidden = false;
    tickCountdowns();
    var close = $(".sheet__close", sheet);
    if (close) close.focus();
  }

  function closeSheet() {
    if (sheet && !sheet.hidden) sheet.hidden = true;
  }

  /* ---------- Reset (5× Logo-Tap) ---------- */

  var logoTaps = [];
  function logoTap() {
    var now = Date.now();
    logoTaps.push(now);
    logoTaps = logoTaps.filter(function (t) { return now - t < 2000; });
    if (logoTaps.length >= 5) {
      logoTaps = [];
      hardReset();
    }
  }

  function hardReset() {
    resetState();
    vibrate(30);
    history.replaceState({ depth: 0 }, "", "/");
    render("/");
  }

  /* ---------- Events (delegiert) ---------- */

  document.addEventListener("click", function (ev) {
    var target = ev.target.closest("[data-nav], [data-action]");
    if (!target) return;

    var nav = target.getAttribute("data-nav");
    if (nav) {
      ev.preventDefault();
      navigate(nav);
      return;
    }

    var action = target.getAttribute("data-action");
    switch (action) {
      case "back": goBack(); break;
      case "skip-intro": finishIntro(); break;
      case "logo-tap": logoTap(); break;
      case "teaser": openSheet(target.getAttribute("data-chapter")); break;
      case "close-sheet": closeSheet(); break;
      case "drop-tap": if (dropReveal) dropReveal(); break;
      default: break;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeSheet();
  });

  /* ---------- Boot ---------- */

  function boot() {
    fillCopy();

    var params = new URLSearchParams(location.search);
    var path = normalize(location.pathname);

    if (params.has("reset")) {
      resetState();
      history.replaceState({ depth: 0 }, "", "/");
      path = "/";
    } else if (params.get("completed") === "spirit") {
      // Rückkehr aus der Streak Challenge
      state.introSeen = true;
      state.spiritDone = true;
      state.challengeScore = Math.max(state.challengeScore || 0, scoreFromParams(params));
      saveState();
      history.replaceState({ depth: 0 }, "", "/");
      history.pushState({ depth: 1 }, "", "/result");
      path = "/result";
    } else {
      if (!history.state) history.replaceState({ depth: 0 }, "", path);
      else if (location.search) history.replaceState(history.state, "", path);
    }

    render(path);
  }

  boot();
})();
