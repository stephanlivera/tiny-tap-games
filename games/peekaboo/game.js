(function () {
  const ART = window.TinyTapArt;

  const ANIMALS = ["cat", "dog", "owl", "rabbit", "mouse", "frog"].map(function (id) {
    return {
      id: id,
      name: id,
      art: function () {
        return ART.get(id);
      },
    };
  });

  const doorsEl = document.getElementById("doors");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = { opened: 0, animals: [], finished: false };

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

  function doorPanel() {
    return '<span class="door-panel" aria-hidden="true"><span class="door-knob"></span></span>';
  }

  function house(animal) {
    return (
      '<span class="roof" aria-hidden="true"></span>' +
      '<span class="wall"><span class="doorway">' +
      '<span class="door-inside">' +
      animal.art() +
      '<span class="door-name">' +
      animal.name +
      "</span></span>" +
      doorPanel() +
      "</span></span>"
    );
  }

  function joinNames(animals) {
    const names = animals.map(function (animal) {
      return animal.name;
    });
    if (names.length === 1) {
      return names[0];
    }
    if (names.length === 2) {
      return names[0] + " and " + names[1];
    }
    return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
  }

  function startRound() {
    round.animals = shuffle(ANIMALS).slice(0, 3);
    round.opened = 0;
    round.finished = false;
    celebrateEl.classList.remove("show");
    promptEl.textContent = "Who is hiding?";
    sampleEl.innerHTML = ART.get("house");
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say("tap-a-door");
    }
    doorsEl.replaceChildren();

    round.animals.forEach(function (animal) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "door";
      button.dataset.animal = animal.id;
      button.setAttribute("aria-label", "Closed door");
      button.innerHTML = house(animal);
      button.addEventListener("pointerup", onTap);
      doorsEl.appendChild(button);
    });
  }

  function onTap(event) {
    const door = event.currentTarget;
    if (round.finished) {
      return;
    }

    if (door.classList.contains("open")) {
      door.classList.remove("wiggle");
      void door.offsetWidth;
      door.classList.add("wiggle");
      return;
    }

    const animal = round.animals.filter(function (entry) {
      return entry.id === door.dataset.animal;
    })[0];
    door.classList.add("open");
    if (window.TinyTapFx) {
      window.TinyTapFx.good(door);
    }
    door.setAttribute("aria-label", animal.name);
    const article = /^[aeiou]/i.test(animal.name) ? "An " : "A ";
    promptEl.textContent = article + animal.name + "!";
    if (window.TinyTapVoice) {
      window.TinyTapVoice.word(animal.name);
    }
    round.opened += 1;

    if (round.opened >= round.animals.length) {
      finishRound();
    }
  }

  function finishRound() {
    round.finished = true;
    doneArt.innerHTML = round.animals
      .map(function (animal) {
        return animal.art();
      })
      .join("");
    doneCaption.textContent = "You found the " + joinNames(round.animals);
    window.setTimeout(function () {
      if (window.TinyTapVoice) {
        window.TinyTapVoice.word("well-done");
      }
      celebrateEl.classList.add("show");
      if (window.TinyTapFx) {
        window.TinyTapFx.win(celebrateEl.parentNode);
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
