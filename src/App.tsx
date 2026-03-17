import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './pages/UsersPage'
import { RegionsPage } from './pages/RegionsPage'
import { NodesPage } from './pages/NodesPage'
import { EventsPage } from './pages/EventsPage'
import { ReconcilePage } from './pages/ReconcilePage'
import { CatalogPage } from './pages/CatalogPage'
import { NodeEnrollmentPage } from './pages/NodeEnrollmentPage'
import { TrafficPage } from './pages/TrafficPage'
import { LoginPage } from './pages/LoginPage'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { useAuthStore } from './state/authStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-slate-900/60 p-6">
          <Routes>
            <Route element={<Outlet />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/regions" element={<RegionsPage />} />
              <Route path="/nodes" element={<NodesPage />} />
              <Route path="/node-enrollment" element={<NodeEnrollmentPage />} />
              <Route path="/reconcile" element={<ReconcilePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/traffic" element={<TrafficPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
