import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Icon } from "@iconify/react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const ordersData = [
  { month: "Jan", actual: 20000, planned: 35000 },
  { month: "Feb", actual: 15000, planned: 28000 },
  { month: "Mar", actual: 30000, planned: 22000 },
  { month: "Apr", actual: 25000, planned: 40000 },
  { month: "May", actual: 40000, planned: 30000 },
  { month: "Jun", actual: 35000, planned: 48200 },
  { month: "Jul", actual: 48200, planned: 38000 },
  { month: "Aug", actual: 38000, planned: 42000 },
  { month: "Sep", actual: 42000, planned: 35000 },
  { month: "Oct", actual: 30000, planned: 45000 },
  { month: "Nov", actual: 35000, planned: 40000 },
  { month: "Dec", actual: 45000, planned: 50000 },
]

const plannedData = [
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 35000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 30000 },
  { month: "May", value: 42000 },
  { month: "Jun", value: 25000 },
]

const latestSales = [
  {
    product: "Macbook Pro",
    id: "ID 10-3290-08",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&h=40&fit=crop",
    customer: "Rodney Cannon",
    email: "rodney.cannon@gmail.com",
    delivery: "United Kingdom",
    address: "193 Cole Plains Suite 649, 891203",
    shipping: "$18.00",
    total: "$118.00",
    status: "Shipped",
    statusColor: "text-green-600 bg-green-50",
  },
  {
    product: "Dell Laptop",
    id: "ID 10-3456-18",
    img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=40&h=40&fit=crop",
    customer: "Mike Franklin",
    email: "mike.franklin@gmail.com",
    delivery: "United States",
    address: "619 Jeffrey Freeway Apt. 273",
    shipping: "$28.00",
    total: "$208.00",
    status: "Processing",
    statusColor: "text-yellow-600 bg-yellow-50",
  },
  {
    product: "Macbook Air",
    id: "ID 10-3786-23",
    img: "https://images.unsplash.com/photo-1611186871525-5e0e0c0d9498?w=40&h=40&fit=crop",
    customer: "Louis Franklin",
    email: "louis.franklin@gmail.com",
    delivery: "Germany",
    address: "200 Davis Estates Suite 621",
    shipping: "$18.00",
    total: "$118.00",
    status: "Processing",
    statusColor: "text-yellow-600 bg-yellow-50",
  },
]

const statCards = [
  {
    label: "Sales",
    sub: "Week comparison",
    value: "1.345",
    trend: "up",
    color: "bg-green-400",
  },
  {
    label: "Leads",
    sub: "Month comparison",
    value: "3.820",
    trend: "down",
    color: "bg-primary",
  },
  {
    label: "Income",
    sub: "Week comparison",
    value: "$690.00",
    trend: "up",
    color: "bg-red-400",
  },
]

function PeriodTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {["Day", "Week", "Month"].map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            active === t
              ? "bg-gray-100 text-gray-700 font-medium"
              : "text-gray-400 hover:text-gray-600"
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
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard2() {
  const [ordersPeriod, setOrdersPeriod] = useState("Month")
  const [salesPeriod, setSalesPeriod] = useState("Month")

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-900">{s.value}</span>
                {s.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            <div className={`h-1 rounded-full ${s.color} opacity-70`} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Orders Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Orders</p>
            <PeriodTabs active={ordersPeriod} onChange={setOrdersPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ordersData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="plannedGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#4F6EF7"
                strokeWidth={2}
                fill="url(#actualGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#4F6EF7" }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#34D399"
                strokeWidth={2}
                fill="url(#plannedGrad2)"
                dot={false}
                activeDot={{ r: 5, fill: "#34D399" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Planned Income */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Planned Income</p>
            <button className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={plannedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4F6EF7"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#plannedGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#4F6EF7" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Sales Table */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-800">Latest sales</p>
          <PeriodTabs active={salesPeriod} onChange={setSalesPeriod} />
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100">
              <th className="text-left pb-3 font-medium">Product</th>
              <th className="text-left pb-3 font-medium">Customer</th>
              <th className="text-left pb-3 font-medium">Delivery</th>
              <th className="text-left pb-3 font-medium">Shipping</th>
              <th className="text-left pb-3 font-medium">Total</th>
              <th className="text-left pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {latestSales.map((row, i) => (
              <tr key={i} className="text-xs">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={row.img}
                      alt={row.product}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{row.product}</p>
                      <p className="text-gray-400">{row.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <p className="font-medium text-gray-800">{row.customer}</p>
                  <p className="text-gray-400">{row.email}</p>
                </td>
                <td className="py-3">
                  <p className="font-medium text-gray-800">{row.delivery}</p>
                  <p className="text-gray-400">{row.address}</p>
                </td>
                <td className="py-3 font-medium text-gray-700">{row.shipping}</td>
                <td className="py-3 font-medium text-gray-700">{row.total}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}