import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import tasksApi from "../../api/tasks"
import employeesApi from "../../api/employees"

const initialForm = {
  title: "", description: "", priority: "medium",
  status: "pending", department: "", due_date: "",
  assigned_to: "", notes: "",
}

export default function TaskForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  useEffect(() => {
    employeesApi.list().then(({ data }) => setEmployees(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError("Title is required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await tasksApi.create(form)
      navigate("/tasks")
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Tasks</p>
        <h1 className="text-xl font-bold text-gray-900">New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Task Details</p>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Task title"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the task..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Priority", field: "priority", options: ["low", "medium", "high", "urgent"] },
              { label: "Status", field: "status", options: ["pending", "in_progress", "completed", "delayed"] },
              { label: "Department", field: "department", options: ["sales", "tech", "seo"] },
            ].map(({ label, field, options }) => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <div className="relative">
                  <select
                    value={form[field]}
                    onChange={set(field)}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9 capitalize"
                  >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((o) => (
                      <option key={o} value={o} className="capitalize">{o.replace("_", " ")}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={set("due_date")}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Assign To</label>
            <div className="relative">
              <select
                value={form.assigned_to}
                onChange={set("assigned_to")}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9"
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.full_name} — {emp.role_display}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Additional notes..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}