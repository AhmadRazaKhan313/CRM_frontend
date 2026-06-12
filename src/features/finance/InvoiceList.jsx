import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import financeApi from "../../api/finance"

const STATUS_COLORS = {
  draft:"bg-gray-100 text-gray-500", sent:"bg-blue-50 text-blue-600",
  paid:"bg-green-50 text-green-600", overdue:"bg-red-50 text-red-500", cancelled:"bg-gray-100 text-gray-400",
}
const STATUSES = ["draft","sent","paid","overdue","cancelled"]

export default function InvoiceList() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState("")
  const [statusF,  setStatusF]  = useState("")

  const fetch = () => {
    setLoading(true)
    financeApi.invoices({ search, status: statusF }).then(({ data }) => setInvoices(data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [statusF])

  const fmt = (val) => parseFloat(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><p className="text-xs text-gray-400 mb-0.5">Finance</p><h1 className="text-xl font-bold text-gray-900">Invoices</h1></div>
        <button onClick={() => navigate("/finance/invoices/new")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-300 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetch()}
            placeholder="Search by client or invoice no..." className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none" />
        </div>
        <div className="relative">
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none bg-white">
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16"><Icon icon="lucide:file-text" className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No invoices yet</p></div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Invoice</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Client</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Due Date</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-primary cursor-pointer hover:underline" onClick={() => navigate(`/finance/invoices/${inv.id}`)}>{inv.invoice_no}</p>
                    <p className="text-xs text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3.5"><p className="text-sm text-gray-700">{inv.client_name}</p>{inv.client_email && <p className="text-xs text-gray-400">{inv.client_email}</p>}</td>
                  <td className="px-5 py-3.5"><p className="text-sm font-medium text-gray-800">{inv.currency} {fmt(inv.amount)}</p>{parseFloat(inv.paid_amount) > 0 && <p className="text-xs text-green-600">Paid: {fmt(inv.paid_amount)}</p>}</td>
                  <td className="px-5 py-3.5"><span className="text-sm text-gray-600">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</span></td>
                  <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${STATUS_COLORS[inv.status]}`}>{inv.status}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/finance/invoices/${inv.id}`)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Icon icon="lucide:eye" className="w-3.5 h-3.5" /></button>
                      <button onClick={() => navigate(`/finance/invoices/${inv.id}/edit`)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Icon icon="lucide:pencil" className="w-3.5 h-3.5" /></button>
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
