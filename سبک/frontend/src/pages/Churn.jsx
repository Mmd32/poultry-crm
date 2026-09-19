import { useEffect, useState } from 'react'
import { churn as churnApi, customers as customersApi } from '../api'
import RiskBadge from '../components/RiskBadge'
import { toJalali } from '../hooks/useJalali'

const RISK_OPTS = [
  { v: 'low',    cls: 'sel-low',    icon: '🟢', label: 'کم‌ریسک',    sub: 'احتمال ماندن بالا' },
  { v: 'medium', cls: 'sel-medium', icon: '🟡', label: 'ریسک متوسط', sub: 'نیاز به توجه' },
  { v: 'high',   cls: 'sel-high',   icon: '🔴', label: 'پرریسک',     sub: 'احتمال ترک بالا' },
]
const RESPONSE_OPTS = [
  { v: 'responsive', icon: '✅', label: 'پاسخ‌گو',  sub: 'ارتباط عادی' },
  { v: 'delayed',    icon: '⏳', label: 'تأخیر',    sub: 'کمتر پاسخ‌گو' },
  { v: 'no_response',icon: '🔇', label: 'بی‌پاسخ',  sub: 'عدم ارتباط' },
]
const TREND_OPTS = [
  { v: 'up',     icon: '📈', label: 'صعودی',  sub: 'خرید رو به رشد', cls: 'sel-yes' },
  { v: 'stable', icon: '➡️', label: 'ثابت',   sub: 'بدون تغییر',    cls: '' },
  { v: 'down',   icon: '📉', label: 'نزولی',  sub: 'کاهش خرید',     cls: 'sel-no' },
]
const CHURN_STAR_LABELS = ['', 'خیلی بد', 'بد', 'متوسط', 'خوب', 'عالی']

function ChurnStarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="star-rating-wrap">
      <div className="stars-input">
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button"
            className={`star-input-btn${(hover || value) >= n ? ' on' : ''}`}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}>★</button>
        ))}
      </div>
      <span className="star-label">{CHURN_STAR_LABELS[hover || value] || ''}</span>
    </div>
  )
}

function scoreToRisk(s) {
  return s >= 70 ? 'high' : s >= 35 ? 'medium' : 'low'
}

function ChurnModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    customer: '', risk_level: 'low', score: 30, trigger: 'manual',
    satisfaction_score: 3, has_complaint: false,
    response_status: 'responsive', purchase_trend: 'stable', notes: ''
  })
  const [customerList, setCustomerList] = useState([])
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    customersApi.list().then((r) => setCustomerList(r.data.results || r.data))
  }, [])

  const handleScore = (val) => {
    const s = Math.min(100, Math.max(0, parseInt(val) || 0))
    setForm(f => ({ ...f, score: s, risk_level: scoreToRisk(s) }))
  }

  const handleSave = async () => {
    if (!form.customer) return
    setSaving(true)
    try { await churnApi.create(form); onSave() }
    finally { setSaving(false) }
  }

  const scoreColor = form.score >= 70 ? 'var(--red)' : form.score >= 35 ? 'var(--orange)' : 'var(--green)'

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">ارزیابی ریسک مشتری</div>
            <div className="modal-sub">احتمال ترک مشتری را ارزیابی کنید</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-sec">مشتری</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>مشتری <span className="req">*</span></label>
              <select value={form.customer} onChange={(e) => set('customer', e.target.value)} autoFocus>
                <option value="">انتخاب مشتری...</option>
                {customerList.map((c) => <option key={c.id} value={c.id}>{c.name}{c.city ? ` — ${c.city}` : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>علت بررسی</label>
              <select value={form.trigger} onChange={(e) => set('trigger', e.target.value)}>
                <option value="manual">دستی</option>
                <option value="feedback_low">بازخورد منفی</option>
                <option value="no_response">عدم پاسخ</option>
                <option value="complaint">شکایت</option>
                <option value="purchase_drop">کاهش خرید</option>
                <option value="payment_delay">تأخیر پرداخت</option>
                <option value="end_cycle">پایان دوره</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-sec">امتیاز ریسک</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div className="score-display" style={{ color: scoreColor, borderColor: scoreColor, minWidth: 72 }}>
            {form.score}
          </div>
          <div style={{ flex: 1 }}>
            <input type="range" className="score-range" min="0" max="100"
              value={form.score} onChange={(e) => handleScore(e.target.value)}
              style={{ '--thumb-color': scoreColor }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
              <span>کم‌ریسک</span><span>ریسک متوسط</span><span>پرریسک</span>
            </div>
          </div>
        </div>

        <div className="form-sec">سطح ریسک</div>
        <div className="opt-group">
          {RISK_OPTS.map(o => (
            <div key={o.v}
              className={`opt-card ${o.cls}${form.risk_level === o.v ? ' selected' : ''}`}
              onClick={() => setForm(f => ({ ...f, risk_level: o.v }))}>
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">رضایت و تعامل</div>
        <div className="form-grid">
          <div className="form-group">
            <label>رضایت مشتری</label>
            <ChurnStarPicker value={form.satisfaction_score} onChange={(v) => set('satisfaction_score', v)} />
          </div>
        </div>

        <div className="form-sec">وضعیت پاسخ‌دهی</div>
        <div className="opt-group">
          {RESPONSE_OPTS.map(o => (
            <div key={o.v}
              className={`opt-card${form.response_status === o.v ? ' selected' : ''}`}
              onClick={() => set('response_status', o.v)}>
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">روند خرید</div>
        <div className="opt-group">
          {TREND_OPTS.map(o => (
            <div key={o.v}
              className={`opt-card ${o.cls}${form.purchase_trend === o.v ? ' selected' : ''}`}
              onClick={() => set('purchase_trend', o.v)}>
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">شکایت و یادداشت</div>
        <div className="form-grid">
          <div
            className={`complaint-toggle${form.has_complaint ? ' on' : ''}`}
            onClick={() => set('has_complaint', !form.has_complaint)}
          >
            <input type="checkbox" checked={form.has_complaint} readOnly
              style={{ width: 16, height: 16, accentColor: 'var(--red)', pointerEvents: 'none' }} />
            <div>
              <div className="complaint-toggle-label">مشتری شکایت دارد</div>
              <div className="complaint-toggle-sub">شکایت ثبت‌شده‌ای وجود دارد</div>
            </div>
          </div>
          <div className="form-group">
            <label>یادداشت تحلیلگر</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="دلایل، سابقه مشتری، یا اقدامات پیشنهادی..." rows={3} maxLength={500} />
            <span className="char-count">{(form.notes || '').length} / ۵۰۰</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}
            disabled={saving || !form.customer}>
            {saving ? 'در حال ذخیره...' : 'ثبت ارزیابی'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

const trendCfg = {
  up:     { icon: '↑', color: 'var(--green)',  label: 'صعودی' },
  stable: { icon: '→', color: 'var(--t3)',     label: 'ثابت' },
  down:   { icon: '↓', color: 'var(--red)',    label: 'نزولی' },
}

export default function Churn() {
  const [list, setList] = useState([])
  const [riskFilter, setRiskFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    churnApi.list({ risk: riskFilter || undefined })
      .then((r) => setList(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [riskFilter])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">ریسک ترک مشتری</div>
          <div className="page-sub">{list.length} ارزیابی ثبت‌شده</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ ارزیابی جدید</button>
      </div>

      <div className="card">
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
                <th>مشتری</th>
                <th>سطح ریسک</th>
                <th>امتیاز</th>
                <th>علت</th>
                <th>پاسخ‌دهی</th>
                <th>روند خرید</th>
                <th>شکایت</th>
                <th>تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center text-muted" style={{ padding: '2.5rem' }}>در حال بارگذاری...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">ارزیابی‌ای یافت نشد</div></div></td></tr>
              ) : list.map((a) => {
                const scoreColor = a.risk_level === 'high' ? 'var(--red)' : a.risk_level === 'medium' ? 'var(--orange)' : 'var(--green)'
                const trend = trendCfg[a.purchase_trend] || trendCfg.stable
                return (
                  <tr key={a.id}>
                    <td className="td-name">{a.customer_name}</td>
                    <td><RiskBadge level={a.risk_level} /></td>
                    <td>
                      <div className="flex items-center gap-sm">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${a.score}%`, background: scoreColor }} />
                        </div>
                        <span className="text-xs text-muted">{a.score}</span>
                      </div>
                    </td>
                    <td className="text-sm">{a.trigger_display}</td>
                    <td className="text-sm">{a.response_status_display}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: trend.color, fontSize: 13 }}>
                        {trend.icon} {trend.label}
                      </span>
                    </td>
                    <td>
                      {a.has_complaint
                        ? <span className="badge badge-high">دارد</span>
                        : <span className="text-muted text-sm">—</span>}
                    </td>
                    <td className="text-sm text-muted">{toJalali(a.assessed_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ChurnModal onClose={() => setModal(false)} onSave={() => { setModal(false); load() }} />}
    </>
  )
}
