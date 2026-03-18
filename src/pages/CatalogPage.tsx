import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type CatalogSummary = Record<string, number>

type CatalogResourceKey =
  | 'regions'
  | 'nodes'
  | 'users'
  | 'user_node_assignments'
  | 'user_entitlements'
  | 'node_groups'
  | 'inbounds'
  | 'outbounds'
  | 'vpn_identities'
  | 'identity_pool_members'
  | 'config_patches'
  | 'event_inbox'

type CatalogItem = {
  id: number
  [key: string]: string | number
}

type CatalogItemsByResource = Record<CatalogResourceKey, CatalogItem[]>

const MOCK_CATALOG_ITEMS: CatalogItemsByResource = {
  regions: [
    { id: 1, key: 'eu-west', name: 'EU West', status: 'active' },
    { id: 2, key: 'us-east', name: 'US East', status: 'active' },
  ],
  nodes: [
    { id: 1, name: 'node-001', region: 'eu-west', health: 'healthy' },
    { id: 2, name: 'node-002', region: 'us-east', health: 'degraded' },
  ],
  users: [
    { id: 1, user_id: 'alice', email: 'alice@example.com' },
    { id: 2, user_id: 'bob', email: 'bob@example.com' },
  ],
  user_node_assignments: [
    { id: 1, user_id: 'alice', node: 'node-001' },
    { id: 2, user_id: 'bob', node: 'node-002' },
  ],
  user_entitlements: [
    { id: 1, user_id: 'alice', policy: 'default' },
    { id: 2, user_id: 'bob', policy: 'restricted' },
  ],
  node_groups: [
    { id: 1, key: 'core-nodes', description: 'Primary core nodes' },
    { id: 2, key: 'edge-nodes', description: 'Edge nodes' },
  ],
  inbounds: [
    { id: 1, name: 'inbound-http', protocol: 'http' },
    { id: 2, name: 'inbound-https', protocol: 'https' },
  ],
  outbounds: [
    { id: 1, name: 'outbound-internet', type: 'internet' },
    { id: 2, name: 'outbound-internal', type: 'internal' },
  ],
  vpn_identities: [
    { id: 1, identity_id: 'vpn-1', user_id: 'alice' },
    { id: 2, identity_id: 'vpn-2', user_id: 'bob' },
  ],
  identity_pool_members: [
    { id: 1, pool: 'default', member_id: 'alice' },
    { id: 2, pool: 'default', member_id: 'bob' },
  ],
  config_patches: [
    { id: 1, patch_id: 'cfg-001', status: 'applied' },
    { id: 2, patch_id: 'cfg-002', status: 'pending' },
  ],
  event_inbox: [
    { id: 1, event_id: 'evt-001', type: 'warning' },
    { id: 2, event_id: 'evt-002', type: 'error' },
  ],
}

function fetchCatalogSummary(): Promise<CatalogSummary> {
  // GET /api/v1/catalog/summary
  return Promise.resolve({
    regions: 6,
    nodes: 28,
    users: 1280,
    user_node_assignments: 3840,
    user_entitlements: 1280,
    node_groups: 12,
    inbounds: 24,
    outbounds: 18,
    vpn_identities: 56,
    identity_pool_members: 52,
    config_patches: 142,
    event_inbox: 10500,
  })
}

const RESOURCE_LABELS: Record<string, string> = {
  regions: 'Regions',
  nodes: 'Nodes',
  users: 'Users',
  user_node_assignments: 'User node assignments',
  user_entitlements: 'User entitlements',
  node_groups: 'Node groups',
  inbounds: 'Inbounds',
  outbounds: 'Outbounds',
  vpn_identities: 'VPN identities',
  identity_pool_members: 'Identity pool members',
  config_patches: 'Config patches',
  event_inbox: 'Event inbox',
}

