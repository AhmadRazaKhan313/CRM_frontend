import { useState } from "react"
import { useNavigate } from "react-router-dom"
import reportsApi from "../../api/reports"
import useReportStore from "../../store/reportStore"

const initialForm = {
  date: new Date().toISOString().split("T")[0],
  tasks_completed: "",
  leads_worked: "",
  clients_handled: "",
  problems_faced: "",
  tomorrow_plan: "",
  notes: "",
  total_leads: 0,
  total_calls: 0,
  total_conversions: 0,
}

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
        {number}
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
    />
  )
}

export default function ReportForm() {
  const navigate = useNavigate()
  const { add } = useReportStore()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.tasks_completed.trim()) {
      setError("Tasks completed is required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { data } = await reportsApi.create(form)
      add(data)
      navigate("/reports")
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === "object") {
        const first = Object.values(detail)[0]
        setError(Array.isArray(first) ? first[0] : first)
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Reports</p>
        <h1 className="text-xl font-bold text-gray-900">Daily Report</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Stats */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="1" title="Today's Numbers" />
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Report Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "Total Leads", field: "total_leads", icon: "lucide:user-plus" },
              { label: "Total Calls", field: "total_calls", icon: "lucide:phone" },
              { label: "Conversions", field: "total_conversions", icon: "lucide:check-circle" },
            ].map(({ label, field, icon }) => (
              <div key={field} className="bg-gray-50 rounded-xl p-4 text-center">
                <Icon icon={icon} className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <input
                  type="number"
                  min="0"
                  value={form[field]}
                  onChange={set(field)}
                  className="w-16 text-center text-lg font-bold text-gray-900 bg-transparent outline-none border-b border-gray-200 focus:border-primary"
                />
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — Work Summary */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <SectionTitle number="2" title="Work Summary" />
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Tasks Completed *</label>
            <Textarea
              value={form.tasks_completed}
              onChange={set("tasks_completed")}
              placeholder="What tasks did you complete today?"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Leads Worked On</label>
            <Textarea
              value={form.leads_worked}
              onChange={set("leads_worked")}
              placeholder="Which leads did you work on today?"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Clients Handled</label>
            <Textarea
              value={form.clients_handled}
              onChange={set("clients_handled")}
              placeholder="Which clients did you interact with?"
              rows={2}
            />
          </div>
        </div>

        {/* Section 3 — Issues & Plan */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <SectionTitle number="3" title="Issues & Tomorrow's Plan" />
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Problems Faced</label>
            <Textarea
              value={form.problems_faced}
              onChange={set("problems_faced")}
              placeholder="Any blockers or issues you faced today?"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Tomorrow's Plan</label>
            <Textarea
              value={form.tomorrow_plan}
              onChange={set("tomorrow_plan")}
              placeholder="What do you plan to do tomorrow?"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Additional Notes</label>
            <Textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Anything else to add?"
              rows={2}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  )
}