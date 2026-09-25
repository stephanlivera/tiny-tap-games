(function (root) {
  var COLORS = ["#e2513a", "#f2b632", "#2f9e97", "#3a78c9", "#8d62c9", "#5aa66a"];
  var STARS = 5;
  var won = 0;
  // Each full row of stars moves the game up one level for the rest of the visit.
  var rows = 0;
  var HINT_FIRST = 7000;
  var HINT_AGAIN = 12000;
  var HINT_MAX = 3;
  var hintTargets = null;
  var hintsGiven = 0;
  var lastActivity = Date.now();
  var reduced = false;
  var audio = null;

  try {
    reduced = root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (err) {}

  function isMuted() {
    return !!(root.TinyTapVoice && root.TinyTapVoice.muted && root.TinyTapVoice.muted());
  }

  function context() {
    if (audio) {
      return audio;
    }
    var Ctx = root.AudioContext || root.webkitAudioContext;
    if (!Ctx) {
      return null;
    }
    try {
      audio = new Ctx();
    } catch (err) {
      audio = null;
    }
    return audio;
  }

  // Soft bell tones, synthesised so there is no extra audio to download.
  function tones(notes, gap) {
    if (isMuted()) {
      return;
    }
    var ctx = context();
    if (!ctx) {
      return;
    }
    if (ctx.state === "suspended" && ctx.resume) {
      ctx.resume();
    }
    var start = ctx.currentTime + 0.02;
    notes.forEach(function (freq, index) {
      var at = start + index * gap;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.16, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.5);
    });
  }

  function layerFor(el) {
    var field = (el && el.closest && el.closest(".playfield")) || document.getElementById("playfield");
    return field || document.body;
  }

  function burst(field, x, y, count, spread, className) {
    for (var i = 0; i < count; i += 1) {
      var bit = document.createElement("span");
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      var dist = spread * (0.7 + Math.random() * 0.6);
      bit.className = className;
      bit.style.left = x + "px";
      bit.style.top = y + "px";
      bit.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
      bit.style.setProperty("--dy", (Math.sin(angle) * dist).toFixed(1) + "px");
      bit.style.setProperty("--spin", (Math.random() * 540 - 270).toFixed(0) + "deg");
      bit.style.setProperty("--c", COLORS[(i + Math.floor(Math.random() * 3)) % COLORS.length]);
      bit.style.animationDelay = (Math.random() * 80).toFixed(0) + "ms";
      bit.addEventListener("animationend", function (event) {
        event.currentTarget.remove();
      });
      field.appendChild(bit);
    }
  }

  // Little star sparks around a correct tap.
  function sparkle(el) {
    if (reduced || !el || !el.getBoundingClientRect) {
      return;
    }
    var field = layerFor(el);
    var box = el.getBoundingClientRect();
    var home = field.getBoundingClientRect();
    var x = box.left + box.width / 2 - home.left;
    var y = box.top + box.height / 2 - home.top;
    burst(field, x, y, 8, Math.max(box.width, box.height) * 0.75, "fx-spark");
  }

  // Confetti shower across the playfield for a finished round.
  function confetti(field) {
    field = field || layerFor(null);
    if (reduced || !field) {
      return;
    }
    // Fall behind the round-complete card so the words stay readable.
    var host = field.querySelector(".celebrate.show") || field;
    var width = field.clientWidth;
    for (var i = 0; i < 34; i += 1) {
      var bit = document.createElement("span");
      bit.className = "fx-confetti";
      bit.style.left = (Math.random() * width).toFixed(0) + "px";
      bit.style.setProperty("--c", COLORS[i % COLORS.length]);
      bit.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
      bit.style.setProperty("--spin", (Math.random() * 900 - 450).toFixed(0) + "deg");
      bit.style.setProperty("--fall", (field.clientHeight + 40).toFixed(0) + "px");
      bit.style.animationDuration = (1.4 + Math.random() * 1.1).toFixed(2) + "s";
      bit.style.animationDelay = (Math.random() * 350).toFixed(0) + "ms";
      if (i % 3 === 0) {
        bit.classList.add("round");
      }
      bit.addEventListener("animationend", function (event) {
        event.currentTarget.remove();
      });
      host.appendChild(bit);
    }
  }

  // A row of paper stars that fills up, one per finished round.
  function progressRow() {
    var shell = document.querySelector(".game-shell");
    if (!shell) {
      return null;
    }
    var row = shell.querySelector(".progress");
    if (!row) {
      row = document.createElement("div");
      row.className = "progress";
      row.setAttribute("aria-hidden", "true");
      row.dataset.level = "1";
      for (var i = 0; i < STARS; i += 1) {
        row.appendChild(document.createElement("i"));
      }
      shell.appendChild(row);
    }
    return row;
  }

  // Empty the row, ready for the next level's colour.
  function resetRow(row) {
    won = 0;
    row.dataset.level = String(Math.min(rows + 1, 3));
    row.classList.remove("full");
    row.querySelectorAll("i").forEach(function (star) {
      star.classList.remove("on");
    });
  }

  function addStar() {
    var row = progressRow();
    if (!row) {
      return;
    }
    if (won >= STARS) {
      resetRow(row);
    }
    won += 1;
    row.children[won - 1].classList.add("on");
    if (won >= STARS) {
      rows += 1;
      row.classList.add("full");
    }
  }

  function bump(el, className) {
    if (!el) {
      return;
    }
    className = className || "bump";
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  // After a quiet spell, say the prompt again and wiggle the right answer.
  // Stops after a few tries so a tablet left on the couch goes quiet.
  function checkIdle() {
    var celebrating = !!document.querySelector(".celebrate.show");
    if (won >= STARS && !celebrating) {
      resetRow(progressRow());
    }
    if (!hintTargets || document.hidden) {
      return;
    }
    if (celebrating) {
      lastActivity = Date.now();
      return;
    }
    if (hintsGiven >= HINT_MAX || Date.now() - lastActivity < (hintsGiven ? HINT_AGAIN : HINT_FIRST)) {
      return;
    }
    lastActivity = Date.now();
    hintsGiven += 1;
    if (root.TinyTapVoice) {
      root.TinyTapVoice.replay();
    }
    (hintTargets() || []).forEach(function (el) {
      bump(el, "hint");
      root.setTimeout(function () {
        el.classList.remove("hint");
      }, 1400);
    });
  }

  document.addEventListener(
    "pointerdown",
    function () {
      lastActivity = Date.now();
      hintsGiven = 0;
    },
    true
  );
  root.setInterval(checkIdle, 1000);

  progressRow();

  root.TinyTapFx = {
    // A right answer: sparkle plus a bright two-note chime.
    good: function (el) {
      sparkle(el);
      tones([784, 1175], 0.09);
    },
    // A finished round: confetti plus a rising little tune.
    win: function (field) {
      confetti(field);
      addStar();
      tones(won >= STARS ? [523, 659, 784, 1047, 1319, 1568] : [523, 659, 784, 1047], 0.11);
    },
    // Restart a one-shot CSS animation class on an element.
    bump: bump,
    // Current level: 1, then one higher for each full row of stars.
    // Games clamp it to the number of levels they have.
    level: function () {
      return rows + 1;
    },
    // Register a function that returns the pieces to wiggle when a child is stuck.
    hint: function (targets) {
      hintTargets = targets;
      lastActivity = Date.now();
    },
  };
})(window);
