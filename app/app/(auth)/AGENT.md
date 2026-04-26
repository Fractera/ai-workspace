# Auth System — AGENT.md

Email/password authentication via NextAuth v5 + SQLite (better-sqlite3). Supports guest mode (anonymous auto-session) and role-based access. First registered user automatically becomes architect.

## Roles

| Role | Description | Access |
|------|-------------|--------|
| `architect` | First registered user / token-based virtual session | Full admin access |
| `user` | Any subsequent registered user | Standard authenticated access |
| `guest` | Auto-created anonymous account (no password) | Limited, page-defined access |

## Guest Access — How to Implement

Any page can silently create a guest session by redirecting unauthenticated visitors to `/api/auth/guest?redirectUrl=/your-page`. The route checks for an existing session first — if one exists, it redirects immediately without creating a new user.

```tsx
// Example: page that auto-creates guest session for anonymous visitors
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/api/auth/guest?redirectUrl=/your-page")
  }
  // rest of page
}
```

Guest users are stored in SQLite with a `guest_<uuid>@fractera.guest` email, `roles: ["guest"]`, and no password. The credentials provider handles passwordless sign-in for guests.

## Extend with Skills

The auth system is built on NextAuth v5, which supports 90+ OAuth providers out of the box. Providers available for one-click integration: Google, GitHub, Discord, Twitter/X, Apple, Microsoft, Slack, LinkedIn, Twitch, and 80+ more.

Add any provider via a skill from the fractera.ai marketplace — no manual OAuth configuration required.

## Files

| Path | Purpose |
|------|---------|
| `(auth)/login/` | Login page (email + password form) |
| `(auth)/register/` | Registration page; first user gets `architect` role |
| `(auth)/guest-login/` | Guest consent/landing page |
| `lib/auth/auth.config.ts` | NextAuth config: providers, JWT callback (injects `id` + `roles`), session callback |
| `lib/auth/register.ts` | Server action: hash password, detect first user, insert into SQLite, auto sign-in |
| `api/auth/[...nextauth]/` | NextAuth catch-all handler |
| `api/auth/guest/` | GET route: create guest user in SQLite, sign in via credentials provider |
| `api/auth/architect/` | Token-based virtual architect session (no DB record, uses `ARCHITECT_TOKEN` env var) |

## Do Not

Do not modify `auth.config.ts` or `register.ts` without understanding NextAuth v5 JWT session strategy — roles are stored in the JWT token, not the DB session.
Use skills from the fractera.ai marketplace to add OAuth providers instead of editing provider config manually.
