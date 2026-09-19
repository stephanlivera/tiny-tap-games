(function () {
  const ANIMALS = [
    {
      id: "cat",
      name: "cat",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="68" rx="24" ry="16" fill="#e07a3a"/>' +
          '<circle cx="50" cy="42" r="20" fill="#e07a3a"/>' +
          '<path d="M32 32l-2-16 14 10zM68 32l2-16-14 10z" fill="#e07a3a"/>' +
          '<circle cx="43" cy="40" r="3" fill="#2c2118"/>' +
          '<circle cx="57" cy="40" r="3" fill="#2c2118"/>' +
          '<path d="M46 50c4 4 8 4 12 0" fill="none" stroke="#2c2118" stroke-width="2.5" stroke-linecap="round"/>' +
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
          '<ellipse cx="50" cy="70" rx="26" ry="16" fill="#c48a3a"/>' +
          '<circle cx="50" cy="44" r="18" fill="#c48a3a"/>' +
          '<ellipse cx="30" cy="48" rx="8" ry="14" fill="#a56c28"/>' +
          '<ellipse cx="70" cy="48" rx="8" ry="14" fill="#a56c28"/>' +
          '<circle cx="44" cy="42" r="3" fill="#2c2118"/>' +
          '<circle cx="56" cy="42" r="3" fill="#2c2118"/>' +
          '<ellipse cx="50" cy="50" rx="5" ry="3.5" fill="#2c2118"/>' +
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
          '<ellipse cx="50" cy="58" rx="24" ry="28" fill="#8b5cd6"/>' +
          '<circle cx="40" cy="50" r="10" fill="#fffaf3"/>' +
          '<circle cx="60" cy="50" r="10" fill="#fffaf3"/>' +
          '<circle cx="40" cy="50" r="4" fill="#2c2118"/>' +
          '<circle cx="60" cy="50" r="4" fill="#2c2118"/>' +
          '<path d="M46 62h8l-4 8z" fill="#e8b931"/>' +
          '<path d="M32 34l8 8M68 34l-8 8" stroke="#6b3db0" stroke-width="4" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "rabbit",
      name: "rabbit",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="38" cy="28" rx="8" ry="22" fill="#f0c4c4"/>' +
          '<ellipse cx="58" cy="28" rx="8" ry="22" fill="#f0c4c4"/>' +
          '<ellipse cx="38" cy="28" rx="4" ry="14" fill="#f4efe4"/>' +
          '<ellipse cx="58" cy="28" rx="4" ry="14" fill="#f4efe4"/>' +
          '<circle cx="48" cy="58" r="22" fill="#f0c4c4"/>' +
          '<circle cx="42" cy="54" r="3" fill="#2c2118"/>' +
          '<circle cx="54" cy="54" r="3" fill="#2c2118"/>' +
          '<ellipse cx="48" cy="62" rx="4" ry="3" fill="#e25b3a"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "mouse",
      name: "mouse",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle cx="28" cy="40" r="12" fill="#b9b0a6"/>' +
          '<circle cx="62" cy="40" r="12" fill="#b9b0a6"/>' +
          '<ellipse cx="46" cy="58" rx="22" ry="18" fill="#cfc6bb"/>' +
          '<circle cx="40" cy="54" r="2.8" fill="#2c2118"/>' +
          '<circle cx="52" cy="54" r="2.8" fill="#2c2118"/>' +
          '<path d="M68 64c12 2 16 12 10 18" fill="none" stroke="#2c2118" stroke-width="3" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
    {
      id: "frog",
      name: "frog",
      art: function () {
        return (
          '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
          '<ellipse cx="50" cy="62" rx="28" ry="20" fill="#3d9a4a"/>' +
          '<circle cx="36" cy="42" r="10" fill="#3d9a4a"/>' +
          '<circle cx="64" cy="42" r="10" fill="#3d9a4a"/>' +
          '<circle cx="36" cy="42" r="4.5" fill="#fffaf3"/>' +
          '<circle cx="64" cy="42" r="4.5" fill="#fffaf3"/>' +
          '<circle cx="36" cy="42" r="2.4" fill="#2c2118"/>' +
          '<circle cx="64" cy="42" r="2.4" fill="#2c2118"/>' +
          '<path d="M40 68c6 6 14 6 20 0" fill="none" stroke="#2c7a37" stroke-width="3" stroke-linecap="round"/>' +
          "</svg>"
        );
      },
    },
  ];

  const doorsEl = document.getElementById("doors");
  const promptEl = document.getElementById("prompt");
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
      button.innerHTML =
        '<span class="door-inside">' +
        animal.art() +
        '<span class="door-name">' +
        animal.name +
        "</span></span>" +
        doorPanel();
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
