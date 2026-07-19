'use client';

import { signOut } from '@/app/actions/auth';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-2 text-left text-gray-700 hover:text-black font-medium transition-colors text-sm"
    >
      Cerrar sesión
    </button>
  );
}
