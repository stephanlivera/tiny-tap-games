(function () {
  const ART = window.TinyTapArt;

  // Each id doubles as the voice clip spoken when the pair is found.
  const PAIRS = ["cat", "dog", "owl", "star", "frog", "mouse", "rabbit"].map(function (id) {
    return {
      id: id,
      name: id,
      art: function () {
        return ART.get(id);
      },
    };
  });

  const PAIR_COUNT = 4;

  const gridEl = document.getElementById("grid");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");
  const playfield = document.getElementById("playfield");

  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let resolving = false;
  let finished = false;

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

  function backFace() {
    return '<span class="match-face match-back" aria-hidden="true">' + ART.get("cardBack") + "</span>";
  }

  function frontFace(pair) {
    return (
      '<span class="match-face match-front" aria-hidden="true">' +
      pair.art() +
      "</span>"
    );
  }

  function updatePrompt() {
    const left = PAIR_COUNT - matchedCount;
    if (left <= 0) {
      promptEl.textContent = "All matched!";
      return;
    }
    if (flipped.length === 1) {
      promptEl.textContent = "Find the match";
      return;
    }
    promptEl.textContent = left === PAIR_COUNT ? "Find the pairs" : "Keep going";
  }

  function startRound() {
    const chosen = shuffle(PAIRS).slice(0, PAIR_COUNT);
    const deck = [];
    chosen.forEach(function (pair) {
      deck.push(pair);
      deck.push(pair);
    });
    cards = shuffle(deck);
    flipped = [];
    matchedCount = 0;
    resolving = false;
    finished = false;
    celebrateEl.classList.remove("show");
    playfield.dataset.count = String(PAIR_COUNT * 2);
    gridEl.replaceChildren();
    updatePrompt();
    sampleEl.innerHTML = ART.get("pairs");
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("find-the-pairs");
    }

    cards.forEach(function (pair, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "match-card";
      button.dataset.id = pair.id;
      button.dataset.index = String(index);
      button.setAttribute("aria-label", "Hidden card");
      button.innerHTML = frontFace(pair) + backFace();
      button.addEventListener("pointerup", onTap);
      gridEl.appendChild(button);
    });
  }

  function onTap(event) {
    const card = event.currentTarget;
    if (finished || resolving) {
      return;
    }
    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
      return;
    }
    if (flipped.length >= 2) {
      return;
    }

    card.classList.add("flipped");
    card.setAttribute("aria-label", card.dataset.id);
    flipped.push(card);
    updatePrompt();

    if (flipped.length < 2) {
      return;
    }

    resolving = true;
    const first = flipped[0];
    const second = flipped[1];

    if (first.dataset.id === second.dataset.id) {
      first.classList.add("matched");
      second.classList.add("matched");
      if (window.TinyTapFx) {
        window.TinyTapFx.good(first);
        window.TinyTapFx.good(second);
      }
      matchedCount += 1;
      flipped = [];
      resolving = false;
      updatePrompt();
      if (window.TinyTapVoice) {
        window.TinyTapVoice.word(first.dataset.id);
      }
      if (matchedCount >= PAIR_COUNT) {
        finishRound();
      }
      return;
    }

    window.setTimeout(function () {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      first.setAttribute("aria-label", "Hidden card");
      second.setAttribute("aria-label", "Hidden card");
      flipped = [];
      resolving = false;
      updatePrompt();
    }, 700);
  }

  function finishRound() {
    finished = true;
    const shown = [];
    const seen = {};
    cards.forEach(function (pair) {
      if (!seen[pair.id]) {
        seen[pair.id] = true;
        shown.push(pair);
      }
    });
    doneArt.innerHTML = shown
      .map(function (pair) {
        return pair.art();
      })
      .join("");
    doneCaption.textContent = "You found all the pairs";
    window.setTimeout(function () {
      if (window.TinyTapVoice) {
        window.TinyTapVoice.word("well-done");
      }
      celebrateEl.classList.add("show");
      if (window.TinyTapFx) {
        window.TinyTapFx.win(playfield);
      }
    }, 900);
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
