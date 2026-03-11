'use client'

import { useState, useRef, useEffect } from 'react'

export default function ContactButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="glass-pill"
      >
        Contact Me
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 glass-panel flex flex-col gap-1 p-2 min-w-[160px] text-sm">
          <a
            href="mailto:crespoeduardo@icloud.com"
            className="px-3 py-2 rounded-md hover:bg-white/20 transition-colors"
            onClick={() => setOpen(false)}
          >
            Email
          </a>
          <a
            href="tel:+17863191427"
            className="px-3 py-2 rounded-md hover:bg-white/20 transition-colors"
            onClick={() => setOpen(false)}
          >
            Phone
          </a>
        </div>
      )}
    </div>
  )
}
