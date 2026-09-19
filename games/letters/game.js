(function () {
  const STROKE = "#2c2118";
  const CREAM = "#fffaf3";
  const INK = "#2c2118";

  const LETTERS = [
    { id: "a", glyph: "A", word: "apple", fill: "#e25b3a", ink: CREAM },
    { id: "b", glyph: "B", word: "balloon", fill: "#3b7ddd", ink: CREAM },
    { id: "c", glyph: "C", word: "cat", fill: "#1f9a8a", ink: CREAM },
    { id: "d", glyph: "D", word: "duck", fill: "#e8b931", ink: INK },
    { id: "f", glyph: "F", word: "fish", fill: "#3d9a4a", ink: CREAM },
    { id: "o", glyph: "O", word: "owl", fill: "#8b5cd6", ink: CREAM },
    { id: "r", glyph: "R", word: "rabbit", fill: "#c48a3a", ink: CREAM },
    { id: "s", glyph: "S", word: "star", fill: "#e07a3a", ink: CREAM },
  ];

  const playfield = document.getElementById("playfield");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = { target: LETTERS[0], finished: false };
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

  function letterArt(letter) {
    return (
      '<svg class="art letter-tile" viewBox="0 0 100 100" aria-hidden="true">' +
      '<rect x="8" y="8" width="84" height="84" rx="18" fill="' +
      letter.fill +
      '" stroke="' +
      STROKE +
      '" stroke-width="3"/>' +
      '<text x="50" y="68" text-anchor="middle" font-size="52" font-weight="800" fill="' +
      letter.ink +
      '">' +
      letter.glyph +
      "</text>" +
      "</svg>"
    );
  }

  function pickTarget() {
    const choices = LETTERS.filter(function (letter) {
      return letter.id !== lastId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function pickBoard(target) {
    const others = shuffle(
      LETTERS.filter(function (letter) {
        return letter.id !== target.id;
      })
    ).slice(0, 3);
    return shuffle(others.concat([target]));
  }

  function clearItems() {
    playfield.querySelectorAll(".item").forEach(function (node) {
      node.remove();
    });
  }

  function startRound() {
    const target = pickTarget();
    round.target = target;
    round.finished = false;
    lastId = target.id;

    celebrateEl.classList.remove("show");
    clearItems();
    promptEl.textContent = "Tap " + target.glyph;
    sampleEl.textContent = target.glyph;
    sampleEl.style.background = target.fill;
    sampleEl.style.color = target.ink;
    playfield.dataset.target = target.id;
    playfield.dataset.count = "4";
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("tap-" + target.id);
    }

    pickBoard(target).forEach(function (letter) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item";
      button.dataset.letter = letter.id;
      button.style.setProperty("--tilt", (Math.random() * 8 - 4).toFixed(1) + "deg");
      button.setAttribute("aria-label", letter.glyph);
      button.innerHTML = letterArt(letter);
      button.addEventListener("pointerup", onTap);
      playfield.appendChild(button);
    });
  }

  function onTap(event) {
    const item = event.currentTarget;
    if (round.finished) {
      return;
    }

    if (item.dataset.letter !== round.target.id) {
      item.classList.remove("wobble");
      void item.offsetWidth;
      item.classList.add("wobble");
      return;
    }

    item.classList.add("found");
    finishRound();
  }

  function finishRound() {
    round.finished = true;
    const target = round.target;
    doneArt.innerHTML = letterArt(target);
    doneWord.textContent = target.glyph;
    doneCaption.textContent = target.glyph + " is for " + target.word;
    if (window.TinyTapVoice) {
      window.TinyTapVoice.word(target.id + "-for-" + target.word);
    }
    window.setTimeout(function () {
      celebrateEl.classList.add("show");
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
