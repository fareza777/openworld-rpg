// Touch controls for phones and tablets (the Android build, docs/sunshard/ANDROID.md): a floating stick — nothing on
// screen until a thumb goes down on the left half of the world, where it appears under the thumb and holds the movement
// keys, and gone again when the thumb lifts — and a small cluster of buttons on the right for the acts the keyboard and
// the mouse do. The stick and the keyed buttons press the player's own bound keys (the page's key handler answers them as
// it answers a real key), so nothing the keyboard does is done a second way; the two mouse acts (the held thing's use,
// and its use on what is ahead) are the page's own, handed in. The panels' corner buttons fold into one tray (☰), the
// keys' labels are hidden, and the cluster keeps above the toolbar, so nothing lies over anything else. Shown only on a
// touch screen, in either orientation.

import { catalog } from '../game.ts'
import { keys, type Action } from '../keymap.ts'
import { assetUrl } from '../render/assets.ts'
import { rewordPage } from './touchwords.ts'

/** What the page hands the touch layer: the acts that are not keys. */
export interface TouchActs {
  /** The held thing's own use (the left click's), on the spot ahead: held, a swing goes on. */
  primary(on: boolean): void
  /** The held thing used on the spot ahead (the right click's). */
  secondary(): void
}

/**
 * The stick's lean, as a share of its reach: it starts walking past START and stops only under STOP (so a thumb at the
 * edge does not start and stop); past RUN it runs, and walks again under WALK.
 */
const START = 0.3
const STOP = 0.2
const RUN = 0.92
const WALK = 0.8
/**
 * Eight ways (engine movePlayer: a way across the one held makes a diagonal): the stick leans into one of eight
 * sectors of 45°, and keeps it until the thumb is this far (radians, 8°) past its edge, so a thumb on the line between
 * two does not flip between them at every frame.
 */
const KEEP = (8 * Math.PI) / 180
const SECTOR = Math.PI / 4
/** The keys each sector holds (from the right, turning downward as the screen's y runs): a diagonal's two. */
const SECTORS: Action[][] = [['right'], ['down', 'right'], ['down'], ['down', 'left'], ['left'], ['up', 'left'], ['up'], ['up', 'right']]
/** How far the knob travels from where the thumb went down (CSS pixels). */
const REACH = 46
/** The part of the world a thumb starts the stick in: the left half, below the top strip. */
const STICK_WIDTH = 0.5
const STICK_TOP = 0.18

