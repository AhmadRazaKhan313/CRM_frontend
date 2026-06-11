import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import leadsApi from "../../api/leads"
import employeesApi from "../../api/employees"
import useLeadStore from "../../store/leadStore"
import COUNTRIES from "../../utils/countries"
import useAuthStore from "../../store/authStore"

const DEPARTMENTS = ["sales", "tech", "seo"]

const STATUSES = [
  { value: "new",        label: "New" },
  { value: "contacted",  label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "follow_up",  label: "Follow Up" },
  { value: "converted",  label: "Converted" },
  { value: "rejected",   label: "Rejected" },
]

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "mdi:instagram" },
  { value: "facebook",  label: "Facebook",  icon: "mdi:facebook" },
  { value: "linkedin",  label: "LinkedIn",  icon: "mdi:linkedin" },
  { value: "whatsapp",  label: "WhatsApp",  icon: "mdi:whatsapp" },
  { value: "website",   label: "Website",   icon: "mdi:web" },
  { value: "email",     label: "Email",     icon: "mdi:email-outline" },
  { value: "other",     label: "Other",     icon: "mdi:dots-horizontal" },
]

const STAFF_PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "mdi:instagram", idField: "staff_insta_id",    placeholder: "@ourpage" },
  { value: "facebook",  label: "Facebook",  icon: "mdi:facebook",  idField: "staff_fb_id",       placeholder: "fb.com/ourpage" },
  { value: "linkedin",  label: "LinkedIn",  icon: "mdi:linkedin",  idField: "staff_linkedin_id", placeholder: "company/page" },
  { value: "whatsapp",  label: "WhatsApp",  icon: "mdi:whatsapp",  idField: "staff_whatsapp_id", placeholder: "+92 300 0000000" },
]

const INITIAL_FORM = {
  serial_no: "",
  full_name: "",
  country: "",
  contact_no: "",
  platform_link: "",
  source: "",
  department: "",
  status: "new",
  notes: "",
  questionnaire: "",
  assigned_to: "",
  // Staff platform IDs
  staff_insta_id: "",
  staff_fb_id: "",
  staff_linkedin_id: "",
  staff_whatsapp_id: "",
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">
        {number}
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">
        {label}{required && " *"}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
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

function SelectInput({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-primary transition-colors pr-9 capitalize"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

// ─── Auto serial generator ─────────────────────────────────────────────────

function generateSerial() {
  const now  = new Date()
  const yy   = now.getFullYear().toString().slice(2)
  const mm   = String(now.getMonth() + 1).padStart(2, "0")
  const rand = String(Math.floor(Math.random() * 900) + 100)
  return `L-${yy}${mm}-${rand}`
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeadForm() {
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { add }  = useLeadStore()

  const [form, setForm]                   = useState({ ...INITIAL_FORM, department: user?.department || "" })
  const [employees, setEmployees]         = useState([])
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState("")
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountries, setShowCountries] = useState(false)
  const [activeStaffPlatforms, setActiveStaffPlatforms] = useState(new Set())

  useEffect(() => {
    employeesApi.list().then(({ data }) => setEmployees(data))
  }, [])

  const set    = (field) => (e)   => setForm((p) => ({ ...p, [field]: e.target.value }))
  const setVal = (field) => (val) => setForm((p) => ({ ...p, [field]: val }))

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const toggleStaffPlatform = (value) => {
    setActiveStaffPlatforms((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name.trim()) { setError("Full name is required."); return }
    if (!form.department)       { setError("Department is required."); return }
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
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Leads</p>
        <h1 className="text-xl font-bold text-gray-900">Add New Lead</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Section 1 — Basic Info ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="1" title="Lead Information" />
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Serial No with auto-generate */}
            <Field label="Serial No">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.serial_no}
                  onChange={set("serial_no")}
                  placeholder="e.g. L-2506-042"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setVal("serial_no")(generateSerial())}
                  className="shrink-0 px-3 py-2.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors whitespace-nowrap"
                >
                  ⟳ Auto
                </button>
              </div>
            </Field>

            {/* Full Name */}
            <Field label="Full Name" required>
              <TextInput
                value={form.full_name}
                onChange={set("full_name")}
                placeholder="John Doe"
              />
            </Field>

            {/* Contact No */}
            <Field label="Contact Number">
              <TextInput
                value={form.contact_no}
                onChange={set("contact_no")}
                placeholder="+92 300 0000000"
                type="tel"
              />
            </Field>

            {/* Country */}
            <Field label="Country">
              <div className="relative">
                <div
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between"
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
                          onClick={() => { setVal("country")(c); setShowCountries(false); setCountrySearch("") }}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${form.country === c ? "text-primary font-medium bg-primary/5" : "text-gray-700"}`}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Field>
          </div>
        </div>

        {/* ── Section 2 — Platform & Source ──────────────────────────── */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="2" title="Platform & Source" />

          {/* Platform pills */}
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

          {/* Platform link */}
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

        {/* ── Section 3 — Assignment & Staff ─────────────────────────── */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="3" title="Assignment & Staff" />

          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* Staff Name (employee who contacted) */}
            <Field label="Staff Name">
              <SelectInput value={form.staff_name} onChange={set("staff_name")}>
                <option value="">Select staff</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} — {emp.employee_id}
                  </option>
                ))}
              </SelectInput>
            </Field>

            {/* Staff Platform IDs — pill select */}
            <Field label="Staff ID">
              <div className="flex flex-wrap gap-2 mt-0.5">
                {STAFF_PLATFORMS.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleStaffPlatform(value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      activeStaffPlatforms.has(value)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Icon icon={icon} className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Assign To */}
            <Field label="Assign To">
              <SelectInput value={form.assigned_to} onChange={set("assigned_to")}>
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} — {emp.employee_id}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          {/* Staff Platform ID inputs — only show for selected platforms */}
          {STAFF_PLATFORMS.some((p) => activeStaffPlatforms.has(p.value)) && (
            <div className="grid grid-cols-2 gap-4 pt-1">
              {STAFF_PLATFORMS.filter((p) => activeStaffPlatforms.has(p.value)).map(({ value, label, idField, placeholder }) => (
                <Field key={value} label={`Staff ${label} ID`}>
                  <TextInput
                    value={form[idField]}
                    onChange={set(idField)}
                    placeholder={placeholder}
                    type={value === "whatsapp" ? "tel" : "text"}
                  />
                </Field>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 4 — Department & Status ───────────────────────── */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="4" title="Department & Status" />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" required>
              <SelectInput value={form.department} onChange={set("department")}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="capitalize">{d}</option>
                ))}
              </SelectInput>
            </Field>

            <Field label="Status">
              <SelectInput value={form.status} onChange={set("status")}>
                {STATUSES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
        </div>

        {/* ── Section 5 — Questionnaire ──────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5">
          <SectionTitle number="5" title="Questionnaire" />
          <textarea
            value={form.questionnaire}
            onChange={set("questionnaire")}
            rows={5}
            placeholder="Client requirements, questionnaire answers, service needs..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* ── Section 6 — Notes ─────────────────────────────────────── */}
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

        {/* ── Actions ───────────────────────────────────────────────── */}
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