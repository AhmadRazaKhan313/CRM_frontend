import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, PowerOff } from "lucide-react"
import { Icon } from "@iconify/react"
import useDepartmentStore from "../../store/departmentStore"
import useAuthStore from "../../store/authStore"
import departmentsApi from "../../api/departments"

const typeConfig = {
  sales: { color: "text-blue-600",   bg: "bg-blue-50",   gradient: "from-blue-500 to-blue-600",   icon: "lucide:trending-up" },
  tech:  { color: "text-purple-600", bg: "bg-purple-50", gradient: "from-purple-500 to-purple-600", icon: "lucide:code-2" },
  seo:   { color: "text-green-600",  bg: "bg-green-50",  gradient: "from-green-500 to-green-600",  icon: "lucide:search" },
}

export default function DepartmentDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { current, fetchOne, loading, remove } = useDepartmentStore()
  const { user }     = useAuthStore()
  const [deactivating, setDeactivating] = useState(false)

  const canManage = user?.is_super_admin || user?.role === "ceo" || user?.role === "coo"

  useEffect(() => { fetchOne(id) }, [id])

  const handleDeactivate = async () => {
    if (!window.confirm(`Deactivate "${current.name}" department?`)) return
    setDeactivating(true)
    try {
      await departmentsApi.deactivate(id)
      remove(Number(id))
      navigate("/departments")
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong.")
    } finally {
      setDeactivating(false)
    }
  }

  if (loading || !current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const config = typeConfig[current.type] || typeConfig.sales

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/departments")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Departments</p>
          <h1 className="text-xl font-bold text-gray-900">{current.name}</h1>
        </div>

        {/* ✅ Edit & Deactivate buttons */}
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/departments/${id}/edit`)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDeactivate}
              disabled={deactivating}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <PowerOff className="w-3.5 h-3.5" />
              {deactivating ? "Deactivating..." : "Deactivate"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Banner */}
          <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon icon={config.icon} className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{current.name}</h2>
                <p className="text-white/70 text-sm mt-0.5">{current.description || "No description"}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Employees",    value: current.employee_count, icon: "lucide:users" },
              { label: "Active Leads", value: current.lead_count,     icon: "lucide:user-plus" },
              { label: "Clients",      value: current.client_count,   icon: "lucide:handshake" },
              { label: "Active Tasks", value: current.active_tasks,   icon: "lucide:clipboard-list" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center">
                <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon icon={s.icon} className={`w-4 h-4 ${config.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "View Employees", icon: "lucide:users",          path: `/employees?department=${current.type}` },
                { label: "View Leads",     icon: "lucide:user-plus",      path: `/leads?department=${current.type}` },
                { label: "View Clients",   icon: "lucide:handshake",      path: `/clients?department=${current.type}` },
                { label: "View Tasks",     icon: "lucide:clipboard-list", path: `/tasks?department=${current.type}` },
                { label: "View Reports",   icon: "lucide:file-text",      path: `/reports?department=${current.type}` },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => navigate(a.path)}
                  className={`flex items-center gap-2 p-3 rounded-xl ${config.bg} hover:opacity-80 transition-opacity`}
                >
                  <Icon icon={a.icon} className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-xs font-medium ${config.color}`}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Department Info</p>
            <div className="space-y-3">
              {[
                { label: "Type",    value: current.type },
                { label: "Status",  value: current.is_active ? "Active" : "Inactive" },
                { label: "Created", value: new Date(current.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Department Head</p>
            {current.head_name ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {current.head_name[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{current.head_name}</p>
                  <p className="text-xs text-gray-400">{current.head_email}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Icon icon="lucide:user-x" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No head assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}