export function CatalogPage() {
  const [selectedResource, setSelectedResource] = useState<CatalogResourceKey | null>(null)
  const [itemsByResource, setItemsByResource] =
    useState<CatalogItemsByResource>(MOCK_CATALOG_ITEMS)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const { data: summary, isLoading } = useQuery({
    queryKey: ['catalog', 'summary'],
    queryFn: fetchCatalogSummary,
  })

  if (isLoading || !summary) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
        Loading catalog summary…
      </div>
    )
  }

  const entries = Object.entries(summary).sort(([a], [b]) => a.localeCompare(b))

  const handleSelectResource = (key: string) => {
    if (key in itemsByResource) {
      setSelectedResource(key as CatalogResourceKey)
      setEditingId(null)
      setFormValues({})
    }
  }

  const currentItems =
    (selectedResource && itemsByResource[selectedResource]) ?? []

  const fieldKeys =
    currentItems.length > 0
      ? Object.keys(currentItems[0]).filter((k) => k !== 'id')
      : ['name']

  const handleFormChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (item: CatalogItem) => {
    setEditingId(item.id)
    const nextFormValues: Record<string, string> = {}
    Object.keys(item).forEach((key) => {
      if (key === 'id') return
      nextFormValues[key] = String(item[key])
    })
    setFormValues(nextFormValues)
  }

  const handleDelete = (id: number) => {
    if (!selectedResource) return
    setItemsByResource((prev) => ({
      ...prev,
      [selectedResource]: prev[selectedResource].filter((item) => item.id !== id),
    }))
    if (editingId === id) {
      setEditingId(null)
      setFormValues({})
    }
  }

  const handleSubmit = () => {
    if (!selectedResource) return

    setItemsByResource((prev) => {
      const items = prev[selectedResource]
      if (editingId != null) {
        const updated = items.map((item) =>
          item.id === editingId ? { ...item, ...formValues } : item,
        )
        return { ...prev, [selectedResource]: updated }
      }

      const nextId =
        items.reduce((max, item) => Math.max(max, item.id), 0) + 1
      const newItem: CatalogItem = {
        id: nextId,
        ...fieldKeys.reduce(
          (acc, key) => ({
            ...acc,
            [key]: formValues[key] ?? '',
          }),
          {},
        ),
      }

      return {
        ...prev,
        [selectedResource]: [...items, newItem],
      }
    })

    setEditingId(null)
    setFormValues({})
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Catalog summary</h2>
        <p className="mt-1 text-xs text-slate-400">
          Record counts per resource. Use GET /api/v1/catalog/&#123;resource&#125; for raw data.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {entries.map(([key, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelectResource(key)}
            className={`text-left rounded-xl border p-4 transition ${
              selectedResource === key
                ? 'border-sky-500 bg-sky-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <p className="text-xs text-slate-400">
              {RESOURCE_LABELS[key] ?? key}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-50">
              {count.toLocaleString()}
            </p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">{key}</p>
          </button>
        ))}
      </div>

      {selectedResource && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                {RESOURCE_LABELS[selectedResource] ?? selectedResource}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Mock CRUD only – data is not persisted to the backend.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedResource(null)
                setEditingId(null)
                setFormValues({})
              }}
              className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-900"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    ID
                  </th>
                  {fieldKeys.map((field) => (
                    <th
                      key={field}
                      className="px-3 py-2 text-left font-medium text-slate-400"
                    >
                      {field}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right font-medium text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-400">
                      {item.id}
                    </td>
                    {fieldKeys.map((field) => (
                      <td
                        key={field}
                        className="whitespace-nowrap px-3 py-2 text-slate-200"
                      >
                        {String(item[field] ?? '')}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="mr-2 rounded border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded border border-rose-700/80 px-2 py-1 text-[11px] text-rose-300 hover:border-rose-500 hover:bg-rose-950/60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={fieldKeys.length + 2}
                      className="px-3 py-4 text-center text-xs text-slate-500"
                    >
                      No records yet. Use the form below to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs font-medium text-slate-300">
              {editingId ? 'Edit record' : 'Create new record'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {fieldKeys.map((field) => (
                <label key={field} className="space-y-1">
                  <span className="block text-[11px] font-medium text-slate-400">
                    {field}
                  </span>
                  <input
                    className="block w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    value={formValues[field] ?? ''}
                    onChange={(event) =>
                      handleFormChange(field, event.target.value)
                    }
                    placeholder={`Enter ${field}`}
                  />
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormValues({})
                  }}
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-900"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-sky-600 px-3 py-1 text-xs font-medium text-white hover:bg-sky-500"
              >
                {editingId ? 'Save changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
