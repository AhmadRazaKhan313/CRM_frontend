import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { Plus, X } from "lucide-react"
import superadminApi from "../../api/superadmin"

const statusConfig = {
  active:    { label: "Active",    class: "bg-green-50 text-green-600" },
  trial:     { label: "Trial",     class: "bg-yellow-50 text-yellow-600" },
  suspended: { label: "Suspended", class: "bg-red-50 text-red-500" },
  cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-500" },
}

const planConfig = {
  free:       "bg-gray-100 text-gray-500",
  starter:    "bg-blue-50 text-blue-600",
  pro:        "bg-purple-50 text-purple-600",
  enterprise: "bg-orange-50 text-orange-600",
}

const emptyOrg = { name: "", slug: "", email: "", plan: "free" }

export default function TenantList() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]   = useState(emptyOrg)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const load = () => {
    setLoading(true)
    superadminApi.tenants()
      .then(({ data }) => setTenants(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((p) => {
      const next = { ...p, [field]: value }
      // name se slug auto-generate
      if (field === "name") {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      }
      return next
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await superadminApi.createOrganization(form)
      setShowModal(false)
      setForm(emptyOrg)
      load()
    } catch (err) {
      const detail = err.response?.data
      if (typeof detail === "object" && detail !== null) {
        const first = Object.values(detail)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError("Could not create organization.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Super Admin</p>
          <h1 className="text-xl font-bold text-gray-900">Organizations</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Organization
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:building-2" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No organizations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {tenants.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/superadmin/tenants/${t.id}`)}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{t.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      {t.is_primary && (
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{t.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${planConfig[t.plan] || planConfig.free}`}>
                    {t.plan}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusConfig[t.status]?.class || ""}`}>
                    {statusConfig[t.status]?.label || t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Organization Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">New Organization</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Organization Name *</label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Acme Corp"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={set("slug")}
                  placeholder="acme-corp"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="contact@acme.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Plan</label>
                <select
                  value={form.plan}
                  onChange={set("plan")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
