import http from "./http"

const leads = {
  list: (params) => http.get("/leads/", { params }),
  get: (id) => http.get(`/leads/${id}/`),
  create: (data) => http.post("/leads/", data),
  update: (id, data) => http.patch(`/leads/${id}/`, data),
  archive: (id) => http.delete(`/leads/${id}/`),
  assign: (id, user_id) => http.post(`/leads/${id}/assign/`, { user_id }),
  addActivity: (id, data) => http.post(`/leads/${id}/activity/`, data),
}

export default leads