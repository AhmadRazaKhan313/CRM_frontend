import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Plus, X } from "lucide-react"
import financeApi from "../../api/finance"

const STATUSES=["draft","sent","paid","overdue","cancelled"]
const CURRENCIES=["USD","PKR","GBP","EUR","AED"]
const emptyItem={ description:"", qty:1, rate:"", total:0 }
const initialForm={ client_name:"", client_email:"", amount:"0", currency:"USD", status:"draft", due_date:"", notes:"", items:[{...emptyItem}] }

export default function InvoiceForm() {
  const navigate=useNavigate(); const {id}=useParams(); const isEdit=Boolean(id)
  const [form,setForm]=useState(initialForm); const [loading,setLoading]=useState(false); const [error,setError]=useState("")

  useEffect(() => {
    if (isEdit) financeApi.getInvoice(id).then(({data}) => setForm({
      client_name:data.client_name||"", client_email:data.client_email||"",
      amount:data.amount||"0", currency:data.currency||"USD",
      status:data.status||"draft", due_date:data.due_date||"",
      notes:data.notes||"", items:data.items?.length?data.items:[{...emptyItem}],
    }))
  }, [id])

  const setField=(k)=>(e)=>setForm(p=>({...p,[k]:e.target.value}))
  const updateItem=(i,k,v)=>{
    const items=[...form.items]; items[i]={...items[i],[k]:v}
    if(k==="qty"||k==="rate") items[i].total=(parseFloat(items[i].qty)||0)*(parseFloat(items[i].rate)||0)
    setForm(p=>({...p,items,amount:items.reduce((s,it)=>s+(parseFloat(it.total)||0),0).toFixed(2)}))
  }
  const addItem=()=>setForm(p=>({...p,items:[...p.items,{...emptyItem}]}))
  const removeItem=(i)=>{const items=form.items.filter((_,idx)=>idx!==i);setForm(p=>({...p,items,amount:items.reduce((s,it)=>s+(parseFloat(it.total)||0),0).toFixed(2)}))}

  const handleSubmit=async(e)=>{
    e.preventDefault(); if(!form.client_name.trim()){setError("Client name is required.");return}
    setLoading(true); setError("")
    try { isEdit?await financeApi.updateInvoice(id,form):await financeApi.createInvoice(form); navigate("/finance/invoices") }
    catch(err){const d=err.response?.data;if(typeof d==="object"){const f=Object.values(d)[0];setError(Array.isArray(f)?f[0]:String(f))}else setError("Something went wrong.")}
    finally{setLoading(false)}
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate("/finance/invoices")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><ArrowLeft className="w-4 h-4"/></button>
        <div><p className="text-xs text-gray-400">Finance / Invoices</p><h1 className="text-xl font-bold text-gray-900">{isEdit?"Edit Invoice":"New Invoice"}</h1></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Client Information</p>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-400 mb-1.5 block">Client Name *</label><input value={form.client_name} onChange={setField("client_name")} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"/></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Client Email</label><input value={form.client_email} onChange={setField("client_email")} type="email" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"/></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Status</label><select value={form.status} onChange={setField("status")} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-white">{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Due Date</label><input value={form.due_date} onChange={setField("due_date")} type="date" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"/></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Items</p>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-primary font-medium"><Plus className="w-3.5 h-3.5"/>Add Item</button>
          </div>
          <div className="grid grid-cols-12 gap-2 mb-2 px-1">
            <span className="col-span-5 text-xs text-gray-400">Description</span><span className="col-span-2 text-xs text-gray-400">Qty</span><span className="col-span-2 text-xs text-gray-400">Rate</span><span className="col-span-2 text-xs text-gray-400 text-right">Total</span>
          </div>
          <div className="space-y-2">
            {form.items.map((item,i)=>(
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input placeholder="Description" value={item.description} onChange={e=>updateItem(i,"description",e.target.value)} className="col-span-5 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"/>
                <input placeholder="1" value={item.qty} type="number" onChange={e=>updateItem(i,"qty",e.target.value)} className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"/>
                <input placeholder="0.00" value={item.rate} type="number" onChange={e=>updateItem(i,"rate",e.target.value)} className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"/>
                <div className="col-span-2 text-sm font-medium text-gray-700 text-right pr-1">{parseFloat(item.total||0).toFixed(2)}</div>
                <button type="button" onClick={()=>removeItem(i)} className="col-span-1 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"><X className="w-3 h-3"/></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2"><span className="text-xs text-gray-400">Currency:</span><select value={form.currency} onChange={setField("currency")} className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none bg-white">{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <p className="text-base font-bold text-gray-900">Total: {form.currency} {parseFloat(form.amount||0).toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5"><label className="text-xs text-gray-400 mb-1.5 block">Notes</label><textarea value={form.notes} onChange={setField("notes")} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"/></div>
        <div className="flex items-center justify-end gap-3 pb-6">
          <button type="button" onClick={()=>navigate("/finance/invoices")} className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60">{loading?"Saving...":isEdit?"Update Invoice":"Create Invoice"}</button>
        </div>
      </form>
    </div>
  )
}
