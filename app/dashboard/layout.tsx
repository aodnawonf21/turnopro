import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/logout-button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only enforce authentication if Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const session = await getSession();
    if (!session) {
      redirect('/login');
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
            TurnoPro
          </Link>
        </div>

        <nav className="p-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">📊</span>
            Dashboard
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">📅</span>
            Calendario
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">📋</span>
            Citas
          </Link>
          <Link
            href="/dashboard/services"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">🛠️</span>
            Servicios
          </Link>
          <Link
            href="/dashboard/staff"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">👥</span>
            Personal
          </Link>
          <Link
            href="/dashboard/horarios"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">🕐</span>
            Horarios
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-xl">⚙️</span>
            Configuración
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200 p-4">
            <h4 className="font-bold text-black text-sm mb-2">Plan Starter</h4>
            <p className="text-xs text-gray-600 mb-3">45 de 50 citas usadas este mes</p>
            <Link href="/dashboard/settings?tab=billing">
              <Button size="sm" className="w-full bg-accent hover:bg-amber-600 text-white text-xs">
                Actualizar plan
              </Button>
            </Link>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:hidden">
          <Link href="/" className="text-2xl font-bold text-black">
            TurnoPro
          </Link>
          <button className="text-2xl text-gray-700 hover:text-black transition-colors">☰</button>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
