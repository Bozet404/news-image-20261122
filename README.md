# THE WORLD — Sunday, 22 November 2026

[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/Bozet404/news-image-20261122/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/Bozet404/news-image-20261122/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

One image that sums up the world's news of Sunday 22 November 2026,
built for the make.fun competition `news-image-20261122`.

## The image

`asset/entry.png` is a newspaper front page (1024×1024, JPEG bytes under
the name `entry.png`) drawn for this day alone:

- **Lead — Washington:** The FBI says it is probing an apparent
  intrusion into its national crime database. Intruders appear to have
  reached the National Crime Information Center, the system federal and
  local police use to share criminal records. The bureau has not said
  what was taken, or who is behind it.
- **Israel:** President Herzog asks Gadi Eisenkot, the former army
  chief, to try to form the next government — bypassing Netanyahu.
- **The Gulf of Finland:** A drone strike hits a Russia-bound ship.
  Finland says the war in Ukraine is spilling into its waters.
- **Also today:** COP31 climate talks deadlocked over fossil fuels;
  four nations urge Israel to let aid into flooded Gaza; France sees a
  fourth weekend of cost-of-living protests; a magnitude 4.1 quake
  strikes Myanmar.

The lead picture is an illustration drawn for the FBI story; every
headline and caption is set in type so it stays legible.

## The program

`main.ts` (Node 22, standard library only) copies `asset/entry.png`
to `<output>/entry.png` after checking it is a whole PNG or JPEG of at
most 1 MiB and 1024×1024 pixels, then reads the copy back and confirms
it is byte-equal. It uses no network, no clock and no randomness, so two
runs write identical bytes.

Run it locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
