import { Capacitor, registerPlugin } from '@capacitor/core'
import './cinematic.css'

interface StoreState { owned: boolean; available: boolean; price?: string }
const Store = registerPlugin<{
  initialize(): Promise<void>; banner(o: { visible: boolean }): Promise<void>; interstitial(): Promise<void>
  reward(): Promise<{ earned: boolean }>; status(): Promise<StoreState>; purchase(): Promise<void>; restore(): Promise<void>; privacy(): Promise<void>
}>('Monetization')
const native = Capacitor.isNativePlatform()
const base = import.meta.env.BASE_URL
const lines: [number, string][] = [[0.0, "Once, the crown held the dawn."], [3.064, "Then its light was shattered."], [5.605, "In Solmere, every lantern guards a memory."], [9.679, "Beyond the last warm hearth, forgotten roads awaken."], [14.253, "Carry the light. Find what was lost."], [18.303, "And let the world remember."], [20.915, "Sunshard. The Sundered Crown."]]
let playing = false
const gameplay = () => document.getElementById('app')?.classList.contains('on-cover') === false
const syncBanner = () => { if (native) void Store.banner({ visible: !playing && gameplay() }).catch(() => {}) }
export function playPrologue(): void {
  if (playing) return
  playing = true
  syncBanner()
  const host = document.createElement('div')
  host.className = 'sun-film'
  host.setAttribute('role', 'dialog'); host.setAttribute('aria-label', 'The Sundered Crown prologue')
  host.innerHTML = `<img class="sun-film-art" src="${base}cinematic/dawn.webp" alt="A traveler carries a sun crystal toward a shattered citadel"><div class="sun-film-shade"></div><header><span>SUNSHARD · PROLOGUE</span><button class="sun-skip">Skip intro</button></header><div class="sun-film-title"><small>A WORLD WAITING TO REMEMBER</small><h1>SUNSHARD</h1><p>THE SUNDERED CROWN</p><button class="sun-begin">Begin with sound</button><button class="sun-silent">Play silently</button></div><p class="sun-sub" aria-live="off"></p><div class="sun-timeline"><i></i></div>`
  document.body.append(host)
  const audio = new Audio(`${base}cinematic/prologue.wav`)
  let frame = 0, start = 0, active = false
  const oldFocus = document.activeElement as HTMLElement | null
  const stop = () => { cancelAnimationFrame(frame); audio.pause(); host.remove(); playing = false; syncBanner(); document.removeEventListener('keydown', keys, true); oldFocus?.focus() }
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopImmediatePropagation(); stop() }
    if (e.key === 'Tab') { const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('button')).filter(b => b.offsetParent !== null); const i = buttons.indexOf(document.activeElement as HTMLButtonElement); e.preventDefault(); buttons[(i + (e.shiftKey ? buttons.length - 1 : 1)) % buttons.length]?.focus() }
  }
  document.addEventListener('keydown', keys, true)
  const tick = () => {
    const t = audio.paused ? (performance.now() - start) / 1000 : audio.currentTime
    const duration = Number.isFinite(audio.duration) ? audio.duration : 34
    let index = 0; lines.forEach(([at], i) => { if (t >= at) index = i })
    host.querySelector('.sun-sub')!.textContent = lines[Math.max(0, index)][1]
    ;(host.querySelector('.sun-timeline i') as HTMLElement).style.width = `${Math.min(100, t / duration * 100)}%`
    host.dataset.shot = String(Math.min(3, Math.floor(t / 5.5)))
    if (t >= duration) stop(); else frame = requestAnimationFrame(tick)
  }
  const begin = async (silent: boolean) => {
    if (active) return; active = true
    if (!silent) { try { await audio.play() } catch { active = false; host.querySelector('.sun-begin')!.textContent = 'Sound unavailable · retry'; return } }
    host.classList.add('running'); start = performance.now(); frame = requestAnimationFrame(tick)
  }
  host.querySelector<HTMLButtonElement>('.sun-skip')!.onclick = stop
  host.querySelector<HTMLButtonElement>('.sun-begin')!.onclick = () => void begin(false)
  host.querySelector<HTMLButtonElement>('.sun-silent')!.onclick = () => void begin(true)
  host.querySelector<HTMLButtonElement>('.sun-begin')!.focus()
}

