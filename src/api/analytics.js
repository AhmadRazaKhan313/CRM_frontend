import http from "./http"

const analytics = {
  overview: () => http.get("/analytics/overview/"),
  kpi: () => http.get("/analytics/kpi/"),
}

export default analytics