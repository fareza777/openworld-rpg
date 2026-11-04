# SUNSHARD: The Sundered Crown — story bible (canonical)

Status: **canonical for this fork** (2026-11-04). It replaces the upstream setting (`docs/lore.md`: the Five
Sufferings, Astra, the Seal-bearers). Upstream's maps, art, audio, engine and systems are kept; the story, the
world's history, the cast's identities and every word the game says are this document's. Where an upstream file
still holds old-story words, it is a bug to fix (see `LEXICON.md`).

Tone: epic dark-fantasy with warmth. Plain, concrete sentences; people tell only what they know; the world's
history comes through hearsay, ruins and objects. Mystery first, answers late, nothing the early chapters say is a
lie — only a misreading.

---

## 1. The world in one page

**Valdoria**, a kingdom on the continent of **the Sunward Reaches**, once lived "under two suns": the sky's sun and
the light of the **Dawn Crown**.

- **The Starfall** (≈600 years ago). A god-star, **Aurex**, fell burning out of the sky. Its body broke on the land
  and its heart scattered as **Sunshards** — crystals of living light. Where shards lay, fields bore twice, winters
  softened, and the **Hollowborn** (things of the dark between stars) could not walk.
- **The Founding.** The clan-lord **Halvard** gathered the five greatest shards and had them forged into the **Dawn
  Crown**. Worn by a crowned head of his line, the Crown bound every lesser shard in the land into one light: the
  realm's "second sun". The faith that grew around it is **the Radiant Order** ("Aurex fell so that we might rise").
- **The Sundering Night** (19 years ago). In the capital **Solmere**, Queen **Isolde** was killed in the Crown
  Chapel. That same night the Dawn Crown broke into **five Regalia**, which flew like comets to the five Marches.
  The infant heir vanished. Each Regalia was taken up by one of the Queen's five sworn knights, the **Wardens**.
- **The Regency.** The Queen's cousin, **Lord Regent Caedmon Vire**, rules from Solmere "until the Crown is whole".
  The Radiant Order, under **High Luminant Sabine Ostrell**, preaches that the Wardens are oathbreakers hoarding
  the Regalia.
- **The Dimming** (now). Each month the sun sets earlier. Crops fail; the Hollowborn grow bold; the dead do not lie
  still. The Regent's proclamation: the Dimming will end when a **Crownseeker** recovers the five Regalia and the
  Crown is **reforged** in Solmere.

## 2. The truth, in layers (revealed in order — never earlier)

| Layer | What the player believes | Revealed |
|---|---|---|
| 1 | The Wardens are mad tyrants; the Ashen Covenant are heretic thieves; the Regent is the realm's hope. | Ch 1–3 (as surface) |
| 2 | **The Dimming is caused by Solmere.** The Regent's **Sun Engine** beneath the capital drinks the land's shards. Each Regalia a Warden holds keeps their March lit; each one the Crownseeker brings down feeds the Engine — the night grows longer as the player succeeds. The Wardens were *hiding* the Regalia. | Ch 4–5 |
| 3 | **Queen Isolde broke the Crown herself.** She learned the Crown does not make light: it *takes* it, from Aurex's still-living heart. She shattered it to starve the Engine and was murdered for it by the Regent. Her last act: she sent her infant child out of the city with her First Warden, Ser Gavrel. **The Crownseeker is that child.** | Ch 6–8 |
| 4 | **Aurex is not dead.** The god-star sleeps, chained, beneath Solmere; the "second sun" was always its pain. **Kiri**, the player's star-sprite, is the last free spark of Aurex — it found its way to the heir on the mountain. | Ch 8–9 |
| 5 | The final choice: reforge the Crown (chain Aurex again, rule a lit realm), release Aurex (end the age of crowns), or take the Engine's power (become the new Sun). | Ch 10 |

Every twist is planted in Chapter 1: Gavrel's last words ("You have her eyes"), the warm ember Corvin leaves, the
waystone that dims as Gavrel dies, Kiri's fear of the Regent's sigil, the sunset four minutes earlier.

## 3. Factions

