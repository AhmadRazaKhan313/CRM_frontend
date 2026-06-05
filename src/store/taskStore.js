import { create } from "zustand"
import tasksApi from "../api/tasks"

const useTaskStore = create((set, get) => ({
  tasks: [],
  current: null,
  loading: false,
  filters: { status: "", priority: "", department: "" },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await tasksApi.list(get().filters)
      set({ tasks: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchOne: async (id) => {
    set({ loading: true })
    try {
      const { data } = await tasksApi.get(id)
      set({ current: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),

  update: (id, updated) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updated } : t),
    current: s.current?.id === id ? { ...s.current, ...updated } : s.current,
  })),

  addComment: (comment) => set((s) => ({
    current: s.current ? {
      ...s.current,
      comments: [...(s.current.comments || []), comment],
    } : s.current,
  })),

  remove: (id) => set((s) => ({
    tasks: s.tasks.filter((t) => t.id !== id),
  })),

  clear: () => set({ tasks: [], current: null }),
}))

export default useTaskStore