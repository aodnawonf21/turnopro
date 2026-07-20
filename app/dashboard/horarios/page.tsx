'use client'

import { useEffect, useState } from 'react'
import { Clock, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'
import { getBusinessHours, saveBusinessHours, type BusinessHour } from '@/app/actions/horarios'

interface DayDisplay {
  dayOfWeek: number
  dayName: string
  isActive: boolean
  openingTime: string
  closingTime: string
}

const DAYS: DayDisplay[] = [
  { dayOfWeek: 1, dayName: 'Lunes', isActive: true, openingTime: '09:00', closingTime: '18:00' },
  { dayOfWeek: 2, dayName: 'Martes', isActive: true, openingTime: '09:00', closingTime: '18:00' },
  { dayOfWeek: 3, dayName: 'Miércoles', isActive: true, openingTime: '09:00', closingTime: '18:00' },
  { dayOfWeek: 4, dayName: 'Jueves', isActive: true, openingTime: '09:00', closingTime: '18:00' },
  { dayOfWeek: 5, dayName: 'Viernes', isActive: true, openingTime: '09:00', closingTime: '18:00' },
  { dayOfWeek: 6, dayName: 'Sábado', isActive: false, openingTime: '10:00', closingTime: '14:00' },
  { dayOfWeek: 0, dayName: 'Domingo', isActive: false, openingTime: '10:00', closingTime: '14:00' },
]

export default function HorariosPage() {
  const [schedules, setSchedules] = useState<DayDisplay[]>(DAYS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const loadHours = async () => {
      const result = await getBusinessHours()
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result.data) {
        // Map database hours to display
        const updatedSchedules = DAYS.map(day => {
          const dbHour = result.data.find((h: BusinessHour) => h.day_of_week === day.dayOfWeek)
          if (dbHour) {
            return {
              dayOfWeek: dbHour.day_of_week,
              dayName: day.dayName,
              isActive: dbHour.is_active,
              openingTime: dbHour.opening_time,
              closingTime: dbHour.closing_time,
            }
          }
          return day
        })
        setSchedules(updatedSchedules)
      }
      setLoading(false)
    }

    loadHours()
  }, [])

  const toggleDay = (dayOfWeek: number) => {
    const updated = schedules.map(s =>
      s.dayOfWeek === dayOfWeek ? { ...s, isActive: !s.isActive } : s
    )
    setSchedules(updated)
  }

  const updateTime = (dayOfWeek: number, field: 'openingTime' | 'closingTime', value: string) => {
    const updated = schedules.map(s =>
      s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
    )
    setSchedules(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    // Validate
    for (const schedule of schedules) {
      if (schedule.isActive && schedule.openingTime >= schedule.closingTime) {
        setMessage({
          type: 'error',
          text: `${schedule.dayName}: La hora de apertura debe ser menor a la de cierre`,
        })
        setSaving(false)
        return
      }
    }

    const hours: BusinessHour[] = schedules.map(s => ({
      business_id: '', // Will be set by server action
      day_of_week: s.dayOfWeek,
      is_active: s.isActive,
      opening_time: s.openingTime,
      closing_time: s.closingTime,
    }))

    const result = await saveBusinessHours(hours)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Horarios guardados correctamente' })
      setTimeout(() => setMessage(null), 3000)
    }
    setSaving(false)
  }

  const handleDiscard = () => {
    setMessage(null)
    const reloadHours = async () => {
      const result = await getBusinessHours()
      if (result.data) {
        const updatedSchedules = DAYS.map(day => {
          const dbHour = result.data.find((h: BusinessHour) => h.day_of_week === day.dayOfWeek)
          if (dbHour) {
            return {
              dayOfWeek: dbHour.day_of_week,
              dayName: day.dayName,
              isActive: dbHour.is_active,
              openingTime: dbHour.opening_time,
              closingTime: dbHour.closing_time,
            }
          }
          return day
        })
        setSchedules(updatedSchedules)
      }
    }
    reloadHours()
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Horarios</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Configura los horarios de apertura y cierre para cada día de la semana</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-gray-600">Cargando horarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Horarios</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Configura los horarios de apertura y cierre para cada día de la semana</p>
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

      {/* Main Schedule Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-black">Jornada laboral</h2>
        </div>

        {/* Schedule Items */}
        <div className="divide-y divide-gray-200">
          {schedules.map(schedule => (
            <div key={schedule.dayOfWeek} className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors">
              {/* Day Header with Toggle */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-black">{schedule.dayName}</h3>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleDay(schedule.dayOfWeek)}
                  className={`relative inline-flex h-6 sm:h-7 w-10 sm:w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                    schedule.isActive ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 sm:h-6 w-5 sm:w-6 transform rounded-full bg-white transition-transform ${
                      schedule.isActive ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Time Input Fields - Only show when active */}
              {schedule.isActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-0">
                  {/* Opening Time */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Apertura</label>
                    <input
                      type="time"
                      value={schedule.openingTime}
                      onChange={e => updateTime(schedule.dayOfWeek, 'openingTime', e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Closing Time */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Cierre</label>
                    <input
                      type="time"
                      value={schedule.closingTime}
                      onChange={e => updateTime(schedule.dayOfWeek, 'closingTime', e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Disabled State Message */}
              {!schedule.isActive && (
                <div className="text-xs sm:text-sm text-gray-500 italic">
                  Día no disponible
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4 sm:p-6">
        <h3 className="font-semibold text-black mb-2 sm:mb-3 text-sm sm:text-base">Resumen de horarios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Días disponibles</p>
            <p className="text-xl sm:text-2xl font-bold text-black">
              {schedules.filter(s => s.isActive).length} días
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Horario más común</p>
            <p className="text-xl sm:text-2xl font-bold text-black">
              {schedules.filter(s => s.isActive).length > 0
                ? `${schedules.filter(s => s.isActive)[0].openingTime} - ${schedules.filter(s => s.isActive)[0].closingTime}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
        <button
          onClick={handleDiscard}
          disabled={saving}
          className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Descartar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar horarios'}
          <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 hidden sm:block" />
        </button>
      </div>
    </div>
  )
}
