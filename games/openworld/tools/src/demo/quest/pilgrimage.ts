// The Old Crown Road (docs/sunshard/CHAPTER-1.md; mechanics docs/chapter-1.md §14; content pilgrimage.ts): the maps
// between the Ford and the White Knight, and their scenes. East of the river: the Wardens' Rest, where the Order's priest
// takes the Regent's oath at the altar of the five facets; the Old Crown Road, its five dead beacons of Queen Isolde's
// road lit one by one, and a penitent who scourges himself on it; north of the road, the ruined Briarmoor Abbey where
// Gavrel was made a knight — the Briar Knights' roll, his cell and his journal, Solmere's writ of recall he never
// answered, and in the crypt the abbey's last keeper, who holds the order's seal; and the Field of Oaths, the stones of
// the knights who swore to hold the river with him. Then the Eastmarch Road and the knight. Solmere here speaks of the
// Crownseeking as it is proclaimed — seek out the Wardens, overcome them, bring the Regalia home — and nothing more
// (docs/sunshard/STORY.md §2: the first layer only).

import type { AiData, StepDef } from '@openworld/engine'
import { ABBOT_ID, ALBERIC_ID, CH1, CHURCH, FAITH, ORDER_SEAL, PILGRIMAGE, WAYSHRINES, WRIT, shrineFact } from '@openworld-game/content'
import { MapBuilder } from '../builder.ts'
import { L, GROUND_YIELD, appears, lay } from '../kit.ts'
import { flHouse } from '../village.ts'
import { decor, piles, strew, unshut } from '../showcase/dress.ts'
import { wildFloor } from '../wildfloor.ts'
import { noise, seal, ways, woods } from './country.ts'
import { HALLS } from '../../art/arch/plans.ts'

/** Edge openings: the Ford's east edge into the Rest, the Rest into the road, the road into the field and to the abbey. */
export const PILGRIM = {
  rest: { w: 36, h: 26, west: [12, 13, 14], east: [11, 12, 13] },
  way: { w: 56, h: 24, west: [11, 12, 13], east: [11, 12, 13], north: [26, 27, 28] },
  abbey: { w: 40, h: 30, south: [19, 20, 21] },
  field: { w: 44, h: 24, west: [11, 12, 13], east: [11, 12, 13] },
  /** where the shrines stand along the road */
  shrines: [[7, 9], [17, 15], [30, 8], [40, 15], [50, 9]] as const,
} as const

const HUNT = (sight = 5): Omit<AiData, 'home'> => ({ behaviour: 'melee', temper: 'aggressive', sight, leash: 6 })
const say = (who: string, en: string, zh?: string, mood?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'shy') => ({ say: who, text: L(en, zh), ...(mood && { mood }) })

/** The nearest free tile to (x, y). */
function spot(m: MapBuilder, x: number, y: number, walk = false): [number, number] {
  for (let r = 0; r <= 6; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
        if (walk ? m.walkable(x + dx, y + dy) : m.free(x + dx, y + dy)) return [x + dx, y + dy]
      }
  throw new Error(`no open tile near ${m.id}:${x},${y}`)
}
const inRect = ([rx, ry, rw, rh]: readonly number[], x: number, y: number) => x >= rx && y >= ry && x < rx + rw && y < ry + rh
const ROADS = new Set(['path', 'dirt', 'flags', 'bridge'])
const grassy = (t: string) => t === 'grass' || t === 'drygrass'

// =================================================================== the Pilgrims' Rest

/**
 * The Rest (docs/chapter-1.md §14; the redo of 2026-10-27): where the road from the Ford comes up out of the trees, the
 * Regent keeps a halt for the Crownseekers he sends east. North of the road, facing it, the chapel of the five facets and the
 * hostel, the Rest's green between them under an old ash; south of the road its yard in a dry-stone wall — the well,
 * the pilgrims' fire with its benches, the hostel's kitchen garden, the wood and the cart; a wayside cross where the
 * road comes in, the woods close round all of it but the road.
 */
export const REST = { chapel: [5, 7] as const, hostel: [21, 8] as const, yard: [6, 17, 23, 6] as const }

export function buildRest(): MapBuilder {
  const P = PILGRIM.rest
  const m = new MapBuilder('waystation', L("The Wardens' Rest"), 'village', P.w, P.h, 'grass', 'village', 'outdoor', 'frostfang')
  m.zone = 'peaceful'
  // a meadow kept short by the pilgrims' beasts; dry heath where it runs into the trees
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (noise(x, y, 6, 281) > 0.64 && (x < 7 || x > 29 || y < 4 || y > 21)) m.set(x, y, 'drygrass')
  // the road: in from the Ford, dipping past the Rest's doors, out east onto the Old Crown Road
  m.path([[0, 13], [6, 13], [12, 14], [20, 14], [28, 14], [32, 12], [35, 12]], 'path', 3, { edge: 'dirt', edgeP: 0.08 })
  // the chapel and the hostel, their forecourts of flags down to the road
  const [cx, cy] = REST.chapel
  const [hx, hy] = REST.hostel
  m.building('pr_chapel', cx, cy, ['chapel'], true)
  m.building('pr_hostel', hx, hy, ['hostel'], true)
  const [cdx, cdy] = m.doors.chapel
  const [hdx, hdy] = m.doors.hostel
  m.rect(cdx - 1, cdy + 1, 3, 2, 'flags')
  m.rect(hdx - 1, hdy + 1, 3, 1, 'flags')
  // the green between them: the old ash, flowers in the grass, the Regent's notice where the road goes by
  m.set(16, 8, 'tree')
  m.organic(16, 10, 2.2, 1.2, 'flowers', { rough: 0.5, only: (t) => t === 'grass' })
  m.fixture('fixture/sign/noticeboard', 14, 11, {
    name: L('The Regent\'s notice'),
    props: {
      text: 'BY ORDER OF THE LORD REGENT, IN SOLMERE. The five Wardens have broken faith with the Crown and keep its Regalia from the realm, and the days grow shorter for it. Crownseekers: seek out the five Wardens, overcome them, and bring the five Regalia home to Solmere for the Reforging. Before you go on, swear the Regent\'s oath at the altar of the five facets.',
    },
  })
  m.fixture('fixture/sign', 32, 10, { props: { text: "THE OLD CROWN ROAD →  Five of the old Queen's beacons stand along it, one for each of the Regalia. Light each as you pass." } })
  // the yard south of the road, in its wall: the well, the pilgrims' fire and its benches, the kitchen garden
  const [yx, yy, yw, yh] = REST.yard
  m.rect(yx + 1, yy + 1, yw - 2, yh - 2, 'dirt')
  m.organic(yx + 9, yy + 3, 6, 2.2, 'grass', { rough: 0.5, only: (t) => t === 'dirt' })
  m.yard(yx, yy, yw, yh, 'stonewall', [[12, yy], [13, yy], [22, yy]])
  m.path([[12, 15], [12, yy + 1]], 'path', 1)
  m.path([[22, 15], [22, yy + 1]], 'path', 1)
  m.fixture('fixture/water/well', 19, 19)
  m.fixture('fixture/light/campfire', 12, 19, { statuses: { lit: -1 } })
  for (const [x, y] of [[10, 20], [14, 20]] as const) m.fixture('fixture/furniture/bench/log', x, y)
  for (const y of [19, 21]) m.rect(24, y, 4, 1, 'farmland')
  // the way in from the Ford: a wayside cross, the travellers' first sight of the Regent's road
  decor(m, 'decor_waycross', 3, 16)
  // the people's places (people/caius.ts, maud.ts, wynn.ts)
  m.anchor('caius.porch', cdx + 2, cdy + 1)
  m.anchor('maud.fire', ...spot(m, 12, 18, true))
  m.anchor('wynn.play', ...spot(m, 18, 18, true))
  m.regions.square = [8, 8, 20, 10]
  // the woods round it all, closed but for the road
  const keep = (x: number, y: number) => m.near(x, y, (t) => ROADS.has(t), 2) || inRect([yx - 1, yy - 1, yw + 2, yh + 2], x, y) || inRect([4, 3, 27, 10], x, y)
  woods(m, keep, { depth: 3, swell: 2.2, pines: 0.4, seed: 281 })
  seal(m, ways(m, { west: P.west, east: P.east }))
  // what the Rest lives by, piled at its walls and strewn on its ground; the yard's wood, hay, sacks and cart
  for (const [name, x, y] of [['decor_firewood', 7, 18], ['decor_hay', 7, 21], ['decor_cart', 26, 18], ['decor_sacks', 17, 21], ['decor_casks', 21, 21], ['decor_crates', 22, 21], ['decor_firewood', 4, 11]] as [string, number, number][]) decor(m, name, x, y)
  piles(m, hx, hy + 4, 9, 1, 'poor', 0.6)
  piles(m, cx, cy + 4, 7, 1, 'close', 0.5)
  strew(m, 0, 0, m.w, m.h, 0.06, 'poor')
  m.sprinkle('fixture/nature/flowers', 0.08, (x, y, t) => t === 'grass' && m.near(x, y, (u) => ROADS.has(u), 2) && !m.near(x, y, (u) => u === 'door', 1))
  m.sprinkle('fixture/nature/leaves', 0.14, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'tree' || u === 'pine'))
  wildFloor(m, 0.8, (x, y) => keep(x, y))
  unshut(m)
  m.appear = GROUND_YIELD
  return m
}

