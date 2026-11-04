// The Old Crown Road (docs/sunshard/CHAPTER-1.md; mechanics docs/chapter-1.md §14): between the Ford and the White
// Knight, the Crownseeking begins as Solmere means it to — the Regent's oath at the Wardens' Rest, five dead beacon
// shrines of Queen Isolde's road, each named for one of the five Regalia and lit by what is cut on it, the ruined
// Briarmoor Abbey of the Briar Knights where Gavrel was made a knight (his roll, his cell, Solmere's writ of recall that
// he never answered, the order's seal its last keeper guards), and the Field of Oaths, the stones of the knights who
// swore to hold the river with him. The maps and scenes are the demo's (tools/src/demo/quest/pilgrimage.ts); here are
// the facts, the shrines, and how a shrine takes its offering.

import type { Effect, Rule, Selector, Tree, TypeDef } from '@openworld/engine'

type Words = { en: string; zh: string }
const L = (en: string, zh: string = en): Words => ({ en, zh })
const story = (r: Omit<Rule, 'source'>): Rule => ({ ...r, source: { origin: 'base', note: 'story' } })

/** The road's facts (the story's), in the order they come. */
export const PILGRIMAGE = {
  arrived: 'ch1.rest',
  oath: 'ch1.oath',
  shrines: 'ch1.shrines',
  writ: 'ch1.writ',
  seal: 'ch1.order_seal',
  field: 'ch1.kneelfield',
} as const

/** Briarmoor Abbey's last keeper, in the abbey's crypt: he keeps the Briar Knights' seal. */
export const ABBOT_ID = 'abbey.abbot'
export const ORDER_SEAL = 'item/valuable/order_seal'
export const WRIT = 'item/document/writ_of_relief'
/** The Crownseeker's own scallop, given at the Rest for the oath: not the scallop of the one before (the errand's). */
export const SWORN_SCALLOP = 'item/valuable/scallop/sworn'

/** One of the five beacon shrines: the Regalia it is named for, what it asks to be laid on it, what is cut on it. */
export interface Wayshrine {
  id: string
  name: Words
  /** What lights it: a thing of this kind, laid on it (G) — never what one must not give away (`KEPT`). */
  takes: Selector
  /** What it asks, in a word (its objective, the pilgrims' hints). */
  asks: Words
  text: Words
}

/**
 * What a shrine never takes, whatever it asks: a relic (the Briar Diadem is worn on the head), what matters most (the
 * order's seal is metal), what is bound to one, and a keepsake (Mia's ring, a scallop). Laid on a shrine, it is
 * refused and stays the player's. (Tags a thing carries, never the derived ones a quest gives: the validator knows only
 * what some type carries.)
 */
export const KEPT = ['relic', 'important', 'bound', 'keepsake']
const offering = (sel: Selector): Selector => ({ ...sel, notTags: [...(sel.notTags ?? []), ...KEPT] })

export const WAYSHRINES: Wayshrine[] = [
  {
    id: 'crown', name: L('Beacon of the Diadem'), takes: offering({ tags: ['wearable'], props: { slot: 'head' } }), asks: L('something worn on the head', '一件戴在头上的东西'),
    text: L('THE FIRST BEACON OF QUEEN ISOLDE\'S ROAD. ITS FACET: THE DIADEM, FOR THE EASTMARCH. The glass in its cup is dark and cracked. Cut under it in a later hand: Traveller, lay in the cup what you wear on your head, and it will take light again.'),
  },
  {
    id: 'scourge', name: L('Beacon of the Chain'), takes: offering({ tags: ['fiber'] }), asks: L('a rope or a cord', '一根绳索'),
    text: L('THE SECOND BEACON OF QUEEN ISOLDE\'S ROAD. ITS FACET: THE CHAIN, FOR THE SCARRED MARCH. The glass in its cup is dark. Cut under it in a later hand: Lay a rope in the cup. The miners of that March go down on ropes.'),
  },
  {
    id: 'scales', name: L('Beacon of the Scales'), takes: offering({ tags: ['edible'] }), asks: L('something to eat', '一样吃的'),
    text: L('THE THIRD BEACON OF QUEEN ISOLDE\'S ROAD. ITS FACET: THE SCALES, FOR THE GOLDEN REACH. The glass in its cup is dark. Cut under it in a later hand: Lay a meal in the cup, one you will not eat.'),
  },
  {
    id: 'nails', name: L('Beacon of the Heights'), takes: offering({ tags: ['metal'] }), asks: L('something made of metal', '一件金属的东西'),
    text: L('THE FOURTH BEACON OF QUEEN ISOLDE\'S ROAD. ITS FACET: (the name has been chiselled off), FOR THE SILVERSPIRE HEIGHTS. The glass in its cup is dark. Cut under it in a later hand: Lay a piece of metal in the cup.'),
  },
  {
    id: 'lance', name: L('Beacon of the Lantern'), takes: offering({ tags: ['light'] }), asks: L('a torch or a candle', '火把或蜡烛'),
    text: L('THE FIFTH BEACON OF QUEEN ISOLDE\'S ROAD. ITS FACET: THE LANTERN, FOR THE MIREWOOD. The glass in its cup is dark. Cut under it in a later hand: Lay a light in the cup, and the road will see you to its end.'),
  },
]

