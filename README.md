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
| Match the Pairs | Playable | Matching animals and shapes |

Count the Things: tap each object once. The tally grows, then the round shows the numeral and the English word (`three`, `four`, …).

Balloon Pop: pop every balloon of the colour in the prompt. Other colours wobble and stay. The round then shows the colour word.

Shape Hunt: tap the named shape. Other shapes wobble and stay.

Peekaboo Doors: tap any door to open it. An animal and its English word are behind it.

Each game speaks the instruction in Australian English (Natasha). Tap the prompt to hear it again. The speaker button mutes. First tap on a game page unlocks sound on iPad.

Match the Pairs: flip two cards. Matching pairs stay up. Mismatches flip back. When every pair is found, celebrate and tap Next for a new shuffle.

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

## License

MIT. See `LICENSE`.
