(function () {
  const ART = window.TinyTapArt;
  const C = ART.colors;

  const LETTERS = [
    { id: "a", glyph: "A", word: "apple", fill: C.red },
    { id: "b", glyph: "B", word: "balloon", fill: C.blue },
    { id: "c", glyph: "C", word: "cat", fill: C.teal },
    { id: "d", glyph: "D", word: "duck", fill: C.yellow, ink: ART.INK },
    { id: "f", glyph: "F", word: "fish", fill: C.green },
    { id: "o", glyph: "O", word: "owl", fill: C.purple },
    { id: "r", glyph: "R", word: "rabbit", fill: C.brown },
    { id: "s", glyph: "S", word: "star", fill: C.orange },
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
    return ART.get("letter", letter.glyph, letter.fill, letter.ink);
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
    sampleEl.innerHTML = letterArt(target);
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
    if (window.TinyTapFx) {
      window.TinyTapFx.good(item);
    }
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
