# AI Prompts for Building the Frontend

هذا الملف مهم جدًا إذا كنت ستبني الواجهة بمساعدة AI داخل Cursor / Windsurf / Copilot Chat / ChatGPT.

الفكرة هنا: لا تعطي AI طلبًا عامًا مثل “ابنيلي frontend كامل”، بل أعطه prompts صغيرة ودقيقة مرتبطة بعقود الـ backend الحالية.

---

## Prompt 1 — Bootstrap the app

```text
You are building a production-style but simple React frontend for an existing ASP.NET Core backend.

Tech stack:
- React + TypeScript + Vite
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- Tailwind CSS

Constraints:
- Do not invent endpoints.
- Do not use Redux.
- Keep architecture simple and scalable.
- Use feature-based folders.
- Separate UI, hooks, and API functions.

Create the initial project structure with:
- app/config/env.ts
- app/api/http.ts
- app/api/query-client.ts
- app/store/auth-context.tsx
- app/router/index.tsx
- app/router/guards.tsx
- shared basic layout files

Output:
- folder structure
- package.json dependencies
- code for the files
- no unnecessary explanation
```

---

## Prompt 2 — Build auth module

```text
Build the auth module for my React app.

Backend contract:
POST /api/v1/auth/login
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "userId": number,
  "fullName": "string",
  "email": "string",
  "role": "CUSTOMER" | "MANAGER" | "ADMIN",
  "token": "string",
  "expiresAtUtc": "string"
}

Requirements:
- create types
- create zod schema
- create auth api function
- create useLogin mutation hook
- create LoginPage.tsx
- save token and current user to localStorage
- create redirect by role after login
- use React Hook Form + Zod
- use Tailwind
- do not invent backend fields

Output only the needed files.
```

---

## Prompt 3 — Build product catalog

```text
Build the product catalog module in React.

Backend APIs:
GET /api/v1/products
Query params:
- search?: string
- categoryId?: number
- page?: number
- pageSize?: number

GET /api/v1/products/{productId}
GET /api/Categories

Response types:
PagedResult<ProductListItem>
Category[]
ProductDetails

Requirements:
- products list page
- product details page
- category filter
- search input
- pagination
- loading, empty, and error states
- typed api functions
- TanStack Query hooks
- Tailwind UI
- keep files modular

Do not invent fields that do not exist in the API.
Output only code files.
```

---

## Prompt 4 — Build cart module

```text
Build the cart module.

Backend APIs:
GET /api/v1/me/cart
POST /api/v1/me/cart/items
PUT /api/v1/me/cart/items/{itemId}
DELETE /api/v1/me/cart/items/{itemId}
DELETE /api/v1/me/cart/items

Contracts:
Add item request:
{
  "productId": number,
  "quantity": number
}

Update item request:
{
  "quantity": number
}

Requirements:
- create types
- create api functions
- create query + mutations
- create CartPage
- show subtotal
- allow quantity change
- allow delete item
- allow clear cart with confirm dialog
- invalidate query after mutations
- handle API message fallback safely

Output only the changed/new files.
```

---

## Prompt 5 — Build checkout and orders

```text
Build checkout and orders modules.

Backend APIs:
POST /api/v1/me/orders
GET /api/v1/me/orders
GET /api/v1/me/orders/{orderId}

Important enum mapping:
PaymentMethod: 0=CASH, 1=CARD
OrderStatus: 0=PROCESSING, 1=READY, 2=OUT_FOR_DELIVERY, 3=DELIVERED
PaymentStatus: 0=PENDING, 1=PAID, 2=FAILED

Checkout request:
{
  "notes": "string | undefined",
  "paymentMethod": 0 | 1
}

Requirements:
- create checkout form with payment method select
- create my orders list page
- create order details page
- create enum label helpers and status badges
- redirect to payment page if payment method is CARD
- use typed API layer and query hooks
- keep UI simple and professional

Output only files needed for this module.
```

---

## Prompt 6 — Build payment module

```text
Build the payment module.

Backend APIs:
GET /api/v1/me/orders/{orderId}/payment
POST /api/v1/me/orders/{orderId}/pay/card

Pay by card request:
{
  "cardHolderName": "string",
  "cardNumber": "string",
  "expiryMonth": number,
  "expiryYear": number,
  "cvv": "string"
}

Requirements:
- fetch payment details first
- if payment already PAID, show success state not form
- if payment method is not CARD, show informational state
- create payment form with validation
- after success invalidate payment and order details queries
- redirect back to order details

Output only the new/updated files.
```

---

## Prompt 7 — Build manager orders board

```text
Build manager order management pages.

Backend APIs:
GET /api/v1/manager/orders
GET /api/v1/manager/orders/{orderId}
POST /api/v1/manager/orders/{orderId}/ready
POST /api/v1/manager/orders/{orderId}/out-for-delivery
POST /api/v1/manager/orders/{orderId}/delivered

Requirements:
- orders list page with filter by status
- order details page
- action buttons shown conditionally by current status
- invalidate list/details after mutation
- table-based UI
- status badges
- role guard for MANAGER and ADMIN

Output only code.
```

---

## Prompt 8 — Build manager products/categories/images

```text
Build manager modules for products, categories, and product images.

Backend APIs:
POST /api/v1/manager/products
PATCH /api/v1/manager/products/{productId}
POST /api/ManagerCategories
PUT /api/ManagerCategories/{categoryId}
DELETE /api/ManagerCategories/{categoryId}
GET /api/ManagerProductImages?productId={id}
POST /api/ManagerProductImages?productId={id}
PUT /api/ManagerProductImages/{imageId}?productId={id}
DELETE /api/ManagerProductImages/{imageId}?productId={id}

Requirements:
- products management table
- create/edit product pages
- categories CRUD single page
- product images management page for one product
- forms with Zod + React Hook Form
- do not invent backend fields
- note that quantity editing is not part of product PATCH endpoint

Output only files.
```

---

## Prompt 9 — Build inventory/admin pages

```text
Build inventory and admin modules.

Backend APIs:
PATCH /api/v1/manager/products/{productId}/inventory
GET /api/v1/manager/inventory/movements
GET /api/v1/admin/inventory/status
GET /api/v1/admin/inventory/low-stock

Requirements:
- adjust inventory dialog/form
- inventory movements page with filters
- admin inventory status page
- admin low stock page
- paginated table UI
- stock status badges
- role guards

Output code only.
```

---

## Prompt 10 — Refactor quality pass

```text
Refactor my React frontend without changing behavior.

Goals:
- remove duplicated API code
- make TanStack Query keys consistent
- extract shared StatusBadge, EmptyState, ErrorState, LoadingBlock, PaginationBar
- keep architecture simple
- keep feature boundaries clear
- do not change backend contracts
- do not add Redux
- do not rewrite everything from scratch

Output only changed files.
```

---

## Rules you should always prepend to the AI

انسخ هذا السطر مع أي prompt تقريبًا:

```text
Important rules:
- Use the exact backend contracts I provide.
- Do not invent routes or fields.
- Keep architecture feature-based and simple.
- Use React + TypeScript.
- Use TanStack Query for server state.
- Use React Hook Form + Zod for forms.
- Put API logic in api files, not in components.
- Output only the files you create or modify.
```

---

## أفضل طريقة عملية مع AI

لا تطلب منه مرة واحدة:
- “ابني كل الفرونت” ❌

بل اطلب منه بهذا الترتيب:
1. bootstrap
2. auth
3. products
4. cart
5. checkout
6. orders
7. payment
8. manager orders
9. manager products/categories/images
10. inventory/admin
11. refactor

هكذا تكون النتائج أدق وأقل أخطاء.
