# Implementation Roadmap

هذا هو الترتيب العملي الأفضل لبناء الواجهة بدون تخبط.

---

## Phase 0 — Preparation

### المطلوب
- افتح مشروع frontend جديد داخل مجلد `frontend`
- اربط الـ repo نفسه إذا أردت العمل monorepo style
- تأكد من تشغيل backend محليًا
- اختبر login من Swagger أولًا

### Definition of done
- frontend starts successfully
- backend reachable from browser/app
- no CORS issue blocking the first request

---

## Phase 1 — Project Bootstrap

### نفّذ
1. إنشاء المشروع
2. تثبيت المكتبات
3. إعداد Tailwind
4. إعداد router
5. إعداد query client
6. إعداد axios instance
7. إعداد auth context
8. إعداد toast system

### المطلوب في نهاية هذه المرحلة
- صفحة login تعمل شكليًا
- env works
- base layout works

---

## Phase 2 — Authentication & Guards

### نفّذ
1. login API integration
2. حفظ token + user
3. restore session عند refresh
4. logout
5. guest/auth/role guards
6. redirects حسب role

### Definition of done
- customer يدخل ويروح products
- manager يدخل ويروح manager orders
- admin يدخل ويروح admin inventory
- route guard يمنع الوصول غير المصرح

---

## Phase 3 — Public + Customer Shopping Flow

### نفّذ
1. categories query
2. products list query
3. product details query
4. add to cart mutation
5. cart page
6. update/remove/clear cart mutations

### Definition of done
- user can browse
- user can filter
- user can add/remove/update cart

---

## Phase 4 — Checkout + Orders + Payment

### نفّذ
1. checkout form
2. my orders page
3. order details page
4. payment details page
5. pay by card form
6. invalidation after payment

### Definition of done
- customer can create order
- customer can view order history
- customer can pay card order

---

## Phase 5 — Manager Core

### نفّذ
1. manager orders list
2. manager order details
3. action buttons حسب status
4. optimistic or normal mutations for status changes

### Definition of done
- manager can move order across lifecycle

---

## Phase 6 — Products, Categories, Images

### نفّذ
1. products table
2. create product page
3. edit product page
4. categories CRUD page
5. product images management page

### Definition of done
- manager can create/update products
- manager can manage categories
- manager can manage images

---

## Phase 7 — Inventory + Admin

### نفّذ
1. adjust inventory modal
2. inventory movements page
3. admin inventory status page
4. admin low-stock page

### Definition of done
- manager/admin can monitor and adjust stock
- admin sees inventory health pages

---

## Phase 8 — Quality Polish

### نفّذ
1. skeleton loading
2. empty states
3. safe error handling
4. confirm dialogs
5. button disabling during mutation
6. reusable pagination
7. responsive fixes
8. status badges

### Definition of done
- app feels complete
- no raw crashes on common API errors

---

## Suggested package install

```bash
npm create vite@latest . -- --template react-ts
npm install react-router-dom axios @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install -D tailwindcss @tailwindcss/vite typescript eslint prettier
```

> إذا أردت إضافة icons:
```bash
npm install lucide-react
```

---

## Suggested first file order

1. `src/app/config/env.ts`
2. `src/app/api/http.ts`
3. `src/app/api/query-client.ts`
4. `src/app/store/auth-context.tsx`
5. `src/app/router/guards.tsx`
6. `src/modules/auth/api/auth.api.ts`
7. `src/modules/auth/pages/LoginPage.tsx`
8. `src/app/router/index.tsx`

---

## Daily practical order if you want speed

### Day 1
- bootstrap
- login
- auth guard
- products list

### Day 2
- product details
- cart
- checkout

### Day 3
- orders
- payment

### Day 4
- manager orders
- manager status actions

### Day 5
- products CRUD
- categories CRUD

### Day 6
- images
- inventory
- admin pages

### Day 7
- polish
- QA
- bug fixing
- prepare demo

---

## QA Checklist

### Auth
- login success
- login invalid password
- expired token
- logout

### Catalog
- search
- filter by category
- empty list
- product details not found

### Cart
- add item
- update quantity
- delete item
- clear cart
- empty cart

### Checkout
- cash order
- card order
- insufficient stock case

### Orders
- list filtering
- details rendering
- payment state

### Manager
- status transitions valid only
- product create
- product edit
- category CRUD
- images CRUD
- inventory adjustment

### Admin
- inventory status pagination
- low stock page

---

## Rule for every module before moving on

قبل أن تعتبر أي موديول finished:
- API integrated
- loading state موجود
- error state موجود
- empty state موجود إذا مناسب
- success feedback موجود
- form validation موجود إذا فيه form
