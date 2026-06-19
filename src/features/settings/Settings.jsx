import { useState } from "react"
import { Lock, User, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import useAuthStore from "../../store/authStore"
import authApi from "../../api/auth"

function PasswordInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState({ old_password: "", new_password: "", confirm_password: "" })
  const [show, setShow] = useState({ old: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: "", type: "" })

  const setField = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))
  const toggle   = (k) => setShow((p) => ({ ...p, [k]: !p[k] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg({ text: "", type: "" })

    if (form.new_password.length < 8) {
      setMsg({ text: "New password must be at least 8 characters.", type: "error" })
      return
    }
    if (form.new_password !== form.confirm_password) {
      setMsg({ text: "New password and confirm password do not match.", type: "error" })
      return
    }
    if (form.old_password === form.new_password) {
      setMsg({ text: "New password must be different from current password.", type: "error" })
      return
    }

    setLoading(true)
    try {
      const { data } = await authApi.changePassword(form.old_password, form.new_password)
      setMsg({ text: data.detail || "Password changed successfully.", type: "success" })
      setForm({ old_password: "", new_password: "", confirm_password: "" })
    } catch (err) {
      setMsg({
        text: err.response?.data?.detail || "Something went wrong.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Account</p>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-800">Profile</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">
              {user?.full_name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800">{user?.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-800">{(user?.roles || []).join(", ") || (user?.is_super_admin ? "Super Admin" : "—")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Department</p>
              <p className="text-sm font-medium text-gray-800">{user?.tenant?.name || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-800">Change Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={form.old_password}
            onChange={setField("old_password")}
            show={show.old}
            onToggle={() => toggle("old")}
            placeholder="Enter current password"
          />
          <PasswordInput
            label="New Password"
            value={form.new_password}
            onChange={setField("new_password")}
            show={show.new}
            onToggle={() => toggle("new")}
            placeholder="Min 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={form.confirm_password}
            onChange={setField("confirm_password")}
            show={show.confirm}
            onToggle={() => toggle("confirm")}
            placeholder="Re-enter new password"
          />

          {msg.text && (
            <div className={`flex items-center gap-2 text-sm ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {msg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {msg.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}