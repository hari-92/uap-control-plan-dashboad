import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  KeyRound,
  ListChecks,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TelemetrySummary = {
  totalUsers: number
  onlineUsers: number
  totalNodes: number
  healthyNodes: number
  totalRegions: number
}

type RegionStats = {
  region: string
  nodes: number
  users: number
}

type DailyOnline = {
  date: string
  online: number
  total: number
}

type NodeHealthSlice = {
  name: string
  value: number
  color: string
}

function fetchTelemetrySummary(): Promise<TelemetrySummary> {
  // Placeholder for real API: GET /api/v1/telemetry/summary
  return Promise.resolve({
    totalUsers: 1280,
    onlineUsers: 342,
    totalNodes: 28,
    healthyNodes: 27,
    totalRegions: 6,
  })
}

function fetchRegionStats(): Promise<RegionStats[]> {
  // Placeholder: aggregate from GET /api/v1/regions + metadata
  return Promise.resolve([
    { region: 'us-west-1', nodes: 8, users: 420 },
    { region: 'eu-central-1', nodes: 6, users: 310 },
    { region: 'ap-south-1', nodes: 5, users: 280 },
    { region: 'us-east-1', nodes: 5, users: 190 },
    { region: 'eu-west-1', nodes: 4, users: 80 },
  ])
}

function fetchDailyOnline(): Promise<DailyOnline[]> {
  // Placeholder: from telemetry/traffic rollups or custom analytics
  return Promise.resolve([
    { date: '03/11', online: 280, total: 1280 },
    { date: '03/12', online: 295, total: 1280 },
    { date: '03/13', online: 310, total: 1290 },
    { date: '03/14', online: 298, total: 1290 },
    { date: '03/15', online: 325, total: 1295 },
    { date: '03/16', online: 338, total: 1295 },
    { date: '03/17', online: 342, total: 1280 },
  ])
}

function fetchNodeHealthDistribution(): Promise<NodeHealthSlice[]> {
  // Placeholder: from GET /api/v1/metadata/nodes
  return Promise.resolve([
    { name: 'Healthy', value: 27, color: 'rgb(52 211 153)' },
    { name: 'Warning', value: 1, color: 'rgb(251 191 36)' },
    { name: 'Critical', value: 0, color: 'rgb(244 63 94)' },
  ])
}

type SystemStatus = {
  api: 'ok' | 'degraded'
  catalog: 'ok' | 'syncing'
  lastReconcile: string | null
}

type CriticalEvent = {
  id: string
  at: string
  type: string
  message: string
  severity: 'warning' | 'critical'
}

function fetchSystemStatus(): Promise<SystemStatus> {
  // GET /healthz + catalog/reconcile context
  return Promise.resolve({
    api: 'ok',
    catalog: 'ok',
    lastReconcile: '2024-03-17T08:15:00Z',
  })
}

function fetchRecentCriticalEvents(): Promise<CriticalEvent[]> {
  // From GET /api/v1/events filtered by severity
  return Promise.resolve([
    {
      id: '1',
      at: '2024-03-17T09:00:00Z',
      type: 'node_heartbeat_missed',
      message: 'node-eu-456 missed 2 heartbeats',
      severity: 'warning',
    },
    {
      id: '2',
      at: '2024-03-17T08:45:00Z',
      type: 'config_drift',
      message: 'Region us-west-1: 1 node config version mismatch',
      severity: 'warning',
    },
  ])
}

const CHART_COLORS = {
  bar: 'rgb(99 102 241)',
  area: 'rgba(99 102 241 / 0.4)',
  stroke: 'rgb(129 140 248)',
  grid: 'rgb(51 65 85)',
  text: 'rgb(148 163 184)',
}

