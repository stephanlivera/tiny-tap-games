// Boop: animals peek out of burrows in the meadow. Tap one and it squeaks
// happily and ducks back down. Nobody gets hit, and a missed animal just
// comes back later.
(function () {
  const art = window.TinyTapArt;
  const fx = window.TinyTapFx;
  const voice = window.TinyTapVoice;

  const ANIMALS = ["rabbit", "mouse", "frog", "owl", "cat", "dog"];

  // By level: burrows, boops to finish a round, animals up at once, seconds an
  // animal stays up, and seconds between animals.
  const LEVELS = [
    { burrows: 3, goal: 8, up: 1, stay: 2.6, gap: 0.7 },
    { burrows: 5, goal: 10, up: 2, stay: 2.0, gap: 0.55 },
    { burrows: 6, goal: 12, up: 2, stay: 1.5, gap: 0.45 },
  ];

  const playfield = document.getElementById("playfield");
  const tallyEl = document.getElementById("tally");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneCount = document.getElementById("done-count");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let setup = LEVELS[0];
  let burrows = [];
  let round = { booped: 0, finished: true, shownAt: 0, friends: [] };
  // Timers from an old round check this before doing anything.
  let game = 0;
  let lastBurrow = null;
  let lastAnimal = "";

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(list, avoid) {
    const choices = list.filter(function (entry) {
      return entry !== avoid;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function later(seconds, run) {
    const mine = game;
    window.setTimeout(function () {
      if (mine === game) {
        run();
      }
    }, seconds * 1000);
  }

  function buildBurrows() {
    playfield.querySelectorAll(".burrow").forEach(function (node) {
      node.remove();
    });
    burrows = [];
    playfield.dataset.count = String(setup.burrows);
    for (let i = 0; i < setup.burrows; i += 1) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "burrow";
      el.setAttribute("aria-label", "Burrow");
      el.innerHTML =
        '<span class="burrow-mound"></span><span class="burrow-hole"></span>' +
        '<span class="burrow-peek"><span class="burrow-animal"></span></span>';
      const burrow = { el: el, animal: el.querySelector(".burrow-animal"), name: "", up: false, visit: 0 };
      el.addEventListener("pointerdown", function () {
        tap(burrow);
      });
      el.addEventListener("keydown", function (event) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          tap(burrow);
        }
      });
      playfield.insertBefore(el, celebrateEl);
      burrows.push(burrow);
    }
  }

  function upCount() {
    return burrows.filter(function (burrow) {
      return burrow.up;
    }).length;
  }

  function peek() {
    if (round.finished) {
      return;
    }
    const free = burrows.filter(function (burrow) {
      return !burrow.up && !burrow.el.classList.contains("booped");
    });
    if (upCount() < setup.up && free.length) {
      const burrow = pick(free.length > 1 ? free : free.concat([null]), lastBurrow) || free[0];
      const name = pick(ANIMALS, lastAnimal);
      lastBurrow = burrow;
      lastAnimal = name;
      burrow.name = name;
      burrow.animal.innerHTML = art.get(name);
      burrow.up = true;
      burrow.visit += 1;
      burrow.el.classList.add("up");
      burrow.el.setAttribute("aria-label", name);
      const visit = burrow.visit;
      later(setup.stay * rand(0.85, 1.15), function () {
        if (burrow.visit === visit && burrow.up) {
          hide(burrow);
        }
      });
    }
    later(setup.gap * rand(0.7, 1.4), peek);
  }

  function hide(burrow) {
    burrow.up = false;
    burrow.el.classList.remove("up", "hint");
    burrow.el.setAttribute("aria-label", "Burrow");
  }

  function tap(burrow) {
    if (round.finished) {
      return;
    }
    if (!burrow.up) {
      fx.bump(burrow.el, "empty");
      return;
    }
    burrow.up = false;
    burrow.el.classList.remove("hint");
    burrow.el.classList.add("booped");
    fx.good(burrow.animal);
    voice.word(burrow.name);
    if (round.friends.indexOf(burrow.name) < 0) {
      round.friends.push(burrow.name);
    }
    round.booped += 1;
    tallyEl.textContent = String(round.booped);
    fx.bump(tallyEl);

    // A happy squish, then back down the hole.
    later(0.42, function () {
      burrow.el.classList.remove("up", "booped");
      burrow.el.setAttribute("aria-label", "Burrow");
    });
    if (round.booped >= setup.goal) {
      finishRound();
    }
  }

  function startRound() {
    game += 1;
    setup = LEVELS[Math.min(fx.level(), LEVELS.length) - 1];
    round = { booped: 0, finished: false, shownAt: 0, friends: [] };
    tallyEl.textContent = "0";
    celebrateEl.classList.remove("show");
    buildBurrows();
    voice.say("tap-the-animals");
    later(0.7, peek);
  }

  function finishRound() {
    round.finished = true;
    const count = round.booped;
    doneArt.innerHTML = round.friends
      .slice(0, 4)
      .map(function (name) {
        return art.get(name);
      })
      .join("");
    doneCount.textContent = String(count);
    doneCaption.textContent = "You found " + count + " friends";
    later(0.75, function () {
      burrows.forEach(hide);
      round.shownAt = Date.now();
      celebrateEl.classList.add("show");
      voice.word("well-done");
      fx.win(playfield);
    });
  }

  // Fast tapping carries on for a moment after the last boop. Do not let those
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

  fx.hint(function () {
    return burrows
      .filter(function (burrow) {
        return burrow.up;
      })
      .map(function (burrow) {
        return burrow.el;
      });
  });

  sampleEl.innerHTML = art.get("rabbit");
  startRound();
})();
