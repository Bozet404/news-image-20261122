// news-image-20261122 — Sunday's front page, delivered.
//
// This repository holds one finished picture of the world's news for
// Sunday 22 November 2026: asset/entry.png, a newspaper front page
// drawn for this day alone. The program below is the whole entry: it
// moves that picture to <output>/entry.png after checking the file is
// a whole PNG or JPEG inside the competition's limits. It talks to no
// network, looks at no clock and rolls no dice, so running it twice
// writes the same bytes twice.
//
// Try it with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 1024 * 1024; // 1 MiB, the competition's size cap
const MAX_SIDE = 1024; // 1024 pixels, the competition's side cap

const here = new URL(".", import.meta.url).pathname;
const source = join(here, "asset", "entry.png");

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
// The grader sets MAKEFUN_OUTPUT_DIR; on a local run it falls back to
// /output, the same directory the competition's rules name.
const target = join(outputDir, "entry.png");

function fail(why: string): never {
  throw new Error(why);
}

// A PNG announces its size in the IHDR chunk, which always follows the
// 8-byte signature at a fixed offset.
function pngSize(bytes: Buffer): [number, number] {
  if (bytes.length < 33) {
    fail("asset/entry.png is too short to be a PNG");
  }
  if (bytes.subarray(12, 16).toString("ascii") !== "IHDR") {
    fail("asset/entry.png has no IHDR chunk where a PNG keeps one");
  }
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

// A JPEG hides its size in the first frame header (SOF0, SOF1 or SOF2).
// Step through the marker segments, each stamped with its own length,
// until that header turns up.
function jpegSize(bytes: Buffer): [number, number] {
  let at = 2; // just past the SOI marker (FF D8)
  while (at + 9 < bytes.length) {
    if (bytes[at] !== 0xff) {
      fail("asset/entry.png has a broken JPEG marker stream");
    }
    const marker = bytes[at + 1];
    // Markers on their own carry no length: step over them two bytes
    // at a time rather than reading a length that is not there.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      at += 2;
      continue;
    }
    const length = bytes.readUInt16BE(at + 2);
    if (length < 2 || at + length > bytes.length) {
      fail("asset/entry.png has a JPEG segment running past its end");
    }
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return [bytes.readUInt16BE(at + 7), bytes.readUInt16BE(at + 5)];
    }
    at += 2 + length;
  }
  fail("asset/entry.png has no JPEG frame header");
}

// The gate tells the two formats apart by their first bytes, while the
// file keeps the name entry.png either way. Accept both, and check the
// one we hold: a whole file, inside the size and side caps. Returns the
// size and the format found, so the run log can name them.
function inspect(bytes: Buffer): [number, number, string] {
  if (bytes.length === 0) {
    fail("asset/entry.png is empty");
  }
  if (bytes.length > MAX_BYTES) {
    fail(`asset/entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
  }
  const pngHead = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const jpegHead = Buffer.from([0xff, 0xd8, 0xff]);
  if (bytes.subarray(0, 8).equals(pngHead)) {
    const tail = bytes.subarray(bytes.length - 12);
    if (
      tail.readUInt32BE(0) !== 0 ||
      tail.subarray(4, 8).toString("ascii") !== "IEND"
    ) {
      fail("asset/entry.png is missing its IEND trailer");
    }
    return [...pngSize(bytes), "PNG"];
  }
  if (bytes.subarray(0, 3).equals(jpegHead)) {
    if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
      fail("asset/entry.png is missing its JPEG end marker");
    }
    return [...jpegSize(bytes), "JPEG"];
  }
  fail("asset/entry.png is neither a PNG nor a JPEG");
}

const image = readFileSync(source);
const [width, height, kind] = inspect(image);
if (width > MAX_SIDE || height > MAX_SIDE) {
  fail(`asset/entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

// The grader mounts the output directory, so make it only when it is
// missing and never remove anything already sitting there.
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}
copyFileSync(source, target);

// Read the copy back: the run counts only if the file on disk is the
// exact picture checked a moment ago.
const written = readFileSync(target);
if (!written.equals(image)) {
  fail("the copy at entry.png differs from asset/entry.png");
}
console.log(
  `wrote ${target} (${kind} ${width}x${height}, ${image.length} bytes)`,
);
