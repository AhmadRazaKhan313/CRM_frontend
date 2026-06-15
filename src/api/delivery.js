import http from "./http"

const delivery = {
  list:           (params)   => http.get("/delivery/", { params }),
  get:            (id)       => http.get(`/delivery/${id}/`),
  create:         (data)     => http.post("/delivery/", data),
  update:         (id, data) => http.patch(`/delivery/${id}/`, data),
  archive:        (id)       => http.delete(`/delivery/${id}/`),
  addMilestone:   (id, data) => http.post(`/delivery/${id}/milestones/`, data),
  toggleMilestone:(id, done) => http.patch(`/delivery/milestones/${id}/`, { is_done: done }),
  deleteMilestone:(id)       => http.delete(`/delivery/milestones/${id}/`),
}

export default delivery
