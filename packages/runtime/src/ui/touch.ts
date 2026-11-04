// Touch controls for phones and tablets (the Android build, docs/sunshard/ANDROID.md): a floating stick — nothing on
// screen until a thumb goes down on the left half of the world, where it appears under the thumb and holds the movement
// keys, and gone again when the thumb lifts — and a small cluster of buttons on the right for the acts the keyboard and
// the mouse do. The stick and the keyed buttons press the player's own bound keys (the page's key handler answers them as
// it answers a real key), so nothing the keyboard does is done a second way; the two mouse acts (the held thing's use,
// and its use on what is ahead) are the page's own, handed in. The panels' corner buttons fold into one tray (☰), the
// keys' labels are hidden, and the cluster keeps above the toolbar, so nothing lies over anything else. Shown only on a
// touch screen, in either orientation.

import { keys, type Action } from '../keymap.ts'

/** What the page hands the touch layer: the acts that are not keys. */
export interface TouchActs {
  /** The held thing's own use (the left click's), on the spot ahead: held, a swing goes on. */
  primary(on: boolean): void
  /** The held thing used on the spot ahead (the right click's). */
  secondary(): void
}

/** The stick's dead zone and how far along an axis it must lean to hold that way, as a share of its reach. */
const DEAD = 0.28
const LEAN = 0.38
/** How far the knob travels from where the thumb went down (CSS pixels). */
const REACH = 46
/** The part of the world a thumb starts the stick in: the left half, below the top strip. */
const STICK_WIDTH = 0.5
const STICK_TOP = 0.18

/** A screen that is touched: a coarse pointer or touch points (a phone, a tablet; the Android build). */
export function isTouchScreen(): boolean {
  if (typeof window === 'undefined') return false
  const asked = new URLSearchParams(location.search).get('touch')
  if (asked === '1') return true
  if (asked === '0') return false
  return (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0
}

/** Press or release an action's key (its first binding), as the keyboard would. */
function key(action: Action, down: boolean): void {
  const b = keys.map[action]?.[0]
  if (!b) return
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code: b.code, key: '', shiftKey: !!b.shift, bubbles: true, cancelable: true }))
}

/** A tap on a keyed button: down and up. */
const tapKey = (action: Action) => (key(action, true), key(action, false))

/** Hold a pointer to the element it went down on; a pointer the browser no longer knows is simply not held. */
function capture(el: HTMLElement, id: number): void {
  try {
    el.setPointerCapture(id)
  } catch {
    /* not an active pointer */
  }
}

interface ButtonDef {
  id: string
  label: string
  title: string
  down(): void
  up?(): void
}

export class TouchControls {
  private readonly root: HTMLElement
  private readonly stick: HTMLElement
  private readonly knob: HTMLElement
  private held = new Set<Action>()
  /** The thumb on the stick, and where it went down. */
  private thumb: { id: number; x: number; y: number } | undefined
  private frame = 0

  constructor(private readonly acts: TouchActs) {
    document.body.classList.add('touch')
    this.root = document.createElement('div')
    this.root.className = 'touch-layer'
    this.root.innerHTML = `
      <div class="t-stick" id="tStick"><div class="t-knob" id="tKnob"></div></div>
      <button class="t-tray" id="tTray" type="button" aria-label="Menus">☰</button>
      <div class="t-buttons" id="tButtons"></div>`
    document.body.append(this.root)
    this.stick = this.root.querySelector('#tStick')!
    this.knob = this.root.querySelector('#tKnob')!
    this.buildButtons()
    this.bindTray()
    window.addEventListener('pointermove', (e) => e.pointerId === this.thumb?.id && this.lean(e))
    window.addEventListener('pointerup', (e) => e.pointerId === this.thumb?.id && this.letGo())
    window.addEventListener('pointercancel', (e) => e.pointerId === this.thumb?.id && this.letGo())
    // the page losing focus lets go of everything held
    window.addEventListener('blur', () => this.letGo())
  }

