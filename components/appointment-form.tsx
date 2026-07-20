'use client'

import { useState } from 'react'
import { Service } from '@/app/actions/services'
import { X, Plus } from 'lucide-react'

interface AppointmentFormProps {
  services: Service[]
  selectedDate: string
  appointment?: any
  businessHours?: Array<{
    day_of_week: number
    opening_time: string
    closing_time: string
  }>
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
}

export default function AppointmentForm({
  services,
  selectedDate,
  appointment,
  businessHours,
  onSubmit,
  onClose,
}: AppointmentFormProps) {
  console.log("[v0] AppointmentForm rendered");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    client_name: appointment?.client_name || '',
    client_phone: appointment?.client_phone || '',
    client_email: appointment?.client_email || '',
    service_id: appointment?.service_id || '',
    scheduled_date: appointment?.scheduled_date || selectedDate,
    start_time: appointment?.start_time || '09:00',
    notes: appointment?.notes || '',
  })

  const selectedService = services.find(s => s.id === formData.service_id)

  // Get business hours for selected day
  const dayOfWeek = new Date(formData.scheduled_date + 'T00:00:00').getDay()
  const hoursForDay = businessHours?.find(h => h.day_of_week === dayOfWeek)

  const generateTimeSlots = () => {
    if (!hoursForDay) return []

    const slots: string[] = []
    const [startHour, startMin] = hoursForDay.opening_time.split(':').map(Number)
    const [endHour, endMin] = hoursForDay.closing_time.split(':').map(Number)

    let current = new Date()
    current.setHours(startHour, startMin, 0)
    const end = new Date()
    end.setHours(endHour, endMin, 0)

    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5))
      current.setMinutes(current.getMinutes() + 30)
    }

    return slots
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.client_name) {
        setError('El nombre del cliente es requerido')
        return
      }
      if (!formData.service_id) {
        setError('Debes seleccionar un servicio')
        return
      }

      await onSubmit(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el turno')
    } finally {
      setLoading(false)
    }
  }

  const activeServices = services.filter(s => s.is_active)
  const timeSlots = generateTimeSlots()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">
            {appointment ? 'Editar turno' : 'Nuevo turno'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Información del cliente</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del cliente
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.client_phone}
                  onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="+54 9 1234 5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.client_email}
                  onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="juan@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Service & Time */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Servicio y horario</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio
              </label>
              <select
                value={formData.service_id}
                onChange={e => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Selecciona un servicio</option>
                {activeServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price.toFixed(2)} ({service.duration}min)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de inicio
                </label>
                <select
                  value={formData.start_time}
                  onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecciona una hora</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {selectedService ? `${selectedService.duration} min` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Agregar notas sobre el turno..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Guardando...' : appointment ? 'Actualizar' : 'Crear turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
