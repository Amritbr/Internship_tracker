import { useEffect, useState } from 'react'

export default function Settings() {
  const [dark, setDark] = useState(() => localStorage.getItem('jit_theme') !== 'light')

  useEffect(() => {
    localStorage.setItem('jit_theme', dark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <div className="card-panel">
      <h2>Settings</h2>
      <div className="row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
        <div>
          <div>Dark Mode</div>
          <div className="muted">Toggle color scheme preference</div>
        </div>
        <label className="row" style={{ gap: 8 }}>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          <span>{dark ? 'On' : 'Off'}</span>
        </label>
      </div>
    </div>
  )
}


