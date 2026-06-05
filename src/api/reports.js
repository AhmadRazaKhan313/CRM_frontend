import http from "./http"

const reports = {
  list: (params) => http.get("/reports/", { params }),
  get: (id) => http.get(`/reports/${id}/`),
  create: (data) => http.post("/reports/", data),
  update: (id, data) => http.patch(`/reports/${id}/`, data),
  review: (id, data) => http.post(`/reports/${id}/review/`, data),
}

export default reports