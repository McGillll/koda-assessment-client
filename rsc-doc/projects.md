# Projects — frontend contract

Service: `app/components/api/project/ProjectService.ts`. All calls send `Authorization: Bearer <token>` and `Accept: application/json`. JSON bodies only (no files), so updates use a real `PUT`.

| UI | Method | Endpoint | Request | Response `data` |
|---|---|---|---|---|
| List (`/projects`) | GET | `/projects` | query: `search?`, `status?`, `priority?`, `sort_by?`, `sort_dir?`, `page?` | `{ projects: Project[], meta: { current_page, last_page, per_page, total } }` |
| Edit form load (`/projects/:uuid/edit`) | GET | `/projects/{uuid}` | — | `{ project: Project }` |
| Create (`/projects/create`) | POST | `/projects` | `ProjectPayload` | `{ project: Project }` (201) |
| Edit save | PUT | `/projects/{uuid}` | `ProjectPayload` | `{ project: Project }` |
| Delete dialog | DELETE | `/projects/{uuid}` | — | `null` |

`ProjectPayload`: `client_name` (string, required), `project_name` (string, required), `description` (string \| null), `status` (`planning|in_progress|on_hold|completed`), `priority` (`low|medium|high`), `start_date` / `due_date` (`YYYY-MM-DD` \| null).

`Project` = payload fields + `uuid`, `status_label`, `priority_label`, `created_at`, `updated_at`.

Sorting: `sort_by` ∈ `client_name|project_name|status|priority|start_date|due_date|created_at`, `sort_dir` ∈ `asc|desc`. The UI always sends both (default `due_date` + `asc`); status/priority sort by workflow rank (planning→completed, low→high), not alphabetically. The URL omits them when on the default.

Errors the UI relies on:
- `401` → session cleared, redirect to `/login`.
- `404` → "Project not found" state (edit) / list refresh (delete).
- `422` → `data` is `{ field: string[] }`; first message shown under the matching field.

Client-side validation mirrors the backend: client/project name required (max 255), description max 5000, valid status/priority, due date ≥ start date.
