/**
 * ModuleGuard.jsx
 *
 * Kisi bhi route ya component ko feature flag ke peeche wrap karne ke liye.
 *
 * Usage (route mein):
 *   <ModuleGuard feature="analytics">
 *     <Analytics />
 *   </ModuleGuard>
 *
 * Usage (inline/component mein):
 *   <ModuleGuard feature="hrms" fallback={null}>
 *     <HrmsWidget />
 *   </ModuleGuard>
 */

import useFeatureStore from "../../store/featureStore"
import useAuthStore from "../../store/authStore"

const DEFAULT_FALLBACK = (
  <div className="flex flex-col items-center justify-center h-64 text-center px-6">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <p className="text-sm font-semibold text-gray-800">Module Not Available</p>
    <p className="text-xs text-gray-400 mt-1">
      This feature is not enabled for your plan. Contact your administrator.
    </p>
  </div>
)

export default function ModuleGuard({ feature, children, fallback = DEFAULT_FALLBACK }) {
  const hasFeature = useFeatureStore((s) => s.hasFeature)
  const user = useAuthStore((s) => s.user)

  // Super admin ko sab features milte hain
  if (user?.is_super_admin) return children

  if (!hasFeature(feature)) return fallback

  return children
}
