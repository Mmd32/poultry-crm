const MAP = {
  low:    { label: 'کم‌ریسک',     cls: 'badge-low',    dot: '🟢' },
  medium: { label: 'ریسک متوسط',  cls: 'badge-medium', dot: '🟡' },
  high:   { label: 'پرریسک',      cls: 'badge-high',   dot: '🔴' },
}

export default function RiskBadge({ level, showDot = false }) {
  const { label, cls, dot } = MAP[level] || MAP.low
  return (
    <span className={`badge ${cls}`}>
      {showDot && <span>{dot}</span>}
      {label}
    </span>
  )
}
