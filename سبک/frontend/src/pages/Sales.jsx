import { useEffect, useState } from 'react'
import { sales as salesApi, farms as farmsApi } from '../api'
import { toJalali } from '../hooks/useJalali'

const PAYMENT_OPTS = [
  { v: 'paid',    cls: 'sel-paid',    icon: '✅', label: 'پرداخت شده',  sub: 'تسویه کامل' },
  { v: 'partial', cls: 'sel-partial', icon: '🔶', label: 'جزئی',        sub: 'پرداخت ناقص' },
  { v: 'pending', cls: 'sel-pending', icon: '⏳', label: 'معلق',        sub: 'در انتظار' },
]

function SaleModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    farm: '', sale_date: new Date().toISOString().split('T')[0],
    quantity: '', price_per_unit: '', product_type: '',
    payment_status: 'pending', notes: ''
  })
  const [farmList, setFarmList] = useState([])
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    farmsApi.list().then((r) => setFarmList(r.data.results || r.data))
  }, [])

  const totalPrice = form.quantity && form.price_per_unit
    ? (parseFloat(form.quantity) * parseFloat(form.price_per_unit)).toLocaleString('fa-IR')
    : null

  const canSave = form.farm && form.sale_date && form.quantity && form.price_per_unit

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try { await salesApi.create(form); onSave() }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">ثبت فروش جدید</div>
            <div className="modal-sub">مشخصات فروش به مزرعه را وارد کنید</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-sec">مزرعه و تاریخ</div>
        <div className="form-grid">
          <div className="form-group">
            <label>مزرعه <span className="req">*</span></label>
            <select value={form.farm} onChange={(e) => set('farm', e.target.value)} autoFocus>
              <option value="">انتخاب مزرعه...</option>
              {farmList.map((f) => (
                <option key={f.id} value={f.id}>{f.customer_name} — {f.name}</option>
              ))}
            </select>
            <span className="input-hint">مزرعه‌ای که محصول به آن فروخته شده</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>تاریخ فروش <span className="req">*</span></label>
              <input type="date" value={form.sale_date} onChange={(e) => set('sale_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>نوع محصول</label>
              <input value={form.product_type} onChange={(e) => set('product_type', e.target.value)}
                placeholder="مثلاً: جوجه یک‌روزه" />
            </div>
          </div>
        </div>

        <div className="form-sec">مقدار و قیمت</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label>مقدار <span className="req">*</span></label>
              <input type="number" value={form.quantity}
                onChange={(e) => set('quantity', e.target.value)} placeholder="۰" min="0" step="0.1" />
              <span className="input-hint">کیلوگرم</span>
            </div>
            <div className="form-group">
              <label>قیمت واحد <span className="req">*</span></label>
              <input type="number" value={form.price_per_unit}
                onChange={(e) => set('price_per_unit', e.target.value)} placeholder="۰" min="0" />
              <span className="input-hint">تومان به ازای هر کیلو</span>
            </div>
          </div>
          {totalPrice && (
            <div className="price-total-box">
              <span className="price-total-label">مبلغ کل فروش</span>
              <span className="price-total-value">{totalPrice} تومان</span>
            </div>
          )}
        </div>

        <div className="form-sec">وضعیت پرداخت</div>
        <div className="opt-group">
          {PAYMENT_OPTS.map(o => (
            <div
              key={o.v}
              className={`opt-card ${o.cls}${form.payment_status === o.v ? ' selected' : ''}`}
              onClick={() => set('payment_status', o.v)}
            >
              <div className="opt-card-icon">{o.icon}</div>
              <div className="opt-card-label">{o.label}</div>
              <div className="opt-card-sub">{o.sub}</div>
            </div>
          ))}
        </div>

        <div className="form-sec">یادداشت</div>
        <div className="form-grid">
          <div className="form-group">
            <label>یادداشت فروش</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="شرایط خاص، تخفیف‌ها، یا نکات مهم این فروش..." rows={3} maxLength={400} />
            <span className="char-count">{(form.notes || '').length} / ۴۰۰</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !canSave}>
            {saving ? 'در حال ذخیره...' : 'ثبت فروش'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}

export default function Sales() {
  const [list, setList] = useState([])
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    salesApi.list().then((r) => setList(r.data.results || r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const paymentLabel = { paid: 'پرداخت شده', partial: 'جزئی', pending: 'معلق' }
  const paymentClass = { paid: 'badge-done', partial: 'badge-medium', pending: 'badge-pending' }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">فروش</div>
          <div className="page-sub">{list.length} تراکنش</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ ثبت فروش جدید</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>مشتری</th>
                <th>مزرعه</th>
                <th>نوع مزرعه</th>
                <th>تاریخ فروش</th>
                <th>مقدار</th>
                <th>مبلغ کل</th>
                <th>پرداخت</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>در حال بارگذاری...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '2rem' }}>فروشی ثبت نشده</td></tr>
              ) : list.map((s) => (
                <tr key={s.id}>
                  <td className="td-name">{s.customer_name}</td>
                  <td>{s.farm_name}</td>
                  <td>
                    <span className={`badge badge-${s.farm_type}`}>
                      {s.farm_type === 'broiler' ? 'گوشتی' : s.farm_type === 'breeder' ? 'مادری' : 'تخم‌گذار'}
                    </span>
                  </td>
                  <td className="text-sm">{toJalali(s.sale_date)}</td>
                  <td>{parseFloat(s.quantity).toLocaleString('fa-IR')} kg</td>
                  <td style={{ fontWeight: 500 }}>{parseInt(s.total_price).toLocaleString('fa-IR')} تومان</td>
                  <td>
                    <span className={`badge ${paymentClass[s.payment_status]}`}>
                      {paymentLabel[s.payment_status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <SaleModal
          onClose={() => setModal(false)}
          onSave={() => { setModal(false); load() }}
        />
      )}
    </>
  )
}
