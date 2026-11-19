import { Activity, Layers, ShieldCheck, CreditCard, ChartNoAxesCombined } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const number = value => Number(value).toLocaleString('en-IN')
const riskClass = level => ['Low', 'Medium', 'High'].includes(level) ? level.toLowerCase() : 'other'

function Heading({ title, description, icon: Icon, children }) {
  return <div className="panel-heading"><div><h2>{title}</h2><p>{description}</p></div>{children || <Icon size={17} aria-hidden="true" />}</div>
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><strong>{label || payload[0].name}</strong>{payload.map((entry, index) => <div key={index}><span style={{ color: entry.color || entry.payload?.color }}>●</span> {entry.name}: <b>{number(entry.value)}</b></div>)}</div>
}

function Classification({ pipeline }) {
  const fraud = pipeline.key === 'fraud'
  const rows = [
    { label: fraud ? 'Legitimate' : 'No serious delinquency', value: pipeline.negative, tone: 'blue' },
    { label: fraud ? 'Fraudulent' : 'Serious delinquency', value: pipeline.positive, tone: 'red' },
    ...(pipeline.other ? [{ label: 'Other classification', value: pipeline.other, tone: 'slate' }] : []),
  ]
  return <div className="classification-pipeline"><div className="pipeline-title">{fraud ? <ShieldCheck size={15} /> : <CreditCard size={15} />}<h3>{pipeline.name}</h3></div>
    {pipeline.total ? <><div className="segmented-bar" role="img" aria-label={rows.map(r => `${r.label}: ${r.value}`).join(', ')}>{rows.filter(r => r.value).map(row => <span key={row.label} className={`segment-${row.tone}`} style={{ width: `${row.value / pipeline.total * 100}%` }} title={`${row.label}: ${row.value}`} />)}</div>
      {rows.map(row => <div className="distribution-row" key={row.label}><span><i className={`legend-dot dot-${row.tone}`} />{row.label}</span><strong>{number(row.value)}</strong></div>)}</> : <p className="chart-inline-empty">No saved {fraud ? 'fraud' : 'credit'} predictions.</p>}
  </div>
}

export default function DashboardCharts({ summary }) {
  const mix = [...summary.pipelines.map(p => ({ name: p.name, value: p.total, color: p.color })), ...(summary.otherModels ? [{ name: 'Other model', value: summary.otherModels, color: 'var(--dashboard-slate)' }] : [])]
  const volumes = summary.pipelines.map(p => ({ name: p.short, predictions: p.total }))
  const highestActivity = Math.max(1, ...summary.activity.map(p => p.fraud + p.credit_risk + p.other))
  return <section className="overview-charts" aria-label="Saved prediction analytics">
    <article className="dashboard-panel prediction-activity">
      <Heading title="Prediction activity" description="Saved predictions by day · UTC" icon={Activity}><span className="chart-period">30-day window</span></Heading>
      {summary.activity.length ? <><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={summary.activity} margin={{ top: 12, right: 12, left: -26, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--dashboard-chart-grid)" strokeDasharray="3 5" />
        <XAxis dataKey="date" tickFormatter={d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} minTickGap={45} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} domain={[0, highestActivity]} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="linear" dataKey="fraud" name="Transaction fraud" stroke="var(--dashboard-blue)" fill="var(--dashboard-blue)" fillOpacity={0.06} strokeWidth={2} isAnimationActive={false} />
        <Area type="linear" dataKey="credit_risk" name="Credit delinquency" stroke="var(--dashboard-copper)" fill="var(--dashboard-copper)" fillOpacity={0.05} strokeWidth={2} isAnimationActive={false} />
        {summary.otherModels > 0 && <Area type="linear" dataKey="other" name="Other model" stroke="var(--dashboard-slate)" fillOpacity={0} isAnimationActive={false} />}
      </AreaChart></ResponsiveContainer></div><div className="chart-footnote"><div className="chart-legend">{mix.map(p => <span key={p.name}><i className="legend-dot" style={{ background: p.color }} />{p.name}</span>)}</div><small>{summary.activityStart} — {summary.activityEnd}</small></div></>
        : <div className="dashboard-chart-empty">No valid prediction timestamps are available.</div>}
      <p className="chart-note">Window ends on the latest saved timestamp.{summary.undated > 0 && ` ${summary.undated} record(s) omitted because their timestamp is unavailable.`}</p>
    </article>

    <article className="dashboard-panel prediction-mix">
      <Heading title="Prediction distribution" description="Volume by independent pipeline" icon={Layers} />
      <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={mix.filter(p => p.value)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="67%" outerRadius="88%" paddingAngle={3} stroke="var(--dashboard-surface)" strokeWidth={3} isAnimationActive={false}>{mix.filter(p => p.value).map(p => <Cell key={p.name} fill={p.color} />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer><div className="donut-label"><strong>{number(summary.total)}</strong><span>saved predictions</span></div></div>
      <div className="mix-legend">{mix.map(p => <div className="distribution-row" key={p.name}><span><i className="legend-dot" style={{ background: p.color }} />{p.name}</span><strong>{number(p.value)}</strong></div>)}</div>
    </article>

    <article className="dashboard-panel classification-distribution">
      <Heading title="Classification breakdown" description="Separate targets. Separate classifications." icon={ShieldCheck} />
      <div className="classification-grid">{summary.pipelines.map(p => <Classification key={p.key} pipeline={p} />)}</div>
      <p className="chart-note">Model-generated labels, not verified outcomes or measured model performance.</p>
    </article>

    <article className="dashboard-panel risk-distribution">
      <Heading title="Risk level distribution" description="Saved display bands · by pipeline" icon={ChartNoAxesCombined} />
      {summary.pipelines.map(p => <div className="risk-pipeline" key={p.key}><h3>{p.name}</h3>{p.total ? p.risks.filter(r => r.name !== 'Other' || r.value).map(r => <div className="risk-meter" key={r.name}><span>{r.name}</span><div><span className={`risk-fill risk-fill-${riskClass(r.name)}`} style={{ width: `${r.value / p.total * 100}%` }} title={`${p.name} · ${r.name}: ${r.value}`} /></div><strong>{number(r.value)}</strong></div>) : <p className="chart-inline-empty">No predictions for this pipeline.</p>}</div>)}
      <p className="chart-note">Display bands are not validated financial-risk categories.</p>
    </article>

    <article className="dashboard-panel model-volumes">
      <Heading title="Model prediction volumes" description="Recorded usage, not an accuracy or performance comparison" icon={Layers} />
      <div className="volume-grid"><div className="volume-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={volumes} layout="vertical" margin={{ left: 0, right: 28, top: 6, bottom: 6 }}>
        <CartesianGrid horizontal={false} stroke="var(--dashboard-chart-grid)" strokeDasharray="3 5" /><XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={50} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="predictions" name="Saved predictions" radius={[0, 4, 4, 0]} barSize={19} isAnimationActive={false}>{summary.pipelines.map(p => <Cell key={p.key} fill={p.color} />)}</Bar>
      </BarChart></ResponsiveContainer></div><div className="volume-counts">{summary.pipelines.map(p => <div key={p.key}><span>{p.name}</span><strong>{number(p.total)}</strong><small>{p.key === 'fraud' ? `${number(p.negative)} legitimate · ${number(p.positive)} fraudulent` : `${number(p.negative)} no serious delinquency · ${number(p.positive)} serious delinquency`}{p.other > 0 && ` · ${number(p.other)} other`}</small></div>)}</div></div>
    </article>
  </section>
}
