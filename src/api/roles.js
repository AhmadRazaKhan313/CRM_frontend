import http from "./http"

const roles = {
  list:        ()          => http.get("/core/roles/"),
  get:         (id)        => http.get(`/core/roles/${id}/`),
  create:      (data)      => http.post("/core/roles/", data),
  update:      (id, data)  => http.patch(`/core/roles/${id}/`, data),
  remove:      (id)        => http.delete(`/core/roles/${id}/`),
  permissions: (module)    => http.get("/core/permissions/", { params: { module } }),
  userRoles:   (userId)    => http.get(`/core/roles/user/${userId}/`),

  // Role assign/remove ab employee endpoint pe
  assignToEmployee:   (empId, roleId) => http.post(`/auth/employees/${empId}/roles/`, { role_id: roleId }),
  removeFromEmployee: (empId, roleId) => http.delete(`/auth/employees/${empId}/roles/`, { data: { role_id: roleId } }),
}

export default roles
