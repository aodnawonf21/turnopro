import { Button } from '@/components/ui/button';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Personal</h1>
          <p className="text-gray-600">Gestiona tu equipo de trabajo</p>
        </div>
        <Button className="bg-accent hover:bg-amber-600 text-white">+ Añadir personal</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { name: 'Carlos Mendoza', role: 'Barbero', status: 'Activo', since: 'Ene 2024', citas: 89 },
          { name: 'Laura Fernández', role: 'Estilista', status: 'Activo', since: 'Mar 2024', citas: 56 },
          { name: 'Miguel Rodríguez', role: 'Barbero', status: 'Activo', since: 'Feb 2024', citas: 45 },
        ].map((member, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-start flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-700 hover:text-accent transition-colors">✏️</button>
                <button className="text-gray-700 hover:text-red-600 transition-colors">🗑️</button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
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

      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-green-200 p-6">
        <div className="flex gap-4 items-start">
          <div className="text-3xl">👥</div>
          <div>
            <h3 className="font-bold text-black mb-2">Invitar personal</h3>
            <p className="text-gray-700 text-sm mb-4">
              Invita a tus empleados a TurnoPro para que puedan ver y gestionar sus propias citas.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
              Enviar invitación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