| Faction | Seat | Wants | Face in Ch 1 |
|---|---|---|---|
| **The Regency** | Solmere | the five Regalia brought to the Sun Engine | the Regent's Herald and the proclamation |
| **The Radiant Order** | Solmere, chapels everywhere | faith, order, the Reforging; most of its clergy are honest and do not know the truth | Sister Maren of Emberwick |
| **The Five Wardens** | the Marches | to keep their Regalia from Solmere, at any cost; each is being devoured by the Regalia they carry | Ser Gavrel the Thornbound |
| **The Ashen Covenant** | nowhere; outlawed | once the Queen's keepers of the shard-flames; now hunted. They steal shard-fire to keep it from Solmere | Corvin, the Ashen Wanderer |
| **The Free Marches** (Ch 7+) | the five March towns | self-rule once the Crown's grip ends | — |

## 4. The cast

The **portrait/sprite asset ids** are upstream's and stay as they are; only names and identities change.

| Role | Name (display) | Asset / entity id | Who they are |
|---|---|---|---|
| Protagonist | the player's own (the creator); NPCs say "traveller", later "Crownseeker" | player | Wakes on Cloudtop with no memory, a cracked silver locket and a scar shaped like a sunburst. Is the lost heir of Isolde (Ch 8). Silent protagonist with dialogue choices. |
| Companion | **Kiri**, a star-sprite | `pip`, portrait `lumi` | A spark of light with wings who woke the player. Cheerful, curious, brave, and afraid of things she cannot name (the Regent's sigil, the dimming waystone). The last free spark of Aurex (Ch 9). Catches the loose light of fallen Regalia — her "gifts" (the boons). |
| Mentor | **Sister Maren** | `npc.ilse`, portrait `ilse` | Keeper of Emberwick's shrine and its **Hearthshard**. Raised a foundling boy who became Corvin. Honest believer in the Order; her faith cracks in Ch 4. |
| Rival / later ally | **Corvin**, the Ashen Wanderer | `npc.severin`, portrait `severin` | 30, grey cloak, ash-dark hands, a hooded brass lantern. Last brother of the Ashen Covenant. Steals the Hearthshard's flame the night before the Herald comes to confiscate it. Never harms anyone; says one sentence too few. Knows the Engine exists; does not yet know the heir lives. |
| First boss | **Ser Gavrel the Thornbound**, First Warden | `alberic` | The Queen's First Warden and the knight who carried her infant out of Solmere. The Briar Diadem has eaten his memory; he remembers only that he must **hold the river** against Solmere. He tore down the bridge. Dying, he sees the locket: "...You have her eyes." |
| Antagonist | **Lord Regent Caedmon Vire** | (Ch 6 cast) | Charming, patient, sincere in his own eyes: he believes a god-king can end all suffering. |
| Antagonist | **High Luminant Sabine Ostrell** | (Ch 5–6 cast) | The Order's head; knows half the truth; the player can turn her in Ch 6. |
| Village | Headman **Rowan**, Joss the bridgewright, Pell the boy who draws, Nessa the almanac-maker, Fennick (Gavrel's old squire), Hesper the ferrywoman, Edda of the farmstead, Holt of the watch, Lina and Oskar the foragers | upstream ids | Their names stay; their histories and lines are this bible's. |

## 5. The player's choices (the world remembers)

Choices are story facts (`choice.*`), read by people's lines, scenes, quest stages and the ending.

| # | Chapter | Choice | Facts | What changes |
|---|---|---|---|---|
| C1 | 1, the Briar Diadem | Who takes the loose light when Gavrel falls: **Kiri** (she grows brighter; her first gift is stronger) or **Corvin's lantern** (he owes you; Ch 2 he helps in the mine) | `choice.ch1.light` = `kiri` \| `corvin` | Kiri's gift; Corvin's later trust; Nessa's sunset count (5 or 4 minutes) |
| C2 | 1, the homecoming | Tell Emberwick the truth of Gavrel (a loyal knight) or let them keep the tale (a tyrant slain) | `choice.ch1.tale` = `truth` \| `legend` | Rowan's and Maren's lines; Fennick's farewell; a memorial at the Ford (truth) |
| C3 | 2, opening | The Herald returns for the Briar Diadem: hand it over for Solmere, or refuse | `choice.ch2.diadem` = `herald` \| `kept` | Ch 2's road (the Order's escort or Covenant contact); the Dimming's pace |
| C4–C10 | 2–9 | Spare or slay each Warden; side with Sabine or Corvin; the Free Marches' charter; who holds Solmere's gate | `choice.chN.*` | allies available in Ch 10, three endings |

## 6. The ten chapters

Regions and bosses are upstream assets re-cast. Each chapter's end sets the fact that opens the next one's road
(upstream's `world.ch2` … mechanism, renamed in words only).

| Ch | Title | Region (upstream) | Boss (asset) | Beat |
|---|---|---|---|---|
| **1** | **The Ember Letter** | Frostfang Coast: Cloudtop, Shardstone Foot, Emberwick, the Ford, the Old Crown Road | Ser Gavrel the Thornbound (`alberic`) | Wake without memory; rescue the foragers from the barrow; Corvin steals the Hearthshard's flame; the Regent's Herald names the Crownseeker; mend the bridge; walk the Old Crown Road; bring Gavrel down; the Briar Diadem; "You have her eyes." The sunset comes four minutes early. |
| 2 | Ashes of Cinderholt | The Scarred March (Emberfall, the mine, Cinder Pass) | the drake Vharok (`dragon`) and Warden Matthias the Ember-Sworn (`matthias`) | A mining town on strike under a Warden who fused with the Ember Chain; the drake is his. Corvin returns (C1). The mine's deep vault shows the Engine's pipes for the first time. |
| 3 | The Weight of Grain | The Vale of Scales | Warden Ele of the Golden Scales (`ele`) | Famine politics: the Scales "weigh" the harvest owed to Solmere. The player chooses who eats. First hint that shards are being drained *toward* the capital. |
| 4 | Mirelight | The Pale Fens | Warden Nacht, the Drowned Lantern (`nacht`) | Fog that never lifts; drowned villages; Maren arrives with the Order and sees the truth. **Twist 2:** the Engine exists; every fallen Warden fed it. |
| 5 | The White Vigil | The White Altar Heights | the Witnesses of the Vigil (`witnesses`) | The last Warden is a choir of the Queen's guard bound into one; the Order's archive holds the Queen's letter — she broke the Crown. Sabine appears. |
| 6 | The Gilded Cage | Solmere (the Holy City maps) | Pride (`pride`) — the Regent's champion | Court intrigue: banquets, the Crown Chapel, the poor quarter's revolt. The Regent offers the player a place at his side. Turn Sabine or expose her. |
| 7 | The Marches Burn | back across the five regions | Wrath (`wrath`) and Greed (`greed`) — the Regent's generals | Civil war. Rally the Free Marches; every choice so far decides who answers. |
| 8 | Her Eyes | Cloudtop, the Ford, the barrow, Solmere's undercroft | Envy (`envy`) — the Regent's shadow | The locket opens; **Twist 3:** the player is Isolde's child. Fennick and Maren tell what they kept. |
| 9 | The Heart Beneath | under Solmere: the Sun Engine | Gluttony (`gluttony`) and Sloth (`sloth`) — the Engine's wardens | **Twist 4:** Aurex lives, chained; Kiri is its spark. The Regent becomes the Engine's vessel (Lust, `lust`, his transformed form). |
| 10 | Dawn of Choice | the Crown Chapel, the sky over Solmere | Caedmon, the False Sun (`astra` art re-cast) | Three endings: **Reforged** (crowned; Aurex chained; the realm lit, Kiri gone dim), **Released** (Aurex rises as a new sun; no more Crown; the Free Marches), **Usurped** (the player becomes the Sun; a dark crown). |

## 7. What every chapter keeps

- One region, one Warden or general, one dungeon, a town with errands, a shop line, a crafting/gear set, a choice.
- Nothing is lost: what the player built (Thornhold, the homestead), learned (skills, professions) and carries
  goes on.
- A chapter not yet written in this fork is **sealed** behind its fact; the card at the previous chapter's end
  says the road waits for the next update.
