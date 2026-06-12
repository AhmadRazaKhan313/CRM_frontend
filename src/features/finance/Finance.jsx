import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, TrendingDown } from "lucide-react"
import { Icon } from "@iconify/react"
import financeApi from "../../api/finance"

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon icon={icon} className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Finance() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    financeApi.overview().then(({ data }) => setOverview(data)).finally(() => setLoading(false))
  }, [])

  const fmt = (val) => parseFloat(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Finance</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/finance/expenses/new")}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50">
            <TrendingDown className="w-3.5 h-3.5" /> Add Expense
          </button>
          <button onClick={() => navigate("/finance/invoices/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {overview && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Invoiced" value={`$${fmt(overview.total_invoiced)}`} icon="lucide:file-text" color="bg-blue-50 text-blue-500" sub={`${overview.invoice_count} invoices`} />
          <StatCard label="Total Paid"     value={`$${fmt(overview.total_paid)}`}     icon="lucide:check-circle" color="bg-green-50 text-green-500" />
          <StatCard label="Overdue"        value={`$${fmt(overview.total_overdue)}`}  icon="lucide:alert-circle" color="bg-red-50 text-red-500" sub={`${overview.overdue_count} invoices`} />
          <StatCard label="Net Revenue"    value={`$${fmt(overview.net_revenue)}`}    icon="lucide:trending-up" color="bg-primary/10 text-primary" sub={`After $${fmt(overview.total_expenses)} expenses`} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div onClick={() => navigate("/finance/invoices")} className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon icon="lucide:file-text" className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Invoices</p>
              <p className="text-xs text-gray-400">{overview?.invoice_count || 0} total</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Manage client invoices, track payments</p>
        </div>
        <div onClick={() => navigate("/finance/expenses")} className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Icon icon="lucide:trending-down" className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Expenses</p>
              <p className="text-xs text-gray-400">{overview?.expense_count || 0} total</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Track company expenses by category</p>
        </div>
      </div>
    </div>
  )
}
