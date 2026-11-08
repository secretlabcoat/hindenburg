# P0 browser fixes — 2026-11-07

Two reproduced bugs fixed:
- At 393×852 the legacy fixed Sound button intercepted real pointer clicks on Floor plan. Sound now participates in the wrapping toolbar at all sizes.
- At 852×393 the scene shrank below 180px. Short landscape now preserves the scene minimum and allows existing game scrolling.

Real headless Google Chrome (offline file origin) passes at 1280×900, 393×852, 393×600 and 852×393: real map/sound clicks, scene minimum, Keel entry/walkway/Control dot visibility, alternate-deck manual pan retained, switch back, no outer-window jump, Examine with map open/closed, resize to 393×852. See browser-test-results.json and p0-*.png. Screenshots are captures, not proof of user-delivered preview. Parent should supply standalone index.html for review; no deployment performed.

Reproduce: install playwright-core locally or set PLAYWRIGHT_MODULE to its existing path; CHROME_PATH can override installed Chrome. Run npm run test:browser. Browser dependency is optional and not needed to play or run baseline tests.

Baseline: npm test passes 149 geometry assertions, 15 DOM scenario groups (including glimmer/Watcher/return) and 19-room synthetic centering tests. No gameplay/topology/art changed.

Not verified: physical phone soft keyboard/audio, full seven-ending story suite, hosted-origin relay/CORS, real user preview rendering. Next goal: full story/save/mobile interaction regression before art integration or publication. Original FILE-HASHES.json remains import provenance; VERSION.json separately records current build hash. reference/ remains untouched.
