## Goal
Create a separate Super Admin portal at `/superadmin` — isolated from the main app — focused on monitoring users (list, roles, status). Reuses the existing UI system (orange/black, glassmorphism, AdminShell-style layout). No redesign.

## Scope (this round)

1. **Dedicated login at `/superadmin/login`**
   - Standalone page (not the user `/login`).
   - Email + password sign-in only (no Google, no signup).
   - After auth, verifies the user has `super_admin` role via `has_role()`. If not → sign out + show "Access denied".
   - Reuses existing visual identity (gradient hero, glow card).

2. **Protected `/superadmin/*` routes**
   - New `SuperAdminRoute` guard: requires session + `super_admin` role; otherwise redirect to `/superadmin/login`.
   - Wraps a new `SuperAdminShell` (sidebar variant of `AdminShell`, branded "SUPER ADMIN" in red/primary accent).

3. **Pages (monitoring scope = users + roles + status)**
   - `/superadmin` — Overview: total users, new this week, active sessions (from `activity_logs`), role distribution, recent signups.
   - `/superadmin/users` — Full user table:
     - Search by email/name, filter by role + status.
     - Columns: avatar, email, name, roles, status (active/suspended), workspace count, last activity, joined.
     - Row actions: grant/revoke role, suspend/reactivate, view details drawer.
   - `/superadmin/users/:userId` — Detail drawer/page: profile, roles, workspaces, recent activity logs, AI usage summary.

4. **Promote current user to `super_admin`**
   - Insert a `super_admin` row in `user_roles` for your currently signed-in account (using its `auth.uid()` resolved at run time via a one-shot SQL using the most recent profile — or you confirm the email in chat before I run it).

5. **Status field for users**
   - Add `status text default 'active'` (values: `active` | `suspended`) to `profiles`.
   - Suspended users get blocked at sign-in via a small client check + RLS-friendly flag (full session revocation requires admin API; suspension is reflected in UI + login gate now, hard token revocation can be a follow-up).

## Out of scope (future rounds)
- AI usage / credits monitoring per user
- Live sessions / IP / device tracking
- Impersonation
- Hard token revocation via Supabase Admin API edge function

## Files to add
```text
src/pages/superadmin/SuperAdminLogin.tsx
src/pages/superadmin/SuperAdminOverview.tsx
src/pages/superadmin/SuperAdminUsers.tsx
src/pages/superadmin/SuperAdminUserDetail.tsx
src/components/auth/SuperAdminRoute.tsx
src/components/layout/SuperAdminShell.tsx
```

## Files to edit
- `src/App.tsx` — register `/superadmin/*` routes outside the regular app shell.
- `src/integrations/supabase/types.ts` — auto-updates after migration.

## Migrations
- `ALTER TABLE profiles ADD COLUMN status text NOT NULL DEFAULT 'active'`.
- Insert `super_admin` role for your current account (confirmed via the email tied to your active session before running).

## UX
- Same orange + black ecosystem, same components (`ReusableTable`, `FilterBar`, `StatsCard`, `GlowCard`).
- Distinct "SUPER ADMIN" badge in sidebar header (red dot + uppercase tracking) so it's visually clear you're in the privileged area.
- Cmd+K palette is NOT mounted inside the super admin shell (kept isolated).

## Acceptance
- Visiting `/superadmin` while logged out → `/superadmin/login`.
- Logging in as a non-super-admin → "Access denied", signed out.
- Logging in as super_admin → Overview with live counts.
- `/superadmin/users` lists all users, supports search/filter, grant/revoke roles, suspend/reactivate, CSV export.
- Suspended users cannot sign in to the main `/login` (blocked with toast).
