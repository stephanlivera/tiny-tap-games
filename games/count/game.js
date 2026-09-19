(function () {
  const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five"];

  const SETS = [
    {
      id: "apple",
      singular: "apple",
      plural: "apples",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="60" rx="30" ry="32" fill="#e25b3a"/>' +
          '<ellipse cx="38" cy="50" rx="8" ry="12" fill="#f4efe4" opacity="0.35"/>' +
          '<rect x="47" y="20" width="6" height="18" rx="3" fill="#6b4226" transform="rotate(8 50 29)"/>' +
          '<path d="M56 28c12-8 16 8 6 12" fill="#6aab4d"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "duck",
      singular: "duck",
      plural: "ducks",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="54" cy="64" rx="28" ry="18" fill="#e8b931"/>' +
          '<circle cx="34" cy="42" r="16" fill="#e8b931"/>' +
          '<circle cx="28" cy="38" r="3.2" fill="#2c2118"/>' +
          '<path d="M18 42h14l-6 8z" fill="#e25b3a"/>' +
          '<ellipse cx="70" cy="58" rx="10" ry="6" fill="#f4c95d"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "star",
      singular: "star",
      plural: "stars",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<polygon points="50,12 61,38 90,38 66,56 75,84 50,68 25,84 34,56 10,38 39,38" fill="#e8b931" stroke="#2c2118" stroke-width="3" stroke-linejoin="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "balloon",
      singular: "balloon",
      plural: "balloons",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="42" rx="24" ry="28" fill="#5ea9d6"/>' +
          '<ellipse cx="42" cy="34" rx="7" ry="11" fill="#f4efe4" opacity="0.35"/>' +
          '<path d="M50 70l-5 6h10z" fill="#5ea9d6"/>' +
          '<path d="M50 76c0 10 8 12 4 18" fill="none" stroke="#2c2118" stroke-width="3" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "fish",
      singular: "fish",
      plural: "fish",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="46" cy="52" rx="26" ry="16" fill="#1f9a8a"/>' +
          '<path d="M72 52l18-14v28z" fill="#167a6d"/>' +
          '<circle cx="34" cy="48" r="3.2" fill="#2c2118"/>' +
          '<path d="M46 38c6 4 6 12 0 16" fill="none" stroke="#f4efe4" stroke-width="3"/>' +
          "</svg>"
        );
      },
    },
  ];

  const playfield = document.getElementById("playfield");
  const promptEl = document.getElementById("prompt");
  const tallyEl = document.getElementById("tally");
  const celebrateEl = document.getElementById("celebrate");
  const doneNum = document.getElementById("done-num");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = {
    total: 1,
    found: 0,
    set: SETS[0],
    finished: false,
  };
  let lastTotal = 0;
  let lastSetId = "";

  function pickTotal() {
    const choices = [1, 2, 3, 4, 5].filter(function (n) {
      return n !== lastTotal;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function pickSet() {
    const choices = SETS.filter(function (set) {
      return set.id !== lastSetId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function noun(set, count) {
    return count === 1 ? set.singular : set.plural;
  }

  function clearItems() {
    playfield.querySelectorAll(".item").forEach(function (node) {
      node.remove();
    });
  }

  function startRound() {
    round.total = pickTotal();
    round.set = pickSet();
    round.found = 0;
    round.finished = false;
    lastTotal = round.total;
    lastSetId = round.set.id;

    celebrateEl.classList.remove("show");
    tallyEl.textContent = "0";
    promptEl.textContent = "Tap the " + noun(round.set, round.total);
    playfield.dataset.count = String(round.total);
    clearItems();

    for (let i = 0; i < round.total; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item";
      button.style.setProperty("--tilt", (Math.random() * 16 - 8).toFixed(1) + "deg");
      button.setAttribute("aria-label", round.set.singular);
      button.innerHTML = round.set.art() + '<span class="num" aria-hidden="true"></span>';
      button.addEventListener("pointerup", onTap);
      playfield.appendChild(button);
    }
  }

  function onTap(event) {
    const item = event.currentTarget;
    if (round.finished) {
      return;
    }

    item.classList.remove("pop");
    void item.offsetWidth;
    item.classList.add("pop");

    if (item.classList.contains("counted")) {
      return;
    }

    round.found += 1;
    item.classList.add("counted");
    item.querySelector(".num").textContent = String(round.found);
    tallyEl.textContent = String(round.found);

    if (round.found >= round.total) {
      finishRound();
    }
  }

  function finishRound() {
    round.finished = true;
    doneNum.textContent = String(round.total);
    doneWord.textContent = NUMBER_WORDS[round.total];
    doneCaption.textContent = round.total + " " + noun(round.set, round.total);
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
