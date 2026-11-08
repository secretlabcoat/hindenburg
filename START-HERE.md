# Hindenburg — current shared local working source
Read HANDOFF.md, CURRENT-STATE.md, TODO.md and ART-DIRECTION.md before work. This new folder supersedes old box/GitHub/import snapshots for this local V3 continuation, not a claim of global newest Mac version.

- `index.html`: exact runnable, self-contained current V3 reference; open directly.
- `src/index.template.html`, `src/scripts/`, `src/styles/`: editable extracted source, preserved order.
- `src/topology-v3.json`: SINGLE spatial model. `src/scripts/topology-runtime.js` uses TOPOLOGY_DATA substituted at build time.
- `python3 build.py`: produces `dist/index.html`. Baseline round-trip matches reference byte-for-byte. Edit source, not generated output. Intentional updates must bump VERSION.json and record new hash/tests before publishing.
- `art/facing-manifest-v3.json`: all76current facing prompts/geometry/status,19rooms.
- `art/staging/`: future candidates only. Legacy art/reference and old plans are not new approvals.
- `tests/`: Python geometry + JSDOM; `npm install` installs pinned free dev dependency, `npm test`. No network/live dialogue is exercised by these mocked tests.
- `audit/`: prior tests and exact topology change audit.
- No credentials, paid calls, production deployment tools, repositories or authentication state included.

Local shared machine path: `/workspace/projects/hindenburg-playtest/`. Other agents share files but not browser desktops. Transfer ZIP to agents on another machine; box paths are not Fred’s Mac paths. Historical no-push restriction superseded: follow current AGENTS.md and DEPLOYMENT.md authorization for GitHub and the existing Cloudflare game Worker. Do not edit historical imports or the reported Mac original.
