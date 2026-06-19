import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import deliveryApi from "../../api/delivery"
import departmentsApi from "../../api/departments"
import clientsApi from "../../api/clients"
import employeesApi from "../../api/employees"


export default function DeliveryForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    title: "", description: "", client: "", department: "",
    assigned_to: "", start_date: "", due_date: "", delivery_link: "", notes: "",
  })
  const [clients,   setClients]   = useState([])
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")

  useEffect(() => {
    departmentsApi.list().then(({ data }) => setDepartments(data)).catch(() => {})
  }, [])

  useEffect(() => {
    clientsApi.list().then(({ data }) => setClients(data)).catch(() => {})
    employeesApi.list().then(({ data }) => setEmployees(data)).catch(() => {})
    if (isEdit) {
      deliveryApi.get(id).then(({ data }) => {
        setForm({
          title: data.title || "", description: data.description || "",
          client: data.client || "", department: data.department || "",
          assigned_to: data.assigned_to || "", start_date: data.start_date || "",
          due_date: data.due_date || "", delivery_link: data.delivery_link || "",
          notes: data.notes || "",
        })
      })
    }
  }, [id])

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError("Title is required."); return }
    if (!form.client)       { setError("Client is required."); return }
    setLoading(true)
    setError("")
    try {
      const payload = { ...form }
      if (!payload.assigned_to) delete payload.assigned_to
      if (!payload.start_date)  delete payload.start_date
      if (!payload.due_date)    delete payload.due_date
      if (isEdit) await deliveryApi.update(id, payload)
      else        await deliveryApi.create(payload)
      navigate("/delivery")
    } catch (err) {
      const d = err.response?.data
      setError(typeof d === "object" ? Object.values(d)[0] : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/delivery")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs text-gray-400">Deliveries</p>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Delivery" : "New Delivery"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5 space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Title *</label>
            <input value={form.title} onChange={setField("title")} placeholder="e.g. Website Redesign Phase 1"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Client *</label>
              <div className="relative">
                <select value={form.client} onChange={setField("client")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm outline-none focus:border-primary bg-white">
                  <option value="">Select client</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Department</label>
              <div className="relative">
                <select value={form.department} onChange={setField("department")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm outline-none focus:border-primary bg-white capitalize">
                  <option value="">Select</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Assigned To</label>
              <div className="relative">
                <select value={form.assigned_to} onChange={setField("assigned_to")}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm outline-none focus:border-primary bg-white">
                  <option value="">Unassigned</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Due Date</label>
              <input type="date" value={form.due_date} onChange={setField("due_date")}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Delivery Link</label>
            <input value={form.delivery_link} onChange={setField("delivery_link")} placeholder="Google Drive / file URL"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={setField("description")} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button type="button" onClick={() => navigate("/delivery")}
            className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Saving..." : isEdit ? "Update" : "Create Delivery"}
          </button>
        </div>
      </form>
    </div>
  )
}