/** The chapel of the five facets at the Rest: the Dawn Crown carved over the altar, the nave, and the priest's cell beside it. */
export function buildRestChapel(): MapBuilder {
  const { m, P } = flHouse('prchapel', 'waystation.chapel', 'Chapel of the Five Facets', 'Chapel of the Five Facets', 'floor_stone', ['nave', 'cell'], { music: 'temple' })
  const N = P.nave
  const ax = N.x + 5
  m.rect(ax - 1, N.y + 1, 3, N.h - 1, 'carpet')
  m.fixture('fixture/sacred/altar', ax, N.y, {
    id: 'waystation.altar',
    name: L('The altar of the five facets'),
    tags: ['readable'],
    props: { text: 'The Dawn Crown carved in white stone over the altar, its five facets cut deep and painted gold: the Diadem, the Chain, the Scales, the Lantern, and a fifth whose gold has been scraped away. Below: WHILE ONE SHARD BURNS, NO HOUSE IS DARK.' },
  })
  for (const x of [ax - 3, ax + 3]) m.fixture('fixture/light/candles', x, N.y, { statuses: { lit: -1 } })
  m.fixture('fixture/furniture/bookstand', N.x + 1, N.y + 3, { name: L('The Litany of the Crown'), tags: ['readable'], props: { text: 'Aurex fell so that we might rise. While one shard burns, no house is dark. When the Crown is whole again, the Dimming shall end.' } })
  for (const x of [ax - 3, ax + 3]) m.fixture('fixture/furniture/bench', x, N.y + 6)
  // the priest's cell: his cot, his rug, the wood for the brazier he does not light
  const C = P.cell
  m.fixture('fixture/furniture/bed', C.x + 3, C.y + 1, { name: L("The priest's cot", '司铎的小床') })
  m.building('decor_rug', C.x + 1, C.y + 4)
  m.building('decor_firewood', C.x, C.y)
  m.anchor('caius.altar', ax, N.y + 2)
  m.anchor('caius.bed', C.x + 3, C.y + 2)
  m.regions.altar = [ax - 2, N.y + 1, 5, 3]
  return m
}

/** The hostel: the common room by the door, its hearth and the hostel book; the dormitory's cots beside it, most of them empty. */
export function buildHostel(): MapBuilder {
  const { m, P } = flHouse('prhostel', 'waystation.hostel', "The Rest's Hostel", "The Rest's Hostel", 'floor_wood', ['common', 'dorm'])
  const C = P.common
  m.fixture('fixture/light/fireplace', C.x + 4, C.y, { statuses: { lit: -1 } })
  m.rect(C.x + 3, C.y + 3, 3, 3, 'carpet')
  m.fixture('fixture/furniture/table', C.x + 4, C.y + 4, { name: L('The hostel book'), tags: ['readable'], props: { text: 'A register of names and years, a small crown drawn beside each name. The oldest pages are nineteen years old and have gone brown. After many of the names the same words are added, in one hand after another down the years: "Went east. Did not come back."' } })
  m.fixture('fixture/container/chest', C.x + 8, C.y + 6)
  m.building('decor_firewood', C.x + 7, C.y)
  m.building('decor_sacks', C.x, C.y)
  m.building('decor_casks', C.x, C.y + 5)
  // the dormitory: a cot for each traveller the Rest can take, along its wall
  const D = P.dorm
  for (let i = 0; i < 5; i++) m.fixture('fixture/furniture/bed', D.x + i * 2, D.y + 1, i < 2 ? {} : { name: L('An empty cot', '一张空床') })
  m.building('decor_rug', D.x + 3, D.y + 5)
  m.anchor('maud.bed', D.x, D.y + 2)
  m.anchor('wynn.bed', D.x + 2, D.y + 2)
  return m
}

// =================================================================== the Old Crown Road

/**
 * The Old Crown Road (the redo of 2026-10-27): the road east through a travellers' country — sheep-cropped grass and heath,
 * an old field walled in dry stone north of it and another past the brook, coppices, the brook under the road at its
 * plank bridge; the five beacon shrines on their aprons of flags, one for each of the Regalia; the way up to the abbey north
 * from the middle of the road, a wayside cross at its foot; the penitent's camp off the road; the knight's thorns and
 * pennants marking it the further east it goes.
 */
