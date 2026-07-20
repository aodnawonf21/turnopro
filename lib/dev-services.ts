// Development-only service storage (in-memory)
// This is used when Supabase is not configured

import { Service } from '@/app/actions/services'

let devServices: Service[] = []

export function addDevService(service: Service): Service {
  devServices.push(service)
  return service
}

export function getDevServices(): Service[] {
  return devServices
}

export function getDevService(id: string): Service | undefined {
  return devServices.find(s => s.id === id)
}

export function updateDevService(id: string, updates: Partial<Service>): Service | undefined {
  const index = devServices.findIndex(s => s.id === id)
  if (index === -1) return undefined
  
  devServices[index] = {
    ...devServices[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return devServices[index]
}

export function deleteDevService(id: string): boolean {
  const index = devServices.findIndex(s => s.id === id)
  if (index === -1) return false
  
  devServices.splice(index, 1)
  return true
}

export function clearDevServices(): void {
  devServices = []
}
