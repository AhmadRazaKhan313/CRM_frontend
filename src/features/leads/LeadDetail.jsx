import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import leadsApi from "../../api/leads"
import employeesApi from "../../api/employees"

const statusConfig = {
  new:        { label: "New",        class: "bg-blue-50 text-blue-600" },
  contacted:  { label: "Contacted",  class: "bg-yellow-50 text-yellow-600" },
  interested: { label: "Interested", class: "bg-green-50 text-green-600" },
  follow_up:  { label: "Follow Up",  class: "bg-orange-50 text-orange-600" },
  converted:  { label: "Converted",  class: "bg-primary/10 text-primary" },
  rejected:   { label: "Rejected",   class: "bg-red-50 text-red-500" },
}

const activityIcons = {
  note: "lucide:file-text", call: "lucide:phone", email: "lucide:mail",
  whatsapp: "mdi:whatsapp", meeting: "lucide:calendar", status_change: "lucide:refresh-cw",
}
const activityColors = {
  note: "bg-gray-100 text-gray-500", call: "bg-green-50 text-green-600",
  email: "bg-blue-50 text-blue-600", whatsapp: "bg-emerald-50 text-emerald-600",
  meeting: "bg-purple-50 text-purple-600", status_change: "bg-orange-50 text-orange-600",
}
const sourceIcons = {
  instagram: "mdi:instagram", facebook: "mdi:facebook", linkedin: "mdi:linkedin",
  whatsapp: "mdi:whatsapp", website: "mdi:web", email: "mdi:email-outline", other: "mdi:dots-horizontal",
}

const STATUSES       = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]
const ACTIVITY_TYPES = ["note", "call", "email", "whatsapp", "meeting"]

const STAFF_PLATFORMS = [
  { key: "staff_insta_id",    icon: "mdi:instagram", label: "Insta",    color: "text-pink-500" },
  { key: "staff_fb_id",       icon: "mdi:facebook",  label: "Facebook", color: "text-blue-600" },
  { key: "staff_linkedin_id", icon: "mdi:linkedin",  label: "LinkedIn", color: "text-blue-400" },
  { key: "staff_whatsapp_id", icon: "mdi:whatsapp",  label: "WhatsApp", color: "text-green-500" },
]

const LEAD_PLATFORMS = [
  { key: "lead_insta_id",    icon: "mdi:instagram", label: "Instagram ID" },
  { key: "lead_fb_id",       icon: "mdi:facebook",  label: "Facebook ID" },
  { key: "lead_linkedin_id", icon: "mdi:linkedin",  label: "LinkedIn ID" },
  { key: "lead_whatsapp_no", icon: "mdi:whatsapp",  label: "WhatsApp No" },
]

function InfoRow({ label, value, icon }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
      </div>
    </div>
  )
}

function IdBadge({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
      <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xs font-medium text-gray-700">{value}</p>
      </div>
    </div>
  )
}

