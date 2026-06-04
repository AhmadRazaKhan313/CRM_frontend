import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Building2, Mail, Lock, User, Phone } from "lucide-react"
import { Icon } from "@iconify/react"
import tenantApi from "../../api/tenant"
import useAuthStore from "../../store/authStore"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  admin_name: "",
  password: "",
  confirm_password: "",
}

export default function TenantRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill all company details.")
      return
    }
    setError("")
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { data } = await tenantApi.register(form)
      useAuthStore.getState().setAuth(data.user, data.access, data.refresh)
      navigate("/dashboard")
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
    <div className="min-h-screen flex font-sans">
      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step >= s ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-10 h-0.5 transition-colors ${step > s ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
            ))}
            <span className="text-xs text-gray-400 ml-2">
              {step === 1 ? "Company Info" : "Admin Account"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-1">
            {step === 1 ? "Set up your company." : "Create admin account."}
          </h1>
          <p className="text-sm text-gray-400 mt-2 mb-8">
            {step === 1 ? "Enter your company details to get started." : "This will be the CEO account for your CRM."}
          </p>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-7">
              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Company Name</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Decibels Agency"
                    required
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <Building2 className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Company Email</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="hello@decibels.com"
                    required
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <Mail className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Phone Number</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <Phone className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Your Full Name</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    name="admin_name"
                    value={form.admin_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <User className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Password</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    required
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <Lock className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-2">
                <label className="text-xs text-gray-400 block mb-1">Confirm Password</label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="password"
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    required
                    className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                  />
                  <Lock className="text-gray-300 w-4 h-4 shrink-0" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Blue Panel */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center rounded-l-[40px]">
        <div className="text-center px-10">
          <Icon icon="lucide:building-2" className="w-20 h-20 text-white/30 mx-auto mb-4" />
          <p className="text-white font-semibold text-xl">Start your free trial</p>
          <p className="text-white/50 text-sm mt-2">14 days free — no credit card required</p>
        </div>
      </div>
    </div>
  )
}