(function () {
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
})();
