import { create } from "zustand"
import notificationsApi from "../api/notifications"

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount:   0,
  loading:       false,

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await notificationsApi.list()
      set({ notifications: data, unreadCount: data.filter((n) => !n.is_read).length })
    } finally {
      set({ loading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await notificationsApi.unreadCount()
      set({ unreadCount: data.count })
    } catch {}
  },

  markRead: async (id) => {
    await notificationsApi.markRead(id)
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }))
  },

  markAllRead: async () => {
    await notificationsApi.markAllRead()
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }))
  },

  remove: async (id) => {
    await notificationsApi.delete(id)
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
      unreadCount: s.notifications.find((n) => n.id === id && !n.is_read)
        ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
    }))
  },
}))

export default useNotificationStore
