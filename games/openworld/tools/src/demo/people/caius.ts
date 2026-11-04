// Father Caius, the Radiant Order's priest at the Wardens' Rest on the Old Crown Road (docs/sunshard/CHAPTER-1.md): kind,
// tired, certain. He takes the Regent's oath at the altar of the five facets and sends the Crownseeker on. He knows Solmere
// recalled the First Warden, and that the knight never answered: he was told it was not a Crownseeker's concern, and has
// decided to believe it.

import { line, type PersonDef } from '../person.ts'

export const caius: PersonDef = {
  id: 'npc.caius',
  role: 'priest',
  essential: true,
  // the main story needs them where they are: not asked to move to a home ground (content social.ts residence)
  tags: ['storybound', 'devout'],
  name: { en: 'Father Caius', zh: '凯乌斯司铎' },
  gender: 'male',
  look: { parts: { hair: 'hair.cropped', face: 'face.weary', outfit: 'outfit.vestment' }, colors: { hair: 'steelgrey', eyes: 'storm', skin: 'light', 'outfit.1': 'ivory', 'outfit.2': 'indigo', 'outfit.3': 'gold' } },
  age: 61,
  temperament: { personality: 'devout', manner: 'polite', social: 'reserved', outlook: 'hopeful' },
  ties: { 'npc.ilse': 'old correspondent' },
  trade: { stock: [['item/light/candle', 6], ['item/vessel/flask/holy_water', 2], ['item/food/bread', 3]] },
  purse: 25,
  schedules: {
    default: [
      [21, 6, 'waystation.chapel:caius.bed', 'sleep'],
      [6, 12, 'waystation.chapel:caius.altar', 'keep the altar of the five facets'],
      [12, 21, 'waystation:caius.porch', 'watch the road for travellers'],
    ],
  },
  lines: [
    // a chat (the talk's `chat` verb, docs/npc-sandbox.md §2.15): small talk in their own voice; what they like best is said beside these
    line('chat', 'I set out as a pilgrim myself, when I was young. I got as far as this Rest, and stayed. Someone has to keep the door here.', '我年轻时也是朝圣者。走到这座驿站，就没再往前走，留了下来。这里总得有人守着门。'),
    line('chat', 'Have some tea before you go, if you have the time. The well here is deep and the water is good; pilgrims fill their skins here before they go east.', '有空的话，喝杯茶再走。这里的井打得深，水好，朝圣者往东去之前，都在这里把水囊灌满。'),
    // (a first meeting may come before the knight falls or after: it says nothing of him either way — `rest_after` and
    // his line on the knight's fall are what he says once the road is open)
    line('greeting:first', 'Peace on your road, traveller. I am Father Caius. Solmere keeps me at this Rest to take the Regent\'s oath from those it sends east, and to keep the altar of the five facets.'),
    line('default', 'Aurex fell so that we might rise. I say it at the altar every morning, and on the hard mornings I say it twice.'),
    line('default', 'There are five beacon shrines on the road, one for each of the Regalia. Lay at each what it asks: a thing for the head, a cord, a meal, metal, a light.'),
    line('default', "They say the Warden on the Eastmarch Road was a gentle man once. I never met him; that is how Wynn's old rhyme tells it."),
    line('hour:evening', 'Evening has come early again. I write the hour in my book, and Sister Maren writes it in hers, and we send each other the numbers by the travellers.'),
    line(`fact:ch1.writ`, "You found the writ. ...Yes. I knew Solmere had recalled him. I was told it was not a Crownseeker's concern, and I decided to believe it. Go on. Don't look at me like that.", { once: true, mood: 'sad' }),
    line('fact:sins.defeated.alberic', 'Nineteen years he held that river, and in the end it took one traveller and a star-sprite. The Fallen Star forgive us for letting him hold so long.', { mood: 'sad' }),
    line('fact:sins.defeated.alberic', 'The road east is open. Go on when you are ready, Crownseeker. Four more Wardens wait, and the Briar Diadem is only the first of the five Regalia.'),
  ],
}
