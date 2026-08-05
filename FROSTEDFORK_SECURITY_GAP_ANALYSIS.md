# Frosted Fork Security Gap Analysis

**Scope:** `/opt/frostedforksweets-site/`  
**Site identity:** Frosted Fork / Frosted Fork Sweets  
**Public domain:** `frostedforksweets.com` / `www.frostedforksweets.com`  
**Local app port:** `3001`  
**Generated:** 2026-07-13

> This review focuses on security risk and identity-cleanup gaps only. It does not evaluate visual design, business copy quality, or feature completeness except where those items affect security or correct site identification.

---

## Current Git Policy

All Git repositories are intentionally **local only**. The Frosted Fork production repository at `/opt/frostedforksweets-site` has no remote by design. Any older recommendations in this historical report to add/push a remote are superseded by this policy.

---

## Executive Summary

The application content and package metadata mostly identify the site as **Frosted Fork**, but the operational footprint still contains legacy **colleenjolicoeur-site** naming and a Git repository rooted at `/opt` instead of the project directory. The app is currently served by a **development Next.js server** through a systemd service and is exposed through local reverse proxy / Cloudflare tunnel components. This creates avoidable security and maintainability risk.

The highest-priority security cleanup is:

1. Run the site as a production build, not `next dev`.
2. Move or reinitialize Git so the repository root is `/opt/frostedforksweets-site`, not `/opt`.
3. Remove or archive legacy `colleenjolicoeur` service/config references.
4. Replace Cloudflare Quick Tunnel with a named Cloudflare Tunnel or a deliberately documented production proxy path.
5. Add production security controls: request validation/rate limiting for order submission, real email handling, secrets management, and security headers.
6. Update lockfile/package identity and dependency state.

---

## Observed State

| Area | Observed State | Security / Cleanup Impact |
|---|---|---|
| Project path | `/opt/frostedforksweets-site/` | Current production path now matches Frosted Fork Sweets identity. |
| App package name | `package.json` says `frosted-fork-site` | Correct current identity. |
| Lockfile package name | `package-lock.json` still says `colleenjolicoeur-site` version `1.0.0` | Identity drift; dependency provenance confusion. |
| README | Identifies Frosted Fork and `www.frostedforksweets.com` | Mostly correct. |
| Site constants | `data/site.ts` identifies Frosted Fork Sweets correctly | Correct. |
| Running process | `node ... next dev -p 3001` | Development server exposed locally/proxied; not production-hardened. |
| Active service | `frosted-fork.service` | Correct name, but configured as dev service. |
| Legacy service | `colleenjolicoeur-site.service` exists and is disabled | Stale config should be removed or clearly archived. |
| Nginx config | `frostedforksweets-proxy.conf` proxies to `127.0.0.1:3001` | Correct domain, but only basic proxy headers. |
| Cloudflare tunnel | `cf-quick-tunnel.service` active | Quick Tunnel is not ideal as a production access method. |
| App URL env | `.env.local` has local URL value | Production URL not set in local env file; avoid relying on localhost fallback in production. |
| Secrets | `.env.local` and `*.pem` are ignored; `cert.pem` exists | Verify no private material is committed; remove unused cert artifacts. |
| Git root | `git rev-parse --show-toplevel` returns `/opt` | Repository boundary is wrong for this project. |
| Git status | Dirty; 57 porcelain entries; no remote shown | Not current/clean in Git. |

---

## Security Risk Findings

### 1. Next.js is running in development mode

**Evidence**

`/etc/systemd/system/frosted-fork.service`:

```ini
ExecStart=/usr/bin/npx next dev -p 3001
Environment=NODE_ENV=development
Description=Frosted Fork - Small Cakes & Sweet Treats (Dev)
```

**Risk:** High  
Development mode can expose development behavior, less optimized/hardened runtime behavior, verbose errors, hot-reload surfaces, and operational instability. It is not appropriate for a locally hosted public/proxied site.

**Recommended cleanup**

- Build the app with `npm run build`.
- Change systemd to run `next start` or a standalone server in production mode.
- Set `NODE_ENV=production`.
- Avoid `npx` in systemd; call a deterministic binary path or npm script.

Example target pattern:

```ini
[Service]
Type=simple
User=nero
Group=nero
WorkingDirectory=/opt/frostedforksweets-site
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
```

Then:

