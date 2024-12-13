'use client'

import { Calendar as CalendarPrimitive } from '@/components/ui/calendar'
import { useEffect, useState } from 'react'

interface CalendarWrapperProps {
  selected: Date
  onSelect: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
}

export function CalendarWrapper({ 
  selected,
  onSelect,
  className,
  disabled
}: CalendarWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className} />
  }

  return (
    <CalendarPrimitive
      mode="single"
      selected={selected}
      onSelect={onSelect}
      className={className}
      disabled={disabled}
    />
  )
}
