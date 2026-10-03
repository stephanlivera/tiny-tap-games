// Draws the art on the home menu cards. Kept out of index.html because the
// site's Content-Security-Policy blocks inline scripts.
(function () {
  document.querySelectorAll(".card-art").forEach(function (slot) {
    var art = window.TinyTapArt;
    var color = art.colors[slot.dataset.color];
    slot.innerHTML = slot.dataset.glyph
      ? art.get(slot.dataset.art, slot.dataset.glyph, color)
      : art.get(slot.dataset.art, color);
  });
})();