```bash
cd /opt/frostedforksweets-site
npm ci
npm run build
sudo systemctl daemon-reload
sudo systemctl restart frosted-fork.service
```

---

### 2. Project Git repository is rooted at `/opt`, not the site directory

**Evidence**

```bash
git -C /opt/frostedforksweets-site rev-parse --show-toplevel
# /opt
```

`git status` shows deleted files from the parent `/opt` repo and untracked sibling directories outside the Frosted Fork project.

**Risk:** High  
A Git repository rooted at `/opt` can accidentally track unrelated infrastructure, secrets, service files, build artifacts, or other projects. It also makes it difficult to prove what version of Frosted Fork is deployed.

**Recommended cleanup**

- Create a dedicated repository rooted at `/opt/frostedforksweets-site`.
- Keep `/opt` out of application Git tracking.
- Add a remote origin for the Frosted Fork repo.
- Commit a clean baseline after validating `.gitignore`.

Suggested safe migration approach:

```bash
cd /opt/frostedforksweets-site
# after backing up the current /opt repo state if needed
rm -rf .git
# only if there is no nested project .git already; current observed root is /opt

git init
git add .gitignore README.md package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs app components data lib public
git status
git commit -m "baseline: Frosted Fork Sweets site"
git remote add origin <repo-url>
```

Do not commit:

- `.env.local`
- `.next/`
- `node_modules/`
- `archive/`
- `*.pem`
- local service/private tunnel credentials

---

### 3. Git is not current/clean

**Evidence**

Observed `git status --short --branch` showed:

- Branch: `main`
- 57 status entries
- Modified Frosted Fork files under `colleenjolicoeur-site/`
- Deleted parent `/opt` files unrelated to this project
- Untracked sibling directories under `/opt`
- No remote output was returned by `git remote -v`

**Risk:** Medium to High  
The deployed code cannot be confidently mapped to a clean commit. Rollback and auditability are weak.

**Answer:** No, everything is **not** current in `.git`. The repository is dirty and appears mis-scoped.

**Recommended cleanup**

1. Decide whether `/opt` repo should be preserved separately.
2. Move Frosted Fork into its own Git repo.
3. Commit the current intended production source.
4. Add a remote and push it.
5. Use deployment from tagged commits or release branches.

---

### 4. Legacy `colleenjolicoeur` service remains on disk

**Evidence**

`/etc/systemd/system/colleenjolicoeur-site.service` exists and is disabled. It references:

- `Description=colleenjolicoeur-site - Next.js Website`
- `Documentation=https://colleenjolicoeur.com`
- `WorkingDirectory=/opt/frostedforksweets-site/.next/standalone/colleenjolicoeur-site`
- `SyslogIdentifier=colleenjolicoeur-site`

**Risk:** Medium  
Stale services cause operator error and can restart the wrong app/path if enabled later. They also keep the old domain identity alive in operational documentation.

**Recommended cleanup**

If no longer needed:

```bash
sudo systemctl disable --now colleenjolicoeur-site.service 2>/dev/null || true
sudo rm /etc/systemd/system/colleenjolicoeur-site.service
sudo systemctl daemon-reload
sudo systemctl reset-failed
```

If historical record is required, move the unit file to a non-systemd archive outside `/etc/systemd/system/`.

---

### 5. Cloudflare Quick Tunnel is active

**Evidence**

`cf-quick-tunnel.service`:

```ini
ExecStart=/usr/bin/cloudflared tunnel --no-autoupdate --url http://localhost:3001
```

**Risk:** Medium to High  
Quick Tunnels are useful for temporary exposure, but they are not the preferred production pattern. They can create ambiguity around the public URL, logging, access control, and long-term ownership.

**Recommended cleanup**

- Replace Quick Tunnel with a named Cloudflare Tunnel tied to the Cloudflare account and hostname.
- Document the canonical route:
  - `www.frostedforksweets.com` -> Cloudflare -> tunnel/proxy -> `http://127.0.0.1:3001`
- Remove duplicate/unused `cloudflared.service` or `cf-quick-tunnel.service` paths after selecting one production path.
- Ensure tunnel credentials are stored outside the app repo.

---

### 6. Nginx proxy lacks explicit security headers and hardening

**Evidence**

`/etc/nginx/conf.d/frostedforksweets-proxy.conf` is a minimal HTTP reverse proxy to `127.0.0.1:3001`.