/** A shrine's own fact: lit. */
export const shrineFact = (id: string) => `${PILGRIMAGE.shrines}.${id}`

/** The beacon shrines as kinds of thing: dead Sunshard beacons of Queen Isolde's road (the seal stone's look), each its own. */
export const PILGRIMAGE_TYPES: TypeDef[] = [
  { id: 'fixture/sacred/wayshrine', name: L('beacon shrine'), tags: ['holy', 'stone', 'readable', 'wayshrine', 'surface'], sprite: 'fixture:seal_stone', props: { material: 'stone', maxHp: 40, hp: 40, handsRange: 1 }, makeup: [{ type: 'item/material/stone', count: 2 }] },
  ...WAYSHRINES.map((s): TypeDef => ({ id: `fixture/sacred/wayshrine/${s.id}`, name: s.name, tags: [], sprite: 'fixture:seal_stone', props: { text: s.text.en, text_zh: s.text.zh, suffering: s.id }, makeup: [{ type: 'item/material/stone', count: 2 }] })),
]

const lit = 'lit'
/**
 * A shrine given what is cut on it: the offering is taken (gone), it lights, and the story keeps it. What must not
 * be given away is refused first, whatever the shrine asks (`KEPT`), and is not taken.
 */
const OFFERED = (s: Wayshrine): Tree => ({
  if: { has: { role: 'host', status: lit } },
  then: { do: [{ op: 'log', text: L('{host} is already lit.', '{host}已经亮着了。') }] },
  else: {
    if: { any: KEPT.map((tag) => ({ has: { role: 'item' as const, tag } })) },
    then: { do: [{ op: 'log', text: L('{host} stays dark. {item} is not something to give away.', '{host}没有亮起来。{item}不是能献出去的东西。') }] },
    else: {
      if: { is: { role: 'item', sel: s.takes } },
      then: {
        do: [
          { op: 'emit', impulse: 'notify', to: 'item', params: { what: 'consumed' } },
          { op: 'addStatus', status: lit },
          { op: 'vfx', fx: 'sparkle' },
          { op: 'log', text: L(`You lay {item} on {host}. A light kindles in the carving.`, `你把{item}放在{host}上。刻痕里亮起了一点光。`) },
          { op: 'emit', impulse: 'notify', to: 'story', params: { what: 'facts', [`fact.${shrineFact(s.id)}`]: 1 } },
          // an offering made as the Order asks: the one who made it keeps the faith a little more
          { op: 'emit', impulse: 'notify', to: 'actor', params: { what: 'faith', delta: 5 } },
        ] as Effect[],
      },
      else: { do: [{ op: 'log', text: L(`Nothing kindles. {host} asks for ${s.asks.en}.`, `什么也没亮起来。{host}要的是${s.asks.zh}。`) }] },
    },
  },
})

export const PILGRIMAGE_RULES: Rule[] = WAYSHRINES.map((s) =>
  story({
    id: `pilgrim/shrine-${s.id}`,
    doc: `The ${s.id} beacon shrine on the Old Crown Road: laid ${s.asks.en} (G), it takes it, lights (lit), tells the story (${shrineFact(s.id)}) and the one who laid it (faith +5); laid a relic, something important or bound, or a keepsake, it refuses it and does not take it; laid anything else, it says what it asks; lit, it stays lit.`,
    host: { type: `fixture/sacred/wayshrine/${s.id}` },
    on: 'impulse/receive',
    tree: OFFERED(s),
  }),
)
