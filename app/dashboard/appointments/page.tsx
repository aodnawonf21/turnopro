'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import CalendarMonth from '@/components/calendar-month'
import AppointmentsList from '@/components/appointments-list'
import AppointmentForm from '@/components/appointment-form'
import { getAppointmentsByDateRange, getAppointmentsByDate, createAppointment, updateAppointment, cancelAppointment, completeAppointment } from '@/app/actions/appointments'
import { getServices } from '@/app/actions/services'
import { getBusinessHours } from '@/app/actions/horarios'

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [appointments, setAppointments] = useState<any[]>([])
  const [dayAppointments, setDayAppointments] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [businessHours, setBusinessHours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize with current date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get current month for calendar
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        const startDate = firstDay.toISOString().split('T')[0]
        const endDate = lastDay.toISOString().split('T')[0]

        // Load all data in parallel
        const [appointmentsRes, servicesRes, hoursRes] = await Promise.all([
          getAppointmentsByDateRange(startDate, endDate),
          getServices(),
          getBusinessHours(),
        ])

        if (appointmentsRes?.data) {
          setAppointments(appointmentsRes.data)
        }
        if (servicesRes?.data) {
          setServices(servicesRes.data)
        }
        if (hoursRes?.data) {
          setBusinessHours(hoursRes.data)
        }
      } catch (err) {
        setError('Error al cargar datos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load appointments for selected date
  useEffect(() => {
    const loadDayAppointments = async () => {
      if (!selectedDate) return

      const result = await getAppointmentsByDate(selectedDate)
      if (result?.data) {
        setDayAppointments(result.data)
      }
    }

    loadDayAppointments()
  }, [selectedDate])

  const handleCreateAppointment = async (data: any) => {
    try {
      const result = await createAppointment({
        ...data,
        service_id: data.service_id,
      })

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Turno creado exitosamente' })
        setShowForm(false)

        // Reload appointments
        const dateResult = await getAppointmentsByDate(selectedDate)
        if (dateResult?.data) {
          setDayAppointments(dateResult.data)
        }

        // Update calendar
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        const allResult = await getAppointmentsByDateRange(
          firstDay.toISOString().split('T')[0],
          lastDay.toISOString().split('T')[0]
        )
        if (allResult?.data) {
          setAppointments(allResult.data)
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleEditAppointment = async (data: any) => {
    if (!editingAppointment) return

    try {
      const result = await updateAppointment(editingAppointment.id, data)

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Turno actualizado' })
        setEditingAppointment(null)
        setShowForm(false)

        const dateResult = await getAppointmentsByDate(selectedDate)
        if (dateResult?.data) {
          setDayAppointments(dateResult.data)
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('¿Confirmar cancelación del turno?')) return

    try {
      const result = await cancelAppointment(id)

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Turno cancelado' })

        const dateResult = await getAppointmentsByDate(selectedDate)
        if (dateResult?.data) {
          setDayAppointments(dateResult.data)
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleCompleteAppointment = async (id: string) => {
    try {
      const result = await completeAppointment(id)

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Turno marcado como completado' })

        const dateResult = await getAppointmentsByDate(selectedDate)
        if (dateResult?.data) {
          setDayAppointments(dateResult.data)
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-bold text-black">Agenda de Turnos</h1>
        </div>
        <p className="text-gray-600">Gestiona todos tus turnos y citas</p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg border p-4 flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Cargando agenda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div>
            <CalendarMonth
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Day view */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day header and create button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black capitalize">{formattedDate}</h2>
                <p className="text-gray-600 text-sm">
                  {dayAppointments.length} {dayAppointments.length === 1 ? 'turno' : 'turnos'} programados
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingAppointment(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo turno
              </button>
            </div>

            {/* Appointments list */}
            <AppointmentsList
              appointments={dayAppointments}
              onEdit={apt => {
                setEditingAppointment(apt)
                setShowForm(true)
              }}
              onCancel={handleCancelAppointment}
              onComplete={handleCompleteAppointment}
            />
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AppointmentForm
          services={services}
          selectedDate={selectedDate}
          appointment={editingAppointment}
          businessHours={businessHours}
          onSubmit={editingAppointment ? handleEditAppointment : handleCreateAppointment}
          onClose={() => {
            setShowForm(false)
            setEditingAppointment(null)
          }}
        />
      )}
    </div>
  )
}
