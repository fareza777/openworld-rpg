# SUNSHARD: The Sundered Crown — story bible (canonical)

Status: **canonical for this fork** (2026-11-04, revised the same day: the creative pass). It replaces the upstream
setting (`docs/lore.md`: the Five Sufferings, Astra, the Seal-bearers). Upstream's maps, art, audio, engine and
systems are kept; the story, the world's history, the cast's identities and every word the game says are this
document's. Where an upstream file still holds old-story words, it is a bug to fix (see `LEXICON.md`).

Tone: epic dark-fantasy with warmth. Plain, concrete sentences; people tell only what they know; the world's
history comes through hearsay, ruins and objects. Mystery first, answers late, nothing the early chapters say is a
lie — only a misreading.

---

## 0. The idea in one line

> **Light is memory.** The realm is forgetting its sun, and you are what it forgot.

Sunshards are not stone that glows. They are *remembering*, crystallised: the fallen star's memory of the sky, and
the memories of everyone who died within sight of a shard. A shard burns as long as it is remembered. The Dimming is
the realm forgetting — and the hero, who wakes on a mountain remembering nothing, is the same loss in one person.
Every system the player touches says this: the nights lengthen as the hero remembers more, the companion is made of
a memory, the bosses are knights who traded their own memories to keep a secret.

### Design pillars

1. **Every win costs light.** Progress and darkness grow together. The player always knows the price (the sunset
   comes earlier, and the game counts it), so every boss is a decision, not a gate.
2. **Remembering is gameplay.** Each Regalia gives back one of the hero's memories as a short playable scene in the
   past, on the same maps, with the same people nineteen years younger.
3. **Mercy is a path, not a dialogue option.** A Warden can be brought down, or *relieved* — the slower way, a quest
   that finds what they forgot. The two leave different worlds behind.
4. **The world keeps score.** Facts set by the player are read by people, places, prices, the night's monsters and the
   endings. Nothing a choice changes is only words.
5. **One rival, the whole way.** Another Crownseeker races the hero to every Regalia, with a star-sprite of her own.

## 1. The world in one page

**Valdoria**, a kingdom on the continent of **the Sunward Reaches**, once lived "under two suns": the sky's sun and
the light of the **Dawn Crown**.

- **The Starfall** (≈600 years ago). A god-star, **Aurex**, fell burning out of the sky. Its body broke on the land
  and its heart scattered as **Sunshards**. Where shards lay, fields bore twice, winters softened, and the
  **Hollowborn** — things made of what the world has forgotten — could not walk.
- **The Founding.** The clan-lord **Halvard** gathered the five greatest shards and had them forged into the **Dawn
  Crown**. Worn by one of his line, the Crown bound every lesser shard in the land into one light: the realm's "second
  sun". The faith that grew around it is **the Radiant Order** ("Aurex fell so that we might rise").
- **The Sundering Night** (19 years ago). In the capital **Solmere**, Queen **Isolde** was killed in the Crown Chapel.
  That same night the Dawn Crown broke into **five Regalia**, which flew like comets to the five Marches. The infant
  heir vanished. Each Regalia was taken up by one of the Queen's five sworn knights, the **Wardens**.
- **The Regency.** The Queen's cousin, **Lord Regent Caedmon Vire**, rules from Solmere "until the Crown is whole".
  The Radiant Order, under **High Luminant Sabine Ostrell**, preaches that the Wardens are oathbreakers.
- **The Dimming** (now). Each month the sun sets earlier. Crops fail; the Hollowborn grow bold; the dead do not lie
  still. The Regent's proclamation: the Dimming ends when a **Crownseeker** brings the five Regalia home and the Crown
  is **reforged**.

## 2. The truth, in layers (revealed in order — never earlier)

