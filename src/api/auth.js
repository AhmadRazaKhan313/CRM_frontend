import http from "./http"

const auth = {
  login: (email, password) =>
    http.post("/auth/login/", { email, password }),

  register: (data) =>
    http.post("/auth/register/", data),

  logout: (refresh) =>
    http.post("/auth/logout/", { refresh }),

  me: () =>
    http.get("/auth/me/"),

  refresh: (refresh) =>
    http.post("/auth/token/refresh/", { refresh }),
}

export default auth