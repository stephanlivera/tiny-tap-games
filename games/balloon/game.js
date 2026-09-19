(function () {
  const COLORS = [
    { id: "red", name: "red", fill: "#e25b3a", text: "#c4472b", ink: "#fffaf3" },
    { id: "blue", name: "blue", fill: "#3b7ddd", text: "#215ca8", ink: "#fffaf3" },
    { id: "yellow", name: "yellow", fill: "#e8b931", text: "#8a6a10", ink: "#2c2118" },
    { id: "green", name: "green", fill: "#3d9a4a", text: "#2c7a37", ink: "#fffaf3" },
    { id: "purple", name: "purple", fill: "#8b5cd6", text: "#6b3db0", ink: "#fffaf3" },
  ];

  const SLOTS = [
    { x: "6%", y: "16%" },
    { x: "38%", y: "6%" },
    { x: "70%", y: "14%" },
    { x: "16%", y: "50%" },
    { x: "54%", y: "46%" },
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
    return (
      '<svg class="art" viewBox="0 0 80 120" aria-hidden="true">' +
      '<ellipse cx="40" cy="42" rx="28" ry="34" fill="' +
      color.fill +
      '"/>' +
      '<ellipse cx="30" cy="30" rx="8" ry="12" fill="#fffaf3" opacity="0.32"/>' +
      '<path d="M40 76l-6 8h12z" fill="' +
      color.fill +
      '"/>' +
      '<path d="M40 84c0 14 10 16 6 26" fill="none" stroke="#2c2118" stroke-width="3" stroke-linecap="round"/>' +
      "</svg>"
    );
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
    const targetCount = Math.random() < 0.42 ? 2 : 1;
    const pack = [];
    for (let i = 0; i < targetCount; i += 1) {
      pack.push(target);
    }
    while (pack.length < 5) {
      pack.push(others[pack.length - targetCount]);
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
    sampleEl.style.setProperty("--pill", target.fill);
    sampleEl.style.setProperty("--pill-ink", target.ink);
    sampleEl.replaceChildren();
    playfield.dataset.target = target.id;

    const slots = shuffle(SLOTS).slice(0, pack.length);
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
      celebrateEl.classList.add("show");
    }, 320);
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

  startRound();
})();
