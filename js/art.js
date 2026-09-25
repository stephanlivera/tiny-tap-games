// Paper cut-out artwork shared by every game.
// Style rules: flat fills, no outlines, one darker "fold" shape and one light
// highlight per piece, slightly hand-cut curves. Faces use INK with a white glint.
(function (root) {
  var INK = "#2d3f45";
  var CREAM = "#fffdf7";
  var SHADE = "rgba(45, 63, 69, 0.14)";
  var SHINE = "rgba(255, 255, 255, 0.55)";
  var CHEEK = "rgba(242, 120, 120, 0.45)";

  var COLORS = {
    red: "#e2513a",
    blue: "#3a78c9",
    yellow: "#f2b632",
    green: "#5aa66a",
    purple: "#8d62c9",
    orange: "#e57f3a",
    teal: "#2f9e97",
    pink: "#f2a7b5",
    brown: "#b07a4a",
    grey: "#aaa29a",
  };

  function wrap(body, viewBox, extraClass) {
    return (
      '<svg class="art' + (extraClass ? " " + extraClass : "") + '" viewBox="' + (viewBox || "0 0 100 100") +
      '" aria-hidden="true">' + body + "</svg>"
    );
  }

  function eye(x, y, r) {
    r = r || 3.4;
    return (
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.35) + '" r="' + (r * 0.34) + '" fill="#fff"/>'
    );
  }

  function cheek(x, y) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="4.6" ry="3" fill="' + CHEEK + '"/>';
  }

  function smile(x, y, w) {
    w = w || 8;
    return (
      '<path d="M' + (x - w / 2) + " " + y + " q" + w / 2 + " " + w * 0.6 + " " + w + ' 0" fill="none" stroke="' + INK +
      '" stroke-width="2.6" stroke-linecap="round"/>'
    );
  }

  var ART = {
    apple: function () {
      return wrap(
        '<path d="M50 30 C36 19 15 27 16 52 C17 74 32 91 46 86 C48 85 52 85 54 86 C68 91 84 74 84 51 C84 27 63 20 50 30Z" fill="' + COLORS.red + '"/>' +
        '<path d="M63 25 C77 28 85 40 84 52 C83 74 68 90 54 86 C66 77 72 62 70 46 C69 36 66 30 63 25Z" fill="' + SHADE + '"/>' +
        '<path d="M27 44 C28 36 34 31 41 30" fill="none" stroke="' + SHINE + '" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M50 31 C50 23 52 17 56 12" fill="none" stroke="#7a4b2a" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M55 21 C60 10 74 9 77 15 C71 24 61 27 55 21Z" fill="' + COLORS.green + '"/>' +
        '<path d="M58 20 C64 16 69 15 73 15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>'
      );
    },

    duck: function () {
      return wrap(
        '<path d="M20 62 C20 50 32 45 45 49 C53 51 60 51 66 45 C74 38 87 42 85 57 C83 75 66 83 48 83 C31 83 20 73 20 62Z" fill="' + COLORS.yellow + '"/>' +
        '<path d="M22 70 C30 80 44 84 58 82 C72 80 82 72 85 60 C83 75 67 86 48 85 C34 85 25 79 22 70Z" fill="' + SHADE + '"/>' +
        '<path d="M47 61 C55 54 70 55 73 64 C66 71 54 71 47 61Z" fill="' + SHADE + '"/>' +
        '<path d="M19 38 C19 28 27 21 36 21 C46 21 53 29 53 38 C53 48 45 55 36 55 C27 55 19 48 19 38Z" fill="' + COLORS.yellow + '"/>' +
        '<path d="M25 30 C28 26 32 24 36 24" fill="none" stroke="' + SHINE + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M21 40 L5 43 C6 48 13 50 21 48Z" fill="' + COLORS.orange + '"/>' +
        eye(33, 35) + cheek(40, 44)
      );
    },

    star: function (fill) {
      fill = fill || COLORS.yellow;
      return wrap(
        '<path d="M50 11 L61 37 L89 39 L67 57 L75 85 L50 69 L25 85 L33 57 L11 39 L39 37Z" fill="' + fill +
        '" stroke="' + fill + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M50 11 L61 37 L89 39 L67 57 L75 85 L50 69Z" fill="' + SHADE + '" stroke="none"/>' +
        '<path d="M42 30 L47 20" fill="none" stroke="' + SHINE + '" stroke-width="4.5" stroke-linecap="round"/>'
      );
    },

    fish: function () {
      return wrap(
        '<path d="M14 52 C20 36 36 30 50 31 C64 32 72 42 74 52 C72 62 64 72 50 73 C36 74 20 68 14 52Z" fill="' + COLORS.teal + '"/>' +
        '<path d="M66 52 L90 34 C94 46 94 58 90 70Z" fill="' + COLORS.teal + '"/>' +
        '<path d="M70 52 L90 70 C93 62 93 56 92 52Z" fill="' + SHADE + '"/>' +
        '<path d="M16 56 C24 68 38 74 52 73 C64 72 71 64 74 54 C70 66 60 76 48 76 C34 76 22 70 16 56Z" fill="' + SHADE + '"/>' +
        '<path d="M44 32 C50 24 58 22 62 24 C60 30 54 33 48 34Z" fill="' + COLORS.blue + '"/>' +
        '<path d="M46 40 C52 46 52 58 46 64 M56 40 C61 46 61 58 56 64" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3.5" stroke-linecap="round"/>' +
        eye(29, 47) + cheek(32, 57)
      );
    },

    cat: function () {
      var c = COLORS.orange;
      return wrap(
        '<path d="M28 72 C28 60 38 56 50 56 C62 56 72 60 72 72 C72 84 62 90 50 90 C38 90 28 84 28 72Z" fill="' + c + '"/>' +
        '<path d="M30 78 C34 86 42 90 50 90 C60 90 70 86 72 76 C68 82 60 86 50 86 C42 86 34 84 30 78Z" fill="' + SHADE + '"/>' +
        '<path d="M26 20 L40 30 L30 38Z M74 20 L60 30 L70 38Z" fill="' + c + '" stroke="' + c + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M29 25 L36 31 L31 34Z M71 25 L64 31 L69 34Z" fill="' + COLORS.pink + '"/>' +
        '<path d="M28 44 C28 32 38 26 50 26 C62 26 72 32 72 44 C72 56 62 63 50 63 C38 63 28 56 28 44Z" fill="' + c + '"/>' +
        '<path d="M44 27 L46 35 M50 26 L50 34 M56 27 L54 35" stroke="' + SHADE + '" stroke-width="3" stroke-linecap="round"/>' +
        eye(41, 43) + eye(59, 43) + cheek(35, 51) + cheek(65, 51) +
        '<path d="M47 49 L53 49 L50 52Z" fill="' + INK + '"/>' + smile(50, 53, 6)
      );
    },

    dog: function () {
      var c = COLORS.brown;
      return wrap(
        '<path d="M28 74 C28 62 38 58 50 58 C62 58 72 62 72 74 C72 85 62 90 50 90 C38 90 28 85 28 74Z" fill="' + c + '"/>' +
        '<path d="M30 42 C30 30 39 23 50 23 C61 23 70 30 70 42 C70 55 61 63 50 63 C39 63 30 55 30 42Z" fill="' + c + '"/>' +
        '<path d="M31 30 C22 28 16 38 18 50 C19 57 25 58 28 52 C30 46 32 38 31 30Z M69 30 C78 28 84 38 82 50 C81 57 75 58 72 52 C70 46 68 38 69 30Z" fill="#7f5332"/>' +
        '<path d="M38 50 C38 44 44 42 50 42 C56 42 62 44 62 50 C62 57 56 60 50 60 C44 60 38 57 38 50Z" fill="#ecd3b0"/>' +
        '<ellipse cx="50" cy="47" rx="5" ry="3.6" fill="' + INK + '"/>' + smile(50, 53, 7) +
        eye(42, 37) + eye(58, 37) +
        '<path d="M58 26 C62 28 64 32 64 36" fill="none" stroke="' + SHINE + '" stroke-width="3" stroke-linecap="round"/>'
      );
    },

    owl: function () {
      var c = COLORS.purple;
      return wrap(
        '<path d="M26 22 L36 30 M74 22 L64 30" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M24 56 C24 36 36 26 50 26 C64 26 76 36 76 56 C76 76 64 88 50 88 C36 88 24 76 24 56Z" fill="' + c + '"/>' +
        '<path d="M36 64 C36 58 42 55 50 55 C58 55 64 58 64 64 C64 76 58 84 50 84 C42 84 36 76 36 64Z" fill="#c8b3ea"/>' +
        '<path d="M42 66 q4 4 8 0 q4 4 8 0 M44 74 q3 3 6 0 q3 3 6 0" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M66 32 C74 40 77 50 76 60 C76 76 64 88 50 88 C62 80 70 66 70 52 C70 44 68 38 66 32Z" fill="' + SHADE + '"/>' +
        '<circle cx="40" cy="46" r="10" fill="' + CREAM + '"/><circle cx="60" cy="46" r="10" fill="' + CREAM + '"/>' +
        eye(40, 46, 4.4) + eye(60, 46, 4.4) +
        '<path d="M46 55 L54 55 L50 61Z" fill="' + COLORS.yellow + '" stroke="' + COLORS.yellow + '" stroke-width="2" stroke-linejoin="round"/>'
      );
    },

    rabbit: function () {
      var c = COLORS.pink;
      return wrap(
        '<path d="M38 44 C30 36 28 18 34 10 C40 8 44 22 44 40Z M62 44 C70 36 72 18 66 10 C60 8 56 22 56 40Z" fill="' + c + '"/>' +
        '<path d="M38 36 C35 30 34 20 36 16 C39 18 41 26 41 36Z M62 36 C65 30 66 20 64 16 C61 18 59 26 59 36Z" fill="' + CREAM + '"/>' +
        '<path d="M26 64 C26 48 37 40 50 40 C63 40 74 48 74 64 C74 80 63 88 50 88 C37 88 26 80 26 64Z" fill="' + c + '"/>' +
        '<path d="M28 72 C32 82 40 88 50 88 C62 88 72 82 74 70 C70 78 62 84 50 84 C40 84 32 80 28 72Z" fill="' + SHADE + '"/>' +
        eye(42, 60) + eye(58, 60) +
        '<ellipse cx="50" cy="67" rx="3.6" ry="2.8" fill="' + COLORS.red + '"/>' +
        '<path d="M50 70 L50 74 M50 74 q-4 3 -7 0 M50 74 q4 3 7 0" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
        cheek(35, 70) + cheek(65, 70)
      );
    },

    mouse: function () {
      var c = COLORS.grey;
      return wrap(
        '<path d="M70 72 C84 72 90 82 84 90" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="28" cy="38" r="15" fill="' + c + '"/><circle cx="72" cy="38" r="15" fill="' + c + '"/>' +
        '<circle cx="28" cy="38" r="9" fill="' + COLORS.pink + '"/><circle cx="72" cy="38" r="9" fill="' + COLORS.pink + '"/>' +
        '<path d="M26 64 C26 48 37 42 50 42 C63 42 74 48 74 64 C74 80 63 88 50 88 C37 88 26 80 26 64Z" fill="' + c + '"/>' +
        '<path d="M28 72 C32 82 40 88 50 88 C62 88 72 82 74 70 C70 78 62 84 50 84 C40 84 32 80 28 72Z" fill="' + SHADE + '"/>' +
        eye(42, 60) + eye(58, 60) +
        '<ellipse cx="50" cy="68" rx="4" ry="3" fill="' + COLORS.pink + '"/>' +
        '<path d="M40 70 L28 68 M40 73 L29 76 M60 70 L72 68 M60 73 L71 76" stroke="rgba(45,63,69,0.45)" stroke-width="1.6" stroke-linecap="round"/>'
      );
    },

    frog: function () {
      var c = COLORS.green;
      return wrap(
        '<circle cx="34" cy="38" r="13" fill="' + c + '"/><circle cx="66" cy="38" r="13" fill="' + c + '"/>' +
        '<path d="M16 64 C16 50 30 44 50 44 C70 44 84 50 84 64 C84 80 68 88 50 88 C32 88 16 80 16 64Z" fill="' + c + '"/>' +
        '<path d="M18 70 C24 82 36 88 50 88 C66 88 80 82 84 68 C78 78 66 84 50 84 C36 84 24 80 18 70Z" fill="' + SHADE + '"/>' +
        '<circle cx="34" cy="38" r="7.5" fill="' + CREAM + '"/><circle cx="66" cy="38" r="7.5" fill="' + CREAM + '"/>' +
        eye(34, 38, 3.6) + eye(66, 38, 3.6) +
        '<path d="M36 64 q14 10 28 0" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>' +
        cheek(28, 62) + cheek(72, 62)
      );
    },

    balloon: function (fill) {
      return wrap(
        '<path d="M40 6 C60 6 71 24 71 42 C71 62 55 78 40 78 C25 78 9 62 9 42 C9 24 20 6 40 6Z" fill="' + fill + '"/>' +
        '<path d="M58 16 C67 24 71 34 71 42 C71 62 55 78 40 78 C52 70 60 56 60 40 C60 30 60 22 58 16Z" fill="' + SHADE + '"/>' +
        '<path d="M20 30 C22 21 28 15 35 13" fill="none" stroke="' + SHINE + '" stroke-width="5.5" stroke-linecap="round"/>' +
        '<path d="M34 78 L46 78 L40 86Z" fill="' + fill + '" stroke="' + fill + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M40 86 C34 98 46 106 39 118" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>',
        "0 0 80 120"
      );
    },

    circle: function (fill) {
      return wrap(
        '<path d="M50 16 C70 16 84 30 84 50 C84 70 70 84 50 84 C30 84 16 70 16 50 C16 30 30 16 50 16Z" fill="' + fill + '"/>' +
        '<path d="M72 24 C80 32 84 40 84 50 C84 70 70 84 50 84 C66 76 76 64 76 48 C76 38 75 30 72 24Z" fill="' + SHADE + '"/>' +
        '<path d="M28 40 C30 32 36 26 43 24" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round"/>'
      );
    },

    square: function (fill) {
      return wrap(
        '<path d="M26 18 L74 17 C80 17 83 20 83 26 L84 74 C84 80 81 83 75 83 L26 84 C20 84 17 81 17 75 L17 26 C17 20 20 18 26 18Z" fill="' + fill + '"/>' +
        '<path d="M83 50 L84 74 C84 80 81 83 75 83 L26 84 C20 84 17 81 17 75 L17 70 C40 74 64 70 83 50Z" fill="' + SHADE + '"/>' +
        '<path d="M27 36 L27 28 L36 28" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    },

    triangle: function (fill) {
      return wrap(
        '<path d="M50 16 L86 80 L14 80Z" fill="' + fill + '" stroke="' + fill + '" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M50 16 L86 80 L50 80Z" fill="' + SHADE + '" stroke="none"/>' +
        '<path d="M40 40 L46 30" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round"/>'
      );
    },

    shapeStar: function (fill) {
      return ART.star(fill);
    },

    heart: function (fill) {
      return wrap(
        '<path d="M50 84 C30 70 12 56 12 38 C12 25 22 16 33 16 C41 16 47 21 50 28 C53 21 59 16 67 16 C78 16 88 25 88 38 C88 56 70 70 50 84Z" fill="' + fill + '"/>' +
        '<path d="M50 28 C53 21 59 16 67 16 C78 16 88 25 88 38 C88 56 70 70 50 84Z" fill="' + SHADE + '"/>' +
        '<path d="M22 36 C22 29 27 24 33 24" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round"/>'
      );
    },

    oval: function (fill) {
      return wrap(
        '<path d="M50 26 C74 26 90 37 90 50 C90 63 74 74 50 74 C26 74 10 63 10 50 C10 37 26 26 50 26Z" fill="' + fill + '"/>' +
        '<path d="M74 30 C84 35 90 42 90 50 C90 63 74 74 50 74 C68 67 78 58 78 47 C78 41 77 35 74 30Z" fill="' + SHADE + '"/>' +
        '<path d="M22 44 C25 38 32 34 40 32" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round"/>'
      );
    },

    rectangle: function (fill) {
      return wrap(
        '<path d="M16 30 L84 29 C89 29 92 32 92 37 L92 63 C92 68 89 71 84 71 L16 72 C11 72 8 69 8 64 L8 38 C8 33 11 30 16 30Z" fill="' + fill + '"/>' +
        '<path d="M92 50 L92 63 C92 68 89 71 84 71 L16 72 C11 72 8 69 8 64 L8 62 C36 66 66 63 92 50Z" fill="' + SHADE + '"/>' +
        '<path d="M17 46 L17 39 L26 39" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    },

    diamond: function (fill) {
      return wrap(
        '<path d="M50 10 L84 50 L50 90 L16 50Z" fill="' + fill + '" stroke="' + fill + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M50 10 L84 50 L50 90Z" fill="' + SHADE + '" stroke="none"/>' +
        '<path d="M33 44 L42 33" fill="none" stroke="' + SHINE + '" stroke-width="5" stroke-linecap="round"/>'
      );
    },

    letter: function (glyph, fill, ink) {
      return wrap(
        '<path d="M22 10 L78 11 C86 11 90 15 90 23 L89 78 C89 86 85 90 77 90 L22 89 C14 89 10 85 10 77 L11 22 C11 14 14 10 22 10Z" fill="' + fill + '"/>' +
        '<path d="M89 56 L89 78 C89 86 85 90 77 90 L22 89 C14 89 10 85 10 77 L10 74 C36 80 66 76 89 56Z" fill="' + SHADE + '"/>' +
        '<text x="50" y="70" text-anchor="middle" font-family="Fredoka, ui-rounded, sans-serif" font-size="58" font-weight="700" fill="' + (ink || CREAM) + '">' + glyph + "</text>",
        null,
        "letter-tile"
      );
    },

    // Card back for Match the Pairs: a stamped paper pattern.
    cardBack: function () {
      return wrap(
        '<rect x="0" y="0" width="100" height="100" fill="' + COLORS.teal + '"/>' +
        '<path d="M50 30 L56 44 L71 45 L60 55 L63 70 L50 62 L37 70 L40 55 L29 45 L44 44Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.9)" stroke-width="4" stroke-linejoin="round"/>' +
        '<circle cx="18" cy="18" r="5" fill="rgba(255,255,255,0.25)"/><circle cx="82" cy="18" r="5" fill="rgba(255,255,255,0.25)"/>' +
        '<circle cx="18" cy="82" r="5" fill="rgba(255,255,255,0.25)"/><circle cx="82" cy="82" r="5" fill="rgba(255,255,255,0.25)"/>'
      );
    },

    // Circle, triangle and square together, for the Shapes home tile.
    shapesTrio: function () {
      return wrap(
        '<path d="M34 18 C46 18 54 26 54 38 C54 50 46 58 34 58 C22 58 14 50 14 38 C14 26 22 18 34 18Z" fill="' + COLORS.blue + '"/>' +
        '<path d="M68 26 L90 64 L46 64Z" fill="' + COLORS.yellow + '" stroke="' + COLORS.yellow + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M68 26 L90 64 L68 64Z" fill="' + SHADE + '" stroke="none"/>' +
        '<path d="M24 58 L58 57 C62 57 64 59 64 63 L64 86 C64 90 62 92 58 92 L24 92 C20 92 18 90 18 86 L18 64 C18 60 20 58 24 58Z" fill="' + COLORS.red + '"/>' +
        '<path d="M22 38 C23 31 27 27 32 25" fill="none" stroke="' + SHINE + '" stroke-width="4" stroke-linecap="round"/>'
      );
    },

    // Two face-up cards, for the Pairs home tile.
    pairs: function () {
      var card = function (x, rot, fill) {
        var cx = x + 20;
        return (
          '<g transform="rotate(' + rot + " " + cx + ' 52)">' +
          '<rect x="' + x + '" y="24" width="40" height="56" rx="7" fill="' + fill + '"/>' +
          '<path d="M' + cx + " 38 L" + (cx + 4) + " 47 L" + (cx + 13) + " 48 L" + (cx + 6) + " 54 L" + (cx + 8) + " 63 L" + cx + " 58 L" + (cx - 8) + " 63 L" + (cx - 6) + " 54 L" + (cx - 13) + " 48 L" + (cx - 4) + ' 47Z" fill="' + CREAM + '" stroke="' + CREAM + '" stroke-width="3" stroke-linejoin="round"/>' +
          "</g>"
        );
      };
      return wrap(card(12, -10, COLORS.teal) + card(48, 9, COLORS.red));
    },

    // Little house front used on the home tile for Peekaboo.
    house: function () {
      return wrap(
        '<path d="M12 46 L50 14 L88 46Z" fill="' + COLORS.red + '" stroke="' + COLORS.red + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M50 14 L88 46 L50 46Z" fill="' + SHADE + '" stroke="none"/>' +
        '<rect x="20" y="44" width="60" height="44" rx="3" fill="' + COLORS.yellow + '"/>' +
        '<path d="M38 88 L38 62 C38 55 43 52 50 52 C57 52 62 55 62 62 L62 88Z" fill="' + COLORS.teal + '"/>' +
        '<circle cx="57" cy="72" r="2.6" fill="' + COLORS.yellow + '"/>' +
        '<path d="M50 52 C43 52 38 55 38 62 L38 70 C44 66 44 58 50 52Z" fill="' + SHADE + '"/>'
      );
    },
  };

  root.TinyTapArt = {
    INK: INK,
    CREAM: CREAM,
    colors: COLORS,
    get: function (name) {
      var fn = ART[name];
      if (!fn) {
        return "";
      }
      return fn.apply(null, Array.prototype.slice.call(arguments, 1));
    },
  };
})(window);
