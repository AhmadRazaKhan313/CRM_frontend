import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { TrendingUp } from "lucide-react"
import superadminApi from "../../api/superadmin"

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    superadminApi.stats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: "Total Companies", value: stats?.total_tenants, icon: "lucide:building-2", color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: stats?.active_tenants, icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
    { label: "Trial", value: stats?.trial_tenants, icon: "lucide:clock", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Total Users", value: stats?.total_users, icon: "lucide:users", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Leads", value: stats?.total_leads, icon: "lucide:user-plus", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Clients", value: stats?.total_clients, icon: "lucide:handshake", color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Platform</p>
        <h1 className="text-xl font-bold text-gray-900">Super Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center shrink-0`}>
              <Icon icon={c.icon} className={`w-6 h-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value ?? 0}</p>
              <p className="text-xs text-gray-400">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/superadmin/tenants")}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Icon icon="lucide:building-2" className="w-4 h-4" />
            Manage Companies
          </button>
        </div>
      </div>
    </div>
  )
}