import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { styled } from "styled-system/jsx"

const ToggleButton = styled('button', {
  base: {
    w: 10,
    h: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    rounded: 'full',
    borderWidth: '1px',
    borderColor: { base: 'gray.300', _dark: 'gray.700' },
    bg: { base: 'white', _dark: 'gray.900' },
    transitionProperty: 'colors',
    _hover: {
      bg: { base: 'gray.100', _dark: 'gray.800' },
    },
  },
})

const Icon = styled('svg', {
  base: { w: 5, h: 5 },
})

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
    <ToggleButton onClick={toggle} aria-label="다크 모드 토글" title="다크 모드 토글">
      {isDark ? <Moon className={Icon()} style={{ color: 'var(--colors-yellow-400)' }} /> : <Sun className={Icon()} style={{ color: 'var(--colors-gray-700)' }} />}
    </ToggleButton>
  )
} 