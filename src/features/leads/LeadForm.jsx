import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import leadsApi from "../../api/leads"

const SOURCES = ["instagram", "facebook", "linkedin", "whatsapp", "website", "email", "other"]
const DEPARTMENTS = ["sales", "tech", "seo"]
const STATUSES = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]

const initialForm = {
  full_name: "", email: "", phone: "", country: "", company: "",
  source: "", department: "", status: "new", service_interest: "",
  notes: "", instagram_url: "", facebook_url: "", linkedin_url: "",
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

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9 capitalize"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="capitalize">{o.replace("_", " ")}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
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
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.source || !form.department) {
      setError("Source and department are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await leadsApi.create(form)
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
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="1" title="Contact Information" />
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" value={form.full_name} onChange={set("full_name")} placeholder="John Doe" />
            <InputField label="Email" value={form.email} onChange={set("email")} placeholder="john@gmail.com" type="email" />
            <InputField label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" />
            <InputField label="Country" value={form.country} onChange={set("country")} placeholder="United Kingdom" />
            <InputField label="Company" value={form.company} onChange={set("company")} placeholder="Company name (optional)" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="2" title="Lead Details" />
          <div className="grid grid-cols-3 gap-4">
            <SelectField label="Source" value={form.source} onChange={set("source")} options={SOURCES} placeholder="Select source" />
            <SelectField label="Department" value={form.department} onChange={set("department")} options={DEPARTMENTS} placeholder="Select department" />
            <SelectField label="Status" value={form.status} onChange={set("status")} options={STATUSES} placeholder="Select status" />
          </div>
          <div className="mt-4">
            <InputField label="Service Interest" value={form.service_interest} onChange={set("service_interest")} placeholder="e.g. Website Development, Thesis Help" />
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="3" title="Social Profiles" />
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Instagram URL", field: "instagram_url", icon: "mdi:instagram", placeholder: "instagram.com/username" },
              { label: "Facebook URL", field: "facebook_url", icon: "mdi:facebook", placeholder: "facebook.com/username" },
              { label: "LinkedIn URL", field: "linkedin_url", icon: "mdi:linkedin", placeholder: "linkedin.com/in/username" },
            ].map(({ label, field, icon, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5">
                  <Icon icon={icon} className="w-4 h-4 text-gray-300 shrink-0" />
                  <input
                    value={form[field]}
                    onChange={(e) => set(field)(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 text-sm text-gray-800 placeholder-gray-300 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="4" title="Notes" />
          <textarea
            value={form.notes}
            onChange={(e) => set("notes")(e.target.value)}
            rows={3}
            placeholder="Any additional notes about this lead..."
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