# EpaDash Frontend Application Architecture Specification

> **Project**: EpaDash Platform  
> **Architecture Scope**: Customer Web Application, Rider Application, Merchant Portal, Administration Dashboard, and Shared Core Package (`@epadash/shared`)  
> **Status**: Production Architecture Implemented & Verified  
> **Tech Stack**: React 18, JavaScript (ES2022 + JSX), Vite 5, Tailwind CSS, React Router v6.4+, Zustand, Axios, Zod, pnpm Workspaces

---

## 1. Architectural Philosophy & Monorepo Topology

The EpaDash frontend is designed around a **modular workspace monorepo** using `pnpm`. This architecture ensures:
- **Zero Code Duplication**: Core business logic, token lifecycle, centralized Axios networking, responsive layouts, design tokens, and validation schemas reside inside `@epadash/shared`.
- **Independent Application Deployment**: Each consumer application (`customer`, `rider`, `merchant`, `admin`) is isolated with its own Vite build pipeline, runtime port, and bundle boundaries.
- **Strict Role Boundaries**: Domain-specific UI/UX models are enforced via role-based route guards (`ProtectedRoute`), while allowing unified authentication session persistence across the platform.

```
epadash/
├── package.json                   # Monorepo root workspace orchestration
├── pnpm-workspace.yaml            # Multi-package definitions: packages/*, apps/*
├── tsconfig.base.json             # Root TypeScript compiler options & strict rules
├── .env.example                   # Environment configuration blueprint
├── test-server.js                 # Centralised test backend service on port 8000
├── scripts/
│   └── verify-api.js              # Automated end-to-end API communication verification
├── packages/
│   └── shared/                    # Core library (@epadash/shared)
│       ├── src/
│       │   ├── api/               # Centralized Axios client, ApiService, endpoints
│       │   ├── auth/              # TokenManager, useAuthStore, ProtectedRoute, AuthProvider
│       │   ├── components/        # Button, TextInput, SelectInput, FormField, ErrorBoundary, etc.
│       │   ├── hooks/             # useApi, useForm, usePagination, useDebounce
│       │   ├── layouts/           # AuthLayout (branded split-screen), DashboardLayout
│       │   ├── stores/            # Zustand stores: auth, notification, ui
│       │   ├── types/             # Shared TypeScript domain contracts
│       │   ├── utils/             # cn, formatCurrency, formatDate, secureStorage
│       │   └── validation/        # Zod schemas (login, register, menu, orders)
│       └── package.json
└── apps/
    ├── customer/                  # Consumer ordering application (Port 3001)
    ├── rider/                     # Delivery driver application (Port 3002)
    ├── merchant/                  # Restaurant management portal (Port 3003)
    └── admin/                     # Master administrative console (Port 3004)
```

---

## 2. Centralised API Service Layer

Consistent communication with backend services is established through the centralized API client in `@epadash/shared/src/api`:

### 2.1 Axios Client & Token Interceptors (`client.ts`)
- **Base URL & Environment**: Dynamic initialization from `VITE_API_BASE_URL` with fallback to `http://localhost:8000/api/v1`.
- **Automated Authorization**: Request interceptor automatically reads the stored JWT access token from `TokenManager` and attaches `Authorization: Bearer <token>`.
- **Request Tracing**: Injects `X-Request-Client: EpaDash-Frontend` header for backend audit telemetry.
- **Concurrent Refresh Queue**: When a `401 Unauthorized` is encountered, requests are queued while a single token refresh request (`POST /auth/refresh`) is executed. Once the new token arrives, all queued requests are automatically replayed without interrupting the user.
- **Automatic Session Invalidation**: If token rotation fails or refresh token is expired, all tokens are safely cleared via `TokenManager.clearTokens()` and listeners trigger global state reset and login redirection.

### 2.2 Standardized Error Normalization (`normalizeApiError`)
All network errors, HTTP status errors, and timeouts are mapped into a standardized `ApiError` interface:
```typescript
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>; // Field-specific validation errors for forms
}
```

### 2.3 Generic Typed `ApiService` (`service.ts`)
Encapsulates all REST verbs with typed responses wrapped in an `ApiResponse<T>` envelope:
```typescript
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  static async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  static async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  static async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
}
```

