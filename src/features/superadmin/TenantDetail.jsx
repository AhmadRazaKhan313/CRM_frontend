import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import superadminApi from "../../api/superadmin"

const STATUSES = ["active", "trial", "suspended", "cancelled"]
const PLANS = ["free", "starter", "pro", "enterprise"]

const statusConfig = {
  active:    { label: "Active",    class: "bg-green-50 text-green-600" },
  trial:     { label: "Trial",     class: "bg-yellow-50 text-yellow-600" },
  suspended: { label: "Suspended", class: "bg-red-50 text-red-500" },
  cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-500" },
}

// ── Feature groups — grouped by category ─────────────────────
const FEATURE_GROUPS = [
  {
    label: "Core CRM Modules",
    description: "Basic CRM functionality — leads, clients, tasks, reports",
    color: "bg-blue-50 text-blue-600",
    flags: [
      { key: "leads_module",       label: "Leads",       desc: "Lead management & pipeline" },
      { key: "clients_module",     label: "Clients",     desc: "Client management & files" },
      { key: "tasks_module",       label: "Tasks",       desc: "Task assignment & tracking" },
      { key: "reports_module",     label: "Reports",     desc: "Daily reports & summaries" },
      { key: "departments_module", label: "Departments", desc: "Department management" },
    ],
  },
  {
    label: "Add-on Modules",
    description: "Extended features — can be turned on per plan",
    color: "bg-purple-50 text-purple-600",
    flags: [
      { key: "analytics",    label: "Analytics",    desc: "CEO dashboard & KPI tracking" },
      { key: "hrms",         label: "HRMS",         desc: "Attendance, leaves, payroll, shifts" },
      { key: "ai_assistant", label: "AI Assistant", desc: "AI-powered suggestions (coming soon)" },
    ],
  },
  {
    label: "Platform Features",
    description: "Infrastructure & customization options",
    color: "bg-gray-100 text-gray-600",
    flags: [
      { key: "multi_department", label: "Multi Department", desc: "Multiple departments support" },
      { key: "custom_branding",  label: "Custom Branding",  desc: "Logo & color customization" },
      { key: "api_access",       label: "API Access",       desc: "REST API & integrations" },
    ],
  },
]

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        enabled ? "bg-primary" : "bg-gray-200"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

export default function TenantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    superadminApi.getTenant(id)
      .then(({ data }) => setTenant(data))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      const { data } = await superadminApi.updateTenant(id, { status: newStatus })
      setTenant(data)
    } finally {
      setUpdating(false)
    }
  }

  const handlePlanChange = async (newPlan) => {
    setUpdating(true)
    try {
      const { data } = await superadminApi.updateTenant(id, { plan: newPlan })
      setTenant(data)
    } finally {
      setUpdating(false)
    }
  }

  const handleFeatureToggle = async (feature, value) => {
    // Optimistic update
    setTenant((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: value },
    }))
    try {
      const { data } = await superadminApi.updateFeatures(id, { [feature]: value })
      setTenant((prev) => ({ ...prev, features: data }))
    } catch (err) {
      // Revert on error
      setTenant((prev) => ({
        ...prev,
        features: { ...prev.features, [feature]: !value },
      }))
      console.error(err)
    }
  }

  // Enable/disable entire group at once
  const handleGroupToggle = async (flags, enableAll) => {
    const patch = {}
    flags.forEach(({ key }) => { patch[key] = enableAll })
    // Optimistic
    setTenant((prev) => ({
      ...prev,
      features: { ...prev.features, ...patch },
    }))
    try {
      const { data } = await superadminApi.updateFeatures(id, patch)
      setTenant((prev) => ({ ...prev, features: data }))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading || !tenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/superadmin/tenants")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Companies</p>
          <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[tenant.status]?.class}`}>
          {statusConfig[tenant.status]?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left — 2/3 */}
        <div className="col-span-2 space-y-5">

          {/* Company Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Company Details</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Company Name", value: tenant.name },
                { label: "Email",        value: tenant.email },
                { label: "Phone",        value: tenant.phone || "—" },
                { label: "Slug",         value: tenant.slug },
                { label: "Plan",         value: tenant.plan },
                { label: "Users",        value: tenant.user_count },
                { label: "Joined",       value: new Date(tenant.created_at).toLocaleDateString() },
                { label: "Trial Ends",   value: tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString() : "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Flags — grouped */}
          {FEATURE_GROUPS.map((group) => {
            const allOn  = group.flags.every(({ key }) => tenant.features?.[key])
            const allOff = group.flags.every(({ key }) => !tenant.features?.[key])

            return (
              <div key={group.label} className="bg-white rounded-2xl p-5">
                {/* Group header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${group.color}`}>
                        {group.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{group.description}</p>
                  </div>
                  {/* Group bulk toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGroupToggle(group.flags, true)}
                      disabled={allOn}
                      className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      All ON
                    </button>
                    <button
                      onClick={() => handleGroupToggle(group.flags, false)}
                      disabled={allOff}
                      className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 font-medium hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      All OFF
                    </button>
                  </div>
                </div>

                {/* Individual flags */}
                <div className="space-y-1">
                  {group.flags.map(({ key, label, desc }) => {
                    const enabled = tenant.features?.[key] ?? false
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                        <ToggleSwitch
                          enabled={enabled}
                          onChange={(val) => handleFeatureToggle(key, val)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-5">
          {/* Status Control */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || tenant.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    tenant.status === s
                      ? statusConfig[s].class + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Control */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Plan</p>
            <div className="space-y-2">
              {PLANS.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePlanChange(p)}
                  disabled={updating || tenant.plan === p}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    tenant.plan === p
                      ? "bg-primary/10 text-primary ring-1 ring-primary"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Active modules summary */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Active Modules</p>
            <div className="space-y-1.5">
              {FEATURE_GROUPS.flatMap((g) => g.flags).map(({ key, label }) => {
                const on = tenant.features?.[key]
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-medium ${on ? "text-green-600" : "text-gray-300"}`}>
                      {on ? "ON" : "OFF"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
