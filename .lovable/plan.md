## Agents Section Redesign

Restructure the Agents hub from 3 templates → **2 focused agents**, add Instagram connection, wallet credits, and a saved reports library.

### 1. Agent Lineup (was 3, now 2)

**A. Content Publisher Agent**
- Generates a content plan (captions + image prompts) based on brand profile + chosen date range
- Creates draft `scheduled_posts` rows with `status = "pending_approval"`
- User reviews in an Approval Inbox → Approve / Edit / Reject
- Approved posts move to `status = "scheduled"` and (if IG connected) auto-publish at `scheduled_for`
- Inputs: date range, posts/week, platform, tone, optional campaign

**B. Insights Agent** (merged Researcher + Analyst)
- One agent, two modes via tabs: **Research** (trends, competitors, hashtags) and **Analyze** (engagement report from connected IG)
- Single run can blend both: "What's trending + how did we perform?"
- Output saved as a Report

### 2. Instagram Connection (test + train)

- New "Connect Instagram" card at top of Agents page
- Public Instagram only (Basic Display + Graph API for Business/Creator)
- Stores token in existing `meta_connections` table
- Used for: pulling recent posts/insights to train tone, publishing approved posts, fetching analytics
- Status pill: Disconnected / Connected as @handle / Token expiring

### 3. Wallet & Credits

- New `wallet` table: `user_id`, `balance`, `updated_at`
- New `credit_transactions` table: `user_id`, `agent_id`, `run_id`, `amount` (negative=spend), `reason`, `created_at`
- Pricing (per run):
  - Publisher plan generation: 5 credits
  - Publisher auto-publish (per post): 1 credit
  - Insights run: 3 credits
- Pre-flight check before `agent-runner` executes; deduct on success; refund on failure
- Wallet header chip on Agents page: "◆ 42 credits" with "Top up" button (stub for now)

### 4. Saved Reports Library

- New `agent_reports` table: `id`, `user_id`, `agent_id`, `run_id`, `title`, `type` (`research` | `analysis` | `plan`), `content_md`, `metadata`, `created_at`, `pinned`
- "Reports" tab on Agent detail + global "Reports" rail on Agents home
- Each report: open in modal, export as MD/PDF, pin, delete, re-run

### 5. Approval Inbox (Publisher)

- New panel on Publisher detail: list of `pending_approval` posts with image, caption, scheduled date
- Quick actions: Approve, Edit caption, Reschedule, Reject
- Bulk approve

### 6. Page Layout

```text
/dashboard/agents
┌──────────────────────────────────────────────┐
│ Header  [Wallet: 42◆ Top up] [Connect IG ●]  │
├──────────────────────────────────────────────┤
│ Your Agents (2 cards)                         │
│  ┌────────────┐  ┌────────────┐              │
│  │ Publisher  │  │ Insights   │              │
│  └────────────┘  └────────────┘              │
├──────────────────────────────────────────────┤
│ Saved Reports (horizontal rail)              │
├──────────────────────────────────────────────┤
│ Recent Runs                                   │
└──────────────────────────────────────────────┘
```

Detail page tabs: **Configure · Run · Approvals (Publisher only) · Reports · History**

### Technical changes

- DB migration: drop researcher/analyst seed templates; add `wallet`, `credit_transactions`, `agent_reports`; add `approval_status` to `scheduled_posts`
- Edit `src/pages/AgentBuilder.tsx`: 2 templates, wallet header, IG connect card, reports rail
- New components: `WalletBadge.tsx`, `InstagramConnectCard.tsx`, `ApprovalInbox.tsx`, `ReportsLibrary.tsx`, `ReportViewer.tsx`
- Edge functions:
  - `agent-runner`: add credit check/debit, save output to `agent_reports`, Publisher writes posts as `pending_approval`
  - `meta-oauth-start` / `meta-oauth-callback`: IG OAuth flow (requires `META_APP_ID`, `META_APP_SECRET`)
  - `meta-publish`: cron-style publish for approved posts at their scheduled time
- Hooks: `useWallet`, `useReports`, `useMetaConnection`

### Open questions before build

1. IG OAuth needs `META_APP_ID` + `META_APP_SECRET` — request now or scaffold UI with "Coming soon" until you provide them?
2. Wallet top-up: stub button, or wire Stripe/Paddle now?
3. Starting credit balance for new users (e.g. 50 free)?
