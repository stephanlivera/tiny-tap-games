#!/usr/bin/env python3
"""Write the offline file list and cache version into sw.js.

Run after adding, removing or changing any site file. The version is a hash of
every cached file, so a deploy with changes makes devices fetch a fresh copy.
"""

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SW = ROOT / "sw.js"
INCLUDE = ["css", "js", "assets", "games"]
SKIP_NAMES = {".DS_Store", "Thumbs.db"}


def site_files() -> list[str]:
    files = ["manifest.json"]
    for folder in INCLUDE:
        for path in sorted((ROOT / folder).rglob("*")):
            if path.is_file() and path.name not in SKIP_NAMES:
                files.append(path.relative_to(ROOT).as_posix())
    return files


def main() -> None:
    files = site_files()
    digest = hashlib.sha256()
    for name in files + ["index.html"]:
        digest.update(name.encode())
        digest.update((ROOT / name).read_bytes())

    # Pages are cached under the folder URLs they are linked by ("./", "games/count/").
    urls = ["./"] + [
        name[: -len("index.html")] if name.endswith("/index.html") else name for name in files
    ]
    listing = "\n".join(f"  {json.dumps(url)}," for url in urls)

    source = SW.read_text()
    source = re.sub(r'const VERSION = "[^"]*";', f'const VERSION = "tiny-tap-{digest.hexdigest()[:12]}";', source)
    source = re.sub(r"const FILES = \[\n.*?\n\];", f"const FILES = [\n{listing}\n];", source, flags=re.S)
    SW.write_text(source)
    print(f"sw.js: {len(urls)} files, version tiny-tap-{digest.hexdigest()[:12]}")


if __name__ == "__main__":
    main()
