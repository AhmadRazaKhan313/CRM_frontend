# Frontend Refactor — Changes

Naye backend (custom roles + permissions) ke hisaab se frontend update hua.

## Kya Badla

### Permissions System
- authStore mein `hasPermission(codename)` aur `hasAnyPermission([...])` helpers
- Login response se `user.permissions` array store hota hai
- Super admin ke paas hamesha sab permissions

### Dynamic Sidebar (utils/navConfig.js)
- Pehle 8 hardcoded role configs the — ab ek single NAV_ITEMS list
- Har item ke saath required permission + feature flag
- User ki permissions ke hisaab se links dikhti hain

### Single Dynamic Dashboard (features/dashboard/Dashboard.jsx)
- 5 role-based dashboards (CEO/Manager/Employee...) DELETE
- Ek attractive dashboard jo permissions ke hisaab se widgets dikhata hai
- Analytics stats sirf agar analytics.view + feature ho

### Employee Form
- System role dropdown HATA
- Sirf custom roles assign hote hain (REQUIRED — kam se kam ek)
- Agar koi role nahi bana, "Create a role first" link

### Department Form
- Type (sales/tech/seo) HATA — fully custom
- Sirf name + description + head

### Role Management
- RoleForm — modules updated (employees, roles, hrms, notifications add; sales hata)
- Permission checkboxes module-wise grouped

### Organization Creation (Super Admin)
- TenantList mein "New Organization" button + modal
- Sirf primary super admin bana sakta hai

### Removed
- SignUp.jsx, TenantRegister.jsx (self-register hata)
- features/dashboard/roles/ (saare role dashboards)
- roleUtils.js ab minimal (getDashboardRoute -> /dashboard)

## Setup

```
cd frontend
npm install
npm run dev
```

Login: jo super admin tumne backend mein banaya (hr@decibels.dev / Decibels@123)

## Important
- Backend pehle chalna chahiye (http://localhost:8000)
- Login ke baad permissions array aati hai jisse sidebar/dashboard bante hain
- Super admin ko sab dikhta hai
- Naye custom role banao (Roles page) phir employee ko assign karo
