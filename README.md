# Tiny Tap Games

Simple educational web games for young kids. Big tap targets, short rounds, no accounts, no ads, no tracking.

This is a static site. Any web server that can serve files is enough — including a VPS behind nginx or Caddy.

## Play now (local)

From this folder:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

On a tablet on the same network, use the computer's LAN address instead of `localhost`.

## Games

| Game | Status | What it teaches |
| --- | --- | --- |
| Count the Things | Playable | Numbers 1–5 and English number words |
| Balloon Pop | Playable | Colours (red, blue, yellow, green, purple) |
| Shape Hunt | Playable | Circle, square, triangle, star |
| Peekaboo Doors | Playable | Animal words; cause-and-effect tapping |
| Match the Pairs | Playable | Matching animals and a star |
| Letter Hunt | Playable | Letter names A, B, C, D, F, O, R, S |

Count the Things: tap each object once. The tally grows, then the round shows the numeral and the English word (`three`, `four`, …).

Balloon Pop: pop every balloon of the colour in the prompt. Other colours wobble and stay. The round then shows the colour word.

Shape Hunt: tap the named shape. Other shapes wobble and stay.

Peekaboo Doors: tap a house door to open it. An animal and its English word are behind it.

Each game speaks the instruction in Australian English (Natasha). Tap the prompt tag to hear it again. The speaker button mutes voice, chimes and pops. First tap on a game page unlocks sound on iPad.

Right answers sparkle with a soft chime. Each finished round drops paper confetti and fills one of five stars along the bottom. There are no scores and no way to lose.

Match the Pairs: flip two cards. Matching pairs stay up. Mismatches flip back. When every pair is found, celebrate and tap Next for a new shuffle.

Letter Hunt: tap the named letter among four big blocks. The round then says the letter and a word (`A is for apple`).

## Look and feel

Paper cut-out storybook style: flat card-stock colours, hand-cut edges, and a small shadow where paper sits on paper. Each game is a full-screen scene (a sky, a meadow, a street of houses, a picnic blanket, a classroom wall).

- `js/art.js`: every character and piece, drawn once as inline SVG and shared by all games
- `js/fx.js`: sparkles, confetti, session stars and synthesised chimes
- `css/app.css`: the whole design system
- `assets/fonts/`: Fredoka, stored in the repo so there are no third-party requests

## Hosting

Copy or git-clone the repo onto the VPS and serve the folder as a site root. Example nginx:

```nginx
server {
    listen 80;
    server_name kids.example.com;
    root /var/www/tiny-tap-games;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

No build step, Node, or database.

## Public-repo rules

- No personal names, photos, or family details in the code or docs
- No analytics, cookies, or third-party scripts
- No accounts or chat
- Artwork is original SVG in this repo
- Fonts are stored in the repo (Fredoka, SIL Open Font License, see `assets/fonts/OFL.txt`)

## License

MIT. See `LICENSE`. The Fredoka font is under the SIL Open Font License 1.1 (`assets/fonts/OFL.txt`).
