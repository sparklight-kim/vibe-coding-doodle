import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
}

export function CodeBlock({ children, className = '', ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    if (!preRef.current) return
    const code = preRef.current.innerText
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="relative group">
      <pre ref={preRef} className={`relative ${className}`} {...props}>
        {children}
      </pre>
      <button
        className="code-block-copy-btn absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 dark:bg-gray-800 rounded text-white opacity-70 hover:opacity-100 transition"
        onClick={handleCopy}
        aria-label="코드 복사"
        type="button"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? '복사됨' : '복사'}</span>
      </button>
    </div>
  )
} 