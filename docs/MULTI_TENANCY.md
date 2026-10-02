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
