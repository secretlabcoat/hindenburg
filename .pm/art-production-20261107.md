# Art production — 2026-11-07 evening (Toronto EST)

## Actual result
No new images or clips. HF_TOKEN authenticated via HfApi.whoami, but first requested candidate (Helen Karens) failed: free ZeroGPU quota 90s requested / 0s left. Stopped immediately. HF_TOKEN_2 failed documented whoami with HTTP 401; not used to generate anonymously. No paid service, new accounts, deployment, or token values recorded.

## Site/source evidence
Public preview WebFetch returned HTTP 403 Forbidden. Its current appearance/version could not be compared; parent browser check is required. Local HEAD and remote master both e6c1ee6143b9e8b2bdacf0fd23c83bb4a6315fab at start. Local ART_COMMIT is c8df61b20e8c548a7feec908ae9da9602866c29c. No game code or image-pin edits. Existing untracked QA screenshots left untouched.

## Persistent improvements
All 53 pending facing prompts now explicitly constrain period practical lamps, plain ceilings, unlettered surfaces, and per-wall framing; hall-axis prompts preserve their opposite landmarks. Pending seeds shifted to fresh 72000–73803 families; approved art unchanged. This does NOT guarantee matching geometry: inspect against approved siblings. The next batch alternates verified cast and room candidates. Chief Steward Manard Toxu retains Fred’s existing six reactions; do not regenerate or silently substitute.

`art-next-batch.json`: Helen Karens, washroom_wall, Bunny Treemont, cabin_door. Portraits staged only until reviewed and cast mapping confirmed. `character-art-plan.md` covers all 12 actual cast entities (11 human + Watcher); appearance proposals are labelled as proposals.

## Next-run contract (no routine scheduling changes)
1. Verify legitimate authenticated HF access. HF_TOKEN_2 needs a working authorized credential before fallback; 401 is not anonymous quota exhaustion.
2. Run a modest batch only after quota recovers, stop on exhausted quota without looping or aggressive retries.
3. Before generating, consult attempt history. Never reuse a rejected (id, prompt hash, seed) tuple. A quota-only failure made no candidate, so the tuple may be resumed once quota recovers.
4. Store every candidate outcome/reason and prompt hash before any acceptance. For a visually rejected facing choose the next room-family revision (+100000 to its current seed) and refine its detail/prompt based on that rejection before the next call. Do not automatically accept or copy a different facing. Keep old rejection records.
5. Review close side walls vs opposite axial views, same materials/lighting as approved siblings, no recessed lights, modern fittings or text-like plaques. Accept only reviewed assets; sync, secret-scan, asset commit then pin. Never deploy automatically.

## Current inventory
23 approved room facings / 53 placeholders (76 total, 19 locations). No newly accepted portraits. Existing steward source and six reaction clips remain at /workspace/portraits/steward. No new preview/contact sheet can truthfully be supplied this run.
