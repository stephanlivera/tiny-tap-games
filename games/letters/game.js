(function () {
  const ART = window.TinyTapArt;
  const C = ART.colors;

  // Letters join the game at their level; by level 3 all 26 are in play.
  const LETTERS = [
    { id: "a", glyph: "A", word: "apple", fill: C.red, level: 1 },
    { id: "b", glyph: "B", word: "balloon", fill: C.blue, level: 1 },
    { id: "c", glyph: "C", word: "cat", fill: C.teal, level: 1 },
    { id: "d", glyph: "D", word: "duck", fill: C.yellow, ink: ART.INK, level: 1 },
    { id: "f", glyph: "F", word: "fish", fill: C.green, level: 1 },
    { id: "o", glyph: "O", word: "owl", fill: C.purple, level: 1 },
    { id: "r", glyph: "R", word: "rabbit", fill: C.brown, level: 1 },
    { id: "s", glyph: "S", word: "star", fill: C.orange, level: 1 },
    { id: "e", glyph: "E", word: "egg", fill: C.teal, level: 2 },
    { id: "g", glyph: "G", word: "goat", fill: C.green, level: 2 },
    { id: "h", glyph: "H", word: "hat", fill: C.red, level: 2 },
    { id: "m", glyph: "M", word: "moon", fill: C.purple, level: 2 },
    { id: "n", glyph: "N", word: "nest", fill: C.brown, level: 2 },
    { id: "p", glyph: "P", word: "pig", fill: C.pink, ink: ART.INK, level: 2 },
    { id: "t", glyph: "T", word: "tree", fill: C.blue, level: 2 },
    { id: "u", glyph: "U", word: "umbrella", fill: C.orange, level: 2 },
    { id: "i", glyph: "I", word: "igloo", fill: C.blue, level: 3 },
    { id: "j", glyph: "J", word: "jam", fill: C.red, level: 3 },
    { id: "k", glyph: "K", word: "kite", fill: C.yellow, ink: ART.INK, level: 3 },
    { id: "l", glyph: "L", word: "lion", fill: C.orange, level: 3 },
    { id: "q", glyph: "Q", word: "queen", fill: C.purple, level: 3 },
    { id: "v", glyph: "V", word: "van", fill: C.teal, level: 3 },
    { id: "w", glyph: "W", word: "whale", fill: C.blue, level: 3 },
    { id: "x", glyph: "X", word: "x-ray", fill: C.green, level: 3 },
    { id: "y", glyph: "Y", word: "yo-yo", fill: C.red, level: 3 },
    { id: "z", glyph: "Z", word: "zebra", fill: C.brown, level: 3 },
  ];

  // How many tiles are on the board, by level.
  const BOARD = [4, 4, 6];

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

  function level() {
    return window.TinyTapFx ? Math.min(window.TinyTapFx.level(), BOARD.length) : 1;
  }

  function pool() {
    const current = level();
    return LETTERS.filter(function (letter) {
      return letter.level <= current;
    });
  }

  function pickTarget() {
    const choices = pool().filter(function (letter) {
      return letter.id !== lastId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function pickBoard(target) {
    const others = shuffle(
      pool().filter(function (letter) {
        return letter.id !== target.id;
      })
    ).slice(0, BOARD[level() - 1] - 1);
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
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("tap-" + target.id);
    }

    const board = pickBoard(target);
    playfield.dataset.count = String(board.length);
    board.forEach(function (letter) {
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
      window.TinyTapVoice.word(target.id + "-for-" + target.word.replace(/-/g, ""));
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

  if (window.TinyTapFx) {
    window.TinyTapFx.hint(function () {
      return Array.prototype.slice.call(
        playfield.querySelectorAll('.item[data-letter="' + round.target.id + '"]')
      );
    });
  }

  startRound();
})();
