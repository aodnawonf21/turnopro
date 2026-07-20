'use client'

import { Appointment } from '@/app/actions/appointments'
import { Clock, User, CheckCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react'

interface AppointmentsListProps {
  appointments: any[]
  onEdit: (appointment: any) => void
  onCancel: (id: string) => void
  onComplete: (id: string) => void
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  completed: {
    label: 'Completado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
  },
}

export default function AppointmentsList({
  appointments,
  onEdit,
  onCancel,
  onComplete,
}: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-black mb-2">Sin turnos</h3>
        <p className="text-gray-600">No hay turnos programados para este día</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map(appointment => {
        const status = appointment.status as keyof typeof statusConfig
        const config = statusConfig[status] || statusConfig.pending
        const StatusIcon = config.icon

        return (
          <div
            key={appointment.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <h4 className="font-semibold text-black">{appointment.client_name}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {appointment.start_time} - {appointment.end_time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{appointment.service?.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>

            {appointment.notes && (
              <p className="text-sm text-gray-600 mb-3 italic">{appointment.notes}</p>
            )}

            <div className="flex gap-2 justify-end">
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => onEdit(appointment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => onComplete(appointment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(appointment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
