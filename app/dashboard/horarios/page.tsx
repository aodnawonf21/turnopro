'use client';

import { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';

interface DaySchedule {
  day: string;
  dayName: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  interval: string;
}

const initialDays: DaySchedule[] = [
  { day: 'monday', dayName: 'Lunes', isActive: true, openTime: '09:00', closeTime: '18:00', interval: '30' },
  { day: 'tuesday', dayName: 'Martes', isActive: true, openTime: '09:00', closeTime: '18:00', interval: '30' },
  { day: 'wednesday', dayName: 'Miércoles', isActive: true, openTime: '09:00', closeTime: '18:00', interval: '30' },
  { day: 'thursday', dayName: 'Jueves', isActive: true, openTime: '09:00', closeTime: '18:00', interval: '30' },
  { day: 'friday', dayName: 'Viernes', isActive: true, openTime: '09:00', closeTime: '18:00', interval: '30' },
  { day: 'saturday', dayName: 'Sábado', isActive: false, openTime: '10:00', closeTime: '14:00', interval: '30' },
  { day: 'sunday', dayName: 'Domingo', isActive: false, openTime: '10:00', closeTime: '14:00', interval: '30' },
];

export default function HorariosPage() {
  const [schedules, setSchedules] = useState<DaySchedule[]>(initialDays);

  const toggleDay = (index: number) => {
    const updated = [...schedules];
    updated[index].isActive = !updated[index].isActive;
    setSchedules(updated);
  };

  const updateTime = (index: number, field: 'openTime' | 'closeTime' | 'interval', value: string) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSave = () => {
    console.log('Horarios guardados:', schedules);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-bold text-black">Horarios</h1>
        </div>
        <p className="text-gray-600">Configura los horarios de apertura y cierre para cada día de la semana</p>
      </div>

      {/* Main Schedule Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-black">Jornada laboral</h2>
        </div>

        {/* Schedule Items */}
        <div className="divide-y divide-gray-200">
          {schedules.map((schedule, index) => (
            <div key={schedule.day} className="px-6 py-5 hover:bg-gray-50 transition-colors">
              {/* Day Header with Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-black">{schedule.dayName}</h3>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleDay(index)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    schedule.isActive ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      schedule.isActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Time Input Fields - Only show when active */}
              {schedule.isActive && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-0">
                  {/* Opening Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Apertura</label>
                    <input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => updateTime(index, 'openTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Closing Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cierre</label>
                    <input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) => updateTime(index, 'closeTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Interval */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Intervalo (min)</label>
                    <select
                      value={schedule.interval}
                      onChange={(e) => updateTime(index, 'interval', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                      <option value="90">90 minutos</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Disabled State Message */}
              {!schedule.isActive && (
                <div className="text-sm text-gray-500 italic">
                  Día no disponible
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
        <h3 className="font-semibold text-black mb-3">Resumen de horarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Días disponibles</p>
            <p className="text-2xl font-bold text-black">
              {schedules.filter((s) => s.isActive).length} días
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Horario promedio</p>
            <p className="text-2xl font-bold text-black">09:00 - 18:00</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Intervalo estándar</p>
            <p className="text-2xl font-bold text-black">30 min</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Descartar
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          Guardar cambios
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
