import { create } from "zustand"
import rolesApi from "../api/roles"

const useRoleStore = create((set, get) => ({
  roles: [],
  permissions: [],
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const { data } = await rolesApi.list()
      set({ roles: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchPermissions: async () => {
    const { data } = await rolesApi.permissions()
    set({ permissions: data })
  },

  add: (role) => set((s) => ({ roles: [role, ...s.roles] })),

  update: (id, updated) => set((s) => ({
    roles: s.roles.map((r) => r.id === id ? { ...r, ...updated } : r),
  })),

  remove: (id) => set((s) => ({
    roles: s.roles.filter((r) => r.id !== id),
  })),
}))

export default useRoleStore