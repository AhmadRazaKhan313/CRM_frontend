import { Icon } from "@iconify/react"
import useAuthStore from "../../../store/authStore"

const stats = [
  { label: "Assigned Leads", value: "24", icon: "lucide:users", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Follow Ups Today", value: "8", icon: "lucide:phone", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Converted This Month", value: "12", icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
  { label: "Pending Tasks", value: "5", icon: "lucide:clock", color: "text-primary", bg: "bg-primary/10" },
]

export default function ManagerDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm text-gray-400">Welcome back,</p>
        <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace("_", " ")} — {user?.department} Department</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</p>
        <div className="text-center py-8">
          <Icon icon="lucide:activity" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>
  )
}