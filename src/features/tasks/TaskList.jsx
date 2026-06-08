import { useEffect } from "react"
import { Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useTaskStore from "../../store/taskStore"

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

export default function TaskList() {
  const navigate = useNavigate()
  const { tasks, loading, filters, setFilters, fetch } = useTaskStore()

  useEffect(() => { fetch() }, [filters])

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
        </div>
        <button
          onClick={() => navigate("/tasks/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: stats.total, icon: "lucide:clipboard-list", color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Pending", value: stats.pending, icon: "lucide:clock", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "In Progress", value: stats.in_progress, icon: "lucide:loader", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completed", value: stats.completed, icon: "lucide:check-circle", color: "text-green-600", bg: "bg-green-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <Icon icon={s.icon} className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3">
        {[
          { key: "status", options: ["pending", "in_progress", "completed", "delayed"], placeholder: "All Status" },
          { key: "priority", options: ["low", "medium", "high", "urgent"], placeholder: "All Priority" },
          { key: "department", options: ["sales", "tech", "seo"], placeholder: "All Departments" },
        ].map(({ key, options, placeholder }) => (
          <div key={key} className="relative">
            <select
              value={filters[key]}
              onChange={(e) => setFilters({ [key]: e.target.value })}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white capitalize"
            >
              <option value="">{placeholder}</option>
              {options.map((o) => (
                <option key={o} value={o} className="capitalize">{o.replace("_", " ")}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Task Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl text-center py-16">
          <Icon icon="lucide:clipboard-list" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No tasks found</p>
          <p className="text-xs text-gray-400 mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm transition-shadow"
            >
              <div className={`w-1 h-10 rounded-full shrink-0 ${
                task.priority === "urgent" ? "bg-red-400" :
                task.priority === "high" ? "bg-orange-400" :
                task.priority === "medium" ? "bg-blue-400" : "bg-gray-200"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  {task.assigned_to_name && (
                    <span className="text-xs text-gray-400">→ {task.assigned_to_name}</span>
                  )}
                  {task.due_date && (
                    <span className="text-xs text-gray-400">
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {task.department && (
                    <span className="text-xs text-gray-400 capitalize">{task.department}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${priorityConfig[task.priority]?.class}`}>
                  {priorityConfig[task.priority]?.label}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${statusConfig[task.status]?.class}`}>
                  {statusConfig[task.status]?.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}