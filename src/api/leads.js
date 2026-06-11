import http from "./http"

const leads = {
  list:        (params) => http.get("/leads/", { params }),
  get:         (id)     => http.get(`/leads/${id}/`),
  create:      (data)   => http.post("/leads/", data),
  update:      (id, data) => http.patch(`/leads/${id}/`, data),
  archive:     (id)     => http.delete(`/leads/${id}/`),
  assign:      (id, user_id) => http.post(`/leads/${id}/assign/`, { user_id }),
  addActivity: (id, data)    => http.post(`/leads/${id}/activity/`, data),

  // ── Bulk Upload — CSV ya Excel dono accept ─────────────────
  bulkUpload: (file) => {
    const form = new FormData()
    form.append("file", file)
    return http.post("/leads/bulk-upload/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  // ── Export — format: "csv" | "excel" ──────────────────────
  exportCSV: (params = {}) =>
    http.get("/leads/export/", {
      params: { ...params, format: "csv" },
      responseType: "blob",
    }),

  exportExcel: (params = {}) =>
    http.get("/leads/export/", {
      params: { ...params, format: "excel" },
      responseType: "blob",
    }),

  // ── Template — format: "csv" | "excel" ────────────────────
  downloadTemplate: (format = "csv") =>
    http.get("/leads/template/", {
      params: { format },
      responseType: "blob",
    }),
}

export default leads