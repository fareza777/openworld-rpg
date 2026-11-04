# Asset and license audit (fork of SihanXU/openworld @ f550c2f, 2026-11-04)

## Verdict

The fork may be modified, rebranded, shipped as an Android app and sold: the code is MIT and every art/audio set is
CC0 or OFL. Two items need a decision before a Play Store release (§4).

## 1. Licenses

| Part | Where | License | Obligations |
|---|---|---|---|
| Engine, editor, game code | `packages/`, `games/` | MIT (`LICENSE`, © 2026 The OpenWorld authors) | keep the MIT notice in the source and in the app's credits |
| The project's own art and audio | `games/openworld/public/assets/lsw/` | CC0 1.0 (`assets/lsw/LICENSE.md`) | none (credit is courteous) |
| Ninja Adventure pack (subset) | `games/openworld/public/assets/na/` | CC0 (Pixel-boy & AAA) | none (credit is courteous) |
| Fusion Pixel font | `packages/runtime/src/fonts/` | SIL OFL 1.1 (`OFL.txt`, `LICENSES/`) | ship the license; do not sell the font alone; no reserved name on a modified font |
| Pixelify Sans (`@fontsource/pixelify-sans`) | npm | SIL OFL 1.1 | same as above |
| Phaser 4 | npm | MIT | keep the notice |
| Capacitor 8.6 (`@capacitor/*`) | `mobile/` | MIT | keep the notice |

Upstream's story, characters and lore are part of the MIT-licensed code and docs, so reusing them would be legal —
this fork replaces them anyway (`STORY.md`), by the owner's choice.

## 2. Inventory (what the fork keeps and uses)

| Set | Files | Size | Used for |
|---|---|---|---|
| `na/Actor` | 216 | 1.2 MB | characters, monsters, animals (sprite sheets) |
| `na/Audio` | 68 | 63 MB | music, jingles, sound effects |
| `na/Backgrounds` (tilesets) | 16 | 0.3 MB | ground, water, cliffs, interiors |
| `na/FX`, `na/Items`, `na/Ui` | 140 | 0.3 MB | effects, item icons, frames |
| `lsw/Bosses` | 137 | 45 MB | 13 bosses (Gavrel/`alberic`, the drake, four Wardens, the False Sun, the seven sins), animated |
| `lsw/Buildings` | 459 | 3.4 MB | the oblique-rendered buildings (towns, the capital) |
| `lsw/Looks` | 469 | 12 MB | the character creator's bodies, parts and portraits |
| `lsw/Portraits`, `lsw/Faces` | 190 | 6 MB | the cast's dialogue portraits with moods |
| `lsw/skills` | 365 | 1.4 MB | skill icons for the skill tree and advancements |
| `lsw/Crops`, `lsw/Items`, `lsw/Fixtures` | 339 | 5.6 MB | farming, gear, furniture |
| `lsw/CG` | 2 | 0.5 MB | ending illustrations |
| `lsw/Audio/Musics` | 2 | 3.9 MB | the village theme and the drake's battle theme |
| `public/world/` | generated | 22 MB | the world's maps, by `npm run gen:world` (procedural backdrop + hand-made maps) |

Nothing upstream ships is dropped: Chapter 1 uses the valley, Ford, Old Crown Road and Thornhold maps and the
`alberic` boss; Chapters 2–10 (`STORY.md` §6) are assigned the remaining regions, the Solmere maps and every other boss
sheet, including the seven sins that upstream left unused.

New assets added by the fork: the Android launcher icon and splash (`mobile/tools/icons.py`, drawn from
`na/Items/Resource/GemYellow.png` and `lsw/Ui/Star.png`, so CC0 and in the same pixel style).

## 3. Assets whose pictures still show upstream's story

These are kept and re-read by the new story; they do not need replacing.

- `alberic` (a knight with a crown of thorns grown through his helm) → Ser Gavrel and the Briar Diadem.
- The `astra` boss sheet → Caedmon, the False Sun (Ch 10).
- `lsw/CG/ending_dawn.png`, `ending_holiest.png` → candidates for the *Released* and *Usurped* endings (Ch 10); check
  them against the new endings when that chapter is written.

## 4. Decisions needed before a Play Store release

1. **The two music tracks in `lsw/Audio/Musics/`** (`che-shui-ma-long.ogg`, `battle-thrill.ogg`): upstream's notes call
   them "user-selected" WAVs, not drawn or composed in the repo, though the folder's licence says CC0. Ask upstream for
   their source, or swap them for Ninja Adventure tracks (CC0, already in `na/Audio`) — a one-line change in
   `games/openworld/client/src/catalog.ts`.
2. **AI-generated art** (the `alberic` sheets were made with an image model, `docs/alberic-art.md`): upstream
   dedicates them CC0. Google Play accepts AI-made art; disclose it if the store listing asks.
3. **Size**: the web build is ~176 MB, so the APK is about the same. Google Play's base-module limit for an AAB is
   200 MB (larger needs Play Asset Delivery). Converting the 63 MB of WAV/OGG audio to lower bitrates, or moving the
   boss sheets to an asset pack, keeps a release under it.
