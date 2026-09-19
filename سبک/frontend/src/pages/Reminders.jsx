import { useEffect, useState } from 'react'
import { reminders as remindersApi } from '../api'
import StatusBadge from '../components/StatusBadge'
import FarmTypeBadge from '../components/FarmTypeBadge'
import { toJalali } from '../hooks/useJalali'

export default function Reminders() {
  const [list, setList] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    remindersApi.list({ status: statusFilter || undefined })
      .then((r) => setList(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const handleDone = async (id) => { await remindersApi.markDone(id); load() }
  const handleUrgent = async (id) => { await remindersApi.update(id, { status: 'urgent' }); load() }

  const typeIcon = { feedback: '💬', purchase: '📦', followup: '📞', churn_alert: '⚠️' }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">یادآورها و پیگیری‌ها</div>
          <div className="page-sub">{list.length} مورد</div>
        </div>
      </div>

      <div className="card">
        <div className="filters-row">
          {[
            { label: 'همه', value: '' },
            { label: 'انجام نشده', value: 'pending' },
            { label: 'عقب‌افتاده', value: 'overdue' },
            { label: 'پیگیری فوری', value: 'urgent' },
            { label: 'انجام شده', value: 'done' },
          ].map((f) => (
            <button key={f.value} className={`filter-chip${statusFilter === f.value ? ' active' : ''}`} onClick={() => setStatusFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-text">در حال بارگذاری...</div></div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">همه انجام شده</div>
            <div className="empty-text">یادآوری یافت نشد</div>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {list.map((r) => {
              const cls = r.status === 'overdue' ? 'rust' : r.status === 'urgent' ? 'purple' : r.status === 'done' ? 'forest' : 'amber'
              return (
                <div key={r.id} className={`rem-card ${cls}`}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{typeIcon[r.reminder_type] || '🔔'}</span>
                  <div className="flex-1 min-0">
                    <div className="flex items-center gap-sm" style={{ marginBottom: 2 }}>
                      <span className="fw-500 truncate" style={{ fontSize: 13.5 }}>{r.title}</span>
                      {r.farm_type && <FarmTypeBadge type={r.farm_type} />}
                    </div>
                    <div className="text-xs text-muted">
                      {r.customer_name}
                      {r.farm_name && ` — ${r.farm_name}`}
                      {' · سررسید: '}
                      {toJalali(r.due_date)}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                  {r.status !== 'done' && (
                    <div className="flex gap-xs shrink-0">
                      <button className="btn btn-success btn-sm" onClick={() => handleDone(r.id)}>✓ انجام شد</button>
                      {r.status !== 'urgent' && (
                        <button className="btn btn-outline btn-sm" onClick={() => handleUrgent(r.id)}>فوری</button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
