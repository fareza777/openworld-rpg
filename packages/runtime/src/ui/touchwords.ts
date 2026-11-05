// On a touch screen the game's words name the touch controls (ui/touch.ts), not keys and a mouse: a text's
// `{key:hands}` is "Interact", `{key:craft}` "☰ Craft", and "left click" / "right click" are "tap" / "long-press" (a tap
// on the world is the left click there; a long press, the right). keymap.ts's fillKeys is the desktop's.

import { ACTIONS, defaultKeys, type Action } from '../keymap.ts'

/** Each action by what the touch screen has for it (none: the action is said by its key, as on a desktop). */
const NAMES: Partial<Record<Action | 'move' | 'slots' | 'casts', string>> = {
  hands: 'Interact',
  put: 'Put',
  attack: 'Attack',
  draw: 'Attack',
  dash: 'Dash',
  bag: '☰ Bag',
  craft: '☰ Craft',
  build: '☰ Build',
  skills: '☰ Skill tree',
  skillPanel: '☰ Skills',
  quests: '☰ Quests',
  journal: '☰ Codex',
  map: 'the minimap',
  companion: "Kiri's badge",
  rotate: 'Rotate',
  move: 'the stick',
  slots: 'the toolbar',
  row: 'the toolbar',
  casts: 'the skill bar',
}

/** A screen that is touched has the touch layer's class on the page (touch.ts). */
export const onTouch = () => typeof document !== 'undefined' && document.body?.classList.contains('touch')

/** Clicks said as touches: "left click" → "tap", "right-clicks" → "long-presses", LMB / RMB likewise. */
function touches(text: string): string {
  const cap = (word: string, like: string) => (like[0] === like[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word)
  return text
    .replace(/\b([Ll])eft[- ]click(s|ed|ing)?\b/g, (all, l: string, end = '') => cap({ '': 'tap', s: 'taps', ed: 'tapped', ing: 'tapping' }[end as string]!, l))
    .replace(/\b([Rr])ight[- ]click(s|ed|ing)?\b/g, (all, r: string, end = '') => cap({ '': 'long-press', s: 'long-presses', ed: 'long-pressed', ing: 'long-pressing' }[end as string]!, r))
    .replace(/\bLMB\b/g, 'tap')
    .replace(/\bRMB\b/g, 'long-press')
    .replace(/\b([Cc])lick(s|ed|ing)?\b/g, (all, c: string, end = '') => cap({ '': 'tap', s: 'taps', ed: 'tapped', ing: 'tapping' }[end as string]!, c))
}

const CLICKS = /click|\bLMB\b|\bRMB\b/i

/**
 * The page's own words kept in a touch screen's terms: a panel that writes its help straight into the page (not through
 * the texts' functions) has its clicks said as taps as it is drawn. Only a changed text that speaks of a click is
 * looked at; once said as a tap it no longer does, so the rewording does not run again.
 */
export function rewordPage(root: Node = document.body): void {
  const fix = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      if (n.nodeValue && CLICKS.test(n.nodeValue)) n.nodeValue = touches(n.nodeValue)
      return
    }
    if (n.nodeType !== Node.ELEMENT_NODE || !CLICKS.test(n.textContent ?? '')) return
    const walk = document.createTreeWalker(n, NodeFilter.SHOW_TEXT)
    for (let t = walk.nextNode(); t; t = walk.nextNode()) fix(t)
  }
  fix(root)
  new MutationObserver((changes) => {
    for (const c of changes) {
      if (c.type === 'characterData') fix(c.target)
      else c.addedNodes.forEach(fix)
    }
  }).observe(root, { subtree: true, childList: true, characterData: true })
}

/** A text's `{key:…}` and its clicks in a touch screen's words (an action it has no word for: left to fillKeys). */
export function touchWords(text: string): string {
  return touches(text.replace(/\{key:([a-zA-Z0-9]+)\}/g, (all, name: string) => NAMES[name as keyof typeof NAMES] ?? all))
}

/**
 * A lesson's key badge (written as the default keys are: "E", "hold E", "LMB", "WASD", "1–0") as the touch screen has
 * it: the action that key does by default, by its touch name.
 */
export function touchLessonKey(key: string): string | undefined {
  if (key === 'LMB') return 'Tap'
  if (key === 'RMB') return 'Long-press'
  if (key === 'WASD') return 'Stick'
  if (key === '1–0') return 'Toolbar'
  const hold = /^hold (.+)$/.exec(key)
  if (hold) {
    const word = touchLessonKey(hold[1])
    return word && `Hold ${word}`
  }
  const d = defaultKeys()
  const code = key.length === 1 ? (/[0-9]/.test(key) ? `Digit${key}` : `Key${key}`) : key
  const a = ACTIONS.find((x) => d[x].some((b) => !b.shift && b.code === code))
  return a && NAMES[a]
}
