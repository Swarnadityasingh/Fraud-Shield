
export default function StatCard({ title, value, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon size={21} />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">{value}</h2>
    </article>
  )
}
