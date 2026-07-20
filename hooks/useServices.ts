import { useEffect, useState } from 'react'

export interface ServiceData {
  hasServices: boolean
  loading: boolean
  error: string | null
}

export function useServices() {
  const [data, setData] = useState<ServiceData>({
    hasServices: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const result = await response.json()
        
        setData({
          hasServices: result.data?.length > 0 || result.hasServices || false,
          loading: false,
          error: result.error || null,
        })
      } catch (err) {
        setData({
          hasServices: false,
          loading: false,
          error: 'Error al cargar servicios',
        })
      }
    }

    fetchServices()
  }, [])

  return data
}
