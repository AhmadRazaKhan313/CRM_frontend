export const ROLES = {
  CEO: "ceo",
  COO: "coo",
  DEPT_HEAD: "dept_head",
  SALES_DIRECTOR: "sales_director",
  LEAD_MANAGER: "lead_manager",
  SALES_MANAGER: "sales_manager",
  LEAD_EMPLOYEE: "lead_employee",
  SALES_EMPLOYEE: "sales_employee",
}

export const TOP_LEVEL = [ROLES.CEO, ROLES.COO]
export const MANAGERS = [ROLES.LEAD_MANAGER, ROLES.SALES_MANAGER]
export const EMPLOYEES = [ROLES.LEAD_EMPLOYEE, ROLES.SALES_EMPLOYEE]

export function getDashboardRoute(role) {
  if ([ROLES.CEO, ROLES.COO].includes(role)) return "/dashboard/ceo"
  if (role === ROLES.DEPT_HEAD) return "/dashboard/dept-head"
  if (role === ROLES.SALES_DIRECTOR) return "/dashboard/sales-director"
  if ([ROLES.LEAD_MANAGER, ROLES.SALES_MANAGER].includes(role)) return "/dashboard/manager"
  return "/dashboard/employee"
}

export function canAccess(userRole, allowedRoles) {
  if (userRole === "super_admin") return true
  return allowedRoles.includes(userRole)
}