// Sister Maren, keeper of Emberwick's shrine and its Hearthshard (docs/sunshard/STORY.md §4, CHAPTER-1.md): a sister of the
// Radiant Order, graceful, gentle and a little absent-minded, motherly in every small care and honestly devout; white-haired and
// red-eyed from birth, her eyes weak in bright light, so she knows people by their step. Brother Anselm serves in her shrine. A
// novice of sixteen, she raised a foundling left on the shrine's step, who went away at ten and became Corvin, the man in grey;
// she knows his walk, and tells no one. She leaves the shrine door unlatched every night for Lina, who will not ask.

import { line, type PersonDef } from '../person.ts'

export const ilse: PersonDef = {
  id: 'npc.ilse',
  // the main story needs them where they are: not asked to move to a home ground (content social.ts residence)
  tags: ['storybound', 'devout'],
  role: 'priest',
  essential: true,
  name: { en: 'Sister Maren' },
  gender: 'female',
  look: { parts: { hair: 'hair.braid', face: 'face.soft', outfit: 'outfit.vestment', hat: 'hat.hood' }, colors: { hair: 'snow', eyes: 'ember', skin: 'fair', 'outfit.1': 'ivory', 'outfit.2': 'madder', 'hat.1': 'ivory' } },
  age: 46,
  temperament: { personality: 'gentle', manner: 'polite', social: 'outgoing', outlook: 'hopeful' },
  ties: { 'npc.rowan': 'old friend', 'npc.severin': 'raised him', 'npc.anselm': 'serves in her chapel', 'npc.lina': 'watches over her' },
  // what they sell (fits who they are; content items.ts prices it)
  trade: { stock: [['item/light/candle', 6], ['item/vessel/flask/holy_water', 1], ['item/food/bread', 2]] },
  purse: 15,
  schedules: {
    default: [
      [22, 6, 'meadow.church:bed.1', 'sleep'],
      [6, 22, 'meadow:shrine.tend', 'tend the Hearthshard'],
    ],
    'fact:ch1.flame_stolen': [
      [22, 6, 'meadow.church:bed.1', 'sleep'],
      [6, 22, 'meadow:shrine.tend', 'sweep the cold altar'],
    ],
  },
  lines: [
    // a chat (the talk's `chat` verb, docs/npc-sandbox.md §2.15): small talk in their own voice; what they like best is said beside these
    line('chat', "You've come a long way. There is bread by the shrine; please, help yourself. ...The Fallen Star would want you fed before the road."),
    line('chat', "Brother Anselm reads aloud when he thinks the chapel is empty. I always mean to tell him I'm there... and every time I'm listening too closely, and forget.", '安塞姆修士以为礼拜堂里没人的时候，会把书念出声来。我总想告诉他我也在……可每次都听入了神，又忘了说。'),
    line('chat', 'I came out to fetch something... what was it? No matter. If I stand here a little, it will come back to me.', '我出来是要拿什么东西的……是什么来着？不要紧，在这里站一会儿，总会想起来的。'),
    line('chat', 'Lina says she needs no one. So I never latch the chapel door at night. That way she never has to ask.', '莉娜总说她谁也不需要。所以夜里我从不闩礼拜堂的门，这样她就不必开口求人了。'),
    line('chat', 'Every morning, when the sky grows light, I thank Aurex that the night is over. I have done it since I was a novice. In thirty years I have not missed a single morning.'),
    line('chat', "Ah, it's you. I know your step by now. My eyes have been weak in the light since I was a child; by day, faces are always a blur to me, so I go by my ears. From now on, when you come, you needn't say a word. I'll know it's you.", '啊，是你呀。你的脚步声，我已经记住了。我的眼睛从小就怕光，白天看人总是模模糊糊的，只好靠耳朵。所以往后你来，不用出声，我也认得出是你。'),
    line('chat', 'Nessa comes for candles every week, four at a time. She works out her sunsets by lamplight, and says that when the light is poor she copies the numbers wrong.', '奈莎每个礼拜都来拿蜡烛，一次拿四支。她夜里点着灯算日落的时辰，说光一暗，数字就会抄错。'),
    line('chat', 'Pell draws the road east, over and over. It is the way his father went. I keep every drawing he gives me.', '佩尔总是画往东去的那条路，画了一张又一张。他父亲就是从那条路走的。他送给我的画，我每一张都收着。'),
    line('chat', 'Some mornings there is beaconbloom on the shrine before I get there, with the dew still on it. I have never asked who leaves it.', { mood: 'happy' }),
    line('chat', 'A baby was left on the shrine step once, the winter I was sixteen. I raised him as well as a novice could. He went away when he was ten. I still keep his cup on the shelf.', { once: true }),
    line('favourite', "I'm a little ashamed to say it, but even a nun has a fondness. Mine is {favourite}. ...Please keep it from Brother Anselm.", '说来有些难为情，修女也有偏爱的东西。我喜欢的是{favourite}。……请别让安塞姆修士知道。', { mood: 'shy' }),
    // the news the story spreads (its topics), said once while fresh
    line('topic:crown', 'You keep the Diadem with you, then. Nessa says it hums at night, so I sang a hymn for sleeping over your pack while you were at the well. ...It did seem a little quieter.'),
    line('greeting:first', 'Welcome to Emberwick, traveller. Your hands are cold; please, come closer. This is our Hearthshard. They say it is a piece of the star that fell, and it has kept this village warm since before anyone can remember. While one shard burns, no house is dark.'),
    line('default', 'Aurex fell so that we might rise. While one shard burns, no house is dark. That is the first thing the Order taught me, and the first thing I teach the children.'),
    line('default', 'The Hearthshard is older than any house in Emberwick. The old keeper told me the first houses were built around it, so that someone would always be near to tend it.'),
    line('hour:morning', 'Good morning. I have just thanked Aurex that the night is over, and said one for you as well.', { mood: 'happy' }),
    line('hour:evening', "The evenings come sooner. Every week I light the lamps a little earlier, and write each one down. ...Only I've forgotten which book I wrote them in.", '黄昏一天比一天早了。我每个礼拜都提早一点点灯，每次都记下来。……只是记在哪一本册子上，我又忘了。'),
    line('hour:night', "It's very late. The flame keeps watch at night; you needn't. ...Sleep well, and come and see me tomorrow.", '已经很晚了。守夜有圣火，你不必陪着。……好好睡一觉，明天再来看我吧。'),
    line('weather:rain', "You're soaked through. Stand by the flame a while, and I'll find you something dry.", '你都淋透了。到火边站一会儿吧，我去给你找件干衣服。'),
    line('weather:storm', "On nights like this I count the doors I hear close. ...Go home early, will you? I'd like to count yours too.", '这样的夜里，我会数着听见了几扇门关上。……早些回家好吗？我也想听见你的那一扇。', { mood: 'sad' }),
    line('fact:village.rescued', "Lina and Oskar are home safe. Thanks be to the Fallen Star, and to you. Tonight the whole village gives thanks at the Hearthshard. You will come, won't you? I'll keep you a seat near the fire.", { once: true, mood: 'happy' }),
    line('fact:village.rescued', "Lina once asked me, as if it were nothing, whether a prayer counts for someone no one visits. Every prayer counts. I didn't ask her for whom.", '莉娜有一回像是随口问我：一个没人去看的人，替他祈祷，算不算数。每一句祈祷都算数。我没有问她是替谁问的。', { once: true }),
    line('fact:ch1.flame_stolen', 'Some people take a thing to keep it.', '有些人拿走一样东西，是为了守住它。', { mood: 'sad' }),
    line('fact:ch1.flame_stolen', 'I still sweep the altar every morning, the taper still in my hand. ...My hands are slower than my heart to believe the flame is gone.', '我每天早上还是去扫祭坛，手里照旧拿着点火棒。……心里知道火已经不在了，手却还没习惯。', { mood: 'sad' }),
    line('fact:ch1.flame_stolen', "The way you stand reminds me of someone I knew. Shoulders always braced, as if the sky might fall at any moment. ...Do sit a while. I'll make tea.", '你站着的样子，很像我从前认识的一个人。肩膀总是绷得紧紧的，好像天随时会塌下来。……坐一会儿吧，我去沏茶。', { once: true }),
    line('fact:ch1.letter', 'The Herald says the Dawn Crown must be made whole, and that you are the one to gather it. The first of the five Wardens holds the river east of here. Go to him, Crownseeker. ...And before you set out, please, eat a proper meal.'),
    line('fact:ch1.letter', 'I remember everyone I have blessed by their footsteps. Please come back, so that I may hear yours again.'),
    line('fact:ch1.crown', 'The Briar Diadem, here in our village. I never thought I would see a piece of the Dawn Crown with my own eyes. Keep it close to you, please, but not against your heart.', { once: true }),
    line('fact:choice.ch1.light', 'The children say a light came out of the Diadem when the knight fell. I have read the Order\'s books all my life, and not one of them says that a Regalia holds anything inside it.', { once: true }),
    line('fact:ch3.scale', 'The sun set at six tonight. I rang the bell for vespers in the dark. The children have started asking what the bell is for.', '今晚太阳六点就落了。我是摸黑敲的晚祷钟。孩子们开始问我，这钟是为什么敲的。'),
    line('fact:ch4.wood', 'Nessa wrote to me from the Fens. She says a grey man walks with you now, with a lantern. ...If he is who I think he is, tell him the chapel door is not locked. It never was.', '奈莎从林沼给我写了信。她说现在有个提着灯的灰衣人跟你一起走。……要真是我想的那个人，告诉他，礼拜堂的门没锁。从来都没锁过。', { once: true, mood: 'sad' }),
    line('fact:ch5.lance', 'I light the taper at four now. I have stopped telling people it will be better soon. I tell them the morning will come. It always has.', '我现在四点就点蜡烛了。我不再跟人说很快就会好起来。我跟他们说，早晨总会来的。它向来都会来。'),
    line('fact:ch1.end', 'He always did carry things that were too heavy for him.', '他从小就是这样，总要背些他背不动的东西。', { mood: 'sad' }),
    line('given', "Is this for me? ...Thank you. I'll set it on the shrine first, so the Fallen Star may see it too, and quietly take it back tonight.", { mood: 'happy' }),
  ],
}
