import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import SiteFooter from '../../components/SiteFooter'
import SiteHeader from '../../components/SiteHeader'
import useRobotsMeta from '../../hooks/useRobotsMeta'
import { clearAuth, getAuth } from '../../utils/authApi'

export default function AdminLayout() {
  const auth = getAuth()
  const navigate = useNavigate()

  useRobotsMeta('noindex, nofollow, noarchive')

  if (!auth?.access) {
    return <Navigate to="/admin/login" replace />
  }
  if (!auth.is_staff) {
    return <Navigate to="/admin/login" replace />
  }

  const logout = () => {
    clearAuth()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <SiteHeader />
      <div className="admin-top">
        <div className="admin-top-inner">
          <Link to="/admin" className="admin-brand">
            VOIDINK <span>Admin</span>
          </Link>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'on' : undefined)}>
              Orders
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'on' : undefined)}>
              Users
            </NavLink>
            <NavLink to="/admin/crm" className={({ isActive }) => (isActive ? 'on' : undefined)}>
              CRM
            </NavLink>
          </nav>
          <div className="admin-top-actions">
            <span className="admin-who">
              {auth.first_name} {auth.last_name}
            </span>
            <Link to="/" className="admin-link">
              View site
            </Link>
            <button type="button" className="admin-link" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </div>
      <main className="admin-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
