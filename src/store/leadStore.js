import { create } from "zustand"
import leadsApi from "../api/leads"

const useLeadStore = create((set, get) => ({
  leads: [],
  current: null,
  loading: false,
  filters: { status: "", department: "", source: "", search: "" },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await leadsApi.list(get().filters)
      set({ leads: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchOne: async (id) => {
    set({ loading: true })
    try {
      const { data } = await leadsApi.get(id)
      set({ current: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),

  update: (id, updated) => set((s) => ({
    leads: s.leads.map((l) => l.id === id ? { ...l, ...updated } : l),
    current: s.current?.id === id ? { ...s.current, ...updated } : s.current,
  })),

  addActivity: (activity) => set((s) => ({
    current: s.current ? {
      ...s.current,
      activities: [activity, ...(s.current.activities || [])],
    } : s.current,
  })),

  remove: (id) => set((s) => ({
    leads: s.leads.filter((l) => l.id !== id),
  })),

  clear: () => set({ leads: [], current: null }),
}))

export default useLeadStore