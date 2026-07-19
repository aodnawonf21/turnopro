import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Calendario</h1>
        <p className="text-gray-600">Visualiza todas tus citas en un calendario interactivo</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-black mb-2">Calendario disponible</h2>
        <p className="text-gray-600 mb-6">Esta sección mostrará un calendario interactivo con todas tus citas</p>
        <div className="inline-block bg-gradient-to-br from-amber-50 to-white rounded-lg border-2 border-accent p-6 text-left">
          <p className="text-sm text-gray-700 mb-4">
            El calendario te permitirá:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Ver todas tus citas en una vista diaria, semanal o mensual</li>
            <li>✓ Arrastrar y soltar citas para reorganizarlas</li>
            <li>✓ Ver detalles de cada cita haciendo clic</li>
            <li>✓ Filtrar por servicio, cliente o personal</li>
            <li>✓ Imprimir o descargar tu calendario</li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-7 gap-2 bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-center font-bold text-gray-700 text-sm py-2">Dom</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Lun</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Mar</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Mié</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Jue</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Vie</div>
        <div className="text-center font-bold text-gray-700 text-sm py-2">Sáb</div>

        {Array.from({ length: 35 }).map((_, idx) => (
          <div key={idx} className="aspect-square bg-gray-50 rounded border border-gray-200 p-2 flex items-center justify-center text-sm text-gray-400">
            {idx < 28 ? idx + 1 : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
