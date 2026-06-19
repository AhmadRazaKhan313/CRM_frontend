import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Icon } from "@iconify/react"
import useDepartmentStore from "../../store/departmentStore"
import useAuthStore from "../../store/authStore"

const typeConfig = {
  sales: { color: "bg-blue-50 text-blue-600",   icon: "lucide:trending-up", bg: "from-blue-500 to-blue-600" },
  tech:  { color: "bg-purple-50 text-purple-600", icon: "lucide:code-2",     bg: "from-purple-500 to-purple-600" },
  seo:   { color: "bg-green-50 text-green-600",   icon: "lucide:search",     bg: "from-green-500 to-green-600" },
}

export default function DepartmentList() {
  const navigate = useNavigate()
  const { departments, loading, fetch } = useDepartmentStore()
  const { user } = useAuthStore()
  const hasPermission = useAuthStore((s) => s.hasPermission)

  // ✅ FIX: is_super_admin also has access
  const canAdd = user?.is_super_admin || hasPermission("departments.create")

  useEffect(() => { fetch() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Company</p>
          <h1 className="text-xl font-bold text-gray-900">Departments</h1>
        </div>
        {canAdd && (
          <button
            onClick={() => navigate("/departments/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Employees", value: departments.reduce((s, d) => s + (d.employee_count || 0), 0), icon: "lucide:users" },
          { label: "Active Leads",    value: departments.reduce((s, d) => s + (d.lead_count || 0), 0),     icon: "lucide:user-plus" },
          { label: "Total Clients",   value: departments.reduce((s, d) => s + (d.client_count || 0), 0),   icon: "lucide:handshake" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon icon={s.icon} className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {departments.length === 0 && (
        <div className="bg-white rounded-2xl p-16 text-center">
          <Icon icon="lucide:building-2" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No departments yet</p>
          {canAdd && (
            <button
              onClick={() => navigate("/departments/new")}
              className="mt-4 px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
            >
              Add First Department
            </button>
          )}
        </div>
      )}

      {/* Department Cards */}
      <div className="grid grid-cols-3 gap-5">
        {departments.map((dept) => {
          const config = typeConfig[dept.type] || typeConfig.sales
          return (
            <div
              key={dept.id}
              onClick={() => navigate(`/departments/${dept.id}`)}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className={`bg-gradient-to-r ${config.bg} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon icon={config.icon} className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white/70 bg-white/20 px-2.5 py-1 rounded-full capitalize">
                    {dept.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                {dept.description && (
                  <p className="text-xs text-white/70 mt-1 line-clamp-1">{dept.description}</p>
                )}
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Employees",    value: dept.employee_count || 0, icon: "lucide:users" },
                    { label: "Leads",        value: dept.lead_count || 0,     icon: "lucide:user-plus" },
                    { label: "Clients",      value: dept.client_count || 0,   icon: "lucide:handshake" },
                    { label: "Active Tasks", value: dept.active_tasks || 0,   icon: "lucide:clipboard-list" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
                        <Icon icon={s.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {dept.head_name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {dept.head_name[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">{dept.head_name}</p>
                        <p className="text-xs text-gray-400">Department Head</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No head assigned</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}