export function installPresentation(): void {
  const tools = document.createElement('div'); tools.className = 'sun-extras'
  tools.innerHTML = '<button data-film>Watch prologue</button>' + (native ? '<button data-store>Store & extras</button>' : '')
  document.body.append(tools)
  tools.querySelector<HTMLButtonElement>('[data-film]')!.onclick = playPrologue
  tools.querySelector<HTMLButtonElement>('[data-store]')?.addEventListener('click', () => void openStore())
  let wasCover = true
  const update = () => {
    const onCover = document.getElementById('app')?.classList.contains('on-cover') ?? false
    tools.hidden = !onCover
    if (native && onCover !== wasCover) { syncBanner(); if (onCover) void Store.interstitial().catch(() => {}) }
    wasCover = onCover
  }
  new MutationObserver(update).observe(document.getElementById('app')!, { attributes: true, attributeFilter: ['class'] })
  update()
  if (native) void Store.initialize().catch(() => {})
  playPrologue()
}
async function openStore(): Promise<void> {
  const panel = document.createElement('dialog'); panel.className = 'sun-store'
  panel.innerHTML = '<h2>Traveler’s extras</h2><p>Remove Ads · US$4.99</p><p>One purchase removes banners and automatic interstitials. Optional reward videos remain your choice.</p><button data-buy>Checking Google Play…</button><button data-restore>Restore purchases</button><button data-reward>Watch a video · unlock the art gallery</button><button data-privacy>Privacy choices</button><button data-close>Close</button><p role="status"></p>'
  document.body.append(panel); panel.showModal()
  const say = (s: string) => { panel.querySelector('[role=status]')!.textContent = s }
  const fail = (e: unknown) => say(e instanceof Error ? e.message : String(e))
  const refresh = async () => { const s = await Store.status(); const b = panel.querySelector<HTMLButtonElement>('[data-buy]')!; b.disabled = s.owned || !s.available; b.textContent = s.owned ? 'Ads removed' : s.available ? `Remove Ads · ${s.price ?? 'US$4.99'}` : 'Purchase available through Google Play'; if (s.owned) panel.querySelector<HTMLButtonElement>('[data-reward]')!.textContent = 'Open art gallery' }
  void refresh().catch(fail)
  const poll = setInterval(() => void refresh().catch(() => {}), 2000)
  panel.addEventListener('close', () => { clearInterval(poll); panel.remove() })
  panel.querySelector<HTMLButtonElement>('[data-close]')!.onclick = () => panel.close()
  panel.querySelector<HTMLButtonElement>('[data-buy]')!.onclick = () => void Store.purchase().then(refresh).catch(fail)
  panel.querySelector<HTMLButtonElement>('[data-restore]')!.onclick = () => void Store.restore().then(() => say('Restore requested. Google Play will refresh your purchases.')).catch(fail)
  panel.querySelector<HTMLButtonElement>('[data-privacy]')!.onclick = () => void Store.privacy().catch(fail)
  panel.querySelector<HTMLButtonElement>('[data-reward]')!.onclick = async () => {
    try {
      const s = await Store.status()
      if (!s.owned && localStorage.getItem('sunshard:gallery') !== '1') { const r = await Store.reward(); if (!r.earned) { say('Video closed before the reward.'); return }; localStorage.setItem('sunshard:gallery', '1') }
      panel.querySelector('h2')!.textContent = 'Dawn of the Sundered Crown'
      if (!panel.querySelector('img')) { const img = document.createElement('img'); img.src = `${base}cinematic/dawn.webp`; img.alt = 'Sunshard cinematic key art'; img.style.width = '100%'; panel.insertBefore(img, panel.firstChild) }
      say('Art gallery unlocked. Thank you for supporting Sunshard.')
    } catch (e) { fail(e) }
  }
}
