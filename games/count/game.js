(function () {
  const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five"];

  const ART = window.TinyTapArt;

  const SETS = [
    { id: "apple", singular: "apple", plural: "apples", art: function () { return ART.get("apple"); } },
    { id: "duck", singular: "duck", plural: "ducks", art: function () { return ART.get("duck"); } },
    { id: "star", singular: "star", plural: "stars", art: function () { return ART.get("star"); } },
    { id: "balloon", singular: "balloon", plural: "balloons", art: function () { return ART.get("balloon", ART.colors.blue); } },
    { id: "fish", singular: "fish", plural: "fish", art: function () { return ART.get("fish"); } },
  ];

  const playfield = document.getElementById("playfield");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const doneArt = document.getElementById("done-art");
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
    sampleEl.innerHTML = round.set.art();
    playfield.dataset.count = String(round.total);
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("tap-the-" + noun(round.set, round.total));
    }
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
    if (window.TinyTapFx) {
      window.TinyTapFx.good(item);
      window.TinyTapFx.bump(tallyEl);
    }

    if (round.found >= round.total) {
      finishRound();
    }
  }

  function finishRound() {
    round.finished = true;
    doneNum.textContent = String(round.total);
    doneWord.textContent = NUMBER_WORDS[round.total];
    doneCaption.textContent = round.total + " " + noun(round.set, round.total);
    doneArt.innerHTML = round.set.art().repeat(round.total);
    if (window.TinyTapVoice) {
      window.TinyTapVoice.word(NUMBER_WORDS[round.total]);
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
