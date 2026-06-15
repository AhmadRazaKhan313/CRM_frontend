import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
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
  not_started: "Not Started",
  in_progress: "In Progress",
  review:      "In Review",
  delivered:   "Delivered",
  accepted:    "Accepted",
  revision:    "Needs Revision",
}

const STATUSES = ["not_started", "in_progress", "review", "delivered", "accepted", "revision"]

export default function DeliveryList() {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [statusF,    setStatusF]    = useState("")

  const fetch = () => {
    setLoading(true)
    deliveryApi.list({ status: statusF })
      .then(({ data }) => setDeliveries(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [statusF])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Operations</p>
          <h1 className="text-xl font-bold text-gray-900">Deliveries</h1>
        </div>
        <button onClick={() => navigate("/delivery/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Delivery
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="relative">
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none bg-white">
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <Icon icon="lucide:package" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No deliveries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {deliveries.map((d) => (
            <div key={d.id} onClick={() => navigate(`/delivery/${d.id}`)}
              className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{d.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.client_name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${STATUS_COLORS[d.status]}`}>
                  {STATUS_LABELS[d.status]}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-semibold text-gray-700">{d.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{d.done_count}/{d.milestone_count} milestones</span>
                {d.due_date && <span>Due {new Date(d.due_date).toLocaleDateString()}</span>}
              </div>

              {d.assigned_to_name && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-primary">{d.assigned_to_name[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-gray-500">{d.assigned_to_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
