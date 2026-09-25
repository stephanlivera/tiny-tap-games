(function () {
  const COLORS = [
    { id: "red", name: "red", fill: "#e2513a", text: "#c23d28" },
    { id: "blue", name: "blue", fill: "#3a78c9", text: "#2c5fa3" },
    { id: "yellow", name: "yellow", fill: "#f2b632", text: "#9a6d0c" },
    { id: "green", name: "green", fill: "#5aa66a", text: "#3a7f4a" },
    { id: "purple", name: "purple", fill: "#8d62c9", text: "#6d45a8" },
  ];

  const SLOTS = [
    { x: "5%", y: "30%" },
    { x: "24%", y: "13%" },
    { x: "43%", y: "34%" },
    { x: "62%", y: "15%" },
    { x: "78%", y: "31%" },
  ];

  const playfield = document.getElementById("playfield");
  const promptColor = document.getElementById("prompt-color");
  const promptEl = document.getElementById("prompt");
  const sampleEl = document.getElementById("sample");
  const celebrateEl = document.getElementById("celebrate");
  const doneArt = document.getElementById("done-art");
  const doneWord = document.getElementById("done-word");
  const doneCaption = document.getElementById("done-caption");
  const nextBtn = document.getElementById("next");

  let round = {
    target: COLORS[0],
    remaining: 0,
    total: 0,
    finished: false,
  };
  let lastColorId = "";

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

  function balloonSvg(color) {
    return window.TinyTapArt.get("balloon", color.fill);
  }

  function pickTarget() {
    const choices = COLORS.filter(function (color) {
      return color.id !== lastColorId;
    });
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function clearBalloons() {
    playfield.querySelectorAll(".balloon").forEach(function (node) {
      node.remove();
    });
  }

  function startRound() {
    const target = pickTarget();
    const others = shuffle(
      COLORS.filter(function (color) {
        return color.id !== target.id;
      })
    );
    const targetCount = Math.random() < 0.42 ? 2 : 1;
    const pack = [];
    for (let i = 0; i < targetCount; i += 1) {
      pack.push(target);
    }
    while (pack.length < 5) {
      pack.push(others[pack.length - targetCount]);
    }

    round.target = target;
    round.remaining = targetCount;
    round.total = targetCount;
    round.finished = false;
    lastColorId = target.id;

    celebrateEl.classList.remove("show");
    clearBalloons();

    promptColor.textContent = target.name;
    promptEl.style.setProperty("--prompt-color", target.text);
    if (window.TinyTapVoice) {
      window.TinyTapVoice.say(
        "pop-the-" + target.name + (targetCount === 1 ? "-balloon" : "-balloons")
      );
    }
    sampleEl.innerHTML = balloonSvg(target);
    playfield.dataset.target = target.id;

    const slots = shuffle(SLOTS).slice(0, pack.length);
    shuffle(pack).forEach(function (color, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "balloon";
      button.dataset.color = color.id;
      button.setAttribute("aria-label", color.name + " balloon");
      button.style.setProperty("--x", slots[index].x);
      button.style.setProperty("--y", slots[index].y);
      button.style.setProperty("--tilt", (Math.random() * 14 - 7).toFixed(1) + "deg");
      button.style.setProperty("--drift", (Math.random() * 18 - 4).toFixed(1) + "px");
      button.style.setProperty("--bob", (3.2 + Math.random() * 1.6).toFixed(2) + "s");
      button.innerHTML = balloonSvg(color);
      button.addEventListener("pointerup", onTap);
      playfield.appendChild(button);
    });
  }

  function onTap(event) {
    const balloon = event.currentTarget;
    if (round.finished || balloon.classList.contains("burst")) {
      return;
    }

    if (balloon.dataset.color !== round.target.id) {
      balloon.classList.remove("wobble");
      void balloon.offsetWidth;
      balloon.classList.add("wobble");
      return;
    }

    balloon.classList.add("burst");
    if (window.TinyTapVoice) {
      window.TinyTapVoice.sfx("pop");
    }
    if (window.TinyTapFx) {
      window.TinyTapFx.good(balloon);
    }
    round.remaining -= 1;

    if (round.remaining <= 0) {
      finishRound();
    }
  }

  function finishRound() {
    round.finished = true;
    const target = round.target;
    doneArt.innerHTML = balloonSvg(target);
    doneWord.textContent = target.name;
    doneWord.style.color = target.text;
    doneCaption.textContent =
      "You popped the " +
      target.name +
      (round.total === 1 ? " balloon" : " balloons");
    window.setTimeout(function () {
      if (window.TinyTapVoice) {
        window.TinyTapVoice.word(target.name);
      }
    }, 240);
    window.setTimeout(function () {
      celebrateEl.classList.add("show");
      if (window.TinyTapFx) {
        window.TinyTapFx.win(playfield);
      }
    }, 420);
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
