export default function FarmTypeBadge({ type }) {
  const map = {
    broiler: { label: 'گوشتی', cls: 'badge-broiler' },
    breeder: { label: 'مادری', cls: 'badge-breeder' },
    layer: { label: 'تخم‌گذار', cls: 'badge-layer' },
  }
  const { label, cls } = map[type] || { label: type, cls: 'badge-pending' }
  return <span className={`badge ${cls}`}>{label}</span>
}
