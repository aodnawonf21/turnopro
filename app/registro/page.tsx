'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signUp } from '@/app/actions/auth';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.businessName || !formData.email || !formData.password || !formData.businessType) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Por favor ingresa un email válido');
        return;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (!formData.acceptTerms) {
        setError('Debes aceptar los términos y condiciones');
        return;
      }

      const result = await signUp({
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
        businessType: formData.businessType,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-3xl font-bold text-black hover:text-gray-700 transition-colors">
            TurnoPro
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600">Comienza a gestionar tus citas en 2 minutos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Nombre del negocio</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Ej: Mi Barbería"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Tipo de negocio</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
            >
              <option value="">Selecciona una opción</option>
              <option value="barbershop">Barbería</option>
              <option value="salon">Salón de belleza</option>
              <option value="spa">Spa</option>
              <option value="nails">Uñas</option>
              <option value="fitness">Gimnasio</option>
              <option value="medical">Consultorio médico</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Confirma tu contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Acepto los{' '}
              <a href="#" className="text-accent hover:text-amber-600 font-medium">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-accent hover:text-amber-600 font-medium">
                política de privacidad
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-amber-600 text-white py-3"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-accent hover:text-amber-600 font-semibold transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-xs">
            Protegido por encriptación de nivel empresarial
          </p>
        </div>
      </div>
    </div>
  );
}
