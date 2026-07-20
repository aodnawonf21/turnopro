'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Calendar, Plus, AlertCircle, CheckCircle, X, CheckCheck, XCircle, Edit2 } from 'lucide-react'
import AppointmentForm from '@/components/appointment-form'
import { getAppointmentsByDateRange, getAppointmentsByDate, createAppointment, updateAppointment, cancelAppointment, completeAppointment } from '@/app/actions/appointments'
import { getServices } from '@/app/actions/services'
import { getBusinessHours } from '@/app/actions/horarios'

const FullCalendarComponent = dynamic(() => import('@/components/full-calendar'), { ssr: false })

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [businessHours, setBusinessHours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')



  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        const startDate = firstDay.toISOString().split('T')[0]
        const endDate = lastDay.toISOString().split('T')[0]

        const [appointmentsRes, servicesRes, hoursRes] = await Promise.all([
          getAppointmentsByDateRange(startDate, endDate),
          getServices(),
          getBusinessHours(),
        ])

        if (appointmentsRes?.data) setAppointments(appointmentsRes.data)
        if (servicesRes?.data) setServices(servicesRes.data)
        if (hoursRes?.data) setBusinessHours(hoursRes.data)
      } catch (err) {
        setError('Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const reloadAppointments = async () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const result = await getAppointmentsByDateRange(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    )
    if (result?.data) setAppointments(result.data)
  }

  const handleCreateAppointment = async (data: any) => {
    const result = await createAppointment(data)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Turno creado exitosamente' })
      setShowForm(false)
      await reloadAppointments()
    }
  }

  const handleEditAppointment = async (data: any) => {
    if (!editingAppointment) return
    const result = await updateAppointment(editingAppointment.id, data)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Turno actualizado' })
      setEditingAppointment(null)
      setSelectedAppointment(null)
      setShowForm(false)
      await reloadAppointments()
    }
  }

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('¿Confirmar cancelación del turno?')) return
    const result = await cancelAppointment(id)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Turno cancelado' })
      setSelectedAppointment(null)
      await reloadAppointments()
    }
  }

  const handleCompleteAppointment = async (id: string) => {
    const result = await completeAppointment(id)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Turno marcado como completado' })
      setSelectedAppointment(null)
      await reloadAppointments()
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      completed: 'Completado',
      cancelled: 'Cancelado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const calendarEvents = appointments.map(apt => ({
    id: apt.id,
    title: apt.client_name,
    start: `${apt.scheduled_date}T${apt.start_time}`,
    end: `${apt.scheduled_date}T${apt.end_time}`,
    extendedProps: {
      status: apt.status,
      clientName: apt.client_name,
      clientPhone: apt.client_phone,
      clientEmail: apt.client_email,
      notes: apt.notes,
      serviceId: apt.service_id,
      serviceName: apt.service?.name,
    },
  }))

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Agenda de Turnos</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Gestiona todos tus turnos y citas</p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg border p-3 sm:p-4 flex items-start gap-2 sm:gap-3 text-xs sm:text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-600 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-gray-600">Cargando agenda...</p>
        </div>
      ) : (
        <>
          {/* Calendar - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block">
            <FullCalendarComponent
              events={calendarEvents}
              onDateSelect={date => {
                setEditingAppointment(null)
                setShowForm(true)
              }}
              onEventClick={event => {
                const appointment = appointments.find(a => a.id === event.id)
                if (appointment) setSelectedAppointment(appointment)
              }}
              onViewChange={setView}
            />
          </div>

          {/* Mobile Agenda List */}
          <div className="md:hidden space-y-3 sm:space-y-4">

          {/* Appointment Details Modal */}
          {selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-black">Detalles del Turno</h2>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Cliente</p>
                      <p className="text-sm font-medium text-black">{selectedAppointment.client_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Estado</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusLabel(selectedAppointment.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Teléfono</p>
                      <p className="text-sm text-gray-700">{selectedAppointment.client_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Email</p>
                      <p className="text-sm text-gray-700">{selectedAppointment.client_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Fecha</p>
                      <p className="text-sm text-gray-700">{new Date(selectedAppointment.scheduled_date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Horario</p>
                      <p className="text-sm text-gray-700">{selectedAppointment.start_time} - {selectedAppointment.end_time}</p>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Notas</p>
                      <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                  {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingAppointment(selectedAppointment)
                          setShowForm(true)
                          setSelectedAppointment(null)
                        }}
                        className="flex items-center gap-2 flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleCompleteAppointment(selectedAppointment.id)
                        }}
                        className="flex items-center gap-2 flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Completar
                      </button>
                      <button
                        onClick={() => {
                          handleCancelAppointment(selectedAppointment.id)
                        }}
                        className="flex items-center gap-2 flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Button to create appointment */}
          <div className="flex justify-end" style={{ pointerEvents: 'auto' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setEditingAppointment(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Turno
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <AppointmentForm
              services={services}
              selectedDate={new Date().toISOString().split('T')[0]}
              appointment={editingAppointment}
              businessHours={businessHours}
              onSubmit={editingAppointment ? handleEditAppointment : handleCreateAppointment}
              onClose={() => {
                setShowForm(false)
                setEditingAppointment(null)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
