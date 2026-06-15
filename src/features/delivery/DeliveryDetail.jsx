import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Plus, X, ExternalLink, Check } from "lucide-react"
import deliveryApi from "../../api/delivery"

const STATUS_COLORS = {
  not_started: "bg-gray-100 text-gray-500",
  in_progress: "bg-blue-50 text-blue-600",
  review:      "bg-yellow-50 text-yellow-600",
  delivered:   "bg-purple-50 text-purple-600",
  accepted:    "bg-green-50 text-green-600",
  revision:    "bg-red-50 text-red-500",
}
const STATUS_LABELS = {
  not_started: "Not Started", in_progress: "In Progress", review: "In Review",
  delivered: "Delivered", accepted: "Accepted", revision: "Needs Revision",
}
const STATUSES = ["not_started", "in_progress", "review", "delivered", "accepted", "revision"]

export default function DeliveryDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [delivery, setDelivery] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [newMilestone, setNewMilestone] = useState("")

  const load = () => {
    deliveryApi.get(id).then(({ data }) => setDelivery(data)).catch(() => navigate("/delivery")).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [id])

  const changeStatus = async (status) => {
    const { data } = await deliveryApi.update(id, { status })
    setDelivery(data)
  }

  const addMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestone.trim()) return
    await deliveryApi.addMilestone(id, { title: newMilestone })
    setNewMilestone("")
    load()
  }

  const toggleMilestone = async (mid, done) => {
    await deliveryApi.toggleMilestone(mid, !done)
    load()
  }

  const deleteMilestone = async (mid) => {
    await deliveryApi.deleteMilestone(mid)
    load()
  }

  if (loading || !delivery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/delivery")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Deliveries / {delivery.client_name}</p>
          <h1 className="text-xl font-bold text-gray-900">{delivery.title}</h1>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${STATUS_COLORS[delivery.status]}`}>
          {STATUS_LABELS[delivery.status]}
        </span>
        <button onClick={() => navigate(`/delivery/${id}/edit`)}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Progress */}
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">Progress</p>
              <span className="text-lg font-bold text-primary">{delivery.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${delivery.progress}%` }} />
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Milestones</p>

            <form onSubmit={addMilestone} className="flex gap-2 mb-4">
              <input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="Add a milestone..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
              <button type="submit" className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/90">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {delivery.milestones?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No milestones yet</p>
            ) : (
              <div className="space-y-2">
                {delivery.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 group">
                    <button onClick={() => toggleMilestone(m.id, m.is_done)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        m.is_done ? "bg-primary border-primary" : "border-gray-300 hover:border-primary"
                      }`}>
                      {m.is_done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-sm flex-1 ${m.is_done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {m.title}
                    </span>
                    <button onClick={() => deleteMilestone(m.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {delivery.description && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-2">Description</p>
              <p className="text-sm text-gray-600">{delivery.description}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => changeStatus(s)} disabled={delivery.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    delivery.status === s ? STATUS_COLORS[s] + " ring-1 ring-current" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Details</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm font-medium text-gray-800">{delivery.client_name}</p>
              </div>
              {delivery.assigned_to_name && (
                <div>
                  <p className="text-xs text-gray-400">Assigned To</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.assigned_to_name}</p>
                </div>
              )}
              {delivery.due_date && (
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="text-sm font-medium text-gray-800">{new Date(delivery.due_date).toLocaleDateString()}</p>
                </div>
              )}
              {delivery.delivery_link && (
                <a href={delivery.delivery_link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Delivery Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
