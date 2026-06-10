import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import { Icon } from "@iconify/react"
import auth from "../../api/auth"
import useAuthStore from "../../store/authStore"
import useFeatureStore from "../../store/featureStore"

export default function SignIn() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "", remember: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data } = await auth.login(form.email, form.password)

      // Auth store update
      useAuthStore.getState().setAuth(data.user, data.access, data.refresh)

      // ✅ Feature flags store mein load karo
      // data.user.tenant?.features API response mein aata hai
      useFeatureStore.getState().setFlags(data.user?.tenant?.features ?? {})

      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  const socialProviders = [
    { name: "Twitter", icon: "prime:twitter" },
    { name: "Google", icon: "flat-color-icons:google" },
    { name: "Facebook", icon: "logos:facebook" },
  ]

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-1">
            Welcome to our CRM.
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 leading-snug">
            Sign In to see latest updates.
          </h2>
          <p className="text-sm text-gray-400 mt-3 mb-10">
            Enter your details to proceed further
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="border-b border-gray-200 pb-2">
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="flex-1 text-sm outline-none text-gray-800 bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="border-b border-gray-200 pb-2">
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 text-sm outline-none text-gray-800 bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-primary"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-2xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-xs text-gray-400 mb-4">Or continue with</p>
            <div className="flex justify-center gap-4">
              {socialProviders.map(({ name, icon }) => (
                <button
                  key={name}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <Icon icon={icon} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center">
        <div className="text-center px-12">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon icon="solar:chart-2-bold-duotone" className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Your CRM, Your Rules</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Manage leads, clients, and teams — all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}
