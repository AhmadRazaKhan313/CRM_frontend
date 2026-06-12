import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import financeApi from "../../api/finance"

const CATEGORIES=["salary","office","marketing","tools","travel","other"]
const DEPARTMENTS=["sales","tech","seo"]
const CURRENCIES=["USD","PKR","GBP","EUR","AED"]
const initialForm={title:"",amount:"",currency:"USD",category:"other",department:"",date:"",notes:""}

export default function ExpenseForm() {
  const navigate=useNavigate()
  const [form,setForm]=useState(initialForm); const [loading,setLoading]=useState(false); const [error,setError]=useState("")
  const setField=(k)=>(e)=>setForm(p=>({...p,[k]:e.target.value}))

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(!form.title.trim()){setError("Title is required.");return}
    if(!form.amount){setError("Amount is required.");return}
    if(!form.date){setError("Date is required.");return}
    setLoading(true);setError("")
    try{await financeApi.createExpense(form);navigate("/finance/expenses")}
    catch(err){const d=err.response?.data;if(typeof d==="object"){const f=Object.values(d)[0];setError(Array.isArray(f)?f[0]:String(f))}else setError("Something went wrong.")}
    finally{setLoading(false)}
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate("/finance/expenses")} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><ArrowLeft className="w-4 h-4"/></button>
        <div><p className="text-xs text-gray-400">Finance / Expenses</p><h1 className="text-xl font-bold text-gray-900">Add Expense</h1></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Expense Details</p>
          {error&&<p className="text-sm text-red-500">{error}</p>}
          <div><label className="text-xs text-gray-400 mb-1.5 block">Title *</label><input value={form.title} onChange={setField("title")} required placeholder="e.g. Office Rent, Software Subscription..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-400 mb-1.5 block">Amount *</label><input value={form.amount} onChange={setField("amount")} type="number" required placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Currency</label><select value={form.currency} onChange={setField("currency")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white">{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Category</label><select value={form.category} onChange={setField("category")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white capitalize">{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-xs text-gray-400 mb-1.5 block">Department</label><select value={form.department} onChange={setField("department")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white"><option value="">General</option>{DEPARTMENTS.map(d=><option key={d} value={d} className="capitalize">{d}</option>)}</select></div>
            <div className="col-span-2"><label className="text-xs text-gray-400 mb-1.5 block">Date *</label><input value={form.date} onChange={setField("date")} type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/></div>
          </div>
          <div><label className="text-xs text-gray-400 mb-1.5 block">Notes</label><textarea value={form.notes} onChange={setField("notes")} rows={3} placeholder="Additional details..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"/></div>
        </div>
        <div className="flex items-center justify-end gap-3 pb-6">
          <button type="button" onClick={()=>navigate("/finance/expenses")} className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60">{loading?"Saving...":"Add Expense"}</button>
        </div>
      </form>
    </div>
  )
}
