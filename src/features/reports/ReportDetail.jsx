import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Icon } from "@iconify/react"
import reportsApi from "../../api/reports"
import useReportStore from "../../store/reportStore"
import useAuthStore from "../../store/authStore"
import { ROLES } from "../../utils/roleUtils"

const statusConfig = {
  submitted: { label: "Submitted", class: "bg-blue-50 text-blue-600" },
  reviewed: { label: "Reviewed", class: "bg-green-50 text-green-600" },
  flagged: { label: "Flagged", class: "bg-red-50 text-red-500" },
}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { current, fetchOne, update } = useReportStore()

  const [feedback, setFeedback] = useState("")
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => { fetchOne(id) }, [id])

  const isManager = [
    ROLES.CEO, ROLES.COO, ROLES.DEPT_HEAD,
    ROLES.SALES_DIRECTOR, ROLES.LEAD_MANAGER, ROLES.SALES_MANAGER
  ].includes(user?.role)

  const handleReview = async (status) => {
    setReviewing(true)
    try {
      const { data } = await reportsApi.review(id, { status, manager_feedback: feedback })
      update(id, data)
    } finally {
      setReviewing(false)
    }
  }

  if (!current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/reports")}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Reports</p>
          <h1 className="text-xl font-bold text-gray-900">
            {current.employee_name} — {new Date(current.date).toLocaleDateString()}
          </h1>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusConfig[current.status]?.class}`}>
          {statusConfig[current.status]?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left */}
        <div className="col-span-2 space-y-5">
          {/* Stats */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-4">Today's Numbers</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Leads", value: current.total_leads, icon: "lucide:user-plus", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Calls", value: current.total_calls, icon: "lucide:phone", color: "text-green-600", bg: "bg-green-50" },
                { label: "Conversions", value: current.total_conversions, icon: "lucide:check-circle", color: "text-primary", bg: "bg-primary/10" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
                  <Icon icon={s.icon} className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Work Summary */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-800">Work Summary</p>
            {[
              { label: "Tasks Completed", value: current.tasks_completed, icon: "lucide:check-square" },
              { label: "Leads Worked On", value: current.leads_worked, icon: "lucide:user-plus" },
              { label: "Clients Handled", value: current.clients_handled, icon: "lucide:users" },
            ].map(({ label, value, icon }) => value ? (
              <div key={label} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{value}</p>
                </div>
              </div>
            ) : null)}
          </div>

          {/* Issues & Plan */}
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-800">Issues & Plan</p>
            {[
              { label: "Problems Faced", value: current.problems_faced, icon: "lucide:alert-triangle" },
              { label: "Tomorrow's Plan", value: current.tomorrow_plan, icon: "lucide:calendar" },
              { label: "Notes", value: current.notes, icon: "lucide:file-text" },
            ].map(({ label, value, icon }) => value ? (
              <div key={label} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={icon} className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{value}</p>
                </div>
              </div>
            ) : null)}
          </div>

          {/* Manager Feedback */}
          {current.manager_feedback && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-2">Manager Feedback</p>
              <p className="text-sm text-gray-600">{current.manager_feedback}</p>
              {current.reviewed_by_name && (
                <p className="text-xs text-gray-400 mt-2">— {current.reviewed_by_name}</p>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Report Info */}
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Report Info</p>
            <div className="space-y-2.5">
              {[
                { label: "Employee", value: current.employee_name },
                { label: "Role", value: current.employee_role },
                { label: "Department", value: current.department },
                { label: "Date", value: new Date(current.date).toLocaleDateString() },
                { label: "Submitted", value: new Date(current.created_at).toLocaleDateString() },
                { label: "Reviewed By", value: current.reviewed_by_name || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Review */}
          {isManager && current.status === "submitted" && (
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3">Review Report</p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add feedback (optional)..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-primary transition-colors resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReview("reviewed")}
                  disabled={reviewing}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReview("flagged")}
                  disabled={reviewing}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Flag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}