# Multi-tenancy (tenant panel)

The plan, decisions, work orders and changelog live in the **backend** repo:
`backend/docs/multi-tenancy/` — start with `README.md`.

Admin-side summary: the tenant panel is this same app run with
`NEXT_PUBLIC_PANEL=tenant` and `NEXT_PUBLIC_BACKEND=<api>/tenant/api`. It uses
the same `src/components/library` components; never copy a component for the
tenant panel — add a panel switch or a prop instead.
