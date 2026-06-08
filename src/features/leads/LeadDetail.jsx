import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import leadsApi from "../../api/leads"
import employeesApi from "../../api/employees"

const statusConfig = {
  new: { label: "New", class: "bg-blue-50 text-blue-600" },
  contacted: { label: "Contacted", class: "bg-yellow-50 text-yellow-600" },
  interested: { label: "Interested", class: "bg-green-50 text-green-600" },
  follow_up: { label: "Follow Up", class: "bg-orange-50 text-orange-600" },
  converted: { label: "Converted", class: "bg-primary/10 text-primary" },
  rejected: { label: "Rejected", class: "bg-red-50 text-red-500" },
}

const activityIcons = {
  note: "lucide:file-text",
  call: "lucide:phone",
  email: "lucide:mail",
  whatsapp: "mdi:whatsapp",
  meeting: "lucide:calendar",
  status_change: "lucide:refresh-cw",
}

const activityColors = {
  note: "bg-gray-100 text-gray-500",
  call: "bg-green-50 text-green-600",
  email: "bg-blue-50 text-blue-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  meeting: "bg-purple-50 text-purple-600",
  status_change: "bg-orange-50 text-orange-600",
}

const sourceIcons = {
  instagram: "mdi:instagram",
  facebook: "mdi:facebook",
  linkedin: "mdi:linkedin",
  whatsapp: "mdi:whatsapp",
  website: "mdi:web",
  email: "mdi:email-outline",
  other: "mdi:dots-horizontal",
}

const STATUSES = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]
const ACTIVITY_TYPES = ["note", "call", "email", "whatsapp", "meeting"]

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lead, setLead] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [activityNote, setActivityNote] = useState("")
  const [activityType, setActivityType] = useState("note")
  const [submitting, setSubmitting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    leadsApi.get(id)
      .then(({ data }) => setLead(data))
      .finally(() => setLoading(false))
    employeesApi.list()
      .then(({ data }) => setEmployees(data))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      const { data } = await leadsApi.update(id, { status: newStatus })
      setLead(data)
    } finally {
      setStatusUpdating(false)
    }
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
      const { data } = await leadsApi.addActivity(id, {
        activity_type: activityType,
        note: activityNote,
      })
      setLead((prev) => ({
        ...prev,
        activities: [data, ...(prev.activities || [])],
      }))
      setActivityNote("")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!lead) return null

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/leads")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Leads</p>
          <h1 className="text-xl font-bold text-gray-900">{lead.full_name}</h1>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[lead.status]?.class}`}>
          {statusConfig[lead.status]?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-2 space-y-5">

          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Contact Information</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Country", value: lead.country, icon: "lucide:map-pin" },
                { label: "Department", value: lead.department, icon: "lucide:layers" },
                { label: "Source", value: lead.source, icon: "lucide:globe" },
                { label: "Contacted By", value: lead.contacted_by_name, icon: "lucide:phone" },
                { label: "Assigned To", value: lead.assigned_to_name, icon: "lucide:user" },
                { label: "Created By", value: lead.created_by_name, icon: "lucide:user-plus" },
                { label: "Added On", value: new Date(lead.created_at).toLocaleDateString(), icon: "lucide:calendar" },
              ].map(({ label, value, icon }) => value ? (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>

            {/* Platform Link */}
            {lead.platform_link && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1.5">Platform Link</p>
                <a
                  href={lead.platform_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Icon
                    icon={sourceIcons[lead.source] || "mdi:link"}
                    className="w-4 h-4"
                  />
                  {lead.platform_link}
                </a>
              </div>
            )}

            {/* Notes */}
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{lead.notes}</p>
              </div>
            )}
          </div>

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
              <div className="flex gap-2 mb-3">
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActivityType(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all capitalize ${
                      activityType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Icon icon={activityIcons[type]} className="w-3.5 h-3.5" />
                    {type}
                  </button>
                ))}
              </div>
              <textarea
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                placeholder="Add a note, log a call, or record any interaction..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submitting || !activityNote.trim()}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Log Activity"}
                </button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Activity Timeline</p>
            {lead.activities?.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="lucide:activity" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lead.activities?.map((act) => (
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
                      {act.created_by_name && (
                        <p className="text-xs text-gray-400 mt-0.5">by {act.created_by_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">

          {/* Status Update */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || lead.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    lead.status === s
                      ? statusConfig[s].class + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Assign Employee */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Assigned To</p>
            {lead.assigned_to_name ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {lead.assigned_to_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">{lead.assigned_to_name}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-3">Not assigned yet</p>
            )}
            <div className="relative">
              <select
                onChange={(e) => e.target.value && handleAssign(e.target.value)}
                defaultValue=""
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white"
              >
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
                { label: "Lead ID", value: `#${lead.id}` },
                { label: "Department", value: lead.department },
                { label: "Source", value: lead.source },
                { label: "Created", value: new Date(lead.created_at).toLocaleDateString() },
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