import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import leadsApi from "../../api/leads"
import employeesApi from "../../api/employees"
import useLeadStore from "../../store/leadStore"
import COUNTRIES from "../../utils/countries"
import useAuthStore from "../../store/authStore"

const SOURCES = ["instagram", "facebook", "linkedin", "whatsapp", "website", "email", "other"]
const DEPARTMENTS = ["sales", "tech", "seo"]
const STATUSES = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]
const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "mdi:instagram" },
  { value: "facebook", label: "Facebook", icon: "mdi:facebook" },
  { value: "linkedin", label: "LinkedIn", icon: "mdi:linkedin" },
  { value: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp" },
  { value: "website", label: "Website", icon: "mdi:web" },
  { value: "email", label: "Email", icon: "mdi:email-outline" },
  { value: "other", label: "Other", icon: "mdi:dots-horizontal" },
]

const initialForm = {
  full_name: "",
  country: "",
  questionnaire: "",
  platform_link: "",
  source: "",
  department: "",
  status: "new",
  notes: "",
  assigned_to: "",
  contacted_by: "",
}

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
        {number}
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

export default function LeadForm() {
 const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { add } = useLeadStore()
 const [form, setForm] = useState({
  ...initialForm,
  department: user?.department || "",
})
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountries, setShowCountries] = useState(false)


  useEffect(() => {
    employeesApi.list().then(({ data }) => setEmployees(data))
  }, [])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))
  const setVal = (field) => (val) => setForm((p) => ({ ...p, [field]: val }))

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name.trim()) {
      setError("Full name is required.")
      return
    }
    if (!form.department) {
      setError("Department is required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { data } = await leadsApi.create(form)
      add(data)
      navigate("/leads")
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Leads</p>
        <h1 className="text-xl font-bold text-gray-900">Add New Lead</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Basic Info */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="1" title="Lead Information" />
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
              <input
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="John Doe"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <label className="block text-xs text-gray-400 mb-1.5">Country</label>
              <div
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 cursor-pointer flex items-center justify-between"
                onClick={() => setShowCountries(!showCountries)}
              >
                <span className={form.country ? "text-gray-800" : "text-gray-300"}>
                  {form.country || "Select country"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              {showCountries && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 outline-none border border-gray-200 rounded-lg"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setVal("country")(c)
                          setShowCountries(false)
                          setCountrySearch("")
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${form.country === c ? "text-primary font-medium bg-primary/5" : "text-gray-700"}`}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Platform & Source */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="2" title="Platform & Source" />

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Platform Source</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVal("source")(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    form.source === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Icon icon={icon} className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Platform Link</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
              {form.source && (
                <Icon
                  icon={PLATFORMS.find((p) => p.value === form.source)?.icon || "mdi:link"}
                  className="w-4 h-4 text-gray-400 shrink-0"
                />
              )}
              <input
                value={form.platform_link}
                onChange={set("platform_link")}
                placeholder="https://instagram.com/username"
                className="flex-1 text-sm text-gray-800 placeholder-gray-300 outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Section 3 — Department & Status */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="3" title="Department & Status" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Department *</label>
              <div className="relative">
                <select
                  value={form.department}
                  onChange={set("department")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9 capitalize"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="capitalize">{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Status</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={set("status")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9 capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 — Questionnaire */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="4" title="Questionnaire" />
          <textarea
            value={form.questionnaire}
            onChange={set("questionnaire")}
            rows={5}
            placeholder="Client requirements, questionnaire answers, service needs..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Section 5 — Assignment */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="5" title="Assignment" />
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-xs text-gray-400 mb-1.5">Contacted By</label>
              <div className="relative">
                <select
                  value={form.contacted_by}
                  onChange={set("contacted_by")}
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
          </div>
        </div>

        {/* Section 6 — Notes */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="6" title="Additional Notes" />
          <textarea
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            placeholder="Any additional notes..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/leads")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Lead"}
          </button>
        </div>
      </form>
    </div>
  )
}