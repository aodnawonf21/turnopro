'use client'

import { useEffect, useState } from 'react'
import { getServices, type Service } from '@/app/actions/services'
import ServiceForm from '@/components/service-form'
import ServiceCard from '@/components/service-card'
import { Briefcase, Plus, ChevronRight } from 'lucide-react'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    const result = await getServices()
    if (result?.error) {
      setError(result.error)
    } else if (result?.data) {
      setServices(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingService(service)
    } else {
      setEditingService(null)
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingService(null)
  }

  const handleFormSuccess = () => {
    fetchServices()
  }

  const activeCount = services.filter(s => s.is_active).length
  const totalRevenue = services.filter(s => s.is_active).reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-bold text-black">Servicios</h1>
        </div>
        <p className="text-gray-600">Gestiona los servicios que ofrece tu negocio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-600 uppercase font-medium mb-2">Total de servicios</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-black">{services.length}</p>
            <p className="text-sm text-gray-500">servicios</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-600 uppercase font-medium mb-2">Activos</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
            <p className="text-sm text-gray-500">disponibles</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-600 uppercase font-medium mb-2">Precio promedio</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-black">
              ${activeCount > 0 ? (totalRevenue / activeCount).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">No hay servicios</h3>
          <p className="text-gray-600 mb-6">Crea tu primer servicio para comenzar</p>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear servicio
          </button>
        </div>
      ) : (
        /* Services Grid */
        <>
          {/* Create Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo servicio
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleOpenForm}
                onRefresh={fetchServices}
              />
            ))}
          </div>
        </>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService || undefined}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}
