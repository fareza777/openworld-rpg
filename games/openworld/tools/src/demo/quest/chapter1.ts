// Chapter 1, the Ember Letter (docs/sunshard/CHAPTER-1.md; mechanics: docs/chapter-1.md): what the chapter adds to
// the maps — Emberwick's shard altar and statue, Pell's chalk drawings, the waypoint statues, the knight's ring of thorns
// on the Eastmarch Road — and its scenes: the night of the flame, the Herald, the knight, the Diadem, the return.
// The quests and objectives are content (content/src/chapter1.ts).

import type { Entity, StepDef } from '@openworld/engine'
import { ALBERIC_CAMPAIGN, ALBERIC_ID, CH1, CHAPTER_TWO, HAVEN, createBoss } from '@openworld-game/content'

const HAVEN_MAP = HAVEN.map
import { L } from '../kit.ts'
import { MapBuilder } from '../builder.ts'
import { KINGDOM } from './kingdom.ts'

const say = (who: string, en: string, zh?: string, mood?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'shy') => ({ say: who, text: L(en, zh), ...(mood && { mood }) })

/** Where the chapter puts things (map coordinates). */
export const CH1_AT = {
  village: { shrine: [23, 16] as const, statue: [24, 14] as const, drawing: [20, 16] as const, statueStone: [30, 19] as const, severin: [26, 18] as const, courier: [24, 18] as const },
  ford: { stone: [17, 13] as const, drawing: [27, 21] as const, briars: [[29, 21], [35, 21]] as const },
  foot: { drawing: [22, 13] as const },
  summit: { log: [13, 4] as const },
  pasture: { watch: [20, 12] as const },
  forest: { camp: [31, 24] as const },
  hollow: { stones: [[24, 25], [30, 25]] as const },
  barrow: { drawing: [14, 2] as const, loaf: [7, 20] as const },
  road: {
    stone: [30, 12] as const,
    barn: [21, 8] as const,
  },
  // the knight's arena behind his fog (docs/boss-rooms.md; quest/kingdom.ts)
  kingdom: {
    knight: KINGDOM.knight,
    nail: [15, 8] as const,
    band: [24, 17] as const,
    severin: [25, 13] as const,
  },
}

/** The nearest open tile to (x, y): free ground for a thing, walkable ground for an anchor. */
function spot(m: MapBuilder, x: number, y: number, open: 'free' | 'walk' = 'free'): [number, number] {
  for (let r = 0; r <= 6; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
        const ok = open === 'free' ? m.free(x + dx, y + dy) : m.walkable(x + dx, y + dy)
        if (ok) return [x + dx, y + dy]
      }
  throw new Error(`no open tile near ${m.id}:${x},${y}`)
}

/** An anchor on the nearest walkable tile. */
const anchor = (m: MapBuilder, name: string, x: number, y: number) => m.anchor(name, ...spot(m, x, y, 'walk'))

/** A chalk drawing (Pell's): readable, with what it shows in both languages. */
function drawing(m: MapBuilder, which: string, x: number, y: number, en: string, zh?: string): void {
  ;[x, y] = spot(m, x, y)
  m.fixture(`fixture/chalk/${which}`, x, y, { id: `ch1.drawing.${which}`, props: { text: en, ...(zh && { text_zh: zh }) } })
}

/** A waypoint statue: the map remembers it, and beside it the fairy's power is chosen. */
/** A waypoint statue, named as one (the Mountain Foot's is): "the Ford statue", not "the Ford", in what the keys say. */
const statue = (m: MapBuilder, id: string, x: number, y: number, en: string, zh?: string) => m.fixture('fixture/sacred/waypoint', ...spot(m, x, y), { id, name: L(`${en} statue`, zh && `${zh}传送雕像`) })

/** Emberwick: the Hearthshard beside its altar, a waypoint statue on the square, the people's places. */
export function chapter1Village(m: MapBuilder): void {
  const a = CH1_AT.village
  // the shard altar beside the flame (a statue would look like a waypoint's: those are the waypoints' alone)
  m.fixture('fixture/sacred/altar', ...spot(m, ...a.statue), { id: 'village.astra', name: L('The shard altar'), props: { text: 'THE HEARTHSHARD OF EMBERWICK. A splinter of the Dawn Crown\'s light, kept here since the Founding. AUREX FELL SO THAT WE MIGHT RISE. WHILE ONE SHARD BURNS, NO HOUSE IS DARK.' }, tags: ['readable'] })
  statue(m, 'wp.village', ...a.statueStone, 'Emberwick')
  drawing(m, 'man', ...a.drawing, 'A hooded man with a lantern, beside a fire, and a little star over his shoulder. Underneath, in a child\'s letters: HE WAS HERE FIRST.')
  anchor(m, 'shrine.tend', ...a.shrine)
  // (Ilse, Joss and Edda sleep in their own beds: the chapel, the house in the lane, the little cabin — village.ts)
  anchor(m, 'joss.bench', 12, 19)
  anchor(m, 'pell.play', 18, 13)
  anchor(m, 'nessa.desk', 27, 16)
  anchor(m, 'nessa.watch', 34, 17)
  anchor(m, 'fennick.bench', 21, 19)
  anchor(m, 'edda.garden', 25, 21)
  anchor(m, 'severin.stand', ...a.severin)
  anchor(m, 'courier.stand', ...a.courier)
}

/** The Ford: a waypoint statue by the camp, Pell's drawing by the footbridge, thorns driven into the bridge's stumps. */
export function chapter1Ford(m: MapBuilder): void {
  const a = CH1_AT.ford
  statue(m, 'wp.ford', ...a.stone, 'Greywater Ford')
  drawing(m, 'bridge', ...a.drawing, 'A bridge with its middle gone. A tall figure in white beside it, and a smaller grey one watching from the trees.', '一座中间断了的桥。桥边站着一个高高的白色人影，树林里还有一个小一点的灰色人影，在往这边看。')
  for (const [x, y] of a.briars) m.fixture('fixture/nature/briar', ...spot(m, x, y), { name: L('Thorns driven into the stump', '钉进桥桩的荆棘') })
}

