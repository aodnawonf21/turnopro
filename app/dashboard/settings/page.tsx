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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Configuración</h1>
        <p className="text-gray-600">Personaliza tu negocio y preferencias</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
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
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-accent text-black'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Info Settings */}
      {activeTab === 'business-info' && (
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-black mb-4">Logo del negocio</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {businessData.logo ? (
                  <img src={businessData.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-xs text-gray-500">Logo</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-2 block">
                  Subir logo
                </button>
                <p className="text-sm text-gray-500">PNG, JPG o GIF. Máximo 2MB. Recomendado: 500x500px</p>
              </div>
            </div>
          </div>

          {/* Business Info Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-black mb-4">Información del negocio</h2>
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del negocio</label>
              <input
                type="text"
                value={businessData.name}
                onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                placeholder="Ej: Mi Barbería"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
              <input
                type="tel"
                value={businessData.whatsapp}
                onChange={(e) => setBusinessData({ ...businessData, whatsapp: e.target.value })}
                placeholder="Ej: +34 666 777 888"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                value={businessData.address}
                onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                placeholder="Ej: Calle Principal 123, Madrid"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Social Networks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-black mb-4">Redes sociales</h2>
            
            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">@</span>
                <input
                  type="text"
                  value={businessData.instagram}
                  onChange={(e) => setBusinessData({ ...businessData, instagram: e.target.value })}
                  placeholder="mibarber"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                value={businessData.facebook}
                onChange={(e) => setBusinessData({ ...businessData, facebook: e.target.value })}
                placeholder="MiBarberiaOficial"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">TikTok</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">@</span>
                <input
                  type="text"
                  value={businessData.tiktok}
                  onChange={(e) => setBusinessData({ ...businessData, tiktok: e.target.value })}
                  placeholder="mibarber"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-accent hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
              Guardar cambios
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Nombre del negocio</label>
            <input
              type="text"
              defaultValue="Mi Barbería"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Email de contacto</label>
            <input
              type="email"
              defaultValue="contacto@mibarber.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Teléfono</label>
            <input
              type="tel"
              defaultValue="+34 666 777 888"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">Guardar cambios</Button>
        </div>
      )}

      {/* Business Settings */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Dirección</label>
            <input
              type="text"
              defaultValue="Calle Principal 123, Madrid"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Horario de apertura</label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Horario de cierre</label>
              <input
                type="time"
                defaultValue="19:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Duración de cita por defecto (minutos)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">Guardar cambios</Button>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-black">Recordatorios por email</div>
              <div className="text-sm text-gray-600">Recibe recordatorios de citas próximas</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-black">Recordatorios por SMS</div>
              <div className="text-sm text-gray-600">Envía recordatorios a tus clientes</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-black">Nuevas citas</div>
              <div className="text-sm text-gray-600">Notificaciones cuando se reserve una cita</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">Guardar cambios</Button>
        </div>
      )}

      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-accent rounded-lg p-6">
            <h3 className="font-bold text-black mb-2">Plan Starter</h3>
            <p className="text-gray-600 text-sm mb-4">$9/mes • 50 citas al mes</p>
            <Button className="bg-accent hover:bg-amber-600 text-white mb-4">Actualizar plan</Button>
            <p className="text-xs text-gray-500">Próximo pago: 15 de Agosto, 2024</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-black mb-4">Historial de pagos</h3>
            <div className="space-y-3 text-sm">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-black mb-4">Cambiar contraseña</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Contraseña actual</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 text-white">Actualizar contraseña</Button>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-black mb-4">Sesiones activas</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-black">Esta sesión</div>
                <div className="text-sm text-gray-600">Navegador • Última actividad ahora</div>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
