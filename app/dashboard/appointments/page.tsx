import { Button } from '@/components/ui/button';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Citas</h1>
          <p className="text-gray-600">Gestiona todas tus citas y reservas</p>
        </div>
        <Button className="bg-accent hover:bg-amber-600 text-white">+ Nueva cita</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white">
            <option>Todos los estados</option>
            <option>Confirmada</option>
            <option>Pendiente</option>
            <option>Cancelada</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Servicio</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Fecha y hora</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Personal</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { client: 'Juan García', service: 'Corte y barba', date: 'Hoy 10:00 AM', staff: 'Carlos', status: 'Confirmada' },
                { client: 'María López', service: 'Peinado', date: 'Hoy 11:30 AM', staff: 'Laura', status: 'Confirmada' },
                { client: 'Carlos Rodríguez', service: 'Corte', date: 'Hoy 2:00 PM', staff: 'Carlos', status: 'Pendiente' },
                { client: 'Ana Martinez', service: 'Tratamiento', date: 'Mañana 10:00 AM', staff: 'Laura', status: 'Confirmada' },
                { client: 'Pedro Sánchez', service: 'Corte', date: 'Mañana 3:00 PM', staff: 'Carlos', status: 'Confirmada' }
              ].map((apt, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900">{apt.client}</td>
                  <td className="py-3 px-4 text-gray-900">{apt.service}</td>
                  <td className="py-3 px-4 text-gray-900">{apt.date}</td>
                  <td className="py-3 px-4 text-gray-900">{apt.staff}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button className="text-accent hover:text-amber-600 font-medium">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
