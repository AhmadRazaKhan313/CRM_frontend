import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import clientsApi from "../../api/clients"
import useClientStore from "../../store/clientStore"
import useAuthStore from "../../store/authStore"
import COUNTRIES from "../../utils/countries"

const DEPARTMENTS = ["sales", "tech", "seo"]
const TAGS = ["vip", "returning", "urgent", "high_budget"]

const SALES_SERVICES = ["Assignment Help", "Thesis Support", "Dissertation", "Coursework", "Research Paper", "CIPD", "Project Assistance", "Career Services"]
const ACADEMIC_LEVELS = ["High School", "Undergraduate", "Masters", "PhD"]
const CITATION_STYLES = ["APA", "IEEE", "Harvard", "MLA", "Chicago"]

const TECH_SERVICES = ["Business Website", "E-commerce Website", "Mobile App", "CRM System", "Dashboard", "API Integration", "Automation"]
const SEO_SERVICES = ["On-page SEO", "Off-page SEO", "Technical SEO", "Local SEO", "Content SEO"]

const initialForm = {
  full_name: "", email: "", phone: "", country: "", company: "",
  department: "", status: "active", tag: "", notes: "",
  assigned_to: "",
}

const initialSales = {
  service_type: "", academic_level: "", subject: "", topic: "",
  deadline: "", pages: "", word_count: "", citation_style: "",
  reference_count: "", special_instructions: "",
}

const initialTech = {
  service_type: "", platform: "", features: "",
  apis_needed: "", deadline: "", budget: "", references: "",
}

