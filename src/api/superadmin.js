import http from "./http"

const superadmin = {
  stats: () => http.get("/tenant/admin/stats/"),
  tenants: () => http.get("/tenant/admin/tenants/"),
  getTenant: (id) => http.get(`/tenant/admin/tenants/${id}/`),
  updateTenant: (id, data) => http.patch(`/tenant/admin/tenants/${id}/`, data),
  updateFeatures: (id, data) => http.patch(`/tenant/admin/tenants/${id}/features/`, data),
}

export default superadmin