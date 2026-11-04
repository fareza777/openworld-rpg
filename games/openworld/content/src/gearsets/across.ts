// The two sets that cross the whole main line (docs/sets.md §4): the Pilgrims Before, a piece on a pilgrim's bones in
// each chapter, each of another century and each at its chapter's level; and the Five Seals, each Seal-bearer's own
// piece, which it surely drops when it falls (the loot module's trophy: ontology.ts names it on the boss's kind).

import { F, P, type SetDef } from './kit.ts'

export const ACROSS_SETS: SetDef[] = [
  {
    id: 'pilgrims', en: 'The Pilgrims Before', zh: '先行朝圣者', chapter: 'all', level: 11, lean: 'any', look: 'undyed',
    palette: ['#b5a585', '#5a4a32', '#c0993c', '#ece6d6'],
    pieces: [
      P('head', F.hat, "Pilgrim's Wide Hat", '朝圣者的宽檐帽',
        'A wide hat of felted wool, a scallop pinned to the brim. Inside the crown, in ink gone brown: AELIS OF VARROW. It lay in the grass a little way from the oldest stone on the Field of Oaths, as if it had been knocked off.',
        '', 'map:kneelfield', undefined, { level: 4, shape: 'wide' }),
      P('feet', F.boots, "Pilgrim's Road-boots", '朝圣者的远行靴',
        'Boots resoled so often that the uppers are a hundred years older than the soles. Burned into the heel: BROTHER TEOBALD, THE 289TH YEAR OF THE CROWN. He came this far east.',
        '鞋底换过太多次，鞋面比鞋底老了一百年。鞋跟上烙着：特奥巴尔德修士，持冠第二百八十九年。他往东走到了这里。', 'map:pass', undefined, { level: 6 }),
      P('waist', F.belt, "Pilgrim's Rope Belt", '朝圣者的绳带',
        'A rope belt knotted five times, once for each facet of the Dawn Crown. It was found on the salt beside no one. Stitched to it, a tag of leather: BROTHER ALDRIC, THE 301ST YEAR. FOUND LIGHT.',
        '', 'map:saltpans', undefined, { level: 12, shape: 'rope' }),
      P('hands', F.gloves, "Pilgrim's Gloves", '朝圣者的手套',
        'Gloves worn through at the fingertips, from counting prayer knots. They were found in the water of the Drowned Graves on hands that were still counting. THE 339TH YEAR, and a name the fen has eaten.',
        '指尖磨穿了的手套，是数祈祷结数出来的。在溺亡者墓地的水里找到，戴着它的那双手还在数。三三九年，名字被泥沼吃掉了。', 'map:drowned', undefined, { level: 15 }),
      P('shoulders', F.cloak, "Pilgrim's Mantle", '朝圣者的披肩',
        'A grey mantle, not a white one. Whoever wore it climbed the White Stair in their own clothes, and was buried by the way in them, against the brothers\' custom. THE 361ST YEAR.',
        '一件灰色的披肩，不是白的。穿它的人穿着自己的衣服爬上白阶，也穿着它被葬在了路边，没有照修士们的规矩。三六一年。', 'map:whitestair', undefined, { level: 17 }),
      P('body', F.robe, "Pilgrim's Habit", '朝圣者的僧袍',
        'A habit folded and laid at the door of the Crown Chapel, a scallop on top of it. Sewn into the collar, a name and THE 371ST YEAR. The name has been cut out.',
        '', 'map:confluence', undefined, { level: 20, shape: 'habit' }),
    ],
    bonuses: [
      { pieces: 2, props: { moveHaste: 0.05 } },
      { pieces: 4, props: { dodge: 0.05, xpRate: 0.1 } },
      { pieces: 6, vow: 'pilgrim' },
    ],
  },
  {
    id: 'fiveseals', en: 'The Five Wardens', zh: '', chapter: 'all', level: 10, lean: 'any',
    palette: ['#393940', '#1a1a20', '#a23a3a', '#c8cbd6'],
    pieces: [
      P('ring', F.ring, 'Signet of the First Warden', '',
        'A signet of white gold, cut with a briar: the mark of the first of the Regalia. Ser Gavrel wore it under his gauntlet for nineteen years, against the skin.',
        '', 'boss:alberic', { critChance: 0.02 }, { level: 5 }),
      P('waist', F.belt, 'Cord of the Second Warden', '',
        'A red cord knotted round an iron seal stamped with a flame. Matthias wore it under the Ember Chain. The cord has been dyed again and again, never with dye.',
        '', 'boss:matthias', { attackHaste: 0.04 }, { level: 9, shape: 'cord' }),
      P('neck', F.amulet, 'Weight of the Third Warden', '',
        'A little black weight on a chain, struck with a pair of scales. It is as heavy as a stone ten times its size. Ele wore it at the throat.',
        '', 'boss:ele', { cdr: 0.04 }, { level: 12, shape: 'weight' }),
      P('feet', F.boots, 'Spur of the Fourth Warden', '',
        'Pale riding boots with a single spur, its rowel cut in the shape of a lantern. Nacht\'s horse bore no mark of it. It was not for the horse.',
        '', 'boss:nacht', { moveHaste: 0.05 }, { level: 15, shape: 'spur' }),
      P('ear', F.earring, 'Murmur of the Fifth Warden', '',
        'An earring of white bone carved with a lance. Held to the ear, it murmurs a question in hundreds of voices. It is always the same question.',
        '', 'boss:witnesses', { critDamage: 0.1 }, { level: 18, shape: 'bone' }),
    ],
    bonuses: [
      { pieces: 2, props: { atk: 2 } },
      { pieces: 3, props: { def: 3 } },
      { pieces: 4, props: { critChance: 0.08 } },
      { pieces: 5, power: 'nightkept' },
    ],
  },
]
