import { useEffect, useState } from "react"
import { Plus, Clock, Pencil, Trash2 } from "lucide-react"
import useHrmsStore from "../../store/hrmsStore"
import useAuthStore from "../../store/authStore"
import hrmsApi from "../../api/hrms"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function ShiftModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || { name: "", start_time: "", end_time: "", working_days: ["Mon","Tue","Wed","Thu","Fri"] }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      working_days: f.working_days.includes(day)
        ? f.working_days.filter((d) => d !== day)
        : [...f.working_days, day],
    }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.start_time || !form.end_time) {
      setError("Name, start time and end time are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await onSave(form)
      onClose()
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to save shift.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">
          {initial ? "Edit Shift" : "Create Shift"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Shift Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Morning Shift"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Start Time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">End Time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2">Working Days</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    form.working_days.includes(day)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Shift"}
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignModal({ shifts, onClose }) {
  const [form, setForm] = useState({ employee: "", shift: "", effective_from: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!form.employee || !form.shift) {
      setError("Employee ID and shift are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await hrmsApi.shifts.assign({
        employee: form.employee,
        shift: form.shift,
        effective_from: form.effective_from || new Date().toISOString().split("T")[0],
      })
      setSuccess("Shift assigned successfully!")
      setTimeout(onClose, 1200)
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to assign shift.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-bold text-gray-900 mb-5">Assign Shift to Employee</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Employee ID</label>
            <input
              value={form.employee}
              onChange={(e) => setForm((f) => ({ ...f, employee: e.target.value }))}
              placeholder="Enter employee ID"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Shift</label>
            <select
              value={form.shift}
              onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            >
              <option value="">Select shift</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.start_time} – {s.end_time})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Effective From</label>
            <input
              type="date"
              value={form.effective_from}
              onChange={(e) => setForm((f) => ({ ...f, effective_from: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-600">{success}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShiftsPage() {
  const user = useAuthStore((s) => s.user)
  const hasPermission = useAuthStore((s) => s.hasPermission)
  const { shifts, fetchShifts } = useHrmsStore()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showAssign, setShowAssign] = useState(false)
  const [loading, setLoading] = useState(false)

  const canManage = user?.is_super_admin || hasPermission("hrms.edit")

  useEffect(() => {
    fetchShifts()
  }, [])

  const handleCreate = async (data) => {
    await hrmsApi.shifts.create(data)
    fetchShifts()
  }

  const handleEdit = async (data) => {
    await hrmsApi.shifts.update(editTarget.id, data)
    setEditTarget(null)
    fetchShifts()
  }

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this shift?")) return
    await hrmsApi.shifts.delete(id)
    fetchShifts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shifts</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage working shifts and assign to employees</p>
        </div>
        {canManage && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowAssign(true)}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Assign Shift
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              New Shift
            </button>
          </div>
        )}
      </div>

      {shifts.length === 0 ? (
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <Clock className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">No shifts defined yet</p>
          {canManage && (
            <p className="text-xs text-gray-300 mt-1">Click "New Shift" to create one</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-white rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{shift.name}</p>
                    <p className="text-xs text-gray-400">
                      {shift.start_time} – {shift.end_time}
                    </p>
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTarget(shift)}
                      className="w-8 h-8 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(shift.id)}
                      className="w-8 h-8 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day) => (
                  <span
                    key={day}
                    className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      shift.working_days?.includes(day)
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  {shift.working_days?.length || 0} working days/week
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <ShiftModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {editTarget && (
        <ShiftModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}
      {showAssign && (
        <AssignModal shifts={shifts} onClose={() => setShowAssign(false)} />
      )}
    </div>
  )
}
