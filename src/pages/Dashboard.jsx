import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useApplications } from '../state/useApplications'

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#ef4444']

export default function Dashboard() {
  const { applications } = useApplications()

  const stats = useMemo(() => {
    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
    const deadlines = {}
    for (const a of applications) {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1
      if (a.deadline) {
        const key = new Date(a.deadline).toLocaleDateString(undefined, { month: 'short' })
        deadlines[key] = (deadlines[key] || 0) + 1
      }
    }
    return {
      total: applications.length,
      byStatus,
      deadlineData: Object.entries(deadlines).map(([name, value]) => ({ name, value })),
      pieData: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    }
  }, [applications])

  return (
    <div className="grid cols-2">
      <section className="grid cols-4">
        <div className="card-panel"><h3>Total</h3><h1>{stats.total}</h1><p className="muted">Applications</p></div>
        <div className="card-panel"><h3>Applied</h3><h1 className="accent">{stats.byStatus.Applied}</h1></div>
        <div className="card-panel"><h3>Interview</h3><h1 className="accent">{stats.byStatus.Interview}</h1></div>
        <div className="card-panel"><h3>Offer</h3><h1 className="accent">{stats.byStatus.Offer}</h1></div>
      </section>

      <section className="grid cols-2">
        <div className="card-panel" style={{ minHeight: 320 }}>
          <h3>Applications by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie dataKey="value" data={stats.pieData} outerRadius={100} label>
                {stats.pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-panel" style={{ minHeight: 320 }}>
          <h3>Deadlines by Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.deadlineData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#22d3ee" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}


