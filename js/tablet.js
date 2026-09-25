(function () {
  var script = document.currentScript;
  var HOLD_MS = 900;

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  document.addEventListener(
    "touchmove",
    function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  ["gesturestart", "gesturechange", "gestureend"].forEach(function (name) {
    document.addEventListener(name, function (event) {
      event.preventDefault();
    });
  });

  // In a game, home needs a press-and-hold so a stray tap does not end play.
  // A short tap just wiggles the button. Keyboard activation still works at once.
  document.querySelectorAll("[data-hold]").forEach(function (link) {
    var start = 0;
    var frame = 0;

    function reset() {
      window.cancelAnimationFrame(frame);
      start = 0;
      link.classList.remove("holding");
      link.style.setProperty("--hold", "0");
    }

    function tick(now) {
      if (!start) {
        start = now;
      }
      var progress = Math.min((now - start) / HOLD_MS, 1);
      link.style.setProperty("--hold", progress.toFixed(3));
      if (progress >= 1) {
        reset();
        window.location.href = link.href;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function release() {
      if (!link.classList.contains("holding")) {
        return;
      }
      reset();
      link.classList.remove("nudge");
      void link.offsetWidth;
      link.classList.add("nudge");
    }

    link.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      reset();
      link.classList.add("holding");
      frame = window.requestAnimationFrame(tick);
    });
    link.addEventListener("pointerup", release);
    link.addEventListener("pointercancel", release);
    link.addEventListener("pointerleave", release);
    link.addEventListener("click", function (event) {
      if (event.detail !== 0) {
        event.preventDefault();
      }
    });
  });

  // Cache the whole site for offline play. Needs HTTPS (or localhost).
  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol) && script) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(new URL("../sw.js", script.src)).catch(function () {});
    });
  }
})();
