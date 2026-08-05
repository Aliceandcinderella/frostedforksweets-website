# Frosted Fork Sweets — Cloudflare Email Routing

## Lower-priority future target state

Use a domain-branded public email address and forward it through **Cloudflare Email Routing** to the existing mailbox:

| Purpose | Public address | Forward target |
|---|---|---|
| Orders / contact | `orders@frostedforksweets.com` | `frostedforksweets@outlook.com` |

For now, the website can continue displaying `frostedforksweets@outlook.com`. Switch the website to the domain address only after Cloudflare Email Routing is configured and tested.

## Important limitation

Cloudflare Email Routing is an **inbound forwarding/relay service**. It does not provide SMTP credentials or a transactional email API for the local Next.js server to send order notifications.

That means:

- `mailto:orders@frostedforksweets.com` works after Cloudflare routing is configured.
- Customer direct email can forward to Outlook.
- Server-side order form notifications still require one of these later options:
  - Cloudflare Worker-based form handler integrated with email routing/notifications
  - Outlook/Microsoft Graph
  - SMTP provider
  - Resend/SendGrid/Postmark/etc.

Until a real outbound/provider path is configured, the local app must avoid logging full PII in production and should treat order submissions as request records only.

## Cloudflare dashboard checklist

1. Cloudflare Dashboard → `frostedforksweets.com` → Email → Email Routing.
2. Enable Email Routing for the zone.
3. Add destination address:
   - `frostedforksweets@outlook.com`
4. Verify the destination mailbox.
5. Add custom address:
   - `orders@frostedforksweets.com` → `frostedforksweets@outlook.com`
6. Confirm Cloudflare-created MX/TXT DNS records are present and active.
7. Send a test message from an external mailbox to `orders@frostedforksweets.com`.
8. Confirm delivery in Outlook.

## Website configuration

The site identity file is:

```ts
data/site.ts
```

Future intended values after routing is configured:

```ts
email: "orders@frostedforksweets.com"
futureEmailForwardTo: "frostedforksweets@outlook.com"
futureEmailRelayProvider: "Cloudflare Email Routing"
```

## Security notes

- Do not publish the tunnel token or Cloudflare credentials in Git.
- Do not store Outlook credentials in the app repository.
- If a future outbound email provider is added, store secrets in `/etc/frosted-fork/frosted-fork.env` with `0600` permissions, not `.env.local`.
