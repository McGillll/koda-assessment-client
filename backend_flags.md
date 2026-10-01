# Backend flags

Frontend features shipped ahead of (or working around) a missing backend endpoint.

## 2026-10-01 — Project summary counts by status

**Where:** `/dashboard` (`app/pages/dashboard.vue`)

**Current workaround:** the dashboard fires 5 parallel requests to the existing list endpoint and reads `meta.total` from each:

- `GET /projects?per_page=1` → total
- `GET /projects?status={planning|in_progress|on_hold|completed}&per_page=1` → per-status count

Works today, but costs 5 requests (out of the 60/min shared rate limit) per dashboard load and 5 count queries.

**Requested endpoint:** `GET /projects/summary` (auth: `auth:sanctum`, `abilities:auth:user`)

```json
{
    "success": true,
    "message": "Project summary retrieved.",
    "data": {
        "total": 12,
        "by_status": { "planning": 3, "in_progress": 5, "on_hold": 1, "completed": 3 }
    }
}
```

Every status key always present (0 when empty). One `GROUP BY status` query, soft-deleted projects excluded. Once it ships, swap `fetchSummary()` in `dashboard.vue` to a single `projectService.fetchSummary()` call.
