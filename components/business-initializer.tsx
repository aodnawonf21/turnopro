'use client'

import { useEffect, useRef } from 'react'
import { ensureBusiness } from '@/app/actions/auth'

export function BusinessInitializer() {
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent double initialization and race conditions during HMR
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Delay to ensure router is initialized
    const timer = setTimeout(async () => {
      try {
        await ensureBusiness()
      } catch (error) {
        // Silently fail - user can still work with dev storage
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return null
}
