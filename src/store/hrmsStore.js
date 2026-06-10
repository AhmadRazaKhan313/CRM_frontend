import { create } from "zustand"
import hrmsApi from "../api/hrms"

const useHrmsStore = create((set, get) => ({
  // Dashboard
  dashboard: null,
  dashboardLoading: false,

  fetchDashboard: async () => {
    set({ dashboardLoading: true })
    try {
      const { data } = await hrmsApi.dashboard()
      set({ dashboard: data })
    } finally {
      set({ dashboardLoading: false })
    }
  },

  // Attendance
  attendance: [],
  todayAttendance: null,
  attendanceLoading: false,

  fetchAttendance: async (params) => {
    set({ attendanceLoading: true })
    try {
      const { data } = await hrmsApi.attendance.list(params)
      set({ attendance: data })
    } finally {
      set({ attendanceLoading: false })
    }
  },

  fetchTodayAttendance: async () => {
    const { data } = await hrmsApi.attendance.today()
    set({ todayAttendance: data })
  },

  checkIn: async (notes = "") => {
    const { data } = await hrmsApi.attendance.checkIn({ notes })
    return data
  },

  checkOut: async (notes = "") => {
    const { data } = await hrmsApi.attendance.checkOut({ notes })
    return data
  },

  // Leaves
  leaves: [],
  leaveTypes: [],
  leaveBalance: [],
  leavesLoading: false,

  fetchLeaveTypes: async () => {
    const { data } = await hrmsApi.leaveTypes.list()
    set({ leaveTypes: data })
  },

  fetchLeaves: async (params) => {
    set({ leavesLoading: true })
    try {
      const { data } = await hrmsApi.leaves.list(params)
      set({ leaves: data })
    } finally {
      set({ leavesLoading: false })
    }
  },

  fetchLeaveBalance: async (params) => {
    const { data } = await hrmsApi.leaves.balance(params)
    set({ leaveBalance: data })
  },

  applyLeave: async (payload) => {
    const { data } = await hrmsApi.leaves.apply(payload)
    set((s) => ({ leaves: [data, ...s.leaves] }))
    return data
  },

  approveLeave: async (id, payload) => {
    const { data } = await hrmsApi.leaves.approve(id, payload)
    set((s) => ({
      leaves: s.leaves.map((l) => (l.id === id ? data : l)),
    }))
    return data
  },

  cancelLeave: async (id) => {
    await hrmsApi.leaves.cancel(id)
    set((s) => ({
      leaves: s.leaves.filter((l) => l.id !== id),
    }))
  },

  // Payroll
  salaryList: [],
  payrollRuns: [],
  payrollLoading: false,

  fetchSalaryList: async () => {
    const { data } = await hrmsApi.payroll.salaryList()
    set({ salaryList: data })
  },

  fetchPayrollRuns: async () => {
    set({ payrollLoading: true })
    try {
      const { data } = await hrmsApi.payroll.runs()
      set({ payrollRuns: data })
    } finally {
      set({ payrollLoading: false })
    }
  },

  generatePayroll: async (payload) => {
    const { data } = await hrmsApi.payroll.generate(payload)
    set((s) => ({ payrollRuns: [data, ...s.payrollRuns] }))
    return data
  },

  markPayrollPaid: async (id) => {
    const { data } = await hrmsApi.payroll.markPaid(id)
    set((s) => ({
      payrollRuns: s.payrollRuns.map((r) => (r.id === id ? data : r)),
    }))
  },

  // Shifts
  shifts: [],
  fetchShifts: async () => {
    const { data } = await hrmsApi.shifts.list()
    set({ shifts: data })
  },
}))

export default useHrmsStore
