import { Routes, Route, Navigate } from "react-router-dom"
import SignIn from "../features/auth/SignIn"
import SignUp from "../features/auth/SignUp"
import TenantRegister from "../features/auth/TenantRegister"
import CEODashboard from "../features/dashboard/roles/CEODashboard"
import DeptHeadDashboard from "../features/dashboard/roles/DeptHeadDashboard"
import ManagerDashboard from "../features/dashboard/roles/ManagerDashboard"
import EmployeeDashboard from "../features/dashboard/roles/EmployeeDashboard"
import NewAcademicClient from "../features/clients/NewAcademicClient"
import RoleList from "../features/roles/RoleList"
import RoleForm from "../features/roles/RoleForm"
import EmployeeList from "../features/employees/EmployeeList"
import EmployeeForm from "../features/employees/EmployeeForm"
import LeadList from "../features/leads/LeadList"
import LeadForm from "../features/leads/LeadForm"
import PageWrapper from "../components/layout/PageWrapper"
import ProtectedRoute from "./ProtectedRoute"
import useAuthStore from "../store/authStore"
import { getDashboardRoute } from "../utils/roleUtils"
import LeadDetail from "../features/leads/LeadDetail"
import TaskList from "../features/tasks/TaskList"
import TaskForm from "../features/tasks/TaskForm"
import TaskDetail from "../features/tasks/TaskDetail"
// import ClientDetail from "../features/clients/ClientDetail"
import ReportList from "../features/reports/ReportList"
import ReportForm from "../features/reports/ReportForm"
import ReportDetail from "../features/reports/ReportDetail"


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
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/ceo" element={<CEODashboard />} />
          <Route path="/dashboard/dept-head" element={<DeptHeadDashboard />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
          <Route path="/clients/academic/new" element={<NewAcademicClient />} />
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
          <Route path="/reports" element={<ReportList />} />
          {/* <Route path="/clients/:id" element={<ClientDetail />} /> */}
          
<Route path="/reports/new" element={<ReportForm />} />
<Route path="/reports/:id" element={<ReportDetail />} />

        </Route>
      </Route>
    </Routes>
  )
}