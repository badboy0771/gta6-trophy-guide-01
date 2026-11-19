# Leonida Trophy Guide & Tracker — Grand Theft Auto VI

[![GTA VI Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/badboy0771/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/badboy0771/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze — 28 hidden until earned, all single-player).

## What it is

- **Every trophy** with its official name, description and grade exactly as PlayStation publishes them (via Exophase / PSNProfiles), plus a guide written in our own words: what to do, where and how, and when it can be missed.
- **Cited sources beside every guide.** Each trophy's guide names the source its facts come from — the trophy trackers for the official list and counts, and the launch-week guides (Press-Start, OutputLag, EGamers, Of Zen and Computing) for methods and warnings. Nothing is copied from another guide.
- **A tracker:** tick trophies off and progress saves in the browser (localStorage), with a progress bar and grade counts. Export your progress to a JSON file and import it back any time.
- **Filters:** by kind (story, missable, collectibles, activities, online), by grade, by earned / not earned, and free-text search.
- **Spoiler-safe mode:** hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the platinum:** six stages in order — story, side strands, collectibles, activities, money, platinum — built from the official descriptions (chapters, missions, collectibles and counts).
- **One missable trophy, flagged clearly:** Positive Mental Attitude. Lucia's balcony meditation spot in Chapter 1 disappears after that chapter, and there is no mission replay — so the guide tells you to meditate there first and keep a manual save at the start of every chapter.

## How to use it offline

No build step, no network needed while it runs.

```sh
node serve.ts        # serves app/ at http://localhost:8080
# or: python3 -m http.server 8080 --directory app
```

Open `http://localhost:8080` in desktop Chrome (or open `app/index.html` through any static file server with `app/` at its root). Deep links work too: `?trophy=28` opens one trophy's guide, `?view=roadmap` opens the roadmap.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide itself.
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, kind, missable flag, roadmap stage, count, a guide in our own words, and its sources.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`.
- `screenshots/` — real renders of this app in Chromium.

## Sources

- Exophase and PSNProfiles — the official trophy list as published by PlayStation.
- [Press-Start — Full Trophy/Achievement List For Grand Theft Auto 6](https://press-start.com.au/news/2026/11/18/gta-6-trophy-list/)
- [OutputLag — GTA 6 Trophy List: All 55 Trophies and Achievements](https://outputlag.com/guides/gta-6-trophy-list/)
- [EGamers — GTA 6 Trophy List](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/)
- [Of Zen and Computing — GTA 6 Trophy List (November 2026)](https://www.ofzenandcomputing.com/gta-6-trophy-list-trophies-achievements/)

An unofficial fan guide, not affiliated with Rockstar Games. No Rockstar logo or artwork is used.
