import { create } from "zustand"
import employeesApi from "../api/employees"

const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  filters: { department: "", role: "", search: "" },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await employeesApi.list(get().filters)
      set({ employees: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (emp) => set((s) => ({ employees: [emp, ...s.employees] })),

  update: (id, updated) => set((s) => ({
    employees: s.employees.map((e) => e.id === id ? { ...e, ...updated } : e),
  })),

  remove: (id) => set((s) => ({
    employees: s.employees.filter((e) => e.id !== id),
  })),
}))

export default useEmployeeStore