/** Shardstone Foot: Pell's drawing beside the waystone. */
export function chapter1Foot(m: MapBuilder): void {
  // the hunter's cabin, long left: his gloves still by the block in its yard, where he took them off to split wood
  m.item({ form: 'item/clothing/gloves', material: 'leather', name: L("Hunter's Gloves", '猎人的手套') }, ...spot(m, 9, 16))
  drawing(m, 'stone', ...CH1_AT.foot.drawing, 'The waystone, five facets drawn on it, the first scribbled over in black. A grey figure with its hand on it.')
}

/** The barrow: Pell's drawing at the door, and the loaf the grey man left the foragers. */
export function chapter1Barrow(m: MapBuilder): void {
  const a = CH1_AT.barrow
  // Lina's side cell: finding her plays the shut door's story
  m.regions.lina_cell = [2, 17, 8, 6]
  drawing(m, 'door', ...a.drawing, 'A door, shut, a hand-mark on it. Behind it, something with a crown of bones. In front, two small people.', '一扇关着的门，门上有个手印。门后面是一个戴着骨头冠的东西，门前面是两个小人。')
  m.item({ form: 'item/food/bread', name: L('Loaf marked with an ash sun') }, ...spot(m, ...a.loaf))
}

/** The East Road: Edda's barn, the waypoint statue before the knight's hedge, the stretch of road where the grey man waits. */
export function chapter1EastRoad(m: MapBuilder): void {
  const a = CH1_AT.road
  anchor(m, 'edda.barn', ...a.barn)
  statue(m, 'wp.eastroad', ...a.stone, 'The Eastmarch Road')
  // the barn where Edda hides; the stretch of road before the thorns, where the grey man waits
  m.regions.barn = [18, 6, 7, 4]
  m.regions.thornroad = [27, 8, 5, 7]
  // the road on to Cinderholt (map `emberfall`) is Chapter Two's, sealed in this release (docs/sunshard/CHAPTER-1.md)
  for (const p of m.portals) if (p.to === 'emberfall') p.opensWhen = CHAPTER_TWO
}

/**
 * The Kingdom, the knight's arena behind his fog (docs/boss-rooms.md §4.1): the kneeling stones of those who came before
 * and would not kneel, what a pilgrim before you wore, the gauntlets of one of his own, what he took, and the knight.
 */
export function chapter1Kingdom(m: MapBuilder): void {
  const a = CH1_AT.kingdom
  // kneeling stones: the Regent's seekers who came before you (docs/sunshard/CHAPTER-1.md)
  for (const [x, y] of [[13, 16], [16, 18], [21, 18], [24, 15], [12, 8]] as const)
    m.fixture('fixture/sacred/gravestone', ...spot(m, x, y), { name: L('A kneeling stone'), props: { text: 'A stone carved as a soldier kneeling, a sunburst on his breastplate: the Regent\'s sun. No name. Someone set it here facing west, toward Solmere.' } })
  // by a kneeling stone, what a seeker before you wore; in the ring, the gauntlets of one of the knight's own
  m.item({ form: 'item/valuable/earring', material: 'silver', quality: 'fine', name: L("A Fallen Seeker's Earring"), props: {} }, ...spot(m, 14, 16))
  m.item({ form: 'item/clothing/gloves', material: 'leather', quality: 'masterwork', name: L('Gauntlets of the Briar Knights'), props: { atk: 1 } }, ...spot(m, 22, 10))
  // what he took: the bridge's ninth nail, a farmer's wedding band
  m.item({ form: 'item/misc/ninth_nail' }, ...spot(m, ...a.nail))
  m.item({ form: 'item/valuable/band', material: 'gold' }, ...spot(m, ...a.band))
  // the First Warden: softer in his first chapter than in the Boss Challenge (his health, and his attack, which
  // every one of his skills' blows is a multiple of)
  const knight: Entity = createBoss('alberic', { map: m.id, x: a.knight[0], y: a.knight[1] }, ALBERIC_ID)
  knight.props = { ...ALBERIC_CAMPAIGN }
  m.entities.push(knight)
}

/** Cloudtop: the Crown's sunset watch, its logbook on the table (E reads it): where the player was raised (docs/sunshard/STORY.md). */
export function chapter1Summit(m: MapBuilder): void {
  const [x, y] = CH1_AT.summit.log
  m.fixture('fixture/furniture/table', x, y, {
    id: 'summit.log',
    name: L("The watchman's log"),
    tags: ['readable'],
    props: {
      text: 'SUNSET, CLOUDTOP WATCH, KEPT FOR THE CROWN. Regency year 2: 19:42 at midsummer. Year 8: 19:31. Year 15: 19:12 — I have checked the glass twice. Year 19: my reports go down to Solmere and nothing comes back. Between the columns: The young one asks again where they came from. I tell them, the mountain. I swore to Ser G. I would tell them nothing else. Last page: A small light came to the window tonight, warm as a coal. It asked me how old it was. I did not know what to tell it. Something is moving in the cut below. I am going down to look.',
    },
  })
  // the watchman's cloak, left on its peg: he went down the mountain without it
  m.item({ form: 'item/clothing/cloak', material: 'cloth', quality: 'fine', name: L("Watchman's Cloak"), props: {} }, ...spot(m, 8, 5))
}

/** The grassland: Brin's place by the herd (at her post by the fold's gate), and the ground where the herd kneels at dusk. */
export function chapter1Pasture(m: MapBuilder): void {
  const a = CH1_AT.pasture
  m.fixture('fixture/furniture/bench/log', ...spot(m, a.watch[0] - 1, a.watch[1] + 1), { name: L("Brin's bench", '布琳的长凳') })
  anchor(m, 'herd.watch', ...a.watch)
  m.regions.herd = [6, 6, 28, 18]
}

