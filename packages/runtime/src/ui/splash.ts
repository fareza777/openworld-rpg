// The loading screen (ui/splash.css): the game's icon glowing over its title and tagline, a bar, and a few lines in
// turn (the game's `cover.tips`). The page draws the same before its code has come (the game's index.html); the title
// draws it again while the world behind it, or a saved game, is made ready.

import { esc } from './common.ts'

/** How many lines take their turn (the CSS times four: each 4s of a 16s round). */
const TURNS = 4

export interface Splash {
  title: string
  tagline?: string
  tips?: string[]
}

/** The page's own icon (its apple-touch-icon), the one the phone shows for the game. */
const icon = () => document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')?.href

export function splashHtml(s: Splash): string {
  const tips = s.tips?.length ? Array.from({ length: TURNS }, (_, i) => s.tips![i % s.tips!.length]) : []
  const img = icon()
  return `<div class="splash">
    <div class="sp-glow"></div>
    ${img ? `<img class="sp-icon" src="${esc(img)}" alt="">` : ''}
    <div class="sp-title">${esc(s.title)}</div>
    ${s.tagline ? `<div class="sp-tagline">${esc(s.tagline)}</div>` : ''}
    <div class="sp-bar"><i></i></div>
    ${tips.length ? `<div class="sp-tips">${tips.map((t, i) => `<span style="--i:${i}">${esc(t)}</span>`).join('')}</div>` : ''}
  </div>`
}
