import { create } from "zustand"
import clientsApi from "../api/clients"

const useClientStore = create((set, get) => ({
  clients: [],
  current: null,
  loading: false,
  filters: { department: "", status: "", tag: "", search: "" },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await clientsApi.list(get().filters)
      set({ clients: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchOne: async (id) => {
    set({ loading: true })
    try {
      const { data } = await clientsApi.get(id)
      set({ current: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (client) => set((s) => ({ clients: [client, ...s.clients] })),

  update: (id, updated) => set((s) => ({
    clients: s.clients.map((c) => c.id === id ? { ...c, ...updated } : c),
    current: s.current?.id === id ? { ...s.current, ...updated } : s.current,
  })),

  remove: (id) => set((s) => ({
    clients: s.clients.filter((c) => c.id !== id),
  })),

  clear: () => set({ clients: [], current: null }),
}))

export default useClientStore