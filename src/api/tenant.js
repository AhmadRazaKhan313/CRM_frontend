import http from "./http"

const tenant = {
  register: (data) => http.post("/tenant/register/", data),
  me: () => http.get("/tenant/me/"),
  update: (data) => http.patch("/tenant/me/", data),
}

export default tenant