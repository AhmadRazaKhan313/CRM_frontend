import http from "./http"

const clients = {
  list: (params) => http.get("/clients/", { params }),
  get: (id) => http.get(`/clients/${id}/`),
  create: (data) => http.post("/clients/", data),
  update: (id, data) => http.patch(`/clients/${id}/`, data),
  archive: (id) => http.delete(`/clients/${id}/`),
  addPayment: (id, data) => http.post(`/clients/${id}/payments/`, data),
  updatePayment: (id, data) => http.patch(`/clients/${id}/payments/`, data),
  uploadFile: (id, file) => {
    const fd = new FormData()
    fd.append("file", file)
    return http.post(`/clients/${id}/files/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}

export default clients