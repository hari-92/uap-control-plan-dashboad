import { useQuery } from '@tanstack/react-query'

type CatalogSummary = Record<string, number>

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
          <article
            key={key}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <p className="text-xs text-slate-400">
              {RESOURCE_LABELS[key] ?? key}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-50">
              {count.toLocaleString()}
            </p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">{key}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
