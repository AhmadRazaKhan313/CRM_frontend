import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import analyticsApi from "../../../api/analytics"
import useAuthStore from "../../../store/authStore"

export default function SalesDirectorDashboard() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState(null)

  useEffect(() => {
    analyticsApi.overview().then(({ data }) => setData(data)).catch(() => {})
  }, [])

  const stats = [
    { label: "Total Leads",       value: data?.leads?.total              ?? "—", icon: "lucide:user-plus",  color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Conversion Rate",   value: data?.leads?.conversion_rate ? `${data.leads.conversion_rate}%` : "—", icon: "lucide:target", color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Clients",    value: data?.clients?.active           ?? "—", icon: "lucide:handshake",  color: "text-teal-600",   bg: "bg-teal-50" },
    { label: "This Month Leads",  value: data?.leads?.this_month         ?? "—", icon: "lucide:trending-up",color: "text-primary",    bg: "bg-primary/10" },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm text-gray-400">Welcome back,</p>
        <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
        <p className="text-xs text-gray-400 mt-0.5">Sales Director</p>
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
        {/* Department breakdown */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Leads by Department</p>
          {data?.lead_by_dept?.length ? (
            <div className="space-y-3">
              {data.lead_by_dept.map((d) => (
                <div key={d.department}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 capitalize">{d.department}</span>
                    <span className="text-xs font-semibold text-gray-800">{d.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((d.count / (data?.leads?.total || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">No data yet</p>}
        </div>

        {/* Lead sources */}
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
                    <div className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${Math.min((s.count / (data?.leads?.total || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">No data yet</p>}
        </div>
      </div>
    </div>
  )
}
