import { useEffect, useState } from 'react'
import { farms, customers as customersApi } from '../api'
import FarmTypeBadge from '../components/FarmTypeBadge'
import { toJalaliShort } from '../hooks/useJalali'

const FARM_TYPES = [
  { v: 'broiler', icon: '🐔', label: 'گوشتی',      sub: 'مرغداری گوشتی' },
  { v: 'breeder', icon: '🥚', label: 'مادری',       sub: 'مرغداری مادری' },
  { v: 'layer',   icon: '🐣', label: 'تخم‌گذار',   sub: 'مرغداری تخم‌گذار' },
]

function FarmModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial?.id ? initial : {
    customer: '', name: '', farm_type: 'broiler', capacity: '',
    address: '', reminder_interval_days: 7, notes: ''
  })
  const [customerList, setCustomerList] = useState([])
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    customersApi.list().then((r) => setCustomerList(r.data.results || r.data))
  }, [])

  const handleSave = async () => {
    if (!form.customer || !form.name) return
    setSaving(true)
    try {
      if (initial?.id) await farms.update(initial.id, form)
      else await farms.create(form)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{initial?.id ? 'ویرایش مزرعه' : 'ثبت مزرعه جدید'}</div>
            <div className="modal-sub">مزرعه را به یک مشتری متصل کنید</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-sec">مشتری و مزرعه</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>مشتری <span className="req">*</span></label>
              <select value={form.customer} onChange={(e) => set('customer', e.target.value)} autoFocus>
                <option value="">انتخاب مشتری...</option>
                {customerList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.city ? ` — ${c.city}` : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>نام مزرعه <span className="req">*</span></label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="مثلاً: مزرعه شماره یک" />
            </div>
          </div>
        </div>

        <div className="form-sec">نوع مزرعه</div>
        <div className="opt-group">
          {FARM_TYPES.map(t => (
            <div
              key={t.v}
              className={`opt-card${form.farm_type === t.v ? ' selected' : ''}`}
              onClick={() => set('farm_type', t.v)}
            >
              <div className="opt-card-icon">{t.icon}</div>
              <div className="opt-card-label">{t.label}</div>
              <div className="opt-card-sub">{t.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">جزئیات تولید</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>ظرفیت مزرعه</label>
              <input type="number" value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)} placeholder="۰" min="0" />
              <span className="input-hint">تعداد قطعه</span>
            </div>
            <div className="form-group">
              <label>فاصله یادآوری</label>
              <input type="number" value={form.reminder_interval_days}
                onChange={(e) => set('reminder_interval_days', e.target.value)} min="1" max="365" />
              <span className="input-hint">روز بین هر یادآوری</span>
            </div>
          </div>
          <div className="form-group">
            <label>آدرس مزرعه</label>
            <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
              placeholder="روستا، شهر، جاده..." rows={2} />
          </div>
          <div className="form-group">
            <label>یادداشت</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="نکات فنی یا تجاری مزرعه..." rows={2} maxLength={300} />
            <span className="char-count">{(form.notes || '').length} / ۳۰۰</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}
            disabled={saving || !form.customer || !form.name}>
            {saving ? 'در حال ذخیره...' : initial?.id ? 'ذخیره تغییرات' : 'ثبت مزرعه'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

export default function Farms() {
  const [list, setList] = useState([])
  const [typeFilter, setTypeFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    farms.list({ type: typeFilter || undefined })
      .then((r) => setList(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [typeFilter])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">مزارع</div>
          <div className="page-sub">{list.length} مزرعه ثبت‌شده</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({})}>+ ثبت مزرعه جدید</button>
      </div>

      <div className="card">
        <div className="filters-row">
          {[
            { label: 'همه', value: '' },
            { label: 'گوشتی', value: 'broiler' },
            { label: 'مادری', value: 'breeder' },
            { label: 'تخم‌گذار', value: 'layer' },
          ].map((f) => (
            <button
              key={f.value}
              className={`filter-chip${typeFilter === f.value ? ' active' : ''}`}
              onClick={() => setTypeFilter(f.value)}
            >{f.label}</button>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>نام مزرعه</th>
                <th>مشتری</th>
                <th>نوع</th>
                <th>ظرفیت</th>
                <th>یادآوری</th>
                <th>تاریخ ثبت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>در حال بارگذاری...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>مزرعه‌ای یافت نشد</td></tr>
              ) : list.map((f) => (
                <tr key={f.id}>
                  <td className="td-name">{f.name}</td>
                  <td>{f.customer_name}</td>
                  <td><FarmTypeBadge type={f.farm_type} /></td>
                  <td>{f.capacity ? f.capacity.toLocaleString('fa-IR') : '—'} قطعه</td>
                  <td className="text-sm text-muted">هر {f.reminder_interval_days} روز</td>
                  <td className="text-sm text-muted">{toJalaliShort(f.created_at)}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setModal(f)}>ویرایش</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <FarmModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </>
  )
}
