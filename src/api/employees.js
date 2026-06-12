import http from "./http"

const employees = {
  list:          (params)            => http.get("/auth/employees/", { params }),
  get:           (id)                => http.get(`/auth/employees/${id}/`),
  create:        (data)              => http.post("/auth/employees/", data),
  update:        (id, data)          => http.patch(`/auth/employees/${id}/`, data),
  deactivate:    (id)                => http.delete(`/auth/employees/${id}/`),
  assignRole:    (id, role_id)       => http.post(`/auth/employees/${id}/roles/`, { role_id }),
  removeRole:    (id, role_id)       => http.delete(`/auth/employees/${id}/roles/`, { data: { role_id } }),
  resetPassword: (id, new_password)  => http.post(`/auth/employees/${id}/reset-password/`, { new_password }),
}

export default employees