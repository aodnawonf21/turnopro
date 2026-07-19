'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2024-07-23');
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const services = [
    { id: 1, name: 'Corte', price: 15, duration: 30 },
    { id: 2, name: 'Barba', price: 10, duration: 20 },
    { id: 3, name: 'Corte y barba', price: 25, duration: 50 },
    { id: 4, name: 'Peinado', price: 20, duration: 45 },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
  ];

  // Generate next 7 days
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const day = days[date.getDay()];
    const dayNum = date.getDate();
    return `${day}, ${dayNum}`;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setBookingConfirmed(true);
      setTimeout(() => {
        setBookingConfirmed(false);
        setFormData({ name: '', phone: '' });
      }, 3000);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">¡Reserva confirmada!</h1>
          <p className="text-gray-600 mb-6">
            Tu turno ha sido registrado correctamente. Recibirás una confirmación por SMS al número que ingresaste.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Servicio:</span>
              <span className="font-semibold text-black">{services.find(s => s.id === selectedService)?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-semibold text-black">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hora:</span>
              <span className="font-semibold text-black">{selectedTime}</span>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-accent hover:bg-amber-600 text-white py-3 rounded-lg font-semibold"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">TurnoPro</h1>
              <p className="text-sm text-gray-600">Tu barbería/salón de confianza</p>
            </div>
          </div>
          <p className="text-gray-600">Agenda tu turno en línea de forma rápida y fácil</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services and Calendar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">1. Selecciona un servicio</h2>
              <div className="grid grid-cols-2 gap-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedService === service.id
                        ? 'border-accent bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-black">{service.name}</div>
                    <div className="text-sm text-gray-600 mt-1">${service.price} • {service.duration} min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">2. Elige una fecha</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getDates().map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-3 rounded-lg border-2 whitespace-nowrap transition-all font-medium ${
                      selectedDate === date
                        ? 'border-accent bg-amber-50 text-black'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">3. Selecciona una hora</h2>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`py-2 rounded-lg font-medium transition-all ${
                      !slot.available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-accent text-white border-2 border-accent'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-accent'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary and Form */}
          <div>
            {/* Summary Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-bold text-black mb-4">Resumen de tu reserva</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-600 uppercase font-semibold">Servicio</div>
                  <div className="font-semibold text-black mt-1">
                    {services.find(s => s.id === selectedService)?.name}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 uppercase font-semibold">Fecha</div>
                  <div className="font-semibold text-black mt-1">
                    {formatDate(selectedDate)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 uppercase font-semibold">Hora</div>
                  <div className="font-semibold text-black mt-1">
                    {selectedTime}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Precio:</span>
                <span className="text-2xl font-bold text-accent">
                  ${services.find(s => s.id === selectedService)?.price}
                </span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <h3 className="text-lg font-bold text-black">4. Completa tus datos</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Tu teléfono"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors mt-6"
              >
                Confirmar Turno
              </button>

              <p className="text-xs text-gray-500 text-center">
                Recibirás una confirmación por SMS en el teléfono que ingreses.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