export function buildWay(): MapBuilder {
  const P = PILGRIM.way
  const m = new MapBuilder('pilgrimway', L('The Old Crown Road'), 'wild', P.w, P.h, 'grass', 'field', 'outdoor', 'frostfang')
  m.gearLevel = 3
  // grazing and heath: dry grass where the noise swells
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (noise(x, y, 7, 291) > 0.6) m.set(x, y, 'drygrass')
  // the road, and the way up to the abbey
  // the brook from the north woods to the south; the road crosses it on a bridge of planks as wide as the road
  m.path([[43, 0], [42, 4], [44, 8], [43, 12], [42, 16], [43, 20], [42, 23]], 'water', 2)
  const brook = new Set<string>()
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.get(x, y) === 'water') brook.add(`${x},${y}`)
  m.path([[0, 12], [7, 12], [15, 13], [24, 11], [33, 12], [42, 13], [50, 12], [55, 12]], 'path', 3, { edge: 'dirt', edgeP: 0.08, over: (c) => c !== 'wall' && c !== 'door' })
  for (const k of brook) {
    const [x, y] = k.split(',').map(Number)
    if (ROADS.has(m.get(x, y))) m.set(x, y, 'bridge')
  }
  m.path([[27, 11], [27, 7], [26, 3], [27, 0]], 'path', 2, { edge: 'dirt', edgeP: 0.08 })
  m.rect(26, 0, 3, 2, 'path')
  m.sprinkle('fixture/nature/reeds', 0.35, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'water') && !m.near(x, y, (u) => ROADS.has(u), 1))
  // the old fields in their dry-stone walls: one north of the road gone to hay, one past the brook gone to tussock
  m.yard(3, 1, 15, 7, 'stonewall', [[10, 7]])
  for (const y of [3, 5]) m.rect(5, y, 11, 1, 'dirt')
  m.yard(48, 16, 7, 6, 'stonewall', [[50, 16]])
  m.organic(51, 19, 2.5, 1.5, 'drygrass', { only: (t) => t === 'grass' })
  // the five shrines' aprons, then the shrines on them, one for each of the Regalia, along the road
  for (const [x, y] of PILGRIM.shrines) m.rect(x - 1, y, 3, 2, 'flags')
  WAYSHRINES.forEach((s, i) => m.fixture(`fixture/sacred/wayshrine/${s.id}`, ...spot(m, PILGRIM.shrines[i][0], PILGRIM.shrines[i][1]), { id: `way.shrine.${s.id}` }))
  // the wayside cross where the abbey's way leaves the road
  decor(m, 'decor_waycross', 24, 8)
  // the knight's mark: signposts bound with thorns, and white pennants, more tattered the further east they hang
  for (const [x, y, n] of [[10, 10, 0], [26, 14, 1], [45, 10, 2]] as const) {
    m.fixture('fixture/sign', ...spot(m, x, y), {
      name: L('A thorn-bound signpost', '缠着荆棘的路标'),
      props: {
        text: ['EAST: THE EASTMARCH. NONE CROSS FOR SOLMERE.', 'THE RIVER IS HELD. GO BACK.', 'HOLD.'][n],
      },
    })
    m.fixture('fixture/nature/briar', ...spot(m, x + 1, y), { name: L("The knight's thorns", '骑士的荆棘') })
  }
  for (const [x, y, n] of [[20, 9, 0], [36, 15, 1], [52, 9, 2]] as const)
    m.fixture('fixture/sign', ...spot(m, x, y), {
      name: L('A white pennant', '白色三角旗'),
      props: {
        text: ['A white pennant on a lance-shaft, a ring of thorns stitched on it. It has been mended many times, in small, even stitches.', 'The same white pennant, greyer. The stitches here are larger, and they stop halfway up.', 'Rags on a lance-shaft. A needle is still stuck through one of them, its thread wound round and round it.'][n],
        text_zh: ['枪杆上挂着一面白色三角旗，绣着一圈荆棘。旗面补过很多次，针脚细密整齐。', '同样的白旗，颜色更灰。这一面的针脚大了许多，补到一半就停了。', '枪杆上只剩几条破布。其中一条上还别着一根针，线在针上一圈一圈地缠着。'][n],
      },
    })
  // what a traveller might lay at each: a fallen pilgrim's hat, a plaited cord by a post, a loaf left in an abandoned
  // cart, an old helm, a candle at a cairn (demo PR1 takes each with F and lays it with G)
  m.item({ form: 'item/clothing/hat', material: 'cloth', name: L("A pilgrim's hat", '朝圣者的帽子') }, ...spot(m, 9, 16))
  m.item({ form: 'item/material/grass', name: L("A penitent's plaited cord", '苦修者编的草绳') }, ...spot(m, 15, 9))
  const cart = spot(m, 38, 17)
  m.fixture('fixture/furniture/cart', ...cart, { name: L("An abandoned pilgrims' cart", '被丢下的朝圣者推车') })
  m.item({ form: 'item/food/bread', name: L("A pilgrim's loaf", '朝圣者的面包') }, ...cart)
  m.item({ form: 'item/armor/helmet', material: 'iron', name: L('A dented helm', '一顶凹陷的头盔') }, ...spot(m, 34, 9))
  m.item({ form: 'item/light/candle' }, ...spot(m, 47, 15))
  // the penitent's camp off the road: his fire on a scrape of bare earth
  m.organic(32, 17, 2.4, 1.6, 'dirt', { only: grassy })
  m.fixture('fixture/light/campfire', ...spot(m, 33, 17), { statuses: { lit: -1 } })
  m.anchor('ezra.road', ...spot(m, 31, 14, true))
  m.anchor('ezra.camp', ...spot(m, 32, 18, true))
  m.regions.penitent = [27, 12, 9, 8]
  // the woods round it and the coppices in it, never on the road, the abbey's way, the fields or the camp
  const keep = (x: number, y: number) => m.near(x, y, (t) => ROADS.has(t), 2) || m.get(x, y) === 'water' || inRect([2, 0, 17, 9], x, y) || inRect([47, 15, 9, 8], x, y) || inRect([27, 12, 9, 8], x, y) || m.entities.some((e) => e.place.on === 'tile' && Math.abs(e.place.x - x) <= 1 && Math.abs(e.place.y - y) <= 1)
  woods(m, keep, { depth: 2.5, swell: 2, pines: 0.35, seed: 291 })
  for (let y = 3; y < m.h - 3; y++) for (let x = 3; x < m.w - 3; x++) if (!keep(x, y) && noise(x, y, 4, 292) > 0.78 && !m.near(x, y, (t) => ROADS.has(t), 3)) m.set(x, y, noise(x, y, 3, 293) < 0.4 ? 'pine' : 'tree')
  for (const [x0, x1, y] of [[3, 8, 16], [17, 24, 17], [36, 40, 8]] as const) for (let x = x0; x <= x1; x++) if (m.free(x, y) && grassy(m.get(x, y))) m.set(x, y, 'bush')
  seal(m, ways(m, { west: P.west, east: P.east, north: P.north }))
  // the road's dangers: wolves, and the dead who walk it at night
  m.creature('beast/wolf', ...spot(m, 21, 19, true), HUNT())
  m.creature('beast/wolf', ...spot(m, 47, 5, true), HUNT())
  for (const [name, x, y] of [['decor_hay', 7, 2], ['decor_hay', 13, 4], ['decor_stones', 18, 8], ['decor_cart', 49, 19]] as [string, number, number][]) decor(m, name, x, y)
  lay(m, 'item/material/stick', 2, [4, 14, 10, 6])
  m.sprinkle('fixture/nature/flowers', 0.12, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'flags', 2))
  m.sprinkle('fixture/nature/tuft', 0.04, (x, y, t) => t === 'drygrass' && !m.near(x, y, (u) => ROADS.has(u), 1))
  m.sprinkle('fixture/nature/leaves', 0.14, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'tree' || u === 'pine'))
  wildFloor(m, 1, (x, y) => m.near(x, y, (t) => ROADS.has(t), 1))
  m.appear = [...GROUND_YIELD, appears('actor/creature/undead/zombie', ['grass'], 2, 2400, { ai: { behaviour: 'melee', temper: 'aggressive', sight: 5 } })]
  return m
}

