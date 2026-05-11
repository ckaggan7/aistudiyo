## Goal
Give each user a personal Credit Wallet with usage history, and let Super Admins inspect / adjust credits per user from the backend admin panel.

## Current state
- `wallet` table exists but `user_id` is nullable and the hook fetches "first row" (shared, not per-user).
- `credit_transactions` table exists (amount, reason, agent_id, run_id) but is never displayed.
- `useWallet` hook + small `WalletBadge` already render in the agents page.
- No Settings/Credits page; no Super Admin credit management.

## Plan

### 1. Database (migration)
- Backfill / enforce wallet per user:
  - Update RLS on `wallet` so users only read/update **their own** row (`auth.uid() = user_id`), super_admin can read/update all.
  - Same per-user RLS on `credit_transactions` (users read own; super_admin reads all; inserts restricted to service role / own).
  - Trigger `on_auth_user_created` extension: when a new profile row is created, also insert a wallet with default 50 credits and `user_id = NEW.id`. Update `handle_new_user()` to create the wallet row.
  - Backfill: insert wallet rows for existing users that have none.
- Add `type` column to `credit_transactions` (`'debit' | 'credit' | 'adjustment' | 'topup'`) with default derived from amount sign, and an `actor_id` (who performed it — useful for admin adjustments). Optional/nullable, non-breaking.

### 2. Frontend — User Credits page
- New route `/dashboard/credits` (Credits & Usage), linked from Settings page and from the existing `WalletBadge` "Top up" button.
- Sections:
  - **Balance card**: current balance, lifetime spent, lifetime earned (computed from transactions).
  - **Usage chart**: last 30 days of debits (simple sparkline/area using existing chart primitives).
  - **Transaction table**: date, reason, agent/workflow link, amount (+/-), running balance. Paginated with `ReusableTable`.
  - **Top up** button → placeholder toast (billing skipped this round, per earlier scope).
- Update `useWallet`:
  - Filter `wallet` by `user_id = auth.uid()`, create row scoped to the user if missing.
  - Expose `transactions`, `spent30d`, `refresh`.

### 3. Frontend — Super Admin
- New route `/superadmin/credits` (Credit Management) in `SuperAdminShell`:
  - Table of all users with: email, balance, 30d usage, last activity.
  - Row action: **Adjust credits** (drawer with +/- amount and reason) → inserts a `credit_transactions` row (`type='adjustment'`, `actor_id=admin`) and updates wallet balance atomically via an RPC.
  - Filter/search by email, sort by balance/usage.
- Extend `AdminOverview` "Credits Consumed" stat to read real numbers from `credit_transactions` (last 30d sum of negatives).

### 4. Backend wiring
- New SQL function `public.adjust_user_credits(_user_id uuid, _delta int, _reason text)` — SECURITY DEFINER, requires `has_role(auth.uid(),'super_admin')`, updates wallet + inserts transaction in one transaction.
- Update `agent-runner` edge function: scope wallet lookup by `user_id` from the authenticated request, set `user_id` on transactions and runs.

### Technical notes
- Reuse `StatsCard`, `GlowCard`, `ReusableTable`, `FilterBar`, `Sparkline` — no new design system.
- Keep orange/black theme; no UI redesign.
- RLS uses existing `has_role()` security-definer helper — no recursion risk.
- No billing provider this round (per prior scope decision); "Top up" stays a placeholder.

## Deliverables
- 1 migration (RLS tighten + trigger + adjust_user_credits function + backfill).
- `src/pages/CreditsPage.tsx` (user-facing) + route + Settings link.
- `src/pages/admin/AdminCredits.tsx` + route in SuperAdminShell nav.
- Updated `useWallet` hook.
- Updated `agent-runner` to scope to user.