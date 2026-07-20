import { Button } from '@/components/ui/button';

export default function StaffPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">Personal</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona tu equipo de trabajo</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto justify-center">+ Añadir personal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {[
          { name: 'Carlos Mendoza', role: 'Barbero', status: 'Activo', since: 'Ene 2024', citas: 89 },
          { name: 'Laura Fernández', role: 'Estilista', status: 'Activo', since: 'Mar 2024', citas: 56 },
          { name: 'Miguel Rodríguez', role: 'Barbero', status: 'Activo', since: 'Feb 2024', citas: 45 },
        ].map((member, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-amber-600 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-black truncate">{member.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-2">
                <button className="text-base sm:text-lg text-gray-700 hover:text-amber-600 transition-colors p-1">✏️</button>
                <button className="text-base sm:text-lg text-gray-700 hover:text-red-600 transition-colors p-1">🗑️</button>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-semibold text-green-600">{member.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Miembro desde:</span>
                <span className="font-semibold text-gray-900">{member.since}</span>
              </div>
              <div className="flex justify-between">
                <span>Citas:</span>
                <span className="font-semibold text-gray-900">{member.citas}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-green-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
          <div className="text-2xl sm:text-3xl flex-shrink-0">👥</div>
          <div className="w-full">
            <h3 className="font-bold text-black mb-1 sm:mb-2 text-base sm:text-lg">Invitar personal</h3>
            <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">
              Invita a tus empleados a TurnoPro para que puedan ver y gestionar sus propias citas.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm w-full sm:w-auto">
              Enviar invitación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
