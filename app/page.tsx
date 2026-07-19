import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-black">TurnoPro</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
              Inicia sesión
            </Link>
            <Link href="/registro">
              <Button>Regístrate</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Gestiona tus citas de forma fácil
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Simplifica la reserva de citas para tu negocio. Barbershops, salones de belleza, spas y más.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/registro">
              <Button size="lg" className="bg-accent hover:bg-amber-600 text-white">
                Comienza gratis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
              Ver demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Características</h2>
            <p className="text-lg text-gray-600">Todo lo que necesitas para gestionar tu negocio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Calendario inteligente',
                description: 'Visualiza todos tus servicios y citas en un solo lugar con nuestro calendario intuitivo.',
                icon: '📅'
              },
              {
                title: 'Notificaciones automáticas',
                description: 'Tus clientes reciben recordatorios automáticos por SMS o email antes de su cita.',
                icon: '🔔'
              },
              {
                title: 'Gestión de personal',
                description: 'Asigna servicios a tus empleados y controla sus horarios fácilmente.',
                icon: '👥'
              },
              {
                title: 'Disponibilidad en línea',
                description: 'Los clientes pueden ver tu disponibilidad y reservar desde cualquier dispositivo.',
                icon: '📱'
              },
              {
                title: 'Gestión de pagos',
                description: 'Recibe pagos seguros directamente en tu cuenta. Compatible con múltiples métodos.',
                icon: '💳'
              },
              {
                title: 'Análisis de negocio',
                description: 'Reportes detallados sobre tus ingresos, clientes más frecuentes y tendencias.',
                icon: '📊'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 hover:border-accent hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Cómo funciona</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Regístrate', desc: 'Crea tu cuenta en menos de 2 minutos' },
              { step: 2, title: 'Configura', desc: 'Añade tus servicios y horarios' },
              { step: 3, title: 'Comparte', desc: 'Comparte tu calendario con clientes' },
              { step: 4, title: 'Recibe citas', desc: 'Gestiona todas tus reservas' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Planes simples y justos</h2>
            <p className="text-lg text-gray-600">Sin contratos a largo plazo, cancela cuando quieras</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$9',
                desc: 'Perfecto para empezar',
                features: ['Hasta 50 citas/mes', '1 empleado', 'Calendario básico', 'Soporte por email']
              },
              {
                name: 'Pro',
                price: '$29',
                desc: 'Para negocios en crecimiento',
                features: ['Citas ilimitadas', 'Hasta 5 empleados', 'Análisis completos', 'Soporte prioritario', 'Integración con WhatsApp'],
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'Para grandes operaciones',
                features: ['Citas ilimitadas', 'Empleados ilimitados', 'API personalizada', 'Soporte 24/7', 'Integraciones personalizadas']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl border-2 p-8 transition-all ${
                  plan.featured
                    ? 'border-accent bg-gradient-to-br from-amber-50 to-white shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.featured && <div className="text-accent font-bold text-sm mb-2">Más Popular</div>}
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/mes</span>}
                </div>
                <Button
                  className={`w-full mb-8 ${
                    plan.featured
                      ? 'bg-accent hover:bg-amber-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Empezar
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-gray-700">
                      <span className="text-accent font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '¿Cuánto tiempo lleva configurar TurnoPro?',
                a: 'Solo necesitas 5 minutos. Crea tu cuenta, añade tus servicios y comparte tu enlace de reservas.'
              },
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Por supuesto. Puedes actualizar, degradar o cancelar tu plan cuando quieras sin penalizaciones.'
              },
              {
                q: '¿Quién verá mi calendario de reservas?',
                a: 'Solo las personas a las que compartas el enlace. Tú controlas totalmente quién puede acceder.'
              },
              {
                q: '¿Cómo reciben recordatorios mis clientes?',
                a: 'Puedes configurar recordatorios automáticos por email o SMS. Los clientes pueden elegir su preferencia.'
              },
              {
                q: '¿Hay cargos ocultos?',
                a: 'No. El precio que ves es el que pagas. Sin sorpresas, sin cargos adicionales.'
              },
              {
                q: '¿Qué pasa si tengo más de 5 empleados?',
                a: 'Actualiza al plan Enterprise o contacta a nuestro equipo para soluciones personalizadas.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-accent transition-colors">
                <h3 className="font-bold text-black mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Listo para gestionar tus citas mejor</h2>
          <p className="text-lg text-gray-300 mb-8">Únete a cientos de negocios que ya confían en TurnoPro</p>
          <Link href="/registro">
            <Button size="lg" className="bg-accent hover:bg-amber-600 text-white">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-4">TurnoPro</div>
              <p className="text-sm">La mejor solución para gestionar citas en línea.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 TurnoPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
