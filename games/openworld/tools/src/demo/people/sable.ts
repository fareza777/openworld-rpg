// Sable Vire, the rival Crownseeker (docs/sunshard/STORY.md §4): the Lord Regent's daughter, raised to believe she is the
// lost heir, and sent to gather the Regalia ahead of the hero. Fast, proud, lonely; a shadow-sprite, Umbra, at her
// shoulder (said in the scenes: she has no figure of her own yet). She arrives everywhere first or second, and can end the
// story an enemy, a rival who walks away, or a sister in all but blood. In the story's scenes only.

import { line, type PersonDef } from '../person.ts'

export const sable: PersonDef = {
  id: 'npc.sable',
  // the main story needs her where its scenes put her: not asked to move to a home ground (content social.ts residence)
  tags: ['storybound'],
  role: 'soldier',
  essential: true,
  name: { en: 'Sable Vire' },
  gender: 'female',
  look: { parts: { hair: 'hair.ponytail', face: 'face.keen', outfit: 'outfit.travel', hat: null }, colors: { hair: 'black', eyes: 'sky', skin: 'fair', 'outfit.1': 'charcoal', 'outfit.2': 'ochre' } },
  age: 19,
  temperament: { personality: 'proud', manner: 'polite', social: 'reserved', outlook: 'hopeful' },
  ties: { 'npc.courier': "her father's Herald" },
  schedules: {
    default: [[0, 24, 'offstage:sable.hide', 'ride ahead']],
  },
  lines: [
    line('chat', 'My father says the Crown chooses its bearer. I intend to be standing nearest when it does.'),
    line('chat', 'Umbra does not like you. Do not take it to heart. Umbra does not like anyone but me.'),
    line('default', 'Still behind me, Crownseeker? Do try to keep up.'),
    line('fact:ch2.chain', 'You took the Chain before I reached the yard. ...Enjoy it. There are three more, and I do not lose twice.', { mood: 'angry' }),
  ],
}
