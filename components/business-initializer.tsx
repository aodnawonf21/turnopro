'use client'

import { useEffect } from 'react'
import { ensureBusiness } from '@/app/actions/auth'

export function BusinessInitializer() {
  useEffect(() => {
    const initializeBusiness = async () => {
      try {
        const result = await ensureBusiness()
        if (result?.error) {
          console.error('[v0] Failed to initialize business:', result.error)
        } else {
          console.error('[v0] Business initialized:', result?.businessId)
        }
      } catch (error) {
        console.error('[v0] Error initializing business:', error)
      }
    }

    initializeBusiness()
  }, [])

  return null
}