const initialSEO = {
  website_url: "", business_type: "", keywords: "",
  competitors: "", current_ranking: "", seo_goals: "", monthly_budget: "",
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
    />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
            {typeof o === "string" ? o.replace("_", " ") : o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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

export default function ClientForm() {
  const navigate = useNavigate()
  const { add } = useClientStore()
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState({ ...initialForm, department: user?.department || "" })
  const [sales, setSales] = useState(initialSales)
  const [tech, setTech] = useState(initialTech)
  const [seo, setSEO] = useState(initialSEO)
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountries, setShowCountries] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const f = (setter) => (field) => (e) => setter((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.department) { setError("Department is required."); return }
    setLoading(true)
    setError("")

    const payload = { ...form }
    if (form.department === "sales") payload.sales_detail = sales
    if (form.department === "tech") payload.tech_detail = tech
    if (form.department === "seo") payload.seo_detail = seo

    try {
      const { data } = await clientsApi.create(payload)
      add(data)
      navigate("/clients")
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
        <p className="text-xs text-gray-400 mb-0.5">Clients</p>
        <h1 className="text-xl font-bold text-gray-900">New Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Basic Info */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="1" title="Client Information" />
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name">
              <Input value={form.full_name} onChange={f(setForm)("full_name")} placeholder="John Doe" />
            </Field>
            <Field label="Email">
              <Input value={form.email} onChange={f(setForm)("email")} placeholder="john@gmail.com" type="email" />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={f(setForm)("phone")} placeholder="+1 234 567 890" />
            </Field>
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
        {COUNTRIES.filter((c) =>
          c.toLowerCase().includes(countrySearch.toLowerCase())
        ).map((c) => (
          <div
            key={c}
            onClick={() => {
              setForm((p) => ({ ...p, country: c }))
              setShowCountries(false)
              setCountrySearch("")
            }}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
              form.country === c ? "text-primary font-medium bg-primary/5" : "text-gray-700"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
            <Field label="Company">
              <Input value={form.company} onChange={f(setForm)("company")} placeholder="Company name (optional)" />
            </Field>
          </div>
        </div>

        {/* Section 2 — Department */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="2" title="Department & Status" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Department">
              <Select
                value={form.department}
                onChange={f(setForm)("department")}
                options={DEPARTMENTS}
                placeholder="Select department"
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={f(setForm)("status")}
                options={["active", "completed", "on_hold", "cancelled"]}
                placeholder="Select status"
              />
            </Field>
            <Field label="Tag">
              <Select
                value={form.tag}
                onChange={f(setForm)("tag")}
                options={TAGS}
                placeholder="Select tag"
              />
            </Field>
          </div>
        </div>

        {/* Section 3 — Sales Details */}
        {form.department === "sales" && (
          <div className="bg-white rounded-2xl p-5">
            <SectionTitle number="3" title="Sales Details" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service Type">
                <Select value={sales.service_type} onChange={f(setSales)("service_type")} options={SALES_SERVICES} placeholder="Select service" />
              </Field>
              <Field label="Academic Level">
                <Select value={sales.academic_level} onChange={f(setSales)("academic_level")} options={ACADEMIC_LEVELS} placeholder="Select level" />
              </Field>
              <Field label="Subject">
                <Input value={sales.subject} onChange={f(setSales)("subject")} placeholder="e.g. Business Management" />
              </Field>
              <Field label="Topic">
                <Input value={sales.topic} onChange={f(setSales)("topic")} placeholder="e.g. Supply Chain Analysis" />
              </Field>
              <Field label="Deadline">
                <Input value={sales.deadline} onChange={f(setSales)("deadline")} type="date" />
              </Field>
              <Field label="Pages">
                <Input value={sales.pages} onChange={f(setSales)("pages")} placeholder="e.g. 10" />
              </Field>
              <Field label="Word Count">
                <Input value={sales.word_count} onChange={f(setSales)("word_count")} placeholder="e.g. 2500" />
              </Field>
              <Field label="Citation Style">
                <Select value={sales.citation_style} onChange={f(setSales)("citation_style")} options={CITATION_STYLES} placeholder="Select style" />
              </Field>
              <Field label="Reference Count">
                <Input value={sales.reference_count} onChange={f(setSales)("reference_count")} placeholder="e.g. 15" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Special Instructions">
                <textarea
                  value={sales.special_instructions}
                  onChange={f(setSales)("special_instructions")}
                  rows={3}
                  placeholder="Any specific requirements..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
                />
              </Field>
            </div>
          </div>
        )}

        {/* Section 3 — Tech Details */}
        {form.department === "tech" && (
          <div className="bg-white rounded-2xl p-5">
            <SectionTitle number="3" title="Tech Project Details" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Service Type">
                <Select value={tech.service_type} onChange={f(setTech)("service_type")} options={TECH_SERVICES} placeholder="Select service" />
              </Field>
              <Field label="Platform">
                <Input value={tech.platform} onChange={f(setTech)("platform")} placeholder="e.g. React, Flutter, WordPress" />
              </Field>
              <Field label="Deadline">
                <Input value={tech.deadline} onChange={f(setTech)("deadline")} type="date" />
              </Field>
              <Field label="Budget ($)">
                <Input value={tech.budget} onChange={f(setTech)("budget")} placeholder="e.g. 1500" />
              </Field>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Features Required">
                <textarea value={tech.features} onChange={f(setTech)("features")} rows={2} placeholder="List the features needed..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
              <Field label="APIs Needed">
                <textarea value={tech.apis_needed} onChange={f(setTech)("apis_needed")} rows={2} placeholder="Any third-party APIs..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
              <Field label="References">
                <textarea value={tech.references} onChange={f(setTech)("references")} rows={2} placeholder="Reference websites or designs..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
            </div>
          </div>
        )}

        {/* Section 3 — SEO Details */}
        {form.department === "seo" && (
          <div className="bg-white rounded-2xl p-5">
            <SectionTitle number="3" title="SEO Details" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Website URL">
                <Input value={seo.website_url} onChange={f(setSEO)("website_url")} placeholder="https://example.com" />
              </Field>
              <Field label="Business Type">
                <Input value={seo.business_type} onChange={f(setSEO)("business_type")} placeholder="e.g. E-commerce, Local Business" />
              </Field>
              <Field label="Current Ranking">
                <Input value={seo.current_ranking} onChange={f(setSEO)("current_ranking")} placeholder="e.g. Page 3 for keyword X" />
              </Field>
              <Field label="Monthly Budget ($)">
                <Input value={seo.monthly_budget} onChange={f(setSEO)("monthly_budget")} placeholder="e.g. 500" />
              </Field>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Target Keywords">
                <textarea value={seo.keywords} onChange={f(setSEO)("keywords")} rows={2} placeholder="List target keywords..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
              <Field label="Competitors">
                <textarea value={seo.competitors} onChange={f(setSEO)("competitors")} rows={2} placeholder="List competitor websites..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
              <Field label="SEO Goals">
                <textarea value={seo.seo_goals} onChange={f(setSEO)("seo_goals")} rows={2} placeholder="What do you want to achieve?" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none" />
              </Field>
            </div>
          </div>
        )}

        {/* Section 4 — Notes */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="4" title="Additional Notes" />
          <textarea
            value={form.notes}
            onChange={f(setForm)("notes")}
            rows={3}
            placeholder="Any additional notes about this client..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  )
}