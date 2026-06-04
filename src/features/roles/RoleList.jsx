import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import rolesApi from "../../api/roles"

export default function RoleList() {
  const navigate = useNavigate()
  const [roleList, setRoleList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rolesApi.list()
      .then(({ data }) => setRoleList(data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return
    try {
      await rolesApi.remove(id)
      setRoleList((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert(err.response?.data?.detail || "Cannot delete role.")
    }
  }

  const moduleColors = {
    leads: "bg-blue-50 text-blue-600",
    clients: "bg-green-50 text-green-600",
    sales: "bg-yellow-50 text-yellow-600",
    tasks: "bg-purple-50 text-purple-600",
    reports: "bg-orange-50 text-orange-600",
    finance: "bg-red-50 text-red-600",
    employees: "bg-indigo-50 text-indigo-600",
    departments: "bg-pink-50 text-pink-600",
    delivery: "bg-teal-50 text-teal-600",
    analytics: "bg-cyan-50 text-cyan-600",
    settings: "bg-gray-100 text-gray-600",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Settings</p>
          <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
        </div>
        <button
          onClick={() => navigate("/roles/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Role
        </button>
      </div>

      {roleList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No roles yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first role to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {roleList.map((role) => (
            <div key={role.id} className="bg-white rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{role.name}</h3>
                    {role.is_system && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        System
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{role.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {role.user_count} {role.user_count === 1 ? "user" : "users"} assigned
                  </p>
                </div>
                {!role.is_system && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/roles/${role.id}/edit`)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {role.permissions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map((p) => (
                      <span
                        key={p.id}
                        className={`text-xs px-2 py-0.5 rounded-lg font-medium ${moduleColors[p.module] || "bg-gray-100 text-gray-500"}`}
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}