/** The panels' buttons (hud.ts's corner) as the ☰ tray names them. */
const TRAY_NAMES: Record<string, string> = {
  questBtn: 'Quests',
  bagBtn: 'Bag',
  craftBtn: 'Craft',
  buildBtn: 'Build',
  skillBtn: 'Skill tree',
  skPanelBtn: 'Skills',
  jbtn: 'Codex',
  optionsBtn: 'Settings',
}

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
  /** The sector the stick walks in now (SECTORS), and whether it runs. */
  private way: number | undefined
  private running = false
  /** The thumb on the stick, and where it went down. */
  private thumb: { id: number; x: number; y: number } | undefined
  private frame = 0

  constructor(private readonly acts: TouchActs) {
    document.body.classList.add('touch')
    rewordPage()
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
    if (len > 1) {
      dx /= len
      dy /= len
      // the thumb past the knob's reach draws the stick after it, so turning back is a short move, not the whole way
      t.x = e.clientX - dx * REACH
      t.y = e.clientY - dy * REACH
      this.stick.style.left = `${t.x}px`
      this.stick.style.top = `${t.y}px`
    }
    this.knob.style.transform = `translate(${dx * REACH}px, ${dy * REACH}px)`
    const lean = Math.min(1, Math.hypot(dx, dy))
    if (lean < (this.way !== undefined ? STOP : START)) this.way = undefined
    else {
      const angle = Math.atan2(dy, dx)
      const nearest = (Math.round(angle / SECTOR) + 8) % 8
      // the sector kept while the thumb is within it and a little past its edge
      const off = (s: number) => Math.abs(Math.atan2(Math.sin(angle - s * SECTOR), Math.cos(angle - s * SECTOR)))
      if (this.way === undefined || off(this.way) > SECTOR / 2 + KEEP) this.way = nearest
    }
    this.running = this.way !== undefined && lean >= (this.running ? WALK : RUN)
    // a diagonal's two keys, the weaker lean first: the last pressed is the way faced (main.ts)
    const keys = this.way === undefined ? [] : [...SECTORS[this.way]].sort((a, b) => strength(a) - strength(b))
    function strength(a: Action) {
      return a === 'left' || a === 'right' ? Math.abs(dx) : Math.abs(dy)
    }
    const ways = new Set<Action>(keys)
    if (this.running) ways.add('run')
    this.hold(ways)
  }

  /** The thumb lifts: the stick goes, and every way it held is let go. */
  private letGo(): void {
    this.thumb = undefined
    this.stick.classList.remove('on')
    this.knob.style.transform = ''
    this.way = undefined
    this.running = false
    this.hold(new Set())
  }

  /**
   * Hold exactly these: the new pressed before the old are let go, so a turn goes from one way to the other without a
   * stop between (the last key held is the way walked).
   */
  private hold(ways: Set<Action>): void {
    for (const a of ways) if (!this.held.has(a)) key(a, true)
    for (const a of this.held) if (!ways.has(a)) key(a, false)
    this.held = ways
  }

  /** ☰ opens the panels' buttons as a tray; choosing one (or ☰ again) closes it. */
  private bindTray(): void {
    const tray = this.root.querySelector<HTMLButtonElement>('#tTray')!
    tray.addEventListener('click', () => {
      // each panel's button named under its icon (on a desktop its key says it; here there is none)
      for (const [id, name] of Object.entries(TRAY_NAMES)) document.getElementById(id)?.setAttribute('data-name', name)
      document.body.classList.toggle('tray-open')
    })
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest?.('#corner .cbtn')) document.body.classList.remove('tray-open')
    })
  }

  /**
   * Each frame's word on what the inputs would do (`Frame['keys']`): Use, Use on and Put show only while they would do
   * something, and Dash once it is learned (the skill tree's `dash`: unlearned, the key does nothing), so the cluster
   * is attack and interact and no more until there is more to do; Use and Use on wear the held thing's own icon (the
   * toolbar's chosen slot), so they say what they would use.
   */
  context(k: { primary?: unknown; secondary?: unknown; put?: unknown } | undefined, skills: readonly string[] = []): void {
    const idle = (id: string, on: boolean) => this.root.querySelector(`#${id}`)?.classList.toggle('idle', on)
    idle('tDash', !skills.includes('dash'))
    idle('tUse', !k?.primary)
    idle('tOn', !k?.secondary)
    idle('tPut', !k?.put)
    const icon = document.querySelector<HTMLCanvasElement>('#hotbar .slot.sel canvas')
    if (icon === this.heldIcon) return
    this.heldIcon = icon ?? undefined
    for (const c of this.root.querySelectorAll<HTMLCanvasElement>('canvas.t-held')) {
      c.width = icon?.width ?? 1
      c.height = icon?.height ?? 1
      const g = c.getContext('2d')
      if (!g) continue
      g.imageSmoothingEnabled = false
      if (icon) g.drawImage(icon, 0, 0)
      c.closest('.t-btn')?.classList.toggle('bare', !icon)
    }
  }
  private heldIcon: HTMLCanvasElement | undefined

  private buildButtons(): void {
    // the game's own pixel icons (its catalog's `touch…` entries) where it has them; a glyph where not
    const art = (name: string, glyph: string) => {
      const d = catalog().ui[name] as { img: string } | undefined
      return d ? `<img class="t-icon" src="${assetUrl(d.img)}" alt="" draggable="false">` : `<span>${glyph}</span>`
    }
    const held = (glyph: string) => `<canvas class="t-held t-icon"></canvas><span class="t-glyph">${glyph}</span>`
    const defs: ButtonDef[] = [
      { id: 'tAttack', label: art('touchAttack', '⚔'), title: 'Attack', down: () => key('attack', true), up: () => key('attack', false) },
      { id: 'tHands', label: art('touchInteract', '✋'), title: 'Interact', down: () => tapKey('hands') },
      { id: 'tUse', label: held('◆'), title: 'Use', down: () => this.acts.primary(true), up: () => this.acts.primary(false) },
      { id: 'tOn', label: held('➚'), title: 'Use on', down: () => this.acts.secondary() },
      { id: 'tDash', label: art('touchDash', '»'), title: 'Dash', down: () => tapKey('dash') },
      { id: 'tPut', label: art('touchPut', '⇩'), title: 'Put', down: () => tapKey('put') },
    ]
    const box = this.root.querySelector('#tButtons')!
    for (const d of defs) {
      const b = document.createElement('button')
      b.id = d.id
      b.className = 't-btn'
      b.type = 'button'
      b.title = d.title
      b.setAttribute('aria-label', d.title)
      b.innerHTML = `${d.label}<small>${d.title}</small>`
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
