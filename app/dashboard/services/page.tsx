'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  status: 'active' | 'inactive';
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Corte', price: 15, duration: 30, description: 'Corte de cabello clásico', status: 'active' },
    { id: 2, name: 'Barba', price: 10, duration: 20, description: 'Arreglo de barba y bigote', status: 'active' },
    { id: 3, name: 'Corte y barba', price: 25, duration: 50, description: 'Corte completo con arreglo de barba', status: 'active' },
    { id: 4, name: 'Peinado', price: 20, duration: 45, description: 'Peinado y estilismo profesional', status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setFormData({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration.toString(),
        description: service.description
      });
      setEditingId(service.id);
    } else {
      setFormData({ name: '', price: '', duration: '', description: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: '', duration: '', description: '' });
  };

  const handleSaveService = () => {
    if (!formData.name || !formData.price || !formData.duration) return;

    if (editingId) {
      setServices(services.map(s =>
        s.id === editingId
          ? {
              ...s,
              name: formData.name,
              price: parseFloat(formData.price),
              duration: parseInt(formData.duration),
              description: formData.description
            }
          : s
      ));
    } else {
      const newService: Service = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        name: formData.name,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description,
        status: 'active'
      };
      setServices([...services, newService]);
    }

    handleCloseModal();
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Servicios</h1>
          <p className="text-gray-600">Gestiona los servicios que ofrece tu negocio</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> Nuevo Servicio
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Duración</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={service.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-black">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black">${service.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{service.duration} min</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {service.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {services.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No hay servicios registrados</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-accent hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Crear primer servicio
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">
                {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Corte de cabello"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duración (minutos)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe este servicio..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-2 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveService}
                className="px-4 py-2 bg-accent hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
