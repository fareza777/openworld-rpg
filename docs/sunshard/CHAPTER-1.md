# Chapter 1 · The Ember Letter — beat sheet

Built on upstream's Chapter 1 maps, scenes, quests and fights (`docs/chapter-1.md` for the mechanics). Every id
stays; what is *said and meant* is this sheet's. Read `STORY.md` (the world) and `LEXICON.md` (the words) first.

## The chapter in one paragraph

You wake in a ruined watch shelter on Cloudtop with no memory, a cracked silver locket and a sunburst scar. A
star-sprite, Kiri, found you in the snow. At Shardstone Foot a Sunshard waystone is dimming, its first facet cracked
and dusted with fresh ash. Below, in **Emberwick**, Sister Maren keeps the **Hearthshard**, a shard-flame that keeps
the Hollowborn out of the village. Two foragers are lost in the barrow; you bring them back, and they say a man in
grey shut the restless dead in with them — and left them bread marked with an ash sun. On the night of thanks the
man in grey, **Corvin**, lifts the Hearthshard's flame into his lantern and walks east over the river on ice. At
dawn the **Regent's Herald** arrives to confiscate the shard for Solmere — too late — and reads the proclamation:
the five Wardens are traitors, the Dimming worsens, and "one who walks with a fallen star" is named **Crownseeker**.
Joss's bridge was torn out by the White Knight of the Eastmarch, who lets no one cross "for Solmere". You mend it
and walk the **Old Crown Road**: the Wardens' Rest, five beacon shrines, the ruined **Briarmoor Abbey** of the
**Briar Knights**, the **Field of Oaths**, a burned farm. Beyond a ring of thorns waits **Ser Gavrel the
Thornbound**, First Warden, the Briar Diadem grown through his helm. Brought down, he sees your locket and says,
"...You have her eyes." The Diadem's light breaks loose; you choose who takes it. That evening the sun sets early.

## Choices (story facts; the scene command `choose`, then `branch`)

| Fact | Where | Options |
|---|---|---|
| `choice.ch1.light` | `crown` scene | `kiri` — "Let Kiri hold it." / `corvin` — "Let Corvin take it." |
| `choice.ch1.tale` | `return` scene | `truth` — "He was holding the river against Solmere." / `legend` — "The White Knight is dead. That is enough." |

People's lines may key on them: `line('fact:choice.ch1.light', …)` fires only when the fact is truthy, so lines for
a specific answer use the scene, not the key; a person's line for "any answer" uses `fact:choice.ch1.light`.

## Scenes and beats (by id)

### Prologue (content `prologue.ts`, tools `prologue.ts`, quests `awakening`, `descent`)

- `summit_wake` etc.: Kiri wakes you. "You're awake! I'm Kiri. I'm a— I think I'm a star-sprite? I found you in the
  snow. You were holding that locket so tight I couldn't open your hand." The only way down: the cut in the south rim.
- The waystone at Shardstone Foot (`stone`): a Sunshard waystone, five facets; the first is cracked and dark, fresh
  ash on it. Kiri: "It's colder near it. Like it's... going out."
