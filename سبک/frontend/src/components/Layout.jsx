import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'

const PAGE_META = {
  '/':           { title: 'داشبورد', sub: 'خلاصه وضعیت امروز' },
  '/customers':  { title: 'مشتریان', sub: 'مدیریت مشتریان فعال' },
  '/farms':      { title: 'مزارع', sub: 'مزارع ثبت‌شده' },
  '/sales':      { title: 'فروش', sub: 'تاریخچه تراکنش‌ها' },
  '/reminders':  { title: 'یادآورها', sub: 'پیگیری‌ها و وظایف' },
  '/feedbacks':  { title: 'بازخوردها', sub: 'بازخوردهای مشتریان' },
  '/churn':      { title: 'ریسک ترک مشتری', sub: 'ارزیابی و مدیریت ریسک' },
  '/offers':     { title: 'پیشنهادات حفظ', sub: 'پیشنهادات ویژه برای مشتریان در خطر' },
}

export default function Layout({ children }) {
  const location = useLocation()
  const meta = PAGE_META[location.pathname] || { title: '', sub: '' }

  const today = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
          </div>
          <div className="topbar-date">{today}</div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  )
}
