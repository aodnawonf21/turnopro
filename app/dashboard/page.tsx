'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PlanCard from '@/components/plan-card';
import { useState } from 'react';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([
    { id: 1, time: '09:00', client: 'Juan García', service: 'Corte y barba', status: 'Confirmada', staff: 'Carlos' },
    { id: 2, time: '10:15', client: 'María López', service: 'Peinado', status: 'Confirmada', staff: 'Ana' },
    { id: 3, time: '11:30', client: 'Carlos Rodríguez', service: 'Corte', status: 'Pendiente', staff: 'Carlos' },
    { id: 4, time: '13:00', client: 'Ana Martinez', service: 'Tratamiento', status: 'Confirmada', staff: 'María' },
    { id: 5, time: '14:30', client: 'Pedro Sánchez', service: 'Barba', status: 'Confirmada', staff: 'Carlos' },
    { id: 6, time: '15:45', client: 'Rosa González', service: 'Peinado y corte', status: 'Pendiente', staff: 'Ana' }
  ]);

  const todayAppointments = appointments.length;
  const weekAppointments = todayAppointments * 6;
  const totalClients = 42;
  const revenue = 3450;

  const handleCancel = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Hoy</h1>
          <p className="text-gray-600">Aquí está tu agenda del día</p>
        </div>
        <div className="w-64">
          <PlanCard />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 mb-1">Turnos de hoy</div>
          <div className="text-3xl font-bold text-black mb-2">{todayAppointments}</div>
          <div className="text-xs text-gray-500">Citas programadas</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 mb-1">Turnos esta semana</div>
          <div className="text-3xl font-bold text-black mb-2">{weekAppointments}</div>
          <div className="text-xs text-gray-500">7 días completos</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 mb-1">Clientes</div>
          <div className="text-3xl font-bold text-black mb-2">{totalClients}</div>
          <div className="text-xs text-gray-500">Clientes activos</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-medium text-gray-600 mb-1">Ingresos</div>
          <div className="text-3xl font-bold text-black mb-2">${revenue}</div>
          <div className="text-xs text-gray-500">Este mes</div>
        </div>
      </div>

      {/* Agenda del día */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Agenda del día</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Personal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, idx) => (
                <tr key={apt.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black">{apt.time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{apt.client}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{apt.service}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm">{apt.staff}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'Confirmada' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Ver
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Editar
                      </button>
                      <button 
                        onClick={() => handleCancel(apt.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No hay turnos programados para hoy</p>
            <Link href="/dashboard/appointments">
              <Button className="bg-accent hover:bg-amber-600 text-white">
                Crear nuevo turno
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Ocupación hoy</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">85%</span>
            <span className="text-green-600 text-sm font-medium">+5% vs ayer</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">Ingresos hoy</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">$580</span>
            <span className="text-green-600 text-sm font-medium">+12% vs promedio</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-2">Clientes nuevos</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">3</span>
            <span className="text-green-600 text-sm font-medium">Esta semana</span>
          </div>
        </div>
      </div>
    </div>
  );
}
