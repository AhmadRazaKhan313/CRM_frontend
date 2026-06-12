import { Routes, Route, Navigate } from "react-router-dom"
import SignIn from "../features/auth/SignIn"
import SignUp from "../features/auth/SignUp"
import TenantRegister from "../features/auth/TenantRegister"
import CEODashboard from "../features/dashboard/roles/CEODashboard"
import DeptHeadDashboard from "../features/dashboard/roles/DeptHeadDashboard"
import ManagerDashboard from "../features/dashboard/roles/ManagerDashboard"
import EmployeeDashboard from "../features/dashboard/roles/EmployeeDashboard"
import RoleList from "../features/roles/RoleList"
import RoleForm from "../features/roles/RoleForm"
import EmployeeList from "../features/employees/EmployeeList"
import EmployeeForm from "../features/employees/EmployeeForm"
import EmployeeDetail from "../features/employees/EmployeeDetail"
import LeadList from "../features/leads/LeadList"
import LeadForm from "../features/leads/LeadForm"
import LeadDetail from "../features/leads/LeadDetail"
import TaskList from "../features/tasks/TaskList"
import TaskForm from "../features/tasks/TaskForm"
import TaskDetail from "../features/tasks/TaskDetail"
import ClientList from "../features/clients/ClientList"
import ClientForm from "../features/clients/ClientForm"
import ClientDetail from "../features/clients/ClientDetail"
import ReportList from "../features/reports/ReportList"
import ReportForm from "../features/reports/ReportForm"
import ReportDetail from "../features/reports/ReportDetail"
import DepartmentList from "../features/departments/DepartmentList"
import DepartmentDetail from "../features/departments/DepartmentDetail"
import DepartmentForm from "../features/departments/DepartmentForm"
import SuperAdminDashboard from "../features/superadmin/SuperAdminDashboard"
import TenantList from "../features/superadmin/TenantList"
import TenantDetail from "../features/superadmin/TenantDetail"
import Analytics from "../features/analytics/Analytics"
import Finance from "../features/finance/Finance"
import Notifications from "../features/notifications/Notifications"
import PageWrapper from "../components/layout/PageWrapper"
import ProtectedRoute from "./ProtectedRoute"
import ModuleGuard from "../components/guards/ModuleGuard"
import useAuthStore from "../store/authStore"
import { getDashboardRoute } from "../utils/roleUtils"
import InvoiceList   from "../features/finance/InvoiceList"
import InvoiceForm   from "../features/finance/InvoiceForm"
import InvoiceDetail from "../features/finance/InvoiceDetail"
import ExpenseList   from "../features/finance/ExpenseList"
import ExpenseForm   from "../features/finance/ExpenseForm"

// HRMS Pages
import HRMSDashboard from "../features/hrms/HRMSDashboard"
import AttendancePage from "../features/hrms/AttendancePage"
import LeavePage from "../features/hrms/LeavePage"
import ShiftsPage from "../features/hrms/ShiftsPage"
import SalaryPage from "../features/hrms/SalaryPage"
import PayrollPage from "../features/hrms/PayrollPage"
import SalesDirectorDashboard from "../features/dashboard/roles/SalesDirectorDashboard"

