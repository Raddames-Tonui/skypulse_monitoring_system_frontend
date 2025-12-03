# SkyPulse Monitoring System — Frontend

A modern, secure, and high-performance frontend for the **SkyPulse Monitoring System**, built using **Vite**, **React**, **TypeScript**, **TanStack Router**, and **Tailwind/CSS modules**. This frontend communicates with the SkyPulse backend API and implements full authentication, authorization, and RBAC security.

Live Deployment: **[https://skypulse-mss.netlify.app/](https://skypulse-mss.netlify.app/)**



##  Tech Stack

* **React + TypeScript** — Component-based UI architecture
* **Vite** — Fast development & optimized build
* **TanStack Router** — Type-safe routing with loaders & route guards
* **Axios** — API client with interceptors
* **React Context** — Global state for authentication
* **RBAC (Role-Based Access Control)** — Admin/Operator route segregation
* **React Hot Toast** — Global notifications
* **Netlify** — Production hosting



##  Project Structure

```
src/
 ├── assets/          # Images, static files
 ├── components/      # Reusable UI components
 ├── context/         # Auth & Theme providers
 ├── hooks/           # Custom hooks
 ├── pages/           # Page-level components
 ├── routes/          # TanStack route definitions
 ├── utils/           # Helpers & axios client
 ├── css/             # Global and modular CSS
 ├── main.tsx         # App bootstrap
 ├── routeTree.gen.ts # Auto-generated route tree
```

A clean and modular structure ensures the system is easy to scale and maintain.



##  Authentication Overview

Authentication is powered by a dedicated **AuthProvider**, which:

* Loads user profile on app startup
* Manages login & logout
* Stores authenticated user in React Context
* Restores sessions using backend HttpOnly cookies
* Exposes `user`, `isLoading`, `login`, `logout`, and `fetchProfile` globally

The provider automatically calls `/auth/profile` to restore sessions.

---

##  Role-Based Access Control (RBAC)

Routes are protected based on **user roles**, enforced at multiple layers:

### 1. Route-Level Guarding (beforeLoad)

TanStack Router blocks access before rendering:

```ts
beforeLoad: async () => {
  await axiosClient.get('/auth/profile');
}
```

Redirects to login if unauthorized.

### 2. UI-Level Guarding (ProtectedRoute)

Pages can restrict access like:

```tsx
<ProtectedRoute allowed={["ADMIN"]} />
```

Or combined roles:

```tsx
<ProtectedRoute allowed={["ADMIN", "OPERATOR"]} />
```

Unauthorized users see the custom **Access Denied** page.

---

##  Getting Started

### 1. Clone the Repository

```sh
git clone git@github.com:Raddames-Tonui/skypulse_monitoring_system_frontend.git
cd skypulse_monitoring_system_frontend
```

### 2. Env Setup

Create a `.env` file:

```env
VITE_BASE_API_URL=https://skypulse-monitoring-system-backend.onrender.com/api/rest
```

### 3. Install Dependencies

Using **pnpm** (recommended):

```sh
pnpm install
```

Or npm:

```sh
npm install
```

### 4. Run Development Server

```sh
pnpm run dev
# or
npm run dev
```

### 5. Build for Production

```sh
pnpm run build
# or
npm run build
```

### 6. Preview Production Build

```sh
pnpm run preview
```



##  Features

* Secure login/logout using backend sessions
* Auto-session recovery on refresh
* RBAC-protected routes (Admin / Operator)
* Fully responsive layout with sidebar, mobile view & protected shell
* Global notifications via react-hot-toast
* Centralized Axios client for consistent API handling
* Clean unauthorized & loading states



## Deployment

This frontend is currently deployed on **Netlify**.
Just push updates to the main branch, and Netlify rebuilds automatically.



##  Future Enhancements

* Audit log viewer (Admin only)
* Real-time notifications using WebSockets
* User preference editor UI
* Theme customization features



##  Conclusion

This frontend delivers a robust, secure, and maintainable user interface for the SkyPulse Monitoring System. With RBAC, strong authentication flow, and clean architecture, the system is ready for enterprise-level expansion.

