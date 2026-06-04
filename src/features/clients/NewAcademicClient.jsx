import { useState } from "react"
import { ChevronDown, Upload, X, CheckCircle2 } from "lucide-react"
import { Icon } from "@iconify/react"

const SERVICES = [
  "Assignment Help",
  "Thesis Support",
  "Dissertation",
  "Coursework",
  "Research Paper",
  "CIPD",
  "Project Assistance",
  "Career Services",
]

const ACADEMIC_LEVELS = ["High School", "Undergraduate", "Masters", "PhD"]

const CITATION_STYLES = ["APA", "IEEE", "Harvard", "MLA", "Chicago"]

const PLATFORMS = [
  { label: "Instagram", icon: "mdi:instagram" },
  { label: "Facebook", icon: "mdi:facebook" },
  { label: "WhatsApp", icon: "mdi:whatsapp" },
  { label: "LinkedIn", icon: "mdi:linkedin" },
  { label: "Website", icon: "mdi:web" },
  { label: "Email", icon: "mdi:email-outline" },
]

const PAYMENT_METHODS = ["Bank Transfer", "PayPal", "Wise", "Cash"]
const PAYMENT_STATUSES = ["Pending", "Partial", "Paid"]

const initialForm = {
  name: "",
  phone: "",
  email: "",
  country: "",
  platform: "",
  service: "",
  level: "",
  subject: "",
  topic: "",
  deadline: "",
  pages: "",
  wordCount: "",
  citation: "",
  references: "",
  notes: "",
  price: "",
  paymentStatus: "Pending",
  paymentMethod: "",
  files: [],
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
            <option key={o} value={o}>{o}</option>
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

export default function NewAcademicClient() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }))

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files)
    setForm((prev) => ({ ...prev, files: [...prev.files, ...picked] }))
  }

  const removeFile = (i) => {
    setForm((prev) => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: POST to /api/clients/academic/
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <CheckCircle2 className="w-14 h-14 text-green-500" />
        <p className="text-lg font-semibold text-gray-800">Client Added Successfully</p>
        <p className="text-sm text-gray-400">Academic client form has been submitted.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          Add Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">Academic Department</p>
        <h1 className="text-xl font-bold text-gray-900">New Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 — Basic Info */}
        <div className="bg-white rounded-2xl p-6">
          <SectionTitle number="1" title="Client Information" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" value={form.name} onChange={set("name")} placeholder="John Doe" />
            <InputField label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" />
            <InputField label="Email Address" value={form.email} onChange={set("email")} placeholder="john@gmail.com" type="email" />
            <InputField label="Country" value={form.country} onChange={set("country")} placeholder="United Kingdom" />
          </div>

          {/* Platform Source */}
          <div className="mt-4">
            <label className="block text-xs text-gray-400 mb-2">Platform Source</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set("platform")(label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    form.platform === label
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
        </div>

        {/* Section 2 — Service Details */}
        <div className="bg-white rounded-2xl p-6">
          <SectionTitle number="2" title="Service Details" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Service Type" value={form.service} onChange={set("service")} options={SERVICES} placeholder="Select service" />
            <SelectField label="Academic Level" value={form.level} onChange={set("level")} options={ACADEMIC_LEVELS} placeholder="Select level" />
            <InputField label="Subject" value={form.subject} onChange={set("subject")} placeholder="e.g. Business Management" />
            <InputField label="Topic" value={form.topic} onChange={set("topic")} placeholder="e.g. Supply Chain Analysis" />
          </div>
        </div>

        {/* Section 3 — Project Requirements */}
        <div className="bg-white rounded-2xl p-6">
          <SectionTitle number="3" title="Project Requirements" />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Deadline" value={form.deadline} onChange={set("deadline")} placeholder="" type="date" />
            <InputField label="Pages" value={form.pages} onChange={set("pages")} placeholder="e.g. 10" />
            <InputField label="Word Count" value={form.wordCount} onChange={set("wordCount")} placeholder="e.g. 2500" />
            <SelectField label="Citation Style" value={form.citation} onChange={set("citation")} options={CITATION_STYLES} placeholder="Select style" />
            <InputField label="Reference Count" value={form.references} onChange={set("references")} placeholder="e.g. 15" />
          </div>
        </div>

        {/* Section 4 — Files & Notes */}
        <div className="bg-white rounded-2xl p-6">
          <SectionTitle number="4" title="Files & Notes" />

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Attachments</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/2 transition-colors">
              <Upload className="w-5 h-5 text-gray-300 mb-1.5" />
              <span className="text-xs text-gray-400">Drop files here or <span className="text-primary">browse</span></span>
              <span className="text-xs text-gray-300 mt-0.5">PDF, DOC, Images supported</span>
              <input type="file" multiple className="hidden" onChange={handleFiles} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
            </label>

            {form.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:file" className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate max-w-xs">{f.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)}>
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Special Instructions</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              rows={3}
              placeholder="Any specific requirements or notes..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Section 5 — Payment */}
        <div className="bg-white rounded-2xl p-6">
          <SectionTitle number="5" title="Payment Details" />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Agreed Price" value={form.price} onChange={set("price")} placeholder="e.g. 120" />
            <SelectField label="Payment Method" value={form.paymentMethod} onChange={set("paymentMethod")} options={PAYMENT_METHODS} placeholder="Select method" />
            <div>
              <label className="block text-xs text-gray-400 mb-2">Payment Status</label>
              <div className="flex gap-2">
                {PAYMENT_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("paymentStatus")(s)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                      form.paymentStatus === s
                        ? s === "Paid"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : s === "Partial"
                          ? "border-yellow-400 bg-yellow-50 text-yellow-600"
                          : "border-red-300 bg-red-50 text-red-500"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Submit Client
          </button>
        </div>
      </form>
    </div>
  )
}