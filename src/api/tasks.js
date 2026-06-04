import http from "./http"

const tasks = {
  list: (params) => http.get("/tasks/", { params }),
  get: (id) => http.get(`/tasks/${id}/`),
  create: (data) => http.post("/tasks/", data),
  update: (id, data) => http.patch(`/tasks/${id}/`, data),
  remove: (id) => http.delete(`/tasks/${id}/`),
  comment: (id, comment) => http.post(`/tasks/${id}/comment/`, { comment }),
}

export default tasks