| Layer | What the player comes to know | Chapter |
|---|---|---|
| 1 | The surface: the Wardens are mad tyrants hoarding the Regalia; the Ashen Covenant are thieves; the Regent is the realm's hope. | 1–2 |
| 2 | **Each Regalia holds one of the hero's memories.** Taking one up returns a scene from a past the hero does not recognise — and makes the night longer. Something under Solmere drinks what the Wardens held. | 2–4 |
| 3 | **Isolde's lock.** On the Sundering Night the Queen learned that the Crown does not *make* light — it *takes* the realm's memory to feed the Regent's **Sun Engine**. She broke it, and poured her infant's memories and true name into the five pieces as they flew, so that the Crown could only be made whole again by a living heir who remembered everything. The Wardens were not hoarding treasure: they were guarding a child's memory. **And the prophecy that named the hero was written by the Regent** — he has known who the hero is from the first day, and the Crownseeking is a road built to bring the key home. | 5 |
| 4 | **The heir.** The hero is Isolde's child. Ser Gavrel carried them out of the burning chapel; the Cloudtop watchman raised them; the Regent murdered the Queen. **Sable**, the rival Crownseeker, is the Regent's own daughter, raised to believe *she* is the heir. | 6–8 |
| 5 | **Aurex is not dead.** The star lies chained beneath Solmere, made to forget the sky so that its light can be drawn off. **Kiri** is its last memory of the sky — the one thing it would not give up — and she found the child who had also been made to forget. | 9 |
| 6 | **The choice.** What the realm should remember, and who pays for it. | 10 |

Every layer is planted in Chapter 1 and nothing there is false: the watchman's log ("the young one asks where they
came from… I swore to Ser G."), Kiri asking how old she is, the warden's altar ("until the Queen's light comes
home"), Fennick's memory of Gavrel riding up the mountain road with something wrapped against the cold, the Herald's
too-convenient prophecy, Gavrel's "…You have her eyes", the sunset four (or five) minutes early.

## 3. Factions

| Faction | Seat | Wants | Face in Ch 1 |
|---|---|---|---|
| **The Regency** | Solmere | the heir and the five Regalia brought to the Sun Engine | the Regent's Herald and his proclamation |
| **The Radiant Order** | Solmere, chapels everywhere | faith, order, the Reforging; most of its clergy are honest and do not know the truth | Sister Maren of Emberwick |
| **The Five Wardens** | the Marches | to keep their piece of the lock from Solmere, at any cost; each Regalia eats its bearer's own memories | Ser Gavrel the Thornbound |
| **The Ashen Covenant** | nowhere; outlawed | once the Queen's keepers of the shard-flames; they steal shard-fire to keep it from the Engine | Corvin, the Ashen Wanderer |
| **The Free Marches** (Ch 7+) | the five March towns | to rule themselves once the Crown's grip ends | — |

## 4. The cast

The **portrait/sprite asset ids** are upstream's and stay as they are; only names and identities change.

