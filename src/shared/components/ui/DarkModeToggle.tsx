import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system')
  const [isDark, setIsDark] = useState(false)

  // 시스템 모드 감지
  useEffect(() => {
    const saved = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system' | null
    if (saved) {
      setMode(saved)
    } else {
      setMode('system')
    }
  }, [])

  // 실제 다크모드 적용
  useEffect(() => {
    const root = window.document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const effectiveDark = mode === 'dark' || (mode === 'system' && systemDark)
    setIsDark(effectiveDark)
    root.classList.toggle('dark', effectiveDark)
  }, [mode])

  // 시스템 모드 변경 감지
  useEffect(() => {
    if (mode === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        setIsDark(e.matches)
        window.document.documentElement.classList.toggle('dark', e.matches)
      }
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [mode])

  const toggle = () => {
    let next: 'light' | 'dark' | 'system'
    if (mode === 'system') next = isDark ? 'light' : 'dark'
    else if (mode === 'dark') next = 'light'
    else next = 'dark'
    setMode(next)
    localStorage.setItem('theme-mode', next)
  }

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="다크 모드 토글"
      title="다크 모드 토글"
    >
      {isDark ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-gray-700" />}
    </button>
  )
} 