(function () {
  const STROKE = "#2c2118";

  const PAIRS = [
    {
      id: "cat",
      name: "cat",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="68" rx="24" ry="16" fill="#e07a3a" stroke="' +
          STROKE +
          '" stroke-width="2.5"/>' +
          '<circle cx="50" cy="42" r="20" fill="#e07a3a" stroke="' +
          STROKE +
          '" stroke-width="2.5"/>' +
          '<path d="M32 32l-2-16 14 10zM68 32l2-16-14 10z" fill="#e07a3a" stroke="' +
          STROKE +
          '" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<circle cx="43" cy="40" r="3" fill="' +
          STROKE +
          '"/>' +
          '<circle cx="57" cy="40" r="3" fill="' +
          STROKE +
          '"/>' +
          '<path d="M46 50c4 4 8 4 12 0" fill="none" stroke="' +
          STROKE +
          '" stroke-width="2.5" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "dog",
      name: "dog",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="70" rx="26" ry="16" fill="#c48a3a" stroke="' +
          STROKE +
          '" stroke-width="2.5"/>' +
          '<circle cx="50" cy="44" r="18" fill="#c48a3a" stroke="' +
          STROKE +
          '" stroke-width="2.5"/>' +
          '<ellipse cx="30" cy="48" rx="8" ry="14" fill="#a56c28" stroke="' +
          STROKE +
          '" stroke-width="2"/>' +
          '<ellipse cx="70" cy="48" rx="8" ry="14" fill="#a56c28" stroke="' +
          STROKE +
          '" stroke-width="2"/>' +
          '<circle cx="44" cy="42" r="3" fill="' +
          STROKE +
          '"/>' +
          '<circle cx="56" cy="42" r="3" fill="' +
          STROKE +
          '"/>' +
          '<ellipse cx="50" cy="50" rx="5" ry="3.5" fill="' +
          STROKE +
          '"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "owl",
      name: "owl",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="58" rx="24" ry="28" fill="#8b5cd6" stroke="' +
          STROKE +
          '" stroke-width="2.5"/>' +
          '<circle cx="40" cy="50" r="10" fill="#fffaf3" stroke="' +
          STROKE +
          '" stroke-width="2"/>' +
          '<circle cx="60" cy="50" r="10" fill="#fffaf3" stroke="' +
          STROKE +
          '" stroke-width="2"/>' +
          '<circle cx="40" cy="50" r="4" fill="' +
          STROKE +
          '"/>' +
          '<circle cx="60" cy="50" r="4" fill="' +
          STROKE +
          '"/>' +
          '<path d="M46 62h8l-4 8z" fill="#e8b931" stroke="' +
          STROKE +
          '" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<path d="M32 34l8 8M68 34l-8 8" stroke="' +
          STROKE +
          '" stroke-width="3.5" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "star",
      name: "star",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<polygon points="50,14 61,38 88,38 66,55 74,82 50,66 26,82 34,55 12,38 39,38" fill="#e8b931" stroke="' +
          STROKE +
          '" stroke-width="3" stroke-linejoin="round"/>' +
          "</svg>"
        );
      },
    },
  ];

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
    return (
      '<span class="match-face match-back" aria-hidden="true">' +
      '<svg class="art" viewBox="0 0 100 100">' +
      '<rect x="10" y="10" width="80" height="80" rx="14" fill="#1f9a8a" stroke="' +
      STROKE +
      '" stroke-width="3"/>' +
      '<circle cx="50" cy="50" r="14" fill="#fffaf3" stroke="' +
      STROKE +
      '" stroke-width="2.5"/>' +
      "</svg>" +
      "</span>"
    );
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
    sampleEl.textContent = String(PAIR_COUNT);
    playfield.dataset.count = String(PAIR_COUNT * 2);
    gridEl.replaceChildren();
    updatePrompt();

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
      matchedCount += 1;
      flipped = [];
      resolving = false;
      updatePrompt();
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
