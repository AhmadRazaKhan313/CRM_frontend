import { useEffect, useRef, useState } from "react"
import { Plus, Search, ChevronDown, Upload, Download, FileDown, X, CheckCircle2, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useLeadStore from "../../store/leadStore"
import leadsApi from "../../api/leads"
import useAuthStore from "../../store/authStore"

const STATUS_OPTIONS = ["new", "contacted", "interested", "follow_up", "converted", "rejected"]
const DEPARTMENTS    = ["sales", "tech", "seo"]
const SOURCES        = ["instagram", "facebook", "linkedin", "whatsapp", "website", "email", "other"]

const statusConfig = {
  new:        { label: "New",        class: "bg-blue-50 text-blue-600" },
  contacted:  { label: "Contacted",  class: "bg-yellow-50 text-yellow-600" },
  interested: { label: "Interested", class: "bg-green-50 text-green-600" },
  follow_up:  { label: "Follow Up",  class: "bg-orange-50 text-orange-600" },
  converted:  { label: "Converted",  class: "bg-primary/10 text-primary" },
  rejected:   { label: "Rejected",   class: "bg-red-50 text-red-500" },
}

const sourceIcons = {
  instagram: "mdi:instagram",
  facebook:  "mdi:facebook",
  linkedin:  "mdi:linkedin",
  whatsapp:  "mdi:whatsapp",
  website:   "mdi:web",
  email:     "mdi:email-outline",
  other:     "mdi:dots-horizontal",
}

// Staff platform IDs — kaunsa icon kaunse field se
const STAFF_PLATFORMS = [
  { key: "staff_insta_id",    icon: "mdi:instagram", color: "text-pink-500" },
  { key: "staff_fb_id",       icon: "mdi:facebook",  color: "text-blue-600" },
  { key: "staff_linkedin_id", icon: "mdi:linkedin",  color: "text-blue-500" },
  { key: "staff_whatsapp_id", icon: "mdi:whatsapp",  color: "text-green-500" },
]

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement("a")
  a.href    = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Dropdown menu ─────────────────────────────────────────────
function DropdownMenu({ label, icon: BtnIcon, items, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-500 text-xs font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-60"
      >
        <BtnIcon className="w-3.5 h-3.5" />
        {label}
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden min-w-[150px]">
          {items.map((item) => (
            <button key={item.label} onClick={() => { item.onClick(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition text-left">
              <Icon icon={item.icon} className="w-3.5 h-3.5 text-gray-400" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Upload Result Modal ───────────────────────────────────────
function UploadResultModal({ result, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold text-gray-900">Upload Result</p>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{result.created}</p>
            <p className="text-xs text-green-600">Created</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{result.failed}</p>
            <p className="text-xs text-red-500">Failed</p>
          </div>
        </div>
        {result.errors?.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 max-h-48 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-600 mb-2">Errors:</p>
            {result.errors.map((e, i) => (
              <div key={i} className="mb-2">
                <p className="text-xs font-medium text-gray-700">Row {e.row}: {e.name}</p>
                {e.errors.map((err, j) => (
                  <p key={j} className="text-xs text-red-500 ml-2">• {err}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose}
          className="w-full mt-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition">
          Done
        </button>
      </div>
    </div>
  )
}

export default function LeadList() {
  const navigate     = useNavigate()
  const user         = useAuthStore((s) => s.user)
  const { leads, loading, filters, setFilters, fetch } = useLeadStore()
  const fileInputRef = useRef(null)

  const [uploading,    setUploading]    = useState(false)
  const [downloading,  setDownloading]  = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const canBulk = ["ceo", "coo", "dept_head", "lead_manager", "sales_manager"].includes(user?.role) || user?.is_super_admin

  useEffect(() => { fetch() }, [filters])

  const stats = {
    total:      leads.length,
    new:        leads.filter((l) => l.status === "new").length,
    interested: leads.filter((l) => l.status === "interested").length,
    converted:  leads.filter((l) => l.status === "converted").length,
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await leadsApi.bulkUpload(file)
      setUploadResult(data)
      if (data.created > 0) fetch()
    } catch (err) {
      setUploadResult({
        created: 0, failed: 1,
        errors: [{ row: "?", name: "Upload failed", errors: [err.response?.data?.detail || "Unknown error"] }]
      })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleExport = async (format) => {
    setDownloading(true)
    try {
      const fn  = format === "excel" ? leadsApi.exportExcel : leadsApi.exportCSV
      const ext = format === "excel" ? "xlsx" : "csv"
      const { data } = await fn(filters)
      downloadBlob(data, `leads_export.${ext}`)
    } finally { setDownloading(false) }
  }

  const handleTemplate = async (format) => {
    const ext = format === "excel" ? "xlsx" : "csv"
    const { data } = await leadsApi.downloadTemplate(format)
    downloadBlob(data, `leads_template.${ext}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        </div>
        <div className="flex items-center gap-2">
          {canBulk && (
            <>
              <DropdownMenu label="Template" icon={FileDown} items={[
                { label: "CSV Template",   icon: "lucide:file-text",            onClick: () => handleTemplate("csv") },
                { label: "Excel Template", icon: "vscode-icons:file-type-excel", onClick: () => handleTemplate("excel") },
              ]} />

              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-500 text-xs font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-60">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "Uploading..." : "Bulk Upload"}
              </button>

              <DropdownMenu label={downloading ? "Exporting..." : "Export"} icon={Download} disabled={downloading} items={[
                { label: "Export CSV",   icon: "lucide:file-text",            onClick: () => handleExport("csv") },
                { label: "Export Excel", icon: "vscode-icons:file-type-excel", onClick: () => handleExport("excel") },
              ]} />
            </>
          )}
          <button onClick={() => navigate("/leads/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition">
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Leads", value: stats.total,      icon: "lucide:users",        color: "text-gray-600" },
          { label: "New",         value: stats.new,        icon: "lucide:user-plus",    color: "text-blue-600" },
          { label: "Interested",  value: stats.interested, icon: "lucide:star",         color: "text-green-600" },
          { label: "Converted",   value: stats.converted,  icon: "lucide:check-circle", color: "text-primary" },
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
          <input value={filters.search || ""}
            onChange={(e) => setFilters({ search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && fetch()}
            placeholder="Search by name, country..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none" />
        </div>
        {[
          { key: "status",     options: STATUS_OPTIONS, placeholder: "All Status" },
          { key: "department", options: DEPARTMENTS,    placeholder: "All Depts" },
          { key: "source",     options: SOURCES,        placeholder: "All Sources" },
        ].map(({ key, options, placeholder }) => (
          <div key={key} className="relative">
            <select value={filters[key] || ""}
              onChange={(e) => setFilters({ [key]: e.target.value })}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white capitalize">
              <option value="">{placeholder}</option>
              {options.map((o) => (
                <option key={o} value={o} className="capitalize">{o.replace("_", " ")}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:users" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">Add a lead or bulk upload CSV / Excel</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {/* Serial */}
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 w-16">#</th>

                  {/* ── STAFF COLUMNS — light blue bg ── */}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-blue-500 bg-blue-50/60">Staff Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-blue-500 bg-blue-50/60">Staff ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-blue-500 bg-blue-50/60">Staff Platform IDs</th>

                  {/* ── LEAD COLUMNS ── */}
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Lead Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Country</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Platform Link</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Dept</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">

                    {/* Serial No */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400 font-mono">{lead.serial_no || "—"}</span>
                    </td>

                    {/* ── STAFF — blue tint ── */}
                    <td className="px-4 py-3 bg-blue-50/30">
                      {lead.staff_name ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-primary">
                              {lead.staff_name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-800">{lead.staff_name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 bg-blue-50/30">
                      {lead.staff_id ? (
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                          {lead.staff_id}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Staff Platform IDs — inline icons */}
                    <td className="px-4 py-3 bg-blue-50/30">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {STAFF_PLATFORMS.map(({ key, icon, color }) =>
                          lead[key] ? (
                            <div key={key} className="flex items-center gap-1 bg-white border border-gray-100 rounded-lg px-2 py-0.5" title={lead[key]}>
                              <Icon icon={icon} className={`w-3 h-3 ${color}`} />
                              <span className="text-xs text-gray-600 max-w-[80px] truncate">{lead[key]}</span>
                            </div>
                          ) : null
                        )}
                        {!STAFF_PLATFORMS.some(({ key }) => lead[key]) && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>

                    {/* ── LEAD DATA ── */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{lead.full_name}</p>
                      {lead.company && <p className="text-xs text-gray-400">{lead.company}</p>}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{lead.country || "—"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon icon={sourceIcons[lead.source] || "mdi:dots-horizontal"} className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600 capitalize">{lead.source || "—"}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-[140px]">
                      {lead.platform_link ? (
                        <a href={lead.platform_link} target="_blank" rel="noreferrer"
                          className="text-xs text-primary hover:underline truncate block">
                          {lead.platform_link.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{lead.contact_no || lead.phone || "—"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 capitalize">{lead.department || "—"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${statusConfig[lead.status]?.class}`}>
                        {statusConfig[lead.status]?.label}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/leads/${lead.id}`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="View">
                          <Icon icon="lucide:eye" className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => navigate(`/leads/${lead.id}`)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition" title="Edit">
                          <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {uploadResult && (
        <UploadResultModal result={uploadResult} onClose={() => setUploadResult(null)} />
      )}
    </div>
  )
}