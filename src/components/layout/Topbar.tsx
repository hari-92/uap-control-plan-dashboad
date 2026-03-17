import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../../state/authStore'

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/regions': 'Regions',
  '/nodes': 'Nodes',
  '/node-enrollment': 'Node enrollment',
  '/reconcile': 'Reconcile',
  '/events': 'Events',
  '/catalog': 'Catalog',
  '/traffic': 'Traffic',
}

export function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = useAuthStore((state) => state.username)
  const logout = useAuthStore((state) => state.logout)
  const [menuOpen, setMenuOpen] = useState(false)
  const title = titleMap[location.pathname] ?? 'Dashboard'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
    setMenuOpen(false)
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">{title}</h1>
        <p className="text-xs text-slate-400">VPN control plane admin view</p>
      </div>
      <div className="relative flex items-center gap-3 text-xs text-slate-400">
        <span className="hidden items-center gap-1 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Control plane: healthy</span>
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 hover:border-slate-500"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
              {(username || 'admin').charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-[11px] text-slate-200 sm:inline">
              {username || 'admin'}
            </span>
          </button>
          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-800 bg-slate-900/95 py-1 text-xs shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

