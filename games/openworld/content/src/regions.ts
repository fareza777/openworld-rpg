// The continent's regions (docs/continent.md, docs/lore.md §6): one for each of the five seals, held by its
// Seal-bearer and marked by its suffering, round the Holy City where the five are carried. Frostfang Coast, the
// first seal's, is where the game is played now; the others are backdrop (docs/continent.md §1): walkable,
// peopled later, with no story yet.

import type { RegionLook, Text } from '@openworld/engine'

export interface RegionDef {
  id: string
  name: Text
  /** One line of what it is: the suffering it carries and how the land shows it. */
  doc: Text
  /** Its seal (docs/lore.md §4) and its sacred instrument's wayshrine (fixture/sacred/wayshrine/<seal>); the Holy City has none. */
  seal?: 'crown' | 'scourge' | 'scales' | 'nails' | 'lance'
  /** Drawn on the world map: its border and its name. */
  color: string
  /** Nothing of the story is played there yet: its places are background (docs/continent.md §1). */
  backdrop?: boolean
  /**
   * How its maps look (docs/continent.md §9 B): the world filter's grade there and how dim its light. The Frostfang
   * Coast has none — the played land keeps the game's own look.
   */
  look?: RegionLook
}

export const REGIONS: RegionDef[] = [
  {
    id: 'frostfang',
    name: { en: 'Frostfang Coast', zh: '霜牙海岸' },
    doc: { en: 'The first March: a cold coast of pine and fords, the White Knight\'s river, briars where the Briar Diadem is carried.', zh: 'The first March: a cold coast of pine and fords, the White Knight\'s river, briars where the Briar Diadem is carried.' },
    seal: 'crown',
    color: '#9cc4dc',
  },
  {
    id: 'redmarch',
    name: { en: 'The Scarred March', zh: '赤痕边境' },
    doc: { en: 'The second March: red badlands and steppe where the war never ends — forts, old battlefields, the Ember Chain\'s scorch in the rock.', zh: 'The second March: red badlands and steppe where the war never ends — forts, old battlefields, the Ember Chain\'s scorch in the rock.' },
    seal: 'scourge',
    color: '#c8644a',
    // the red of the rock and of the welts: warm, dusty, a little dim
    look: { tint: '#c86a48', tintAmount: 0.22, desat: 0.05, shade: 0.04 },
    backdrop: true,
  },
  {
    id: 'tithe',
    name: { en: 'The Golden Reach', zh: 'The Golden Reach' },
    doc: { en: 'The third March: a great grain plain gone barren, salt flats and dust, market towns where everything is weighed and the poor go hungry.', zh: 'The third March: a great grain plain gone barren, salt flats and dust, market towns where everything is weighed and the poor go hungry.' },
    seal: 'scales',
    color: '#d6b45a',
    // grain gone to dust: a pale straw light, the colour drained from it
    look: { tint: '#d8c08a', tintAmount: 0.2, desat: 0.18 },
    backdrop: true,
  },
  {
    id: 'palefen',
    name: { en: 'The Mirewood', zh: 'The Mirewood' },
    doc: { en: 'The fourth March: marsh and dead wood under a dusk that hardly lifts, graveyards and ossuaries — the dead who will not rest.', zh: 'The fourth March: marsh and dead wood under a dusk that hardly lifts, graveyards and ossuaries — the dead who will not rest.' },
    seal: 'nails',
    color: '#8a9a8c',
    // a dusk that hardly lifts: grey-green, the colour nearly gone, dim by day and darker at night
    look: { tint: '#6f8a80', tintAmount: 0.35, desat: 0.4, shade: 0.24 },
    backdrop: true,
  },
  {
    id: 'altar',
    name: { en: 'The Silverspire Heights', zh: 'The Silverspire Heights' },
    doc: { en: 'The fifth March: white stone highlands and cliffs, monasteries and reliquaries, the catacombs of the Vigil under the altar.', zh: 'The fifth March: white stone highlands and cliffs, monasteries and reliquaries, the catacombs of the Vigil under the altar.' },
    seal: 'lance',
    color: '#e6e0d0',
    // white stone under a high, cold light: bleached, a touch of blue
    look: { tint: '#dfe4ee', tintAmount: 0.2, desat: 0.12 },
    backdrop: true,
  },
  {
    id: 'holy',
    name: { en: 'Solmere, the Crown City', zh: 'Solmere, the Crown City' },
    doc: { en: 'Where the five Regalia are called home: the Regent\'s city round the Crown Chapel, the seat of the Radiant Order, and the old works under it that carry light to it.', zh: 'Where the five Regalia are called home: the Regent\'s city round the Crown Chapel, the seat of the Radiant Order, and the old works under it that carry light to it.' },
    color: '#f0d890',
    // the city of candles and gold leaf: a warm gold
    look: { tint: '#f0cf7a', tintAmount: 0.16, desat: -0.05 },
    backdrop: true,
  },
]

export const REGION_BY_ID: Record<string, RegionDef> = Object.fromEntries(REGIONS.map((r) => [r.id, r]))

/**
 * The fact a place whose story is not told yet waits for (content SITE_GATES): no rule sets it, so such a place —
 * a Seal-bearer's seat beyond the first, the Most Holy Hall — stays sealed and says so.
 */
export const UNTOLD = 'world.untold'

/**
 * The fact the continent east of the river waits for (release 1, docs/release-1.md §1): the edges of every hand-made
 * map there (`edgesWhen`), out onto the world map and every place beyond the story's chain. No rule sets it; the dev
 * console does.
 */
export const PART_TWO = 'world.part2'

/**
 * The fact Chapter 2's road waits for (docs/chapter-2.md §12): set by Chapter 1's homecoming (the story step `return`),
 * it opens the East Road's way on east and Chapter 2's places — Emberfall, its mine, Cinder Pass, the dragon's lair and
 * the March's maps over the pass (a portal's and a site's `opensWhen`). Their edges onto the world map wait for
 * PART_TWO still.
 */
export const CHAPTER_TWO = 'world.ch2'

/**
 * The facts each later chapter's road waits for (docs/chapter-3.md §2.4): each set by the chapter before's end, each
 * opening its chapter's places and the long road to them (a portal's and a site's `opensWhen`). Their edges onto the
 * world map wait for PART_TWO still.
 */
export const CHAPTER_THREE = 'world.ch3'
export const CHAPTER_FOUR = 'world.ch4'
export const CHAPTER_FIVE = 'world.ch5'
export const FINALE = 'world.fin'
