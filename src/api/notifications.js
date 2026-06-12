import http from "./http"

const notifications = {
  list:        ()   => http.get("/notifications/"),
  unreadCount: ()   => http.get("/notifications/unread-count/"),
  markRead:    (id) => http.post(`/notifications/${id}/read/`),
  markAllRead: ()   => http.post("/notifications/read-all/"),
  delete:      (id) => http.delete(`/notifications/${id}/`),
}

export default notifications
