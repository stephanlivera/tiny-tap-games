#!/usr/bin/env python3
"""Regenerate Australian instruction clips with edge-tts (Natasha)."""

import asyncio
from pathlib import Path

import edge_tts

OUT = Path(__file__).resolve().parents[1] / "assets" / "voice"
VOICE = "en-AU-NatashaNeural"
RATE = "-12%"

LINES = {
    "tap-the-apple": "Tap the apple.",
    "tap-the-apples": "Tap the apples.",
    "tap-the-duck": "Tap the duck.",
    "tap-the-ducks": "Tap the ducks.",
    "tap-the-star": "Tap the star.",
    "tap-the-stars": "Tap the stars.",
    "tap-the-balloon": "Tap the balloon.",
    "tap-the-balloons": "Tap the balloons.",
    "tap-the-fish": "Tap the fish.",
    "pop-the-red-balloon": "Pop the red balloon.",
    "pop-the-red-balloons": "Pop the red balloons.",
    "pop-the-blue-balloon": "Pop the blue balloon.",
    "pop-the-blue-balloons": "Pop the blue balloons.",
    "pop-the-yellow-balloon": "Pop the yellow balloon.",
    "pop-the-yellow-balloons": "Pop the yellow balloons.",
    "pop-the-green-balloon": "Pop the green balloon.",
    "pop-the-green-balloons": "Pop the green balloons.",
    "pop-the-purple-balloon": "Pop the purple balloon.",
    "pop-the-purple-balloons": "Pop the purple balloons.",
    "tap-the-circle": "Tap the circle.",
    "tap-the-square": "Tap the square.",
    "tap-the-triangle": "Tap the triangle.",
    "tap-a-door": "Tap a door.",
    "find-the-pairs": "Find two that are the same.",
    "well-done": "Well done!",
    "one": "One.",
    "two": "Two.",
    "three": "Three.",
    "four": "Four.",
    "five": "Five.",
    "red": "Red.",
    "blue": "Blue.",
    "yellow": "Yellow.",
    "green": "Green.",
    "purple": "Purple.",
    "circle": "Circle.",
    "square": "Square.",
    "triangle": "Triangle.",
    "star": "Star.",
    "cat": "Cat.",
    "dog": "Dog.",
    "owl": "Owl.",
    "rabbit": "Rabbit.",
    "mouse": "Mouse.",
    "frog": "Frog.",
    "tap-a": "Tap A.",
    "tap-b": "Tap B.",
    "tap-c": "Tap C.",
    "tap-d": "Tap D.",
    "tap-f": "Tap F.",
    "tap-o": "Tap O.",
    "tap-r": "Tap R.",
    "tap-s": "Tap S.",
    "a-for-apple": "A is for apple.",
    "b-for-balloon": "B is for balloon.",
    "c-for-cat": "C is for cat.",
    "d-for-duck": "D is for duck.",
    "f-for-fish": "F is for fish.",
    "o-for-owl": "O is for owl.",
    "r-for-rabbit": "R is for rabbit.",
    "s-for-star": "S is for star.",
}


async def render(name: str, text: str, sem: asyncio.Semaphore) -> None:
    path = OUT / f"{name}.mp3"
    async with sem:
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(path))
        print(path.name, path.stat().st_size)


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*(render(name, text, sem) for name, text in LINES.items()))


if __name__ == "__main__":
    asyncio.run(main())
