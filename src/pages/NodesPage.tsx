import { HealthClass, NodeState } from '../enums'

// Mirrors internal/types.Node in the backend.
type NodeRow = {
  node_id: string
  region_key: string
  hostname: string
  state: NodeState
  capacity_profile: string
  health_class: HealthClass
  last_heartbeat_at: string
}

const MOCK_NODES: NodeRow[] = [
  {
    node_id: 'node-us-123',
    region_key: 'us-west-1',
    hostname: 'node-01.us-west-1.uap.io',
    state: NodeState.Online,
    capacity_profile: 'standard',
    health_class: HealthClass.Healthy,
    last_heartbeat_at: '2024-03-15T22:00:00Z',
  },
  {
    node_id: 'node-eu-456',
    region_key: 'eu-central-1',
    hostname: 'node-02.eu-central-1.uap.io',
    state: NodeState.Online,
    capacity_profile: 'high-capacity',
    health_class: HealthClass.Warning,
    last_heartbeat_at: '2024-03-15T21:55:00Z',
  },
]

export function NodesPage() {
  // Placeholder for:
  // - GET /api/v1/metadata/nodes
  // - GET /api/v1/metadata/regions/{region}/nodes
  const nodes = MOCK_NODES

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-200">Nodes</h2>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="bg-slate-900/80 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Node ID</th>
              <th className="px-4 py-2 font-medium">Region</th>
              <th className="px-4 py-2 font-medium">Hostname</th>
              <th className="px-4 py-2 font-medium">State</th>
              <th className="px-4 py-2 font-medium">Capacity</th>
              <th className="px-4 py-2 font-medium">Health</th>
              <th className="px-4 py-2 font-medium">Last heartbeat</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr
                key={node.node_id}
                className="border-t border-slate-800/60 hover:bg-slate-900/80"
              >
                <td className="px-4 py-2 font-mono text-[11px] text-slate-100">
                  {node.node_id}
                </td>
                <td className="px-4 py-2 text-slate-200">{node.region_key}</td>
                <td className="px-4 py-2 text-slate-200">{node.hostname}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      node.state === 'online'
                        ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                        : 'rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300'
                    }
                  >
                    {node.state}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {node.capacity_profile}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      node.health_class === 'healthy'
                        ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                        : node.health_class === 'warning'
                          ? 'rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300'
                          : 'rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium text-rose-300'
                    }
                  >
                    {node.health_class}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {new Date(node.last_heartbeat_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

