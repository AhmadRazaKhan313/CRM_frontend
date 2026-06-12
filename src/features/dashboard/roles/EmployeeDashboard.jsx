import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../../store/authStore"
import useFeatureStore from "../../../store/featureStore"
import leadsApi from "../../../api/leads"
import tasksApi from "../../../api/tasks"

export default function EmployeeDashboard() {
  const navigate  = useNavigate()
  const user      = useAuthStore((s) => s.user)
  const hasFeature = useFeatureStore((s) => s.hasFeature)

  const hasLeads   = hasFeature("leads_module")  || user?.is_super_admin
  const hasTasks   = hasFeature("tasks_module")  || user?.is_super_admin
  const hasReports = hasFeature("reports_module") || user?.is_super_admin
  const hasHrms    = hasFeature("hrms")           || user?.is_super_admin

  const [leads, setLeads] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (hasLeads)  leadsApi.list({}).then(({ data }) => setLeads(data)).catch(() => {})
    if (hasTasks)  tasksApi.list({}).then(({ data }) => setTasks(data)).catch(() => {})
  }, [])

  const myLeads     = leads.length
  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress").length
  const doneTasks   = tasks.filter((t) => t.status === "completed").length

  const quickActions = [
    hasLeads   && { label: "Add Lead",      icon: "lucide:user-plus",     path: "/leads/new",    color: "bg-primary/10 text-primary" },
    hasLeads   && { label: "My Leads",      icon: "lucide:users",         path: "/leads",        color: "bg-blue-50 text-blue-600" },
    hasTasks   && { label: "My Tasks",      icon: "lucide:clipboard-list",path: "/tasks",        color: "bg-orange-50 text-orange-600" },
    hasReports && { label: "Submit Report", icon: "lucide:file-text",     path: "/reports/new",  color: "bg-green-50 text-green-600" },
    hasHrms    && { label: "Attendance",    icon: "lucide:clock",         path: "/hrms/attendance", color: "bg-purple-50 text-purple-600" },
    hasHrms    && { label: "Apply Leave",   icon: "lucide:calendar-off",  path: "/hrms/leaves",  color: "bg-pink-50 text-pink-600" },
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-xl font-bold text-gray-900">{user?.full_name}</h1>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace("_", " ")} — {user?.department} Department</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-lg">{user?.full_name?.[0]?.toUpperCase()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {hasLeads && (
          <div className="bg-white rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Icon icon="lucide:user-plus" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{myLeads}</p>
            <p className="text-xs text-gray-400 mt-0.5">My Leads</p>
          </div>
        )}
        {hasTasks && (
          <div className="bg-white rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
              <Icon icon="lucide:clock" className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{pendingTasks}</p>
            <p className="text-xs text-gray-400 mt-0.5">Pending Tasks</p>
          </div>
        )}
        {hasTasks && (
          <div className="bg-white rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-3">
              <Icon icon="lucide:check-circle" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{doneTasks}</p>
            <p className="text-xs text-gray-400 mt-0.5">Completed Tasks</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</p>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left">
              <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                <Icon icon={a.icon} className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      {hasLeads && leads.length > 0 && (
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">My Recent Leads</p>
            <button onClick={() => navigate("/leads")} className="text-xs text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.full_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{lead.source} — {lead.country || "—"}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${
                  lead.status === "converted" ? "bg-primary/10 text-primary" :
                  lead.status === "interested" ? "bg-green-50 text-green-600" :
                  lead.status === "rejected" ? "bg-red-50 text-red-500" :
                  "bg-gray-100 text-gray-500"
                }`}>{lead.status?.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
