import http from "./http"

const auth = {
  login:          (email, password)         => http.post("/auth/login/", { email, password }),
  logout:         (refresh)                 => http.post("/auth/logout/", { refresh }),
  me:             ()                        => http.get("/auth/me/"),
  refresh:        (refresh)                 => http.post("/auth/token/refresh/", { refresh }),
  changePassword: (old_password, new_password) => http.post("/auth/change-password/", { old_password, new_password }),
}

export default auth
