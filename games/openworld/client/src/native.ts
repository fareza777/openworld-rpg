// The Android app's side of the page (docs/sunshard/ANDROID.md): in the Capacitor shell, the system's back button is Esc
// (it closes what is open, else opens the menu), and the app going to the background saves the game at once. In a
// browser none of it runs.

import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

const esc = (type: 'keydown' | 'keyup') => window.dispatchEvent(new KeyboardEvent(type, { code: 'Escape', key: 'Escape', bubbles: true, cancelable: true }))

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('native')
  void App.addListener('backButton', () => (esc('keydown'), esc('keyup')))
  void App.addListener('pause', () => window.dispatchEvent(new Event('lsw:save')))
}