---

## 3. Authentication & Security Architecture

### 3.1 Token Handling (`TokenManager` & `secureStorage`)
- **Safe Storage**: Uses `secureStorage`, which wraps browser `localStorage` with fail-safe in-memory fallback for SSR or restricted sandboxes.
- **Clock Skew Buffer**: Automatically computes token expiration with a 30-second anticipatory buffer (`Date.now() >= expiryTime - 30000`).
- **Observer Pattern**: Emits `onAuthFailure` events to decouple network interceptors from React state lifecycle.

### 3.2 Role-Based Routing (`ProtectedRoute`)
Enforces strict privilege boundaries:
- Checks authentication status.
- Evaluates `role` or `allowedRoles` (`customer`, `rider`, `merchant`, `admin`).
- Unauthenticated users are redirected to `/login` with preservation of the `from` route in location state.
- Unauthorized users receive a styled 403 Access Denied interface with one-click account switching.

---

## 4. State Management Architecture

State is cleanly partitioned into domain and UI concerns using **Zustand** stores:

1. **`useAuthStore`** (Persisted): Stores user profile, active tokens, authentication status, and session hydration state.
2. **`useNotificationStore`**: Global toast notification pipeline supporting `success`, `error`, `warning`, and `info` with auto-dismiss timeouts and stacking.
3. **`useUIStore`**: Manages sidebar collapsed state, mobile drawer visibility, and responsive viewport detection.
4. **`useCartStore`** (Customer App): Handles cart additions, item quantities, pricing breakdown (subtotal, delivery fee, platform service fee), and vendor restriction checks.

---

## 5. Reusable Form Validation (`useForm` & Zod)

The form architecture decouples validation logic from component rendering:
- **Zod Schemas** (`@epadash/shared/validation`): Single source of truth for validation rules (`loginSchema`, `registerSchema`, `menuItemSchema`, `orderCheckoutSchema`).
- **Validation Helpers**: `validateWithZod` returns typed data on success, or a mapped `errors` dictionary keyed by field name (`{ email: "Enter a valid email", password: "..." }`).
- **`useForm` Hook**: Manages form values, touched states, error states, and async `onSubmit` execution states with automatic loading spinners.

---

## 6. Shared Layouts & Navigation Structures

### 6.1 `AuthLayout` (Branded Split-Screen)
- **Desktop**: 50/50 split layout. The left pane features a brand hero background in deep emerald/teal gradients, value propositions, and security assurances. The right pane contains the centered interactive form.
- **Mobile**: Collapses gracefully to a single-column layout with branded header.

### 6.2 `DashboardLayout` (Operational Shell)
- **Collapsible Sidebar**: Desktop sidebar toggles between full (256px) and icon-only (80px) modes with active route highlight.
- **Mobile Drawer**: Slide-out navigation drawer with gesture overlay backdrop.
- **Top Bar**: Global search, notification counter pill, and user profile dropdown with one-click sign out.

---

## 7. Application Environments & Ports

| Application | Role & Audience | Vite Dev Port | Production Build Command |
|---|---|---|---|
| **`@epadash/customer`** | Diners & consumers ordering meals/groceries | `3001` | `pnpm --filter @epadash/customer build` |
| **`@epadash/rider`** | Delivery drivers & bicycle couriers | `3002` | `pnpm --filter @epadash/rider build` |
| **`@epadash/merchant`** | Restaurant kitchen staff & managers | `3003` | `pnpm --filter @epadash/merchant build` |
| **`@epadash/admin`** | Platform directors & system operators | `3004` | `pnpm --filter @epadash/admin build` |
| **Test Backend API** | Centralized API communication endpoint | `8000` | `node test-server.js` |

---

## 8. Verified Test Backend Communication

The application communicates directly with a test backend endpoint running on port 8000. Verified via `node scripts/verify-api.js`:
- `GET /api/v1/health`: Responds with `{ status: "online", uptime: ..., version: "1.0.0-beta" }`.
- `POST /api/v1/test/echo`: Verifies request payload round-trip and `X-Request-Client` header.
- `GET /api/v1/test/protected`: Validates token authorization header and role extraction.
- `GET /api/v1/test/error`: Validates standardized 422 error normalization and field error mapping.