**Risk:** Medium  
Cloudflare can provide TLS and some edge protections, but origin and proxy-layer headers should still be deliberate. Without headers, browser-side protections are weaker.

**Recommended cleanup**

Add or enforce appropriate headers either in Next.js or Nginx/Cloudflare:

- `Strict-Transport-Security` if HTTPS-only is guaranteed
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Content-Security-Policy` after testing Stripe, images, and analytics requirements
- `X-Frame-Options` or CSP `frame-ancestors`

Also consider:

- Cloudflare SSL mode: **Full (strict)** where possible
- Redirect HTTP to HTTPS at Cloudflare and/or Nginx
- Cloudflare WAF/rate limiting for order endpoint

---

### 7. Order API accepts untrusted customer/order input with minimal validation

**Evidence**

`app/api/order/route.ts` checks only:

```ts
if (!body.customer?.email || body.items.length === 0) { ... }
```

**Risk:** Medium  
The endpoint can be abused for spam, malformed payloads, oversized payloads, log injection, fake order totals, or Stripe line item manipulation. The current subtotal is client-provided and customer fields are logged.

**Recommended cleanup**

- Validate schema server-side using a library such as `zod`.
- Recalculate all totals server-side from trusted product data.
- Enforce payload size, item count, quantity, and date constraints.
- Normalize and validate email/phone.
- Add bot protection/rate limiting at Cloudflare and/or app layer.
- Avoid logging full customer PII in plain console logs in production.
- Add CSRF/bot controls if the endpoint remains unauthenticated.

---

### 8. Email layer is a console-log stub

**Evidence**

`lib/email.ts` logs recipient, subject, and body to console.

**Risk:** Medium  
Orders may not reach the business inbox. Customer PII can land in system journals/log aggregation. If logs are retained broadly, privacy exposure increases.

**Recommended cleanup**

- Wire a real transactional email provider or SMTP service.
- Stop logging full order body/PII in production.
- Store only minimal operational metadata in logs.
- Document mail provider, sender domain, SPF/DKIM/DMARC status.

---

### 9. Dependency and lockfile state needs cleanup

**Evidence**

- `npm audit --omit=dev --json` reported 2 moderate vulnerabilities involving `next` via bundled `postcss` advisory metadata.
- `npm outdated --json` showed several packages behind wanted/latest versions.
- `package.json` and `package-lock.json` identity/version do not match.
- Installed versions in `node_modules` differ from package.json ranges because dependencies have already been updated locally.

**Risk:** Medium  
Dependency drift makes it hard to reproduce builds and confirm whether known vulnerabilities are fixed. The lockfile still carries legacy package identity.

**Recommended cleanup**

```bash
cd /opt/frostedforksweets-site
npm install
npm audit
npm outdated
npm run build
```

Then commit the updated `package.json` and `package-lock.json` together.

Recommended identity values:

- `package.json` name: `frosted-fork-site` or `frostedforksweets-site`
- `package-lock.json` root package name should match.
- Version should be intentionally bumped, e.g. `2.0.0` or next release version.

---

### 10. Local certificate artifact exists in project root

**Evidence**

`cert.pem` exists in `/opt/frostedforksweets-site/` and `.gitignore` ignores `*.pem`.

**Risk:** Low to Medium  
The file is ignored, but certificate/private key material should not live in the application source tree unless required and documented. If paired private keys exist elsewhere, accidental exposure risk increases.

**Recommended cleanup**

- Confirm whether `cert.pem` is needed.
- Move certificates to an OS-managed certificate directory if needed.
- Remove stale certificate artifacts from the repo directory.
- Verify no private keys are tracked by Git.

---

### 11. Production URL fallback can become localhost

**Evidence**

`app/api/order/route.ts`:

```ts
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
```

`.env.local` currently contains a localhost site URL.

**Risk:** Low to Medium  
If production environment variables are missing, generated Stripe success/cancel URLs can point to localhost, breaking checkout and potentially confusing users.

**Recommended cleanup**

- Set production `NEXT_PUBLIC_SITE_URL=https://www.frostedforksweets.com` in the systemd environment or environment file.
- Fail closed in production if canonical URL is absent.
- Do not rely on localhost fallback outside development.

---

### 12. Dev origin allowance remains configured

**Evidence**

`next.config.ts`:

```ts
allowedDevOrigins: ["192.168.70.161", "localhost"]
```

