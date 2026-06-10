import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import superadminApi from "../../api/superadmin"

const statusConfig = {
  active: { label: "Active", class: "bg-green-50 text-green-600" },
  trial: { label: "Trial", class: "bg-yellow-50 text-yellow-600" },
  suspended: { label: "Suspended", class: "bg-red-50 text-red-500" },
  cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-500" },
}

const planConfig = {
  free: "bg-gray-100 text-gray-500",
  starter: "bg-blue-50 text-blue-600",
  pro: "bg-purple-50 text-purple-600",
  enterprise: "bg-orange-50 text-orange-600",
}

export default function TenantList() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    superadminApi.tenants()
      .then(({ data }) => setTenants(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Super Admin</p>
          <h1 className="text-xl font-bold text-gray-900">All Companies</h1>
        </div>
        <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
          {tenants.length} companies
        </span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:building-2" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No companies yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Users</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {t.logo ? (
                          <img src={t.logo} className="w-8 h-8 rounded-xl object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">
                            {t.name[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${planConfig[t.plan] || "bg-gray-100 text-gray-500"}`}>
                      {t.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusConfig[t.status]?.class}`}>
                      {statusConfig[t.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-700">{t.user_count}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-400">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/superadmin/tenants/${t.id}`)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}