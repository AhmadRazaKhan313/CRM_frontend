import http from "./http"

const departments = {
  list:       ()          => http.get("/departments/"),
  get:        (id)        => http.get(`/departments/${id}/`),
  create:     (data)      => http.post("/departments/", data),
  update:     (id, data)  => http.patch(`/departments/${id}/`, data),
  deactivate: (id)        => http.delete(`/departments/${id}/`),
}

export default departments