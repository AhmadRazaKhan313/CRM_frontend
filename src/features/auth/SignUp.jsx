import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"
import { Icon } from "@iconify/react"

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", terms: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.terms) {
      setError("Please agree to terms & conditions.")
      return
    }
    setLoading(true)
    setError("")
    try {
      navigate("/signin")
    } catch {
      setError("Something went wrong. Please try again.")
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
            Sign Up to getting started.
          </h2>
          <p className="text-sm text-gray-400 mt-3 mb-10">
            Enter your details to proceed further
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="border-b border-gray-200 pb-2">
              <label className="text-xs text-gray-400 block mb-1">Full name</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Craft UI"
                  required
                  className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                />
                <User className="text-gray-300 w-4 h-4 shrink-0" />
              </div>
            </div>

            <div className="border-b border-gray-200 pb-2">
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="support@craftui.com"
                  required
                  className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                />
                <Mail className="text-gray-300 w-4 h-4 shrink-0" />
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
                  placeholder="Start typing..."
                  required
                  className="w-full text-sm font-medium text-gray-800 placeholder-gray-300 outline-none bg-transparent"
                />
                <Lock className="text-gray-300 w-4 h-4 shrink-0" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${form.terms ? "border-primary bg-primary" : "border-gray-300"}`}>
                {form.terms && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-gray-600">I agree with terms & conditions</span>
            </label>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
              <Link
                to="/signin"
                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 mb-4">Or sign in with</p>
            <div className="flex justify-center gap-3">
              {socialProviders.map(({ name, icon }) => (
                <button
                  key={name}
                  title={name}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm flex items-center justify-center transition-all"
                >
                  <Icon icon={icon} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Blue Panel */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center rounded-l-[40px]">
        <div className="text-white text-center px-10">
          <div className="w-64 h-64 bg-white/10 rounded-2xl mx-auto flex items-center justify-center">
            <span className="text-white/40 text-sm">Illustration</span>
          </div>
        </div>
      </div>
    </div>
  )
}