import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useApplications } from '../state/useApplications'

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#ef4444']

export default function Analytics() {
  const { applications } = useApplications()

  const { pieData, perMonth } = useMemo(() => {
    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
    const perMonthMap = {}
    for (const a of applications) {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1
      if (a.date) {
        const d = new Date(a.date)
        const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
        perMonthMap[k] = (perMonthMap[k] || 0) + 1
      }
    }
    const months = Object.keys(perMonthMap).sort()
    return {
      pieData: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
      perMonth: months.map((m) => ({ name: m, value: perMonthMap[m] })),
    }
  }, [applications])

  return (
    <div className="grid cols-2">
      <div className="card-panel" style={{ minHeight: 360 }}>
        <h3>Applications by Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie dataKey="value" data={pieData} outerRadius={110} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card-panel" style={{ minHeight: 360 }}>
        <h3>Applications per Month</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={perMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0b1225" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


