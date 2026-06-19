import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import employeesApi from "../../api/employees"
import rolesApi from "../../api/roles"
import departmentsApi from "../../api/departments"

const initialForm = {
  full_name: "", email: "", phone: "",
  password: "", role_ids: [],
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
      />
    </div>
  )
}

export default function EmployeeForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [form, setForm]     = useState(initialForm)
  const [roles, setRoles]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }))

  useEffect(() => {
    // Saare custom roles is organization ke
    rolesApi.list()
      .then(({ data }) => setRoles(data))
      .catch(() => setRoles([]))

    if (isEdit) {
      employeesApi.get(id).then(({ data }) => {
        setForm({
          full_name: data.full_name,
          email:     data.email,
          phone:     data.phone || "",
          password:  "",
          role_ids:  [],
        })
      })
    }
  }, [id])

  const toggleRole = (roleId) => {
    setForm((prev) => {
      const ids = prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((r) => r !== roleId)
        : [...prev.role_ids, roleId]
      return { ...prev, role_ids: ids }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isEdit && form.role_ids.length === 0) {
      setError("Please assign at least one role.")
      return
    }

    setLoading(true)
    setError("")
    try {
      if (isEdit) {
        await employeesApi.update(id, {
          full_name: form.full_name,
          phone:     form.phone,
        })
      } else {
        await employeesApi.create(form)
      }
      navigate("/employees")
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
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Employees</p>
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Personal Info</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" value={form.full_name} onChange={set("full_name")} placeholder="John Doe" />
            <InputField label="Email" value={form.email} onChange={set("email")} placeholder="john@company.com" type="email" />
            <InputField label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" />
            {!isEdit && (
              <InputField label="Password" value={form.password} onChange={set("password")} placeholder="Min 8 characters" type="password" />
            )}
          </div>
        </div>

        {/* Roles — custom roles only, required */}
        {!isEdit && (
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-1">Assign Roles <span className="text-red-500">*</span></p>
            <p className="text-xs text-gray-400 mb-3">Har employee ko kam se kam ek role chahiye. Role permissions decide karta hai.</p>

            {roles.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">No roles created yet.</p>
                <button
                  type="button"
                  onClick={() => navigate("/roles/new")}
                  className="mt-2 text-xs text-primary font-medium hover:underline"
                >
                  Create a role first
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRole(role.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      form.role_ids.includes(role.id)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isEdit && (
          <div className="bg-white rounded-2xl p-5">
            <p className="text-xs text-gray-400">
              Roles ko edit karne ke liye employee detail page pe jao.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  )
}
