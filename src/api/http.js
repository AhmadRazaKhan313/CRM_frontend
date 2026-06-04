import axios from "axios"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth")
  if (raw) {
    const { state } = JSON.parse(raw)
    if (state?.access) config.headers.Authorization = `Bearer ${state.access}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const raw = localStorage.getItem("auth")
        if (!raw) throw new Error()
        const { state } = JSON.parse(raw)
        const { data } = await http.post("/auth/token/refresh/", {
          refresh: state.refresh,
        })
        const authState = JSON.parse(localStorage.getItem("auth"))
        authState.state.access = data.access
        localStorage.setItem("auth", JSON.stringify(authState))
        original.headers.Authorization = `Bearer ${data.access}`
        return http(original)
      } catch {
        localStorage.removeItem("auth")
        window.location.href = "/signin"
      }
    }

    return Promise.reject(err)
  }
)

export default http