import { useMemo, useState } from 'react'
import { useApplications } from '../state/useApplications'

const empty = { id: '', company: '', role: '', date: '', deadline: '', status: 'Applied', notes: '' }

export default function Applications() {
  const { applications, upsert, remove } = useApplications()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return applications.filter((a) =>
      (filter === 'All' || a.status === filter) &&
      (a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
    )
  }, [applications, query, filter])

  const startEdit = (app) => setEditing(app || empty)
  const cancel = () => setEditing(null)
  const save = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    upsert({ ...editing, ...data })
    setEditing(null)
  }

  return (
    <div className="grid cols-2">
      <div className="card-panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <input placeholder="Search company or role" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 180 }}>
            {['All','Applied','Interview','Offer','Rejected'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => startEdit(empty)}>Add Application</button>
        </div>
      </div>

      <div className="card-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="muted" style={{ textAlign: 'left' }}>
              {['Company','Role','Applied','Deadline','Status','Notes','Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td style={{ padding: '12px 8px' }}>{a.company}</td>
                <td style={{ padding: '12px 8px' }}>{a.role}</td>
                <td style={{ padding: '12px 8px' }}>{a.date}</td>
                <td style={{ padding: '12px 8px' }}>{a.deadline}</td>
                <td style={{ padding: '12px 8px' }}>{a.status}</td>
                <td style={{ padding: '12px 8px', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.notes}</td>
                <td style={{ padding: '12px 8px' }}>
                  <div className="row">
                    <button onClick={() => startEdit(a)}>Edit</button>
                    <button onClick={() => remove(a.id)} style={{ background: '#ef4444', color: '#fff' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="muted" style={{ padding: 16 }}>No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card-panel" style={{ gridColumn: '1 / -1' }}>
          <h3>{editing.id ? 'Edit' : 'Add'} Application</h3>
          <form onSubmit={save} className="grid cols-4" style={{ marginTop: 12 }}>
            <div><label>Company</label><input name="company" defaultValue={editing.company} required /></div>
            <div><label>Role</label><input name="role" defaultValue={editing.role} required /></div>
            <div><label>Applied</label><input name="date" type="date" defaultValue={editing.date} /></div>
            <div><label>Deadline</label><input name="deadline" type="date" defaultValue={editing.deadline} /></div>
            <div><label>Status</label>
              <select name="status" defaultValue={editing.status}>
                {['Applied','Interview','Offer','Rejected'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="cols-4" style={{ gridColumn: 'span 3' }}>
              <label>Notes</label>
              <textarea name="notes" rows="3" defaultValue={editing.notes} />
            </div>
            <div className="row" style={{ justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
              <button type="button" onClick={cancel} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


