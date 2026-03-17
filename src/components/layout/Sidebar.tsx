import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Globe,
  Server,
  KeyRound,
  GitMerge,
  Inbox,
  Database,
  BarChart3,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Identity',
    items: [{ to: '/users', label: 'Users', icon: Users }],
  },
  {
    label: 'Infrastructure',
    items: [
      { to: '/regions', label: 'Regions', icon: Globe },
      { to: '/nodes', label: 'Nodes', icon: Server },
      { to: '/node-enrollment', label: 'Node enrollment', icon: KeyRound },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/reconcile', label: 'Reconcile', icon: GitMerge },
      { to: '/events', label: 'Events', icon: Inbox },
    ],
  },
  {
    label: 'Data & analytics',
    items: [
      { to: '/catalog', label: 'Catalog', icon: Database },
      { to: '/traffic', label: 'Traffic', icon: BarChart3 },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950/80 p-4 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
          VPN
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-50">UAP Control Plane</p>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>
      <nav className="space-y-6 text-sm">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-2 rounded-md px-3 py-2 transition-colors',
                        isActive
                          ? 'bg-slate-800 text-slate-50'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-slate-50',
                      ].join(' ')
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
