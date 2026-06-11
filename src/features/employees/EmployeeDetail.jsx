import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Phone, Shield, Building2, BadgeCheck, Key } from "lucide-react"
import { Icon } from "@iconify/react"
import employeesApi from "../../api/employees"
import useAuthStore from "../../store/authStore"

const roleColors = {
  coo:            "bg-red-50 text-red-600",
  dept_head:      "bg-orange-50 text-orange-600",
  sales_director: "bg-yellow-50 text-yellow-600",
  lead_manager:   "bg-indigo-50 text-indigo-600",
  sales_manager:  "bg-teal-50 text-teal-600",
  lead_employee:  "bg-pink-50 text-pink-600",
  sales_employee: "bg-cyan-50 text-cyan-600",
}

const deptColors = {
  sales: "bg-blue-50 text-blue-600",
  tech:  "bg-purple-50 text-purple-600",
  seo:   "bg-green-50 text-green-600",
}

function InfoRow({ icon: Icon_, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <Icon_ className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  )
}

export default function EmployeeDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const user       = useAuthStore((s) => s.user)
  const [emp, setEmp]         = useState(null)
  const [loading, setLoading] = useState(true)

  // Password reset state
  const [newPassword,  setNewPassword]  = useState("")
  const [pwLoading,    setPwLoading]    = useState(false)
  const [pwMsg,        setPwMsg]        = useState({ text: "", type: "" })

  const canManage = user?.is_super_admin || ["ceo", "coo", "dept_head"].includes(user?.role)

  useEffect(() => {
    employeesApi.get(id)
      .then(({ data }) => setEmp(data))
      .catch(() => navigate("/employees"))
      .finally(() => setLoading(false))
  }, [id])

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPwMsg({ text: "Password must be at least 8 characters.", type: "error" })
      return
    }
    setPwLoading(true)
    setPwMsg({ text: "", type: "" })
    try {
      const { data } = await employeesApi.resetPassword(id, newPassword)
      setPwMsg({ text: data.detail, type: "success" })
      setNewPassword("")
    } catch (err) {
      setPwMsg({
        text: err.response?.data?.detail || "Something went wrong.",
        type: "error"
      })
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!emp) return null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/employees")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Employees</p>
          <h1 className="text-xl font-bold text-gray-900">{emp.full_name}</h1>
        </div>
        <div className={`w-2 h-2 rounded-full ${emp.is_active ? "bg-green-500" : "bg-gray-300"}`} />
        <span className="text-xs text-gray-500">{emp.is_active ? "Active" : "Inactive"}</span>
        {canManage && (
          <button
            onClick={() => navigate(`/employees/${id}/edit`)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left — profile card */}
        <div className="col-span-2 space-y-5">

          {/* Avatar + Name */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                {emp.avatar ? (
                  <img src={emp.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {emp.full_name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{emp.full_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {emp.department && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${deptColors[emp.department] || "bg-gray-100 text-gray-500"}`}>
                      {emp.department}
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${roleColors[emp.role] || "bg-gray-100 text-gray-500"}`}>
                    {emp.role_display}
                  </span>
                </div>
              </div>
            </div>

            <InfoRow icon={Mail}       label="Email"       value={emp.email} />
            <InfoRow icon={Phone}      label="Phone"       value={emp.phone} />
            <InfoRow icon={BadgeCheck} label="Employee ID" value={emp.employee_id} />
            <InfoRow icon={Building2}  label="Department"  value={emp.department} />
            <InfoRow icon={Shield}     label="Role"        value={emp.role_display} />
          </div>

          {/* Custom Roles */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Custom Roles</p>
            {emp.assigned_roles?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {emp.assigned_roles.map((r, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl font-medium">
                    {r}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No custom roles assigned</p>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Quick stats */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Info</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Joined</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {emp.created_at ? new Date(emp.created_at).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                  <p className="text-sm font-medium text-gray-800">{emp.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Reset — managers only */}
          {canManage && (
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-800">Reset Password</p>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Change this employee's password
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
                />
                {pwMsg.text && (
                  <p className={`text-xs ${pwMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {pwMsg.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pwLoading || !newPassword}
                  className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {pwLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}