const MAP = {
  pending: { label: 'انجام نشده',     cls: 'badge-pending' },
  done:    { label: 'انجام شد',        cls: 'badge-done'    },
  overdue: { label: 'عقب‌افتاده',     cls: 'badge-overdue' },
  urgent:  { label: 'پیگیری فوری',    cls: 'badge-urgent'  },
}

export default function StatusBadge({ status }) {
  const { label, cls } = MAP[status] || { label: status, cls: 'badge-pending' }
  return <span className={`badge ${cls}`}>{label}</span>
}