/**
 * The forest: the cold camp of the pilgrim before you, deep in the south-east clearing by the brook, the old footpath to
 * it half grown over: his rotted tent, the ring of his fire, his crate split open, the proclamation nailed to a tree at
 * the clearing's edge, and the cairn over him with his scallop beside it.
 */
export function chapter1Forest(m: MapBuilder): void {
  const [cx, cy] = CH1_AT.forest.camp
  m.regions.camp = [cx - 4, cy - 3, 8, 6]
  m.fixture('fixture/tent/torn', ...spot(m, cx + 1, cy - 1), { name: L('A rotted tent', '朽烂的帐篷') })
  m.fixture('fixture/light/campfire', ...spot(m, cx - 1, cy), { name: L('A cold fire ring', '冷掉的火圈') })
  m.fixture('fixture/container/crate', ...spot(m, cx - 3, cy - 1), { name: L('A split crate', '裂开的木箱') })
  m.fixture('fixture/sign/noticeboard', ...spot(m, cx - 4, cy - 3), {
    name: L('A proclamation nailed to a tree'),
    props: {
      text: 'BY ORDER OF THE LORD REGENT. The Wardens are oathbreakers. Let a Crownseeker be called. Brother Cassian of Emberwick is named Crownseeker. — In the eleventh year of the Regency. (The paper is grey with age. The wording is almost the same as the Herald\'s.)',
    },
  })
  m.fixture('fixture/sacred/gravestone', ...spot(m, cx + 1, cy + 1), {
    name: L('A cairn of stones'),
    props: { text: "Stones piled over something long. A traveller's staff leans on it, its tip worn flat by many miles. No name." },
  })
  m.item({ form: 'item/valuable/scallop' }, ...spot(m, cx, cy + 1))
}

/** Thornwood Hollow: the carved stones at the barrow mouth (the Briar Knights buried their own below). */
export function chapter1Hollow(m: MapBuilder): void {
  m.regions.mouth = [22, 22, 11, 6]
  // a waypoint statue by the barrow mouth: the far end of the rescue's road, and of the barrow's three floors
  statue(m, 'wp.hollow', 23, 21, 'Thornwood Hollow', '荆棘谷')
  // under the west thicket's thorns, boots someone gave up on
  m.item({ form: 'item/clothing/boots', material: 'leather', quality: 'fine', name: L('Thornproof Boots', '防刺长靴'), props: {} }, ...spot(m, 8, 14))
  for (const [x, y] of CH1_AT.hollow.stones)
    m.fixture('fixture/sacred/gravestone', ...spot(m, x, y), {
      name: L('A carved standing stone'),
      props: { text: 'Worn carving: a knight under a crown of briars, and before him a line of small figures kneeling, their swords laid down. Beneath: THE BRIAR KNIGHTS HOLD THE RIVER.' },
    })
}

/** Where the scenes' own people wait out of sight: a plot linked to nothing (as the tutorial is). */
export function buildOffstage(): MapBuilder {
  const m = new MapBuilder('offstage', L('Elsewhere', '别处'), 'wild', 8, 6, 'grass', 'field', 'outdoor', 'frostfang')
  m.anchor('severin.hide', 2, 2)
  m.anchor('courier.hide', 5, 3)
  m.anchor('alberic.hide', 6, 1)
  m.zone = 'peaceful'
  return m
}

const v = CH1_AT.village
const kd = CH1_AT.kingdom

