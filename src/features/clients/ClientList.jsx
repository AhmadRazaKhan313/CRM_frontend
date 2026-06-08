import { useEffect } from "react"
import { Plus, Search, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useClientStore from "../../store/clientStore"

const statusConfig = {
  active: { label: "Active", class: "bg-green-50 text-green-600" },
  completed: { label: "Completed", class: "bg-blue-50 text-blue-600" },
  on_hold: { label: "On Hold", class: "bg-yellow-50 text-yellow-600" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-500" },
}

const tagConfig = {
  vip: { label: "VIP", class: "bg-purple-50 text-purple-600" },
  returning: { label: "Returning", class: "bg-blue-50 text-blue-600" },
  urgent: { label: "Urgent", class: "bg-red-50 text-red-500" },
  high_budget: { label: "High Budget", class: "bg-green-50 text-green-600" },
}

const deptColors = {
  academic: "bg-blue-50 text-blue-600",
  tech: "bg-purple-50 text-purple-600",
  seo: "bg-green-50 text-green-600",
}

export default function ClientList() {
  const navigate = useNavigate()
  const { clients, loading, filters, setFilters, fetch } = useClientStore()

  useEffect(() => { fetch() }, [filters])

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    completed: clients.filter((c) => c.status === "completed").length,
    vip: clients.filter((c) => c.tag === "vip").length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Clients</h1>
        </div>
        <button
          onClick={() => navigate("/clients/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: stats.total, icon: "lucide:users", color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Active", value: stats.active, icon: "lucide:user-check", color: "text-green-600", bg: "bg-green-50" },
          { label: "Completed", value: stats.completed, icon: "lucide:check-circle", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "VIP", value: stats.vip, icon: "lucide:star", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-300 shrink-0" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && fetch()}
            placeholder="Search by name or email..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none"
          />
        </div>
        {[
          { key: "department", options: ["academic", "tech", "seo"], placeholder: "All Departments" },
          { key: "status", options: ["active", "completed", "on_hold", "cancelled"], placeholder: "All Status" },
          { key: "tag", options: ["vip", "returning", "urgent", "high_budget"], placeholder: "All Tags" },
        ].map(({ key, options, placeholder }) => (
          <div key={key} className="relative">
            <select
              value={filters[key]}
              onChange={(e) => setFilters({ [key]: e.target.value })}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white capitalize"
            >
              <option value="">{placeholder}</option>
              {options.map((o) => (
                <option key={o} value={o} className="capitalize">{o.replace("_", " ")}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:users" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No clients yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your first client to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Tag</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Assigned To</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Added</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{client.full_name}</p>
                    <p className="text-xs text-gray-400">{client.email || client.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${deptColors[client.department] || "bg-gray-100 text-gray-500"}`}>
                      {client.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusConfig[client.status]?.class}`}>
                      {statusConfig[client.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {client.tag ? (
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${tagConfig[client.tag]?.class}`}>
                        {tagConfig[client.tag]?.label}
                      </span>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-600">
                      {client.assigned_to_name || <span className="text-gray-300">Unassigned</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-400">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}