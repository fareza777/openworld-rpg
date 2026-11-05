# Lexicon: upstream words → Sunshard words

Every word the player reads follows `STORY.md`. This table is the rename map for **display text only**: ids,
entity ids, fact keys, map ids, asset paths, type ids (`item/relic/crown_of_thorns`, `npc.ilse`, `pip`, `meadow`,
`alberic`) **stay as they are** — code, saves and tests key on them.

## Language

The fork's source language is English. New and rewritten text is English only: `{ en: '…' }`, `L('…')` or a plain
string (the `zh` argument of `L()` / `line()` is optional in this fork). Do not keep a Chinese translation of an
upstream line you rewrote — it would say the old story. Leave untouched lines (those that do not mention the old
lore) as they are.

## Names

| Upstream | Sunshard | Notes |
|---|---|---|
| Lumi (the fairy, entity `pip`) | **Kiri**, a star-sprite | "fairy" → "star-sprite" / "sprite"; she is a spark of light with wings |
| Sister Ilse (`npc.ilse`) | **Sister Maren** | keeper of the Hearthshard shrine; raised Corvin |
| Severin, the Greyvowed, the grey man (`npc.severin`) | **Corvin**, the Ashen Wanderer; "the man in grey" stays | last brother of the Ashen Covenant |
| The White Knight Alberic, First Seal-bearer (`alberic`, `npc.alberic`) | **Ser Gavrel the Thornbound**, First Warden | "the White Knight" may stay as what people call him |
| the Church's courier (`npc.courier`) | **the Regent's Herald** | |
| Astra, the First Martyr | **Aurex**, the Fallen Star (the god) / **Halvard the Founder** (the first king) | pick by meaning: worship → Aurex; history of the Crown → Halvard |
| the Five Sufferings, the Five, the five wounds | **the five Regalia** / **the five facets of the Dawn Crown** | a shrine "of five wounds" → a shrine "of the five facets" |
| the First Night | **the Starfall** | |
| the Long Night | **the Dimming** | |
| Seal-bearer(s) | **Warden(s)** | |
| seal (a bearer's), the First Seal | **Regalia**, the first of the Regalia | "a seal falls" → "a Warden falls" |
| the Crown of Thorns (`item/relic/crown_of_thorns`) | **the Briar Diadem** | |
| the five Regalia, by March | **the Briar Diadem** (Eastmarch, Ch 1), **the Ember Chain** (the Scarred March, Ch 2), **the Golden Scales** (the Golden Reach, Ch 3), **the Starfall Wood** (the Mirewood, Ch 4), **the Vigil Lance** (the Silverspire Heights, Ch 5); upstream's item names for Ch 4 ("the Starfall Wood") get renamed when that chapter is written | |
| the Church, the Holy Church | **the Radiant Order**, the Order | its clergy: sisters, brothers, Luminants |
| the Holy City | **Solmere**, the Crown City | |
| the Great Rite | **the Reforging** | |
| pilgrim / pilgrimage (the called one) | **Crownseeker** / **the Crownseeking** | ordinary travellers on a road may stay "pilgrims" when they are just that |
| the Ashen Watch | **the Ashen Covenant** | |
| the Firstlight (the flame) | **the Hearthshard** (its flame) | |
| Firstlight Village | **Emberwick** | map id `meadow` |
| Woundstone Foot / the Mountain Foot's seal stone | **Shardstone Foot** / **the waystone** (a Sunshard waystone, its first facet dark and cracked) | |
| Vesper Ford | **Greywater Ford** | |
| Dawn Hill, dawnbloom, the Chapel of the First Dawn | **Beacon Hill**, **beaconbloom**, **the Beacon Chapel** | |
| the Pilgrim's Road | **the Old Crown Road** | |
| the Pilgrims' Rest | **the Wardens' Rest** | |
| the Abbey of the Thorn, the Order of the Thorn | **Briarmoor Abbey**, **the Briar Knights** (Gavrel's order) | |
| the Kneeling Field | **the Field of Oaths** | the stones are knights who swore to Gavrel, carved kneeling |
| the Sunrise Road / East Road (the knight's kingdom) | **the Eastmarch Road** | |
| the Held Ground | **Thornhold** | |
| the Oath-Thorn (`item/relic/oath_thorn`) | **the Warden's Thorn** | |
| Lumi's boons | **Kiri's gifts** | |
| Emberfall (Ch 2's town) | **Cinderholt** | Ch 2 is sealed in this release; rename where Ch 1 mentions it |
| the Five Lands | **the Five Marches** | |
| the Body (Astra's) | **the Sun Engine** (never named in Ch 1) | |

## Sayings

| Upstream | Sunshard |
|---|---|
| "Suffering is not God's abandonment. It is the proof the debt is being paid." | "Aurex fell so that we might rise. While one shard burns, no house is dark." |
| "May Astra watch over us." | "May the Fallen Star keep us." |
| "None cross that do not kneel." | "None cross for Solmere." |
| "Every seal you break makes the night longer. Ask your Church why." | "Every Warden you bring down makes the night longer. Ask your Regent why." |
