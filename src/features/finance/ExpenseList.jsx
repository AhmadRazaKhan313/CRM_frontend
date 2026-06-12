import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ChevronDown, Trash2 } from "lucide-react"
import { Icon } from "@iconify/react"
import financeApi from "../../api/finance"

const CATEGORIES=["salary","office","marketing","tools","travel","other"]
const DEPARTMENTS=["sales","tech","seo"]
const CAT_COLORS={salary:"bg-blue-50 text-blue-600",office:"bg-purple-50 text-purple-600",marketing:"bg-pink-50 text-pink-600",tools:"bg-teal-50 text-teal-600",travel:"bg-orange-50 text-orange-600",other:"bg-gray-100 text-gray-500"}

export default function ExpenseList() {
  const navigate=useNavigate()
  const [expenses,setExpenses]=useState([]); const [loading,setLoading]=useState(true)
  const [categoryF,setCategoryF]=useState(""); const [deptF,setDeptF]=useState("")

  const fetch=()=>{setLoading(true);financeApi.expenses({category:categoryF,department:deptF}).then(({data})=>setExpenses(data)).finally(()=>setLoading(false))}
  useEffect(()=>{fetch()},[categoryF,deptF])

  const handleDelete=async(id)=>{if(!window.confirm("Delete this expense?"))return;await financeApi.deleteExpense(id);setExpenses(s=>s.filter(e=>e.id!==id))}
  const fmt=(val)=>parseFloat(val||0).toLocaleString("en-US",{minimumFractionDigits:2})
  const total=expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><p className="text-xs text-gray-400 mb-0.5">Finance</p><h1 className="text-xl font-bold text-gray-900">Expenses</h1></div>
        <button onClick={()=>navigate("/finance/expenses/new")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90"><Plus className="w-4 h-4"/>Add Expense</button>
      </div>
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center justify-between"><span className="text-sm text-gray-500">Total Expenses</span><span className="text-lg font-bold text-gray-900">${fmt(total)}</span></div>
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="relative"><select value={categoryF} onChange={e=>setCategoryF(e.target.value)} className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none bg-white"><option value="">All Categories</option>{CATEGORIES.map(c=><option key={c} value={c} className="capitalize">{c}</option>)}</select><ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"/></div>
        <div className="relative"><select value={deptF} onChange={e=>setDeptF(e.target.value)} className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none bg-white"><option value="">All Departments</option>{DEPARTMENTS.map(d=><option key={d} value={d} className="capitalize">{d}</option>)}</select><ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"/></div>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading?<div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
        :expenses.length===0?<div className="text-center py-16"><Icon icon="lucide:receipt" className="w-10 h-10 text-gray-200 mx-auto mb-3"/><p className="text-sm text-gray-400">No expenses yet</p></div>
        :<table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Title</th><th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Category</th><th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Amount</th><th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Date</th><th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Paid By</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-gray-50">{expenses.map(exp=><tr key={exp.id} className="hover:bg-gray-50/50"><td className="px-5 py-3.5"><p className="text-sm font-medium text-gray-800">{exp.title}</p>{exp.notes&&<p className="text-xs text-gray-400 line-clamp-1">{exp.notes}</p>}</td><td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${CAT_COLORS[exp.category]||CAT_COLORS.other}`}>{exp.category}</span></td><td className="px-5 py-3.5"><span className="text-sm font-medium text-gray-800">{exp.currency} {fmt(exp.amount)}</span></td><td className="px-5 py-3.5"><span className="text-sm text-gray-600">{new Date(exp.date).toLocaleDateString()}</span></td><td className="px-5 py-3.5"><span className="text-sm text-gray-600">{exp.paid_by_name}</span></td><td className="px-5 py-3.5"><button onClick={()=>handleDelete(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></td></tr>)}</tbody>
        </table>}
      </div>
    </div>
  )
}
