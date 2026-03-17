import { RegionStatus } from '../enums'

// Mirrors internal/types.Region in the backend.
type Region = {
  key: string
  status: RegionStatus
  config_version: number
  created_at: string
}

const MOCK_REGIONS: Region[] = [
  {
    key: 'us-west-1',
    status: RegionStatus.Active,
    config_version: 42,
    created_at: '2024-01-01T12:00:00Z',
  },
  {
    key: 'eu-central-1',
    status: RegionStatus.Active,
    config_version: 17,
    created_at: '2024-02-15T08:30:00Z',
  },
]

export function RegionsPage() {
  // Placeholder for:
  // - GET /api/v1/regions
  // - POST /api/v1/regions
  // - PUT /api/v1/regions/{key}
  const regions = MOCK_REGIONS

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">Regions</h2>
        <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500">
          New region
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="bg-slate-900/80 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Key</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Config version</th>
              <th className="px-4 py-2 font-medium">Created at</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr
                key={region.key}
                className="border-t border-slate-800/60 hover:bg-slate-900/80"
              >
                <td className="px-4 py-2 font-mono text-[11px] text-slate-100">
                  {region.key}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      region.status === 'active'
                        ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                        : 'rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300'
                    }
                  >
                    {region.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-200">
                  v{region.config_version}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {new Date(region.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

