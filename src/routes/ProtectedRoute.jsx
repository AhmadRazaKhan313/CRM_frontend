import { Navigate, Outlet } from "react-router-dom"
import useAuthStore from "../store/authStore"

export default function ProtectedRoute() {
  const access = useAuthStore((s) => s.access)
  if (!access) return <Navigate to="/signin" replace />
  return <Outlet />
}