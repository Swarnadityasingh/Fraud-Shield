import './StatCard.css'

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
}) {
  const validColors = ['blue', 'red', 'violet', 'amber']
  const iconColor = validColors.includes(color) ? color : 'blue'

  return (
    <article className="stat-card">
      <div className={`stat-card-icon icon-${iconColor}`}>
        <Icon size={21} strokeWidth={2} />
      </div>

      <p className="stat-card-title">{title}</p>
      <h2 className="stat-card-value">{value}</h2>
    </article>
  )
}