/** The chapter's story before the knight (docs/chapter-1.md §6): the village, the barrow, the tale, the road. */
export const CHAPTER1_STORY: StepDef[] = [
  {
    // First into Emberwick: the Hearthshard, its keeper, a boy who wants to draw the star-sprite.
    id: 'village_arrival',
    when: { map: 'meadow', facts: { 'village.rescued': 0 } },
    script: [
      say('npc.ilse', 'Someone down from Cloudtop, and a star-sprite at their shoulder... The mountain has not sent us anyone in a long while. Welcome to Emberwick. Come and warm your hands at the Hearthshard. While one shard burns, no house is dark.', undefined, 'surprised'),
      say('npc.pell', 'Is that a star? A real one? Can I draw her? Don\'t move, either of you!', undefined, 'happy'),
      say('pip', 'Draw me? ...All right. But be quick. I\'m no good at keeping still.', undefined, 'shy'),
      say('npc.rowan', 'Pell, let them be. — Traveller, you have come at a bad time. Two of ours went out foraging and did not come back. When you are warm, come and find me, and I will tell you the rest.'),
    ],
  },
  {
    // In the barrow, Lina: the grey man shut the inner door, and left them bread.
    id: 'barrow_cells',
    when: { map: 'barrow', region: 'lina_cell' },
    script: [
      say('npc.lina', 'So somebody did come. ...Listen. It wasn\'t the dead that shut us in. A man in grey pulled the inner door shut from the outside. Later he pushed a loaf under it.'),
      say('npc.lina', 'There\'s a mark on the bread. A little sun, pressed in ash with a thumb.'),
      say('npc.lina', 'Oskar took the stair in the east cell to look for another way out. He hasn\'t come back. It goes a long way down, further than any barrow should. ...I\'m not asking you to go after him.', undefined, 'sad'),
      say('pip', 'I can hear them moving in the dark. All the time.', undefined, 'sad'),
    ],
  },
  {
    // The warden falls, and says the one thing it remembers.
    id: 'warden_falls',
    when: { map: 'sanctum', objectives: ['rescue.warden'] },
    script: [
      say('player', '(As the warden falls apart, its jaw moves. A sound comes out of it, something like a voice.)'),
      say('player', '("The light... is being taken. I could not... lie down.")', undefined, 'surprised'),
      say('pip', 'It spoke. ...Can the dead speak?', undefined, 'surprised'),
      say('player', '(On the altar behind where it stood, words are cut into the stone: "WE HOLD THE RIVER UNTIL THE QUEEN\'S LIGHT COMES HOME. — G." Under them, pressed into the soot, is a thumbprint of ash.)'),
    ],
  },
  {
    // Dusk after the rescue: Sister Maren tells the children the tale of the Starfall and the Sundering Night.
    id: 'tale',
    when: { map: 'meadow', hour: { from: 17, to: 21 }, facts: { 'village.rescued': 1, 'ch1.vigil': 1, [CH1.flameStolen]: 0, [CH1.knight]: 0 } },
    script: [
      say('npc.pell', 'Sister Maren, tell the one where the star falls. Please? Our guest has never heard it.'),
      say('npc.ilse', 'Long ago a star fell out of the sky, burning. Its name was Aurex. Where it broke, its heart scattered over the land in shards of light, and where the shards lay, nothing of the dark could walk. That was the Starfall.'),
      say('npc.ilse', 'King Halvard gathered the five greatest shards and had them made into a crown. Whoever of his line wore the Dawn Crown kept every shard in the land alight, like a second sun.'),
      say('npc.ilse', 'Nineteen winters ago, on the Sundering Night, Queen Isolde was killed in her own chapel, and the Crown broke into five pieces that flew over the sky like comets. Since then the days have grown shorter.'),
      { emote: 'pip', mood: 'surprised' },
      say('pip', '...', undefined, 'sad'),
      say('npc.pell', 'Kiri? You\'re shaking.'),
      say('pip', 'No, I\'m not. It\'s just cold.', undefined, 'shy'),
      say('npc.ilse', 'Aurex fell so that we might rise, Pell. ...Now, children, tonight we give thanks at the Hearthshard. Pell, wash your hands first; your sleeves are covered in chalk.'),
      { fact: 'ch1.tale', value: 1 },
    ],
  },
  {
    // The night of the theft, at the Ford: the river's ice already going, a lantern far off east.
    id: 'ford_night',
    when: { map: 'ford', facts: { [CH1.flameStolen]: 1, [CH1.letter]: 0 } },
    script: [
      say('npc.hesper', 'You saw him too? A man in grey walked across my river. The water froze under each step he took, and it had melted again behind him before I had my boots on.', undefined, 'surprised'),
      say('player', '(Far off to the east, beyond the far bank, a small light bobs along the road, and goes out.)'),
      say('npc.hesper', 'Thirty-one years I have kept this water. I have never seen it hold a man up.'),
    ],
  },
  {
    // Fennick, after you have asked him about the knight: what Gavrel was, and what he carried through Emberwick on
    // the Sundering Night (docs/sunshard/STORY.md §2: the heir).
    id: 'fennick_memory',
    when: { map: 'meadow', objectives: ['pilgrim.fennick'] },
    script: [
      say('npc.fennick', 'I carried his lance for six years, when I was young. Ser Gavrel, First Warden of the Queen. He would stop the whole column to kneel down and talk to children by the road. Knights don\'t do that. He did.'),
      say('npc.fennick', 'The night the Queen died, he rode through Emberwick before dawn with something under his cloak, wrapped against the cold. He took the mountain road. When he came down again his cloak was empty, and that crown of briars was on his head.'),
      say('npc.fennick', 'Every year after, there was a little less of him. One morning he looked at me and asked me my name. I left that night. ...If he asks yours, Crownseeker, tell him. Somebody should.', undefined, 'sad'),
    ],
  },
  {
    // Hesper, after you have asked her what she saw: the stumps, and Aldo's bridge.
    id: 'hesper_stumps',
    when: { map: 'ford', objectives: ['pilgrim.hesper'] },
    script: [
      say('npc.hesper', 'Look at the stumps by the bridge. Where the planks were, he drove thorns into the wood, like a man marking what is his.'),
      say('npc.hesper', 'Aldo and Joss built that bridge the year before the river took Aldo. Every board I walked on, he cut.', undefined, 'sad'),
      say('npc.hesper', 'Mend it. Then go and tell that knight whose bridge it was.'),
    ],
  },
  {
    // First onto the Eastmarch Road: the light is wrong, and the knight's thorns line the way.
    id: 'road_east',
    when: { map: 'eastroad', facts: { 'ford.crossed': 1 } },
    say: L('Is the sun lower than it was this morning? It\'s only just past noon. — And there are thorns all along the road, planted in a line.'),
  },
  {
    // The barn of the burned farm: Edda comes out of hiding.
    id: 'edda_barn',
    when: { map: 'eastroad', region: 'barn', after: 'burned_farm' },
    script: [
      say('npc.edda', 'Stay back! ...You\'re alive. I\'m sorry. Nothing alive has come up this road in a long time.'),
      say('npc.edda', 'The days were too short, and the wheat died in the field. Then the night things came. Then a knight in white rode through and took everything that shone: the shard-lamps, the pans, my husband\'s ring off the gatepost. It had a chip of shard in it. That was all he wanted.'),
      say('npc.edda', 'The night the barn burned, a man in grey dragged me out of the smoke. Please don\'t tell them in the village. They wouldn\'t understand.'),
    ],
  },
  {
    // Before the thorns: the grey man waits on the road, and tries to turn the Crownseeker back (docs/writing.md §5).
    id: 'severin_warning',
    when: { map: 'eastroad', region: 'thornroad', facts: { [CH1.letter]: 1 } },
    script: [
      { place: 'npc.severin', map: 'eastroad', x: 31, y: 11 },
      say('npc.severin', 'Crownseeker, go back. There is nothing at the end of this road that you are looking for.'),
      say('npc.severin', 'The knight beyond the thorns has held this river for nineteen years. Not against you. Against Solmere. He was a good man, and he still is.'),
      say('npc.severin', 'Your Regent wants his Diadem. Take it, then. I will not stop you.'),
      say('npc.severin', 'Only, when it comes off, light will come out of it. That light must not go west.'),
      say('player', '(He looks at Kiri for a long time, and says nothing. Then he turns and walks away.)'),
      { move: 'npc.severin', x: 31, y: 18 },
      { place: 'npc.severin', map: 'offstage', x: 2, y: 2 },
      { fact: 'ch1.warned', value: 1 },
    ],
  },
  {
    // Cloudtop: the watchman's log on the table — the sunsets coming early for years, the young one he raised, the light
    // at his window. The player does not remember any of it (docs/sunshard/STORY.md §4).
    id: 'watch_log',
    when: { map: 'summit', near: { type: 'fixture/furniture/table', r: 1 } },
    script: [
      say('player', '(A logbook lies open on the table, its pages stiff with cold. Column after column of sunset times, year after year, each a little earlier than the last.)'),
      say('player', '(Between the columns, in the same hand: "The young one asks again where they came from. I tell them, the mountain. I swore to Ser G. I would tell them nothing else.")'),
      say('player', '(The last page: "A small light came to the window tonight, warm as a coal. It asked me how old it was. Something is moving in the cut below. I am going down to look.")'),
      say('pip', 'The light at the window... that was me. I remember the window. I don\'t remember anything before it.', undefined, 'sad'),
      say('pip', 'And the young one... You don\'t remember either, do you? ...Then we\'ll find out together. But not in here. It\'s so cold in here.', undefined, 'sad'),
    ],
  },
  {
    // The grassland, first time: the herd keeps to the north, away from the trees.
    id: 'pasture_first',
    when: { map: 'pasture' },
    say: L('The cows are all crowded at the north end, as far from the trees as they can get. Are they afraid of something?', '牛都挤在北头，离树林能多远就多远。它们在怕什么吗？'),
  },
  {
    // Dusk on the grassland: the whole herd kneels, facing east, toward the knight's ring of thorns.
    id: 'kneeling_herd',
    when: { map: 'pasture', hour: { from: 17, to: 20 } },
    script: [
      say('player', '(The light turns amber. One by one the cows fold their front legs and go down on their knees, every one of them facing east.)', '（天光变成了琥珀色。牛一头接一头屈下前腿，跪了下去，全都朝着东边。）'),
      say('npc.brin', 'Every dusk, ever since the bridge went down. My gran never saw a cow kneel in her whole life.', '每天黄昏都这样，从桥断了那天起就是。我奶奶活了一辈子，也没见过牛下跪。'),
      say('npc.brin', 'And after dark the dead come up out of the trees. I\'ve lost three cows this month. If you can swing a weapon, come and find me.', '天一黑，死人就从林子里爬出来。这个月我已经丢了三头牛。你要是会使兵器，来找我。'),
    ],
  },
  {
    // The forest, first time: no birds.
    id: 'forest_quiet',
    when: { map: 'forest' },
    say: L('Listen. ...There are no birds. Not one. A forest this big ought to be noisy in the afternoon.', '你听……一声鸟叫都没有。这么大的林子，下午本来该很热闹的。'),
  },
  {
    // Deep in the forest: the cold camp of the Crownseeker before you, the same proclamation nailed to a tree.
    id: 'pilgrim_camp',
    when: { map: 'forest', region: 'camp' },
    script: [
      say('player', '(A camp nobody has used in a very long time: a tent gone to rags, a ring of cold stones, and a cairn with a traveller\'s staff leaning on it.)'),
      say('pip', 'There\'s a paper nailed to that tree. It says, "The Wardens are oathbreakers. Let a Crownseeker be called."', undefined, 'surprised'),
      say('pip', 'It\'s very old. The name on it is Brother Cassian, of Emberwick. Sister Maren might have known him.', undefined, 'sad'),
      say('player', '(Something glints by the cairn: a scallop shell on a cord, a traveller\'s token.)'),
    ],
  },
  {
    // The camp after dark: a pale shape kneels at the cold fire, and says one thing.
    id: 'pilgrim_ghost',
    when: { map: 'forest', region: 'camp', hour: { from: 20, to: 4 }, after: 'pilgrim_camp' },
    script: [
      say('player', '(By the cold fire ring a pale shape is kneeling, its head bowed, as if it has knelt there for a very long time.)'),
      say('player', '("Do not carry it west," it says, without looking up.)', undefined, 'surprised'),
      { emote: 'pip', mood: 'surprised' },
      say('pip', 'It\'s gone. It was right there... Can we go now? Please?', undefined, 'sad'),
    ],
  },
  {
    // Thornwood Hollow, first time: the dead below sleep badly.
    id: 'hollow_first',
    when: { map: 'hollow' },
    say: L('Down there, past the thorns, the dead are sleeping badly. I can feel it from here, like a draught under a door.', '荆棘那边，地底下的死人睡得很不安稳。我在这儿都感觉得到，像门缝底下钻进来的风。'),
  },
  {
    // The barrow mouth: the carved stones of the Briar Knights.
    id: 'barrow_mouth',
    when: { map: 'hollow', region: 'mouth' },
    say: L('There\'s a knight carved on these stones, under a crown of briars. Fennick might know who is buried down there.'),
  },
  {
    // Millbrook, first time: the wheel turning slow.
    id: 'mill_first',
    when: { map: 'mill' },
    say: L('Listen to the wheel. It keeps stopping and starting. Tam says something has got into his cellar, and that\'s where the lamp oil is kept.', '你听那水车，转一阵停一阵的。塔姆说他的地窖里钻进了东西，灯油就放在那下面。'),
  },
  {
    // The cellar: the oil, and what moved in after dark.
    id: 'cellar_first',
    when: { map: 'millcellar' },
    say: L('Slimes, down here in the cellar! The oil flasks are on the shelves at the back.', '地窖里有史莱姆！油瓶在最里面的架子上。'),
  },
  {
    // Beacon Hill, first time: where King Halvard lit the first shard-fire.
    id: 'hill_first',
    when: { map: 'dawnhill' },
    say: L('They say King Halvard lit the first shard-fire up here, on the morning he was crowned. Look, all the flowers face east. Those must be the beaconbloom.'),
  },
  {
    // The Beacon Chapel: the bell rung, as it was rung the morning of the first crowning.
    id: 'chapel_bell',
    when: { map: 'chapel', region: 'belfry' },
    script: [
      say('player', '(You take the old rope in both hands and pull. High above, the bell swings once, twice, and its voice rolls down the hill toward Emberwick.)'),
      { emote: 'pip', mood: 'surprised' },
      say('pip', 'They\'ll hear that in the village!', undefined, 'happy'),
      say('pip', 'Sister Maren says the Hearthshard was first kindled on that hearth, from King Halvard\'s own fire.', undefined, 'sad'),
    ],
  },
  {
    // The second floor: the Briar Knights buried their own here.
    id: 'ossuary_enter',
    when: { map: 'ossuary' },
    say: L('Bones in every wall, and a name over each one. Knights. A whole order of knights, buried down here together. ...They aren\'t resting either.', '每面墙里都是骨头，每一具上面都刻着名字。是骑士，一整个骑士团都埋在这底下。……他们也没有安息。'),
  },
  {
    // The niches: one is carved and empty, and someone keeps it swept.
    id: 'niches',
    when: { map: 'ossuary', region: 'niches' },
    say: L('This niche has a name on it, but nobody inside. "Fennick, squire to the Commander." Fennick? The old man on the bench in the village? And it has been swept clean.', '这个墓龛刻了名字，里面却是空的。"芬尼克，骑士长的侍从。"芬尼克？是村里坐在长凳上的那位老爷爷吗？而且这里扫得干干净净。'),
  },
  {
    // Oskar in the ossuary's cell: the stair, the roll, the warden below.
    id: 'oskar_cell',
    when: { map: 'ossuary', region: 'oskar_cell' },
    script: [
      say('npc.oskar', 'About time. I came down looking for another way out, and the dead herded me in here like a sheep.', '总算来了。我下来找别的出路，结果被那些死人像赶羊一样赶进了这儿。'),
      say('npc.oskar', 'Did you read the roll on the altar back there? Forty-odd knights of the Briar. The last name is cut deeper than the rest.'),
      say('npc.oskar', 'Whatever keeps this place is further down, at the bottom of the stair in the north-east corner. I heard it walking all night, back and forth, like a guard on a wall.', '看守这地方的东西在更底下，东北角那道楼梯下去就是。我听它走了一整夜，来来回回的，跟城墙上站岗的一样。'),
    ],
  },
  {
    // The third floor: the warden's sanctum.
    id: 'sanctum_enter',
    when: { map: 'sanctum' },
    say: L('It\'s standing in front of the altar, and it isn\'t coming for us. Is it keeping watch?', '它站在祭坛前面，没有朝我们过来。它是在站岗吗？'),
  },
  {
    // The statue before the thorns: a breath before the knight.
    id: 'statue_rest',
    when: { map: 'eastroad', near: { type: 'fixture/sacred/waypoint', r: 3 }, after: 'severin_warning' },
    say: L('A statue. We can rest here. If I ever have more than one gift, this is where I can change it. ...It\'s cold past those thorns. Colder than at the waystone.'),
  },
]

