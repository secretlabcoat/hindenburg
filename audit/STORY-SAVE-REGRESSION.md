# Story/save regression — 2026-11-07

Branch: `copilot/story-save-regression` (local only), based on `793903f`.
Source: https://github.com/secretlabcoat/hindenburg/tree/import/current-source-handoff-20261107
Local checkout: /Users/paullabute1/.openmausbot/task-workspaces/b21636e2-4afb-42b5-8bba-c8ce32c36840/7977f850-a262-44d9-b157-aea6ffbb5874/hindenburg

No remote branch link exists: repository instructions prohibit pushing. The requested separate branch exists locally; the accompanying patch series can be reviewed/applied without credentials. No merge, push, deploy, art, AI service or real-player storage changes performed. JSDOM uses fresh isolated localStorage and mocks every network request. `/workspace/pm` documentation required by AGENTS.md is absent on this Mac; this report preserves task state instead.

## Verdict and limits

PASS: all seven ending dispatch/collection branches with seeded prerequisites, item fallback behavior, real note pickup, notebook entries, authority warnings/confession capture, Bunny trust/hatch boundary, guided-tour boundaries, and synthetic V1/V2/V3 reloads.
FAIL → FIXED: Captain's notebook completion ignored the reduced trust threshold after his secret was earned.
UNTESTED: seven complete player journeys from a new voyage without seeded state; actual live dialogue/trust progression; genuine historical saves; real-browser file-origin storage; corrupt/partial/unknown-room saves; ended-voyage reload behavior; every possible story flag combination. Passing these unit scenarios does not establish complete story solvability.

## Seven ending reproductions

Run `npm run build`, then `node tests/test-story-save.cjs`. Each scenario clicks Start in a fresh JSDOM game, uses the exact setup below through `window.eval`, and then calls `checkEndings()` unless a different action is stated. These are reproducible state-boundary tests, not player walkthroughs. `turns=0`/`steps=0` defaults apply unless stated. Each asserts ending kind, exact title and distinct `hindenburg_endings_v2` collection key.

| Ending / result | Exact prerequisites and action | Dead end / caveat |
|---|---|---|
| hero_steward PASS — The Warning Carried Forward | `ai[STEWARD].met=true;ai[STEWARD].warned=true;ai[STEWARD].trust=65;checkEndings()` | Warning alone at trust 64 does not win. |
| hero_officer PASS — Checked Twice | `ai[FIRST].met=true;ai[FIRST].warned=true;ai[FIRST].trust=60;checkEndings()` | Warning alone at trust 59 does not win. |
| hero_captain PASS — The Captain’s Word | `ai[CAPTAIN].met=true;ai[CAPTAIN].warned=true;ai[CAPTAIN].trust=70;checkEndings()` | Normally 70; earned Captain secret lowers gate to 60 (also tested). |
| capture_steward PASS — No Such Passenger | `ai[STEWARD].met=true;ai[STEWARD].trust=10;checkEndings()` | Confessing “I am a stowaway with no ticket” at trust 25 deducts 15 and captures; tested through form submission. |
| capture_purser PASS — Not on the Manifest | `ai[PURSER].met=true;ai[PURSER].trust=10;checkEndings()` | Same confession boundary tested; ally protection changes this branch and was not independently exercised. |
| escape PASS — Down the Landing Rope | `view='keel_hatch';ai[BUNNY].route=true;turns=16;steps=0;draw()` then click `.scene [data-act="hatch"]` | Closed at clock 15; without route remains locked (existing DOM suite). No full Bunny trust journey. |
| failure PASS — Lakehurst | `turns=22;checkEndings()` | Clock = turns + floor(steps/8); movement also spends time. |

## Items, notebook, trust and tour

