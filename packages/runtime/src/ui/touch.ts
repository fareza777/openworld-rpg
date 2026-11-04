// Touch controls for phones and tablets (the Android build, docs/sunshard/ANDROID.md): a virtual stick on the left that
// holds the movement keys, and a cluster of buttons on the right for the acts the keyboard and the mouse do. The stick
// and the keyed buttons press the player's own bound keys (the page's key handler answers them as it answers a real
// key), so nothing the keyboard does is done a second way; the two mouse acts (the held thing's use, and its use on
// what is ahead) are the page's own, handed in. Shown only on a touch screen.

import { keys, type Action } from '../keymap.ts'

/** What the page hands the touch layer: the acts that are not keys. */
export interface TouchActs {
  /** The held thing's own use (the left click's), on the spot ahead: held, a swing goes on. */
  primary(on: boolean): void
  /** The held thing used on the spot ahead (the right click's). */
  secondary(): void
}

/** The stick's dead zone and how far along an axis it must lean to hold that way, as a share of its reach. */
const DEAD = 0.3
const LEAN = 0.38

/** A screen that is touched: a coarse pointer or touch points (a phone, a tablet; the Android build). */
export function isTouchScreen(): boolean {
  if (typeof window === 'undefined') return false
  const asked = new URLSearchParams(location.search).get('touch')
  if (asked === '1') return true
  if (asked === '0') return false
  return (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0
}

/** The key an action is bound to now (its first binding). */
function bindingOf(action: Action): { code: string; shift: boolean } | undefined {
  const b = keys.map[action]?.[0]
  return b && { code: b.code, shift: !!b.shift }
}

/** Press or release an action's key, as the keyboard would. */
function key(action: Action, down: boolean): void {
  const b = bindingOf(action)
  if (!b) return
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code: b.code, key: '', shiftKey: b.shift, bubbles: true, cancelable: true }))
}

/** Hold a pointer to the element it went down on (a finger sliding off the stick still steers); a pointer the browser
 *  no longer knows (cancelled at once) is simply not held. */
function capture(el: HTMLElement, id: number): void {
  try {
    el.setPointerCapture(id)
  } catch {
    /* not an active pointer */
  }
}

/** A tap on a keyed button: down and up. */
const tapKey = (action: Action) => (key(action, true), key(action, false))

interface ButtonDef {
  id: string
  label: string
  title: string
  cls?: string
  down(): void
  up?(): void
}

export class TouchControls {
  private readonly root: HTMLElement
  private readonly stick: HTMLElement
  private readonly knob: HTMLElement
  private held = new Set<Action>()
  private stickId: number | undefined

  constructor(private readonly acts: TouchActs) {
    document.body.classList.add('touch')
    this.root = document.createElement('div')
    this.root.className = 'touch-layer'
    this.root.innerHTML = `
      <div class="t-stick" id="tStick"><div class="t-knob" id="tKnob"></div></div>
      <div class="t-buttons" id="tButtons"></div>`
    document.body.append(this.root)
    this.stick = this.root.querySelector('#tStick')!
    this.knob = this.root.querySelector('#tKnob')!
    this.bindStick()
    this.buildButtons()
    // the page losing focus lets go of everything held
    window.addEventListener('blur', () => this.releaseAll())
  }

  /** Show or hide the controls (hidden over the title, a menu, a scene). */
  show(on: boolean): void {
    this.root.classList.toggle('hidden', !on)
    if (!on) this.releaseAll()
  }

  private bindStick(): void {
    const el = this.stick
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      this.stickId = e.pointerId
      capture(el, e.pointerId)
      this.lean(e)
    })
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.stickId) this.lean(e)
    })
    const end = (e: PointerEvent) => {
      if (e.pointerId !== this.stickId) return
      this.stickId = undefined
      this.knob.style.transform = ''
      this.hold(new Set())
    }
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
  }

  /** The stick leans: the knob follows, and the ways it leans far enough are held. */
  private lean(e: PointerEvent): void {
    const r = this.stick.getBoundingClientRect()
    const reach = r.width / 2
    let dx = (e.clientX - (r.left + reach)) / reach
    let dy = (e.clientY - (r.top + reach)) / reach
    const len = Math.hypot(dx, dy)
    if (len > 1) ((dx /= len), (dy /= len))
    this.knob.style.transform = `translate(${dx * reach * 0.6}px, ${dy * reach * 0.6}px)`
    const ways = new Set<Action>()
    if (Math.hypot(dx, dy) >= DEAD) {
      if (dx <= -LEAN) ways.add('left')
      if (dx >= LEAN) ways.add('right')
      if (dy <= -LEAN) ways.add('up')
      if (dy >= LEAN) ways.add('down')
    }
    this.hold(ways)
  }

  /** Hold exactly these ways: release the ones let go, press the new. */
  private hold(ways: Set<Action>): void {
    for (const a of this.held) if (!ways.has(a)) key(a, false)
    for (const a of ways) if (!this.held.has(a)) key(a, true)
    this.held = ways
  }

  private releaseAll(): void {
    this.hold(new Set())
    this.knob.style.transform = ''
  }

  private buildButtons(): void {
    const defs: ButtonDef[] = [
      { id: 'tAttack', label: '⚔', title: 'Attack', cls: 'big', down: () => key('attack', true), up: () => key('attack', false) },
      { id: 'tHands', label: '✋', title: 'Interact', cls: 'mid', down: () => tapKey('hands') },
      { id: 'tUse', label: '◆', title: 'Use held', down: () => this.acts.primary(true), up: () => this.acts.primary(false) },
      { id: 'tOn', label: '➚', title: 'Use on', down: () => this.acts.secondary() },
      { id: 'tDash', label: '»', title: 'Dash', down: () => tapKey('dash') },
      { id: 'tPut', label: '⇩', title: 'Put down', cls: 'small', down: () => tapKey('put') },
      { id: 'tDraw', label: '⚐', title: 'Draw weapon', cls: 'small', down: () => tapKey('draw') },
    ]
    const box = this.root.querySelector('#tButtons')!
    for (const d of defs) {
      const b = document.createElement('button')
      b.id = d.id
      b.className = `t-btn ${d.cls ?? ''}`
      b.type = 'button'
      b.title = d.title
      b.setAttribute('aria-label', d.title)
      b.innerHTML = `<span>${d.label}</span><small>${d.title}</small>`
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        capture(b, e.pointerId)
        b.classList.add('on')
        d.down()
      })
      const up = () => {
        if (!b.classList.contains('on')) return
        b.classList.remove('on')
        d.up?.()
      }
      b.addEventListener('pointerup', up)
      b.addEventListener('pointercancel', up)
      b.addEventListener('contextmenu', (e) => e.preventDefault())
      box.append(b)
    }
  }
}
