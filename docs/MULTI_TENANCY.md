# Multi-tenancy (tenant panel)

The plan, decisions, work orders and changelog live in the **backend** repo:
`backend/docs/multi-tenancy/` — start with `README.md`.

Admin-side summary: the tenant panel is this same app run with
`NEXT_PUBLIC_PANEL=tenant` and `NEXT_PUBLIC_BACKEND=<api>/tenant/api`. It uses
the same `src/components/library` components; never copy a component for the
tenant panel — add a panel switch or a prop instead.

**Docs:** `/docs` is the super admin's (guides + component library).
Tenants' documentation is `/user-docs` — add or change a tenant feature, update
its user guide. Guide links on shared screens go through `docsPath()` (panel.ts)
so the tenant panel opens the user guide; keep section anchors in step.

**Home:** the tenant panel's `/` is its public landing page (`src/app/_landing`)
and its dashboard is `/dashboard`; the super admin's `/` stays the dashboard.
Link or redirect home with `HOME` (panel.ts), never a bare `'/'` — the sidebar's
`'/'` entries are mapped through `homeHref()`.

**Sign-in:** the tenant panel keeps its token under `MINT_TENANT_TOKEN` (fixed,
constants.tsx — `NEXT_PUBLIC_TOKEN_NAME` only sets the admin's), so both
panels can be signed in side by side in one browser.
