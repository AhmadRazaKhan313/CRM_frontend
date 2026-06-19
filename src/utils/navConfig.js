// Single nav config — har item ke saath required permission aur feature flag.
// Sidebar isi se dynamically links banata hai (user ki permissions ke hisaab se).
// Koi hardcoded role nahi.

export const NAV_ITEMS = [
  { icon: "lucide:layout-dashboard", path: "/dashboard",       label: "Dashboard" },
  { icon: "lucide:building-2",       path: "/departments",     label: "Departments",   permission: "departments.view", feature: "departments_module" },
  { icon: "lucide:users",            path: "/employees",       label: "Employees",     permission: "employees.view" },
  { icon: "lucide:shield",           path: "/roles",           label: "Roles",         permission: "roles.view" },
  { icon: "lucide:user-plus",        path: "/leads",           label: "Leads",         permission: "leads.view",    feature: "leads_module" },
  { icon: "lucide:handshake",        path: "/clients",         label: "Clients",       permission: "clients.view",  feature: "clients_module" },
  { icon: "lucide:clipboard-list",   path: "/tasks",           label: "Tasks",         permission: "tasks.view",    feature: "tasks_module" },
  { icon: "lucide:file-text",        path: "/reports",         label: "Reports",       permission: "reports.view",  feature: "reports_module" },
  { icon: "lucide:bar-chart-2",      path: "/analytics",       label: "Analytics",     permission: "analytics.view", feature: "analytics" },
  { icon: "lucide:wallet",           path: "/finance",         label: "Finance",       permission: "finance.view",  feature: "finance_module" },
  { icon: "lucide:package",          path: "/delivery",        label: "Delivery",      permission: "delivery.view", feature: "delivery_module" },
  { icon: "lucide:badge-check",      path: "/hrms",            label: "HRMS",          permission: "hrms.view",     feature: "hrms" },
  { icon: "lucide:clock",            path: "/hrms/attendance", label: "Attendance",    permission: "hrms.view",     feature: "hrms" },
  { icon: "lucide:calendar-off",     path: "/hrms/leaves",     label: "Leaves",        permission: "hrms.view",     feature: "hrms" },
  { icon: "lucide:timer",            path: "/hrms/shifts",     label: "Shifts",        permission: "hrms.edit",     feature: "hrms" },
  { icon: "lucide:dollar-sign",      path: "/hrms/salary",     label: "Salary",        permission: "hrms.edit",     feature: "hrms" },
  { icon: "lucide:receipt",          path: "/hrms/payroll",    label: "Payroll",       permission: "hrms.view",     feature: "hrms" },
  // Super admin only — organizations
  { icon: "lucide:network",          path: "/superadmin/tenants", label: "Organizations", superAdminOnly: true },
  // Sab ke liye
  { icon: "lucide:bell",             path: "/notifications",   label: "Notifications" },
  { icon: "lucide:settings",         path: "/settings",        label: "Settings" },
]

// Ek nav item user ko dikhana hai ya nahi
export function canSeeNavItem(item, { isSuperAdmin, hasPermission, hasFeature }) {
  // Super admin only items
  if (item.superAdminOnly) return isSuperAdmin

  // Feature flag check (agar item pe feature hai)
  if (item.feature && !hasFeature(item.feature)) return false

  // Permission check (agar item pe permission hai)
  if (item.permission && !hasPermission(item.permission)) return false

  // Koi permission nahi (jaise Dashboard, Notifications, Settings) → sabko dikhe
  return true
}
