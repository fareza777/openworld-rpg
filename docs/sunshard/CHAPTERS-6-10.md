# Sunshard · Chapters 6–10 (plan)

Chapters 1–5 are built on upstream's main line (re-told: `docs/sunshard/STORY.md` §7). Upstream has no story after its
fifth seal but its finale; Chapters 6–9 are made from what upstream built and never used — the **showcase places**
(`tools/src/demo/showcase/`, `docs/showcase.md`): hand-made towns, halls and their people, all `backdrop` (no tale told
there yet). Each chapter opens some of them, gives them a tale, and seals the next behind its own fact.

## What there is to use

| Showcase place | Map id | Chapter |
|---|---|---|
| North Gate (a fortress on the walls) | `holy.quarter-1` | 6: the way into Solmere |
| Bell Ward (the grand square, the court's houses) | `holy.quarter-2` | 6: the Regent's banquet |
| the Market | `holy.quarter-3` | 6: the poor quarter rises |
| the Lamp Ward | `holy.quarter-4` | 6, 8 |
| the Lower Town, its quays | `holy.quarter-5` | 6, 9 |
| Sunwell Abbey, its cathedral and close | `holy.sunwell-abbey` | 6: the Crown Chapel above; 9, 10 below it |
| Rimeholm · Warcombe · Weighmarket · Dusk Moorings · Highheath Abbey | `frostfang.rimeholm` … | 7: the five Marches answer, or not |
| Scarwell camp (bandits' hold) · Frostbarrow camp (border fort) | `redmarch.scarwell-camp`, `frostfang.frostbarrow-camp` | 7: the Regent's armies |
| Brandby mine, and what it broke into | `redmarch.brandby-mine` | 9: the Engine's roots |
| Goldmere (a mage's tower) | `tithe.goldmere-tower` | 9 |
| Ashengate ruins · Northmoor cave · Bellwick manor · Barleyridge farm | | 8: what the hero's guardians kept |
| upstream's finale maps: the close, the nave, the Confluence, the Holiest | `holy.close` … | 9, 10 |

Bosses with kits: **Pride**, **Envy**, **Lust** (in the Boss Challenge only, until now), the dragon, **Astra** (the finale).
Wrath, Greed, Gluttony and Sloth have art but upstream removed their kits (`REMOVED_BOSSES`); Chapter 7 gives two of them
kits again from their art.

## The chapters

| Ch | Title | Where | Boss | Beats | Choice |
|---|---|---|---|---|---|
| 6 | The Gilded Cage | Solmere: North Gate → Bell Ward → the Market → Sunwell Abbey | **Pride**, the Regent's Champion, in the abbey's close | The gates open for the Crownseeker who carries five. A banquet; the Regent, charming and sincere, offers a place at his side ("a realm that forgets its griefs is a kinder one") and the truth about Sable. The Market rises for bread. Pride is sent to take the Regalia "for safekeeping". | **C6** expose Sable as the Regent's decoy, or keep his secret for her sake · **C7** turn the High Luminant, or bring her down |
| 7 | The Marches Burn | the five regions' towns, the camps | **Wrath** and **Greed**, the Regent's generals | Civil war. Every Warden relieved stands with the hero; every Warden felled leaves a March leaderless. Corvin's kept light (C5) can save one town. | **C8a** which town the lantern saves |
| 8 | Her Eyes | Cloudtop, the Ford, the barrow; the Lamp Ward; Ashengate | **Envy**, the Regent's shadow | The locket opens. The hero is Isolde's child. Fennick, Maren and the watchman's last letter tell what they kept. Sable's choice (her ending from C6). | — |
| 9 | The Heart Beneath | under Solmere: Brandby's deep, the Confluence | **Lust**, the Engine's Vessel | The Sun Engine. Aurex chained, made to forget the sky. Kiri is its last memory of it. | — |
| 10 | Dawn of Choice | the Holiest, the sky over Solmere | **Caedmon, the False Sun** (Astra's art) | The four endings, each open only as the Ledger (`night.shift`) and the choices allow (STORY.md §7, *The endings*). | **C10** the ending |

## The Ledger at the end

`night.shift` begins at 1 (Chapter 1) and moves by the story: +1 for each Warden felled (Ch 2–5), +1 for Fairweight's
grain sent to Solmere (Ch 3), −1 for the light Corvin gives back (Ch 5). Relieved Wardens are counted by
`quest.relieved.<warden>`. The endings read both (STORY.md: Released wants three relieved, or the Ledger at its
lightest; Usurped, the Ledger at its darkest).
