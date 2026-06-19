import { NavLink, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { LogOut } from "lucide-react"
import useAuthStore from "../../store/authStore"
import useFeatureStore from "../../store/featureStore"
import { NAV_ITEMS, canSeeNavItem } from "../../utils/navConfig"

export default function Sidebar() {
  const navigate      = useNavigate()
  const user          = useAuthStore((s) => s.user)
  const clearAuth     = useAuthStore((s) => s.clearAuth)
  const hasPermission = useAuthStore((s) => s.hasPermission)
  const hasFeature    = useFeatureStore((s) => s.hasFeature)

  const isSuperAdmin = Boolean(user?.is_super_admin)

  // Sidebar links user ki permissions + features ke hisaab se dynamically banti hain
  const items = NAV_ITEMS.filter((item) =>
    canSeeNavItem(item, { isSuperAdmin, hasPermission, hasFeature })
  )

  const handleLogout = () => {
    clearAuth()
    navigate("/signin")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 z-50">

      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center mb-5 shrink-0 cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <span className="text-white font-bold text-sm">C</span>
      </div>

      {/* Nav */}
      <nav
        className="flex flex-col items-center gap-0.5 flex-1 w-full px-2 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map(({ icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) =>
              `relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group
              ${isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            <Icon icon={icon} className="w-[18px] h-[18px] shrink-0" />
            <span className="
              absolute left-[52px] top-1/2 -translate-y-1/2
              bg-gray-900 text-white text-xs font-medium
              px-2.5 py-1.5 rounded-lg
              opacity-0 group-hover:opacity-100
              transition-opacity duration-150
              whitespace-nowrap pointer-events-none z-[999] shadow-lg
            ">
              {label}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-100 my-2 shrink-0" />

      {/* Bottom — logout + avatar */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <button
          onClick={handleLogout}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all group"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="
            absolute left-[52px] top-1/2 -translate-y-1/2
            bg-gray-900 text-white text-xs font-medium
            px-2.5 py-1.5 rounded-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-150
            whitespace-nowrap pointer-events-none z-[999] shadow-lg
          ">
            Logout
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </span>
        </button>

        <div
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
          title={user?.full_name}
          onClick={() => navigate("/settings")}
        >
          {user?.avatar ? (
            <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
          ) : (
            <span className="text-xs font-bold text-primary">
              {user?.full_name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
