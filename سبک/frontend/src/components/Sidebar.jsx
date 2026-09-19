import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, ShoppingBag,
  Bell, MessageSquare, BarChart2, Gift, LogOut
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { section: 'اصلی' },
  { path: '/',          icon: LayoutDashboard, label: 'داشبورد' },
  { section: 'مدیریت' },
  { path: '/customers', icon: Users,           label: 'مشتریان' },
  { path: '/farms',     icon: Building2,       label: 'مزارع' },
  { path: '/sales',     icon: ShoppingBag,     label: 'فروش' },
  { section: 'پیگیری' },
  { path: '/reminders', icon: Bell,            label: 'یادآورها' },
  { path: '/feedbacks', icon: MessageSquare,   label: 'بازخوردها' },
  { section: 'تحلیل' },
  { path: '/churn',     icon: BarChart2,       label: 'ریسک مشتریان' },
  { path: '/offers',    icon: Gift,            label: 'پیشنهادات حفظ' },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const initials    = user ? (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase() : 'U'
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username
  const roleLabel   = { admin: 'مدیر سیستم', sales: 'کارشناس فروش', manager: 'مدیر فروش' }[user?.role] || 'کاربر'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">🐓</div>
        <div>
          <div className="sidebar-logo-title">CRM مرغداری</div>
          <div className="sidebar-logo-sub">مدیریت مشتریان طیور</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) =>
          item.section ? (
            <div className="nav-section" key={i}>
              <span className="nav-section-label">{item.section}</span>
            </div>
          ) : (
            <button
              key={item.path}
              className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">
                <item.icon size={16} strokeWidth={1.8} />
              </span>
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="flex-1 min-0">
            <div className="user-name truncate">{displayName}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="خروج">
            <LogOut size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}
