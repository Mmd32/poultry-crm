import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Bell, Clock, ShieldAlert, BarChart3,
  ChevronLeft, CheckCircle2, AlertCircle, TrendingDown,
  Plus, Building2, ShoppingBag, MessageSquare, BarChart2, Gift
} from 'lucide-react'
import { reminders, customers } from '../api'
import { useAuth } from '../hooks/useAuth'
import StatusBadge from '../components/StatusBadge'
import RiskBadge from '../components/RiskBadge'

/* ── Lucide icon wrapper ── */
function Icon({ component: C, size = 18, ...props }) {
  return <C size={size} strokeWidth={1.7} {...props} />
}

/* ── Stat card ── */
function StatCard({ icon: IconComp, label, value, color, sub }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-top">
        <div className={`stat-icon-wrap ${color}`}>
          <Icon component={IconComp} size={20} />
        </div>
      </div>
      <div className="stat-value">{value ?? <span className="stat-empty">—</span>}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

/* ── Risk dot ── */
const RiskDot = ({ level }) => {
  const c = { high: '#E2445C', medium: '#FF7B00', low: '#00C875' }[level] || '#ccc'
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
}

/* ── Reminder type config ── */
const REM_TYPE = {
  feedback:    { icon: MessageSquare, label: 'بازخورد', color: '#579BFC' },
  purchase:    { icon: ShoppingBag,   label: 'خرید',   color: '#A25DDC' },
  followup:    { icon: Bell,          label: 'پیگیری', color: '#FF7B00' },
  churn_alert: { icon: AlertCircle,   label: 'هشدار',  color: '#E2445C' },
}

export default function Dashboard() {
  const [stats, setStats]         = useState(null)
  const [todayList, setTodayList] = useState([])
  const [urgentList, setUrgentList] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    reminders.stats().then(r => setStats(r.data)).catch(() => {})
    reminders.list({ today: true, status: 'pending' })
      .then(r => setTodayList(r.data.results || r.data)).catch(() => {})
    customers.list({ risk_level: 'high' })
      .then(r => setUrgentList((r.data.results || r.data).slice(0, 6))).catch(() => {})
  }, [])

  const displayName = user?.first_name || user?.username || 'کاربر'

  return (
    <div className="dash-root">

      {/* ── Greeting header ── */}
      <div className="dash-greeting">
        <div>
          <h1 className="dash-greeting-title">سلام، {displayName} 👋</h1>
          <p className="dash-greeting-sub">
            {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/customers')}>
          <Icon component={Plus} size={15} /> مشتری جدید
        </button>
      </div>

      {/* ── Metrics ── */}
      <div className="stats-grid">
        <StatCard icon={Users}       label="مشتریان فعال"   value={stats?.total_customers}        color="violet" sub="مجموع" />
        <StatCard icon={Bell}        label="یادآور امروز"   value={stats?.today_reminders}        color="blue"   sub="در انتظار" />
        <StatCard icon={Clock}       label="عقب‌افتاده"     value={stats?.overdue_reminders}      color="red"    sub="باید رسیدگی شود" />
        <StatCard icon={ShieldAlert} label="پرریسک"          value={stats?.high_risk_customers}    color="red"    sub="در خطر ترک" />
        <StatCard icon={BarChart3}   label="ریسک متوسط"     value={stats?.medium_risk_customers}  color="orange" sub="نیاز به توجه" />
      </div>

      {/* ── Feed: today + risk ── */}
      <div className="dash-feed-grid">

        {/* Today's reminders */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">یادآورهای امروز</div>
              <div className="card-meta">{todayList.length} مورد منتظر پیگیری</div>
            </div>
            <button className="card-link-btn" onClick={() => navigate('/reminders')}>
              همه یادآورها <Icon component={ChevronLeft} size={14} />
            </button>
          </div>

          {todayList.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><Icon component={CheckCircle2} size={32} color="var(--green)" /></div>
              <p className="dash-empty-title">همه پیگیری‌های امروز انجام شده</p>
              <p className="dash-empty-sub">یادآور جدیدی ندارید</p>
            </div>
          ) : (
            <div className="rem-list">
              {todayList.slice(0, 6).map(r => {
                const cfg = REM_TYPE[r.reminder_type] || REM_TYPE.followup
                return (
                  <div key={r.id} className="rem-row" onClick={() => navigate('/reminders')}>
                    <div className="rem-row-icon" style={{ background: cfg.color + '18', color: cfg.color }}>
                      <Icon component={cfg.icon} size={14} />
                    </div>
                    <div className="rem-row-body">
                      <div className="rem-row-name">{r.customer_name}</div>
                      <div className="rem-row-title">{r.title}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* High-risk customers */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">مشتریان پرریسک</div>
              <div className="card-meta">{urgentList.length} مشتری نیاز به پیگیری فوری دارند</div>
            </div>
            <button className="card-link-btn" onClick={() => navigate('/churn')}>
              مدیریت ریسک <Icon component={ChevronLeft} size={14} />
            </button>
          </div>

          {urgentList.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><Icon component={CheckCircle2} size={32} color="var(--green)" /></div>
              <p className="dash-empty-title">مشتری پرریسک ندارید</p>
              <p className="dash-empty-sub">وضعیت فعلی مطلوب است</p>
            </div>
          ) : (
            <div className="rem-list">
              {urgentList.map(c => (
                <div key={c.id} className="rem-row risk-row-item" onClick={() => navigate('/customers')}>
                  <div className="rem-row-icon" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                    <Icon component={TrendingDown} size={14} />
                  </div>
                  <div className="rem-row-body">
                    <div className="rem-row-name">{c.name}</div>
                    <div className="rem-row-title">{c.city || 'بدون شهر'}</div>
                  </div>
                  <RiskBadge level={c.risk_level} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">دسترسی سریع</div>
        </div>
        <div className="quick-actions-grid">
          {[
            { label: 'مشتری جدید',  sub: 'افزودن مشتری',   icon: Users,         path: '/customers', color: '#7C3AED' },
            { label: 'مزرعه جدید',  sub: 'ثبت مزرعه',      icon: Building2,     path: '/farms',     color: '#579BFC' },
            { label: 'ثبت فروش',    sub: 'سفارش و فاکتور',  icon: ShoppingBag,   path: '/sales',     color: '#00C875' },
            { label: 'ثبت بازخورد', sub: 'نظرات مشتریان',  icon: MessageSquare, path: '/feedbacks', color: '#A25DDC' },
            { label: 'ارزیابی ریسک',sub: 'پایش و تحلیل',   icon: BarChart2,     path: '/churn',     color: '#FF7B00' },
            { label: 'پیشنهاد حفظ', sub: 'پیشنهاد ویژه',   icon: Gift,          path: '/offers',    color: '#E2445C' },
          ].map(item => (
            <button key={item.path} className="quick-action-card" onClick={() => navigate(item.path)}>
              <div className="quick-action-icon" style={{ background: item.color + '15', color: item.color }}>
                <Icon component={item.icon} size={22} />
              </div>
              <div className="quick-action-label">{item.label}</div>
              <div className="quick-action-sub">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