**Risk:** Low  
This is mostly development-specific, but it reinforces that the current service path is dev-oriented.

**Recommended cleanup**

- Keep dev-only settings documented.
- Ensure the production systemd service uses `NODE_ENV=production` and `next start`.
- Remove or isolate development-only config if not required.

---

## Identity Cleanup Checklist

Use this checklist to make the site identify consistently as **Frosted Fork Sweets**.

### Files / application

- [x] Rename project directory from legacy `/opt/colleenjolicoeur-site` to `/opt/frostedforksweets-site`.
- [x] Update `package-lock.json` root `name` from `colleenjolicoeur-site` to match `package.json`.
- [ ] Search and remove old `colleenjolicoeur` references from active source.
- [ ] Keep historical old-brand files only under an ignored archive, or remove them.
- [ ] Update `.env.local` example/defaults to `https://www.frostedforksweets.com` for production documentation.
- [ ] Consider adding `.env.example` with placeholder values only.

### Systemd

- [ ] Keep `frosted-fork.service`, but convert it from dev to production.
- [x] Remove `/etc/systemd/system/colleenjolicoeur-site.service` if no longer needed.
- [ ] Update service descriptions to remove `(Dev)` after production conversion.
- [ ] Add a systemd environment file such as `/etc/frosted-fork/frosted-fork.env` for non-secret and secret runtime envs with locked permissions.

### Proxy / Cloudflare

- [ ] Confirm canonical hostname: `www.frostedforksweets.com`.
- [ ] Redirect apex `frostedforksweets.com` to `www.frostedforksweets.com` or document both as supported.
- [ ] Replace Quick Tunnel with a named tunnel or document Nginx as the canonical ingress path.
- [ ] Add security headers at Cloudflare, Nginx, or Next.js.
- [ ] Verify Cloudflare SSL/TLS mode and origin reachability.

### Git / deployment

- [x] Move Git root to `/opt/frostedforksweets-site`.
- [ ] Add a remote repository.
- [ ] Commit clean source only.
- [ ] Tag releases.
- [ ] Exclude runtime/build artifacts and secrets.

---

## Git Current-State Answer

No — the project is **not clean/current in Git**.

Observed problems:

1. Git root is `/opt`, not `/opt/frostedforksweets-site`.
2. Git status is dirty with 57 entries.
3. Parent `/opt` deleted files and unrelated sibling directories appear in the same repo status.
4. Frosted Fork source files have uncommitted modifications.
5. Newly added product images are untracked.
6. No Git remote was shown by `git remote -v`.
7. Writing this report adds another project file that should be reviewed and committed only after repo cleanup.

Recommended target state:

```bash
cd /opt/frostedforksweets-site
git status --short
# should be empty after intended changes are committed

git remote -v
# should show the intended Frosted Fork remote
```

---

## Prioritized Remediation Plan

### Priority 0 — Prevent accidental exposure / identity confusion

- [ ] Back up current `/opt` Git state before restructuring.
- [ ] Decide whether to rename path to `/opt/frostedforksweets-site`.
- [ ] Remove or archive disabled legacy `colleenjolicoeur-site.service`.
- [ ] Verify no secrets are tracked in the current `/opt` Git repository.

### Priority 1 — Production runtime hardening

- [ ] Convert `frosted-fork.service` from `next dev` to production `next start`.
- [ ] Set `NODE_ENV=production`.
- [ ] Run `npm ci && npm run build` before service restart.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://www.frostedforksweets.com` for production.
- [ ] Add systemd hardening options where compatible, such as:
  - `NoNewPrivileges=true`
  - `PrivateTmp=true`
  - `ProtectSystem=full`
  - `ProtectHome=true` if compatible
  - `ReadWritePaths=/opt/frostedforksweets-site` only if needed

### Priority 2 — Edge/proxy security

- [ ] Replace Quick Tunnel with a named Cloudflare Tunnel or documented Nginx ingress.
- [ ] Add rate limiting for `/api/order`.
- [ ] Add browser security headers.
- [ ] Confirm HTTPS redirect and Cloudflare SSL mode.

### Priority 3 — App-layer controls

- [ ] Add schema validation for order submissions.
- [ ] Recalculate order totals server-side.
- [ ] Stop logging PII in production.
- [ ] Wire real transactional email.
- [ ] Add abuse controls such as Turnstile or similar bot protection if order spam appears.

