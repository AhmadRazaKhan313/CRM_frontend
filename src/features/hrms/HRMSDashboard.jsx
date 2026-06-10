import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Clock, Calendar, TrendingUp, AlertCircle, CheckCircle2, XCircle, Timer } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"

const StatCard = ({ icon: Icon, label, value, sub, color = "primary" }) => {
  const colors = {
    primary: "bg-primary/10 text-primary",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  }
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function HRMSDashboard() {
  const navigate = useNavigate()
  const { dashboard, dashboardLoading, fetchDashboard } = useHrmsStore()

  useEffect(() => { fetchDashboard() }, [])

  if (dashboardLoading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { today, this_month, pending_leave_requests, total_employees } = dashboard

  const quickLinks = [
    { label: "Attendance", path: "/hrms/attendance", icon: Clock },
    { label: "Leave Requests", path: "/hrms/leaves", icon: Calendar },
    { label: "Payroll", path: "/hrms/payroll", icon: TrendingUp },
    { label: "Shifts", path: "/hrms/shifts", icon: Timer },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">HRMS Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Human Resource Management Overview</p>
      </div>

      {/* Today Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Today's Attendance</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Employees" value={total_employees} color="primary" />
          <StatCard icon={CheckCircle2} label="Present" value={today?.present} color="green" />
          <StatCard icon={XCircle} label="Absent" value={today?.absent} color="red" />
          <StatCard icon={Calendar} label="On Leave" value={today?.on_leave} color="yellow" />
        </div>
      </div>

      {/* Month Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">This Month</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label="Avg Present/Day" value={this_month?.avg_present} color="primary" />
          <StatCard icon={AlertCircle} label="Late Arrivals" value={this_month?.total_late} color="yellow" />
          <StatCard icon={XCircle} label="Total Absent Days" value={this_month?.total_absent} color="red" />
          <StatCard icon={Timer} label="Overtime Hours" value={`${this_month?.total_overtime_hours}h`} color="purple" />
        </div>
      </div>

      {/* Pending Leaves Alert */}
      {pending_leave_requests > 0 && (
        <div
          onClick={() => navigate("/hrms/leaves?status=pending")}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              {pending_leave_requests} Pending Leave Request{pending_leave_requests > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-yellow-600">Click to review and approve</p>
          </div>
        </div>
      )}

      {/* Not Marked Warning */}
      {today?.not_marked > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700">
            {today.not_marked} employees haven't been marked today
          </p>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Access</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-sm hover:bg-gray-50 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
