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
| Portrait by default, turning to landscape as the phone is held (the phone's rotation lock is kept); full screen (system bars hidden, a swipe shows them); screen kept on | `MainActivity.java`, `AndroidManifest.xml` |
| The back button is Esc (closes what is open, else the menu) | `games/openworld/client/src/native.ts` |
| The app paused saves at once (besides the game's own autosave every minute, on each new map and quest step) | `native.ts` → `lsw:save` in `packages/runtime/src/main.ts` |
| Icon and splash from the game's pixel art | `mobile/tools/icons.py` |
| WebView debugging on (debug builds): `chrome://inspect` on a desktop | `capacitor.config.json` |

## Touch controls (`packages/runtime/src/ui/touch.ts`)

Shown on any touch screen (or with `?touch=1` in a desktop browser for testing; `?touch=0` hides them).

| Control | Does |
|---|---|
| Floating stick | nothing on screen until a thumb goes down on the left half of the world; it appears under the thumb, walks eight ways (it holds the player's own movement keys) and is gone when the thumb lifts |
| Cluster, bottom right (above the toolbar) | |
| ⚔ Attack | a blow ahead; held, blows go on (Space) |
| ✋ Interact | take, talk, open, read (E) |
| ◆ Use | the held thing's own use: swing a tool, eat, drink, put on (left click) |
| ➚ Use on | the held thing used on what is ahead: sow, cook, feed (right click) |
| » Dash | dash (Q) |
| ⇩ Put / ⚐ | put down, put into, give (G) / draw or sheathe the weapon (X) |
| Tap the world (right half) | the left click there (aim + act); a long press is the right click there |
| ☰ (top) | opens the tray of panels: quests, build, bag, skills, journal, crafting, skill bar, menu |
| The HUD | toolbar slots, minimap (the world map), Kiri's badge — all tappable; key labels are hidden on touch screens |
| Dialogue | tap to go on; a choice shows its answers as buttons; the controls step aside while a line is on screen |

## Performance notes

- The engine runs in a worker at 10 ticks/s; rendering is Phaser's WebGL at the display's rate.
- Options → the world filter and particle strength can be lowered on weak phones.
- Maps far behind are put away (`Game.keepMaps`), so memory stays flat as the player travels.
