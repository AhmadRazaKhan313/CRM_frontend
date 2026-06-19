import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useAuthStore from "../../store/authStore"
import useFeatureStore from "../../store/featureStore"
import analyticsApi from "../../api/analytics"

// Har widget: permission + feature ke saath. User ke paas jo permission ho wahi widget dikhe.
const QUICK_LINKS = [
  { label: "Leads",       icon: "lucide:user-plus",      path: "/leads",       color: "blue",   permission: "leads.view",       feature: "leads_module" },
  { label: "Clients",     icon: "lucide:handshake",      path: "/clients",     color: "teal",   permission: "clients.view",     feature: "clients_module" },
  { label: "Tasks",       icon: "lucide:clipboard-list", path: "/tasks",       color: "purple", permission: "tasks.view",       feature: "tasks_module" },
  { label: "Reports",     icon: "lucide:file-text",      path: "/reports",     color: "orange", permission: "reports.view",     feature: "reports_module" },
  { label: "Employees",   icon: "lucide:users",          path: "/employees",   color: "indigo", permission: "employees.view" },
  { label: "Departments", icon: "lucide:building-2",     path: "/departments", color: "green",  permission: "departments.view", feature: "departments_module" },
  { label: "Finance",     icon: "lucide:wallet",         path: "/finance",     color: "emerald",permission: "finance.view",     feature: "finance_module" },
  { label: "Delivery",    icon: "lucide:package",        path: "/delivery",    color: "pink",   permission: "delivery.view",    feature: "delivery_module" },
  { label: "Analytics",   icon: "lucide:bar-chart-2",    path: "/analytics",   color: "cyan",   permission: "analytics.view",   feature: "analytics" },
  { label: "HRMS",        icon: "lucide:badge-check",    path: "/hrms",        color: "rose",   permission: "hrms.view",        feature: "hrms" },
  { label: "Roles",       icon: "lucide:shield",         path: "/roles",       color: "slate",  permission: "roles.view" },
]

const COLOR_MAP = {
  blue:    "bg-blue-50 text-blue-600",
  teal:    "bg-teal-50 text-teal-600",
  purple:  "bg-purple-50 text-purple-600",
  orange:  "bg-orange-50 text-orange-600",
  indigo:  "bg-indigo-50 text-indigo-600",
  green:   "bg-green-50 text-green-600",
  emerald: "bg-emerald-50 text-emerald-600",
  pink:    "bg-pink-50 text-pink-600",
  cyan:    "bg-cyan-50 text-cyan-600",
  rose:    "bg-rose-50 text-rose-600",
  slate:   "bg-slate-100 text-slate-600",
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color]}`}>
          <Icon icon={icon} className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate      = useNavigate()
  const user          = useAuthStore((s) => s.user)
  const hasPermission = useAuthStore((s) => s.hasPermission)
  const hasFeature    = useFeatureStore((s) => s.hasFeature)

  const [overview, setOverview] = useState(null)
  const [loading, setLoading]   = useState(true)

  const canSeeAnalytics = hasPermission("analytics.view") && hasFeature("analytics")

  useEffect(() => {
    if (canSeeAnalytics) {
      analyticsApi.overview()
        .then(({ data }) => setOverview(data))
        .catch(() => setOverview(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Widgets jo user dekh sakta hai
  const visibleLinks = QUICK_LINKS.filter((link) => {
    if (user?.is_super_admin) {
      return link.feature ? hasFeature(link.feature) : true
    }
    if (link.feature && !hasFeature(link.feature)) return false
    if (link.permission && !hasPermission(link.permission)) return false
    return true
  })

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">{greeting},</p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.full_name || "User"}</h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gray-400">{user?.tenant?.name}</span>
          {user?.is_super_admin && (
            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Super Admin
            </span>
          )}
          {user?.roles?.map((r) => (
            <span key={r} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Analytics stats — sirf agar permission + feature */}
      {canSeeAnalytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Leads"   value={overview?.leads?.total}   icon="lucide:user-plus"    color="blue" />
          <StatCard label="Total Clients" value={overview?.clients?.total} icon="lucide:handshake"    color="teal" />
          <StatCard label="Active Tasks"  value={overview?.tasks?.active}  icon="lucide:clipboard-list" color="purple" />
          <StatCard label="Conversions"   value={overview?.leads?.converted} icon="lucide:trending-up" color="green" />
        </div>
      )}

      {/* Quick access — har module jis ki permission hai */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Quick Access</h2>
        <p className="text-xs text-gray-400">Jump to your modules</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {visibleLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all text-left group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${COLOR_MAP[link.color]}`}>
              <Icon icon={link.icon} className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
              {link.label}
            </p>
          </button>
        ))}
      </div>

      {visibleLinks.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <Icon icon="lucide:lock" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No modules assigned yet.</p>
          <p className="text-xs text-gray-400 mt-1">Contact your administrator to get access.</p>
        </div>
      )}
    </div>
  )
}
