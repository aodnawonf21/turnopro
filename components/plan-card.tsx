import Link from 'next/link'

export default function PlanCard() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200 p-4">
      <h3 className="font-bold text-black text-sm mb-1">Plan Starter</h3>
      <p className="text-xs text-gray-600 mb-3">45 / 50 citas utilizadas este mes</p>
      <Link href="/dashboard/settings?tab=billing">
        <button className="w-full px-3 py-2 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-700 transition-colors">
          Actualizar plan
        </button>
      </Link>
    </div>
  )
}
