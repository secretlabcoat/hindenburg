# Combined game — November 8

Canonical collaboration branch: integration/current-game-20261108.

Included: origin/import/current-source-handoff-20261107 (793903f),
origin/fix/p0-browser-qa-20261107 (f55a8c4), local story/save commits
6556a3b, b57e043, 2cb43ba, and branch-push rule 3fd621d.
Remote master c7f83ae is already an ancestor of the handoff, not a newer game.
No existing branches deleted or rewritten. Production was not changed.

Merge resolved package scripts to retain both story/save regression and optional
browser tests; instruction conflicts resolved to current owner and conversation
authority. Version record rebuilt from combined source. Both index.html and
dist/index.html now contain the identical combined game. Original reference
artifact is retained under reference/.

Bathroom ZIP supplied by Paul: original curtain kept; East sink, South door,
West towel artwork embedded as supplied WebPs. West facing enabled in the
shared runtime art allowlist; navigation geometry unchanged. Supplied archive
metadata is provenance and its old candidate approval labels are historical;
Paul explicitly requested integration on November 8. No image generation or
AI service modification performed. Source photos are in art/bathroom-20261108/.

Validation: npm run build and npm test exit 0; 149 geometry assertions,
15 existing DOM groups, 8 story/save groups, 19 room map centering groups and
5 CSS assertions. Output in integration-test-output.txt. git diff --check passes.
Mounted built-in browser verified Continue Voyage and all four bathroom facings
with rendered artwork, South exit present and other walls without exits.
The optional Playwright test was not rerun because screen QA uses the mounted
browser; previous branch evidence is preserved under audit/P0-BROWSER-QA.md.

Limits remain: complete seven fresh-voyage journeys and historical save fixtures
are not verified (see STORY-SAVE-REGRESSION.md). Public preview publication was
previously blocked by MausBot account sign-in. This integration does not claim
production deployment or inclusion of other agents’ unpushed local work.

New agents should start from this integration branch, read START-HERE.md, and
return focused commits to it; do not independently use the older import branch.
