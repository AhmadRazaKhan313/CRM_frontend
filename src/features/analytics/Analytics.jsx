import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"
import analyticsApi from "../../api/analytics"

const COLORS = ["#4F6EF7", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#60A5FA"]

const sourceIcons = {
  instagram: "mdi:instagram",
  facebook: "mdi:facebook",
  linkedin: "mdi:linkedin",
  whatsapp: "mdi:whatsapp",
  website: "mdi:web",
  email: "mdi:email-outline",
  other: "mdi:dots-horizontal",
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-xl px-4 py-2 text-sm border border-gray-100">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.value}</p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [kpi, setKpi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("overview")

  useEffect(() => {
    Promise.all([
      analyticsApi.overview(),
      analyticsApi.kpi(),
    ]).then(([ov, kp]) => {
      setData(ov.data)
      setKpi(kp.data)
    }).finally(() => setLoading(false))
  }, [])

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
          <p className="text-xs text-gray-400 mb-0.5">Insights</p>
          <h1 className="text-xl font-bold text-gray-900">Analytics & KPI</h1>
        </div>
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-100">
          {["overview", "kpi"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                tab === t ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "kpi" ? "KPI" : "Overview"}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && data && (
        <div className="space-y-5">
          {/* Top Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Leads", value: data.leads.total, sub: `+${data.leads.this_month} this month`, icon: "lucide:user-plus", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Converted", value: data.leads.converted, sub: `${data.leads.conversion_rate}% rate`, icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
              { label: "Total Clients", value: data.clients.total, sub: `${data.clients.active} active`, icon: "lucide:handshake", color: "text-primary", bg: "bg-primary/10" },
              { label: "Active Tasks", value: data.tasks.in_progress, sub: `${data.tasks.urgent} urgent`, icon: "lucide:clipboard-list", color: "text-orange-600", bg: "bg-orange-50" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                <p className="text-xs text-green-500 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Lead Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Today", value: data.leads.today, icon: "lucide:calendar" },
              { label: "This Week", value: data.leads.this_week, icon: "lucide:calendar-days" },
              { label: "This Month", value: data.leads.this_month, icon: "lucide:calendar-range" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <Icon icon={s.icon} className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Monthly Leads */}
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">Monthly Leads</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.monthly_leads} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke="#4F6EF7" strokeWidth={2} fill="url(#leadsGrad)" dot={false} activeDot={{ r: 5, fill: "#4F6EF7" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Status */}
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">Lead Status Breakdown</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "New", value: data.leads.new },
                        { name: "Contacted", value: data.leads.contacted },
                        { name: "Interested", value: data.leads.interested },
                        { name: "Converted", value: data.leads.converted },
                        { name: "Rejected", value: data.leads.rejected },
                      ].filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {COLORS.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {[
                    { label: "New", value: data.leads.new, color: COLORS[0] },
                    { label: "Contacted", value: data.leads.contacted, color: COLORS[1] },
                    { label: "Interested", value: data.leads.interested, color: COLORS[2] },
                    { label: "Converted", value: data.leads.converted, color: COLORS[3] },
                    { label: "Rejected", value: data.leads.rejected, color: COLORS[4] },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-gray-500">{s.label}</span>
                      <span className="text-xs font-semibold text-gray-800 ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Source + Department */}
          <div className="grid grid-cols-2 gap-5">
            {/* Lead by Source */}
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">Leads by Source</p>
              {data.lead_by_source.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.lead_by_source.map((s, i) => {
                    const max = data.lead_by_source[0]?.count || 1
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon icon={sourceIcons[s.source] || "mdi:dots-horizontal"} className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 capitalize">{s.source}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-800">{s.count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(s.count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Task Stats */}
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">Task Overview</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={[
                    { name: "Pending", value: data.tasks.pending, fill: "#FBBF24" },
                    { name: "In Progress", value: data.tasks.in_progress, fill: "#4F6EF7" },
                    { name: "Completed", value: data.tasks.completed, fill: "#34D399" },
                    { name: "Delayed", value: data.tasks.delayed, fill: "#F87171" },
                  ]}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {[
                      { fill: "#FBBF24" },
                      { fill: "#4F6EF7" },
                      { fill: "#34D399" },
                      { fill: "#F87171" },
                    ].map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "kpi" && kpi && (
        <div className="space-y-5">
          {/* KPI Summary */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Leads", value: kpi.summary.total_leads, icon: "lucide:user-plus", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Converted", value: kpi.summary.converted, icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
              { label: "Conversion Rate", value: `${kpi.summary.conversion_rate}%`, icon: "lucide:trending-up", color: "text-primary", bg: "bg-primary/10" },
              { label: "This Month", value: kpi.summary.monthly_leads, icon: "lucide:calendar", color: "text-orange-600", bg: "bg-orange-50" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Employee KPI Table */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">Employee Performance</p>
            </div>
            {kpi.employee_kpis.length === 0 ? (
              <div className="text-center py-12">
                <Icon icon="lucide:users" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No employee data yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Total Leads</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Converted</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Rate</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Reports</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {kpi.employee_kpis.map((emp, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {emp.name[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-400">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-600 capitalize">{emp.department}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-gray-800">{emp.total_leads}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-green-600">{emp.converted}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${emp.conversion_rate >= 50 ? "text-green-600" : emp.conversion_rate >= 25 ? "text-yellow-600" : "text-red-500"}`}>
                          {emp.conversion_rate}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-700">{emp.reports_submitted}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${emp.conversion_rate >= 50 ? "bg-green-500" : emp.conversion_rate >= 25 ? "bg-yellow-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(emp.conversion_rate, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8">{emp.conversion_rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}