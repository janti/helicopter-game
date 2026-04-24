import { useEffect, useState } from 'react'

export function useKeyboard() {
  const [keys, setKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: true }))
    }
    const onKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: false }))
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return keys
}