// =================================================================== Briarmoor Abbey

/**
 * Briarmoor Abbey, the Briar Knights' house, gone to ruin (the redo of 2026-10-27): the way up from the road through the gate's lone arch in
 * the close's broken wall; the cloister in the middle, its arcade standing along the north, its other ranges fallen to
 * stumps of wall and column round the thorn yard, the young knight's statue in it; the chapter hall west of it, still
 * roofed; the church east, roofless but for the chancel over the crypt; the tower's stump, the order's memorial stones
 * and the gardener's grave in the south-west; old flags under the weeds, fallen stones and columns, the woods coming in.
 */
export const ABBEY = { hall: [5, 8] as const, church: [26, 9] as const, garth: [14, 9, 11, 8] as const }

export function buildAbbey(): MapBuilder {
  const P = PILGRIM.abbey
  const m = new MapBuilder('abbey', L('Briarmoor Abbey'), 'wild', P.w, P.h, 'grass', 'ruins', 'outdoor', 'frostfang')
  m.gearLevel = 4
  // the close: its old paving under weeds, dry grass and bare earth over the rest
  for (let y = 3; y < 24; y++)
    for (let x = 4; x < 37; x++) {
      const n = noise(x, y, 4, 301)
      m.set(x, y, n > 0.62 ? 'drygrass' : n < 0.3 ? 'dirt' : 'grass')
    }
  // the way up from the road, through the gate, to the cloister and on to the hall and the church
  m.path([[20, 29], [20, 24], [20, 18]], 'path', 2, { edge: 'dirt', edgeP: 0.3 })
  m.rect(19, 27, 3, 3, 'path')
  m.path([[20, 21], [12, 21], [6, 17], [6, 12]], 'flags', 1)
  m.path([[20, 21], [29, 20], [34, 17], [34, 15]], 'flags', 1)
  // the cloister: the walk of flags round the thorn yard, the yard gone to weeds
  const [gx, gy, gw, gh] = ABBEY.garth
  m.rect(gx, gy, gw, gh, 'flags')
  m.organic(gx + gw / 2, gy + gh / 2, gw / 2 - 1.5, gh / 2 - 1.5, 'drygrass', { rough: 0.35, only: (t) => t === 'flags' })
  m.building('ab_arcade_x6', 14, 8)
  m.building('ab_arcade_x6', 20, 8)
  m.building('ab_wall_y4', 13, 10)
  m.building('ab_wall_y3', 25, 10)
  m.building('ruin_wall_x4', 14, 17)
  m.building('ruin_column_0', 19, 17)
  m.building('ruin_column_2', 21, 17)
  m.building('ruin_wall_x3', 23, 17)
  // the chapter hall west of it, the church east, the tower's stump
  m.building('ab_hall', ...ABBEY.hall, ['hall'])
  m.building('ab_church', ...ABBEY.church, ['crypt'])
  m.building('ruin_tower', 31, 18)
  // the close's broken wall: the gate's lone arch on the way up, its runs fallen in places
  m.building('ruin_arch', 19, 24)
  for (const [name, x, y] of [['ruin_wall_x6', 5, 24], ['ruin_wall_x4', 13, 24], ['ruin_wall_x6', 23, 24], ['ruin_wall_x3', 32, 24], ['ab_wall_y5', 3, 5], ['ab_wall_y4', 3, 14], ['ab_wall_y3', 3, 20], ['ab_wall_y5', 37, 4], ['ab_wall_y4', 37, 16]] as [string, number, number][]) m.building(name, x, y)
  // rubble where the walls came down
  for (const [x, y] of [[12, 24], [30, 25], [3, 18], [38, 13], [9, 15]] as const) m.set(x, y, 'rock')
  // the Briar Knights' memorial stones (their dead lie in the ossuary under Thornwood Hollow: hollow.ts), a gardener's grave
  const stones: [string, string, string, string][] = [
    ['A memorial stone', '纪念碑', 'BROTHER ODO OF THE BRIAR, who held the gate at Varn for three days. He lies with his brothers under Thornwood Hollow; his name is kept here.', 'BROTHER ODO OF THE BRIAR, who held the gate at Varn for three days. He lies with his brothers under Thornwood Hollow; his name is kept here.'],
    ['A memorial stone', '纪念碑', 'SISTER AGNA OF THE BRIAR, who carried water to both armies. She lies with the order under Thornwood Hollow; her name is kept here.', 'SISTER AGNA OF THE BRIAR, who carried water to both armies. She lies with the order under Thornwood Hollow; her name is kept here.'],
    ['A memorial stone', '纪念碑', 'BROTHER TOMAS OF THE BRIAR, sworn brother to the Captain, sent down to ward the order\'s dead under the hollow. No year of death is cut on the stone.', 'BROTHER TOMAS OF THE BRIAR, sworn brother to the Captain, sent down to ward the order\'s dead under the hollow. No year of death is cut on the stone.'],
    ['A grave in the yard', '院中的墓', 'BROTHER GILES, GARDENER, buried in the yard he kept. Rose canes, long dead, are still tied to the stone.', '园丁吉尔斯修士，葬于他照料过的院中。墓碑上还绑着几根早已枯死的玫瑰枝。'],
  ]
  stones.forEach(([en, zh, text, textZh], i) => m.fixture('fixture/sacred/gravestone', ...spot(m, 6 + i * 2, 19), { name: L(en, zh), props: { text, text_zh: textZh } }))
  m.set(12, 18, 'tree')
  // (an altar's plinth: a statue would look like a waypoint's, and those are the waypoints' alone)
  m.fixture('fixture/sacred/altar', ...spot(m, 19, 12), {
    name: L('The statue in the thorn yard', '荆棘院中的雕像'),
    tags: ['readable'],
    props: { text: 'A young knight on one knee before a child, holding out a wooden horse he has mended. The face is worn smooth by hands. The plinth: GAVREL, ON THE DAY HE WAS MADE A KNIGHT OF THE BRIAR.' },
  })
  for (const [x, y] of [[16, 11], [23, 14], [17, 20]] as const) m.fixture('fixture/nature/briar', ...spot(m, x, y), { name: L('Thorns in the yard', '院子里的荆棘') })
  // its dead: monks who would not lie down
  m.creature('undead/skeleton', ...spot(m, 15, 13, true), HUNT())
  m.creature('undead/skeleton', ...spot(m, 27, 18, true), HUNT())
  m.creature('undead/ghost', ...spot(m, 22, 10, true), { behaviour: 'ranged', temper: 'aggressive', sight: 6, leash: 6 })
  m.regions.yard = [10, 6, 20, 14]
  // the woods outside the close, dark with pines, thorn thickets at its wall's foot
  const close = (x: number, y: number) => inRect([3, 3, 35, 23], x, y)
  const keep = (x: number, y: number) => close(x, y) || m.near(x, y, (t) => t === 'path', 2)
  woods(m, keep, { depth: 3, swell: 2.5, pines: 0.6, seed: 301 })
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (!keep(x, y) && grassy(m.get(x, y)) && noise(x, y, 3, 302) > 0.55) m.set(x, y, 'bush')
  seal(m, ways(m, { south: P.south }), 'pine')
  // what the years left: fallen columns and a saint, stones, the yard's thorns and weeds
  for (const [name, x, y] of [['decor_column_fallen', 26, 21], ['decor_statue_fallen', 9, 22], ['decor_column_fallen', 15, 15], ['decor_stones', 24, 16], ['decor_stones', 13, 20], ['decor_bones', 29, 16]] as [string, number, number][]) m.building(name, x, y)
  m.sprinkle('fixture/nature/tuft', 0.12, (x, y, t) => t === 'drygrass' && close(x, y))
  m.sprinkle('fixture/nature/leaves', 0.1, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'tree' || u === 'pine' || u === 'bush'))
  wildFloor(m, 1.4, (x, y) => m.near(x, y, (t) => t === 'door', 1))
  m.appear = GROUND_YIELD
  return m
}

