# Deployment authorization and safe handoff

## Art-only target — 2026-11-09

ShareHTML (`https://oofyjym.sharehtml.org/`) is an art source. Do not publish or edit it.

The permanent game is the existing Worker `hindenburg` at `https://hindenburg.secretlabcoat-0ba.workers.dev/`. The file to put in its catch-all response is `deploy/hindenburg-worker.html` (1,164,525 bytes, SHA-256 `2ed2fd16566b87974abdfafd5723f0b9327f2f363a13d7f3adc0e3d935b16565`). That file is the live Worker HTML plus ShareHTML’s ready photographs. It is not the V3 `dist/index.html`.

`deploy/hindenburg-worker-module.mjs` is an ES module that returns those exact bytes for every request, with `content-type: text/html;charset=utf-8` and `cache-control: no-cache`. Deploy that module only onto the existing `hindenburg` Worker. Do not create a worker, and do not change `hindenburg-ai`.

This branch does not publish by merging. Production was not changed when the artifact was built.

## Current authorization (Paul, 2026-11-08)

Paul authorizes agents to save and commit this project's changes locally, push them to the existing GitHub repository `https://github.com/secretlabcoat/hindenburg`, and deploy the game build to the existing Cloudflare game Worker `hindenburg` at `https://hindenburg.secretlabcoat-0ba.workers.dev/`.

- This authorization supersedes the inherited blanket no-push/no-deploy restrictions for these two destinations. No additional permission is needed merely to save or push project changes to GitHub.
- Paul explicitly instructed “Make all updates and changes go live” on 2026-11-08. This approves the currently pending release and supersedes its earlier preview-approval gate. Do not ask for repeat approval for this release. For future changes, retain the preview preference unless Paul explicitly authorizes publication.
- All agents Paul assigns to this project or shares its project link with may edit, commit, push, and publish within these destinations. This is operational authorization, not an anonymous public-write ACL: each agent must use authorized authenticated access. Do not expose or embed credentials in links or files.
- Alert Paul about contradictory active commands in project files. This current authorization supersedes inherited no-push/no-deploy/Fred-approval rules and older handoff uncertainty about the destination.
- Use an available supported connector, authenticated dashboard, Wrangler CLI, or documented Cloudflare API with authorized credentials. A connector/plugin is not mandatory. Confirm the existing account and Worker from configuration or authenticated service evidence; do not guess identifiers or expose credentials.
- Keep the separate `hindenburg-ai` relay untouched. This permission does not authorize unrelated resources, new paid services, or destructive changes.
- Authorization is not proof of access or deployment. If authentication is unavailable, report that access blocker. After deployment, verify the live build and gameplay before claiming completion.

The discovery notes below are historical findings, not current deployment verification or additional permission gates.

## Historical discovery snapshot — not current publication status

At the time of the original discovery task, no publication or remote mutation had been performed. The following findings may be stale; verify access and live state at execution time.

1. `https://oofyjym.sharehtml.org/` is a real Hindenburg preview. WebFetch during this task showed Offline mode/SHIP MAP (older build signature, not latest V3 proof). Latest critique names this URL. Strong current-playtest candidate, not established permanent canonical host.
2. `https://hindenburg.secretlabcoat-0ba.workers.dev/` is documented permanent game in /workspace/pm/repos/hindenburg.md:40–43 and historical HANDOFF.md:105–116. WebFetch shows Hindenburg/AI settings. Single-HTML Worker catch-all. Existing docs explicitly say no package.json/wrangler config and no established Cloudflare auth. No deploy config found in existing local game checkout; no secrets read.
3. `https://hindenburg-ai.secretlabcoat-0ba.workers.dev` is SEPARATE relay, not game host; MUST NOT redeploy under UI-site request.

Installed connector status: Replit/Lovable/GitHub/Origin; no Cloudflare or ShareHTML. Plugin search found official Cloudflare plugin407 (not installed), no ShareHTML connector. Do not use unrelated Replit/Lovable to invent a replacement host. CLI deployment not attempted because target ambiguous and no documented authenticated route. Parent can resolve host then use sanctioned connector or existing authenticated browser.

## ShareHTML supported same-URL update (public docs verified)
Official docs https://sharehtml.org/docs/api explicitly document `PUT /api/v1/pages/{id}` using existing owner's bearer or anonymous management key; Content-Type:text/html with new standalone HTML. Same URL, free retains latest only. POST creates a NEW site: not done. Need original pageID and authorized management/account access; don't guess pageID from slug, scrape credentials/cookies, or put keys in docs/ZIP. Parent can use their original authorized management session via UI to replace file, or approved documented API credential handling. No new source upload performed here. Public guide https://sharehtml.org/for-agents. Existing URL fetch is read-only evidence, not publication proof.

## Browser update checklist for parent
Confirm exact intended existing URL. Open existing authorized management dashboard (never public game page scripts). Use replace/upload HTML with reviewed `dist/index.html` or exact current `index.html`; preserve existing URL and privacy. This is already user-authorized site update once correct target/access resolved; no AI worker edit. Do not create account/new paid service. After upload, GET playable HTML and compare SHA256 against VERSION.json (host wrappers may require comparing embedded source instead). Verify topology marker `HindenburgTopology`/`data-player-dot` and final map CSS, then actual Begin/movement/map/live Colonel in browser. Record URL, deployed version/hash and verification result back into VERSION.json/DEPLOYMENT.md. Do not claim published from local save alone.

## Current Cloudflare route
Use a supported connector/plugin, authenticated dashboard, Wrangler CLI, or documented Cloudflare API for the EXISTING game Worker identified above, after confirming the account/resource and applying the current release authorization above. Do not invent account IDs or expose credentials. The target and permission are established above; available authentication must still be verified. Keep relay untouched.
