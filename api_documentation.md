# UAP Control Plane API Documentation

This document lists all available API endpoints for the `uap-control-plane`. These can be used to build an Admin UI or integrate with other services.

## Authentication

| Type | Header / Method | Description |
| :--- | :--- | :--- |
| **Basic** | `Authorization: Basic <base64(user:pass)>` | Used for Admin APIs (`/api/v1/*`). |
| **API Key**| `X-API-Key: <your-api-key>` | Used for Internal and Compatibility APIs. |
| **Public** | None | Publicly accessible (e.g., subscriptions). |

---

## Admin APIs (`/api/v1/*`)
*Requires HTTP Basic Auth*

### System & Health
- `GET /healthz` - Service health status (Public)
- `GET /swagger/` - Interactive Swagger documentation

### Monitoring & Telemetry
- `GET /api/v1/events` - Audit log of intent events
- `GET /api/v1/telemetry/summary` - Global telemetry summary
- `GET /api/v1/users` - List all user projections

### Infrastructure Management
- `GET /api/v1/regions` - List all managed regions
- `POST /api/v1/regions` - Create or update a region
- `GET /api/v1/regions/{key}` - Get details for a specific region
- `PUT /api/v1/regions/{key}` - Update region configuration
- `DELETE /api/v1/regions/{key}` - Remove a region
- `GET /api/v1/metadata/nodes` - List all registered nodes
- `GET /api/v1/metadata/regions/{region}/nodes` - List nodes assigned to a region
- `POST /api/v1/node-enrollment-tokens` - Issue a one-time enrollment token for a node

### Intent & Control
- `POST /api/v1/reconcile-run` - Manually trigger a reconciliation loop
- `GET /api/v1/reconcile-plan` - View the current desired vs actual state plan
- `GET /api/v1/catalog/summary` - Metadata catalog summary (users, nodes, assignments, etc.)
- `GET /api/v1/catalog/{resource}` - Get raw records for a specific catalog resource
- `POST /api/v1/catalog/{resource}` - Upsert data into the catalog
- `POST /api/v1/intents/user-upsert` - Accept a user upsert intent
- `POST /api/v1/intents/user-policy` - Change user policies (enable/disable, limits)
- `POST /api/v1/intents/user-access-patch` - Patch user access rules

---

## Compatibility (SUI) APIs (`/api/v1/*`)
*Requires X-API-Key*

These routes provide compatibility with standard proxy management UIs.

### User Management
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/{user_id}` - Get user status and usage
- `PUT /api/v1/users/{user_id}` - Update user profile
- `DELETE /api/v1/users/{user_id}` - Mark user as deleted
- `POST /api/v1/users/{user_id}/enable` - Enable user access
- `POST /api/v1/users/{user_id}/disable` - Disable user access
- `POST /api/v1/users/{user_id}/reset-traffic` - Reset bandwidth usage counters
- `POST /api/v1/users/{user_id}/reset-time` - Reset time usage counters

### Statistics & Connectivity
- `GET /api/v1/users/{user_id}/traffic` - Get detailed traffic statistics
- `GET /api/v1/users/{user_id}/online` - Check if user is currently connected
- `POST /api/v1/users/online/batch` - Check online status for multiple users
- `GET /api/v1/users/{user_id}/nodes` - Get nodes currently assigned to this user
- `GET /api/v1/nodes` - List all nodes with status and load info
- `GET /api/v1/nodes/{node_id}` - Get detailed node information

---

## Public APIs
*No Authentication Required*

- `GET /api/v1/subscriptions/{user_id}` - Get structured subscription info
- `GET /sub/{user_id}` - Get raw subscription document (e.g., for sing-box/clash)
