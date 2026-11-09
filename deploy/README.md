# Permanent Worker art update

ShareHTML (`https://oofyjym.sharehtml.org/`) is the art source only. Do not publish or edit that page.

The permanent game is the catch-all Worker at `https://hindenburg.secretlabcoat-0ba.workers.dev/`. On 2026-11-09 its body was byte-identical to git `59d0b47` (`deploy/permanent-baseline.html`, SHA-256 `95ed968ce061908e74038bb5dd4bfcbc915f0718fbfe14cd06af4e6753e55129`). Every path returns that same HTML. There is no separate asset host and no Wrangler config in the repo.

`deploy/hindenburg-worker.html` is that game plus ShareHTML’s ready photographs. The bathroom east, south, and west walls are the 2026-11-08 uploads instead of the older ShareHTML bathroom pictures. The north curtain remains the reference those walls were drawn from. Turning through the washroom visits curtain, sink, door, and towel wall. The door still leads to the B-deck corridor. Character figures stay visible over photographs. The relay is unchanged. Rebuild with `python3 deploy/build-permanent-worker.py`.

Coverage is `deploy/ART-COVERAGE.json`. Nineteen permanent views show photographs. Seventeen stay vector because ShareHTML has no ready photograph for them. `bdeck_corr_stairs` and `bdeck_corr_office` are ready on ShareHTML but have no view in the permanent 36-node game.

## Deploy route

Schematic deck plans, labeled as not a measured blueprint, are in `deploy/deck-plans/` (SVG and PNG for A, B, Keel, Upper rings, and the control car). The same geometry drives the in-game Deck plan control. It does not move the player.

Update the existing Worker named `hindenburg` so its catch-all response is `deploy/hindenburg-worker.html` (1,246,923 bytes, SHA-256 `b9e31e10dc73befb936e326ec86fbfeed34f39507a372213c0c59fd0d294941b`). Do not deploy `dist/index.html` from the V3 game, and do not change the `hindenburg-ai` Worker. The previously published body `2ed2fd16566b87974abdfafd5723f0b9327f2f363a13d7f3adc0e3d935b16565` still has the older bathroom pictures and hides characters.

## Release v1.0.0 (checked, not a deploy target)

https://github.com/secretlabcoat/hindy-package/releases/tag/v1.0.0 was published 2026-11-06. All five ZIPs downloaded. It is older than the 2026-11-08 bathroom upload.

Its bathroom files are the old pictures: basins `4cd0b748…`, door `0a213e84…`, and `washroom_wall.webp` is a byte copy of the north curtain (`96135f0d…`), not the towel wall. Those were not used. `control_helm.webp` matches ShareHTML (`fd0fdd40…`) and is already in this artifact. No filename in the five ZIPs contains captain, Kyle, or a captain portrait. `portraits/` contains only the Chief Steward, and `HANDOFF.md` says those clips are not approved for the game and are not wired in. They were not added, and the helm photograph was not used as a portrait. The captain on the helm remains the existing CSS figure, now left visible.

Packaging for the existing Worker, if its script is an ES module: `deploy/hindenburg-worker-module.mjs`. It returns the artifact for every path. Headers match the live catch-all: `content-type: text/html;charset=utf-8` and `cache-control: no-cache`. If the current script uses `addEventListener('fetch', ...)`, keep that shell and replace only the HTML body with `deploy/hindenburg-worker.html`.

Do not point this package at `hindenburg-ai`. Merging the branch does not publish. Production was not changed by the build.
