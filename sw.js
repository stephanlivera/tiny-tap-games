// Offline support: caches every file of the site on the first visit, so the
// games keep working without a connection (car trips, planes, flaky wifi).
// VERSION and FILES are written by scripts/update-sw.py. Run it after changing site files.

const VERSION = "tiny-tap-ed20ef4ed3e6";
const FILES = [
  "./",
  "manifest.json",
  "css/app.css",
  "js/art.js",
  "js/fx.js",
  "js/tablet.js",
  "js/voice.js",
  "assets/favicon.svg",
  "assets/fonts/OFL.txt",
  "assets/fonts/fredoka-latin.woff2",
  "assets/icons/icon-180.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon.svg",
  "assets/sfx/pop.mp3",
  "assets/voice/a-for-apple.mp3",
  "assets/voice/b-for-balloon.mp3",
  "assets/voice/blue.mp3",
  "assets/voice/c-for-cat.mp3",
  "assets/voice/cat.mp3",
  "assets/voice/circle.mp3",
  "assets/voice/d-for-duck.mp3",
  "assets/voice/diamond.mp3",
  "assets/voice/dog.mp3",
  "assets/voice/e-for-egg.mp3",
  "assets/voice/eight.mp3",
  "assets/voice/f-for-fish.mp3",
  "assets/voice/find-the-pairs.mp3",
  "assets/voice/five.mp3",
  "assets/voice/four.mp3",
  "assets/voice/frog.mp3",
  "assets/voice/g-for-goat.mp3",
  "assets/voice/green.mp3",
  "assets/voice/h-for-hat.mp3",
  "assets/voice/heart.mp3",
  "assets/voice/i-for-igloo.mp3",
  "assets/voice/j-for-jam.mp3",
  "assets/voice/k-for-kite.mp3",
  "assets/voice/l-for-lion.mp3",
  "assets/voice/m-for-moon.mp3",
  "assets/voice/mouse.mp3",
  "assets/voice/n-for-nest.mp3",
  "assets/voice/nine.mp3",
  "assets/voice/o-for-owl.mp3",
  "assets/voice/one.mp3",
  "assets/voice/oval.mp3",
  "assets/voice/owl.mp3",
  "assets/voice/p-for-pig.mp3",
  "assets/voice/pop-the-blue-balloon.mp3",
  "assets/voice/pop-the-blue-balloons.mp3",
  "assets/voice/pop-the-green-balloon.mp3",
  "assets/voice/pop-the-green-balloons.mp3",
  "assets/voice/pop-the-purple-balloon.mp3",
  "assets/voice/pop-the-purple-balloons.mp3",
  "assets/voice/pop-the-red-balloon.mp3",
  "assets/voice/pop-the-red-balloons.mp3",
  "assets/voice/pop-the-yellow-balloon.mp3",
  "assets/voice/pop-the-yellow-balloons.mp3",
  "assets/voice/purple.mp3",
  "assets/voice/q-for-queen.mp3",
  "assets/voice/r-for-rabbit.mp3",
  "assets/voice/rabbit.mp3",
  "assets/voice/rectangle.mp3",
  "assets/voice/red.mp3",
  "assets/voice/s-for-star.mp3",
  "assets/voice/seven.mp3",
  "assets/voice/six.mp3",
  "assets/voice/square.mp3",
  "assets/voice/star.mp3",
  "assets/voice/t-for-tree.mp3",
  "assets/voice/tap-a-door.mp3",
  "assets/voice/tap-a.mp3",
  "assets/voice/tap-b.mp3",
  "assets/voice/tap-c.mp3",
  "assets/voice/tap-d.mp3",
  "assets/voice/tap-e.mp3",
  "assets/voice/tap-f.mp3",
  "assets/voice/tap-g.mp3",
  "assets/voice/tap-h.mp3",
  "assets/voice/tap-i.mp3",
  "assets/voice/tap-j.mp3",
  "assets/voice/tap-k.mp3",
  "assets/voice/tap-l.mp3",
  "assets/voice/tap-m.mp3",
  "assets/voice/tap-n.mp3",
  "assets/voice/tap-o.mp3",
  "assets/voice/tap-p.mp3",
  "assets/voice/tap-q.mp3",
  "assets/voice/tap-r.mp3",
  "assets/voice/tap-s.mp3",
  "assets/voice/tap-t.mp3",
  "assets/voice/tap-the-apple.mp3",
  "assets/voice/tap-the-apples.mp3",
  "assets/voice/tap-the-balloon.mp3",
  "assets/voice/tap-the-balloons.mp3",
  "assets/voice/tap-the-circle.mp3",
  "assets/voice/tap-the-diamond.mp3",
  "assets/voice/tap-the-duck.mp3",
  "assets/voice/tap-the-ducks.mp3",
  "assets/voice/tap-the-fish.mp3",
  "assets/voice/tap-the-heart.mp3",
  "assets/voice/tap-the-oval.mp3",
  "assets/voice/tap-the-rectangle.mp3",
  "assets/voice/tap-the-square.mp3",
  "assets/voice/tap-the-star.mp3",
  "assets/voice/tap-the-stars.mp3",
  "assets/voice/tap-the-triangle.mp3",
  "assets/voice/tap-u.mp3",
  "assets/voice/tap-v.mp3",
  "assets/voice/tap-w.mp3",
  "assets/voice/tap-x.mp3",
  "assets/voice/tap-y.mp3",
  "assets/voice/tap-z.mp3",
  "assets/voice/ten.mp3",
  "assets/voice/three.mp3",
  "assets/voice/triangle.mp3",
  "assets/voice/two.mp3",
  "assets/voice/u-for-umbrella.mp3",
  "assets/voice/v-for-van.mp3",
  "assets/voice/w-for-whale.mp3",
  "assets/voice/well-done.mp3",
  "assets/voice/x-for-xray.mp3",
  "assets/voice/y-for-yoyo.mp3",
  "assets/voice/yellow.mp3",
  "assets/voice/z-for-zebra.mp3",
  "games/balloon/game.js",
  "games/balloon/",
  "games/count/game.js",
  "games/count/",
  "games/letters/game.js",
  "games/letters/",
  "games/match/game.js",
  "games/match/",
  "games/peekaboo/game.js",
  "games/peekaboo/",
  "games/shapes/game.js",
  "games/shapes/",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(VERSION)
      .then(function (cache) {
        return cache.addAll(FILES);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== VERSION;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// Safari asks for audio in byte ranges and will not play a whole-file reply,
// so cut the cached file down to the range it asked for.
function rangeReply(request, response) {
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") || "");
  if (!match) {
    return response;
  }
  return response.arrayBuffer().then(function (buffer) {
    const size = buffer.byteLength;
    let start = match[1] ? parseInt(match[1], 10) : 0;
    let end = match[2] ? parseInt(match[2], 10) : size - 1;
    if (!match[1] && match[2]) {
      start = Math.max(size - parseInt(match[2], 10), 0);
      end = size - 1;
    }
    end = Math.min(end, size - 1);
    return new Response(buffer.slice(start, end + 1), {
      status: 206,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Range": "bytes " + start + "-" + end + "/" + size,
        "Content-Length": String(end - start + 1),
        "Accept-Ranges": "bytes",
      },
    });
  });
}

// Answer from the cache straight away and refresh it in the background.
self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    caches.open(VERSION).then(function (cache) {
      return cache.match(request, { ignoreSearch: true }).then(function (cached) {
        const fresh = fetch(request)
          .then(function (response) {
            if (response.status === 200 && !request.headers.has("range")) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(function () {
            return cached;
          });
        if (cached) {
          event.waitUntil(fresh.catch(function () {}));
          return rangeReply(request, cached);
        }
        return fresh;
      });
    })
  );
});
