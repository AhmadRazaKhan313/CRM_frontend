import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronDown, ChevronRight } from "lucide-react"
import rolesApi from "../../api/roles"

const MODULES = [
  "leads", "clients", "tasks", "reports", "finance",
  "employees", "departments", "delivery", "analytics",
  "hrms", "roles", "notifications", "settings",
]

export default function RoleForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ name: "", description: "" })
  const [allPerms, setAllPerms] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [expanded, setExpanded] = useState(new Set(["leads"]))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    rolesApi.permissions().then(({ data }) => setAllPerms(data))
    if (isEdit) {
      rolesApi.get(id).then(({ data }) => {
        setForm({ name: data.name, description: data.description })
        setSelected(new Set(data.permissions.map((p) => p.id)))
      })
    }
  }, [id])

  const byModule = MODULES.reduce((acc, mod) => {
    acc[mod] = allPerms.filter((p) => p.module === mod)
    return acc
  }, {})

  const togglePerm = (permId) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(permId) ? next.delete(permId) : next.add(permId)
      return next
    })
  }

  const toggleModule = (mod) => {
    const modPerms = byModule[mod].map((p) => p.id)
    const allSelected = modPerms.every((id) => selected.has(id))
    setSelected((prev) => {
      const next = new Set(prev)
      modPerms.forEach((id) => allSelected ? next.delete(id) : next.add(id))
      return next
    })
  }

  const toggleExpand = (mod) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(mod) ? next.delete(mod) : next.add(mod)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("Role name is required.")
      return
    }
    if (selected.size === 0) {
      setError("Select at least one permission.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const payload = { ...form, permission_ids: [...selected] }
      if (isEdit) {
        await rolesApi.update(id, payload)
      } else {
        await rolesApi.create(payload)
      }
      navigate("/roles")
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-0.5">Roles & Permissions</p>
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? "Edit Role" : "New Role"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Role Details</p>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Role Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Senior Sales Manager"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="What can this role do?"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Permissions</p>
            <span className="text-xs text-gray-400">{selected.size} selected</span>
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="space-y-2">
            {MODULES.map((mod) => {
              const modPerms = byModule[mod]
              if (!modPerms?.length) return null
              const allSelected = modPerms.every((p) => selected.has(p.id))
              const someSelected = modPerms.some((p) => selected.has(p.id))
              const isOpen = expanded.has(mod)

              return (
                <div key={mod} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                        onChange={() => toggleModule(mod)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">{mod}</span>
                      <span className="text-xs text-gray-400">
                        {modPerms.filter((p) => selected.has(p.id)).length}/{modPerms.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExpand(mod)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isOpen
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-4 py-3 grid grid-cols-2 gap-2">
                      {modPerms.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected.has(perm.id)}
                            onChange={() => togglePerm(perm.id)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-xs text-gray-600">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/roles")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  )
}