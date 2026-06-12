import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import analyticsApi from "../../../api/analytics"
import useAuthStore from "../../../store/authStore"

export default function ManagerDashboard() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState(null)

  useEffect(() => {
    analyticsApi.overview().then(({ data }) => setData(data)).catch(() => {})
  }, [])

  const stats = [
    { label: "Total Leads",    value: data?.leads?.total       ?? "—", icon: "lucide:user-plus",     color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Converted",      value: data?.leads?.converted   ?? "—", icon: "lucide:check-circle",  color: "text-green-600",  bg: "bg-green-50" },
    { label: "Active Clients", value: data?.clients?.active    ?? "—", icon: "lucide:handshake",     color: "text-teal-600",   bg: "bg-teal-50" },
    { label: "Pending Tasks",  value: data?.tasks?.pending     ?? "—", icon: "lucide:clock",         color: "text-orange-600", bg: "bg-orange-50" },
  ]

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

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Lead Status Breakdown</p>
          <div className="space-y-2">
            {[
              { label: "New",        val: data?.leads?.new,        color: "text-blue-600" },
              { label: "Interested", val: data?.leads?.interested, color: "text-green-600" },
              { label: "Follow Up",  val: data?.leads?.follow_up,  color: "text-orange-600" },
              { label: "Converted",  val: data?.leads?.converted,  color: "text-primary" },
              { label: "Rejected",   val: data?.leads?.rejected,   color: "text-red-500" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-sm font-bold ${color}`}>{val ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Task Overview</p>
          <div className="space-y-2">
            {[
              { label: "In Progress", val: data?.tasks?.in_progress, color: "text-blue-600" },
              { label: "Completed",   val: data?.tasks?.completed,   color: "text-green-600" },
              { label: "Delayed",     val: data?.tasks?.delayed,     color: "text-red-500" },
              { label: "Pending",     val: data?.tasks?.pending,     color: "text-gray-600" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-sm font-bold ${color}`}>{val ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
