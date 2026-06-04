import { useState } from "react"
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import { Icon } from "@iconify/react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const salesData = [
  { month: "Jan", value: 30000 },
  { month: "Feb", value: 20000 },
  { month: "Mar", value: 48200 },
  { month: "Apr", value: 35000 },
  { month: "May", value: 42000 },
  { month: "Jun", value: 38000 },
  { month: "Jul", value: 45000 },
]

const incomeData = [
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 35000 },
  { month: "Mar", value: 48200 },
  { month: "Apr", value: 30000 },
  { month: "May", value: 55000 },
  { month: "Jun", value: 60000 },
]

const breakdown = [
  { name: "Marketing Channels", value: 22000, color: "#4F6EF7" },
  { name: "Direct Sales", value: 8400, color: "#34D399" },
  { name: "Offline Channels", value: 18600, color: "#FBBF24" },
  { name: "Other Channels", value: 15300, color: "#F87171" },
]

const events = [
  { icon: "lucide:file-text", title: "Invoice #AA-04-19-1890678", sub: "New Madieton LLC.", amount: "$118.00" },
  { icon: "lucide:user", title: "Client Bernard Stanley", sub: "bernard.stanley@gmail.com", amount: "$3208.00" },
  { icon: "lucide:calendar", title: "Meeting with the client", sub: "24 Vandervort Springs", amount: "29 Oct 2019" },
  { icon: "lucide:file-text", title: "Invoice #AA-04-19-1890243", sub: "Tyriquemouth LLC.", amount: "$578.00" },
]

const updates = [
  { icon: "lucide:shopping-cart", label: "Item sale #340-00", value: "+$890.00", color: "text-green-500" },
  { icon: "lucide:user-plus", label: "New lead created", value: "30 min", color: "text-gray-400" },
  { icon: "lucide:shopping-cart", label: "Item sale #360-20", value: "+$940.00", color: "text-green-500" },
  { icon: "lucide:upload-cloud", label: "Items upload complete", value: "45 min", color: "text-gray-400" },
  { icon: "lucide:bell", label: "Email notifications sent", value: "2 hrs", color: "text-gray-400" },
]

const upcomingEvents = [
  { time: "05:48AM", color: "bg-primary", title: "Meeting with a client", sub: "Tell how to boost website traffic" },
  { time: "10:28AM", color: "bg-yellow-400", title: "New project discussion", sub: "Business Cards Does Your Business" },
]

function PeriodTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {["Day", "Week", "Month"].map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            active === t ? "bg-gray-100 text-gray-700 font-medium" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {t}
        </button>
      ))}
      <button className="ml-1 w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-xl px-4 py-2 text-sm border border-gray-100">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-semibold text-gray-800">${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export default function Dashboard() {
  const [salesPeriod, setSalesPeriod] = useState("Month")
  const [breakdownPeriod, setBreakdownPeriod] = useState("Month")
  const [incomePeriod, setIncomePeriod] = useState("Month")

  return (
    <div className="flex gap-5">
      {/* Left Panel — Updates + Events */}
      <div className="w-64 shrink-0 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-5">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-400 text-sm">Welcome,</p>
          <p className="font-bold text-gray-900 text-lg">CRAFTUI</p>
        </div>

        {/* Latest Updates */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Latest updates</p>
          <div className="space-y-4">
            {updates.map((u, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                    <Icon icon={u.icon} className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs text-gray-600">{u.label}</span>
                </div>
                <span className={`text-xs font-medium ${u.color}`}>{u.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Upcoming events</p>
          <div className="space-y-4">
            {upcomingEvents.map((e, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${e.color}`} />
                    <span className="text-xs text-gray-400">{e.time}</span>
                  </div>
                  <Icon icon="lucide:more-horizontal" className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-xs font-semibold text-gray-800">{e.title}</p>
                <p className="text-xs text-gray-400">{e.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center + Right */}
      <div className="flex-1 space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-5">
          {/* Your Sales */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Your Sales</p>
              <PeriodTabs active={salesPeriod} onChange={setSalesPeriod} />
            </div>
            <p className="text-2xl font-bold text-gray-900">$142.000</p>
            <p className="text-xs text-gray-400 mb-4">Total income</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={salesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#4F6EF7" strokeWidth={2} fill="url(#salesGrad)" dot={false} activeDot={{ r: 5, fill: "#4F6EF7" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Latest Events */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Latest Events</p>
              <button className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-3 px-1">
              <span>Event</span>
              <span>Details</span>
            </div>
            <div className="space-y-3">
              {events.map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                      <Icon icon={e.icon} className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{e.title}</p>
                      <p className="text-xs text-gray-400">{e.sub}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 shrink-0">{e.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-5">
          {/* Income Breakdown */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Income Breakdown</p>
              <PeriodTabs active={breakdownPeriod} onChange={setBreakdownPeriod} />
            </div>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {breakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute mt-[-110px] text-center pointer-events-none">
                <p className="text-lg font-bold text-gray-900">$85k</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              {breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="text-xs text-gray-500">{b.name}</span>
                  <span className="text-xs font-medium text-gray-700 ml-auto">${(b.value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>

          {/* Income Details */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Income Details</p>
              <PeriodTabs active={incomePeriod} onChange={setIncomePeriod} />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-2xl font-bold text-gray-900">$142.000</p>
              <ArrowLeft className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mb-4">Total income</p>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={incomeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#34D399" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: "#34D399" }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">$342.000</p>
                <p className="text-xs text-gray-400">Total sales</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">$200.000</p>
                <p className="text-xs text-gray-400">Spendings</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">$142.000</p>
                <p className="text-xs text-gray-400">Income</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}