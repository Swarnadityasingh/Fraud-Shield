
const transactions = [
  { id: 'TXN-1042', amount: 8500, type: 'PAYMENT', probability: 12, risk: 'Low' },
  { id: 'TXN-1043', amount: 85000, type: 'TRANSFER', probability: 92, risk: 'High' },
  { id: 'TXN-1044', amount: 12000, type: 'CASH_OUT', probability: 35, risk: 'Medium' },
  { id: 'TXN-1045', amount: 950, type: 'PAYMENT', probability: 8, risk: 'Low' },
]

const riskStyle = {
  Low: 'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-red-50 text-red-700',
}

export default function TransactionTable() {
  return (
    <section id="transactions" className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent transactions</h2>
        <span className="text-xs text-slate-400">Sample data</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[550px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {['Transaction', 'Amount', 'Type', 'Fraud probability', 'Risk'].map(col => (
                <th key={col} className="px-3 py-3 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="px-3 py-4 font-medium">{tx.id}</td>
                <td className="px-3 py-4">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency', currency: 'INR', maximumFractionDigits: 0
                  }).format(tx.amount)}
                </td>
                <td className="px-3 py-4 text-slate-500">{tx.type}</td>
                <td className="px-3 py-4">{tx.probability}%</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyle[tx.risk]}`}>
                    {tx.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
