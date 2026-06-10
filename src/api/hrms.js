import http from "./http"

const hrms = {
  // Dashboard
  dashboard: () => http.get("/hrms/dashboard/"),

  // Shifts
  shifts: {
    list: () => http.get("/hrms/shifts/"),
    create: (data) => http.post("/hrms/shifts/", data),
    update: (id, data) => http.patch(`/hrms/shifts/${id}/`, data),
    delete: (id) => http.delete(`/hrms/shifts/${id}/`),
    assign: (data) => http.post("/hrms/shifts/assign/", data),
  },

  // Attendance
  attendance: {
    list: (params) => http.get("/hrms/attendance/", { params }),
    today: () => http.get("/hrms/attendance/today/"),
    checkIn: (data) => http.post("/hrms/attendance/check-in/", data),
    checkOut: (data) => http.post("/hrms/attendance/check-out/", data),
    mark: (data) => http.post("/hrms/attendance/", data),
  },

  // Leave Types
  leaveTypes: {
    list: () => http.get("/hrms/leave-types/"),
    create: (data) => http.post("/hrms/leave-types/", data),
  },

  // Leave Requests
  leaves: {
    list: (params) => http.get("/hrms/leaves/", { params }),
    get: (id) => http.get(`/hrms/leaves/${id}/`),
    apply: (data) => http.post("/hrms/leaves/", data),
    cancel: (id) => http.delete(`/hrms/leaves/${id}/`),
    approve: (id, data) => http.post(`/hrms/leaves/${id}/approve/`, data),
    balance: (params) => http.get("/hrms/leave-balance/", { params }),
  },

  // Salary & Payroll
  payroll: {
    salaryList: () => http.get("/hrms/salary/"),
    setSalary: (data) => http.post("/hrms/salary/", data),
    getEmployeeSalary: (empId) => http.get(`/hrms/salary/${empId}/`),
    mySlips: () => http.get("/hrms/payroll/my-slips/"),
    runs: () => http.get("/hrms/payroll/"),
    getRun: (id) => http.get(`/hrms/payroll/${id}/`),
    generate: (data) => http.post("/hrms/payroll/", data),
    markPaid: (id) => http.patch(`/hrms/payroll/${id}/`, { status: "paid" }),
  },
}

export default hrms