  /** Show or hide the controls (hidden over the title, a menu, the console); kept clear of the toolbar. */
  show(on: boolean): void {
    this.root.classList.toggle('hidden', !on)
    if (!on) {
      this.letGo()
      document.body.classList.remove('tray-open')
    }
    // now and then: how high the toolbar (its hearts and food above it) stands, so the cluster sits over it (the layout
    // moves it: the orientation, a panel)
    if (on && this.frame++ % 30 === 0) {
      const bar = document.getElementById('hotbar')?.getBoundingClientRect()
      const above = bar && bar.height ? Math.round(innerHeight - bar.top) : 0
      document.documentElement.style.setProperty('--t-above', `${above + 8}px`)
    }
  }

  /** A thumb went down on the world: on its left half the stick appears under it and takes it (true). */
  grab(e: PointerEvent): boolean {
    if (this.thumb || e.clientX > innerWidth * STICK_WIDTH || e.clientY < innerHeight * STICK_TOP) return false
    this.thumb = { id: e.pointerId, x: e.clientX, y: e.clientY }
    this.stick.style.left = `${e.clientX}px`
    this.stick.style.top = `${e.clientY}px`
    this.stick.classList.add('on')
    this.knob.style.transform = ''
    return true
  }

  /** Is this pointer the stick's? */
  owns(id: number): boolean {
    return this.thumb?.id === id
  }

  /** The thumb moves: the knob follows, and the ways it leans far enough are held. */
  private lean(e: PointerEvent): void {
    const t = this.thumb!
    let dx = (e.clientX - t.x) / REACH
    let dy = (e.clientY - t.y) / REACH
    const len = Math.hypot(dx, dy)
    if (len > 1) ((dx /= len), (dy /= len))
    this.knob.style.transform = `translate(${dx * REACH}px, ${dy * REACH}px)`
    const ways = new Set<Action>()
    if (Math.hypot(dx, dy) >= DEAD) {
      if (dx <= -LEAN) ways.add('left')
      if (dx >= LEAN) ways.add('right')
      if (dy <= -LEAN) ways.add('up')
      if (dy >= LEAN) ways.add('down')
    }
    this.hold(ways)
  }

  /** The thumb lifts: the stick goes, and every way it held is let go. */
  private letGo(): void {
    this.thumb = undefined
    this.stick.classList.remove('on')
    this.knob.style.transform = ''
    this.hold(new Set())
  }

  /** Hold exactly these ways: release the ones let go, press the new. */
  private hold(ways: Set<Action>): void {
    for (const a of this.held) if (!ways.has(a)) key(a, false)
    for (const a of ways) if (!this.held.has(a)) key(a, true)
    this.held = ways
  }

  /** ☰ opens the panels' buttons as a tray; choosing one (or ☰ again) closes it. */
  private bindTray(): void {
    const tray = this.root.querySelector<HTMLButtonElement>('#tTray')!
    tray.addEventListener('click', () => document.body.classList.toggle('tray-open'))
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest?.('#corner .cbtn')) document.body.classList.remove('tray-open')
    })
  }

  private buildButtons(): void {
    const defs: ButtonDef[] = [
      { id: 'tAttack', label: '⚔', title: 'Attack', down: () => key('attack', true), up: () => key('attack', false) },
      { id: 'tHands', label: '✋', title: 'Interact', down: () => tapKey('hands') },
      { id: 'tUse', label: '◆', title: 'Use', down: () => this.acts.primary(true), up: () => this.acts.primary(false) },
      { id: 'tOn', label: '➚', title: 'Use on', down: () => this.acts.secondary() },
      { id: 'tDash', label: '»', title: 'Dash', down: () => tapKey('dash') },
      { id: 'tPut', label: '⇩', title: 'Put', down: () => tapKey('put') },
      { id: 'tDraw', label: '⚐', title: 'Draw', down: () => tapKey('draw') },
    ]
    const box = this.root.querySelector('#tButtons')!
    for (const d of defs) {
      const b = document.createElement('button')
      b.id = d.id
      b.className = 't-btn'
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
