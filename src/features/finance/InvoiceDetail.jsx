import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import financeApi from "../../api/finance"

const STATUS_COLORS={draft:"bg-gray-100 text-gray-500",sent:"bg-blue-50 text-blue-600",paid:"bg-green-50 text-green-600",overdue:"bg-red-50 text-red-500",cancelled:"bg-gray-100 text-gray-400"}
const STATUSES=["draft","sent","paid","overdue","cancelled"]

export default function InvoiceDetail() {
  const {id}=useParams(); const navigate=useNavigate()
  const [invoice,setInvoice]=useState(null); const [loading,setLoading]=useState(true); const [updating,setUpdating]=useState(false)

  useEffect(()=>{financeApi.getInvoice(id).then(({data})=>setInvoice(data)).finally(()=>setLoading(false))},[id])

  const handleStatusChange=async(s)=>{setUpdating(true);const{data}=await financeApi.updateInvoice(id,{status:s});setInvoice(data);setUpdating(false)}
  const handleDelete=async()=>{if(!window.confirm("Delete this invoice?"))return;await financeApi.deleteInvoice(id);navigate("/finance/invoices")}
  const fmt=(val)=>parseFloat(val||0).toLocaleString("en-US",{minimumFractionDigits:2})

  if(loading||!invoice) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate("/finance/invoices")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><ArrowLeft className="w-4 h-4"/></button>
        <div className="flex-1"><p className="text-xs text-gray-400">Finance / Invoices</p><h1 className="text-xl font-bold text-gray-900">{invoice.invoice_no}</h1></div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium capitalize ${STATUS_COLORS[invoice.status]}`}>{invoice.status}</span>
        <button onClick={()=>navigate(`/finance/invoices/${id}/edit`)} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50"><Pencil className="w-3.5 h-3.5"/>Edit</button>
        {invoice.status!=="paid"&&<button onClick={handleDelete} className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50"><Trash2 className="w-3.5 h-3.5"/>Delete</button>}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Invoice Details</p>
            <div className="grid grid-cols-2 gap-4">
              {[{label:"Client",value:invoice.client_name},{label:"Email",value:invoice.client_email||"—"},{label:"Invoice No",value:invoice.invoice_no},{label:"Issued By",value:invoice.issued_by_name},{label:"Created",value:new Date(invoice.created_at).toLocaleDateString()},{label:"Due Date",value:invoice.due_date?new Date(invoice.due_date).toLocaleDateString():"—"},{label:"Amount",value:`${invoice.currency} ${fmt(invoice.amount)}`},{label:"Paid",value:`${invoice.currency} ${fmt(invoice.paid_amount)}`},{label:"Balance Due",value:`${invoice.currency} ${fmt(invoice.balance_due)}`}].map(({label,value})=>(
                <div key={label}><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p></div>
              ))}
            </div>
            {invoice.notes&&<div className="mt-4 pt-4 border-t border-gray-100"><p className="text-xs text-gray-400 mb-1">Notes</p><p className="text-sm text-gray-600">{invoice.notes}</p></div>}
          </div>
          {invoice.items?.length>0&&(
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">Items</p>
              <table className="w-full">
                <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-400 font-medium">Description</th><th className="text-center py-2 text-xs text-gray-400 font-medium">Qty</th><th className="text-right py-2 text-xs text-gray-400 font-medium">Rate</th><th className="text-right py-2 text-xs text-gray-400 font-medium">Total</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{invoice.items.map((item,i)=><tr key={i}><td className="py-2.5 text-sm text-gray-700">{item.description}</td><td className="py-2.5 text-sm text-gray-600 text-center">{item.qty}</td><td className="py-2.5 text-sm text-gray-600 text-right">{fmt(item.rate)}</td><td className="py-2.5 text-sm font-medium text-gray-800 text-right">{fmt(item.total)}</td></tr>)}</tbody>
                <tfoot><tr className="border-t border-gray-200"><td colSpan={3} className="pt-3 text-sm font-semibold text-gray-800 text-right pr-4">Total</td><td className="pt-3 text-sm font-bold text-gray-900 text-right">{invoice.currency} {fmt(invoice.amount)}</td></tr></tfoot>
              </table>
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">{STATUSES.map(s=><button key={s} onClick={()=>handleStatusChange(s)} disabled={updating||invoice.status===s} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${invoice.status===s?STATUS_COLORS[s]+" ring-1 ring-current":"bg-gray-50 text-gray-500 hover:bg-gray-100"} disabled:cursor-not-allowed`}>{s}</button>)}</div>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Payment Summary</p>
            <div className="space-y-2">{[{label:"Invoiced",value:`${invoice.currency} ${fmt(invoice.amount)}`,color:"text-gray-800"},{label:"Paid",value:`${invoice.currency} ${fmt(invoice.paid_amount)}`,color:"text-green-600"},{label:"Balance Due",value:`${invoice.currency} ${fmt(invoice.balance_due)}`,color:parseFloat(invoice.balance_due)>0?"text-red-500":"text-green-600"}].map(({label,value,color})=><div key={label} className="flex items-center justify-between"><span className="text-xs text-gray-400">{label}</span><span className={`text-sm font-semibold ${color}`}>{value}</span></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
