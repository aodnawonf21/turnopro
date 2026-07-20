'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  appointmentCount: number
}

interface CalendarMonthProps {
  appointments: Array<{ scheduled_date: string }>
  onDateSelect: (date: string) => void
  selectedDate?: string
}

export default function CalendarMonth({
  appointments,
  onDateSelect,
  selectedDate,
}: CalendarMonthProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, number>()
    appointments.forEach(apt => {
      const count = map.get(apt.scheduled_date) || 0
      map.set(apt.scheduled_date, count + 1)
    })
    return map
  }, [appointments])

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: CalendarDay[] = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
        appointmentCount: 0,
      })
    }

    // Current month days
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        appointmentCount: appointmentsByDate.get(dateStr) || 0,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
        appointmentCount: 0,
      })
    }

    return days
  }, [currentDate, appointmentsByDate])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    onDateSelect(dateStr)
  }

  const monthName = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-black capitalize">{monthName}</h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const dateStr = day.date.toISOString().split('T')[0]
          const isSelected = selectedDate === dateStr
          const isClickable = day.isCurrentMonth

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day.date)}
              disabled={!isClickable}
              className={`p-2 text-center rounded-lg transition-colors relative ${
                !isClickable ? 'text-gray-300 cursor-default' : ''
              } ${
                isSelected
                  ? 'bg-amber-600 text-white font-semibold'
                  : day.isToday
                  ? 'border-2 border-amber-600'
                  : 'hover:bg-gray-100'
              } ${!day.isCurrentMonth ? 'text-gray-300' : 'text-black'}`}
            >
              <div className="text-sm">{day.date.getDate()}</div>
              {day.appointmentCount > 0 && (
                <div className={`text-xs font-semibold mt-1 ${
                  isSelected ? 'text-amber-100' : 'text-amber-600'
                }`}>
                  {day.appointmentCount} {day.appointmentCount === 1 ? 'turno' : 'turnos'}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
