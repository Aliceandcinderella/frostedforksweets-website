# Frosted Fork Sweets — Local Operations

## Identity

| Item | Value |
|---|---|
| Business/site | Frosted Fork Sweets |
| Canonical domain | `https://www.frostedforksweets.com` |
| Apex domain | `https://frostedforksweets.com` |
| Local app path | `/opt/frostedforksweets-site` |
| Runtime port | `3001` internal |
| Systemd service | `frosted-fork.service` |
| Cloudflare ingress | named `cloudflared.service`; quick tunnel removed |
| Public email now | `frostedforksweets@outlook.com` |
| Future lower-priority email alias | `orders@frostedforksweets.com` -> `frostedforksweets@outlook.com` via Cloudflare Email Routing |

## Runtime

The site runs as a production Next.js process:

```bash
sudo systemctl status frosted-fork.service
sudo systemctl restart frosted-fork.service
journalctl -u frosted-fork.service -f
```

Build and restart:

```bash
cd /opt/frostedforksweets-site
npm ci
npm run build
sudo systemctl restart frosted-fork.service
```

Runtime environment file:

```bash
/etc/frosted-fork/frosted-fork.env
```

This file is root-owned and should not be committed to Git.

## Cloudflare

The temporary `cf-quick-tunnel.service` was removed. The remaining ingress service is the named Cloudflare service:

```bash
sudo systemctl status cloudflared.service
```

The current local Cloudflare config file still contains other hostnames and should be reviewed separately before changing because it may support additional local sites.

## Email

Current public email remains:

```text
frostedforksweets@outlook.com
```

Cloudflare Email Routing is documented as a lower-priority future cleanup item, not a current dependency. See `docs/EMAIL_RELAY.md`.

Production order notifications use local `sendmail` when available:

```text
EMAIL_DELIVERY_MODE=sendmail
ORDER_NOTIFICATION_TO=frostedforksweets@outlook.com
SENDMAIL_PATH=/usr/sbin/sendmail
```

## Security controls added

- Production service now uses `npm run start`, not `next dev`.
- `NODE_ENV=production` is loaded via `/etc/frosted-fork/frosted-fork.env`.
- Basic browser security headers are set in `next.config.ts`.
- Order API has size limits, field normalization, basic validation, subtotal recalculation, and in-memory rate limiting.
- Production order notification uses local `sendmail`; if delivery fails, only minimal error metadata is logged.
- Production email logging avoids full customer PII/order body except as required inside the outbound email message.

## Local Git policy

All Git repositories are intentionally **local only**. Do not add GitHub/GitLab remotes unless the local-only policy changes.

Useful local Git commands:

```bash
cd /opt/frostedforksweets-site
git status
git log --oneline -5
git diff
git add <files>
git commit -m "describe the change"
```

## Remaining required follow-up

- Lower priority: configure Cloudflare Email Routing for `orders@frostedforksweets.com` and test delivery.
- Optional: replace local `sendmail` with a managed transactional provider if stronger deliverability/reporting is needed.
- Optional Cloudflare dashboard enhancement: add edge WAF/rate limiting for `/api/order`; local Nginx and app-layer rate limiting are already configured.

## Cleanup completed on 2026-07-13

- Removed stale `cert.pem` from the app source tree after backing it up.
- Removed legacy `colleenjolicoeur.com` hostnames from `/home/nero/.cloudflared/config.yml`; retained other active hostnames.
- Created a dedicated local-only Git repository rooted at `/opt/frostedforksweets-site`.
- Kept Cloudflare Email Routing as a lower-priority future item; current public email remains `frostedforksweets@outlook.com`.

## Directory migration completed

The production site was migrated from the legacy path to the Frosted Fork path:

```text
/opt/colleenjolicoeur-site -> /opt/frostedforksweets-site
```

The old path is no longer part of production operations.

## Remaining-items completion update

- Added Nginx request rate limiting for `POST /api/order` using `limit_req_zone` and `limit_req`.
- Added Nginx `client_max_body_size 64k` for the Frosted Fork vhost.
- Added proxy forwarding of `CF-Connecting-IP` to preserve Cloudflare client IP context for app-layer rate limiting.
- Added local `sendmail` production email delivery support.
- Updated `/etc/frosted-fork/frosted-fork.env` for `EMAIL_DELIVERY_MODE=sendmail`.
