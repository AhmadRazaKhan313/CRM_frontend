import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      access: null,
      refresh: null,

      setAuth: (user, access, refresh) =>
        set({ user, access, refresh }),

      clearAuth: () =>
        set({ user: null, access: null, refresh: null }),

      updateUser: (user) => set({ user }),
    }),
    { name: "auth" }
  )
)

export default useAuthStore