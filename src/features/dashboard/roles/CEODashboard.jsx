import { TrendingUp, TrendingDown, Users, Target, DollarSign, BarChart2 } from "lucide-react"
import { Icon } from "@iconify/react"
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts"
import useAuthStore from "../../../store/authStore"

const salesData = [
  { month: "Jan", value: 30000 },
  { month: "Feb", value: 20000 },
  { month: "Mar", value: 48200 },
  { month: "Apr", value: 35000 },
  { month: "May", value: 42000 },
  { month: "Jun", value: 55000 },
]

const stats = [
  { label: "Total Revenue", value: "$142,000", trend: "up", change: "+12%", icon: "lucide:dollar-sign", color: "text-green-600", bg: "bg-green-50" },
  { label: "Total Leads", value: "3,820", trend: "up", change: "+8%", icon: "lucide:users", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Conversions", value: "284", trend: "down", change: "-3%", icon: "lucide:target", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Employees", value: "48", trend: "up", change: "+2", icon: "lucide:user-check", color: "text-primary", bg: "bg-primary/10" },
]

const deptStats = [
  { name: "Sales", leads: 1240, converted: 98, revenue: "$48,200" },
  { name: "Tech", leads: 860, converted: 72, revenue: "$62,400" },
  { name: "SEO", leads: 1720, converted: 114, revenue: "$31,400" },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-xl px-4 py-2 text-sm border border-gray-100">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-semibold text-gray-800">${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export default function CEODashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Here's what's happening across your company today.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {user?.full_name?.[0]?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${s.trend === "up" ? "text-green-500" : "text-red-400"}`}>
                {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.change}
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Revenue Overview</p>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ceoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#4F6EF7" strokeWidth={2} fill="url(#ceoGrad)" dot={false} activeDot={{ r: 5, fill: "#4F6EF7" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Summary */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Department Summary</p>
          <div className="space-y-4">
            {deptStats.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-900">{d.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(d.converted / d.leads) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{d.leads} leads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}