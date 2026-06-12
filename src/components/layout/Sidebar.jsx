import { NavLink, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { LogOut } from "lucide-react"
import useAuthStore from "../../store/authStore"
import useFeatureStore from "../../store/featureStore"
import { getDashboardRoute } from "../../utils/roleUtils"

const navConfig = {
  ceo: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:building-2",       path: "/departments",     label: "Departments",  feature: "departments_module" },
    { icon: "lucide:users",            path: "/employees",       label: "Employees" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:bar-chart-2",      path: "/analytics",       label: "Analytics",    feature: "analytics" },
    { icon: "lucide:badge-check",      path: "/hrms",            label: "HRMS",         feature: "hrms" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:timer",            path: "/hrms/shifts",     label: "Shifts",       feature: "hrms" },
    { icon: "lucide:dollar-sign",      path: "/hrms/salary",     label: "Salary",       feature: "hrms" },
    { icon: "lucide:receipt",          path: "/hrms/payroll",    label: "Payroll",      feature: "hrms" },
    { icon: "lucide:wallet",           path: "/finance",         label: "Finance" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
    { icon: "lucide:shield",           path: "/roles",           label: "Roles" },
  ],
  coo: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:building-2",       path: "/departments",     label: "Departments",  feature: "departments_module" },
    { icon: "lucide:users",            path: "/employees",       label: "Employees" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:bar-chart-2",      path: "/analytics",       label: "Analytics",    feature: "analytics" },
    { icon: "lucide:badge-check",      path: "/hrms",            label: "HRMS",         feature: "hrms" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:timer",            path: "/hrms/shifts",     label: "Shifts",       feature: "hrms" },
    { icon: "lucide:dollar-sign",      path: "/hrms/salary",     label: "Salary",       feature: "hrms" },
    { icon: "lucide:receipt",          path: "/hrms/payroll",    label: "Payroll",      feature: "hrms" },
    { icon: "lucide:wallet",           path: "/finance",         label: "Finance" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  dept_head: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:users",            path: "/employees",       label: "Employees" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:bar-chart-2",      path: "/analytics",       label: "Analytics",    feature: "analytics" },
    { icon: "lucide:badge-check",      path: "/hrms",            label: "HRMS",         feature: "hrms" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:timer",            path: "/hrms/shifts",     label: "Shifts",       feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  sales_director: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:bar-chart-2",      path: "/analytics",       label: "Analytics",    feature: "analytics" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  lead_manager: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:users",            path: "/employees",       label: "My Team" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  sales_manager: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:users",            path: "/employees",       label: "My Team" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",        feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  lead_employee: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "My Leads",     feature: "leads_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:receipt",          path: "/hrms/payroll",    label: "My Payslips",  feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
  sales_employee: [
    { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
    { icon: "lucide:user-plus",        path: "/leads",           label: "My Leads",     feature: "leads_module" },
    { icon: "lucide:handshake",        path: "/clients",         label: "Clients",      feature: "clients_module" },
    { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",        feature: "tasks_module" },
    { icon: "lucide:file-text",        path: "/reports",         label: "Reports",      feature: "reports_module" },
    { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",   feature: "hrms" },
    { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",       feature: "hrms" },
    { icon: "lucide:receipt",          path: "/hrms/payroll",    label: "My Payslips",  feature: "hrms" },
    { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  ],
}

export default function Sidebar() {
  const navigate   = useNavigate()
  const user       = useAuthStore((s) => s.user)
  const clearAuth  = useAuthStore((s) => s.clearAuth)
  const hasFeature = useFeatureStore((s) => s.hasFeature)

  const role     = user?.is_super_admin ? "ceo" : user?.role
  const allItems = navConfig[role] || navConfig.lead_employee

  const items = allItems.filter(({ feature }) => {
    if (!feature) return true
    if (user?.is_super_admin) return true
    return hasFeature(feature)
  })

  const handleLogout = () => {
    clearAuth()
    navigate("/signin")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 z-50">

      {/* Logo */}
      <div
        onClick={() => navigate(getDashboardRoute(user?.role))}
        className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center mb-5 shrink-0 cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <span className="text-white font-bold text-sm">C</span>
      </div>

      {/* Nav — scrollable, no visible scrollbar */}
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

            {/* ✅ Tooltip fix — top-1/2 -translate-y-1/2 prevents off-screen */}
            <span className="
              absolute left-[52px] top-1/2 -translate-y-1/2
              bg-gray-900 text-white text-xs font-medium
              px-2.5 py-1.5 rounded-lg
              opacity-0 group-hover:opacity-100
              transition-opacity duration-150
              whitespace-nowrap pointer-events-none
              z-[999]
              shadow-lg
            ">
              {label}
              {/* Arrow */}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-100 my-2 shrink-0" />

      {/* Bottom — logout + avatar */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">

        {/* Logout */}
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

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
          title={user?.full_name}
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