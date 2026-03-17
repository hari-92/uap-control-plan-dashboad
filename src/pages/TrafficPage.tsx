import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TrafficByRegion = {
  region: string
  uplink_gb: number
  downlink_gb: number
  connections: number
}

type TrafficByDay = {
  date: string
  uplink_gb: number
  downlink_gb: number
}

type TopUserTraffic = {
  user_id: string
  region_key: string
  total_gb: number
  connections: number
}

function fetchTrafficByRegion(): Promise<TrafficByRegion[]> {
  // Placeholder: from traffic rollups / analytics API
  return Promise.resolve([
    { region: 'us-west-1', uplink_gb: 420, downlink_gb: 1200, connections: 850 },
    { region: 'eu-central-1', uplink_gb: 280, downlink_gb: 910, connections: 520 },
    { region: 'ap-south-1', uplink_gb: 190, downlink_gb: 640, connections: 380 },
    { region: 'us-east-1', uplink_gb: 95, downlink_gb: 310, connections: 200 },
    { region: 'eu-west-1', uplink_gb: 42, downlink_gb: 128, connections: 90 },
  ])
}

function fetchTrafficByDay(): Promise<TrafficByDay[]> {
  return Promise.resolve([
    { date: '03/11', uplink_gb: 180, downlink_gb: 520 },
    { date: '03/12', uplink_gb: 195, downlink_gb: 580 },
    { date: '03/13', uplink_gb: 210, downlink_gb: 620 },
    { date: '03/14', uplink_gb: 198, downlink_gb: 590 },
    { date: '03/15', uplink_gb: 225, downlink_gb: 680 },
    { date: '03/16', uplink_gb: 240, downlink_gb: 720 },
    { date: '03/17', uplink_gb: 250, downlink_gb: 750 },
  ])
}

function fetchTopUsers(): Promise<TopUserTraffic[]> {
  return Promise.resolve([
    { user_id: 'user_101', region_key: 'us-west-1', total_gb: 45.2, connections: 120 },
    { user_id: 'user_205', region_key: 'eu-central-1', total_gb: 38.1, connections: 95 },
    { user_id: 'user_088', region_key: 'us-west-1', total_gb: 32.0, connections: 88 },
    { user_id: 'user_312', region_key: 'ap-south-1', total_gb: 28.5, connections: 70 },
    { user_id: 'user_419', region_key: 'eu-central-1', total_gb: 24.2, connections: 62 },
  ])
}

const CHART_COLORS = {
  uplink: 'rgb(99 102 241)',
  downlink: 'rgb(56 189 248)',
  text: 'rgb(148 163 184)',
  grid: 'rgb(51 65 85)',
}

export function TrafficPage() {
  const { data: byRegion } = useQuery({
    queryKey: ['traffic', 'byRegion'],
    queryFn: fetchTrafficByRegion,
  })
  const { data: byDay } = useQuery({
    queryKey: ['traffic', 'byDay'],
    queryFn: fetchTrafficByDay,
  })
  const { data: topUsers } = useQuery({
    queryKey: ['traffic', 'topUsers'],
    queryFn: fetchTopUsers,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">Traffic analytics</h2>
        <p className="mt-1 text-xs text-slate-400">
          Bandwidth and connection metrics. Wire to traffic rollups or SUI traffic APIs when ready.
        </p>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-4 text-xs font-semibold text-slate-300">
          Traffic by region (last 7 days)
        </h3>
        {byRegion && byRegion.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={byRegion}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="region"
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
              <Bar
                dataKey="uplink_gb"
                name="Uplink (GB)"
                fill={CHART_COLORS.uplink}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="downlink_gb"
                name="Downlink (GB)"
                fill={CHART_COLORS.downlink}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500">No data</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-4 text-xs font-semibold text-slate-300">
          Daily traffic trend (GB)
        </h3>
        {byDay && byDay.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={byDay}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
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
              <Bar
                dataKey="uplink_gb"
                name="Uplink"
                fill={CHART_COLORS.uplink}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="downlink_gb"
                name="Downlink"
                fill={CHART_COLORS.downlink}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-500">No data</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-4 text-xs font-semibold text-slate-300">
          Top users by traffic
        </h3>
        {topUsers && topUsers.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full border-separate border-spacing-0 text-xs">
              <thead className="bg-slate-900/80 text-left text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-medium">User ID</th>
                  <th className="px-4 py-2 font-medium">Region</th>
                  <th className="px-4 py-2 font-medium">Total (GB)</th>
                  <th className="px-4 py-2 font-medium">Connections</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((u) => (
                  <tr
                    key={u.user_id}
                    className="border-t border-slate-800/60 hover:bg-slate-900/80"
                  >
                    <td className="px-4 py-2 font-mono text-slate-200">
                      {u.user_id}
                    </td>
                    <td className="px-4 py-2 text-slate-200">{u.region_key}</td>
                    <td className="px-4 py-2 text-slate-200">
                      {u.total_gb.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 text-slate-200">{u.connections}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No data</p>
        )}
      </section>
    </div>
  )
}
