# Frontend Architecture

هذا الملف يشرح كيف تبني الواجهة بشكل احترافي لكن بسيط.

---

## 1) المبادئ الأساسية

### افصل بين 4 طبقات

```text
UI Layer
Feature Hooks Layer
API Layer
Shared Infrastructure Layer
```

### المعنى العملي
- **UI Layer**: صفحات + components فقط
- **Feature Hooks**: hooks تستعمل TanStack Query / mutations
- **API Layer**: axios functions فقط
- **Shared Infrastructure**: auth, env, router, interceptors, helpers

---

## 2) المشروع المقترح

```text
src/
  app/
    api/
      http.ts
      interceptors.ts
      query-client.ts
    config/
      env.ts
    providers/
      AppProviders.tsx
    router/
      index.tsx
      guards.tsx
    store/
      auth-context.tsx
    layouts/
      PublicLayout.tsx
      CustomerLayout.tsx
      ManagerLayout.tsx
      AdminLayout.tsx

  modules/
    auth/
    catalog/
    cart/
    checkout/
    orders/
    payments/
    categories/
    manager-products/
    manager-images/
    inventory/
    admin/

  shared/
    components/
    ui/
    types/
    constants/
    utils/
    hooks/
```

---

## 3) إعداد البيئة

### env.ts
```ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7041',
};
```

### .env.development
```env
VITE_API_BASE_URL=https://localhost:7041
```

إذا أردت HTTP بدل HTTPS أثناء التطوير المحلي:
```env
VITE_API_BASE_URL=http://localhost:5034
```

> حسب `launchSettings.json` في المشروع الحالي، الـ backend يعمل محليًا على:
> - `https://localhost:7041`
> - `http://localhost:5034`

---

## 4) Axios Client موحد

### http.ts
```ts
import axios from 'axios';
import { env } from '../config/env';

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### interceptor لإرسال التوكن
```ts
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### interceptor للأخطاء
```ts
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 5) Auth Context بسيط وواضح

### الحالة المطلوبة
```ts
type AppRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

type CurrentUser = {
  userId: number;
  fullName: string;
  email: string;
  role: AppRole;
  token: string;
  expiresAtUtc: string;
};
```

### ماذا نخزن؟
- `access_token`
- `current_user`

### لا تخزن
- cart داخله
- products داخله
- orders داخله

هذه بيانات server-state ويجب أن تذهب إلى TanStack Query.

---

## 6) Routing Strategy

### الصفحات العامة
- `/login`
- `/products`
- `/products/:productId`

### صفحات customer
- `/me/cart`
- `/me/checkout`
- `/me/orders`
- `/me/orders/:orderId`
- `/me/orders/:orderId/payment`

### صفحات manager
- `/manager/products`
- `/manager/products/new`
- `/manager/products/:productId/edit`
- `/manager/categories`
- `/manager/products/:productId/images`
- `/manager/inventory`
- `/manager/inventory/movements`
- `/manager/orders`
- `/manager/orders/:orderId`

### صفحات admin
- `/admin/inventory/status`
- `/admin/inventory/low-stock`

---

## 7) Route Guards

### Guest guard
إذا المستخدم logged in لا ترجع تعرض login.

### Auth guard
إذا لا يوجد token → حوله login.

### Role guard
- Customer فقط لصفحات `/me/*`
- Manager أو Admin لصفحات `/manager/*`
- Admin لصفحات `/admin/*`

### مثال
```tsx
if (!user) return <Navigate to="/login" replace />;
if (!allowedRoles.includes(user.role)) return <Navigate to="/forbidden" replace />;
return <Outlet />;
```

---

## 8) TanStack Query Strategy

### Query keys
```ts
export const queryKeys = {
  products: (params?: unknown) => ['products', params] as const,
  product: (id: number) => ['product', id] as const,
  categories: ['categories'] as const,
  cart: ['me', 'cart'] as const,
  myOrders: (params?: unknown) => ['me', 'orders', params] as const,
  myOrder: (id: number) => ['me', 'orders', id] as const,
  payment: (orderId: number) => ['me', 'orders', orderId, 'payment'] as const,
  managerOrders: (params?: unknown) => ['manager', 'orders', params] as const,
  managerOrder: (id: number) => ['manager', 'orders', id] as const,
  inventoryMovements: (params?: unknown) => ['manager', 'inventory', 'movements', params] as const,
  inventoryStatus: (params?: unknown) => ['admin', 'inventory', 'status', params] as const,
  lowStock: (params?: unknown) => ['admin', 'inventory', 'low-stock', params] as const,
};
```

### بعد كل mutation
اعمل invalidation ذكي فقط للبيانات المتأثرة.

مثال:
- add to cart → invalidate `cart`
- checkout → invalidate `cart`, `myOrders`
- pay by card → invalidate `payment(orderId)`, `myOrder(orderId)`
- inventory update → invalidate `product(id)`, `inventoryMovements`, `inventoryStatus`, `lowStock`

---

## 9) Forms Standard

كل form يجب أن يحتوي:
- schema منفصل
- default values واضحة
- submit function داخل mutation hook
- error messages قريبة من الحقول

### مثال عملي
```ts
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
});
```

---

## 10) UI Rules

### اعمل shared components فقط لما يتكرر الشيء فعلًا
مطلوب shared components مثل:
- PageHeader
- AppTable
- PaginationBar
- EmptyState
- ErrorState
- ConfirmDialog
- StatusBadge
- PriceText
- LoadingBlock

### لا تعمل abstraction مبالغ فيه
إذا component لم يتكرر مرتين أو ثلاث مرات، اتركه داخل الموديول الخاص به.

---

## 11) Error Handling

الـ backend الحالي لا يبدو موحدًا جدًا في error contracts، لذلك frontend يجب أن يتعامل بهذا الأسلوب:

```ts
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      'Something went wrong'
    );
  }
  return 'Something went wrong';
}
```

لا تعتمد على شكل error واحد فقط.

---

## 12) أبسط layouts المطلوبة

### PublicLayout
- Header بسيط
- Login / brand

### CustomerLayout
- Navbar
- Products
- Cart badge
- Orders
- User menu

### ManagerLayout
- Sidebar
- Overview
- Products
- Categories
- Inventory
- Orders

### AdminLayout
- Sidebar
- Inventory Status
- Low Stock

---

## 13) مبدأ البناء

ابدأ من أصعب نقطة مشتركة:
1. auth
2. routing
3. api layer
4. shared table/form utilities

بعدها الموديولات تصبح أسرع بكثير.
