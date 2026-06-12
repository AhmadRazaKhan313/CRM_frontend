import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import analyticsApi from "../../../api/analytics"
import useAuthStore from "../../../store/authStore"

export default function DeptHeadDashboard() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState(null)

  useEffect(() => {
    analyticsApi.overview().then(({ data }) => setData(data)).catch(() => {})
  }, [])

  const stats = [
    { label: "Department Leads",  value: data?.leads?.total       ?? "—", icon: "lucide:user-plus",     color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Conversions",       value: data?.leads?.converted   ?? "—", icon: "lucide:target",         color: "text-green-600",  bg: "bg-green-50" },
    { label: "Active Employees",  value: data?.employees?.total   ?? "—", icon: "lucide:user-check",     color: "text-primary",    bg: "bg-primary/10" },
    { label: "Active Tasks",      value: data?.tasks?.in_progress ?? "—", icon: "lucide:clipboard-list", color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm text-gray-400">Welcome back,</p>
        <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.department} Department Head</p>
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
          <p className="text-sm font-semibold text-gray-800 mb-4">Lead Sources</p>
          {data?.lead_by_source?.length ? (
            <div className="space-y-3">
              {data.lead_by_source.slice(0, 5).map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 capitalize">{s.source}</span>
                    <span className="text-xs font-semibold text-gray-800">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((s.count / (data?.leads?.total || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">No data yet</p>}
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Task Status</p>
          <div className="space-y-2">
            {[
              { label: "Pending",     val: data?.tasks?.pending,     color: "text-gray-600" },
              { label: "In Progress", val: data?.tasks?.in_progress, color: "text-blue-600" },
              { label: "Completed",   val: data?.tasks?.completed,   color: "text-green-600" },
              { label: "Delayed",     val: data?.tasks?.delayed,     color: "text-red-500" },
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
