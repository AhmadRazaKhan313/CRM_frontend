import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown, Upload, X, AlertCircle } from "lucide-react"
import { Icon } from "@iconify/react"
import clientsApi from "../../api/clients"
import useClientStore from "../../store/clientStore"

const statusConfig = {
  active:    { label: "Active",    class: "bg-green-50 text-green-600" },
  completed: { label: "Completed", class: "bg-blue-50 text-blue-600" },
  on_hold:   { label: "On Hold",   class: "bg-yellow-50 text-yellow-600" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-500" },
}

const tagConfig = {
  vip:         { label: "VIP",         class: "bg-purple-50 text-purple-600" },
  returning:   { label: "Returning",   class: "bg-blue-50 text-blue-600" },
  urgent:      { label: "Urgent",      class: "bg-red-50 text-red-500" },
  high_budget: { label: "High Budget", class: "bg-green-50 text-green-600" },
}

const paymentStatusConfig = {
  pending:  { label: "Pending",  class: "bg-yellow-50 text-yellow-600" },
  partial:  { label: "Partial",  class: "bg-orange-50 text-orange-600" },
  paid:     { label: "Paid",     class: "bg-green-50 text-green-600" },
  refunded: { label: "Refunded", class: "bg-red-50 text-red-500" },
}

const STATUSES       = ["active", "completed", "on_hold", "cancelled"]
const PAYMENT_METHODS = ["bank", "paypal", "wise", "cash"]

export default function ClientDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { update } = useClientStore()

  const [client,          setClient]          = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState("")
  const [statusUpdating,  setStatusUpdating]  = useState(false)
  const [paymentForm,     setPaymentForm]     = useState({
    amount: "", paid_amount: "", status: "pending", method: "", notes: ""
  })
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentLoading,  setPaymentLoading]  = useState(false)
  const [fileUploading,   setFileUploading]   = useState(false)

  useEffect(() => {
    setLoading(true)
    setError("")
    clientsApi.get(id)
      .then(({ data }) => setClient(data))
      .catch((err) => {
        const msg = err.response?.data?.detail || "Failed to load client."
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      const { data } = await clientsApi.update(id, { status: newStatus })
      setClient(data)
      update(id, { status: newStatus })
    } catch {
      // silent fail
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleTagChange = async (tag) => {
    const newTag = client.tag === tag ? "" : tag
    const { data } = await clientsApi.update(id, { tag: newTag })
    setClient(data)
    update(id, { tag: newTag })
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    setPaymentLoading(true)
    try {
      const { data } = await clientsApi.addPayment(id, paymentForm)
      setClient((prev) => ({
        ...prev,
        payments: [data, ...(prev.payments || [])],
      }))
      setPaymentForm({ amount: "", paid_amount: "", status: "pending", method: "", notes: "" })
      setShowPaymentForm(false)
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add payment.")
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileUploading(true)
    try {
      const { data } = await clientsApi.uploadFile(id, file)
      setClient((prev) => ({
        ...prev,
        files: [...(prev.files || []), data],
      }))
    } catch {
      alert("File upload failed.")
    } finally {
      setFileUploading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Error state — show error instead of blank page
  if (error || !client) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <div className="bg-white rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-800 mb-1">Could not load client</p>
          <p className="text-xs text-gray-400 mb-5">{error || "Client not found."}</p>
          <button
            onClick={() => navigate("/clients")}
            className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90"
          >
            Back to Clients
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = client.payments?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0
  const totalPaid   = client.payments?.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0) || 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/clients")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Clients</p>
          <h1 className="text-xl font-bold text-gray-900">{client.full_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {client.tag && (
            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${tagConfig[client.tag]?.class || "bg-gray-100 text-gray-500"}`}>
              {tagConfig[client.tag]?.label || client.tag}
            </span>
          )}
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[client.status]?.class || "bg-gray-100 text-gray-500"}`}>
            {statusConfig[client.status]?.label || client.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Contact Information</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Email",        value: client.email,            icon: "lucide:mail" },
                { label: "Phone",        value: client.phone,            icon: "lucide:phone" },
                { label: "Country",      value: client.country,          icon: "lucide:map-pin" },
                { label: "Company",      value: client.company,          icon: "lucide:building-2" },
                { label: "Department",   value: client.department,       icon: "lucide:layers" },
                { label: "Assigned To",  value: client.assigned_to_name, icon: "lucide:user" },
                { label: "Created By",   value: client.created_by_name,  icon: "lucide:user-plus" },
                { label: "Added On",     value: client.created_at ? new Date(client.created_at).toLocaleDateString() : null, icon: "lucide:calendar" },
              ].map(({ label, value, icon }) => value ? (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>
            {client.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{client.notes}</p>
              </div>
            )}
          </div>

          {/* Department Details */}
          {(client.sales_detail || client.tech_detail || client.seo_detail) && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4 capitalize">
                {client.department} Project Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(
                  client.sales_detail || client.tech_detail || client.seo_detail || {}
                ).map(([key, value]) => value && key !== "id" ? (
                  <div key={key}>
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-medium text-gray-800">{String(value)}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Payments */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Payments</p>
              <button
                onClick={() => setShowPaymentForm((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80"
              >
                {showPaymentForm ? <X className="w-3.5 h-3.5" /> : null}
                {showPaymentForm ? "Cancel" : "+ Add Payment"}
              </button>
            </div>

            {/* Payment Summary */}
            {(client.payments?.length > 0) && (
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                {[
                  { label: "Total",    val: totalAmount,               color: "text-gray-800" },
                  { label: "Paid",     val: totalPaid,                  color: "text-green-600" },
                  { label: "Balance",  val: totalAmount - totalPaid,    color: totalAmount - totalPaid > 0 ? "text-red-500" : "text-green-600" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className={`text-sm font-bold ${color}`}>${parseFloat(val || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Payment Form */}
            {showPaymentForm && (
              <form onSubmit={handleAddPayment} className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Total Amount</label>
                    <input type="number" value={paymentForm.amount}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Paid Amount</label>
                    <input type="number" value={paymentForm.paid_amount}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, paid_amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Status</label>
                    <select value={paymentForm.status}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, status: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
                      {["pending", "partial", "paid", "refunded"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Method</label>
                    <select value={paymentForm.method}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, method: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
                      <option value="">Select method</option>
                      {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <textarea value={paymentForm.notes}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Notes..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none" />
                <button type="submit" disabled={paymentLoading}
                  className="w-full py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-60">
                  {paymentLoading ? "Saving..." : "Add Payment"}
                </button>
              </form>
            )}

            {/* Payments List */}
            {!client.payments?.length ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">No payments recorded</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {client.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">${parseFloat(p.paid_amount || 0).toFixed(2)} / ${parseFloat(p.amount || 0).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.method || "—"} · {p.notes || ""}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${paymentStatusConfig[p.status]?.class || "bg-gray-100 text-gray-500"}`}>
                      {paymentStatusConfig[p.status]?.label || p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Files</p>
              <label className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer hover:text-primary/80">
                <Upload className="w-3.5 h-3.5" />
                {fileUploading ? "Uploading..." : "Upload File"}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={fileUploading} />
              </label>
            </div>
            {!client.files?.length ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">No files uploaded</p>
              </div>
            ) : (
              <div className="space-y-2">
                {client.files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <Icon icon="lucide:file" className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.uploaded_by_name}</p>
                      </div>
                    </div>
                    <a href={f.file} target="_blank" rel="noreferrer"
                      className="text-xs text-primary font-medium hover:underline">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Status Change */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || client.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    client.status === s
                      ? (statusConfig[s]?.class || "bg-gray-100 text-gray-500") + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}>
                  {statusConfig[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Tags</p>
            <div className="space-y-2">
              {Object.entries(tagConfig).map(([key, { label, class: cls }]) => (
                <button key={key} onClick={() => handleTagChange(key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    client.tag === key ? cls + " ring-1 ring-current" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Converted from Lead */}
          {client.converted_from && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-2">Converted From</p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon icon="lucide:user-plus" className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{client.converted_from_name}</p>
                  <p className="text-xs text-gray-400">Lead</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}