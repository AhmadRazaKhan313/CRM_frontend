import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown, Upload, X } from "lucide-react"
import { Icon } from "@iconify/react"
import clientsApi from "../../api/clients"
import useClientStore from "../../store/clientStore"

const statusConfig = {
  active: { label: "Active", class: "bg-green-50 text-green-600" },
  completed: { label: "Completed", class: "bg-blue-50 text-blue-600" },
  on_hold: { label: "On Hold", class: "bg-yellow-50 text-yellow-600" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-500" },
}

const tagConfig = {
  vip: { label: "VIP", class: "bg-purple-50 text-purple-600" },
  returning: { label: "Returning", class: "bg-blue-50 text-blue-600" },
  urgent: { label: "Urgent", class: "bg-red-50 text-red-500" },
  high_budget: { label: "High Budget", class: "bg-green-50 text-green-600" },
}

const paymentStatusConfig = {
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-600" },
  partial: { label: "Partial", class: "bg-orange-50 text-orange-600" },
  paid: { label: "Paid", class: "bg-green-50 text-green-600" },
  refunded: { label: "Refunded", class: "bg-red-50 text-red-500" },
}

const STATUSES = ["active", "completed", "on_hold", "cancelled"]
const PAYMENT_METHODS = ["bank", "paypal", "wise", "cash"]

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { update } = useClientStore()

  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: "", paid_amount: "", status: "pending", method: "", notes: ""
  })
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [fileUploading, setFileUploading] = useState(false)

  useEffect(() => {
    clientsApi.get(id)
      .then(({ data }) => setClient(data))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      const { data } = await clientsApi.update(id, { status: newStatus })
      setClient(data)
      update(id, { status: newStatus })
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
    } finally {
      setFileUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) return null

  const totalAmount = client.payments?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0
  const totalPaid = client.payments?.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0) || 0

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
            <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${tagConfig[client.tag]?.class}`}>
              {tagConfig[client.tag]?.label}
            </span>
          )}
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[client.status]?.class}`}>
            {statusConfig[client.status]?.label}
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
                { label: "Email", value: client.email, icon: "lucide:mail" },
                { label: "Phone", value: client.phone, icon: "lucide:phone" },
                { label: "Country", value: client.country, icon: "lucide:map-pin" },
                { label: "Company", value: client.company, icon: "lucide:building-2" },
                { label: "Department", value: client.department, icon: "lucide:layers" },
                { label: "Assigned To", value: client.assigned_to_name, icon: "lucide:user" },
                { label: "Created By", value: client.created_by_name, icon: "lucide:user-plus" },
                { label: "Added On", value: new Date(client.created_at).toLocaleDateString(), icon: "lucide:calendar" },
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
          {(client.academic_detail || client.tech_detail || client.seo_detail) && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4 capitalize">
                {client.department} Project Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(
                  client.academic_detail || client.tech_detail || client.seo_detail || {}
                ).map(([key, value]) => value ? (
                  <div key={key}>
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
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
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="text-xs text-primary hover:underline"
              >
                {showPaymentForm ? "Cancel" : "+ Add Payment"}
              </button>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Total Amount", value: `$${totalAmount.toFixed(2)}` },
                { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, color: "text-green-600" },
                { label: "Remaining", value: `$${(totalAmount - totalPaid).toFixed(2)}`, color: "text-red-500" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-sm font-bold ${s.color || "text-gray-900"}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Add Payment Form */}
            {showPaymentForm && (
              <form onSubmit={handleAddPayment} className="border border-gray-100 rounded-xl p-4 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Total Amount</label>
                    <input
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="e.g. 500"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Paid Amount</label>
                    <input
                      value={paymentForm.paid_amount}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, paid_amount: e.target.value }))}
                      placeholder="e.g. 250"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <div className="relative">
                      <select
                        value={paymentForm.status}
                        onChange={(e) => setPaymentForm((p) => ({ ...p, status: e.target.value }))}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-primary pr-8"
                      >
                        {["pending", "partial", "paid", "refunded"].map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Method</label>
                    <div className="relative">
                      <select
                        value={paymentForm.method}
                        onChange={(e) => setPaymentForm((p) => ({ ...p, method: e.target.value }))}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-primary pr-8"
                      >
                        <option value="">Select method</option>
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m} className="capitalize">{m}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <input
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Payment notes..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {paymentLoading ? "Saving..." : "Add Payment"}
                  </button>
                </div>
              </form>
            )}

            {/* Payment List */}
            {client.payments?.length === 0 ? (
              <div className="text-center py-6">
                <Icon icon="lucide:credit-card" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No payments recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.payments?.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">${parseFloat(p.amount).toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${paymentStatusConfig[p.status]?.class}`}>
                          {paymentStatusConfig[p.status]?.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Paid: ${parseFloat(p.paid_amount).toFixed(2)}
                        {p.method && ` · ${p.method}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Files</p>
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/40 transition-colors mb-4">
              {fileUploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4 text-gray-300 mb-1" />
                  <span className="text-xs text-gray-400">Click to upload file</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>

            {client.files?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No files uploaded</p>
              </div>
            ) : (
              <div className="space-y-2">
                {client.files?.map((f) => (
                  <div key={f.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:file" className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate max-w-xs">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{f.uploaded_by_name}</span>
                      <a
                        href={f.file}
                        target="_blank"
                        rel="noreferrer"
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-400 transition-colors"
                      >
                        <Icon icon="lucide:download" className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || client.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    client.status === s
                      ? statusConfig[s].class + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Client Tag</p>
            <div className="space-y-2">
              {Object.entries(tagConfig).map(([key, { label, class: cls }]) => (
                <button
                  key={key}
                  onClick={() => handleTagChange(key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    client.tag === key
                      ? cls + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Meta */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Client Info</p>
            <div className="space-y-2.5">
              {[
                { label: "Client ID", value: `#${client.id}` },
                { label: "Department", value: client.department },
                { label: "Created", value: new Date(client.created_at).toLocaleDateString() },
                { label: "Last Updated", value: new Date(client.updated_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
