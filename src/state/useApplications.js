import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'jit_applications_v1'

export function useApplications() {
  const [applications, setApplications] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const upsert = (app) => {
    setApplications((prev) => {
      const copy = [...prev]
      const idx = copy.findIndex((a) => a.id === app.id)
      if (idx >= 0) copy[idx] = app
      else copy.unshift({ ...app, id: app.id || crypto.randomUUID() })
      return copy
    })
  }

  const remove = (id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  const helpers = useMemo(() => ({ upsert, remove }), [])

  return { applications, setApplications, ...helpers }
}


