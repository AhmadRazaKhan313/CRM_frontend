import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Plus, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"
import useAuthStore from "../../store/authStore"

const STATUS_CONFIG = {
  pending:   { label: "Pending",   class: "bg-yellow-50 text-yellow-600" },
  approved:  { label: "Approved",  class: "bg-green-50 text-green-600" },
  rejected:  { label: "Rejected",  class: "bg-red-50 text-red-500" },
  cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-400" },
}

function ApplyLeaveModal({ leaveTypes, onClose, onApply }) {
  const [form, setForm] = useState({ leave_type: "", from_date: "", to_date: "", reason: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!form.leave_type || !form.from_date || !form.to_date || !form.reason) {
      setError("All fields are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await onApply(form)
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || JSON.stringify(e.response?.data) || "Failed to apply.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">Apply for Leave</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Leave Type</label>
            <select
              value={form.leave_type}
              onChange={(e) => setForm(f => ({ ...f, leave_type: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            >
              <option value="">Select type</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>{lt.name} ({lt.max_days_per_year}d/yr)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">From Date</label>
              <input type="date" value={form.from_date}
                onChange={(e) => setForm(f => ({ ...f, from_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">To Date</label>
              <input type="date" value={form.to_date}
                onChange={(e) => setForm(f => ({ ...f, to_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Reason</label>
            <textarea value={form.reason}
              onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              placeholder="Reason for leave..."
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60">
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("")
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-4">Rejection Reason</h2>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
          placeholder="Explain why you are rejecting..." />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)} disabled={!reason.trim()}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium disabled:opacity-50">
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LeavePage() {
  const user = useAuthStore((s) => s.user)
  const {
    leaves, leavesLoading, leaveTypes, leaveBalance,
    fetchLeaves, fetchLeaveTypes, fetchLeaveBalance,
    applyLeave, approveLeave, cancelLeave,
  } = useHrmsStore()

  const [showApply, setShowApply] = useState(false)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [approving, setApproving] = useState(null)

  const isEmployee = ["lead_employee", "sales_employee"].includes(user?.role)
  const canApprove = ["ceo", "coo", "dept_head"].includes(user?.role) || user?.is_super_admin

  useEffect(() => {
    fetchLeaveTypes()
    fetchLeaveBalance()
    fetchLeaves(statusFilter ? { status: statusFilter } : {})
  }, [statusFilter])

  const handleApprove = async (id) => {
    setApproving(id)
    try {
      await approveLeave(id, { action: "approved" })
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (reason) => {
    await approveLeave(rejectTarget, { action: "rejected", rejection_reason: reason })
    setRejectTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Apply and manage leave requests</p>
        </div>
        <button
          onClick={() => setShowApply(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance */}
      {leaveBalance.length > 0 && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Leave Balance</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {leaveBalance.map((b) => (
              <div key={b.id} className="p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-700">{b.leave_type_detail?.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${b.leave_type_detail?.is_paid ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {b.leave_type_detail?.is_paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{b.remaining}</p>
                <p className="text-xs text-gray-400">{b.used} used of {b.allocated}</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min((b.remaining / b.allocated) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        {["", "pending", "approved", "rejected", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors capitalize ${
              statusFilter === s
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">Leave Requests</p>
        </div>
        {leavesLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No leave requests found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leaves.map((req) => (
              <div key={req.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  {!isEmployee && (
                    <p className="text-sm font-semibold text-gray-900">{req.employee_detail?.full_name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-primary">{req.leave_type_detail?.name}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(req.from_date), "MMM d")} — {format(new Date(req.to_date), "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{req.total_days}d</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{req.reason}</p>
                  {req.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">Reason: {req.rejection_reason}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${STATUS_CONFIG[req.status]?.class}`}>
                    {STATUS_CONFIG[req.status]?.label}
                  </span>

                  {/* Approval buttons — pending only */}
                  {canApprove && req.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={approving === req.id}
                        className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition disabled:opacity-50"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRejectTarget(req.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Cancel — employee's own pending */}
                  {isEmployee && req.status === "pending" && (
                    <button
                      onClick={() => cancelLeave(req.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showApply && (
        <ApplyLeaveModal
          leaveTypes={leaveTypes}
          onClose={() => setShowApply(false)}
          onApply={applyLeave}
        />
      )}
      {rejectTarget && (
        <RejectModal onClose={() => setRejectTarget(null)} onConfirm={handleReject} />
      )}
    </div>
  )
}
