import { MembershipLevel, UserStatus, WeightClass } from '../enums'

// Mirrors internal/types.UserProjection in the backend.
type UserProjection = {
  user_id: string
  region_key: string
  status: UserStatus
  membership_level: MembershipLevel
  weight_class: WeightClass
  policy_version: number
  can_use_paid_traffic: boolean
  can_use_free_traffic: boolean
  assignment_version: number
  visible_node_count: number
  updated_at: string
}

const MOCK_USERS: UserProjection[] = [
  {
    user_id: 'user_123',
    region_key: 'us-west-1',
    status: UserStatus.Active,
    membership_level: MembershipLevel.Premium,
    weight_class: WeightClass.Gold,
    policy_version: 5,
    can_use_paid_traffic: true,
    can_use_free_traffic: true,
    assignment_version: 12,
    visible_node_count: 100,
    updated_at: '2024-03-15T22:12:02Z',
  },
  {
    user_id: 'user_456',
    region_key: 'eu-central-1',
    status: UserStatus.Inactive,
    membership_level: MembershipLevel.Free,
    weight_class: WeightClass.Standard,
    policy_version: 2,
    can_use_paid_traffic: false,
    can_use_free_traffic: true,
    assignment_version: 4,
    visible_node_count: 24,
    updated_at: '2024-03-10T09:30:00Z',
  },
]

export function UsersPage() {
  // Placeholder for real API calls:
  // - GET /api/v1/users (list user projections)
  // - POST /api/v1/intents/user-upsert
  // - POST /api/v1/intents/user-policy
  const users = MOCK_USERS

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">User projections</h2>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Filter by user_id or region…"
            className="hidden rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:block"
          />
          <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500">
            New user intent
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead className="bg-slate-900/80 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">User ID</th>
              <th className="px-4 py-2 font-medium">Region</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Membership</th>
              <th className="px-4 py-2 font-medium">Weight class</th>
              <th className="px-4 py-2 font-medium">Policy</th>
              <th className="px-4 py-2 font-medium">Traffic</th>
              <th className="px-4 py-2 font-medium">Visible nodes</th>
              <th className="px-4 py-2 font-medium">Updated at</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="border-t border-slate-800/60 hover:bg-slate-900/80"
              >
                <td className="px-4 py-2 font-mono text-[11px] text-slate-100">
                  {user.user_id}
                </td>
                <td className="px-4 py-2 text-slate-200">{user.region_key}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      user.status === 'active'
                        ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                        : 'rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300'
                    }
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {user.membership_level}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {user.weight_class}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  v{user.policy_version}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span
                      className={
                        user.can_use_paid_traffic
                          ? 'inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300'
                          : 'inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400'
                      }
                    >
                      Paid
                    </span>
                    <span
                      className={
                        user.can_use_free_traffic
                          ? 'inline-flex rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-medium text-sky-300'
                          : 'inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400'
                      }
                    >
                      Free
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {user.visible_node_count}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {new Date(user.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

