# Type-Safety Pass — AISTUDIYO

Goal: eliminate every `any`, empty `catch{}`, and empty-extends interface flagged by the audit. No behavior, UI, or feature changes.

## Scope of changes (file by file)

### Hooks
- **src/hooks/useWorkspace.tsx** — `(m: any)` → `(m: { workspace_id: string })`.
- **src/hooks/useScheduledPosts.ts** — `insert(post as any)` → `insert(post as Record<string, unknown>)`.
- **src/hooks/useTheme.tsx** — `catch {}` → `catch (_e) { /* storage unavailable */ }`.

### Layout & dashboard
- **src/components/DashboardLayout.tsx** — `NavItem.icon: any` → `React.ElementType`.
- **src/components/dashboard/AIDock.tsx** — `icon: any` → `React.ElementType`.
- **src/components/dashboard/HeaderAnnouncementCarousel.tsx** — three `catch {}`/`catch { return true }` → `catch (_e) { /* storage unavailable */ }` (preserve the `return true`).

### Pages
- **src/pages/AIGenerator.tsx** — two `catch (e: any)` → `catch (e: unknown)` with `(e as Error).message`.
- **src/pages/LoginPage.tsx** — `catch (err: any)` → `catch (err: unknown)` + `(err as Error).message`.
- **src/pages/ImageStudio.tsx** — type the edge-function response as `{ error?: string; image_url?: string; generated_prompt?: string }`; remove 5× `as any`. Tabs `setTab(v as any)` → `setTab(v as "text" | "image")`.
- **src/pages/AgentBuilder.tsx** — TEMPLATES `icon: any` → `React.ElementType`; logs map `(l: any)` → `(l: { msg: string })`.
- **src/pages/BrandingCRM.tsx** — `StatCard`/`ContactRow` `icon: any` → `React.ElementType`.
- **src/components/branding/BrandWorkspace.tsx** — `BridgeCard` `icon: any` → `React.ElementType`.
- **src/components/agents/InstagramConnectCard.tsx** — `useState<any>` → `useState<{ provider: string; handle?: string } | null>`.
- **src/components/scheduled/ScheduledPostsPanel.tsx** — `PLATFORM_ICON: Record<string, any>` → `Record<string, React.ElementType>`; `(opt: any)` → typed `{ label: string; ms?: number; date?: () => Date }`.
- **src/components/generator/RepurposeCard.tsx** — `setTab(t.id as any)` → `setTab(t.id as "thread" | "reel")`.

### Workflows
- **src/pages/workflows/nodes/WorkflowNodes.tsx** — add `NodeData` interface `{ nodeType: string; label?: string; description?: string; config?: { prompt?: string; template?: string; left?: string; [k: string]: unknown } }`. NODE_META `icon: any` → `React.ElementType`. Replace `(data as any)` with `(data as NodeData)`.
- **src/pages/workflows/WorkflowBuilder.tsx** — share/import the same `NodeData`. `runOutput` → `{ status: string; output?: unknown; error?: string } | null`. `updateSelected(patch: any)` → `Record<string, unknown>` and remove inner `as any` casts using NodeData. `graph as any` → `unknown as Record<string, unknown>`. `catch (e: any)` → `catch (e: unknown)`.
- **src/pages/workflows/WorkflowRuns.tsx** — `output: any` → `output: unknown`; replace `as any` casts with `as Run[]`.

### Superadmin
- **src/pages/superadmin/SuperAdminOverview.tsx** — type role/provider/ai-cost/model-count/fails/signups callbacks with concrete row shapes (`{ role: string }`, `{ enabled: boolean; status: string }`, `{ cost_usd?: string | number | null }`, `{ model_slug: string }`, etc.). Cast `setAiFails`/`setSignups` to their state types instead of `as any`.
- **src/pages/superadmin/SuperAdminWorkspaces.tsx** — type profile/member forEach params.
- **src/pages/superadmin/SuperAdminUsers.tsx** — `role as any` (2×) → `role as AppRole` (import from `useAuth`).
- **src/pages/superadmin/SuperAdminAI.tsx** — `p.status as any` → cast to `"healthy" | "degraded" | "down" | "unknown"`.
- **src/pages/superadmin/SuperAdminAnalytics.tsx** — replace 4× `as any` with typed interfaces for profiles/workspaces/aiLogs/activity.
- **src/pages/superadmin/SuperAdminCredits.tsx** — wallets/txns/profiles forEach + map typed per spec.
- **src/pages/superadmin/SuperAdminUserDetail.tsx** — replace `useState<any>` with typed Profile/Workspace/ActivityLog shapes; roles map typed.
- **src/pages/superadmin/SuperAdminSystem.tsx** — type ws/providers reduce/filter callbacks.
- **src/pages/superadmin/SuperAdminLogin.tsx** — `catch (err: any)` → `unknown`.
- **src/components/admin/PulseStrip.tsx** — forEach `(r: any)` → `{ created_at: string }`.
- **src/components/admin/AIInsightsDock.tsx** — `rows: any[]` → `{ cost_usd?: string | number | null }[] | null`; modelCounts forEach `{ model_slug: string }`; providers filter `{ enabled: boolean; status: string }`.

### Empty interfaces (shadcn ui)
- **src/components/ui/textarea.tsx** — `interface TextareaProps extends … {}` → `type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>`.
- **src/components/ui/command.tsx** — `interface CommandDialogProps extends DialogProps {}` → `type CommandDialogProps = DialogProps`.
- **src/components/ui/badge.tsx** — convert to `type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>`.

## Out of scope
- No new pages, components, edge functions, tables, or migrations.
- No styling, copy, routing, or behavioral changes.
- `src/integrations/supabase/types.ts` is auto-generated and not touched.

## Verification
Run `npx tsc --noEmit` and `npx eslint src --ext .ts,.tsx` after the pass; fix only regressions caused by the retypes.
