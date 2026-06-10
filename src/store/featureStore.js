/**
 * featureStore.js
 *
 * Login ke baad tenant ke feature flags yahan store hote hain.
 * authStore mein user load hone ke baad yeh store populate hota hai.
 *
 * Usage:
 *   const { hasFeature } = useFeatureStore()
 *   if (hasFeature("analytics")) { ... }
 */

import { create } from "zustand"

const useFeatureStore = create((set, get) => ({
  flags: null, // null = not loaded yet

  // Login ke baad call karo — tenant.features object pass karo
  setFlags: (features) => set({ flags: features ?? {} }),

  // Feature check karta hai
  hasFeature: (featureName) => {
    const { flags } = get()
    if (!flags) return false
    return Boolean(flags[featureName])
  },

  // Clear on logout
  clearFlags: () => set({ flags: null }),
}))

export default useFeatureStore
