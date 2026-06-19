import { create } from "zustand"
import { persist } from "zustand/middleware"
import useFeatureStore from "./featureStore"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      access: null,
      refresh: null,

      setAuth: (user, access, refresh) => {
        const features = user?.tenant?.features ?? {}
        useFeatureStore.getState().setFlags(features)
        set({ user, access, refresh })
      },

      clearAuth: () => {
        useFeatureStore.getState().clearFlags()
        set({ user: null, access: null, refresh: null })
      },

      updateUser: (user) => set({ user }),

      // Permission check — super admin ke paas sab hota hai
      hasPermission: (codename) => {
        const user = get().user
        if (!user) return false
        if (user.is_super_admin) return true
        return (user.permissions || []).includes(codename)
      },

      // Multiple permissions mein se koi ek bhi ho
      hasAnyPermission: (codenames = []) => {
        const user = get().user
        if (!user) return false
        if (user.is_super_admin) return true
        const perms = user.permissions || []
        return codenames.some((c) => perms.includes(c))
      },
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        if (state?.user?.tenant?.features) {
          useFeatureStore.getState().setFlags(state.user.tenant.features)
        }
      },
    }
  )
)

export default useAuthStore
