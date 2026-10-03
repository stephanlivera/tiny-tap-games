(function () {
  var script = document.currentScript;

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

  // Cache the whole site for offline play. Needs HTTPS (or localhost).
  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol) && script) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(new URL("../sw.js", script.src)).catch(function () {});
    });
  }
})();