export default function LeadDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [lead, setLead]                     = useState(null)
  const [employees, setEmployees]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [activityNote, setActivityNote]     = useState("")
  const [activityType, setActivityType]     = useState("note")
  const [submitting, setSubmitting]         = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    leadsApi.get(id).then(({ data }) => setLead(data)).finally(() => setLoading(false))
    employeesApi.list().then(({ data }) => setEmployees(data))
  }, [id])

  const handleStatusChange = async (s) => {
    setStatusUpdating(true)
    try { const { data } = await leadsApi.update(id, { status: s }); setLead(data) }
    finally { setStatusUpdating(false) }
  }

  const handleAssign = async (userId) => {
    const { data } = await leadsApi.assign(id, userId)
    setLead(data)
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!activityNote.trim()) return
    setSubmitting(true)
    try {
      const { data } = await leadsApi.addActivity(id, { activity_type: activityType, note: activityNote })
      setLead((prev) => ({ ...prev, activities: [data, ...(prev.activities || [])] }))
      setActivityNote("")
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!lead) return null

  const hasStaffPlatforms = STAFF_PLATFORMS.some(({ key }) => lead[key])
  const hasLeadPlatforms  = LEAD_PLATFORMS.some(({ key }) => lead[key])

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/leads")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400">Leads</p>
            {lead.serial_no && (
              <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">#{lead.serial_no}</span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{lead.full_name}</h1>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[lead.status]?.class}`}>
          {statusConfig[lead.status]?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* ── Left 2/3 ── */}
        <div className="col-span-2 space-y-5">

          {/* ── STAFF SECTION — pehle ── */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-blue-700 mb-4">Staff Information</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InfoRow label="Staff Name" value={lead.staff_name} icon="lucide:user-check" />
              <InfoRow label="Staff ID"   value={lead.staff_id}   icon="lucide:badge" />
              <InfoRow label="Assigned To" value={lead.assigned_to_name}    icon="lucide:user" />
              <InfoRow label="Employee ID" value={lead.assigned_to_employee_id} icon="lucide:id-card" />
            </div>

            {/* Staff Platform IDs */}
            {hasStaffPlatforms && (
              <div className="pt-3 border-t border-blue-100">
                <p className="text-xs text-blue-500 font-medium mb-2">Staff Platform IDs Used</p>
                <div className="flex flex-wrap gap-2">
                  {STAFF_PLATFORMS.map(({ key, icon, label, color }) =>
                    lead[key] ? (
                      <div key={key} className="flex items-center gap-1.5 bg-white border border-blue-100 rounded-xl px-3 py-1.5">
                        <Icon icon={icon} className={`w-3.5 h-3.5 ${color}`} />
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-xs font-medium text-gray-700">{lead[key]}</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── LEAD INFO ── */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Lead Information</p>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Country"    value={lead.country}    icon="lucide:map-pin" />
              <InfoRow label="Department" value={lead.department} icon="lucide:layers" />
              <InfoRow label="Source"     value={lead.source}     icon="lucide:globe" />
              <InfoRow label="Phone"      value={lead.phone}      icon="lucide:phone" />
              <InfoRow label="Contact No" value={lead.contact_no} icon="lucide:smartphone" />
              <InfoRow label="Email"      value={lead.email}      icon="lucide:mail" />
              <InfoRow label="Company"    value={lead.company}    icon="lucide:building-2" />
              <InfoRow label="Created By" value={lead.created_by_name} icon="lucide:user-plus" />
              <InfoRow label="Added On"   value={new Date(lead.created_at).toLocaleDateString()} icon="lucide:calendar" />
            </div>

            {lead.platform_link && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1.5">Platform Link</p>
                <a href={lead.platform_link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Icon icon={sourceIcons[lead.source] || "mdi:link"} className="w-4 h-4" />
                  {lead.platform_link}
                </a>
              </div>
            )}

            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Lead Platform IDs */}
          {hasLeadPlatforms && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Lead Platform IDs</p>
              <div className="grid grid-cols-2 gap-2">
                {LEAD_PLATFORMS.map(({ key, icon, label }) => (
                  <IdBadge key={key} icon={icon} label={label} value={lead[key]} />
                ))}
              </div>
              {(lead.instagram_url || lead.facebook_url || lead.linkedin_url) && (
                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                  {[
                    { url: lead.instagram_url, icon: "mdi:instagram", label: "Instagram" },
                    { url: lead.facebook_url,  icon: "mdi:facebook",  label: "Facebook" },
                    { url: lead.linkedin_url,  icon: "mdi:linkedin",  label: "LinkedIn" },
                  ].filter(s => s.url).map(({ url, icon, label }) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <Icon icon={icon} className="w-3.5 h-3.5" />{label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Questionnaire */}
          {lead.questionnaire && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Questionnaire</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{lead.questionnaire}</p>
            </div>
          )}

          {/* Log Activity */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Log Activity</p>
            <form onSubmit={handleAddActivity}>
              <div className="flex gap-2 mb-3 flex-wrap">
                {ACTIVITY_TYPES.map((type) => (
                  <button key={type} type="button" onClick={() => setActivityType(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all capitalize ${
                      activityType === type ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}>
                    <Icon icon={activityIcons[type]} className="w-3.5 h-3.5" />
                    {type}
                  </button>
                ))}
              </div>
              <textarea value={activityNote} onChange={(e) => setActivityNote(e.target.value)}
                placeholder="Add a note, log a call, or record any interaction..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition resize-none" />
              <div className="flex justify-end mt-3">
                <button type="submit" disabled={submitting || !activityNote.trim()}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition disabled:opacity-50">
                  {submitting ? "Saving..." : "Log Activity"}
                </button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Activity Timeline</p>
            {!lead.activities?.length ? (
              <div className="text-center py-8">
                <Icon icon="lucide:activity" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lead.activities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activityColors[act.activity_type]}`}>
                      <Icon icon={activityIcons[act.activity_type]} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-gray-700 capitalize">{act.activity_type.replace("_", " ")}</p>
                        <p className="text-xs text-gray-400 shrink-0">
                          {new Date(act.created_at).toLocaleDateString()}{" "}
                          {new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{act.note}</p>
                      {act.created_by_name && <p className="text-xs text-gray-400 mt-0.5">by {act.created_by_name}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right 1/3 ── */}
        <div className="space-y-5">

          {/* Status */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || lead.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    lead.status === s ? statusConfig[s].class + " ring-1 ring-current" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}>
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Assign */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Assigned To</p>
            {lead.assigned_to_name ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{lead.assigned_to_name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.assigned_to_name}</p>
                  <p className="text-xs text-gray-400">{lead.assigned_to_employee_id}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-3">Not assigned yet</p>
            )}
            <div className="relative">
              <select onChange={(e) => e.target.value && handleAssign(e.target.value)} defaultValue=""
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white">
                <option value="">Reassign to...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Lead Meta */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Lead Info</p>
            <div className="space-y-2.5">
              {[
                { label: "Serial No",    value: lead.serial_no ? `#${lead.serial_no}` : "—" },
                { label: "Lead ID",      value: `#${lead.id}` },
                { label: "Department",   value: lead.department },
                { label: "Source",       value: lead.source },
                { label: "Created",      value: new Date(lead.created_at).toLocaleDateString() },
                { label: "Last Updated", value: new Date(lead.updated_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}