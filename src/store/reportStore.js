import { create } from "zustand"
import reportsApi from "../api/reports"

const useReportStore = create((set, get) => ({
  reports: [],
  current: null,
  loading: false,
  filters: { date: "", department: "", status: "", employee: "" },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await reportsApi.list(get().filters)
      set({ reports: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchOne: async (id) => {
    set({ loading: true })
    try {
      const { data } = await reportsApi.get(id)
      set({ current: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (report) => set((s) => ({ reports: [report, ...s.reports] })),

  update: (id, updated) => set((s) => ({
    reports: s.reports.map((r) => r.id === id ? { ...r, ...updated } : r),
    current: s.current?.id === id ? { ...s.current, ...updated } : s.current,
  })),
}))

export default useReportStore