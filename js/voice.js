(function (root) {
  var BASE = "../../assets/voice/";
  var SFX = "../../assets/sfx/";
  var KEY = "tiny-tap-mute";
  var player = new Audio();
  var muted = false;
  var unlocked = false;
  var current = null;
  var pending = null;

  try {
    muted = root.localStorage.getItem(KEY) === "1";
  } catch (err) {}

  function play(id) {
    if (!id) {
      return;
    }
    pending = id;
    if (muted) {
      return;
    }
    try {
      player.pause();
    } catch (err) {}
    player.src = BASE + id + ".mp3";
    var result = player.play();
    if (result && result.then) {
      result.then(function () {
        unlocked = true;
      }).catch(function () {
        // Autoplay blocked until a tap — usual on iPad.
      });
    } else {
      unlocked = true;
    }
  }

  function syncButtons() {
    document.querySelectorAll("[data-sound-toggle]").forEach(function (btn) {
      btn.classList.toggle("is-muted", muted);
      btn.setAttribute("aria-pressed", muted ? "true" : "false");
      btn.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    });
  }

  function setMuted(next) {
    muted = !!next;
    try {
      root.localStorage.setItem(KEY, muted ? "1" : "0");
    } catch (err) {}
    if (muted) {
      try {
        player.pause();
      } catch (err) {}
    } else if (current) {
      play(current);
    }
    syncButtons();
  }

  function unlock() {
    if (unlocked) {
      return;
    }
    unlocked = true;
    if (pending) {
      play(pending);
    }
  }

  document.addEventListener(
    "pointerdown",
    function onFirstPointer(event) {
      document.removeEventListener("pointerdown", onFirstPointer, true);
      var target = event.target;
      if (target && target.closest) {
        if (target.closest("[data-sound-toggle]")) {
          unlocked = true;
          return;
        }
        if (target.closest("#prompt, .prompt")) {
          unlocked = true;
          return;
        }
      }
      unlock();
    },
    true
  );

  root.TinyTapVoice = {
    say: function (id) {
      current = id;
      play(id);
    },
    word: function (id) {
      play(id);
    },
    replay: function () {
      if (current) {
        play(current);
      }
    },
    sfx: function (id) {
      if (muted || !id) {
        return;
      }
      var shot = new Audio(SFX + id + ".mp3");
      shot.playbackRate = 0.94 + Math.random() * 0.12;
      var result = shot.play();
      if (result && result.then) {
        result.then(function () {
          unlocked = true;
        }).catch(function () {});
      }
    },
    ready: function () {
      syncButtons();
      var prompt = document.getElementById("prompt");
      if (prompt) {
        prompt.title = "Hear it again";
        prompt.addEventListener("click", function () {
          unlock();
          if (current) {
            play(current);
          }
        });
      }
      document.querySelectorAll("[data-sound-toggle]").forEach(function (btn) {
        var lastToggle = 0;
        function onToggle(event) {
          event.preventDefault();
          event.stopPropagation();
          var now = Date.now();
          if (now - lastToggle < 400) {
            return;
          }
          lastToggle = now;
          unlock();
          setMuted(!muted);
        }
        btn.addEventListener("pointerup", onToggle);
        btn.addEventListener("click", onToggle);
      });
    },
  };
})(window);

window.TinyTapVoice.ready();
