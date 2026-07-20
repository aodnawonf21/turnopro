'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business-info');
  const [businessData, setBusinessData] = useState({
    logo: null as string | null,
    name: 'Mi Barbería',
    whatsapp: '+34 666 777 888',
    address: 'Calle Principal 123, Madrid',
    instagram: '@mibarber',
    facebook: 'MiBarberiaOficial',
    tiktok: '@mibarber'
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">Configuración</h1>
        <p className="text-sm sm:text-base text-gray-600">Personaliza tu negocio y preferencias</p>
      </div>

      <div className="flex gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto pb-0">
        {[
          { id: 'business-info', label: 'Información del negocio' },
          { id: 'general', label: 'General' },
          { id: 'business', label: 'Negocio' },
          { id: 'notifications', label: 'Notificaciones' },
          { id: 'billing', label: 'Facturación' },
          { id: 'security', label: 'Seguridad' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-600 text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Info Settings */}
      {activeTab === 'business-info' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-xl font-bold text-black mb-3 sm:mb-4">Logo del negocio</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-24 sm:w-32 h-24 sm:h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                {businessData.logo ? (
                  <img src={businessData.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-1">📸</div>
                    <div className="text-xs text-gray-500">Logo</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors mb-2">
                  Subir logo
                </button>
                <p className="text-xs sm:text-sm text-gray-500">PNG, JPG o GIF. Máximo 2MB. Recomendado: 500x500px</p>
              </div>
            </div>
          </div>

          {/* Business Info Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-xl font-bold text-black mb-3 sm:mb-4">Información del negocio</h2>
            
            {/* Nombre */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Nombre del negocio</label>
              <input
                type="text"
                value={businessData.name}
                onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                placeholder="Ej: Mi Barbería"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
              <input
                type="tel"
                value={businessData.whatsapp}
                onChange={(e) => setBusinessData({ ...businessData, whatsapp: e.target.value })}
                placeholder="Ej: +34 666 777 888"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                value={businessData.address}
                onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                placeholder="Ej: Calle Principal 123, Madrid"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>
          </div>

          {/* Social Networks */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-xl font-bold text-black mb-3 sm:mb-4">Redes sociales</h2>
            
            {/* Instagram */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 flex-shrink-0">@</span>
                <input
                  type="text"
                  value={businessData.instagram}
                  onChange={(e) => setBusinessData({ ...businessData, instagram: e.target.value })}
                  placeholder="mibarber"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                value={businessData.facebook}
                onChange={(e) => setBusinessData({ ...businessData, facebook: e.target.value })}
                placeholder="MiBarberiaOficial"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">TikTok</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 flex-shrink-0">@</span>
                <input
                  type="text"
                  value={businessData.tiktok}
                  onChange={(e) => setBusinessData({ ...businessData, tiktok: e.target.value })}
                  placeholder="mibarber"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors h-10 sm:h-auto">
              Guardar cambios
            </button>
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors h-10 sm:h-auto">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">Nombre del negocio</label>
            <input
              type="text"
              defaultValue="Mi Barbería"
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">Email de contacto</label>
            <input
              type="email"
              defaultValue="contacto@mibarber.com"
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">Teléfono</label>
            <input
              type="tel"
              defaultValue="+34 666 777 888"
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
            />
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">Guardar cambios</Button>
        </div>
      )}

      {/* Business Settings */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">Dirección</label>
            <input
              type="text"
              defaultValue="Calle Principal 123, Madrid"
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-2">Horario de apertura</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-black mb-2">Horario de cierre</label>
              <input
                type="time"
                defaultValue="19:00"
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-black mb-2">Duración de cita por defecto (minutos)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
            />
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">Guardar cambios</Button>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base text-black">Recordatorios por email</div>
              <div className="text-xs sm:text-sm text-gray-600">Recibe recordatorios de citas próximas</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 flex-shrink-0 ml-2" />
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base text-black">Recordatorios por SMS</div>
              <div className="text-xs sm:text-sm text-gray-600">Envía recordatorios a tus clientes</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 flex-shrink-0 ml-2" />
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base text-black">Nuevas citas</div>
              <div className="text-xs sm:text-sm text-gray-600">Notificaciones cuando se reserve una cita</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 flex-shrink-0 ml-2" />
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">Guardar cambios</Button>
        </div>
      )}

      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-600 rounded-lg p-4 sm:p-6">
            <h3 className="font-bold text-black mb-1 sm:mb-2 text-sm sm:text-base">Plan Starter</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">$9/mes • 50 citas al mes</p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white mb-3 sm:mb-4 w-full sm:w-auto text-sm">Actualizar plan</Button>
            <p className="text-xs text-gray-500">Próximo pago: 15 de Agosto, 2024</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-bold text-black mb-3 sm:mb-4 text-sm sm:text-base">Historial de pagos</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">15 de Julio, 2024</span>
                <span className="text-gray-900 font-medium">$9.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">15 de Junio, 2024</span>
                <span className="text-gray-900 font-medium">$9.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="font-bold text-black mb-3 sm:mb-4 text-sm sm:text-base">Cambiar contraseña</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black mb-2">Contraseña actual</label>
                <input
                  type="password"
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 sm:h-auto"
                />
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">Actualizar contraseña</Button>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="font-bold text-black mb-3 sm:mb-4 text-sm sm:text-base">Sesiones activas</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
              <div className="min-w-0">
                <div className="font-medium text-sm sm:text-base text-black">Esta sesión</div>
                <div className="text-xs sm:text-sm text-gray-600">Navegador • Última actividad ahora</div>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-xs sm:text-sm w-full sm:w-auto">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
