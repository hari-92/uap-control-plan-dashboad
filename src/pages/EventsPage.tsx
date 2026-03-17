import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type EventRow = {
  event_id: string
  event_type: string
  entity_id: string
  region_key: string
  version: number
  received_at: string
}

type EventRatePoint = {
  hour: string
  count: number
}

const MOCK_EVENTS: EventRow[] = [
  {
    event_id: 'evt_001',
    event_type: 'user-upsert',
    entity_id: 'user_123',
    region_key: 'us-west-1',
    version: 5,
    received_at: '2024-03-17T10:12:02Z',
  },
  {
    event_id: 'evt_002',
    event_type: 'reconcile-run',
    entity_id: 'global',
    region_key: 'us-west-1',
    version: 13,
    received_at: '2024-03-17T10:10:00Z',
  },
  {
    event_id: 'evt_003',
    event_type: 'user-policy',
    entity_id: 'user_456',
    region_key: 'eu-central-1',
    version: 2,
    received_at: '2024-03-17T09:55:00Z',
  },
  {
    event_id: 'evt_004',
    event_type: 'node_heartbeat',
    entity_id: 'node-eu-456',
    region_key: 'eu-central-1',
    version: 1,
    received_at: '2024-03-17T09:50:00Z',
  },
  {
    event_id: 'evt_005',
    event_type: 'user-upsert',
    entity_id: 'user_789',
    region_key: 'ap-south-1',
    version: 1,
    received_at: '2024-03-17T09:30:00Z',
  },
]

const MOCK_EVENT_RATE: EventRatePoint[] = [
  { hour: '06:00', count: 12 },
  { hour: '07:00', count: 28 },
  { hour: '08:00', count: 45 },
  { hour: '09:00', count: 62 },
  { hour: '10:00', count: 38 },
  { hour: '11:00', count: 22 },
]

const EVENT_TYPES = ['all', 'user-upsert', 'user-policy', 'reconcile-run', 'node_heartbeat']
const TIME_RANGES = ['Last 1 hour', 'Last 6 hours', 'Last 24 hours', 'Last 7 days']

const CHART_COLORS = { bar: 'rgb(99 102 241)', text: 'rgb(148 163 184)', grid: 'rgb(51 65 85)' }

export function EventsPage() {
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('Last 24 hours')

  const filteredEvents = useMemo(() => {
    let list = [...MOCK_EVENTS]
    if (eventTypeFilter !== 'all') {
      list = list.filter((e) => e.event_type === eventTypeFilter)
    }
    return list
  }, [eventTypeFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-200">Event inbox</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All types' : t}
              </option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {TIME_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-4 text-xs font-semibold text-slate-300">
          Event rate (last 6 hours, mock)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={MOCK_EVENT_RATE}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="hour"
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
              dataKey="count"
              name="Events"
              fill={CHART_COLORS.bar}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="bg-slate-900/80 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Received at</th>
              <th className="px-4 py-2 font-medium">Event ID</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Entity</th>
              <th className="px-4 py-2 font-medium">Region</th>
              <th className="px-4 py-2 font-medium">Version</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event.event_id}
                className="border-t border-slate-800/60 hover:bg-slate-900/80"
              >
                <td className="px-4 py-2 text-slate-200">
                  {new Date(event.received_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 font-mono text-[11px] text-slate-200">
                  {event.event_id}
                </td>
                <td className="px-4 py-2 text-slate-200">{event.event_type}</td>
                <td className="px-4 py-2 text-slate-200">{event.entity_id}</td>
                <td className="px-4 py-2 text-slate-200">{event.region_key}</td>
                <td className="px-4 py-2 text-slate-200">v{event.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEvents.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-slate-500">
            No events match the selected filters.
          </p>
        )}
      </div>
    </div>
  )
}
