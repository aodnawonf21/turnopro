'use client'

import { useState } from 'react'
import { toggleService, deleteService, type Service } from '@/app/actions/services'
import { Edit2, Trash2, Clock } from 'lucide-react'

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onRefresh: () => void
}

export default function ServiceCard({ service, onEdit, onRefresh }: ServiceCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    setLoading(true)
    setError(null)
    const result = await toggleService(service.id, !service.is_active)
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
    onRefresh()
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return
    }
    setLoading(true)
    setError(null)
    const result = await deleteService(service.id)
    if (result?.error) {
      setError(result.error)
    }
    setLoading(false)
    onRefresh()
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden transition-all ${
      service.is_active ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-75'
    }`}>
      {/* Header with status badge */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-black">{service.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              service.is_active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {service.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Duración</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-semibold text-black">{service.duration} min</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Precio</p>
            <p className="text-sm font-semibold text-black">${service.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Estado</p>
            <div className="flex items-center">
              <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  service.is_active ? 'bg-amber-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    service.is_active ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  )
}
