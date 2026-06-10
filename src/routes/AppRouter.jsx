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
import PageWrapper from "../components/layout/PageWrapper"
import ProtectedRoute from "./ProtectedRoute"
import ModuleGuard from "../components/guards/ModuleGuard"
import useAuthStore from "../store/authStore"
import { getDashboardRoute } from "../utils/roleUtils"

// ✅ HRMS Pages
import HRMSDashboard from "../features/hrms/HRMSDashboard"
import AttendancePage from "../features/hrms/AttendancePage"
import LeavePage from "../features/hrms/LeavePage"
import ShiftsPage from "../features/hrms/ShiftsPage"
import SalaryPage from "../features/hrms/SalaryPage"
import PayrollPage from "../features/hrms/PayrollPage"

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
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/ceo" element={<CEODashboard />} />
          <Route path="/dashboard/dept-head" element={<DeptHeadDashboard />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />

          {/* Core CRM */}
          <Route path="/roles" element={<RoleList />} />
          <Route path="/roles/new" element={<RoleForm />} />
          <Route path="/roles/:id/edit" element={<RoleForm />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />

          <Route path="/leads" element={<LeadList />} />
          <Route path="/leads/new" element={<LeadForm />} />
          <Route path="/leads/:id" element={<LeadDetail />} />

          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />

          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientDetail />} />

          <Route path="/reports" element={<ReportList />} />
          <Route path="/reports/new" element={<ReportForm />} />
          <Route path="/reports/:id" element={<ReportDetail />} />

          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/departments/new" element={<DepartmentForm />} />

          {/* Analytics — feature flag */}
          <Route
            path="/analytics"
            element={
              <ModuleGuard feature="analytics">
                <Analytics />
              </ModuleGuard>
            }
          />

          {/* ✅ HRMS — feature flag ke peeche, sab routes */}
          <Route
            path="/hrms"
            element={
              <ModuleGuard feature="hrms">
                <HRMSDashboard />
              </ModuleGuard>
            }
          />
          <Route
            path="/hrms/attendance"
            element={
              <ModuleGuard feature="hrms">
                <AttendancePage />
              </ModuleGuard>
            }
          />
          <Route
            path="/hrms/leaves"
            element={
              <ModuleGuard feature="hrms">
                <LeavePage />
              </ModuleGuard>
            }
          />
          <Route
            path="/hrms/shifts"
            element={
              <ModuleGuard feature="hrms">
                <ShiftsPage />
              </ModuleGuard>
            }
          />
          <Route
            path="/hrms/salary"
            element={
              <ModuleGuard feature="hrms">
                <SalaryPage />
              </ModuleGuard>
            }
          />
          <Route
            path="/hrms/payroll"
            element={
              <ModuleGuard feature="hrms">
                <PayrollPage />
              </ModuleGuard>
            }
          />

          {/* Super Admin */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/tenants" element={<TenantList />} />
          <Route path="/superadmin/tenants/:id" element={<TenantDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
