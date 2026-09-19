(function () {
  const FILL = "#1f9a8a";
  const STROKE = "#2c2118";

  const SHAPES = [
    {
      id: "circle",
      name: "circle",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle cx="50" cy="50" r="32" fill="' +
          FILL +
          '" stroke="' +
          STROKE +
          '" stroke-width="3"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "square",
      name: "square",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<rect x="22" y="22" width="56" height="56" rx="8" fill="' +
          FILL +
          '" stroke="' +
          STROKE +
          '" stroke-width="3"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "triangle",
      name: "triangle",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<polygon points="50,18 86,80 14,80" fill="' +
          FILL +
          '" stroke="' +
          STROKE +
          '" stroke-width="3" stroke-linejoin="round"/>' +
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
          '<polygon points="50,14 61,38 88,38 66,55 74,82 50,66 26,82 34,55 12,38 39,38" fill="' +
          FILL +
          '" stroke="' +
          STROKE +
          '" stroke-width="3" stroke-linejoin="round"/>' +
          "</svg>"
        );
      },
    },
  ];

  const playfield = document.getElementById("playfield");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = { target: SHAPES[0], finished: false };
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
    round.finished = false;
    lastId = target.id;

    celebrateEl.classList.remove("show");
    clearItems();
    promptEl.textContent = "Tap the " + target.name;
    sampleEl.style.setProperty("--pill", "#fffaf3");
    sampleEl.innerHTML = target.art();
    playfield.dataset.target = target.id;
    playfield.dataset.count = "4";

    shuffle(SHAPES).forEach(function (shape) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item";
      button.dataset.shape = shape.id;
      button.style.setProperty("--tilt", (Math.random() * 10 - 5).toFixed(1) + "deg");
      button.setAttribute("aria-label", shape.name);
      button.innerHTML = shape.art();
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
    finishRound();
  }

  function finishRound() {
    round.finished = true;
    const target = round.target;
    doneArt.innerHTML = target.art();
    doneWord.textContent = target.name;
    doneCaption.textContent = "You found the " + target.name;
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