/** The chapter hall: the Briar Knights' roll on the knights' table under its canopy, the scriptorium west, and Gavrel's narrow cell east. */
export function buildAbbeyHall(): MapBuilder {
  const { m, P } = flHouse('abhall', 'abbey.hall', 'The Chapter Hall', '骑士团大厅', 'floor_stone', ['scriptorium', 'hall', 'cell'], { music: 'dungeon' })
  m.zone = 'combat'
  m.gearLevel = 4
  const H = P.hall
  const mx = H.x + 5
  m.rect(mx - 1, H.y + 3, 3, H.h - 3, 'carpet')
  m.fixture('fixture/furniture/table', mx, H.y + 2, {
    name: L('The Roll of the Briar Knights'),
    tags: ['readable'],
    props: { text: 'The knights of the Briar, forty-one names in forty-one hands. The last is written larger, the ink still black: GAVREL, KNIGHT-CAPTAIN — FIRST WARDEN OF THE QUEEN. Beside many of the names a later hand has added a small thorn and three words: TO THE RIVER. No knight was made after him; the rest of the page is empty.' },
  })
  for (const x of [mx - 2, mx + 2]) m.fixture('fixture/furniture/chair', x, H.y + 2)
  for (const x of [H.x, H.x + H.w - 1]) m.fixture('fixture/light/brazier', x, H.y, { statuses: { lit: -1 } })
  m.fixture('fixture/container/bookshelf', H.x + 2, H.y, { name: L("The Briar Knights' books") })
  m.fixture('fixture/furniture/rack', H.x + H.w - 3, H.y, { name: L('Empty weapon racks', '空了的兵器架') })
  m.building('decor_stones', H.x + 1, H.y + 7)
  m.building('decor_bones', H.x + H.w - 2, H.y + 6)
  m.creature('undead/skeleton', mx, H.y + 5, HUNT(4))
  // the scriptorium, west: Solmere's writ recalling him on its desk, read and never answered
  const S = P.scriptorium
  m.fixture('fixture/furniture/table', S.x + 2, S.y + 2, { name: L('The scriptorium desk', '缮写室书桌') })
  m.item({ form: 'item/document/writ_of_relief' }, S.x + 2, S.y + 3)
  m.building('decor_sacks', S.x, S.y + 5)
  // his cell, east: a cot, a desk, his journal in four leaves
  const C = P.cell
  m.fixture('fixture/furniture/bed', C.x + 5, C.y + 1, { name: L("Gavrel's cot") })
  m.fixture('fixture/furniture/table', C.x + 2, C.y + 3, { name: L("Gavrel's desk") })
  const pages: string[] = [
    'I. Mended the miller\'s girl\'s kite today. She told me knights do not mend kites. I told her this one does. — G.',
    'II. The Queen has named me her First Warden. The Captain says it is an honour. My brother Hugh says it is a sentence. I will hold for as long as she needs me. — G.',
    'III. The nineteenth winter. Another writ from Solmere. I read it and put it with the others. The thorns are into the bone now. Today I could not remember Hugh\'s face, and I wept, and then I could not remember why I wept. What I carried out of the city is safe. I will not write where, even here. — G.',
    'IV. Hold the river. Hold. Hold. Not to him. Hold. Hold. Hold. Hold.',
  ]
  pages.forEach((en, i) => m.item({ form: 'item/document/letter', name: L(`Gavrel's Journal, Leaf ${['I', 'II', 'III', 'IV'][i]}`), props: { text: en, text_zh: en } }, ...spot(m, C.x + 1 + (i % 2) * 2, C.y + 2 + Math.floor(i / 2) * 2)))
  m.regions.cell = [C.x, C.y, C.w, C.h]
  return m
}

/** The way from the crypt's head into the priors' tomb (docs/boss-rooms.md): the arch's cells in the crypt, the tomb's door. */
const TOMB_ARCH = (() => {
  const a = HALLS.abcrypt.parts.arch
  return Array.from({ length: a.w }, (_, i): [number, number] => [a.x + i, a.y])
})()
const TOMB_DOOR = HALLS.abtomb.doors[0]

/**
 * The crypt under the abbey church: its vault on two rows of pillars, the abbey's priors in their niches along it (the
 * Briar Knights lie in the ossuary under Thornwood Hollow: hollow.ts), and at its head the arch into the priors' tomb,
 * its fog across it (docs/boss-rooms.md: Prior Wendel's room, buildAbbeyTomb).
 */
