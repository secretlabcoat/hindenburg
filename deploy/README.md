# Permanent Worker art update

ShareHTML (`https://oofyjym.sharehtml.org/`) is the art source only. Do not publish or edit that page.

The permanent game is the catch-all Worker at `https://hindenburg.secretlabcoat-0ba.workers.dev/`. On 2026-11-09 its body was byte-identical to git `59d0b47` (`deploy/permanent-baseline.html`, SHA-256 `95ed968ce061908e74038bb5dd4bfcbc915f0718fbfe14cd06af4e6753e55129`). Every path returns that same HTML. There is no separate asset host and no Wrangler config in the repo.

`deploy/hindenburg-worker.html` is that game plus the 21 `artStatus:"ready"` WebPs embedded on ShareHTML. Placeholder facings and CSS/vector drawings were not copied. The node graph and `https://hindenburg-ai.secretlabcoat-0ba.workers.dev` are unchanged. Rebuild with `python3 deploy/build-permanent-worker.py`.

Coverage is `deploy/ART-COVERAGE.json`. Nineteen permanent views show photographs. Seventeen stay vector because ShareHTML has no ready photograph for them. `bdeck_corr_stairs` and `bdeck_corr_office` are ready on ShareHTML but have no view in the permanent 36-node game.

## Deploy route

Update the existing Worker named `hindenburg` so its catch-all response is `deploy/hindenburg-worker.html` (1,164,525 bytes, SHA-256 `2ed2fd16566b87974abdfafd5723f0b9327f2f363a13d7f3adc0e3d935b16565`). Do not deploy `dist/index.html` from the V3 game, and do not change the `hindenburg-ai` Worker.

Packaging for the existing Worker, if its script is an ES module: `deploy/hindenburg-worker-module.mjs`. It returns the artifact for every path. Headers match the live catch-all: `content-type: text/html;charset=utf-8` and `cache-control: no-cache`. If the current script uses `addEventListener('fetch', ...)`, keep that shell and replace only the HTML body with `deploy/hindenburg-worker.html`.

Do not point this package at `hindenburg-ai`. Merging the branch does not publish. Production was not changed by the build.