### Priority 4 — Dependency and repo hygiene

- [ ] Sync `package.json` and `package-lock.json` identity/version.
- [ ] Run `npm audit` after lockfile cleanup.
- [ ] Commit a clean Frosted Fork baseline.
- [ ] Push to a dedicated remote repo.
- [ ] Document deployment steps in README.

---

## Suggested Final Naming Standard

| Item | Recommended Value |
|---|---|
| Business name | Frosted Fork |
| Site/project name | Frosted Fork Sweets |
| Canonical domain | `www.frostedforksweets.com` |
| Apex domain | `frostedforksweets.com` redirects to canonical or both documented |
| App directory | `/opt/frostedforksweets-site` |
| Systemd service | `frosted-fork.service` or `frostedforksweets.service` |
| Package name | `frostedforksweets-site` |
| Git repo | `frostedforksweets-site` |
| Runtime port | `3001` internal only |

---

## Verification Commands After Cleanup

```bash
# Service should say production, not dev
systemctl status frosted-fork.service
ps aux | grep -E 'next|node' | grep 3001

# Git should be scoped to the project and clean
cd /opt/frostedforksweets-site  # or final chosen path
git rev-parse --show-toplevel
git status --short
git remote -v

# App health
curl -I http://127.0.0.1:3001
curl -I https://www.frostedforksweets.com

# Dependency health
npm audit
npm outdated
npm run build
```

---

## Bottom Line

Frosted Fork Sweets has now been migrated to a production runtime, dedicated project-scoped Git repository, and Frosted Fork Sweets operational path. Historical findings above are retained for audit context; see the cleanup progress updates for current state.

---

## Cleanup Progress Update — 2026-07-13

The immediate cleanup pass completed the following remediation items:

- Converted `frosted-fork.service` from `next dev` to production `next start`.
- Bound the app to `127.0.0.1:3001` only.
- Removed the stale `colleenjolicoeur-site.service` systemd unit.
- Removed the temporary `cf-quick-tunnel.service` unit.
- Added basic browser security headers.
- Hardened `/api/order` with size checks, field normalization, validation, subtotal recalculation, and in-memory rate limiting.
- Reduced production PII logging in the email stub.
- Corrected `package-lock.json` identity to `frosted-fork-site` version `2.0.0`.
- Removed stale `cert.pem` from the app source tree after backup.
- Removed legacy `colleenjolicoeur.com` hostnames from the local `cloudflared` config file.
- Kept Cloudflare Email Routing as a lower-priority future item; current public email remains `frostedforksweets@outlook.com`.

Remaining lower-priority items:

- Local-only Git policy confirmed; no remote is required.
- Configure Cloudflare Email Routing if/when the domain alias `orders@frostedforksweets.com` is desired.
- Add Cloudflare WAF/rate limiting rules for `/api/order`.
- Add a true outbound transactional email path if form submissions must generate server-sent mail.


## Directory Migration Update — 2026-07-13

Production operations were separated from the legacy Colleen Jolicoeur path. The active site now lives at:

```text
/opt/frostedforksweets-site
```

Systemd now uses:

```ini
WorkingDirectory=/opt/frostedforksweets-site
ReadWritePaths=/opt/frostedforksweets-site
```

The old path `/opt/colleenjolicoeur-site` no longer exists as the production website path.


## Local-only Git Policy Update — 2026-07-13

Colleen confirmed that all Git repositories are local only. The absence of a remote for `/opt/frostedforksweets-site` is therefore intentional and no longer considered a cleanup gap. Operational verification should use local commands such as `git status`, `git log --oneline`, and local backup procedures.


## Remaining-items Completion Update — 2026-07-13

Additional local remediation completed:

- Added Nginx local rate limiting for `/api/order`, providing an origin-side control in addition to the app in-memory limiter.
- Added `client_max_body_size 64k` to the Frosted Fork Nginx vhost.
- Passed `CF-Connecting-IP` through Nginx to support Cloudflare-aware app rate limiting.
- Added local production order notification delivery through `/usr/sbin/sendmail`.
- Updated the production environment file to use `EMAIL_DELIVERY_MODE=sendmail` and `ORDER_NOTIFICATION_TO=frostedforksweets@outlook.com`.

Cloudflare dashboard WAF/rate limiting and Cloudflare Email Routing remain optional/dashboard-side enhancements, not local blockers.