export function buildAbbeyCrypt(): MapBuilder {
  const { m, P } = flHouse('abcrypt', 'abbey.crypt', 'The Abbey Crypt', '修道院地下墓室', 'floor_stone', ['vault', 'entry'], { music: 'crypt', light: 'dark' })
  m.zone = 'combat'
  m.gearLevel = 5
  const V = P.vault
  for (const y of [V.y + 2, V.y + 5]) for (const x of [V.x + 3, V.x + 7, V.x + 14, V.x + 18]) m.building('crypt_pillar', x, y)
  for (const [x, y] of [[V.x, V.y], [V.x + V.w - 1, V.y], [V.x, V.y + V.h - 1]] as const) m.fixture('fixture/light/brazier', x, y, { statuses: { lit: -1 } })
  for (const x of [V.x + 1, V.x + 3, V.x + 5, V.x + V.w - 6, V.x + V.w - 4, V.x + V.w - 2]) m.fixture('fixture/sacred/gravestone', x, V.y + V.h - 1, { name: L("A prior's niche", '院长的壁龛'), props: { text: 'The niche of a prior of the abbey, a ring of thorns carved over it. The name has been chiselled off and cut again lower down, smaller. Below that it has been cut a third time.', text_zh: '修道院一位院长的壁龛，上方刻着一圈荆棘。名字被凿掉过，在下面重刻了一遍，字小了些；再往下，又刻了第三遍。' } })
  m.creature('undead/skeleton', V.x + 5, V.y + 3, HUNT(4))
  m.creature('undead/ghost', V.x + 16, V.y + 3, { behaviour: 'ranged', temper: 'aggressive', sight: 5, leash: 5 })
  // the arch at its head into the priors' tomb, its fog across it: through it one is sealed in with the last keeper
  for (const [x, y] of TOMB_ARCH) {
    m.set(x, y, 'door')
    m.portal(x, y, 'abbey.tomb', TOMB_DOOR[0], TOMB_DOOR[1] - 1, L("The Priors' Tomb", '院长墓穴'))
    m.fixture('fixture/fog', x, y, { name: L("The keeper's fog", '看守的雾门'), props: { boss: 'wendel', interior: 'abbey.tomb', interiorX: TOMB_DOOR[0], interiorY: TOMB_DOOR[1] - 1 } })
  }
  for (const [x, y, w] of [[V.x + 1.5, V.y + 0.5, 3], [V.x + V.w - 1.5, V.y + 0.5, 3], [TOMB_ARCH[0][0] + 1, V.y + 0.5, 3]] as const) m.lights.push({ x, y, w, h: w * 0.75, color: x > V.x + 5 && x < V.x + V.w - 5 ? '#fff0c8' : '#ff9a4a', shape: 'glow', when: 'always', strength: 0.35 })
  wildFloor(m, 1, (x, y) => inRect([TOMB_ARCH[0][0] - 1, V.y, TOMB_ARCH.length + 2, 2], x, y) || inRect([P.entry.x, P.entry.y - 1, P.entry.w, P.entry.h + 1], x, y), [0, 0, m.w, m.h], 'barrow')
  return m
}

/**
 * The priors' tomb, Prior Wendel's room behind its fog (docs/boss-rooms.md §4.3): the abbey's last keeper on the dais at
 * its head under the wall of bones, braziers at its corners; one comes in at its foot, sealed behind while he stands.
 */
export function buildAbbeyTomb(): MapBuilder {
  const { m, P } = flHouse('abtomb', 'abbey.tomb', "The Priors' Tomb", '院长墓穴', 'floor_stone', ['tomb', 'entry'], { music: 'crypt', light: 'dark', floors: [['dais', 'flagstone']] })
  m.zone = 'combat'
  m.gearLevel = 5
  const T = P.tomb
  for (const [x, y] of [[T.x, T.y], [T.x + T.w - 1, T.y], [T.x, T.y + T.h - 1], [T.x + T.w - 1, T.y + T.h - 1]] as const) m.fixture('fixture/light/brazier', x, y, { statuses: { lit: -1 } })
  m.rect(T.x + 7, T.y + 1, 4, T.h - 1, 'carpet')
  // the abbey's last keeper: Prior Wendel, who keeps the order's seal from Solmere
  const abbot = m.creature('undead/skeleton', T.x + 9, T.y + 1, { id: ABBOT_ID, sight: 5, leash: 6, loot: [ORDER_SEAL] })
  abbot.name = L('Prior Wendel, the Last Keeper', '最后的看守·温德尔院长')
  abbot.tags = ['boss']
  abbot.props = { hp: 90, maxHp: 90, atk: 5, def: 2, trophyChance: 0 }
  m.regions.tomb = [T.x, T.y, T.w, T.h]
  // its door back down to the crypt, the fog across it (sealed while he stands)
  m.portal(TOMB_DOOR[0], TOMB_DOOR[1], 'abbey.crypt', TOMB_ARCH[0][0], TOMB_ARCH[0][1] + 1, L('The Abbey Crypt', '修道院地下墓室'))
  m.fixture('fixture/fog', TOMB_DOOR[0], TOMB_DOOR[1], { name: L("The keeper's fog", '看守的雾门'), props: { boss: 'wendel' } })
  for (const [x, y, w] of [[T.x + 9, T.y + 1, 5], [T.x + 1, T.y + 1, 3], [T.x + T.w - 1, T.y + 1, 3]] as const) m.lights.push({ x, y, w, h: w * 0.75, color: '#ff9a4a', shape: 'glow', when: 'always', strength: 0.4 })
  wildFloor(m, 1.2, (x, y) => inRect([T.x + 6, T.y, 6, 4], x, y) || inRect([P.entry.x, P.entry.y - 1, P.entry.w, P.entry.h + 1], x, y), [0, 0, m.w, m.h], 'barrow')
  return m
}

// =================================================================== the Field of Oaths

/**
 * The Field of Oaths (the redo of 2026-10-27): a wide field of dry grass where the Briar Knights swore to hold the river
 * with Gavrel; the road across it; their stones in two rows either side, each carved as a knight on one knee, the ground
 * worn bare before each; the knight's straw "subjects" in their rows between, facing east; heather and stones at its edges, birch and
 * pine round it, and a wayside cross at its head.
 */
