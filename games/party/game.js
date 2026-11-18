// Pop Party: balloons float up from the grass and every one of them can be
// popped. Nothing to get wrong and nothing to lose. A balloon that drifts off
// the top is simply gone. Tap or drag a finger across them.
(function () {
  const art = window.TinyTapArt;
  const fx = window.TinyTapFx;
  const voice = window.TinyTapVoice;

  // Yellow is kept for the star balloon, so it always stands out.
  const COLORS = ["red", "blue", "green", "purple", "orange", "teal", "pink"].map(function (name) {
    return art.colors[name];
  });
  const STAR_FILL = art.colors.yellow;

  // By level: pops to finish a round, balloons in the air at once, seconds
  // for a balloon to cross the screen, and the gap between new balloons.
  const LEVELS = [
    { goal: 12, live: 5, cross: 9, gap: 0.9 },
    { goal: 16, live: 7, cross: 7.5, gap: 0.7 },
    { goal: 20, live: 9, cross: 6.2, gap: 0.55 },
  ];

  const GIANT_TAPS = 3;
  const MINIS = 5;
  // Pops in quick succession climb this scale.
  const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760];
  const STREAK_GAP = 1100;

  const playfield = document.getElementById("playfield");
  const tallyEl = document.getElementById("tally");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneCount = document.getElementById("done-count");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) {}

  let width = 0;
  let height = 0;
  let base = 100;
  let balloons = [];
  let setup = LEVELS[0];
  let round = { popped: 0, finished: true, shownAt: 0 };
  let spawnIn = 0;
  let sinceStar = 0;
  let sinceGiant = 0;
  let nextStar = 8;
  let nextGiant = 5;
  let lastPop = 0;
  let streak = 0;
  let lastFrame = 0;
  let lastColor = "";
  const fingers = {};

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function measure() {
    width = playfield.clientWidth;
    height = playfield.clientHeight;
    base = Math.max(64, Math.min(150, width * 0.2, height * 0.19));
  }

  function live() {
    return balloons.filter(function (b) {
      return !b.dead;
    });
  }

  function pickColor() {
    let color = lastColor;
    while (color === lastColor) {
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    lastColor = color;
    return color;
  }

  // ---------- Balloons ----------

  function addBalloon(kind, options) {
    options = options || {};
    const size = kind === "giant" ? Math.min(base * 1.55, width * 0.46) : kind === "mini" ? base * 0.62 : base;
    const color = options.color || (kind === "star" ? STAR_FILL : pickColor());
    const el = document.createElement("div");
    const body = document.createElement("div");
    el.className = "party-balloon " + kind;
    el.style.setProperty("--w", size.toFixed(1) + "px");
    body.className = "party-body";
    body.innerHTML = art.get("balloon", color, kind === "star" ? "star" : kind === "giant" ? "face" : "");
    el.appendChild(body);

    const speed = (height + size * 1.5) / setup.cross;
    const balloon = {
      el: el,
      body: body,
      kind: kind,
      color: color,
      w: size,
      h: size * 1.5,
      x: options.x !== undefined ? options.x : spawnX(size),
      y: options.y !== undefined ? options.y : height + 4,
      vx: options.vx || 0,
      kick: options.kick || 0,
      vy: speed * (kind === "giant" ? 0.7 : kind === "mini" ? 1.15 : rand(0.85, 1.15)),
      phase: rand(0, Math.PI * 2),
      swing: rand(0.7, 1.3),
      reach: size * rand(0.08, 0.22),
      age: 0,
      taps: 0,
      grow: 1,
      dead: false,
    };
    if (options.fresh) {
      el.classList.add("fresh");
    }
    place(balloon);
    playfield.appendChild(el);
    balloons.push(balloon);
    return balloon;
  }

  // A spot along the bottom that is not right on top of another new balloon.
  function spawnX(size) {
    const room = Math.max(0, width - size);
    let best = rand(0, room);
    for (let tries = 0; tries < 6; tries += 1) {
      const x = rand(0, room);
      const crowded = balloons.some(function (b) {
        return !b.dead && b.y > height - b.h && Math.abs(b.x - x) < (b.w + size) * 0.45;
      });
      best = x;
      if (!crowded) {
        break;
      }
    }
    return best;
  }

  function sway(b) {
    return Math.sin(b.age * b.swing + b.phase) * b.reach;
  }

  function place(b) {
    const tilt = Math.cos(b.age * b.swing + b.phase) * 5;
    b.el.style.transform =
      "translate3d(" + (b.x + sway(b)).toFixed(1) + "px," + b.y.toFixed(1) + "px,0) rotate(" + tilt.toFixed(1) + "deg)";
  }

  // Centre of the round part of the balloon (the string hangs below it).
  function centre(b) {
    return { x: b.x + sway(b) + b.w / 2, y: b.y + b.h * 0.35 };
  }

  function nextKind() {
    sinceStar += 1;
    sinceGiant += 1;
    if (sinceStar >= nextStar) {
      sinceStar = 0;
      nextStar = Math.round(rand(9, 14));
      return "star";
    }
    if (sinceGiant >= nextGiant) {
      sinceGiant = 0;
      nextGiant = Math.round(rand(6, 10));
      return "giant";
    }
    return "normal";
  }

  // ---------- Popping ----------

  function shards(b) {
    if (reduced) {
      return;
    }
    const at = centre(b);
    const ring = document.createElement("span");
    ring.className = "party-ring";
    ring.style.left = at.x + "px";
    ring.style.top = at.y + "px";
    ring.style.setProperty("--d", (b.w * b.grow * 1.1).toFixed(0) + "px");
    ring.addEventListener("animationend", function () {
      ring.remove();
    });
    playfield.appendChild(ring);

    const count = b.kind === "mini" ? 6 : b.kind === "normal" ? 9 : 14;
    for (let i = 0; i < count; i += 1) {
      const bit = document.createElement("span");
      const angle = (Math.PI * 2 * i) / count + rand(0, 0.6);
      const dist = b.w * b.grow * rand(0.55, 1.05);
      bit.className = "party-shard";
      bit.style.left = at.x + "px";
      bit.style.top = at.y + "px";
      bit.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
      bit.style.setProperty("--dy", (Math.sin(angle) * dist + b.w * 0.25).toFixed(1) + "px");
      bit.style.setProperty("--spin", rand(-360, 360).toFixed(0) + "deg");
      bit.style.setProperty("--c", b.kind === "star" && i % 2 ? art.CREAM : b.color);
      bit.addEventListener("animationend", function (event) {
        event.currentTarget.remove();
      });
      playfield.appendChild(bit);
    }
  }

  function chime() {
    const now = Date.now();
    streak = now - lastPop < STREAK_GAP ? streak + 1 : 0;
    lastPop = now;
    fx.tones([SCALE[Math.min(streak, SCALE.length - 1)]], 0.09);
  }

  function pop(b, counts) {
    if (b.dead) {
      return;
    }
    b.dead = true;
    b.body.classList.remove("hint", "puff");
    b.body.classList.add("burst");
    window.setTimeout(function () {
      b.el.remove();
    }, 280);
    shards(b);
    voice.sfx("pop");
    chime();

    if (!counts || round.finished) {
      return;
    }
    round.popped += 1;
    tallyEl.textContent = String(round.popped);
    fx.bump(tallyEl);
    if (round.popped >= setup.goal) {
      finishRound();
      return;
    }
    if (b.kind === "star") {
      chain(b);
    } else if (b.kind === "giant") {
      scatter(b);
    }
  }

  // The star balloon sets off every other balloon, nearest first.
  function chain(star) {
    const from = centre(star);
    live()
      .map(function (b) {
        const at = centre(b);
        return { b: b, far: Math.hypot(at.x - from.x, at.y - from.y) };
      })
      .sort(function (a, b) {
        return a.far - b.far;
      })
      .forEach(function (entry, index) {
        window.setTimeout(function () {
          pop(entry.b, true);
        }, 110 + index * 80);
      });
  }

  // The giant balloon bursts into a handful of little ones.
  function scatter(giant) {
    const at = centre(giant);
    for (let i = 0; i < MINIS; i += 1) {
      const size = base * 0.62;
      const angle = Math.PI * (0.1 + (0.8 * i) / (MINIS - 1)) + rand(-0.15, 0.15);
      addBalloon("mini", {
        x: Math.max(0, Math.min(width - size, at.x - size / 2 + Math.cos(angle) * giant.w * 0.3)),
        y: at.y - size * 0.5 - Math.sin(angle) * giant.w * 0.2,
        vx: Math.cos(angle) * base * 4.2,
        kick: -Math.sin(angle) * base * 2.2,
        fresh: true,
      });
    }
  }

  function tap(b) {
    if (b.kind === "giant" && b.taps < GIANT_TAPS - 1) {
      b.taps += 1;
      b.grow = 1 + b.taps * 0.17;
      b.body.style.setProperty("--grow", String(b.grow));
      fx.bump(b.body, "puff");
      fx.tones([262 * Math.pow(1.26, b.taps)], 0.09);
      return;
    }
    pop(b, true);
  }

  // The balloon under a finger. Taps get a generous margin for little hands;
  // a dragging finger has to actually touch the balloon.
  function hit(x, y, generous) {
    let found = null;
    let nearest = 1;
    for (let i = balloons.length - 1; i >= 0; i -= 1) {
      const b = balloons[i];
      if (b.dead) {
        continue;
      }
      const at = centre(b);
      const pad = generous ? 12 : 0;
      const stretch = generous ? 1.15 : 1;
      const rx = b.w * b.grow * 0.4 * stretch + pad;
      const ry = b.h * b.grow * 0.31 * stretch + pad;
      const dist = Math.pow((x - at.x) / rx, 2) + Math.pow((y - at.y) / ry, 2);
      if (dist < nearest) {
        nearest = dist;
        found = b;
      }
    }
    return found;
  }

  function point(event) {
    const box = playfield.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  playfield.addEventListener("pointerdown", function (event) {
    if (round.finished || (event.target.closest && event.target.closest(".celebrate"))) {
      return;
    }
    fingers[event.pointerId] = true;
    const at = point(event);
    const b = hit(at.x, at.y, true);
    if (b) {
      tap(b);
    }
  });

  playfield.addEventListener("pointermove", function (event) {
    if (round.finished || !fingers[event.pointerId]) {
      return;
    }
    const at = point(event);
    const b = hit(at.x, at.y, false);
    // The giant needs separate taps, so a swipe does not pump it up.
    if (b && b.kind !== "giant") {
      pop(b, true);
    }
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(function (name) {
    playfield.addEventListener(name, function (event) {
      delete fingers[event.pointerId];
    });
  });

  // Keyboard: space or enter pops the lowest balloon.
  document.addEventListener("keydown", function (event) {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }
    if (event.target.closest && event.target.closest("a, button, .prompt")) {
      return;
    }
    event.preventDefault();
    if (round.finished) {
      if (canDismiss()) {
        startRound();
      }
      return;
    }
    const b = lowest();
    if (b) {
      tap(b);
    }
  });

  function lowest() {
    return live()
      .filter(function (b) {
        return b.y + b.h * 0.35 < height && b.y + b.h * 0.35 > 0;
      })
      .sort(function (a, b) {
        return b.y - a.y;
      })[0];
  }

  // ---------- Rounds ----------

  function startRound() {
    measure();
    setup = LEVELS[Math.min(fx.level(), LEVELS.length) - 1];
    balloons.forEach(function (b) {
      b.el.remove();
    });
    balloons = [];
    round = { popped: 0, finished: false, shownAt: 0 };
    sinceStar = 0;
    sinceGiant = 0;
    nextStar = Math.round(rand(7, 10));
    nextGiant = Math.round(rand(4, 6));
    streak = 0;
    spawnIn = 0.5;
    tallyEl.textContent = "0";
    celebrateEl.classList.remove("show");
    voice.say("pop-the-balloons");

    // A few balloons already in the air, so there is something to pop at once.
    for (let i = 0; i < 3; i += 1) {
      const slot = (width - base) / 3;
      addBalloon("normal", {
        x: slot * i + rand(0, slot),
        y: height * rand(0.45, 0.68),
        fresh: true,
      });
    }
  }

  function finishRound() {
    round.finished = true;
    const count = round.popped;
    const rest = live();
    rest.forEach(function (b, index) {
      window.setTimeout(function () {
        pop(b, false);
      }, 120 + index * 70);
    });

    doneArt.innerHTML = [0, 1, 2]
      .map(function () {
        return art.get("balloon", pickColor());
      })
      .join("");
    doneCount.textContent = String(count);
    doneCaption.textContent = "You popped " + count + " balloons";

    window.setTimeout(function () {
      round.shownAt = Date.now();
      celebrateEl.classList.add("show");
      voice.word("well-done");
      fx.win(playfield);
    }, 520 + rest.length * 70);
  }

  // Fast tapping carries on for a moment after the last pop. Do not let those
  // taps skip the round-complete card before it has been seen.
  function canDismiss() {
    return celebrateEl.classList.contains("show") && Date.now() - round.shownAt > 900;
  }

  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    if (canDismiss()) {
      startRound();
    }
  });

  celebrateEl.addEventListener("click", function () {
    if (canDismiss()) {
      startRound();
    }
  });

  // ---------- Frame loop ----------

  function frame(now) {
    const dt = Math.min(0.05, (now - lastFrame) / 1000 || 0);
    lastFrame = now;

    if (!round.finished) {
      spawnIn -= dt;
      if (spawnIn <= 0 && live().length < setup.live) {
        addBalloon(nextKind());
        spawnIn = setup.gap * rand(0.7, 1.3);
      }
    }

    balloons = balloons.filter(function (b) {
      if (b.dead) {
        return b.el.isConnected;
      }
      b.age += dt;
      b.y -= b.vy * dt;
      if (b.vx || b.kick) {
        b.x = Math.max(0, Math.min(width - b.w, b.x + b.vx * dt));
        b.y += b.kick * dt;
        const slow = Math.exp(-3.2 * dt);
        b.vx *= slow;
        b.kick *= slow;
      }
      if (b.y + b.h < -8) {
        b.dead = true;
        b.el.remove();
        return false;
      }
      place(b);
      return true;
    });

    window.requestAnimationFrame(frame);
  }

  window.addEventListener("resize", measure);
  window.addEventListener("orientationchange", measure);

  fx.hint(function () {
    const b = lowest();
    return b ? [b.body] : [];
  });

  sampleEl.innerHTML = art.get("balloon", art.colors.red);
  startRound();
  window.requestAnimationFrame(function (now) {
    lastFrame = now;
    frame(now);
  });
})();
