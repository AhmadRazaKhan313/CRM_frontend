import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Clock, CheckCircle2, LogIn, LogOut, Filter } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"
import useAuthStore from "../../store/authStore"

const STATUS_COLORS = {
  present: "bg-green-50 text-green-600",
  late: "bg-yellow-50 text-yellow-600",
  absent: "bg-red-50 text-red-500",
  half_day: "bg-orange-50 text-orange-500",
  on_leave: "bg-blue-50 text-blue-600",
  holiday: "bg-purple-50 text-purple-600",
}

export default function AttendancePage() {
  const user = useAuthStore((s) => s.user)
  const {
    attendance, attendanceLoading,
    todayAttendance, fetchAttendance, fetchTodayAttendance,
    checkIn, checkOut,
  } = useHrmsStore()

  const [checking, setChecking] = useState(false)
  const [msg, setMsg] = useState("")
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const hasPermission = useAuthStore((s) => s.hasPermission)
  const isEmployee = !user?.is_super_admin && !hasPermission("hrms.edit")

  useEffect(() => {
    fetchAttendance(filters)
    fetchTodayAttendance()
  }, [filters])

  const today = todayAttendance?.records?.find?.(
    (r) => r.employee_detail?.id === user?.id
  )

  const handleCheckIn = async () => {
    setChecking(true)
    setMsg("")
    try {
      await checkIn()
      setMsg("Checked in successfully!")
      fetchTodayAttendance()
    } catch (e) {
      setMsg(e.response?.data?.detail || "Check-in failed.")
    } finally {
      setChecking(false)
    }
  }

  const handleCheckOut = async () => {
    setChecking(true)
    setMsg("")
    try {
      await checkOut()
      setMsg("Checked out successfully!")
      fetchTodayAttendance()
    } catch (e) {
      setMsg(e.response?.data?.detail || "Check-out failed.")
    } finally {
      setChecking(false)
    }
  }

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">{format(new Date(), "EEEE, MMMM d yyyy")}</p>
        </div>
      </div>

      {/* Check In/Out Panel — employees ke liye */}
      {isEmployee && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Today's Attendance</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LogIn className="w-4 h-4" />
                <span>Check In: <strong className="text-gray-800">
                  {today?.check_in ? format(new Date(today.check_in), "hh:mm a") : "—"}
                </strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LogOut className="w-4 h-4" />
                <span>Check Out: <strong className="text-gray-800">
                  {today?.check_out ? format(new Date(today.check_out), "hh:mm a") : "—"}
                </strong></span>
              </div>
              {today?.working_hours && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Working Hours: <strong>{today.working_hours}</strong></span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCheckIn}
                disabled={checking || !!today?.check_in}
                className="px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={checking || !today?.check_in || !!today?.check_out}
                className="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check Out
              </button>
            </div>
          </div>
          {msg && (
            <p className={`text-sm mt-3 ${msg.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {msg}
            </p>
          )}
        </div>
      )}

      {/* Today summary — managers ke liye */}
      {!isEmployee && todayAttendance && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Today's Overview</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Present", val: todayAttendance.records?.filter(r => ["present","late"].includes(r.status)).length, color: "text-green-600" },
              { label: "Absent", val: todayAttendance.records?.filter(r => r.status === "absent").length, color: "text-red-500" },
              { label: "On Leave", val: todayAttendance.records?.filter(r => r.status === "on_leave").length, color: "text-blue-600" },
              { label: "Not Marked", val: todayAttendance.not_marked, color: "text-gray-400" },
            ].map(({ label, val, color }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-gray-50">
                <p className={`text-2xl font-bold ${color}`}>{val ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filters.month}
          onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none"
        >
          {months.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={filters.year}
          onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none"
        >
          {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">Attendance Records</p>
        </div>
        {attendanceLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Date</th>
                  {!isEmployee && <th className="px-5 py-3 font-medium">Employee</th>}
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Check In</th>
                  <th className="px-5 py-3 font-medium">Check Out</th>
                  <th className="px-5 py-3 font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {format(new Date(rec.date), "MMM d, yyyy")}
                    </td>
                    {!isEmployee && (
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-gray-800">{rec.employee_detail?.full_name}</p>
                          <p className="text-xs text-gray-400">{rec.employee_detail?.employee_id}</p>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${STATUS_COLORS[rec.status] || "bg-gray-100 text-gray-500"}`}>
                        {rec.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {rec.check_in ? format(new Date(rec.check_in), "hh:mm a") : "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {rec.check_out ? format(new Date(rec.check_out), "hh:mm a") : "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium">{rec.working_hours}</td>
                    <td className="px-5 py-3">
                      {rec.late_minutes > 0 ? (
                        <span className="text-xs text-yellow-600 font-medium">{rec.late_minutes}m late</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
