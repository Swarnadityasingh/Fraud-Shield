import './StatCard.css'

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'copper',
  description,
}) {
  const validColors = ['blue', 'red', 'copper', 'amber']
  const iconColor = validColors.includes(color) ? color : 'copper'

  return (
    <article className={`stat-card stat-${iconColor}`}>
      <div className="stat-card-top"><p className="stat-card-title">{title}</p>
        <div className="stat-card-icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></div>
      </div>
      <h2 className="stat-card-value">{value}</h2>
      {description && <p className="stat-card-description">{description}</p>}
    </article>
  )
}
