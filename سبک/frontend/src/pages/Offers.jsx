import { useEffect, useState } from 'react'
import { offers as offersApi, customers as customersApi } from '../api'
import { toJalali } from '../hooks/useJalali'

const OFFER_TYPES = [
  { v: 'discount',              icon: '💰', label: 'تخفیف قیمت',       sub: 'کاهش قیمت ویژه' },
  { v: 'payment_terms',         icon: '📋', label: 'شرایط پرداخت',     sub: 'مهلت بیشتر' },
  { v: 'priority_supply',       icon: '🚀', label: 'اولویت عرضه',      sub: 'تحویل سریع‌تر' },
  { v: 'quality_guarantee',     icon: '✅', label: 'تضمین کیفیت',      sub: 'گارانتی محصول' },
  { v: 'replacement_guarantee', icon: '🔄', label: 'تضمین جایگزینی',  sub: 'بازگشت کالا' },
  { v: 'custom',                icon: '🎁', label: 'سفارشی',           sub: 'پیشنهاد خاص' },
]
const STATUS_OPTS = [
  { v: 'draft',    icon: '📝', label: 'پیش‌نویس',   sub: 'هنوز ارسال نشده',  cls: '' },
  { v: 'sent',     icon: '📤', label: 'ارسال شده',  sub: 'منتظر پاسخ',        cls: 'sel-maybe' },
  { v: 'accepted', icon: '🎉', label: 'پذیرفته',    sub: 'موفقیت‌آمیز',       cls: 'sel-yes' },
  { v: 'rejected', icon: '❌', label: 'رد شده',     sub: 'پذیرفته نشد',       cls: 'sel-no' },
]

function OfferModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    customer: '', offer_type: 'discount', title: '', details: '', status: 'draft'
  })
  const [customerList, setCustomerList] = useState([])
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    customersApi.list({ risk_level: 'high' }).then((r) => setCustomerList(r.data.results || r.data))
  }, [])

  const handleSave = async () => {
    if (!form.customer || !form.title) return
    setSaving(true)
    try { await offersApi.create(form); onSave() }
    finally { setSaving(false) }
  }

  const canSave = form.customer && form.title.trim()

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">پیشنهاد حفظ مشتری</div>
            <div className="modal-sub">برای مشتریان در معرض ریسک، پیشنهاد ویژه ثبت کنید</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-sec">مشتری هدف</div>
        <div className="form-grid">
          <div className="form-group">
            <label>مشتری <span className="req">*</span></label>
            <select value={form.customer} onChange={(e) => set('customer', e.target.value)} autoFocus>
              <option value="">انتخاب مشتری...</option>
              {customerList.map((c) => <option key={c.id} value={c.id}>{c.name}{c.city ? ` — ${c.city}` : ''}</option>)}
            </select>
            <span className="input-hint">فقط مشتریان پرریسک نمایش داده می‌شوند</span>
          </div>
        </div>

        <div className="form-sec">نوع پیشنهاد</div>
        <div className="offer-type-grid">
          {OFFER_TYPES.map(t => (
            <div
              key={t.v}
              className={`offer-type-card${form.offer_type === t.v ? ' selected' : ''}`}
              onClick={() => set('offer_type', t.v)}
            >
              <div className="offer-type-icon">{t.icon}</div>
              <div className="offer-type-label">{t.label}</div>
              <div className="offer-type-sub">{t.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">جزئیات پیشنهاد</div>
        <div className="form-grid">
          <div className="form-group">
            <label>عنوان پیشنهاد <span className="req">*</span></label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="مثلاً: تخفیف ۱۵٪ برای دوره بعدی" maxLength={100} />
            <span className="char-count">{(form.title || '').length} / ۱۰۰</span>
          </div>
          <div className="form-group">
            <label>توضیحات</label>
            <textarea value={form.details} onChange={(e) => set('details', e.target.value)}
              placeholder="شرایط، مدت اعتبار، جزئیات اجرایی پیشنهاد..." rows={4} maxLength={600} />
            <span className="char-count">{(form.details || '').length} / ۶۰۰</span>
          </div>
        </div>

        <div className="form-sec">وضعیت پیشنهاد</div>
        <div className="opt-group wrap">
          {STATUS_OPTS.map(o => (
            <div
              key={o.v}
              className={`opt-card ${o.cls}${form.status === o.v ? ' selected' : ''}`}
              onClick={() => set('status', o.v)}
            >
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave}
            disabled={saving || !canSave}>
            {saving ? 'در حال ذخیره...' : 'ثبت پیشنهاد'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

const STATUS_CFG = {
  draft:    { label: 'پیش‌نویس',   cls: 'badge-pending' },
  sent:     { label: 'ارسال شده',  cls: 'badge-medium'  },
  accepted: { label: 'پذیرفته',    cls: 'badge-done'    },
  rejected: { label: 'رد شده',     cls: 'badge-high'    },
}
const OFFER_ICON = {
  discount: '💰', payment_terms: '📋', priority_supply: '🚀',
  quality_guarantee: '✅', replacement_guarantee: '🔄', custom: '🎁',
}

export default function Offers() {
  const [list, setList] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    offersApi.list({ status: statusFilter || undefined })
      .then((r) => setList(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">پیشنهادات حفظ مشتری</div>
          <div className="page-sub">{list.length} پیشنهاد</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ پیشنهاد جدید</button>
      </div>

      <div className="card">
        <div className="filters-row">
          {[
            { label: 'همه', value: '' },
            { label: 'پیش‌نویس', value: 'draft' },
            { label: 'ارسال شده', value: 'sent' },
            { label: 'پذیرفته', value: 'accepted' },
            { label: 'رد شده', value: 'rejected' },
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
            <div className="empty-icon">🎁</div>
            <div className="empty-title">پیشنهادی ثبت نشده</div>
            <div className="empty-text">برای مشتریان پرریسک پیشنهاد حفظ ثبت کنید</div>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {list.map((o) => {
              const st = STATUS_CFG[o.status] || STATUS_CFG.draft
              return (
                <div key={o.id} className="offer-card">
                  <div className="flex items-start justify-between gap-md">
                    <div className="flex-1 min-0">
                      <div className="flex items-center gap-sm" style={{ marginBottom: '.3rem' }}>
                        <span style={{ fontSize: 18 }}>{OFFER_ICON[o.offer_type] || '🎁'}</span>
                        <span className="fw-600" style={{ fontSize: 14 }}>{o.title}</span>
                      </div>
                      <div className="text-xs text-muted" style={{ marginBottom: '.35rem' }}>
                        {o.customer_name} · {o.offer_type_display}
                      </div>
                      {o.details && (
                        <div className="text-sm" style={{ color: 'var(--t2)', lineHeight: 1.6 }}>{o.details}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-xs shrink-0">
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                      <span className="text-xs text-muted">{toJalali(o.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modal && <OfferModal onClose={() => setModal(false)} onSave={() => { setModal(false); load() }} />}
    </>
  )
}
