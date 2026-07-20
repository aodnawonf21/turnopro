'use client'

import { useEffect, useState } from 'react'
import { createService, updateService, type Service } from '@/app/actions/services'
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
    try {
      const response = await fetch('/api/services')
      const result = await response.json()
      
      if (!response.ok) {
        setError(result.error || 'Error al cargar servicios')
      } else {
        setServices(result.data || [])
        // Clear error if we successfully loaded data
        if (result.isDevelopment) {
          setError(null)
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Briefcase className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Servicios</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Gestiona los servicios que ofrece tu negocio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 uppercase font-medium mb-2">Total de servicios</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-black">{services.length}</p>
            <p className="text-xs sm:text-sm text-gray-500">servicios</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 uppercase font-medium mb-2">Activos</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs sm:text-sm text-gray-500">disponibles</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm sm:col-span-2 md:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600 uppercase font-medium mb-2">Precio promedio</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-black">
              ${activeCount > 0 ? (totalRevenue / activeCount).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message - only show for real errors, not auth in dev */}
      {error && error !== 'No autenticado' && (
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
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <Briefcase className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-black mb-2">No hay servicios</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Crea tu primer servicio para comenzar</p>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Crear servicio
          </button>
        </div>
      ) : (
        /* Services Grid */
        <>
          {/* Create Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Nuevo servicio
              <ChevronRight className="hidden sm:block w-4 h-4" />
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
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
