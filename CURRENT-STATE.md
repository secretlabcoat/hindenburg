## Integration update — November 8

The integration branch combines all current remote game changes with local story/save work and supplied bathroom art. Eight enabled facing photos and 68 fallbacks; original references remain historical. See audit/INTEGRATION-20261108.md. Earlier numbers below describe the pre-integration baseline.

# Current state and evidence

## Verified artifact
VERSION.json holds exact reference SHA256/lineage. Baseline editable-source build round-trips without changes. Self-contained room images/Steward still; no missing external map sidecars. Only optional live AI requires internet.21old room WebPs remain embedded;7photos enabled,69CSS fallback views. Existing user-uploaded SVG portraits are in older unrelated candidate archive, not accepted current character art.

## Verification levels
-149geometry assertions PASS;15JSDOM scenario groups PASS: all76turns/view exits, all19reciprocal connections, main/service routes, glimmer ladder, guided tour, Bunny ending and save migration.
-Map patch adds19room synthetic rendered-coordinate centering coverage/window+pane resize/hidden pane behavior and5CSS assertions. These are not real pixel measurements.
-Parent actual Chrome PRIOR to last map usability patch: washroom→Bcorridor→stairs→Acorridor→cabin/dining/lounge; crew→keel galleries→walkway→control; turns keep dot; explicit deck connectors; readable desktop inventory; save migration; live Colonel worked.
-Last map patch desktop centering and393×852visual results NOT supplied/verified here. Manual alternate-deck selector test inconclusive; glimmer manually untested though DOM passes. Full ending/puzzle/lock suite and mobile audio/keyboard remain pending.

Latest fixes: centering uses rendered dot/pane rectangles incl borders/scroll, SVG native sizes, no outer-page scrolling; resize observers and double animation-frame follow-up. Phone174pxdrawer,180pxscene minimum, scrolling transcript and76pxverbs column avoid clip. Core topology, navigation/story gates, game/AI scripts and embedded art byte-unchanged by map patch.

## Portrait status
Current game integrates only existing STATIC Manard Toxu still (`idle_poster.webp` reference). Existing six-reaction MP4/WebM/posters and quality report copied under art/reference/steward; not wired into runtime.11other NPCs have no verified accepted standalone portrait/reaction set for this build; procedural/hotspot rendering and Watcher remain. Proposed character seeds in legacy plan are NOT outputs/approvals. Full current placements in machine manifest. Player remains unnamed and needs no invented identity.

## P0 follow-up 2026-11-07
Real headless Chrome found/fixed the Sound button intercepting phone Floor plan taps and short-landscape scene collapse. Four viewport checks pass; see audit/P0-BROWSER-QA.md and tests/browser-test-results.json. Full story/physical-device/live-origin checks remain pending. Current playable index.html and dist/index.html match the new build hash in VERSION.json; reference HTML remains original provenance.
