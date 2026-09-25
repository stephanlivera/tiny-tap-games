(function () {
  const COLORS = [
    { id: "red", name: "red", fill: "#e2513a", text: "#c23d28" },
    { id: "blue", name: "blue", fill: "#3a78c9", text: "#2c5fa3" },
    { id: "yellow", name: "yellow", fill: "#f2b632", text: "#9a6d0c" },
    { id: "green", name: "green", fill: "#5aa66a", text: "#3a7f4a" },
    { id: "purple", name: "purple", fill: "#8d62c9", text: "#6d45a8" },
  ];

  const SLOTS = [
    { x: "5%", y: "30%" },
    { x: "24%", y: "13%" },
    { x: "43%", y: "34%" },
    { x: "62%", y: "15%" },
    { x: "78%", y: "31%" },
  ];

  // Two staggered rows for the busier levels.
  const SLOTS_WIDE = [
    { x: "3%", y: "34%" },
    { x: "16%", y: "12%" },
    { x: "30%", y: "37%" },
    { x: "44%", y: "13%" },
    { x: "58%", y: "35%" },
    { x: "71%", y: "12%" },
    { x: "84%", y: "33%" },
  ];

  // Balloons on screen, and how many of them to pop, by level.
  const LEVELS = [
    { balloons: 5, targets: [1, 1, 2] },
    { balloons: 6, targets: [2, 3] },
    { balloons: 7, targets: [2, 3, 3] },
  ];

  const playfield = document.getElementById("playfield");
  const promptColor = document.getElementById("prompt-color");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = {
    target: COLORS[0],
    remaining: 0,
    total: 0,
    finished: false,
  };
  let lastColorId = "";

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

  function balloonSvg(color) {
    return window.TinyTapArt.get("balloon", color.fill);
  }

  function level() {
    return window.TinyTapFx ? Math.min(window.TinyTapFx.level(), LEVELS.length) : 1;
  }

  function pickTarget() {
    const choices = COLORS.filter(function (color) {
      return color.id !== lastColorId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function clearBalloons() {
    playfield.querySelectorAll(".balloon").forEach(function (node) {
      node.remove();
    });
  }

  function startRound() {
    const target = pickTarget();
    const others = shuffle(
      COLORS.filter(function (color) {
        return color.id !== target.id;
      })
    );
    const setup = LEVELS[level() - 1];
    const targetCount = setup.targets[Math.floor(Math.random() * setup.targets.length)];
    const pack = [];
    for (let i = 0; i < targetCount; i += 1) {
      pack.push(target);
    }
    while (pack.length < setup.balloons) {
      pack.push(others[(pack.length - targetCount) % others.length]);
    }

    round.target = target;
    round.remaining = targetCount;
    round.total = targetCount;
    round.finished = false;
    lastColorId = target.id;

    celebrateEl.classList.remove("show");
    clearBalloons();

    promptColor.textContent = target.name;
    promptEl.style.setProperty("--prompt-color", target.text);
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say(
        "pop-the-" + target.name + (targetCount === 1 ? "-balloon" : "-balloons")
      );
    }
    sampleEl.innerHTML = balloonSvg(target);
    playfield.dataset.target = target.id;
    playfield.dataset.count = String(pack.length);

    const slots = shuffle(pack.length > SLOTS.length ? SLOTS_WIDE : SLOTS).slice(0, pack.length);
    shuffle(pack).forEach(function (color, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "balloon";
      button.dataset.color = color.id;
      button.setAttribute("aria-label", color.name + " balloon");
      button.style.setProperty("--x", slots[index].x);
      button.style.setProperty("--y", slots[index].y);
      button.style.setProperty("--tilt", (Math.random() * 14 - 7).toFixed(1) + "deg");
      button.style.setProperty("--drift", (Math.random() * 18 - 4).toFixed(1) + "px");
      button.style.setProperty("--bob", (3.2 + Math.random() * 1.6).toFixed(2) + "s");
      button.innerHTML = balloonSvg(color);
      button.addEventListener("pointerup", onTap);
      playfield.appendChild(button);
    });
  }

  function onTap(event) {
    const balloon = event.currentTarget;
    if (round.finished || balloon.classList.contains("burst")) {
      return;
    }

    if (balloon.dataset.color !== round.target.id) {
      balloon.classList.remove("wobble");
      void balloon.offsetWidth;
      balloon.classList.add("wobble");
      return;
    }

    balloon.classList.add("burst");
    if (window.TinyTapVoice) {
      window.TinyTapVoice.sfx("pop");
    }
    if (window.TinyTapFx) {
      window.TinyTapFx.good(balloon);
    }
    round.remaining -= 1;

    if (round.remaining <= 0) {
      finishRound();
    }
  }

  function finishRound() {
    round.finished = true;
    const target = round.target;
    doneArt.innerHTML = balloonSvg(target);
    doneWord.textContent = target.name;
    doneWord.style.color = target.text;
    doneCaption.textContent =
      "You popped the " +
      target.name +
      (round.total === 1 ? " balloon" : " balloons");
    window.setTimeout(function () {
      if (window.TinyTapVoice) {
        window.TinyTapVoice.word(target.name);
      }
    }, 240);
    window.setTimeout(function () {
      celebrateEl.classList.add("show");
      if (window.TinyTapFx) {
        window.TinyTapFx.win(playfield);
      }
    }, 420);
  }

  nextBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    startRound();
  });

  celebrateEl.addEventListener("click", function () {
    if (celebrateEl.classList.contains("show")) {
      startRound();
    }
  });

  if (window.TinyTapFx) {
    window.TinyTapFx.hint(function () {
      return Array.prototype.slice.call(
        playfield.querySelectorAll('.balloon[data-color="' + round.target.id + '"]:not(.burst)'),
        0,
        1
      );
    });
  }

  startRound();
})();
