/*
 * CUPRA Training Experience – Pitch-Prototyp v2
 * Router, Zustand, Screens, Countdown, Reset, Rückkehr aus der Streak Challenge.
 * Vanilla JS, kein Build-Schritt.
 */
(function () {
  "use strict";

  var CFG = window.CTE_CONFIG || {};
  var P = CFG.points || {};
  var STORAGE_KEY = "cte.v2";
  var RING_LENGTH = 113.1;

  var DEFAULT_STATE = {
    openerSeen: false,
    nuggetSeen: false,
    k1Done: false,
    k1Score: 0,
    badgeEarned: false,
    streakBest: null,
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
      return Object.assign({}, DEFAULT_STATE, raw ? JSON.parse(raw) : {});
    } catch (e) { return Object.assign({}, DEFAULT_STATE); }
  }
  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function resetState() { state = Object.assign({}, DEFAULT_STATE); try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ } }

  function phasePoints() { return (state.nuggetSeen ? P.nugget : 0) + (state.k1Done ? state.k1Score : 0); }
  function badgeCount() { return CFG.phase0.chapters.length + 1 + (state.badgeEarned ? 1 : 0); }
  function streakBest() { return state.streakBest === null ? CFG.demo.streakBest : state.streakBest; }

  /* ---------- DOM ---------- */

  var device = $("#device");
  var scrollEl = $("#scroll");
  var screens = {};
  $$(".screen").forEach(function (s) { screens[s.getAttribute("data-screen")] = s; });
  var bgs = { start: $('[data-bg="start"]'), blur: $('[data-bg="blur"]') };
  var glow = $("[data-glow]");
  var tabbar = $("[data-tabbar]");
  var sheet = $("[data-sheet]");
  var toast = $("[data-toast]");

  function fillStatic() {
    $$("[data-copy]").forEach(function (el) { var v = CFG.copy[el.getAttribute("data-copy")]; if (v) el.textContent = v; });
    $$("[data-k1]").forEach(function (el) { var v = get(CFG.k1, el.getAttribute("data-k1")); if (v) el.textContent = v; });
    $$("[data-demo]").forEach(function (el) { var v = CFG.demo[el.getAttribute("data-demo")]; if (v != null) el.textContent = v; });
    $$("[data-fmt]").forEach(function (el) { var v = P[el.getAttribute("data-fmt")]; if (v != null) el.textContent = fmt(v); });
    var chip = $("[data-delta-chip]"); if (chip) chip.textContent = CFG.delta.k1Chip;
    var fb = $("[data-delta-feedback]"); if (fb) fb.textContent = CFG.delta.feedback;
    var lines = $("[data-opener-lines]");
    if (lines) lines.innerHTML = CFG.copy.openerLines.map(function (l) { return '<p class="opener__line">' + esc(l) + "</p>"; }).join("");
    var ob = $("[data-opener-badges]");
    if (ob) ob.innerHTML = CFG.phase0.chapters.map(function () { return '<img src="/assets/badge-copper.svg" alt="">'; }).join("") + '<img src="/assets/badge-teal.svg" alt="">';
  }

  function updateCounters() {
    $$("[data-phase-points]").forEach(function (el) { el.textContent = phasePoints(); });
    $$("[data-badge-count]").forEach(function (el) { el.textContent = badgeCount(); });
    $$("[data-streak-best]").forEach(function (el) { el.textContent = streakBest(); });
  }

  function setRing(ringEl, pct, done) {
    var fill = $("[data-ring-fill]", ringEl);
    if (fill) fill.style.strokeDashoffset = String(RING_LENGTH * (1 - clamp(pct, 0, 1)));
    var check = $("[data-ring-check]", ringEl);
    if (check) check.hidden = !done;
  }

  function vibrate(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignore */ } }

  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- Router ---------- */

  var PARENT = { profile: "/", k1: "/", nugget: "/k1", cintro: "/k1", cplay: "/k1/challenge", result: "/", badge: "/", archive: "/", leaderboard: "/", home: "/", opener: "/" };
  var current = null;

  function normalize(path) {
    path = (path || "/").replace(/\/index\.html$/, "").replace(/\/+$/, "");
    return path === "" ? "/" : path;
  }

  function resolve(path) {
    switch (normalize(path)) {
      case "/": case "/home": return state.openerSeen ? "home" : "opener";
      case "/profile": return "profile";
      case "/k1": return "k1";
      case "/k1/nugget": return "nugget";
      case "/k1/challenge": return "cintro";
      case "/k1/challenge/play": return "cplay";
      case "/k1/result": return state.k1Done ? "result" : null;
      case "/k1/badge": return state.k1Done ? "badge" : null;
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
    setGlow(null);

    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== id; });
    var el = screens[id];
    current = id;

    var variant = el.getAttribute("data-bgvariant") || "blur";
    bgs.start.hidden = variant !== "start";
    bgs.blur.hidden = variant !== "blur";

    var tab = el.getAttribute("data-tab");
    tabbar.hidden = !tab;
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

  /* ---------- Screens ---------- */

  var enter = {};

  // OPENER
  enter.opener = function (el) {
    var O = CFG.opener;
    var lines = $$(".opener__line", el);
    var skip = $(".skip", el);
    el.classList.remove("phase-claim", "phase-badges", "phase-outro");
    skip.classList.remove("is-visible");
    lines.forEach(function (l) { l.classList.remove("is-in", "is-past", "is-last"); });

    var t = 500;
    lines.forEach(function (line, i) {
      later(function () {
        line.classList.add("is-in");
        if (i === lines.length - 1) line.classList.add("is-last");
        if (i > 0) lines[i - 1].classList.add("is-past");
      }, t + i * O.lineDelayMs);
    });
    var tClaim = t + lines.length * O.lineDelayMs;
    var tBadges = tClaim + O.claimHoldMs;
    var tOutro = tBadges + O.badgesHoldMs;
    later(function () { skip.classList.add("is-visible"); }, O.skipAfterMs);
    later(function () { el.classList.add("phase-claim"); }, tClaim);
    later(function () { el.classList.remove("phase-claim"); el.classList.add("phase-badges"); }, tBadges);
    later(function () { el.classList.remove("phase-badges"); el.classList.add("phase-outro"); }, tOutro);
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
    if (state.k1Done && !state.badgeEarned) {
      cta.textContent = "Claim your badge";
      cta.setAttribute("data-nav", "/k1/badge");
    } else if (state.k1Done) {
      cta.textContent = "Continue: K2 Segment";
      cta.setAttribute("data-nav", "");
      cta.setAttribute("data-action", "teaser");
      cta.setAttribute("data-chapter", "k2");
    } else {
      cta.textContent = state.nuggetSeen ? "Continue: K1 Refresher" : "Continue: K1 Refresher";
      cta.setAttribute("data-nav", "/k1");
      cta.removeAttribute("data-action");
    }
    $("[data-chapters]", el).innerHTML = CFG.chapters.map(renderChapterRow).join("");
    var ring = $("[data-ring]", el);
    if (ring) setRing(ring, phasePoints() / P.chapterMax, state.k1Done);
    tickCountdowns();
  };

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

  // PROFILE
  enter.profile = function (el) {
    $("[data-dims]", el).innerHTML = CFG.delta.dimensions.map(function (d) {
      return '<li class="dim dim--' + d.band + '"><div class="dim__head"><span class="dim__name">' + esc(d.name) + '</span><span class="dim__band">' + d.band + '</span></div><div class="dim__bar"><i></i><i></i><i></i></div></li>';
    }).join("");
  };

  // K1
  enter.k1 = function (el) {
    $("[data-k1-state]", el).textContent = state.k1Done ? "K1 · Completed" : "K1 · Open";
    setRing($("[data-ring]", el), phasePoints() / P.chapterMax, state.k1Done);
    setCardState($('[data-card="nugget"]', el), state.nuggetSeen, "Watched", "Watch");
    setCardState($('[data-card="challenge"]', el), state.k1Done, "Done · " + state.k1Score + " pts", "Play");
  };

  function setCardState(card, done, doneText, openText) {
    var st = $("[data-card-state]", card);
    card.classList.toggle("row--done", done);
    st.className = "row__state " + (done ? "row__state--done" : "row__state--open");
    st.textContent = (done ? "✓ " : "") + (done ? doneText : openText);
  }

  // NUGGET
  var nuggetReveal = null;
  enter.nugget = function (el) {
    var video = $(".video", el);
    var pill = $("[data-nugget-pill]", el);
    var progress = $("[data-video-progress]", el);
    var revealed = false;
    video.classList.remove("is-playing");
    pill.hidden = true;
    progress.style.transitionDuration = "0ms";

    nuggetReveal = function () {
      if (revealed) return;
      revealed = true;
      state.nuggetSeen = true;
      saveState();
      pill.hidden = false;
      progress.style.transitionDuration = "300ms";
      video.classList.add("is-playing");
      updateCounters();
    };

    if (state.nuggetSeen) { revealed = true; pill.hidden = false; video.classList.add("is-playing"); return; }
    later(function () { progress.style.transitionDuration = CFG.nugget.revealAfterMs + "ms"; video.classList.add("is-playing"); }, 60);
    later(function () { nuggetReveal(); }, CFG.nugget.revealAfterMs);
  };

  // CHALLENGE INTRO
  enter.cintro = function (el) { $("[data-challenge-done]", el).hidden = !state.k1Done; };

  // CHALLENGE PLAY (gemockte Sequenz)
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
      cardEl.style.animation = "none"; void cardEl.offsetWidth; cardEl.style.animation = "";
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
      navigate("/k1/result");
      return;
    }
    play.index += 1;
    play.phase = "card";
    renderPlay(screens.cplay);
  }

  // RESULT
  enter.result = function (el) {
    var correct = CFG.k1.challenge.cards.filter(function (c) { return c.outcome === "correct"; }).length;
    $("[data-result-correct]", el).textContent = correct + " / " + CFG.k1.challenge.cards.length;
    countUp($("[data-result-score]", el), state.k1Score, 900);
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

  // BADGE
  enter.badge = function () {
    if (!state.badgeEarned) { state.badgeEarned = true; saveState(); }
    later(function () { vibrate([40, 60, 40]); }, 500);
  };

  // ARCHIVE
  enter.archive = function (el) {
    var ch = CFG.phase0.chapters;
    $("[data-phase0-badges]", el).innerHTML = ch.map(function (c) {
      return '<figure><img src="/assets/badge-copper.svg" alt=""><figcaption>' + esc(c.name) + "</figcaption></figure>";
    }).join("") + '<figure class="is-final"><img src="/assets/badge-teal.svg" alt=""><figcaption>' + esc(CFG.phase0.finalBadge) + "</figcaption></figure>";
    $("[data-phase0-chapters]", el).innerHTML = ch.map(function (c, i) {
      return '<li><div class="row row--done"><span class="check" aria-hidden="true">✓</span><div class="row__body"><p class="row__index">Chapter ' + pad2(i + 1) + '</p><p class="row__title">' + esc(c.name) + '</p><p class="row__meta">' + esc(c.claim) + '</p></div><span class="row__state row__state--done">Completed</span></div></li>';
    }).join("");
  };

  // LEADERBOARD (Demo-Reveal)
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
  function unlockTime(id) { var t = CFG.unlock && CFG.unlock[id] ? Date.parse(CFG.unlock[id]) : NaN; return isFinite(t) ? t : 0; }
  function tickCountdowns() {
    var now = Date.now();
    $$("[data-countdown]").forEach(function (el) {
      var remaining = unlockTime(el.getAttribute("data-countdown")) - now;
      var prefix = el.getAttribute("data-countdown-prefix") || "";
      el.textContent = (remaining > 0 ? prefix : "") + formatCountdown(remaining, el.hasAttribute("data-countdown-seconds"));
    });
  }
  setInterval(tickCountdowns, 1000);

  /* ---------- Sheet ---------- */

  function openSheet(chapterId) {
    var c = CFG.chapters.filter(function (ch) { return ch.id === chapterId; })[0];
    if (!c) return;
    var st = chapterState(c);
    $("[data-sheet-eyebrow]", sheet).textContent = esc(c.index) + (st === "open" ? " · Open" : " · Locked");
    $("[data-sheet-title]", sheet).textContent = c.name;
    $("[data-sheet-teaser]", sheet).textContent = st === "open"
      ? (c.teaser || "") + " Content of this chapter is not part of the prototype."
      : (c.teaser || "");
    var lock = $("[data-sheet-lock]", sheet);
    lock.removeAttribute("data-countdown");
    if (st === "open") lock.textContent = "Open · 0 / " + P.chapterMax + " pts";
    else if (c.lock === "countdown") { lock.setAttribute("data-countdown", c.id); lock.setAttribute("data-countdown-prefix", "Unlocks in "); lock.setAttribute("data-countdown-seconds", ""); }
    else lock.textContent = c.lockText;
    sheet.hidden = false;
    tickCountdowns();
  }
  function closeSheet() { if (sheet && !sheet.hidden) sheet.hidden = true; }

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

  /* ---------- Reset (5× Logo) ---------- */

  var logoTaps = [];
  function logoTap() {
    var now = Date.now();
    logoTaps.push(now);
    logoTaps = logoTaps.filter(function (t) { return now - t < 2000; });
    if (logoTaps.length >= 5) { logoTaps = []; resetState(); vibrate(30); history.replaceState({ depth: 0 }, "", "/"); render("/"); }
  }

  /* ---------- Events ---------- */

  document.addEventListener("click", function (ev) {
    var target = ev.target.closest("[data-nav], [data-action]");
    if (!target) return;
    var nav = target.getAttribute("data-nav");
    var action = target.getAttribute("data-action");
    if (nav && !action) { ev.preventDefault(); navigate(nav); return; }
    switch (action) {
      case "back": goBack(); break;
      case "skip-opener": finishOpener(); break;
      case "opener-tap": if (screens.opener.classList.contains("phase-outro")) finishOpener(); break;
      case "logo-tap": logoTap(); break;
      case "teaser": openSheet(target.getAttribute("data-chapter")); break;
      case "close-sheet": closeSheet(); break;
      case "nugget-tap": if (nuggetReveal) nuggetReveal(); break;
      case "play-answer": playAnswer(); break;
      case "play-next": playNext(); break;
      case "open-streak": openStreak(); break;
      case "board-view": boardView = parseInt(target.getAttribute("data-view"), 10) || 0; enter.leaderboard(screens.leaderboard); break;
      case "board-replay": enter.leaderboard(screens.leaderboard); break;
      default: if (nav) navigate(nav);
    }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeSheet(); });

  /* ---------- Boot ---------- */

  function boot() {
    fillStatic();
    var params = new URLSearchParams(location.search);
    var path = normalize(location.pathname);
    var toastText = null;

    if (params.has("reset")) {
      resetState();
      history.replaceState({ depth: 0 }, "", "/");
      path = "/";
    } else if (params.get("completed") === "streak" || params.get("completed") === "spirit") {
      state.openerSeen = true;
      var n = parseInt(params.get("streak") != null ? params.get("streak") : params.get("score"), 10);
      if (isFinite(n)) {
        var prev = state.streakBest === null ? CFG.demo.streakBest : state.streakBest;
        state.streakBest = Math.max(prev, n);
        toastText = n >= prev && n > 0 ? "Streak · New best: " + n : "Streak · " + n + " pts · Best stays " + prev;
      }
      saveState();
      history.replaceState({ depth: 0 }, "", "/");
      path = "/";
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
