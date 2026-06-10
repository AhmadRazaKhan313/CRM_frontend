import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import superadminApi from "../../api/superadmin"

const STATUSES = ["active", "trial", "suspended", "cancelled"]
const PLANS = ["free", "starter", "pro", "enterprise"]

const statusConfig = {
  active: { label: "Active", class: "bg-green-50 text-green-600" },
  trial: { label: "Trial", class: "bg-yellow-50 text-yellow-600" },
  suspended: { label: "Suspended", class: "bg-red-50 text-red-500" },
  cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-500" },
}

const FEATURE_LABELS = {
  hrms: "HRMS",
  analytics: "Analytics",
  ai_assistant: "AI Assistant",
  multi_department: "Multi Department",
  custom_branding: "Custom Branding",
  api_access: "API Access",
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
    try {
      const { data } = await superadminApi.updateFeatures(id, { [feature]: value })
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
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Company Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Company Details</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Company Name", value: tenant.name },
                { label: "Email", value: tenant.email },
                { label: "Phone", value: tenant.phone || "—" },
                { label: "Slug", value: tenant.slug },
                { label: "Plan", value: tenant.plan },
                { label: "Users", value: tenant.user_count },
                { label: "Joined", value: new Date(tenant.created_at).toLocaleDateString() },
                { label: "Trial Ends", value: tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString() : "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Flags */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Feature Flags</p>
            <div className="space-y-3">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => {
                const enabled = tenant.features?.[key] ?? false
                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 capitalize">{key}</p>
                    </div>
                    <button
                      onClick={() => handleFeatureToggle(key, !enabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right */}
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
        </div>
      </div>
    </div>
  )
}