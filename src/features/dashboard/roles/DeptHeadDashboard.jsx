import { useEffect, useState } from "react"
import analyticsApi from "../../../api/analytics"
import useAuthStore from "../../../store/authStore"

export default function DeptHeadDashboard() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState(null)

  useEffect(() => {
    analyticsApi.overview().then(({ data }) => setData(data))
  }, [])

  const stats = [
    { label: "Department Leads", value: data?.leads?.total ?? 0, icon: "lucide:users", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversions", value: data?.leads?.converted ?? 0, icon: "lucide:target", color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Employees", value: data?.employees?.total ?? 0, icon: "lucide:user-check", color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Tasks", value: data?.tasks?.in_progress ?? 0, icon: "lucide:clipboard-list", color: "text-orange-600", bg: "bg-orange-50" },
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
    </div>
  )
}