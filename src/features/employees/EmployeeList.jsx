import { useState, useEffect } from "react"
import { Plus, Search, UserCheck, UserX, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import employeesApi from "../../api/employees"

const DEPARTMENTS = ["academic", "tech", "seo"]
const ROLES = [
  "coo", "dept_head", "sales_director",
  "lead_manager", "sales_manager", "lead_employee", "sales_employee"
]

const deptColors = {
  academic: "bg-blue-50 text-blue-600",
  tech: "bg-purple-50 text-purple-600",
  seo: "bg-green-50 text-green-600",
}

const roleColors = {
  coo: "bg-red-50 text-red-600",
  dept_head: "bg-orange-50 text-orange-600",
  sales_director: "bg-yellow-50 text-yellow-600",
  lead_manager: "bg-indigo-50 text-indigo-600",
  sales_manager: "bg-teal-50 text-teal-600",
  lead_employee: "bg-pink-50 text-pink-600",
  sales_employee: "bg-cyan-50 text-cyan-600",
}

export default function EmployeeList() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({ department: "", role: "" })

  const fetchEmployees = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (filters.department) params.department = filters.department
    if (filters.role) params.role = filters.role
    employeesApi.list(params)
      .then(({ data }) => setList(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [filters])

  const handleSearch = (e) => {
    if (e.key === "Enter") fetchEmployees()
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this employee?")) return
    await employeesApi.deactivate(id)
    fetchEmployees()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Management</p>
          <h1 className="text-xl font-bold text-gray-900">Employees</h1>
        </div>
        <button
          onClick={() => navigate("/employees/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-300 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search by name or email..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value }))}
            className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="capitalize">{d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <select
            value={filters.role}
            onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
            className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-primary bg-white"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replace("_", " ")}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="lucide:users" className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No employees found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first employee to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Custom Roles</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {emp.avatar ? (
                          <img src={emp.avatar} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-primary">
                            {emp.full_name?.[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{emp.full_name}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {emp.department ? (
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${deptColors[emp.department] || "bg-gray-100 text-gray-500"}`}>
                        {emp.department}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${roleColors[emp.role] || "bg-gray-100 text-gray-500"}`}>
                      {emp.role_display}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {emp.assigned_roles.length > 0 ? emp.assigned_roles.map((r, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg">
                          {r}
                        </span>
                      )) : (
                        <span className="text-xs text-gray-300">No custom roles</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {emp.is_active ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-600">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span className="text-xs text-gray-400">Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit"
                      >
                        <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(emp.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Deactivate"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}