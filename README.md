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
| Count the Things | Playable | Numbers 1–10 and English number words |
| Balloon Pop | Playable | Colours (red, blue, yellow, green, purple) |
| Shape Hunt | Playable | Circle, square, triangle, star, heart, oval, rectangle, diamond |
| Peekaboo Doors | Playable | Animal words; cause-and-effect tapping |
| Match the Pairs | Playable | Matching animals and a star |
| Letter Hunt | Playable | All 26 letter names, each with a word |

Count the Things: tap each object once. The tally grows, then the round shows the numeral and the English word (`three`, `four`, …).

Balloon Pop: pop every balloon of the colour in the prompt. Other colours wobble and stay. The round then shows the colour word.

Shape Hunt: tap the named shape. Other shapes wobble and stay.

Peekaboo Doors: tap a house door to open it. An animal and its English word are behind it.

Each game speaks the instruction in Australian English (Natasha). Tap the prompt tag to hear it again. The speaker button mutes voice, chimes and pops. First tap on a game page unlocks sound on iPad.

Right answers sparkle with a soft chime. Each finished round drops paper confetti and fills one of five stars along the bottom. There are no scores and no way to lose.

Match the Pairs: flip two cards. Matching pairs stay up. Mismatches flip back. When every pair is found, celebrate and tap Next for a new shuffle.

Letter Hunt: tap the named letter among the big blocks. The round then says the letter and a word (`A is for apple`).

## Levels

Every game starts easy. Each time the row of five stars fills, the game moves up a level for the rest of that visit, and the stars change colour (gold, then orange, then purple). A fresh visit starts at level 1 again, so a younger sibling never lands on the hard version.

| Game | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| Count | 1–5 things | 3–7 | 5–10 |
| Balloons | 5 balloons, pop 1–2 | 6, pop 2–3 | 7, pop 2–3 |
| Shapes | 4 basic shapes | adds heart and oval, 5 on the board | adds rectangle and diamond, 6 on the board |
| Peekaboo | 3 houses | 4 | 5 (4 on narrow phones) |
| Pairs | 4 pairs | 5 | 6 |
| Letters | 8 letters, 4 tiles | 16 letters | all 26, 6 tiles |

## Helping little players

- **Stuck?** After about 7 seconds with no tap, the game says the prompt again and the right answer wiggles. It tries three times, then goes quiet until the next tap.
- **Stray taps:** in a game, the home button needs a press-and-hold (a ring fills up). A quick tap just wiggles it.
- **Locking the iPad to one game:** turn on Guided Access (Settings → Accessibility → Guided Access), open a game, then triple-click the side or home button to start it.

## Offline and home screen

After the first visit, a service worker (`sw.js`) keeps a copy of the whole site, so the games work with no connection. Add it to the home screen (Share → Add to Home Screen on iPad) for a full-screen app with its own icon.

The service worker only runs over HTTPS (or on `localhost`). After adding, removing or changing site files, run:

```bash
python3 scripts/update-sw.py
```

It rewrites the file list and cache version in `sw.js`, so devices pick up the new copy.

New voice clips: add lines to `scripts/voice.py` and run it. It only renders clips that are missing (`--force` redoes them all).

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
