import http from "./http"

const roles = {
  list: () => http.get("/core/roles/"),
  get: (id) => http.get(`/core/roles/${id}/`),
  create: (data) => http.post("/core/roles/", data),
  update: (id, data) => http.patch(`/core/roles/${id}/`, data),
  remove: (id) => http.delete(`/core/roles/${id}/`),
  permissions: (module) => http.get("/core/permissions/", { params: { module } }),
  assign: (data) => http.post("/core/roles/assign/", data),
  unassign: (data) => http.delete("/core/roles/assign/", { data }),
  userRoles: (userId) => http.get(`/core/roles/user/${userId}/`),
}

export default roles