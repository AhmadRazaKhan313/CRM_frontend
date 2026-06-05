import { useEffect } from "react"
import { Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useReportStore from "../../store/reportStore"

const statusConfig = {
  submitted: { label: "Submitted", class: "bg-blue-50 text-blue-600" },
  reviewed: { label: "Reviewed", class: "bg-green-50 text-green-600" },
  flagged: { label: "Flagged", class: "bg-red-50 text-red-500" },
}

export default function ReportList() {
  const navigate = useNavigate()
  const { reports, loading, filters, setFilters, fetch } = useReportStore()

  useEffect(() => { fetch() }, [filters])

  const stats = {
    total: reports.length,
    submitted: reports.filter((r) => r.status === "submitted").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    flagged: reports.filter((r) => r.status === "flagged").length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Daily Reports</h1>
        </div>
        <button
          onClick={() => navigate("/reports/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Report
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: stats.total, icon: "lucide:file-text", color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Submitted", value: stats.submitted, icon: "lucide:send", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Reviewed", value: stats.reviewed, icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
          { label: "Flagged", value: stats.flagged, icon: "lucide:flag", color: "text-red-500", bg: "bg-red-50" },
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
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ date: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-primary"
        />
        {[
          { key: "department", options: ["academic", "tech", "seo"], placeholder: "All Departments" },
          { key: "status", options: ["submitted", "reviewed", "flagged"], placeholder: "All Status" },
        ].map(({ key, options, placeholder }) => (
          <div key={key} className="relative">
            <select
              value={filters[key]}
              onChange={(e) => setFilters({ [key]: e.target.value })}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white capitalize"
            >
              <option value="">{placeholder}</option>
              {options.map((o) => (
                <option key={o} value={o} className="capitalize">{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
        {filters.date || filters.department || filters.status ? (
          <button
            onClick={() => setFilters({ date: "", department: "", status: "" })}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 border border-gray-200 rounded-xl transition-colors"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:file-text" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No reports found</p>
            <p className="text-xs text-gray-400 mt-1">Submit your first daily report</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Leads</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Calls</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Conversions</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{report.employee_name}</p>
                    <p className="text-xs text-gray-400">{report.employee_role}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-700">
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-600 capitalize">{report.department}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-gray-800">{report.total_leads}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-gray-800">{report.total_calls}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-gray-800">{report.total_conversions}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusConfig[report.status]?.class}`}>
                      {statusConfig[report.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/reports/${report.id}`)}
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