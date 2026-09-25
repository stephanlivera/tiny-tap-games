(function () {
  const ART = window.TinyTapArt;

  // Every shape in a round shares one colour, so colour never gives the answer away.
  const ROUND_COLORS = ["blue", "red", "green", "purple", "teal", "orange"];

  const SHAPES = [
    { id: "circle", name: "circle", art: "circle" },
    { id: "square", name: "square", art: "square" },
    { id: "triangle", name: "triangle", art: "triangle" },
    { id: "star", name: "star", art: "shapeStar" },
  ];

  const playfield = document.getElementById("playfield");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = { target: SHAPES[0], fill: ART.colors.blue, finished: false };
  let lastId = "";

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

  function shapeArt(shape) {
    return ART.get(shape.art, round.fill);
  }

  function pickTarget() {
    const choices = SHAPES.filter(function (shape) {
      return shape.id !== lastId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function clearItems() {
    playfield.querySelectorAll(".item").forEach(function (node) {
      node.remove();
    });
  }

  function startRound() {
    const target = pickTarget();
    round.target = target;
    round.fill = ART.colors[ROUND_COLORS[Math.floor(Math.random() * ROUND_COLORS.length)]];
    round.finished = false;
    lastId = target.id;

    celebrateEl.classList.remove("show");
    clearItems();
    promptEl.textContent = "Tap the " + target.name;
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("tap-the-" + target.name);
    }
    sampleEl.innerHTML = shapeArt(target);
    playfield.dataset.target = target.id;
    playfield.dataset.count = "4";

    shuffle(SHAPES).forEach(function (shape) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item";
      button.dataset.shape = shape.id;
      button.style.setProperty("--tilt", (Math.random() * 10 - 5).toFixed(1) + "deg");
      button.setAttribute("aria-label", shape.name);
      button.innerHTML = shapeArt(shape);
      button.addEventListener("pointerup", onTap);
      playfield.appendChild(button);
    });
  }

  function onTap(event) {
    const item = event.currentTarget;
    if (round.finished) {
      return;
    }

    if (item.dataset.shape !== round.target.id) {
      item.classList.remove("wobble");
      void item.offsetWidth;
      item.classList.add("wobble");
      return;
    }

    item.classList.add("found");
    if (window.TinyTapFx) {
      window.TinyTapFx.good(item);
    }
    finishRound();
  }

  function finishRound() {
    round.finished = true;
    const target = round.target;
    doneArt.innerHTML = shapeArt(target);
    doneWord.textContent = target.name;
    doneCaption.textContent = "You found the " + target.name;
    if (window.TinyTapVoice) {
      window.TinyTapVoice.word(target.name);
    }
    window.setTimeout(function () {
      celebrateEl.classList.add("show");
      if (window.TinyTapFx) {
        window.TinyTapFx.win(playfield);
      }
    }, 280);
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
