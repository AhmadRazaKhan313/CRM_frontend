import http from "./http"

const tenant = {
  me:     ()     => http.get("/tenant/me/"),
  update: (data) => http.patch("/tenant/me/", data),

  // Sirf primary super admin nayi organization bana sakta hai
  createOrganization: (data) => http.post("/tenant/organizations/", data),

  // Super admin — organization management
  adminStats:    ()              => http.get("/tenant/admin/stats/"),
  adminList:     ()              => http.get("/tenant/admin/tenants/"),
  adminGet:      (id)            => http.get(`/tenant/admin/tenants/${id}/`),
  adminUpdate:   (id, data)      => http.patch(`/tenant/admin/tenants/${id}/`, data),
  adminFeatures: (id)            => http.get(`/tenant/admin/tenants/${id}/features/`),
  adminSetFeatures: (id, data)   => http.patch(`/tenant/admin/tenants/${id}/features/`, data),
}

export default tenant
