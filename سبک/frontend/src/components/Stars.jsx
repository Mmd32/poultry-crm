export default function Stars({ value, max = 5 }) {
  return (
    <div className="stars">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`star${i < value ? '' : ' empty'}`}>★</span>
      ))}
    </div>
  )
}
