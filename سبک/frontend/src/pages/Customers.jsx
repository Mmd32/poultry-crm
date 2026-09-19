import { useEffect, useState } from 'react'
import { customers } from '../api'
import RiskBadge from '../components/RiskBadge'
import { toJalaliShort } from '../hooks/useJalali'

const RISK_OPTS = [
  { v: 'low',    cls: 'sel-low',    icon: '🟢', label: 'کم‌ریسک',   sub: 'مشتری سالم' },
  { v: 'medium', cls: 'sel-medium', icon: '🟡', label: 'ریسک متوسط', sub: 'نیاز به توجه' },
  { v: 'high',   cls: 'sel-high',   icon: '🔴', label: 'پرریسک',     sub: 'در خطر ترک' },
]

function CustomerModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial?.id ? initial : {
    name: '', phone: '', phone2: '', city: '', province: '', address: '', notes: '', risk_level: 'low'
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name || !form.phone) return
    setSaving(true)
    try {
      if (initial?.id) await customers.update(initial.id, form)
      else await customers.create(form)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{initial?.id ? 'ویرایش مشتری' : 'مشتری جدید'}</div>
            <div className="modal-sub">اطلاعات تماس و سطح ریسک را وارد کنید</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-sec">اطلاعات پایه</div>
        <div className="form-grid">
          <div className="form-group">
            <label>نام کامل <span className="req">*</span></label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="نام و نام خانوادگی" autoFocus />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>موبایل <span className="req">*</span></label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="09..." />
            </div>
            <div className="form-group">
              <label>تلفن دوم</label>
              <input value={form.phone2} onChange={(e) => set('phone2', e.target.value)} placeholder="اختیاری" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>شهر</label>
              <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="نام شهر" />
            </div>
            <div className="form-group">
              <label>استان</label>
              <input value={form.province} onChange={(e) => set('province', e.target.value)} placeholder="نام استان" />
            </div>
          </div>
          <div className="form-group">
            <label>آدرس دقیق</label>
            <textarea value={form.address} onChange={(e) => set('address', e.target.value)}
              placeholder="آدرس کامل محل سکونت یا مزرعه" rows={2} />
          </div>
        </div>

        <div className="form-sec">سطح ریسک</div>
        <div className="opt-group">
          {RISK_OPTS.map(o => (
            <div
              key={o.v}
              className={`opt-card ${o.cls}${form.risk_level === o.v ? ' selected' : ''}`}
              onClick={() => set('risk_level', o.v)}
            >
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">یادداشت داخلی</div>
        <div className="form-grid">
          <div className="form-group">
            <label>یادداشت</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="نکات مهم درباره این مشتری که باید به خاطر بسپارید..." rows={3} maxLength={300} />
            <span className="char-count">{(form.notes || '').length} / ۳۰۰</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name || !form.phone}>
            {saving ? 'در حال ذخیره...' : initial?.id ? 'ذخیره تغییرات' : 'ثبت مشتری'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

export default function Customers() {
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    customers.list({ search, risk_level: riskFilter || undefined })
      .then((r) => setList(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, riskFilter])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">مشتریان</div>
          <div className="page-sub">{list.length} مشتری ثبت‌شده</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({})}>+ مشتری جدید</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس نام یا تلفن..."
            />
          </div>
        </div>

        <div className="filters-row">
          {[
            { label: 'همه', value: '' },
            { label: '🟢 کم‌ریسک', value: 'low' },
            { label: '🟡 ریسک متوسط', value: 'medium' },
            { label: '🔴 پرریسک', value: 'high' },
          ].map((f) => (
            <button key={f.value} className={`filter-chip${riskFilter === f.value ? ' active' : ''}`} onClick={() => setRiskFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>نام مشتری</th>
                <th>تلفن</th>
                <th>شهر</th>
                <th>سطح ریسک</th>
                <th>تاریخ ثبت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center text-muted" style={{ padding: '2.5rem' }}>در حال بارگذاری...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">مشتری‌ای یافت نشد</div></div></td></tr>
              ) : list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="td-name">{c.name}</div>
                    {c.province && <div className="td-meta">{c.province}</div>}
                  </td>
                  <td dir="ltr" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.phone}</td>
                  <td>{c.city || '—'}</td>
                  <td><RiskBadge level={c.risk_level} /></td>
                  <td className="text-sm text-muted">{toJalaliShort(c.created_at)}</td>
                  <td style={{ width: 80 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setModal(c)}>ویرایش</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <CustomerModal initial={modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />
      )}
    </>
  )
}
