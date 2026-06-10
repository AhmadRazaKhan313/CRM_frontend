import { useEffect, useState } from "react"
import { DollarSign, Plus, CheckCircle2, Users, TrendingUp } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"
import useAuthStore from "../../store/authStore"

const STATUS_CONFIG = {
  draft:      { label: "Draft",     class: "bg-gray-100 text-gray-500" },
  processed:  { label: "Processed", class: "bg-yellow-50 text-yellow-600" },
  paid:       { label: "Paid",      class: "bg-green-50 text-green-600" },
}

function GenerateModal({ onClose, onGenerate }) {
  const now = new Date()
  const [form, setForm] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      await onGenerate(form)
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to generate payroll.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">Generate Payroll</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Month</label>
              <select value={form.month}
                onChange={(e) => setForm(f => ({ ...f, month: Number(e.target.value) }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Year</label>
              <select value={form.year}
                onChange={(e) => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Notes (optional)</label>
            <textarea value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-60">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  )
}

function PayrollRunDetail({ run, onMarkPaid, marking }) {
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gray-900">
            {months[run.month]} {run.year} Payroll
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${STATUS_CONFIG[run.status]?.class}`}>
              {STATUS_CONFIG[run.status]?.label}
            </span>
            <span className="text-xs text-gray-400">{run.total_employees} employees</span>
            <span className="text-xs text-gray-400">Net Total: <strong className="text-gray-700">${Number(run.total_net).toLocaleString()}</strong></span>
          </div>
        </div>
        {run.status === "processed" && (
          <button
            onClick={() => onMarkPaid(run.id)}
            disabled={marking}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Paid
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Basic</th>
                <th className="px-5 py-3 font-medium">Gross</th>
                <th className="px-5 py-3 font-medium">Deductions</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
                <th className="px-5 py-3 font-medium">Overtime</th>
                <th className="px-5 py-3 font-medium font-semibold">Net Salary</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {run.slips?.map((slip) => (
                <tr key={slip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{slip.employee_detail?.full_name}</p>
                    <p className="text-xs text-gray-400">{slip.employee_detail?.employee_id}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">${Number(slip.basic_salary).toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">${Number(slip.gross_salary).toLocaleString()}</td>
                  <td className="px-5 py-3 text-red-500">-${Number(slip.total_deductions).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-green-600">{slip.days_present}P</span>
                    <span className="text-xs text-gray-400 mx-1">/</span>
                    <span className="text-xs text-red-500">{slip.days_absent}A</span>
                  </td>
                  <td className="px-5 py-3 text-green-600 text-xs">
                    {slip.overtime_bonus > 0 ? `+$${Number(slip.overtime_bonus).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3 font-bold text-gray-900">${Number(slip.net_salary).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${slip.is_paid ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {slip.is_paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function PayrollPage() {
  const user = useAuthStore((s) => s.user)
  const { payrollRuns, payrollLoading, fetchPayrollRuns, generatePayroll, markPayrollPaid } = useHrmsStore()
  const [showGenerate, setShowGenerate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [marking, setMarking] = useState(false)

  const isEmployee = ["lead_employee", "sales_employee"].includes(user?.role)
  const canManage = ["ceo", "coo"].includes(user?.role) || user?.is_super_admin

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  useEffect(() => { fetchPayrollRuns() }, [])

  useEffect(() => {
    if (payrollRuns.length && !selected) setSelected(payrollRuns[0])
  }, [payrollRuns])

  const handleMarkPaid = async (id) => {
    setMarking(true)
    try {
      await markPayrollPaid(id)
      fetchPayrollRuns()
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-400 mt-0.5">Monthly payroll management</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowGenerate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" />
            Generate Payroll
          </button>
        )}
      </div>

      {payrollLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : payrollRuns.length === 0 ? (
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <DollarSign className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">No payroll runs yet</p>
          {canManage && (
            <p className="text-xs text-gray-300 mt-1">Click "Generate Payroll" to create the first one</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {/* Left — Payroll Run List */}
          <div className="col-span-1 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">Payroll Runs</p>
            {payrollRuns.map((run) => (
              <button
                key={run.id}
                onClick={() => setSelected(run)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selected?.id === run.id
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-semibold">{months[run.month]} {run.year}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-medium ${selected?.id === run.id ? "text-white/70" : "text-gray-400"}`}>
                    {run.total_employees} employees
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                    selected?.id === run.id
                      ? "bg-white/20 text-white"
                      : STATUS_CONFIG[run.status]?.class
                  }`}>
                    {STATUS_CONFIG[run.status]?.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right — Run Detail */}
          <div className="col-span-3">
            {selected ? (
              <PayrollRunDetail run={selected} onMarkPaid={handleMarkPaid} marking={marking} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Select a payroll run
              </div>
            )}
          </div>
        </div>
      )}

      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          onGenerate={generatePayroll}
        />
      )}
    </div>
  )
}