function DashboardRedirect() {
  const user = useAuthStore((s) => s.user)
  return <Navigate to={getDashboardRoute(user?.role)} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<TenantRegister />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PageWrapper />}>

          {/* Dashboards */}
          <Route path="/dashboard"           element={<DashboardRedirect />} />
          <Route path="/dashboard/ceo"       element={<CEODashboard />} />
          <Route path="/dashboard/dept-head" element={<DeptHeadDashboard />} />
          <Route path="/dashboard/manager"   element={<ManagerDashboard />} />
          <Route path="/dashboard/employee"  element={<EmployeeDashboard />} />
          <Route path="/dashboard/sales-director" element={<SalesDirectorDashboard />} />

          {/* Roles */}
          <Route path="/roles"          element={<RoleList />} />
          <Route path="/roles/new"      element={<RoleForm />} />
          <Route path="/roles/:id/edit" element={<RoleForm />} />

          {/* Employees */}
          <Route path="/employees"           element={<EmployeeList />} />
          <Route path="/employees/new"       element={<EmployeeForm />} />
          <Route path="/employees/:id"       element={<EmployeeDetail />} />
          <Route path="/employees/:id/edit"  element={<EmployeeForm />} />

          {/* Finance */}
          <Route path="/finance"                  element={<Finance />} />
          <Route path="/finance/invoices"         element={<InvoiceList />} />
          <Route path="/finance/invoices/new"     element={<InvoiceForm />} />
          <Route path="/finance/invoices/:id"     element={<InvoiceDetail />} />
          <Route path="/finance/invoices/:id/edit" element={<InvoiceForm />} />
          <Route path="/finance/expenses"         element={<ExpenseList />} />
          <Route path="/finance/expenses/new"     element={<ExpenseForm />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* ── CRM Modules ── */}

          {/* Leads */}
          <Route path="/leads"          element={<ModuleGuard feature="leads_module"><LeadList /></ModuleGuard>} />
          <Route path="/leads/new"      element={<ModuleGuard feature="leads_module"><LeadForm /></ModuleGuard>} />
          <Route path="/leads/:id"      element={<ModuleGuard feature="leads_module"><LeadDetail /></ModuleGuard>} />
          <Route path="/leads/:id/edit" element={<ModuleGuard feature="leads_module"><LeadForm /></ModuleGuard>} />

          {/* Clients */}
          <Route path="/clients"     element={<ModuleGuard feature="clients_module"><ClientList /></ModuleGuard>} />
          <Route path="/clients/new" element={<ModuleGuard feature="clients_module"><ClientForm /></ModuleGuard>} />
          <Route path="/clients/:id" element={<ModuleGuard feature="clients_module"><ClientDetail /></ModuleGuard>} />

          {/* Tasks */}
          <Route path="/tasks"     element={<ModuleGuard feature="tasks_module"><TaskList /></ModuleGuard>} />
          <Route path="/tasks/new" element={<ModuleGuard feature="tasks_module"><TaskForm /></ModuleGuard>} />
          <Route path="/tasks/:id" element={<ModuleGuard feature="tasks_module"><TaskDetail /></ModuleGuard>} />

          {/* Reports */}
          <Route path="/reports"     element={<ModuleGuard feature="reports_module"><ReportList /></ModuleGuard>} />
          <Route path="/reports/new" element={<ModuleGuard feature="reports_module"><ReportForm /></ModuleGuard>} />
          <Route path="/reports/:id" element={<ModuleGuard feature="reports_module"><ReportDetail /></ModuleGuard>} />

          {/* Departments */}
          <Route path="/departments"          element={<ModuleGuard feature="departments_module"><DepartmentList /></ModuleGuard>} />
          <Route path="/departments/new"      element={<ModuleGuard feature="departments_module"><DepartmentForm /></ModuleGuard>} />
          <Route path="/departments/:id"      element={<ModuleGuard feature="departments_module"><DepartmentDetail /></ModuleGuard>} />
          <Route path="/departments/:id/edit" element={<ModuleGuard feature="departments_module"><DepartmentForm /></ModuleGuard>} />

          {/* Analytics */}
          <Route path="/analytics" element={<ModuleGuard feature="analytics"><Analytics /></ModuleGuard>} />

          {/* HRMS */}
          <Route path="/hrms"            element={<ModuleGuard feature="hrms"><HRMSDashboard /></ModuleGuard>} />
          <Route path="/hrms/attendance" element={<ModuleGuard feature="hrms"><AttendancePage /></ModuleGuard>} />
          <Route path="/hrms/leaves"     element={<ModuleGuard feature="hrms"><LeavePage /></ModuleGuard>} />
          <Route path="/hrms/shifts"     element={<ModuleGuard feature="hrms"><ShiftsPage /></ModuleGuard>} />
          <Route path="/hrms/salary"     element={<ModuleGuard feature="hrms"><SalaryPage /></ModuleGuard>} />
          <Route path="/hrms/payroll"    element={<ModuleGuard feature="hrms"><PayrollPage /></ModuleGuard>} />

          {/* Super Admin */}
          <Route path="/superadmin"             element={<SuperAdminDashboard />} />
          <Route path="/superadmin/tenants"     element={<TenantList />} />
          <Route path="/superadmin/tenants/:id" element={<TenantDetail />} />

        </Route>
      </Route>
    </Routes>
  )
}