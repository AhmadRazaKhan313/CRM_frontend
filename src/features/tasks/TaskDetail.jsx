import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import tasksApi from "../../api/tasks"

const priorityConfig = {
  low: { label: "Low", class: "bg-gray-100 text-gray-500" },
  medium: { label: "Medium", class: "bg-blue-50 text-blue-600" },
  high: { label: "High", class: "bg-orange-50 text-orange-600" },
  urgent: { label: "Urgent", class: "bg-red-50 text-red-500" },
}

const statusConfig = {
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-600" },
  in_progress: { label: "In Progress", class: "bg-blue-50 text-blue-600" },
  completed: { label: "Completed", class: "bg-green-50 text-green-600" },
  delayed: { label: "Delayed", class: "bg-red-50 text-red-500" },
}

const STATUSES = ["pending", "in_progress", "completed", "delayed"]

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    tasksApi.get(id)
      .then(({ data }) => setTask(data))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      const { data } = await tasksApi.update(id, { status: newStatus })
      setTask(data)
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const { data } = await tasksApi.comment(id, comment)
      setTask((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), data],
      }))
      setComment("")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/tasks")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Tasks</p>
          <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${priorityConfig[task.priority]?.class}`}>
            {priorityConfig[task.priority]?.label}
          </span>
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[task.status]?.class}`}>
            {statusConfig[task.status]?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Task Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Task Details</p>
            {task.description && (
              <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Assigned To", value: task.assigned_to_name },
                { label: "Assigned By", value: task.assigned_by_name },
                { label: "Department", value: task.department },
                { label: "Due Date", value: task.due_date ? new Date(task.due_date).toLocaleDateString() : null },
                { label: "Created", value: new Date(task.created_at).toLocaleDateString() },
                { label: "Completed", value: task.completed_at ? new Date(task.completed_at).toLocaleDateString() : null },
              ].map(({ label, value }) => value ? (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
                </div>
              ) : null)}
            </div>
            {task.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-600">{task.notes}</p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Comments</p>
            <form onSubmit={handleComment} className="mb-5">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {task.comments?.length === 0 ? (
              <div className="text-center py-6">
                <Icon icon="lucide:message-square" className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {task.comments?.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {c.created_by_name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-gray-700">{c.created_by_name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Status Update */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Update Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || task.status === s}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${
                    task.status === s
                      ? statusConfig[s].class + " ring-1 ring-current"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } disabled:cursor-not-allowed`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Task Meta */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Task Info</p>
            <div className="space-y-2.5">
              {[
                { label: "Task ID", value: `#${task.id}` },
                { label: "Priority", value: task.priority },
                { label: "Department", value: task.department || "—" },
                { label: "Created", value: new Date(task.created_at).toLocaleDateString() },
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