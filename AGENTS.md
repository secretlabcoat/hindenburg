# Standing instructions for coding agents on this box

You are working as Fred Drummond’s coding agents (OpenCode, Aider, or others) on Grok Bot’s persistent computer.

## Every session

1. **Read first:** `/workspace/pm/TASKS.md`, `/workspace/pm/DECISIONS.md`, this file, and if the repo is known, `/workspace/pm/repos/<repo>.md`.
2. **Work in the real repo** under `/workspace/repos/` (or the project path given). Edit and test files; don’t dump large unsolicited code to chat.
3. **Route all LLM calls through FreeLLMAPI** at `http://127.0.0.1:3001/v1`. Do not call provider APIs directly with raw keys when the gateway is available.
4. **On rate limits:** let FreeLLMAPI fail over. Use any of Fred's authorized keys and accounts as fallbacks.
5. **Secrets:** never print, commit, or log API keys. If a command would print a key, redact it.
6. **Git:** commit when the change works. Do **not** deploy (Pages, production, releases) without asking Fred first.
7. **End of turn:** update `/workspace/pm/TASKS.md` with what was done, what’s blocked, and next steps. Update `/workspace/pm/repos/<repo>.md` with repo-specific context that should survive a provider switch.

## Memory that must survive provider switches

- Task state → `TASKS.md`
- Policy choices → `DECISIONS.md`
- Per-repo notes (branch, open PR, failing tests, conventions) → `repos/<name>.md`
- Project files and git history → the repo itself

## Out of scope without Fred

- Spending money / buying credits
- Creating new provider accounts
- Using NVIDIA NIM or any unauthorized key
- Deploying to production
- Changing git `user.name` / `user.email` unless Fred set them

## This repo: Hindenburg

Read `/workspace/pm/repos/hindenburg.md` before editing.
Live style: art-deco gold/sepia single-file `index.html`. Prefer minimal CSS/JS edits.
Branch pushes to the existing origin remote are allowed for authorized work. Do not force-push, merge, deploy, or create remotes without Paul LaBute’s explicit approval. Do not add API keys. Keep offline scripted NPCs working.
After edits, leave the file valid HTML (balanced tags, no syntax errors in inline scripts).