| Role | Name (display) | Asset / entity id | Who they are |
|---|---|---|---|
| Protagonist | the player's own (the creator); NPCs say "traveller", later "Crownseeker" | player | Wakes on Cloudtop with no memory and a cracked silver locket. Raised there in secret by the Crown's sunset-watchman, who went down the cut to look at "something moving" and did not come back. Isolde's child (Ch 8). Silent, with choices. |
| Companion | **Kiri**, a star-sprite | `pip`, portrait `lumi` | A spark of light with wings who came to the watchman's window. Cheerful, curious, brave; asks how old she is; afraid of the Regent's sun. Catches the light of fallen Regalia (her gifts) and changes with what she holds. Aurex's last memory of the sky (Ch 9). |
| Mentor | **Sister Maren** | `npc.ilse`, portrait `ilse` | Keeper of Emberwick's Hearthshard. Raised a foundling boy who became Corvin. An honest believer whose faith breaks in Ch 4 — and who then keeps the shrine anyway, for the village, not the Order. |
| Rival → ally | **Corvin**, the Ashen Wanderer | `npc.severin`, portrait `severin` | 30, grey cloak, ash-dark hands, a hooded brass lantern that holds stolen light. Never harms anyone; says one sentence too few. Knows the Engine exists; does not know the heir lives until Ch 5. |
| The rival | **Sable Vire** and her shadow-sprite **Umbra** | (Ch 2 cast; a look from the creator's table, Umbra a recoloured sprite) | The Regent's daughter, the second Crownseeker, raised as "the true heir". Fast, proud, lonely; races the hero to every Regalia. Can end the game as an enemy, a rival who walks away, or a sister in all but blood. |
| First boss | **Ser Gavrel the Thornbound**, First Warden | `alberic` | Isolde's First Warden, who carried the infant out of the burning chapel. The Briar Diadem has eaten his memory; he remembers only that he must **hold the river** against Solmere. Dying, he sees the locket: "…You have her eyes." His shade keeps Thornhold. |
| Antagonist | **Lord Regent Caedmon Vire** | (Ch 6 cast) | Charming, patient, sincere: he believes a realm that forgets its griefs would be a kinder one, and he means to be the one who decides what it forgets. |
| Antagonist | **High Luminant Sabine Ostrell** | (Ch 5–6 cast) | The Order's head; knows half the truth; can be turned in Ch 6. |
| Village | Headman **Rowan**, Joss the bridgewright, Pell the boy who draws, Nessa the almanac-maker, Fennick (Gavrel's old squire), Hesper the ferrywoman, Edda of the farmstead, Holt of the watch, Lina and Oskar the foragers | upstream ids | Their names stay; their histories and lines are this bible's. |

## 5. Systems the story is made of

| System | What it is | Built on (upstream) |
|---|---|---|
| **The Daylight Ledger** | The hour of sunset is a world value the player can read (Nessa's almanac, the clock). Each Warden brought down moves it earlier; a Warden relieved, a shard rekindled, light taken back from Corvin's lantern move it later. It sets how long the night's monsters walk, how crops grow, what shops charge for oil — and which endings are open. | `night.shift` and `calendar.ts` night hours |
| **Ember Memories** | Each Regalia returns one memory as a short playable scene in the past, on the same maps nineteen years younger (Ch 1's: the Sundering Night, played as Gavrel, riding through Emberwick with the infant). | scenes (`story.ts`), `place`/`warp`, the map builders |
| **Brought down or relieved** | Every Warden can be fought, or relieved through a quest that finds what they forgot (an object, a name, a person). Relieved: less darkness, a weaker gift, a living ally later. | quests (`quests.ts`), the boss encounter's defeat rules |
| **Kiri's light** | Kiri's gifts (the boons) grow with the light she holds; how much she was given (C1 and after) changes her lines, her glow and her last scene. | the boons module, the companion |
| **Corvin's lantern** | The light the player lets Corvin take is not lost: once, in Ch 5 or later, it can be asked back — to undo one step of the Dimming, or to save one town. | story facts |
| **The race** | In each chapter Sable arrives somewhere first or second, depending on what the player did first; the town she reaches first becomes the Regency's. | facts and people's schedules |

## 6. The player's choices (the world remembers)

Choices are story facts (`choice.*`), read by people's lines, scenes, quest stages and the ending.

| # | Chapter | Choice | Facts | What changes |
|---|---|---|---|---|
| C1 | 1, the Briar Diadem | Who takes the loose light when Gavrel falls: **Kiri** (she grows brighter; her gift is stronger) or **Corvin's lantern** (he owes you; the light can be asked back later) | `choice.ch1.light` = `kiri` \| `corvin` | Kiri's gift and glow; Corvin's trust; Nessa's count (five minutes early, or four) |
| C2 | 1, the homecoming | Tell Emberwick the truth of Gavrel (a loyal knight) or let them keep the tale (a tyrant slain) | `choice.ch1.tale` = `truth` \| `legend` | Rowan's and Fennick's lines; a memorial at the Ford (truth); how Emberwick greets the Herald when he returns |
| C3 | 2, opening | The Herald returns for the Diadem: hand it over, or refuse | `choice.ch2.diadem` = `herald` \| `kept` | the Regency's escort or the Covenant's contact; the Ledger |
| C4 | 2–5 | Each Warden brought down or relieved | `choice.chN.warden` = `felled` \| `relieved` | the Ledger; who stands with the hero in Ch 7 |
| C5 | 5 | Ask Corvin's light back, or leave it with him | `choice.ch5.lantern` | one step of the Dimming undone, or one town saved |
| C6 | 6 | Expose Sable as the Regent's decoy, or keep his secret for her sake | `choice.ch6.sable` | Sable's ending (enemy, rival, sister) |
| C7 | 6 | Turn Sabine or bring her down | `choice.ch6.sabine` | the Order in the civil war |
| C8 | 10 | The last choice (below) | `choice.ch10.end` | the ending |

## 7. The ten chapters

Regions and bosses are upstream assets re-cast. Each chapter's end sets the fact that opens the next one's road.

| Ch | Title | Region (upstream) | Boss (asset) | Memory returned | Beat |
|---|---|---|---|---|---|
| **1** | **The Ember Letter** | Frostfang Coast: Cloudtop, Shardstone Foot, Emberwick, the Ford, the Old Crown Road | Ser Gavrel the Thornbound (`alberic`) | (none yet — Kiri holds it; it returns in Ch 2) | Wake without memory; the watchman's log; the barrow; Corvin steals the Hearthshard's flame; the Herald names the Crownseeker; the bridge; the Old Crown Road; Gavrel; "You have her eyes"; the first choice; the sunset early. |
| 2 | Ashes of Cinderholt | The Scarred March (Emberfall, the mine, Cinder Pass) | the drake Vharok (`dragon`), Warden Matthias the Ember-Sworn (`matthias`) | *The Sundering Night* — played as Gavrel, riding from the burning chapel to the mountain with the infant | A mining town on strike under a Warden fused with the Ember Chain; the drake is his memory of a war, given flesh. Sable arrives. The mine's deep vault shows the Engine's pipes. |
| 3 | The Weight of Grain | The Golden Reach (the Vale of Scales) | Warden Ele of the Golden Scales (`ele`) | *The watchman's door* — a child on Cloudtop asking where they came from | The Scales weigh the harvest owed to Solmere; famine politics; the player decides who eats. Shards drained *toward* the capital. |
| 4 | Mirelight | The Mirewood (the Pale Fens) | Warden Nacht, the Drowned Lantern (`nacht`) | *The lullaby* — a woman's voice in a chapel, singing to the hero | Fog that never lifts; drowned villages that remember they drowned. Maren arrives with the Order and sees what the Engine is. |
| 5 | The White Vigil | The Silverspire Heights (the White Altar Heights) | the Witnesses of the Vigil (`witnesses`) | *The lock* — Isolde pouring a child's memory into the five Regalia | The last Warden is a choir of the Queen's guard bound into one. Isolde's letter in the Order's archive. **The prophecy was the Regent's.** Corvin learns the heir lives. |
| 6 | The Gilded Cage | Solmere (the Holy City maps) | Pride (`pride`), the Regent's champion | — | Court intrigue in the Crown City: banquets, the Crown Chapel, the poor quarter's revolt. The Regent offers the hero a place at his side, and the truth about Sable. |
| 7 | The Marches Burn | back across the five regions | Wrath (`wrath`) and Greed (`greed`), the Regent's generals | — | Civil war. Every Warden relieved, every town kept, every lie told or not decides who answers the call. |
| 8 | Her Eyes | Cloudtop, the Ford, the barrow, Solmere's undercroft | Envy (`envy`), the Regent's shadow | *The name* — the hero's true name, spoken by Isolde | The locket opens. The hero is Isolde's child. Fennick, Maren and the watchman's last letter tell what they kept. Sable's choice. |
| 9 | The Heart Beneath | under Solmere: the Sun Engine | Gluttony (`gluttony`), Sloth (`sloth`), and Lust (`lust`) — the Regent made the Engine's vessel | — | Aurex chained, made to forget the sky. Kiri is its last memory of it. |
| 10 | Dawn of Choice | the Crown Chapel, the sky over Solmere | Caedmon, the False Sun (`astra` art re-cast) | — | Four endings, each open only if the Ledger and the choices allow it (below). |

### The endings

| Ending | What the hero does | Open when |
|---|---|---|
| **Reforged** | Wears the Crown. The realm is lit and ordered; Aurex stays chained; Kiri fades into the Crown's light. | always |
| **Released** | Breaks the Engine and lets Aurex remember the sky. A new sun rises; there is no more Crown; the Free Marches. | at least three Wardens relieved, or the Ledger above its midpoint |
| **Remembered** | Gives the hero's own returned memories back to the land, to relight every shard at once. The realm remembers the sun; the hero forgets everything again — and Kiri, who remembers for them both, waits on Cloudtop. | Kiri given the light in C1 and at least two chapters after |
| **Usurped** | Takes the Engine for the hero's own, and becomes the Sun. | the Ledger at its darkest |

## 8. What every chapter keeps

- One region, one Warden or general, one dungeon, a town with errands, a shop line, a crafting/gear set, a choice, a
  memory, a meeting with Sable.
- Nothing is lost: what the player built (Thornhold, the homestead), learned (skills, professions) and carries
  goes on.
- A chapter not yet written in this fork is **sealed** behind its fact; the card at the previous chapter's end says
  the road waits for the next update.