| Result | Steps / observation |
|---|---|
| PASS — key/scrap fallback | Start → click inventory item by accessible name Key or Scrap of paper → click Use. Both report “There is no obvious use for it here.” No implemented lock/puzzle solution established; do not invent one. |
| PASS — Take dead end | Start → click Take → “Nothing here looks unattended enough to pocket.” |
| PASS — actual note pickup/save | `view='corridor_forward';steps=3;draw()` → click `.notehot` → saved `note=true`, inventory contains `Steward’s note`. Appearance condition is corridor style with 3 ≤ steps < 10; missing this window is a missable clue. Pickup text points to forward control car. |
| PASS — notebook | Seed met/warned Steward at trust 64 → click Notebook → verify name, warning goal and trust. |
| PASS — warnings | Disable live dialogue, choose Steward/First Officer/Captain, seed trust one below their normal gate, submit “Fire danger at Lakehurst”. Warned flag set, no ending, no trust gain. Offline responses cannot establish winning trust by themselves in these cases. |
| PASS — Bunny route | In `keel_walk`, choose Bunny at trust 52; submit “I can help you when the ropes drop.” Mock returns trust_delta=1, raising trust by 3 to 55 and arranging route. Hatch refuses at 15 and escapes at 16. Actual service response remains untested. |
| PASS — tour gates | `ACTS.tour()` in washroom at 8 refuses. In `crew_door_in`, at 7 refuses; at 8 and 15 (toured=false) reaches keel entry/shoes; at 16 refuses. Ordinary crew ladder is intentionally ungated. Existing suite checks actual glimmer→upper ladder and physical navigation. No topology edits. |

## Save migration/reload evidence and missing fixtures

`tests/test-story-save.cjs` creates a current save through saveGame(), serializes it, then starts a fresh isolated game with that string in the existing save key. The three variants omit topologyVersion (synthetic V1), set it to 2 (synthetic V2), or 3 (V3). All retain schema `v:1`; these are topology generations, not demonstrated historical serialization formats.

PASS for all three: exact `lounge_side` view; same derived room and fixed-world heading; turns=5; steps=7; full seeded inventory including an extra note; collected-note flag; contradiction list; Steward met/warned/trust; Bunny met/trust/route. Old variants show the explicit V3 compass migration notice; V3 does not. All are rewritten with topologyVersion=3.

Missing fixtures: an untouched real V1 export, untouched real V2 export (including original view/orientation semantics), and a real V3 export with representative mid-story secrets, glimmer, toured/ally/claims/gossip flags and inventory. The repository supplies no authenticated historical player fixtures. Renaming a current payload does not prove old orientation mapping was correct. No claim of all flags or all 76 saved facings validated. No real saves read, changed or reset.

## Confirmed bug and isolated fix

Before fix: seed Captain met=true, warned=true, trust=60, secretEarned=true; call renderNotebook(). The officer goal lacks `done`, although checkEndings() awards The Captain’s Word. Assertion fails:

```
AssertionError [ERR_ASSERTION]: Captain secret lowers notebook completion threshold to 60
actual: false
expected: true
```

Fix: `src/scripts/08.js` derives the displayed and completion Captain threshold from secretEarned (60/70), matching the ending rule. Regression verifies completed notebook goal and matching ending. No map/mobile/shared topology runtime edited. `dist/index.html` rebuilt; VERSION.json preserves reference baseline hash and records new build hash `ad0cfbdbc26cb128c6cba1efad35246f0cd03af7b5af8f2101956fc7da28ee17`.

## Commands and results

- `npm run build`: exit 0; dist/index.html 1,278,606 bytes; hash above.
- `npm test`: exit 0; 149 geometry assertions; 15 existing DOM groups; 8 story/save groups; 19-room synthetic map centering suite plus 5 CSS assertions; no uncaught JSDOM errors. One mocked relay call, zero real service calls.
- `git diff --check`: exit 0.
- Full captured npm output: `audit/story-save-test-output.txt`.
- JSDOM layout assertions are synthetic, not visual/mobile acceptance.

## Commits

- `6556a3b` — test(story): cover ending branches and synthetic save migrations
- `b57e043` — fix(story): align Captain notebook goal with secret trust threshold
- Report/output committed separately after these changes.

Remaining review work: complete fresh-voyage player walkthroughs with controlled deterministic dialogue or approved live play; obtain sanitized original saves; test all gates and flags across reload, ended saves, invalid data, file-origin storage and real-browser persistence. No temporary automations exist for this task.
