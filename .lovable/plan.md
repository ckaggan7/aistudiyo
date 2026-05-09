## Simplify dashboard sidebar

Reduce the 13-item sidebar in `src/components/DashboardLayout.tsx` to 5 core sections with sub-items revealed on hover/expand. No other UI changes.

### New structure

```
Dashboard           → /dashboard
Create              (LayoutGroup)
  ├─ AI Generator   → /dashboard/generator
  ├─ Images         → /dashboard/image-studio
  ├─ Design Studio  → /dashboard/design
  └─ Templates      → /dashboard/templates
Automate            (LayoutGroup)
  ├─ Agents         → /dashboard/agents
  └─ Workflows      → /dashboard/workflows
Plan                (LayoutGroup)
  ├─ Calendar       → /dashboard/calendar
  ├─ Media Library  → /dashboard/media
  └─ Branding CRM   → /dashboard/branding
Insights            (LayoutGroup)
  ├─ Trend Engine   → /dashboard/trends
  └─ Analytics      → /dashboard/analytics
Settings            → /dashboard/settings
```

Top-level visible items drop from 13 → 6 (Dashboard, Create, Automate, Plan, Insights, Settings).

### Implementation

- Edit only `src/components/DashboardLayout.tsx`.
- Replace flat `navItems` with a grouped structure (`{ icon, label, path? , children? }`).
- Render top-level items as collapsible groups using a small local `useState` for which group is open. A group auto-expands when the current route matches one of its children.
- Group header: icon + label + chevron (rotates on open). Children: indented list, no icons (or smaller icons), same active-state styling as today.
- Keep all existing styling tokens (`bg-primary/10 text-primary`, `bg-sidebar`, etc.) — no design system changes.
- Preserve mobile drawer behavior, `WorkspaceSwitcher`, and the ⌘K kbd hint.
- Icons: keep `LayoutDashboard`, `Settings`. New group icons: `Sparkles` (Create), `Bot` (Automate), `Calendar` (Plan), `BarChart3` (Insights). Drop unused imports.

### Out of scope

- No route changes, no new pages, no removal of existing pages.
- No changes to top bar, theme tokens, or other components.
