import { NavLink, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { LogOut } from "lucide-react"
import useAuthStore from "../../store/authStore"
import { getDashboardRoute } from "../../utils/roleUtils"

const navConfig = {
  ceo: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:building-2", path: "/departments", label: "Departments" },
    { icon: "lucide:users", path: "/employees", label: "Employees" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
    { icon: "lucide:dollar-sign", path: "/finance", label: "Finance" },
    { icon: "lucide:bar-chart-2", path: "/analytics", label: "Analytics" },
    { icon: "lucide:shield", path: "/roles", label: "Roles" },
    { icon: "lucide:settings", path: "/settings", label: "Settings" },
  ],
  coo: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:building-2", path: "/departments", label: "Departments" },
    { icon: "lucide:users", path: "/employees", label: "Employees" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
    { icon: "lucide:bar-chart-2", path: "/analytics", label: "Analytics" },
    { icon: "lucide:settings", path: "/settings", label: "Settings" },
  ],
  dept_head: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:users", path: "/employees", label: "Employees" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
    { icon: "lucide:bar-chart-2", path: "/analytics", label: "Analytics" },
  ],
  sales_director: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
    { icon: "lucide:bar-chart-2", path: "/analytics", label: "Analytics" },
  ],
  lead_manager: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:users", path: "/employees", label: "My Team" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
  ],
  sales_manager: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:users", path: "/employees", label: "My Team" },
    { icon: "lucide:user-plus", path: "/leads", label: "Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
  ],
  lead_employee: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:user-plus", path: "/leads", label: "My Leads" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
  ],
  sales_employee: [
    { icon: "lucide:layout-dashboard", path: "/dashboard", label: "Dashboard" },
    { icon: "lucide:user-plus", path: "/leads", label: "My Leads" },
    { icon: "lucide:handshake", path: "/clients", label: "Clients" },
    { icon: "lucide:clipboard-list", path: "/tasks", label: "Tasks" },
    { icon: "lucide:file-text", path: "/reports", label: "Reports" },
  ],
}

export default function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const role = user?.is_super_admin ? "ceo" : user?.role
  const items = navConfig[role] || navConfig.lead_employee

  const handleLogout = () => {
    clearAuth()
    navigate("/signin")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate(getDashboardRoute(user?.role))}
        className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mb-6 shrink-0 cursor-pointer hover:bg-primary-dark transition-colors"
      >
        <span className="text-white font-bold text-sm">C</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2 overflow-y-auto scrollbar-none">
        {items.map(({ icon, path, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            className={({ isActive }) =>
              `relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors group
              ${isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              }`
            }
          >
            <Icon icon={icon} className="w-[18px] h-[18px]" />
            {badge && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-semibold flex items-center justify-center">
                {badge}
              </span>
            )}
            {/* Tooltip */}
            <span className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom — Avatar + Logout */}
      <div className="mt-auto flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors group relative"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Logout
          </span>
        </button>

        <div
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
          title={user?.full_name}
        >
          {user?.avatar ? (
            <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-primary">
              {user?.full_name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}