export function DashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['telemetry', 'summary'],
    queryFn: fetchTelemetrySummary,
  })
  const { data: systemStatus } = useQuery({
    queryKey: ['dashboard', 'systemStatus'],
    queryFn: fetchSystemStatus,
  })
  const { data: criticalEvents } = useQuery({
    queryKey: ['dashboard', 'criticalEvents'],
    queryFn: fetchRecentCriticalEvents,
  })
  const { data: regionStats } = useQuery({
    queryKey: ['dashboard', 'regionStats'],
    queryFn: fetchRegionStats,
  })
  const { data: dailyOnline } = useQuery({
    queryKey: ['dashboard', 'dailyOnline'],
    queryFn: fetchDailyOnline,
  })
  const { data: nodeHealth } = useQuery({
    queryKey: ['dashboard', 'nodeHealth'],
    queryFn: fetchNodeHealthDistribution,
  })

  if (!summary) return null

  return (
    <div className="space-y-6">
      {systemStatus && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            {systemStatus.api === 'ok' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            )}
            <span className="text-xs text-slate-300">
              API: {systemStatus.api === 'ok' ? 'Healthy' : 'Degraded'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {systemStatus.catalog === 'ok' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            )}
            <span className="text-xs text-slate-300">
              Catalog: {systemStatus.catalog === 'ok' ? 'OK' : 'Syncing'}
            </span>
          </div>
          {systemStatus.lastReconcile && (
            <span className="text-xs text-slate-500">
              Last reconcile: {new Date(systemStatus.lastReconcile).toLocaleString()}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-slate-400">Quick actions</span>
        <Link
          to="/reconcile"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
        >
          <GitMerge className="h-3.5 w-3.5" />
          Reconcile
        </Link>
        <Link
          to="/reconcile"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
        >
          <ListChecks className="h-3.5 w-3.5" />
          View plan
        </Link>
        <Link
          to="/node-enrollment"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Enroll node
        </Link>
      </div>

      {criticalEvents && criticalEvents.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Recent alerts
          </h2>
          <ul className="space-y-2">
            {criticalEvents.slice(0, 5).map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center gap-2 rounded border border-slate-700/60 bg-slate-950/60 px-3 py-2 text-xs"
              >
                <span className="text-slate-500">
                  {new Date(e.at).toLocaleString()}
                </span>
                <span
                  className={
                    e.severity === 'critical'
                      ? 'rounded bg-rose-500/15 px-1.5 py-0.5 font-medium text-rose-300'
                      : 'rounded bg-amber-500/15 px-1.5 py-0.5 font-medium text-amber-300'
                  }
                >
                  {e.type}
                </span>
                <span className="text-slate-300">{e.message}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/events"
            className="mt-3 inline-block text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all events →
          </Link>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Total users" value={summary.totalUsers} />
        <DashboardCard
          label="Online users"
          value={summary.onlineUsers}
          helper={`${Math.round((summary.onlineUsers / summary.totalUsers) * 100)}% active`}
        />
        <DashboardCard
          label="Nodes healthy"
          value={`${summary.healthyNodes}/${summary.totalNodes}`}
          helper="Based on last heartbeat"
        />
        <DashboardCard label="Regions" value={summary.totalRegions} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-200">
            Nodes & users by region
          </h2>
          {regionStats && regionStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={regionStats}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="region"
                  tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                  axisLine={{ stroke: CHART_COLORS.grid }}
                  tickLine={{ stroke: CHART_COLORS.grid }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                  axisLine={{ stroke: CHART_COLORS.grid }}
                  tickLine={{ stroke: CHART_COLORS.grid }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                  axisLine={{ stroke: CHART_COLORS.grid }}
                  tickLine={{ stroke: CHART_COLORS.grid }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(15 23 42)',
                    border: '1px solid rgb(51 65 85)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: CHART_COLORS.text }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  yAxisId="left"
                  dataKey="nodes"
                  name="Nodes"
                  fill={CHART_COLORS.bar}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="users"
                  name="Users"
                  fill="rgb(56 189 248)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500">No region data</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-200">
            Node health distribution
          </h2>
          {nodeHealth && nodeHealth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={nodeHealth}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {nodeHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(15 23 42)',
                    border: '1px solid rgb(51 65 85)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500">No node health data</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-4 text-sm font-semibold text-slate-200">
          Online users (last 7 days)
        </h2>
        {dailyOnline && dailyOnline.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={dailyOnline}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="onlineGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="rgb(99 102 241)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(99 102 241)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={{ stroke: CHART_COLORS.grid }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(15 23 42)',
                  border: '1px solid rgb(51 65 85)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="online"
                name="Online users"
                stroke={CHART_COLORS.stroke}
                fill="url(#onlineGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500">No trend data</p>
        )}
      </section>
    </div>
  )
}

type DashboardCardProps = {
  label: string
  value: number | string
  helper?: string
}

function DashboardCard({ label, value, helper }: DashboardCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </article>
  )
}
