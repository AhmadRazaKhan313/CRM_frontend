import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import departmentsApi from "../../api/departments"
import employeesApi from "../../api/employees"
import useDepartmentStore from "../../store/departmentStore"

const TYPES = ["sales", "tech", "seo"]

const typeIcons = {
  sales: "lucide:trending-up",
  tech:  "lucide:code-2",
  seo:   "lucide:search",
}

const initialForm = { name: "", type: "", description: "", head: "" }

export default function DepartmentForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const { add, update } = useDepartmentStore()
  const [form,      setForm]      = useState(initialForm)
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")

  useEffect(() => {
    employeesApi.list().then(({ data }) => setEmployees(data))

    // ✅ Edit mode — load existing data
    if (isEdit) {
      departmentsApi.get(id).then(({ data }) => {
        setForm({
          name:        data.name        || "",
          type:        data.type        || "",
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
    if (!form.type)        { setError("Department type is required."); return }
    setLoading(true)
    setError("")
    try {
      if (isEdit) {
        const { data } = await departmentsApi.update(id, form)
        update(id, data)
      } else {
        const { data } = await departmentsApi.create(form)
        add(data)
      }
      navigate("/departments")
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === "object") {
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
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">1</div>
            <p className="text-sm font-semibold text-gray-800">Basic Information</p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Department Name *</label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Tech Department"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Department Type *</label>
              <div className="flex gap-3">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all capitalize flex-1 justify-center ${
                      form.type === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Icon icon={typeIcons[type]} className="w-4 h-4" />
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
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
          </div>
        </div>

        {/* Head Assignment */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">2</div>
            <p className="text-sm font-semibold text-gray-800">Department Head</p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="relative">
            <select
              value={form.head}
              onChange={set("head")}
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9"
            >
              <option value="">Select department head (optional)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} — {emp.role_display}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
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