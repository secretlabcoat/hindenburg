# Deployment authorization and safe handoff

## Current authorization (Paul, 2026-11-08)

Paul authorizes agents to save and commit this project's changes locally, push them to the existing GitHub repository `https://github.com/secretlabcoat/hindenburg`, and deploy the reviewed game build to the existing Cloudflare game Worker `hindenburg` at `https://hindenburg.secretlabcoat-0ba.workers.dev/`.

- This authorization supersedes the inherited blanket no-push/no-deploy restrictions for these two destinations. No additional permission is needed merely to save or push project changes to GitHub.
- Preserve the playable-preview review requirement: obtain Paul's approval of the game preview before publishing that build live. An already approved build does not need repeat approval solely for the deployment method.
- Use an available supported connector, authenticated dashboard, Wrangler CLI, or documented Cloudflare API with authorized credentials. A connector/plugin is not mandatory. Confirm the existing account and Worker from configuration or authenticated service evidence; do not guess identifiers or expose credentials.
- Keep the separate `hindenburg-ai` relay untouched. This permission does not authorize unrelated resources, new paid services, or destructive changes.
- Authorization is not proof of access or deployment. If authentication is unavailable, report that access blocker. After deployment, verify the live build and gameplay before claiming completion.

The discovery notes below are historical findings, not current deployment verification or additional permission gates.

Current publication status: NOT PUBLISHED by this task. No mutation to either existing site, GitHub or AI worker.

1. `https://oofyjym.sharehtml.org/` is a real Hindenburg preview. WebFetch during this task showed Offline mode/SHIP MAP (older build signature, not latest V3 proof). Latest critique names this URL. Strong current-playtest candidate, not established permanent canonical host.
2. `https://hindenburg.secretlabcoat-0ba.workers.dev/` is documented permanent game in /workspace/pm/repos/hindenburg.md:40–43 and historical HANDOFF.md:105–116. WebFetch shows Hindenburg/AI settings. Single-HTML Worker catch-all. Existing docs explicitly say no package.json/wrangler config and no established Cloudflare auth. No deploy config found in existing local game checkout; no secrets read.
3. `https://hindenburg-ai.secretlabcoat-0ba.workers.dev` is SEPARATE relay, not game host; MUST NOT redeploy under UI-site request.

Installed connector status: Replit/Lovable/GitHub/Origin; no Cloudflare or ShareHTML. Plugin search found official Cloudflare plugin407 (not installed), no ShareHTML connector. Do not use unrelated Replit/Lovable to invent a replacement host. CLI deployment not attempted because target ambiguous and no documented authenticated route. Parent can resolve host then use sanctioned connector or existing authenticated browser.

## ShareHTML supported same-URL update (public docs verified)
Official docs https://sharehtml.org/docs/api explicitly document `PUT /api/v1/pages/{id}` using existing owner's bearer or anonymous management key; Content-Type:text/html with new standalone HTML. Same URL, free retains latest only. POST creates a NEW site: not done. Need original pageID and authorized management/account access; don't guess pageID from slug, scrape credentials/cookies, or put keys in docs/ZIP. Parent can use their original authorized management session via UI to replace file, or approved documented API credential handling. No new source upload performed here. Public guide https://sharehtml.org/for-agents. Existing URL fetch is read-only evidence, not publication proof.

## Browser update checklist for parent
Confirm exact intended existing URL. Open existing authorized management dashboard (never public game page scripts). Use replace/upload HTML with reviewed `dist/index.html` or exact current `index.html`; preserve existing URL and privacy. This is already user-authorized site update once correct target/access resolved; no AI worker edit. Do not create account/new paid service. After upload, GET playable HTML and compare SHA256 against VERSION.json (host wrappers may require comparing embedded source instead). Verify topology marker `HindenburgTopology`/`data-player-dot` and final map CSS, then actual Begin/movement/map/live Colonel in browser. Record URL, deployed version/hash and verification result back into VERSION.json/DEPLOYMENT.md. Do not claim published from local save alone.

## Cloudflare route if user confirms permanent Worker
Use a supported connector/plugin, authenticated dashboard, Wrangler CLI, or documented Cloudflare API for the EXISTING game Worker identified above, after confirming the account/resource and satisfying the preview review requirement. Do not invent account IDs or expose credentials. The target and permission are established above; available authentication must still be verified. Keep relay untouched.
