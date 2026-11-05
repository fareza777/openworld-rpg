# Sunshard presentation and Android monetization

The app launches in portrait. The system navigation bar stays visible; banner space is reserved by shrinking the WebView 50 dp, so neither game controls nor Android navigation are covered. Banners appear during gameplay and hide on the title and prologue. The prologue uses generated concept art, slow camera moves, English male Piper Joe narration (CC0 source dataset), timed subtitles, Skip, silent playback and reduced motion support. Watch prologue on the title replays it.

Debug APKs use Google's demo banner/interstitial/rewarded units and do not collect production consent. Release builds request UMP consent before ads. Interstitials appear only when returning to the title after at least three minutes; never during active combat. Rewarded videos are opt-in in Store & extras and unlock a persistent concept-art gallery only after the SDK reports the earned reward. Remove Ads owners get the gallery without a video.

## Production configuration

In Play Console create a non-consumable one-time product `remove_ads`, base US price **4.99 USD**. Activate it and publish an internal testing build with licensed testers. Purchases cannot be exercised by sideloading the debug APK. The UI displays the localized price supplied by Google Play. Completed purchases grant ownership, pending/cancelled purchases do not; ownership is refreshed on resume and via Restore purchases. Purchases are acknowledged and never consumed. Remove Ads disables banners and automatic interstitials, leaving voluntary rewarded videos available. For fraud-resistant production entitlement, add server-side Play purchase-token verification and refund/revocation notifications; current verification trusts BillingClient on the device.

Pass your own IDs to Gradle for release:

```
-PadmobAppId=YOUR_APP_ID
-PadmobBanner=YOUR_BANNER_UNIT
-PadmobInterstitial=YOUR_INTERSTITIAL_UNIT
-PadmobRewarded=YOUR_REWARDED_UNIT
```

Release ad units default to empty and therefore do not request demo ads. Configure the UMP privacy message for the production AdMob app. Privacy choices are accessible in Store & extras. The app ID defaults to Google's demo ID for the testing APK.

## Rebuild and check

Run `python mobile/tools/prologue.py` only when regenerating narration (requires piper-tts; model cache ignored). Artwork and WAV are committed, so ordinary builds need no generation service. `node mobile/build-web.mjs`, `npx cap sync android` from mobile, then `gradlew.bat assembleDebug` from mobile/android.

Browser presentation smoke test: start the client Vite server at 127.0.0.1:5173, then run `node mobile/tools/test-cinematic.mjs`. Covers portrait, audio gesture, subtitles and Skip. Native ad fill, reward completion, billing purchase/restore and gesture/three-button navigation need device testing; debug ads have a Test Ad label.
