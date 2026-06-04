import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { User, Mail, Lock, Phone, ChevronDown } from "lucide-react"
import employeesApi from "../../api/employees"
import rolesApi from "../../api/roles"

const DEPARTMENTS = ["academic", "tech", "seo"]
const ROLES = [
  { value: "coo", label: "COO" },
  { value: "dept_head", label: "Department Head" },
  { value: "sales_director", label: "Sales Director" },
  { value: "lead_manager", label: "Lead Manager" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "lead_employee", label: "Lead Employee" },
  { value: "sales_employee", label: "Sales Employee" },
]

const initialForm = {
  full_name: "", email: "", phone: "",
  password: "", role: "", department: "", role_ids: []
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
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
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [customRoles, setCustomRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }))

  useEffect(() => {
    rolesApi.list().then(({ data }) => setCustomRoles(data))
    if (isEdit) {
      employeesApi.get(id).then(({ data }) => {
        setForm({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || "",
          password: "",
          role: data.role,
          department: data.department || "",
          role_ids: [],
        })
      })
    }
  }, [id])

  const toggleCustomRole = (roleId) => {
    setForm((prev) => {
      const ids = prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((r) => r !== roleId)
        : [...prev.role_ids, roleId]
      return { ...prev, role_ids: ids }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) {
      setError("Please select a system role.")
      return
    }
    setLoading(true)
    setError("")
    try {
      if (isEdit) {
        await employeesApi.update(id, {
          full_name: form.full_name,
          phone: form.phone,
          role: form.role,
          department: form.department,
        })
      } else {
        await employeesApi.create(form)
      }
      navigate("/employees")
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

        {/* Role & Department */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Role & Department</p>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="System Role"
              value={form.role}
              onChange={set("role")}
              options={ROLES}
              placeholder="Select role"
            />
            <SelectField
              label="Department"
              value={form.department}
              onChange={set("department")}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))}
              placeholder="Select department"
            />
          </div>
        </div>

        {/* Custom Roles */}
        {!isEdit && customRoles.length > 0 && (
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Custom Roles</p>
            <p className="text-xs text-gray-400 mb-3">Assign additional custom roles to this employee</p>
            <div className="flex flex-wrap gap-2">
              {customRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleCustomRole(role.id)}
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