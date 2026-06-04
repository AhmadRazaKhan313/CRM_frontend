import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../../store/authStore"

const quickActions = [
  { label: "Add Lead", icon: "lucide:user-plus", path: "/leads/new", color: "bg-primary/10 text-primary" },
  { label: "My Leads", icon: "lucide:users", path: "/leads", color: "bg-blue-50 text-blue-600" },
  { label: "My Tasks", icon: "lucide:clipboard-list", path: "/tasks", color: "bg-orange-50 text-orange-600" },
  { label: "Submit Report", icon: "lucide:file-text", path: "/reports/new", color: "bg-green-50 text-green-600" },
]

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm text-gray-400">Welcome back,</p>
        <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace("_", " ")} — {user?.department} Department</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            className="bg-white rounded-2xl p-5 text-left hover:shadow-sm transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center mb-3`}>
              <Icon icon={a.icon} className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-gray-800">{a.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">My Assigned Leads</p>
        <div className="text-center py-8">
          <Icon icon="lucide:users" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No leads assigned yet</p>
        </div>
      </div>
    </div>
  )
}