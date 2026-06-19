import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import departmentsApi from "../../api/departments"
import employeesApi from "../../api/employees"

const initialForm = { name: "", description: "", head: "" }

export default function DepartmentForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [form,      setForm]      = useState(initialForm)
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")

  useEffect(() => {
    employeesApi.list().then(({ data }) => setEmployees(data)).catch(() => setEmployees([]))

    if (isEdit) {
      departmentsApi.get(id).then(({ data }) => {
        setForm({
          name:        data.name        || "",
          description: data.description || "",
          head:        data.head        || "",
        })
      })
    }
  }, [id])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Department name is required."); return }
    setLoading(true)
    setError("")

    // head khali ho to null bhejo
    const payload = { ...form, head: form.head || null }

    try {
      if (isEdit) {
        await departmentsApi.update(id, payload)
      } else {
        await departmentsApi.create(payload)
      }
      navigate("/departments")
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === "object" && detail !== null) {
        const first = Object.values(detail)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(isEdit ? `/departments/${id}` : "/departments")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-gray-400">Departments</p>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Department" : "Add Department"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Department Details</p>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Department Name *</label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Marketing, Development, Support"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                placeholder="What does this department do?"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Department Head</label>
              <div className="relative">
                <select
                  value={form.head}
                  onChange={set("head")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9"
                >
                  <option value="">Select department head (optional)</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/departments/${id}` : "/departments")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : isEdit ? "Update Department" : "Add Department"}
          </button>
        </div>
      </form>
    </div>
  )
}