export function buildField(): MapBuilder {
  const P = PILGRIM.field
  const m = new MapBuilder('kneelfield', L('The Field of Oaths'), 'wild', P.w, P.h, 'grass', 'kneelfield', 'outdoor', 'frostfang')
  m.gearLevel = 4
  // the field: dry grass in its middle, heather where it rises at the edges
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) {
      const d = Math.hypot((x - 22) / 17, (y - 12) / 9.5) + (noise(x, y, 4, 311) - 0.5) * 0.35
      if (d < 1) m.set(x, y, 'drygrass')
      else if (d < 1.25 && noise(x, y, 3, 312) > 0.55) m.set(x, y, 'flowers')
    }
  m.path([[0, 12], [10, 12], [22, 11], [34, 12], [43, 12]], 'path', 3, { edge: 'dirt', edgeP: 0.1 })
  // the wayside cross at the field's head, on a little apron of flags, the worn way up to it
  m.rect(21, 3, 3, 2, 'flags')
  m.path([[22, 10], [22, 5]], 'dirt', 1)
  decor(m, 'decor_waycross', 22, 3)
  // where the Briar Knights swore to hold the river with him: their stones, each carved as a knight on one knee, each
  // with a name and a year after the Sundering; then his "subjects", of straw
  const names: string[] = [
    'Aelis of Varrow, knight of the Briar. She swore to hold the river with him. The first year after the Sundering.',
    'Brother Hal, of the abbey. He swore to hold the river with him. The second year.',
    'Wenna of the Salt Coast, knight of the Briar. She swore to hold the river, and held the ford alone for a night. The fourth year.',
    'Unnamed. A spur, and a child\'s shoe.',
    'Odile the Smith. She swore to hold the river, and mended his armour until she died. The seventh year.',
    'Corin, sent from Solmere with the Regent\'s writ. He stayed, and swore to hold the river. The ninth year.',
    'Petra and Joan, sisters, from the farms below the abbey. Both swore to hold the river.',
    'The latest stone. The carving is fresh. The name is not cut yet.',
  ]
  names.forEach((en, i) => {
    const [x, y] = [10 + (i % 4) * 7, i < 4 ? 7 : 17]
    m.rect(x - 1, y + 1, 3, 1, 'dirt')
    m.fixture('fixture/sacred/gravestone', ...spot(m, x, y), { name: L('An oath stone'), props: { text: `A stone carved as a knight on one knee. ${en}`, text_zh: `A stone carved as a knight on one knee. ${en}` } })
  })
  for (const [x, y] of [[16, 9], [18, 9], [20, 9], [26, 15], [28, 15], [30, 15]] as const)
    m.fixture('fixture/scarecrow', ...spot(m, x, y), { name: L('A kneeling straw knight'), tags: ['readable'], props: { text: 'A soldier\'s coat stuffed with straw, bent at the knees and tied there with briar. It faces east, in a row with the others. The briar is still green.', text_zh: 'A soldier\'s coat stuffed with straw, bent at the knees and tied there with briar. It faces east, in a row with the others. The briar is still green.' } })
  for (const [x, y] of [[36, 8], [37, 16], [12, 15]] as const) m.fixture('fixture/nature/briar', ...spot(m, x, y), { name: L("The knight's thorns", '骑士的荆棘') })
  m.fixture('fixture/sign', ...spot(m, 40, 10), { props: { text: 'THE EASTMARCH. THE RIVER IS HELD.' } })
  m.regions.field = [6, 4, 32, 16]
  // birch and pine round it, outcrops of grey stone in its corners
  const keep = (x: number, y: number) => m.near(x, y, (t) => t === 'path' || t === 'flags', 2) || inRect([7, 4, 30, 16], x, y)
  woods(m, keep, { depth: 2.5, swell: 2.2, pines: 0.5, seed: 311 })
  for (const [cx, cy, rx, ry] of [[4, 4, 1.8, 1.2], [39, 19, 2, 1.3], [5, 19, 1.4, 1], [38, 4, 1.5, 1]] as const) m.organic(cx, cy, rx, ry, 'rock', { only: (t) => grassy(t) || t === 'flowers' })
  seal(m, ways(m, { west: P.west, east: P.east }))
  m.sprinkle('fixture/nature/tuft', 0.06, (x, y, t) => t === 'drygrass' && !m.near(x, y, (u) => u === 'path' || u === 'dirt', 1))
  m.sprinkle('fixture/nature/leaves', 0.12, (x, y, t) => grassy(t) && m.near(x, y, (u) => u === 'tree' || u === 'pine'))
  wildFloor(m, 1, (x, y) => m.near(x, y, (t) => t === 'path', 1))
  m.appear = [...GROUND_YIELD, appears('actor/creature/undead/ghost', ['drygrass'], 1, 3600, { ai: { behaviour: 'ranged', temper: 'aggressive', sight: 5 } })]
  return m
}

// =================================================================== the scenes

