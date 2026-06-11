import { TrendingUp, TrendingDown, Lock } from "lucide-react"
import { Icon } from "@iconify/react"
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts"
import useAuthStore from "../../../store/authStore"
import useFeatureStore from "../../../store/featureStore"
import { useEffect, useState } from "react"
import analyticsApi from "../../../api/analytics"

const salesData = [
  { month: "Jan", value: 30000 },
  { month: "Feb", value: 20000 },
  { month: "Mar", value: 48200 },
  { month: "Apr", value: 35000 },
  { month: "May", value: 42000 },
  { month: "Jun", value: 55000 },
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

// Disabled widget — module off hai
function LockedWidget({ label }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center h-full min-h-[100px] border border-dashed border-gray-200">
      <Lock className="w-4 h-4 text-gray-300 mb-1.5" />
      <p className="text-xs text-gray-300 font-medium">{label}</p>
      <p className="text-xs text-gray-300">Module disabled</p>
    </div>
  )
}

export default function CEODashboard() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const user = useAuthStore((s) => s.user)
  const hasFeature = useFeatureStore((s) => s.hasFeature)

  const hasAnalytics = hasFeature("analytics") || user?.is_super_admin
  const hasLeads     = hasFeature("leads_module") || user?.is_super_admin
  const hasClients   = hasFeature("clients_module") || user?.is_super_admin
  const hasTasks     = hasFeature("tasks_module") || user?.is_super_admin
  const hasReports   = hasFeature("reports_module") || user?.is_super_admin
  const hasHrms      = hasFeature("hrms") || user?.is_super_admin

  useEffect(() => {
    if (hasAnalytics) {
      analyticsApi.overview().then(({ data }) => setAnalyticsData(data)).catch(() => {})
    }
  }, [hasAnalytics])

  const deptStats = analyticsData?.lead_by_dept?.map((d) => ({
    name: d.department?.charAt(0).toUpperCase() + d.department?.slice(1),
    leads: d.count,
    converted: 0,
    revenue: "$0",
  })) || []

  // Stat cards — feature flag ke hisab se value dikhao ya "—"
  const stats = [
    {
      label: "Total Leads",
      value: hasLeads ? (analyticsData?.leads?.total ?? "—") : null,
      locked: !hasLeads,
      lockedLabel: "Leads Module Off",
      trend: "up", change: hasLeads ? `+${analyticsData?.leads?.this_month ?? 0} this month` : "",
      icon: "lucide:user-plus", color: "text-blue-600", bg: "bg-blue-50"
    },
    {
      label: "Conversions",
      value: hasLeads ? (analyticsData?.leads?.converted ?? "—") : null,
      locked: !hasLeads,
      lockedLabel: "Leads Module Off",
      trend: "up", change: hasLeads ? `${analyticsData?.leads?.conversion_rate ?? 0}% rate` : "",
      icon: "lucide:target", color: "text-orange-600", bg: "bg-orange-50"
    },
    {
      label: "Active Clients",
      value: hasClients ? (analyticsData?.clients?.active ?? "—") : null,
      locked: !hasClients,
      lockedLabel: "Clients Module Off",
      trend: "up", change: hasClients ? `${analyticsData?.clients?.this_month ?? 0} this month` : "",
      icon: "lucide:handshake", color: "text-green-600", bg: "bg-green-50"
    },
    {
      label: "Active Employees",
      value: analyticsData?.employees?.total ?? "—",
      locked: false,
      trend: "up", change: "",
      icon: "lucide:user-check", color: "text-primary", bg: "bg-primary/10"
    },
  ]

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
        {stats.map((s, i) =>
          s.locked ? (
            <LockedWidget key={i} label={s.lockedLabel} />
          ) : (
            <div key={i} className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
                </div>
                {s.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${s.trend === "up" ? "text-green-500" : "text-red-400"}`}>
                    {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </div>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          )
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Revenue / Analytics Chart */}
        {hasAnalytics ? (
          <div className="col-span-2 bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Revenue Overview</p>
              <span className="text-xs text-gray-400">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ceoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4F6EF7" stopOpacity={0.15} />
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
        ) : (
          <div className="col-span-2">
            <LockedWidget label="Analytics Module Off" />
          </div>
        )}

        {/* Department Summary */}
        {hasLeads ? (
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Department Summary</p>
            {deptStats.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-xs text-gray-400">No department data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deptStats.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-700">{d.name}</span>
                      <span className="text-xs font-semibold text-gray-900">{d.leads} leads</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: d.leads > 0 ? `${Math.min((d.leads / (analyticsData?.leads?.total || 1)) * 100, 100)}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <LockedWidget label="Leads Module Off" />
        )}
      </div>

      {/* Tasks + Reports quick stats — agar on hain */}
      {(hasTasks || hasReports || hasHrms) && (
        <div className="grid grid-cols-3 gap-4">
          {hasTasks && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Tasks</p>
              <div className="space-y-2">
                {[
                  { label: "Total",       val: analyticsData?.tasks?.total,       color: "text-gray-900" },
                  { label: "In Progress", val: analyticsData?.tasks?.in_progress, color: "text-blue-600" },
                  { label: "Completed",   val: analyticsData?.tasks?.completed,   color: "text-green-600" },
                  { label: "Delayed",     val: analyticsData?.tasks?.delayed,     color: "text-red-500" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{val ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasReports && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Lead Sources</p>
              <div className="space-y-2">
                {(analyticsData?.lead_by_source || []).slice(0, 4).map((s) => (
                  <div key={s.source} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{s.source || "Unknown"}</span>
                    <span className="text-sm font-bold text-gray-900">{s.count}</span>
                  </div>
                ))}
                {!analyticsData?.lead_by_source?.length && (
                  <p className="text-xs text-gray-300">No data yet</p>
                )}
              </div>
            </div>
          )}

          {hasHrms && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">HRMS Quick</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Employees</span>
                  <span className="text-sm font-bold text-gray-900">{analyticsData?.employees?.total ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Departments</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analyticsData?.employees?.by_department?.length ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
