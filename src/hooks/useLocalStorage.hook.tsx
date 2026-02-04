import { useState, useEffect } from 'react'

export const useLocalStorage = (storageKey: string, defaultValue: boolean) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(storageKey)
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  const iconClass = value ? 'btn-active' : 'btn-default'

  return [value, setValue, iconClass]
}