export const PILGRIMAGE_STORY: StepDef[] = [
  {
    // The Rest: the Order's priest has been waiting for the Crownseeker the writ named (not once the knight has fallen:
    // the road the oath was for is behind them — `rest_after` greets them then).
    id: 'rest_arrival',
    when: { map: 'waystation', facts: { [CH1.letter]: 1, [CH1.knight]: 0 } },
    script: [
      say('npc.caius', 'You must be the one the Regent\'s writ named, who walks with a fallen star. Welcome to the Wardens\' Rest. I am Father Caius. The Radiant Order keeps me here, at the Regent\'s charge, to see the Crownseekers on their way east.', undefined, 'happy'),
      say('npc.caius', 'Before the road, the oath. Come into the chapel and kneel at the altar of the five facets. Every Crownseeker Solmere has sent east swore the Regent\'s oath there first.'),
      { fact: PILGRIMAGE.arrived, value: 1 },
    ],
  },
  {
    // The oath: at the altar of the five facets, the priest takes the Crownseeker through the Regent's oath and the five
    // Regalia, as Solmere names them (docs/sunshard/STORY.md §2: the first layer), and the Crownseeking as it is
    // proclaimed. Not past the knight.
    id: 'pilgrim_oath',
    when: { map: 'waystation.chapel', region: 'altar', after: 'rest_arrival', facts: { [CH1.knight]: 0 } },
    script: [
      say('npc.caius', 'Kneel, and say it after me. I go east for the Crown and for the realm, and I will bring home what was taken from it.'),
      say('npc.caius', 'The Diadem, which flew to the Eastmarch. The Ember Chain, to the Scarred March. The Scales, to the Golden Reach.'),
      say('npc.caius', 'The Lantern, to the Mirewood. And the fifth, to the Silverspire Heights. When the five are whole again in Solmere, the Dimming shall end.'),
      say('npc.caius', 'Rise. There are five beacons on the road east, the old Queen\'s, one for each of the Regalia. They have been dark since the Sundering Night. Lay at each what is cut on it, and it will light. Halfway along, a path goes north to the old abbey. The knight is further east.'),
      say('npc.caius', 'The Warden of the Eastmarch has held that road for nineteen years. The Regent asks you to overcome him and bring home the Briar Diadem, the first of the five. ...Solmere has written to him more than once. He never answered. That is not a Crownseeker\'s concern.', undefined, 'sad'),
      say('pip', 'Written to him? What did they want?', undefined, 'surprised'),
      { fact: PILGRIMAGE.oath, value: 1 },
    ],
  },
  // ---- the Order's answer to one's faith (content faith.ts): blessed by its priest, or watched by the man in grey
  {
    // The devout: the priest sees one who prays as if it mattered, and gives what the Order gives its own.
    id: 'caius_blessing',
    when: { map: 'waystation', after: 'pilgrim_oath', props: { faith: { gte: FAITH.devout } } },
    script: [
      say('npc.caius', 'I have seen you pray. You say every word the way you were taught. Not many still do. — Take these: holy water, blessed in the Crown Chapel at Solmere. The dead on the road will keep away from it.', undefined, 'happy'),
      { give: 'item/vessel/flask/holy_water', count: 2 },
      say('npc.caius', 'One thing more. The Briar Knights kept their papers in the abbey\'s chapter hall. If you come across a writ from Solmere there, a recall under the Regent\'s seal, come back and tell me what became of it. I was told not to ask about it.', undefined, 'sad'),
      { fact: CHURCH.blessed, value: 1 },
    ],
  },
  {
    // The unbeliever: word of it has reached the Rest before them.
    id: 'caius_cold',
    when: { map: 'waystation', after: 'pilgrim_oath', props: { faith: { lte: FAITH.doubter } } },
    script: [
      say('npc.caius', 'I am told you say the Fallen Star was only a stone that fell. And yet you walk to the Warden with the Regent\'s writ in your bag.', undefined, 'angry'),
      say('npc.caius', 'Go on, then. But the Rest\'s blessing is for those who keep the faith, and I will not pretend you are one of them.'),
      say('pip', 'Come on. We can find the beacons without him.', undefined, 'shy'),
      { fact: CHURCH.shunned, value: 1 },
    ],
  },
  {
    // The man in grey (Corvin) finds one who has stopped believing the Order: he has things to say to such a one.
    id: 'grey_man_doubter',
    when: { map: 'pilgrimway', after: 'way_first', props: { faith: { lte: FAITH.doubter } } },
    script: [
      { place: 'npc.severin', map: 'pilgrimway', x: 44, y: 12 },
      say('npc.severin', 'You no longer pray at their altars. Then I will say this once.'),
      say('npc.severin', 'Leave the beacons on this road dark. Walk past them.'),
      say('npc.severin', 'In the abbey north of the road there is a letter from Solmere that was never answered. Read it.'),
      { move: 'npc.severin', x: 54, y: 12 },
      { place: 'npc.severin', map: 'offstage', x: 2, y: 2 },
      { fact: CHURCH.greyman, value: 1 },
    ],
  },
  {
    // The Rest once the knight has fallen: the priest greets the one who came back from him (or comes by first after him).
    id: 'rest_after',
    when: { map: 'waystation', facts: { [CH1.knight]: { ne: 0 } } },
    script: [
      say('npc.caius', 'You have come from the east. ...Then it is done, and the road is open. Solmere will have the Diadem, the first of the five.', undefined, 'sad'),
      say('npc.caius', 'Stay as long as you need, Crownseeker. The chapel is always open.'),
    ],
  },
  {
    // First onto the Old Crown Road: the knight's mark on every signpost.
    id: 'way_first',
    when: { map: 'pilgrimway' },
    say: L('There are white flags all along this road. Whose are they?', '这条路上插着好多白旗。是谁插的呢？'),
  },
  {
    // The penitent on the road: penance as the Order teaches it, taken on oneself.
    id: 'penitent',
    when: { map: 'pilgrimway', region: 'penitent' },
    script: [
      say('npc.ezra', '(A man kneels by the road, his back bare, a cord in his hand. He strikes himself once, steadily, and looks up.)', '（路边跪着一个男人，赤着脊背，手里握着一根绳子。他稳稳地抽了自己一下，抬起头来。）'),
      say('npc.ezra', 'Don\'t be frightened, traveller. I am Brother Ezra. The Order teaches that the days grow short because the Wardens broke faith with the Crown. I take a little of their debt on myself, a stroke at a time. It is what I can do.'),
      say('npc.ezra', 'Once I went as far as the field of stones. The knight was there, mending one of his flags. When he saw me his hands stopped, and he stood a long while holding the needle. Then he asked me whether Solmere had sent me. I said no one had sent me, and he told me to go home. I came back.'),
    ],
  },
  {
    // The five beacons lit: the road answers, and the way to the abbey shows itself.
    id: 'shrines_lit',
    when: { map: 'pilgrimway', facts: Object.fromEntries(WAYSHRINES.map((s) => [shrineFact(s.id), 1])) },
    script: [
      say('player', '(The fifth cup kindles. All along the road the five beacons burn at once, small and steady, and the middle one throws its light up the path north, to the abbey.)'),
      say('pip', 'The Diadem\'s one is cold. Colder than the others... — Look, the light goes up that path. That\'s the abbey the priest told us about.', undefined, 'shy'),
      { fact: PILGRIMAGE.shrines, value: 1 },
    ],
  },
  {
    // The abbey's yard: the statue of the young knight.
    id: 'abbey_yard',
    when: { map: 'abbey', region: 'yard' },
    say: L('There\'s a statue in the middle of the yard. It\'s the only thing here nobody knocked down.', '院子正中间有一座雕像。这里只有它没被推倒。'),
  },
  {
    // His cell: the journal, leaf by leaf.
    id: 'alberic_cell',
    when: { map: 'abbey.hall', region: 'cell' },
    say: L('This room is tiny, and so cold. There are pages lying by the desk.', '这间屋子好小，也好冷。书桌旁边掉了几页纸。'),
  },
  {
    // The writ: Solmere's recall, read and never answered.
    id: 'writ_found',
    when: { carrying: WRIT },
    script: [
      say('player', '(A writ under the Regent\'s wax seal, addressed to Ser Gavrel, First Warden. It reads: by order of the Lord Regent, he is recalled to Solmere, and is to bring the Briar Diadem with him to the Crown Chapel.)'),
      say('player', '(The seal has been broken. The writ was read, folded small, and kept. No answer went back. On the back is one line, in a hand that shakes: "Not to him.")'),
      say('pip', 'He never answered it... Let\'s take it with us.'),
      { fact: PILGRIMAGE.writ, value: 1 },
    ],
  },
  {
    // The crypt: the last keeper rises.
    id: 'crypt_keeper',
    when: { map: 'abbey.tomb', region: 'tomb' },
    script: [
      say(ABBOT_ID, 'Who comes for the seal? ...Another of Solmere\'s. The Diadem stays with him, and the seal stays with me. We hold, that others need not.', undefined, 'angry'),
      say('pip', 'He\'s getting up! Watch out!', '他站起来了！小心！', 'angry'),
    ],
  },
  {
    // The Briar Knights' seal in hand: the thorns of the Eastmarch will know it.
    id: 'order_seal',
    when: { carrying: ORDER_SEAL },
    script: [
      say('player', '(A bronze seal: a ring of briar, and inside it a knight on one knee before a child. Round the rim: WE HOLD, THAT OTHERS NEED NOT. The bronze is warm in the hand.)'),
      { fact: PILGRIMAGE.seal, value: 1 },
    ],
  },
  {
    // The Field of Oaths: the stones of the knights who swore to hold the river with him.
    id: 'kneelfield_arrival',
    when: { map: 'kneelfield' },
    script: [
      say('player', '(Two rows of stones stand across the field, each carved as a knight on one knee, each with a name and a year cut in it. Between the rows, straw figures in soldiers\' coats are tied kneeling, all facing east.)'),
      say('pip', 'Oh! That straw one moved — no. It was only the wind.', '啊！那个稻草人动了——不对，是风。', 'surprised'),
      { fact: PILGRIMAGE.field, value: 1 },
    ],
  },
  {
    // The Field of Oaths to the devout: one of these stones came from Solmere.
    id: 'kneelfield_devout',
    when: { map: 'kneelfield', after: 'kneelfield_arrival', props: { faith: { gte: FAITH.devout } } },
    say: L('This stone says Corin was "sent from Solmere with the Regent\'s writ", and stayed. Then he stopped at the Rest too, didn\'t he?'),
  },
  {
    // The Field of Oaths to the unbeliever: no god asked this of them.
    id: 'kneelfield_doubter',
    when: { map: 'kneelfield', after: 'kneelfield_arrival', props: { faith: { lte: FAITH.doubter } } },
    say: L('You don\'t believe any of it. So why did they all swear to him?'),
  },
]
void ALBERIC_ID
