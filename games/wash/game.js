// Car Wash: a muddy car rolls in. Rub (or tap) the mud with a soapy sponge
// until it is all gone, then the car beeps and drives away shiny.
(function () {
  const art = window.TinyTapArt;
  const fx = window.TinyTapFx;
  const voice = window.TinyTapVoice;

  const PAINT = ["red", "blue", "green", "purple", "orange", "teal", "yellow"];

  // Places mud can land, as percentages of the car's box, with a size factor.
  const SPOTS = [
    { x: 19, y: 62, s: 1.1 },
    { x: 34, y: 38, s: 0.9 },
    { x: 49, y: 62, s: 1.2 },
    { x: 52, y: 26, s: 0.9 },
    { x: 66, y: 40, s: 0.9 },
    { x: 80, y: 62, s: 1.1 },
    { x: 28, y: 80, s: 0.9 },
    { x: 75, y: 80, s: 0.9 },
    { x: 91, y: 66, s: 0.8 },
    { x: 8, y: 68, s: 0.8 },
  ];

  // By level: splats of mud, and how much rubbing (in splat-widths) each takes.
  const LEVELS = [
    { splats: 5, rub: 1.6 },
    { splats: 7, rub: 2.2 },
    { splats: 9, rub: 2.8 },
  ];
  // A plain tap counts for this share of a splat, so tapping works too.
  const TAP_SHARE = 0.34;
  const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568];

  const playfield = document.getElementById("playfield");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const nextBtn = document.getElementById("next");

  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) {}

  const car = document.createElement("div");
  car.className = "wash-car";
  car.innerHTML = '<div class="wash-body"></div>';
  const carBody = car.firstChild;
  playfield.insertBefore(car, celebrateEl);

  const sponge = document.createElement("div");
  sponge.className = "wash-sponge";
  sponge.innerHTML = art.get("sponge");
  playfield.insertBefore(sponge, celebrateEl);

  let setup = LEVELS[0];
  let splats = [];
  let round = { finished: true, ready: false, shownAt: 0, cleaned: 0 };
  let paint = "";
  let game = 0;
  let lastBubble = 0;
  const fingers = {};

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function later(seconds, run) {
    const mine = game;
    window.setTimeout(function () {
      if (mine === game) {
        run();
      }
    }, seconds * 1000);
  }

  function point(event) {
    const box = playfield.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  function bubble(x, y, big) {
    if (reduced) {
      return;
    }
    const bit = document.createElement("span");
    const size = rand(0.7, 1.5) * (big ? 1.5 : 1);
    bit.className = "wash-bubble";
    bit.style.left = x + rand(-18, 18) + "px";
    bit.style.top = y + rand(-18, 18) + "px";
    bit.style.setProperty("--size", size.toFixed(2) + "rem");
    bit.style.setProperty("--dx", rand(-26, 26).toFixed(0) + "px");
    bit.style.setProperty("--dy", rand(-70, -24).toFixed(0) + "px");
    bit.addEventListener("animationend", function () {
      bit.remove();
    });
    playfield.insertBefore(bit, sponge);
  }

  function moveSponge(at) {
    sponge.style.transform = "translate3d(" + at.x.toFixed(0) + "px," + at.y.toFixed(0) + "px,0)";
  }

  // Scrub every splat under the sponge by `amount` pixels of rubbing.
  function scrub(at, amount, tapped) {
    const home = playfield.getBoundingClientRect();
    splats.forEach(function (splat) {
      if (splat.done) {
        return;
      }
      const box = splat.el.getBoundingClientRect();
      const cx = box.left + box.width / 2 - home.left;
      const cy = box.top + box.height / 2 - home.top;
      const reach = box.width * 0.5 + 12;
      if (Math.hypot(at.x - cx, at.y - cy) > reach) {
        return;
      }
      const need = box.width * setup.rub;
      splat.rubbed += tapped ? need * TAP_SHARE : amount;
      const left = Math.max(0, 1 - splat.rubbed / need);
      splat.el.style.opacity = (0.25 + left * 0.75).toFixed(2);
      splat.el.style.scale = (0.6 + left * 0.4).toFixed(2);
      splat.el.classList.remove("hint");
      if (left <= 0) {
        clean(splat, cx, cy);
      }
    });
  }

  function clean(splat, x, y) {
    splat.done = true;
    splat.el.classList.add("gone");
    window.setTimeout(function () {
      splat.el.remove();
    }, 300);
    for (let i = 0; i < 6; i += 1) {
      bubble(x, y, true);
    }
    fx.tones([SCALE[Math.min(round.cleaned, SCALE.length - 1)]], 0.09);
    voice.sfx("pop");
    round.cleaned += 1;
    if (round.cleaned >= splats.length) {
      finishRound();
    }
  }

  playfield.addEventListener("pointerdown", function (event) {
    if (round.finished || !round.ready || (event.target.closest && event.target.closest(".celebrate"))) {
      return;
    }
    const at = point(event);
    fingers[event.pointerId] = at;
    moveSponge(at);
    sponge.classList.add("on");
    bubble(at.x, at.y);
    scrub(at, 0, true);
  });

  playfield.addEventListener("pointermove", function (event) {
    const last = fingers[event.pointerId];
    if (!last || round.finished) {
      return;
    }
    const at = point(event);
    const moved = Math.hypot(at.x - last.x, at.y - last.y);
    fingers[event.pointerId] = at;
    moveSponge(at);
    const now = Date.now();
    if (now - lastBubble > 45) {
      lastBubble = now;
      bubble(at.x, at.y);
    }
    scrub(at, moved, false);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(function (name) {
    playfield.addEventListener(name, function (event) {
      delete fingers[event.pointerId];
      if (!Object.keys(fingers).length) {
        sponge.classList.remove("on");
      }
    });
  });

  function startRound() {
    game += 1;
    setup = LEVELS[Math.min(fx.level(), LEVELS.length) - 1];
    round = { finished: false, ready: false, shownAt: 0, cleaned: 0 };
    celebrateEl.classList.remove("show");
    sponge.classList.remove("on");

    const choices = PAINT.filter(function (name) {
      return name !== paint;
    });
    paint = choices[Math.floor(Math.random() * choices.length)];
    carBody.innerHTML = art.get("car", art.colors[paint]);
    splats = shuffle(SPOTS)
      .slice(0, setup.splats)
      .map(function (spot) {
        const el = document.createElement("span");
        el.className = "wash-splat";
        el.style.left = spot.x + "%";
        el.style.top = spot.y + "%";
        el.style.setProperty("--size", (spot.s * rand(0.9, 1.1) * 21).toFixed(1) + "%");
        el.style.rotate = rand(0, 360).toFixed(0) + "deg";
        el.innerHTML = art.get("mud");
        carBody.appendChild(el);
        return { el: el, rubbed: 0, done: false };
      });

    // Park it off the left edge without animating, then roll in.
    car.className = "wash-car park-left";
    void car.offsetWidth;
    car.className = "wash-car";
    voice.say("wash-the-car");
    later(reduced ? 0.05 : 1.0, function () {
      round.ready = true;
    });
  }

  function finishRound() {
    round.finished = true;
    sponge.classList.remove("on");
    doneArt.innerHTML = art.get("car", art.colors[paint]);
    later(0.35, function () {
      car.classList.add("shiny");
      fx.good(car);
    });
    later(1.0, function () {
      // Beep beep.
      fx.tones([392, 392], 0.22);
      car.classList.add("leave");
    });
    later(2.1, function () {
      round.shownAt = Date.now();
      celebrateEl.classList.add("show");
      voice.word("well-done");
      fx.win(playfield);
    });
  }

  // Rubbing carries on for a moment after the last splat. Do not let that
  // skip the round-complete card before it has been seen.
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

  fx.hint(function () {
    return splats
      .filter(function (splat) {
        return !splat.done;
      })
      .slice(0, 1)
      .map(function (splat) {
        return splat.el;
      });
  });

  sampleEl.innerHTML = art.get("sponge");
  startRound();
})();
