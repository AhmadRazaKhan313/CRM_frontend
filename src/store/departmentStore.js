import { create } from "zustand"
import departmentsApi from "../api/departments"

const useDepartmentStore = create((set) => ({
  departments: [],
  current:     null,
  loading:     false,

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await departmentsApi.list()
      set({ departments: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchOne: async (id) => {
    set({ loading: true })
    try {
      const { data } = await departmentsApi.get(id)
      set({ current: data })
    } finally {
      set({ loading: false })
    }
  },

  add: (dept) => set((s) => ({
    departments: [dept, ...s.departments],
  })),

  update: (id, updated) => set((s) => ({
    departments: s.departments.map((d) => d.id === id ? { ...d, ...updated } : d),
    current: s.current?.id === id ? { ...s.current, ...updated } : s.current,
  })),

  remove: (id) => set((s) => ({
    departments: s.departments.filter((d) => d.id !== id),
  })),
}))

export default useDepartmentStore