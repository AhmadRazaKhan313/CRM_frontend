import { useEffect, useState } from "react"
import { DollarSign, Pencil, Plus } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"
import useAuthStore from "../../store/authStore"
import hrmsApi from "../../api/hrms"

function SalaryModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      employee: "",
      basic_salary: "",
      house_allowance: "0",
      transport_allowance: "0",
      medical_allowance: "0",
      other_allowances: "0",
      tax_deduction: "0",
      provident_fund: "0",
      other_deductions: "0",
      effective_from: new Date().toISOString().split("T")[0],
    }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const gross =
    Number(form.basic_salary || 0) +
    Number(form.house_allowance || 0) +
    Number(form.transport_allowance || 0) +
    Number(form.medical_allowance || 0) +
    Number(form.other_allowances || 0)

  const deductions =
    Number(form.tax_deduction || 0) +
    Number(form.provident_fund || 0) +
    Number(form.other_deductions || 0)

  const net = gross - deductions

  const field = (label, key, placeholder = "0") => (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input
        type="number"
        min="0"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
      />
    </div>
  )

  const handleSubmit = async () => {
    if (!form.employee || !form.basic_salary) {
      setError("Employee ID and basic salary are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await onSave({ ...form })
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || JSON.stringify(e.response?.data) || "Failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">
          {initial ? "Edit Salary Structure" : "Set Salary Structure"}
        </h2>

        <div className="space-y-4">
          {!initial && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">Employee ID</label>
              <input
                value={form.employee}
                onChange={(e) => setForm((f) => ({ ...f, employee: e.target.value }))}
                placeholder="Enter employee ID"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
          )}

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
            Earnings
          </p>
          <div className="grid grid-cols-2 gap-3">
            {field("Basic Salary *", "basic_salary")}
            {field("House Allowance", "house_allowance")}
            {field("Transport Allowance", "transport_allowance")}
            {field("Medical Allowance", "medical_allowance")}
            {field("Other Allowances", "other_allowances")}
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
            Deductions
          </p>
          <div className="grid grid-cols-2 gap-3">
            {field("Tax Deduction", "tax_deduction")}
            {field("Provident Fund", "provident_fund")}
            {field("Other Deductions", "other_deductions")}
          </div>

          {field("Effective From", "effective_from")}

          {/* Live Preview */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Gross Salary</span>
              <span className="font-medium text-gray-800">${gross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Total Deductions</span>
              <span className="font-medium">-${deductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
              <span>Net Salary</span>
              <span>${net.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SalaryPage() {
  const user = useAuthStore((s) => s.user)
  const { salaryList, fetchSalaryList } = useHrmsStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const canManage = ["ceo", "coo"].includes(user?.role) || user?.is_super_admin
  const isEmployee = ["lead_employee", "sales_employee"].includes(user?.role)

  useEffect(() => {
    if (!isEmployee) fetchSalaryList()
    else {
      hrmsApi.payroll.getEmployeeSalary(user.id).then(({ data }) => {
        useHrmsStore.setState({ salaryList: [data] })
      }).catch(() => {})
    }
  }, [])

  const handleSave = async (data) => {
    await hrmsApi.payroll.setSalary(data)
    fetchSalaryList()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Salary Structures</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage employee salary breakdowns</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" />
            Set Salary
          </button>
        )}
      </div>

      {salaryList.length === 0 ? (
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <DollarSign className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">No salary structures defined</p>
          {canManage && (
            <p className="text-xs text-gray-300 mt-1">Click "Set Salary" to define one</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Basic</th>
                  <th className="px-5 py-3 font-medium">Allowances</th>
                  <th className="px-5 py-3 font-medium">Gross</th>
                  <th className="px-5 py-3 font-medium">Deductions</th>
                  <th className="px-5 py-3 font-medium font-semibold">Net Salary</th>
                  <th className="px-5 py-3 font-medium">Effective</th>
                  {canManage && <th className="px-5 py-3 font-medium"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salaryList.map((s) => {
                  const allowances =
                    Number(s.house_allowance) +
                    Number(s.transport_allowance) +
                    Number(s.medical_allowance) +
                    Number(s.other_allowances)

                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {s.employee_detail?.full_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.employee_detail?.employee_id} · {s.employee_detail?.department}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        ${Number(s.basic_salary).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        +${allowances.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-gray-700 font-medium">
                        ${Number(s.gross_salary).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-red-500">
                        -${Number(s.total_deductions).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        ${Number(s.net_salary).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {s.effective_from}
                      </td>
                      {canManage && (
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setEditTarget(s)}
                            className="w-8 h-8 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && (
        <SalaryModal onClose={() => setShowCreate(false)} onSave={handleSave} />
      )}
      {editTarget && (
        <SalaryModal
          initial={{ ...editTarget, employee: editTarget.employee_detail?.id }}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
