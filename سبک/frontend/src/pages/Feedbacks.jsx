import { useEffect, useState } from 'react'
import { feedbacks as feedbacksApi, customers as customersApi, farms as farmsApi } from '../api'
import Stars from '../components/Stars'
import { toJalali } from '../hooks/useJalali'

const FB_TYPES = [
  { v: 'week1',     icon: '📅', label: 'هفته اول' },
  { v: 'periodic',  icon: '🔄', label: 'دوره‌ای' },
  { v: 'end_cycle', icon: '✅', label: 'پایان دوره' },
  { v: 'complaint', icon: '⚠️', label: 'شکایت' },
  { v: 'general',   icon: '💬', label: 'عمومی' },
]
const REPURCHASE_OPTS = [
  { v: 'yes',     cls: 'sel-yes',    icon: '✅', label: 'بله',          sub: 'قصد خرید دارد' },
  { v: 'maybe',   cls: 'sel-maybe',  icon: '🤔', label: 'شاید',         sub: 'نامشخص' },
  { v: 'no',      cls: 'sel-no',     icon: '❌', label: 'خیر',          sub: 'قصد ندارد' },
  { v: 'unknown', cls: '',           icon: '❓', label: 'مشخص نیست',    sub: 'پرسیده نشد' },
]
const STAR_LABELS = ['', 'خیلی بد', 'بد', 'متوسط', 'خوب', 'عالی']

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="star-rating-wrap">
      <div className="stars-input">
        {[1,2,3,4,5].map(n => (
          <button
            key={n} type="button"
            className={`star-input-btn${(hover || value) >= n ? ' on' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
          >★</button>
        ))}
      </div>
      <span className="star-label">{STAR_LABELS[hover || value] || ''}</span>
    </div>
  )
}

function FeedbackModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    customer: '', farm: '', feedback_type: 'week1', satisfaction: 3,
    has_complaint: false, complaint_text: '', mortality_rate: '',
    production_note: '', will_repurchase: 'unknown', notes: ''
  })
  const [customerList, setCustomerList] = useState([])
  const [farmList, setFarmList] = useState([])
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    customersApi.list().then((r) => setCustomerList(r.data.results || r.data))
  }, [])

  useEffect(() => {
    if (form.customer) {
      set('farm', '')
      farmsApi.list({ customer: form.customer }).then((r) => setFarmList(r.data.results || r.data))
    }
  }, [form.customer])

  const handleSave = async () => {
    if (!form.customer || !form.farm) return
    setSaving(true)
    try { await feedbacksApi.create(form); onSave() }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">ثبت بازخورد جدید</div>
            <div className="modal-sub">اطلاعات بازدید از مزرعه را وارد کنید</div>
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
                {customerList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>مزرعه <span className="req">*</span></label>
              <select value={form.farm} onChange={(e) => set('farm', e.target.value)} disabled={!form.customer}>
                <option value="">{form.customer ? 'انتخاب مزرعه...' : 'ابتدا مشتری را انتخاب کنید'}</option>
                {farmList.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-sec">نوع بازخورد</div>
        <div className="opt-group wrap">
          {FB_TYPES.map(t => (
            <div
              key={t.v}
              className={`opt-card${form.feedback_type === t.v ? ' selected' : ''}`}
              onClick={() => set('feedback_type', t.v)}
            >
              <div className="opt-card-icon">{t.icon}</div>
              <div className="opt-card-label">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">ارزیابی</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>رضایت مشتری</label>
              <StarPicker value={form.satisfaction} onChange={(v) => set('satisfaction', v)} />
            </div>
            <div className="form-group">
              <label>نرخ تلفات</label>
              <input type="number" value={form.mortality_rate}
                onChange={(e) => set('mortality_rate', e.target.value)}
                placeholder="۰.۰" step="0.1" min="0" max="100" />
              <span className="input-hint">درصد تلفات گله</span>
            </div>
          </div>
        </div>

        <div className="form-sec">قصد خرید مجدد</div>
        <div className="opt-group">
          {REPURCHASE_OPTS.map(o => (
            <div
              key={o.v}
              className={`opt-card ${o.cls}${form.will_repurchase === o.v ? ' selected' : ''}`}
              onClick={() => set('will_repurchase', o.v)}
            >
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">شکایت</div>
        <div className="form-grid">
          <div
            className={`complaint-toggle${form.has_complaint ? ' on' : ''}`}
            onClick={() => set('has_complaint', !form.has_complaint)}
          >
            <input type="checkbox" checked={form.has_complaint} readOnly
              style={{ width: 16, height: 16, accentColor: 'var(--red)', pointerEvents: 'none' }} />
            <div>
              <div className="complaint-toggle-label">مشتری شکایت دارد</div>
              <div className="complaint-toggle-sub">در صورت فعال بودن، متن شکایت را وارد کنید</div>
            </div>
          </div>
          {form.has_complaint && (
            <div className="form-group">
              <label>متن شکایت</label>
              <textarea value={form.complaint_text}
                onChange={(e) => set('complaint_text', e.target.value)}
                placeholder="شکایت مشتری را با جزئیات شرح دهید..." rows={3} maxLength={500} />
              <span className="char-count">{(form.complaint_text || '').length} / ۵۰۰</span>
            </div>
          )}
        </div>

        <div className="form-sec">یادداشت‌ها</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>یادداشت تولید</label>
              <textarea value={form.production_note}
                onChange={(e) => set('production_note', e.target.value)}
                placeholder="وضعیت گله، تغذیه، بهداشت..." rows={2} />
            </div>
            <div className="form-group">
              <label>یادداشت کارشناس</label>
              <textarea value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="نکات تجاری یا پیگیری‌های لازم..." rows={2} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}
            disabled={saving || !form.customer || !form.farm}>
            {saving ? 'در حال ذخیره...' : 'ثبت بازخورد'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

export default function Feedbacks() {
  const [list, setList] = useState([])
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    feedbacksApi.list().then((r) => setList(r.data.results || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const repurchaseLabel = { yes: 'بله ✓', maybe: 'شاید', no: 'خیر ✗', unknown: '—' }
  const repurchaseColor = { yes: 'var(--success)', maybe: 'var(--warning)', no: 'var(--danger)', unknown: 'var(--text-3)' }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">بازخوردها</div>
          <div className="page-sub">{list.length} بازخورد ثبت‌شده</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ ثبت بازخورد</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>مشتری</th>
                <th>مزرعه</th>
                <th>نوع</th>
                <th>رضایت</th>
                <th>شکایت</th>
                <th>خرید مجدد</th>
                <th>تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>در حال بارگذاری...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>بازخوردی ثبت نشده</td></tr>
              ) : list.map((f) => (
                <tr key={f.id}>
                  <td className="td-name">{f.customer_name}</td>
                  <td>{f.farm_name}</td>
                  <td><span className="badge badge-pending">{f.feedback_type_display}</span></td>
                  <td><Stars value={f.satisfaction} /></td>
                  <td>
                    {f.has_complaint
                      ? <span className="badge badge-high">دارد</span>
                      : <span className="badge badge-done">ندارد</span>}
                  </td>
                  <td style={{ fontWeight: 500, color: repurchaseColor[f.will_repurchase] }}>
                    {repurchaseLabel[f.will_repurchase]}
                  </td>
                  <td className="text-sm text-muted">{toJalali(f.recorded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <FeedbackModal
          onClose={() => setModal(false)}
          onSave={() => { setModal(false); load() }}
        />
      )}
    </>
  )
}