/** Thornhold (docs/chapter-1.md §12): the Warden's Thorn after the knight, his welcome there, the ground widening. */
export const HAVEN_STORY: StepDef[] = [
  {
    // After the Diadem: one thorn of it is still green where he fell, and warm (a save from before has it the next time it plays)
    id: 'oath_thorn',
    when: { facts: { [CH1.knight]: { ne: 0 }, 'haven.token': 0 } },
    script: [
      say('player', '(Among the thorns where the knight fell, one is still green. It is warm to the touch, and it hums, very faintly, like a door left open.)', '（骑士倒下的荆棘丛里，有一根还是绿的。摸上去是温的，还在很轻很轻地嗡嗡响，像一扇没关严的门。）'),
      { give: 'item/relic/oath_thorn' },
      { fact: 'haven.token', value: 1 },
      say('pip', 'I think it wants to be used, on you. Hold it and left click. I can hear a field on the other side of it. And... someone waiting.', '它好像想让你用一下——对你自己用。拿着它，按左键。我听见它另一边有一片田野。还有……有人在等。', 'surprised'),
    ],
  },
  {
    // The first time in Thornhold: the knight, unhelmed, keeps it.
    id: 'haven_first',
    when: { map: HAVEN_MAP },
    script: [
      { place: 'npc.alberic', map: HAVEN_MAP, x: HAVEN.heart[0] + 1, y: HAVEN.heart[1] + 1 },
      say('npc.alberic', 'You have come. ...You are the one who took the Diadem from me. I could not see your face then. Now I can.'),
      say('npc.alberic', 'I swore to hold until I was relieved. You relieved me. So now I hold for you: this ground, as far as the mist. It is yours. Build on it, sow it, keep beasts on it.'),
      say('npc.alberic', 'Bring me what a wider ground needs, and I will push the mist back. ...And tell me your name. This time, I would like to keep one.', undefined, 'sad'),
      say('npc.alberic', 'Take this, the coin of this ground. My stall keeps seeds, feed and bait, and buys back what you grow, raise and catch. There are fish in the pond.', '拿着，这是这片土地的钱币。我的货摊有种子、饲料和鱼饵；你种的、养的、钓的，我也收。池塘里有鱼。'),
      { give: 'item/misc/thornmark', count: 30 },
      { fact: 'haven.met', value: 1 },
    ],
  },
  ...([1, 2, 3] as const).map((n): StepDef => ({
    id: `haven_grow_${n}`,
    when: { map: HAVEN_MAP, facts: { 'haven.size': { gte: n } } },
    say: L(['', 'The mist pulled back! There\'s a grove out there, and stones.', 'Further again: a meadow, and water.', 'All of it now. Boundary stones at the edges... and iron in the rocks.'][n], ['', '雾退开了！那边有一片树林，还有石头。', '又退远了一圈——一片草地，还有水。', '雾全散了。边上立着界石……岩石里还有铁。'][n]),
  })),
]