- "Try something the world has never seen" stays (the engine's experiments).
- `watch_log` (Cloudtop table): sunset times year on year, each earlier; last page: "Found a small light asleep in
  the snow by the cairn, warm as a coal. Beside it a child's silver locket. No child." (plants Ch 8)

### Emberwick

- `village_arrival`: Maren welcomes you to Emberwick and the Hearthshard ("While one shard burns, no house is
  dark"); Pell wants to draw the sprite; Rowan: two of ours are missing.
- `rescue` quest (Lina, Oskar, the barrow warden): same mechanics. Lina: a man in grey pulled the inner door shut
  from outside, later pushed a loaf under it, marked with an ash sun pressed in by a thumb.
- `warden_falls`: the warden's jaw moves: "The light... is being taken. I could not... lie down." On the altar:
  "WE HOLD THE RIVER UNTIL THE QUEEN'S CHILD RETURNS. — G." and an ash thumbprint.
- `tale` (dusk, Maren tells the children): the Starfall, Aurex, Halvard's Dawn Crown, the Sundering Night when Queen
  Isolde died and the Crown broke into five comets. Kiri shakes at "the star fell burning". Pell: "Kiri? You're
  shaking." — "It's just cold." Maren: "Aurex fell so that we might rise, Pell."
- `vigil` quest (lamp oil from Millbrook, beaconbloom on Beacon Hill, ring the Beacon Chapel bell): the vigil of the
  Hearthshard. The Beacon Chapel is where Halvard's first shard-fire was lit.
- `night_flame`: the night of thanks. Corvin lifts the Hearthshard's flame into his lantern. Holt: "Thief!" Corvin:
  "...They come for it at dawn." He walks east over the river on ice. (Maren knows him: she says nothing.)
- `ford_night`: Hesper saw the grey man walk on her river; the ice melted behind him.
- `letter`: at dawn **the Regent's Herald** in gold and black arrives with soldiers to take the Hearthshard to
  Solmere — finds the shrine cold. Reads the proclamation (the five Wardens are oathbreakers; the Dimming; the
  Reforging). "It is written: one who walks with a fallen star shall gather the Crown. You." He stares at Kiri;
  Kiri hides behind you ("I don't like his sun. The one on his coat.") Gives `item/document/proclamation` (the
  Regent's Writ). Maren: "When you are ready, Crownseeker, come to me."
- `fennick_memory`: Fennick was Gavrel's squire in the Briar Knights, nineteen years ago, the night of the Sundering;
  Gavrel rode into Emberwick at dawn with "something under his cloak, wrapped against the cold", and rode out without
  it. The Diadem was eating him even then: one morning he asked Fennick his name. "If he asks yours, tell him."
- `hesper_stumps`: thorns driven into the stumps; Aldo and Joss built the bridge. "Mend it. Then tell that knight
  whose bridge it was."

### The Old Crown Road (content and tools `pilgrimage.ts`; the `first_seal` quest objectives)

- The Wardens' Rest: a waystation of the Regent's road-wardens; its keeper asks every Crownseeker to swear the
  **Regent's oath** at the altar of the five facets (the oath mechanic stays: kneel at the altar).
- Five beacon shrines along the road: each a dead Sunshard beacon of Queen Isolde's road; the player relights or
  reads each (their mechanics stay; their words: the five Regalia and the Marches they flew to).
- Briarmoor Abbey (north of the road): the Briar Knights' house. The writ: a **writ of recall** from Solmere
  ordering Gavrel to bring the Diadem to the capital, never answered. The order's seal from its last keeper.
- The Field of Oaths: stones carved as kneeling knights — the Briar Knights who swore to hold the river with him.
- `edda_barn`: Edda — the white knight took everything that shone (the shards in her lamps, her husband's ring
  with a shard chip); the grey man pulled her out of the burning barn. "Don't tell them in the village."
- `severin_warning`: Corvin on the road: "Crownseeker, go back. The knight beyond those thorns has held this
  river for nineteen years. Against Solmere. Not against you." "The Regent wants his Diadem. Take it, then; I will not
  stop you." "Only, when it comes off, light will come out of it. That light should not go west." He looks at Kiri a
  long time.

### The Eastmarch Road and the knight (tools `chapter1.ts` `CHAPTER1_SCENES`)

- `kingdom`: thorns, kneeling stones, the knight. "None cross for Solmere." "Another of the Regent's hounds. They
  always send another." "I hold. I... hold. I no longer remember what for." Kiri warns of the thorn ring.
- `crown`: he falls, kneels, lifts the Diadem off. Sees the locket at your throat. "...You have her eyes." "Take it.
  It was never mine to keep. Only to keep from *him*." Light comes loose. **Choice** `choice.ch1.light`. Kiri path:
  the light runs to Kiri (the boon), Corvin arrives too late: "...Then keep her close. Closer than you think."
  Corvin path: Corvin opens the lantern, the light goes in; Kiri still catches a thread of it (the boon is always
  given — the game's progression needs it). Either way Corvin: "Every Warden you bring down makes the night longer.
  Ask your Regent why." `night.shift` stays.
- `oath_thorn` / `haven_first` (Thornhold): a green thorn of the Diadem, warm; Gavrel's shade keeps Thornhold for you
  ("I swore to hold until I was relieved. You relieved me."). He asks your name — "This time, I would like to keep
  one."
- `return`: Emberwick sees the Diadem. **Choice** `choice.ch1.tale`. Rowan, Maren, Nessa: "Four minutes. The sun set
  four minutes early tonight." (Five, if Corvin did *not* take the light: `choice.ch1.light` = `kiri`.)
- `chapter_end`: the card — "CHAPTER ONE · THE EMBER LETTER" — and "Chapter Two, *Ashes of Cinderholt*, waits for the
  next update." The road east stays sealed in this release (`world.ch2` is not set).
