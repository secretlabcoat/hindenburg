# Deployment discovery / safe handoff

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
Use official connector/plugin or sanctioned logged-in dashboard/established CLI for EXISTING game Worker only, after confirming correct account/resource. Do not invent wrangler config/account IDs or inspect token files. Site request is authorized; access and exact target are unresolved here. Keep relay untouched.
