# The Android build

The game is a static web build (Phaser 4 + the engine in a Web Worker) wrapped by **Capacitor 8** in `mobile/`. It runs
fully offline: no server, no model (`VITE_NO_AI=1` leaves the online-model plugin out; every interaction falls back to
the rules already in the game).

## Build a debug APK

Requirements: Node 24+, JDK 21, the Android SDK (platform 36, build-tools 35+) with `sdk.dir` in
`mobile/android/local.properties`.

```bash
npm install                      # the monorepo, once
npm install --prefix mobile      # Capacitor, once
node mobile/build-web.mjs        # gen:world, then the client built offline into games/openworld/client/dist
cd mobile && npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK is `mobile/android/app/build/outputs/apk/debug/app-debug.apk`. Install with
`adb install -r app-debug.apk`.

## What the shell does

| | Where |
|---|---|
| Portrait locked; status bar hidden, Android navigation visible; screen kept on | `MainActivity.java`, `AndroidManifest.xml` |
| The back button is Esc (closes what is open, else the menu) | `games/openworld/client/src/native.ts` |
| The app paused saves at once (besides the game's own autosave every minute, on each new map and quest step) | `native.ts` → `lsw:save` in `packages/runtime/src/main.ts` |
| Icon and splash from the game's pixel art | `mobile/tools/icons.py` |
| WebView debugging on (debug builds): `chrome://inspect` on a desktop | `capacitor.config.json` |

## Touch controls (`packages/runtime/src/ui/touch.ts`)

Shown on any touch screen (or with `?touch=1` in a desktop browser for testing; `?touch=0` hides them).

| Control | Does |
|---|---|
| Floating stick | nothing on screen until a thumb goes down on the left half of the world; it appears under the thumb and is gone when the thumb lifts. The world walks four ways, so the stick holds one way (the axis leaned along most, kept until the thumb is clearly past ~54°, so a thumb near the diagonal does not flip it); it starts at 30% lean and stops under 20%; pushed to the edge (92%) it runs. A thumb past its reach draws the stick after it, so turning back is a short move |
| Cluster, bottom right (above the toolbar) | only what would do something now (touch.ts `context`) |
| Attack (a sword) | a blow ahead; held, blows go on (Space) — always |
| Interact (a hand) | take, talk, open, read (E) — always |
| Dash (a winged boot) | dash (Q) — once the skill tree's Dash is learned |
| Use (the held thing's icon) | its own use: swing a tool, eat, drink, put on (left click) — while it has one |
| Use on (the held thing, ➚) | used on what is ahead: sow, cook, feed (right click) — while it has one |
| Put (an arrow) | put down, put into, give (G) — while there is one |
| Tap the world (right half) | the left click there (aim + act); a long press is the right click there |
| ☰ (top) | opens the tray of panels, each named under its icon: Quests, Build, Bag, Skill tree, Codex, Craft, Skills, Settings |
| The HUD | toolbar slots, minimap (the world map), Kiri's badge — all tappable; no key labels anywhere, and the texts say "tap", "long-press", "Interact", "☰ Craft" in place of clicks and keys (ui/touchwords.ts) |
| Quest tracker | folded to the quest's title; a tap opens its objectives; a change opens it for six seconds |
| Dialogue | a compact box at the foot; tap to go on; a choice shows its answers as buttons; the controls step aside while a line is on screen |
| Building | a sheet of tiles at the foot; once a thing is chosen it folds to a bar (its name, whether it can go there, turn, list, done): walk with the stick, tap where it goes |
| Loading | the splash (ui/splash.ts): Kiri's medallion, the title, a bar filled as far as the art has come, lines in turn |

## Performance notes

- The engine runs in a worker at 10 ticks/s; rendering is Phaser's WebGL at the display's rate.
- Options → the world filter and particle strength can be lowered on weak phones.
- Maps far behind are put away (`Game.keepMaps`), so memory stays flat as the player travels.