/** The first chapter's card (`chapter_end`). */
const CHAPTER_END = 'CHAPTER ONE · THE EMBER LETTER\n\nThe White Knight knelt, and gave up the Briar Diadem.\nThe man in grey went east with the Hearthshard\'s flame.\nAnd the night came a little sooner.'

/** Chapter Two waits for the next update: the road east stays sealed (docs/sunshard/STORY.md §7). */
const CHAPTER_NEXT = 'Chapter Two · Ashes of Cinderholt\nwaits beyond the river, in the next update.\n\nEmberwick, its country and Thornhold are yours until then.'

/** How many of the Diadem scene's commands each answer's branch holds (the `branch` command skips them). */
const KIRI_BRANCH = 5
const CORVIN_BRANCH = 5

export const CHAPTER1_SCENES: StepDef[] = [
  {
    // The night of the flame: the village gives thanks for the rescue; the grey man takes the Hearthshard's flame, the
    // night before the Regent's Herald comes for it.
    id: 'night_flame',
    // (not once the knight has fallen: a player who went straight for him finds the night already past)
    when: { map: 'meadow', hour: { from: 21, to: 24 }, facts: { 'village.rescued': 1, 'ch1.vigil': 1, [CH1.knight]: 0 } },
    script: [
      say('npc.rowan', 'Lina and Oskar are home. Tonight Emberwick gives thanks to the Hearthshard that has kept us, and to our guest, who went down into the barrow and brought them back.'),
      say('npc.ilse', 'May the Fallen Star keep us tonight. ...Go to your beds now. The shard keeps the dark.'),
      { fade: 'out' },
      // the grey man's music as the dark falls (docs/music.md)
      { music: 'severin' },
      { wait: 10 },
      { place: 'npc.severin', map: 'meadow', x: v.severin[0], y: v.severin[1] },
      { fade: 'in' },
      say('player', '(A man in a grey cloak stands at the shrine, ash on his hands. He lifts the Hearthshard\'s flame into a hooded lantern as if it weighed nothing.)', undefined, 'surprised'),
      { status: 'village.campfire', remove: 'lit' },
      say('npc.holt', 'Thief! Stop — THIEF!', undefined, 'angry'),
      say('npc.severin', '...They come for it at dawn. Better me than them.'),
      { move: 'npc.severin', x: 37, y: 18 },
      { place: 'npc.severin', map: 'offstage', x: 2, y: 2 },
      say('npc.holt', 'He went east, over the river! The water froze under his feet, and he walked straight across.'),
      say('player', '(Sister Maren has not moved. She is looking into the dark where he went, and she does not call out.)'),
      { fact: CH1.flameStolen, value: 1 },
      { topic: 'flame_stolen', days: 30 },
    ],
  },
  {
    // The Herald: at dawn the Regent's man comes to take the shard to Solmere, finds it gone, and names the Crownseeker.
    id: 'letter',
    when: { map: 'meadow', morningAfter: 'night_flame', facts: { [CH1.knight]: 0 } },
    script: [
      { music: 'revelation' },
      { place: 'npc.courier', map: 'meadow', x: v.courier[0], y: v.courier[1] },
      say('npc.courier', 'In the name of Caedmon Vire, Lord Regent of Valdoria! I am sent for the shard of this village, to be carried to Solmere for the Reforging.'),
      say('player', '(The shrine is cold. The Herald looks at it for a long moment.)'),
      say('npc.courier', 'Stolen. Of course it is. The Covenant is always one night ahead of us.', undefined, 'angry'),
      say('npc.courier', 'Then hear the Regent\'s word. The five Wardens are oathbreakers. They hoard the pieces of the Dawn Crown, and while they hold them the Dimming deepens. Let a Crownseeker be called, to bring the five Regalia home.'),
      say('npc.courier', 'And it is written: one who walks with a fallen star shall gather the Crown.'),
      { emote: 'npc.courier', mood: 'surprised' },
      say('player', '(The Herald stares at Kiri. Kiri slips behind your shoulder.)'),
      say('pip', 'I don\'t like the sun on his coat. I don\'t know why.', undefined, 'shy'),
      say('npc.courier', 'You, then. By the Regent\'s writ you are Crownseeker. The First Warden holds the Eastmarch, past the river. Bring his Diadem to Solmere, and the Regent will remember your name.'),
      // the rival (docs/sunshard/STORY.md §4): named here, met in Chapter Two
      say('npc.courier', 'Be quick about it. You are not the only seeker the Regent has named this year. His own rides the southern road, and Sable Vire has never come second to anyone.'),
      { give: 'item/document/proclamation' },
      say('npc.ilse', 'The shard taken, and the Regent\'s Herald at our door, on the same morning. ...When you are ready, Crownseeker, come to me.'),
      { place: 'npc.courier', map: 'offstage', x: 5, y: 3 },
      { fact: CH1.letter, value: 1 },
    ],
  },
  {
    // The ring of thorns: stepping inside, the White Knight speaks once.
    id: 'kingdom',
    when: { map: 'kingdom', region: 'kingdom' },
    script: [
      { music: '' },
      say('player', '(A field ringed with thorns, and stones carved as kneeling soldiers. In the middle stands a knight in white, a crown of briars grown through his helm.)'),
      say(ALBERIC_ID, 'None cross for Solmere.'),
      say(ALBERIC_ID, 'Another of the Regent\'s hounds. They always send another.'),
      say(ALBERIC_ID, 'I hold. I... hold. I no longer remember what for.'),
      say('pip', 'Be careful! When he plants his sword in the ground, thorns come up in a ring around him!', undefined, 'surprised'),
    ],
  },
  {
    // The Diadem: the knight falls and gives it up, and knows the player's eyes; its light breaks loose and the player
    // chooses who takes it (choice.ch1.light); the grey man goes. The night grows longer.
    id: 'crown',
    when: { map: 'kingdom', facts: { [CH1.knight]: 1 } },
    script: [
      { music: 'sorrow' },
      { wait: 22 },
      say('player', '(The knight kneels. For the first time in nineteen years he lifts the Diadem from his own head.)'),
      say('player', '(His eyes find the cracked silver locket at your throat, and stay there.)'),
      say('player', '("...You have her eyes.")', undefined, 'surprised'),
      say('player', '("Take it. It was never mine to keep. Only to keep from him.")', undefined, 'sad'),
      { give: 'item/relic/crown_of_thorns' },
      say('player', '(Light comes loose from the Diadem, cold and bright, and hangs in the air between Kiri and the road west, as if it cannot decide.)'),
      { place: 'npc.severin', map: 'kingdom', x: kd.severin[0], y: kd.severin[1] },
      { music: 'severin' },
      say('npc.severin', 'Wait. Before it goes anywhere.'),
      say('npc.severin', 'That light kept the Eastmarch lit. If it goes west to Solmere, the Regent drinks it. Let me carry it in the lantern. Or let the little one hold it. But choose.'),
      {
        choose: L('Who takes the Diadem\'s light?'),
        options: [
          { text: L('Let Kiri hold it.'), facts: { 'choice.ch1.light': 'kiri' } },
          { text: L('Let Corvin take it into his lantern.'), facts: { 'choice.ch1.light': 'corvin' } },
        ],
      },
      // Kiri holds it: all of it runs to her
      { branch: 'choice.ch1.light', is: 'kiri', skip: KIRI_BRANCH },
      say('player', '(The light runs to Kiri like water finding an old riverbed. She glows so bright you have to look away.)'),
      // the power leaves the kneeling knight and runs to her (the client's light and her glow); the scene waits for it
      { tell: 'pip', params: { what: 'boon', unlock: 'xp', from: ALBERIC_ID } },
      { wait: 32 },
      // (the Ember Memory it carries returns in Chapter Two: docs/sunshard/STORY.md §5)
      say('pip', 'It came to me! ...It\'s cold. And there\'s something inside it, like a song in another room. I can\'t hear it yet.', undefined, 'surprised'),
      say('npc.severin', '...Then keep her close. Closer than you think.'),
      // Corvin takes it: the lantern drinks it, and a thread still finds her
      { branch: 'choice.ch1.light', is: 'corvin', skip: CORVIN_BRANCH },
      say('player', '(Corvin opens his lantern. The light pours into the stolen flame; it flares gold and gutters, and his hand shakes. One thread of it slips past him and runs to Kiri.)'),
      { tell: 'pip', params: { what: 'boon', unlock: 'xp', from: ALBERIC_ID } },
      { wait: 32 },
      say('pip', 'A little came to me anyway! ...It\'s cold. There was something in it, a voice? It went into the lantern with the rest.', undefined, 'surprised'),
      say('npc.severin', 'I owe you for this. I do not forget what I owe.'),
      say('npc.severin', 'Every Warden you bring down makes the night longer. Ask your Regent why.'),
      say('npc.severin', 'Go home, and tell Rowan the light is safer with me than with any of them.'),
      { move: 'npc.severin', x: KINGDOM.east - 2, y: 11 },
      { place: 'npc.severin', map: 'offstage', x: 2, y: 2 },
      { fact: CH1.crown, value: 1 },
      // the first Warden down: the night is an hour longer from now on (calendar.ts nightHours)
      { fact: 'night.shift', value: 1 },
      { topic: 'crown', days: 30 },
    ],
  },
  {
    // The return: the village sees the Diadem; the player tells them what the knight was (choice.ch1.tale); Nessa counts
    // the minutes; the chapter ends. After Thornhold (the quest `held_ground`, over: the chapter's card gives it to the
    // player), so the way into it is never missed. Chapter Two is not opened in this release (no `world.ch2`).
    id: 'return',
    when: { map: 'meadow', facts: { [CH1.crown]: 1 }, quest: { held_ground: { gte: 100 } } },
    script: [
      say('npc.rowan', 'The White Knight\'s Diadem, here in Emberwick. ...And that thief in grey still has our flame.', undefined, 'angry'),
      say('npc.rowan', 'Tell us, then. What was he, at the end? The children will want the story.'),
      {
        choose: L('What do you tell Emberwick about the knight?'),
        options: [
          { text: L('"He was holding the river against Solmere. He was loyal to the last."'), facts: { 'choice.ch1.tale': 'truth' } },
          { text: L('"The White Knight is dead. That is all anyone needs to know."'), facts: { 'choice.ch1.tale': 'legend' } },
        ],
      },
      { branch: 'choice.ch1.tale', is: 'truth', skip: 2 },
      say('npc.rowan', 'Against Solmere? ...Then who was he holding it for?', undefined, 'surprised'),
      say('npc.fennick', 'For her. He was always holding it for her.', undefined, 'sad'),
      { branch: 'choice.ch1.tale', is: 'legend', skip: 1 },
      say('npc.rowan', 'Dead, then. Good. We will sleep better for it.'),
      say('npc.ilse', 'He always did carry things that were too heavy for him.', undefined, 'sad'),
      { branch: 'choice.ch1.light', is: 'corvin', skip: 1 },
      say('npc.nessa', 'Four minutes. The sun set four minutes early tonight. I am sure it means nothing.'),
      { branch: 'choice.ch1.light', is: 'kiri', skip: 1 },
      say('npc.nessa', 'Five minutes. The sun set five minutes early tonight. I measured it twice. I am sure it means nothing.'),
      { fact: CH1.end, value: 1 },
      { music: 'ending' },
    ],
  },
  {
    // The chapter's card: the road east waits for Chapter Two, the next update's (docs/sunshard/STORY.md §7).
    id: 'chapter_end',
    when: { after: 'return' },
    script: [{ card: L(`${CHAPTER_END}\n\n${CHAPTER_NEXT}`) }],
  },
]
