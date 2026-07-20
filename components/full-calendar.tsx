'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useCallback } from 'react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  extendedProps: {
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    clientName: string
    clientPhone?: string
    clientEmail?: string
    notes?: string
    serviceId: string
  }
}

interface FullCalendarProps {
  events: CalendarEvent[]
  onDateSelect: (date: string) => void
  onEventClick: (event: CalendarEvent) => void
  onEventDrop?: (event: any) => void
  onEventResize?: (event: any) => void
  onViewChange?: (view: 'month' | 'week' | 'day') => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FBBF24'
    case 'confirmed':
      return '#3B82F6'
    case 'completed':
      return '#10B981'
    case 'cancelled':
      return '#EF4444'
    default:
      return '#FBBF24'
  }
}

export default function FullCalendarComponent({
  events,
  onDateSelect,
  onEventClick,
  onEventDrop,
  onEventResize,
  onViewChange,
}: FullCalendarProps) {
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth')

  const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setView(view)
    if (view === 'dayGridMonth') onViewChange?.('month')
    if (view === 'timeGridWeek') onViewChange?.('week')
    if (view === 'timeGridDay') onViewChange?.('day')
  }

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.extendedProps.clientName,
    start: `${event.start}T${event.start.split('T')[1] || '00:00:00'}`,
    end: event.end,
    backgroundColor: getStatusColor(event.extendedProps.status),
    borderColor: getStatusColor(event.extendedProps.status),
    extendedProps: event.extendedProps,
  }))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleViewChange('dayGridMonth')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'dayGridMonth'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => handleViewChange('timeGridWeek')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'timeGridWeek'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => handleViewChange('timeGridDay')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'timeGridDay'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Día
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={calendarEvents}
        dateClick={info => onDateSelect(info.dateStr)}
        eventClick={info => {
          const event = events.find(e => e.id === info.event.id)
          if (event) onEventClick(event)
        }}
        editable={true}
        eventDrop={info => onEventDrop?.(info)}
        eventResize={info => onEventResize?.(info)}
        height="auto"
        locale="es"
      />
    </div>
  )
}
