import { useEffect } from "react"
import { Plus, Search, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useLeadStore from "../../store/leadStore"

const STATUS_OPTIONS = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]
const DEPARTMENTS = ["sales", "tech", "seo"]
const SOURCES = ["instagram", "facebook", "linkedin", "whatsapp", "website", "email", "other"]

const statusConfig = {
  new: { label: "New", class: "bg-blue-50 text-blue-600" },
  contacted: { label: "Contacted", class: "bg-yellow-50 text-yellow-600" },
  interested: { label: "Interested", class: "bg-green-50 text-green-600" },
  follow_up: { label: "Follow Up", class: "bg-orange-50 text-orange-600" },
  converted: { label: "Converted", class: "bg-primary/10 text-primary" },
  rejected: { label: "Rejected", class: "bg-red-50 text-red-500" },
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

export default function LeadList() {
  const navigate = useNavigate()
  const { leads, loading, filters, setFilters, fetch } = useLeadStore()

  useEffect(() => { fetch() }, [filters])

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    interested: leads.filter((l) => l.status === "interested").length,
    converted: leads.filter((l) => l.status === "converted").length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        </div>
        <button
          onClick={() => navigate("/leads/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Leads", value: stats.total, icon: "lucide:users", color: "text-gray-600" },
          { label: "New", value: stats.new, icon: "lucide:user-plus", color: "text-blue-600" },
          { label: "Interested", value: stats.interested, icon: "lucide:star", color: "text-green-600" },
          { label: "Converted", value: stats.converted, icon: "lucide:check-circle", color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
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
          { key: "status", options: STATUS_OPTIONS, placeholder: "All Status" },
          { key: "department", options: DEPARTMENTS, placeholder: "All Departments" },
          { key: "source", options: SOURCES, placeholder: "All Sources" },
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
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:users" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first lead to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Lead</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Source</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Assigned To</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Created</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{lead.full_name}</p>
                    <p className="text-xs text-gray-400">{lead.email || lead.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Icon icon={sourceIcons[lead.source] || "mdi:dots-horizontal"} className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600 capitalize">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-600 capitalize">{lead.department}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusConfig[lead.status]?.class}`}>
                      {statusConfig[lead.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-600">
                      {lead.assigned_to_name || <span className="text-gray-300">Unassigned</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View"
                      >
                        <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/leads/${lead.id}/edit`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                      </button>
                    </div>
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