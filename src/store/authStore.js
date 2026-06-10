import { create } from "zustand"
import { persist } from "zustand/middleware"
import useFeatureStore from "./featureStore"

const useAuthStore = create(
  persist(
    (set) => ({
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