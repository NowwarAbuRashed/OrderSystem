# Frontend React Handoff for Order System

هذا الملف هو نقطة البداية لبناء **Frontend React كامل** لمشروع **Order System** الموجود في الـ backend الحالي.

الهدف هنا ليس عمل frontend معقّد، بل عمل واجهة نظيفة، مرتبة، قابلة للتوسع، ومرتبطة مع الـ APIs الموجودة فعلًا في المشروع.

---

## 1) القرار المعماري المختار

### التقنية المقترحة
- **React + TypeScript + Vite**
- **React Router** للتنقل والـ route guards
- **TanStack Query** لإدارة بيانات الـ API والكاش والتحميل والتحديث
- **Axios** لطبقة الاتصال مع الـ backend
- **React Hook Form + Zod** للفورمز والتحقق من الإدخال
- **Tailwind CSS** للـ UI بسرعة وبشكل احترافي
- **Context API** فقط لحالة المستخدم الحالي والتوكن بدل إدخال state management معقد من أول يوم

### لماذا هذا الاختيار؟
لأن المشروع الحالي:
- يعتمد على **REST APIs جاهزة**
- فيه **أدوار متعددة**: Customer / Manager / Admin
- يحتاج **ربط واضح** مع JWT token
- يحتاج **صفحات CRUD + dashboard + cart + checkout**
- لا يحتاج الآن SSR أو full-stack framework

هذا يجعل React SPA نظيفة مع Vite خيارًا عمليًا جدًا للمشروع الحالي.

---

## 2) ما الذي سنبنيه في الواجهة؟

### Public / Customer
- Login
- Product Catalog
- Product Details
- Cart
- Checkout
- My Orders
- Order Details
- Payment Page

### Manager
- Dashboard بسيطة
- Products Management
- Categories Management
- Product Images Management
- Inventory Movements
- Orders Management
- Status transitions: Ready → Out for delivery → Delivered

### Admin
- Inventory Status
- Low Stock View
- ويمكنه استعمال واجهات المدير أيضًا لأن بعض endpoints تسمح `MANAGER,ADMIN`

---

## 3) بنية المشروع المقترحة

```text
frontend/
  src/
    app/
      providers/
        AppProviders.tsx
      router/
        index.tsx
        guards.tsx
      layouts/
        PublicLayout.tsx
        CustomerLayout.tsx
        ManagerLayout.tsx
        AdminLayout.tsx
      store/
        auth-context.tsx
      config/
        env.ts
      api/
        http.ts
        auth-header.ts
        interceptors.ts
        query-client.ts

    modules/
      auth/
        api/
        components/
        pages/
        schemas/
        types/
        hooks/

      catalog/
        api/
        components/
        pages/
        types/
        hooks/

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
      hooks/
      utils/
      constants/
      types/

    main.tsx
    App.tsx
```

---

## 4) القاعدة الذهبية في هذا المشروع

**لا تجعل الـ components تتعامل مباشرة مع Axios.**

الترتيب الصحيح:

```text
page -> feature hook -> api function -> axios client
```

مثال:

```text
ProductsPage
  uses useProductsQuery()
    uses getProducts(params)
      uses http.get('/api/v1/products', { params })
```

هذا يجعل المشروع:
- أوضح
- أسهل للاختبار
- أسهل للصيانة
- أسهل للـ AI حتى يولد الملفات صح

---

## 5) خطوات التنفيذ العامة

### المرحلة 1 — Bootstrap
1. إنشاء React app بـ Vite + TypeScript
2. تجهيز Tailwind
3. تجهيز React Router
4. تجهيز TanStack Query
5. تجهيز Axios instance موحد
6. تجهيز Auth Context
7. تجهيز Toast / Error handling موحد

### المرحلة 2 — Authentication
1. صفحة login
2. حفظ التوكن
3. استخراج role من login response
4. route guards حسب role
5. logout
6. session restore عند refresh

### المرحلة 3 — Customer App
1. Product list
2. Product details
3. Cart
4. Checkout
5. Orders list
6. Order details
7. Payment flow

### المرحلة 4 — Manager App
1. Products CRUD
2. Categories CRUD
3. Product images CRUD
4. Inventory adjustments
5. Inventory movement log
6. Orders board
7. Status actions

### المرحلة 5 — Admin App
1. Inventory status page
2. Low stock page
3. Quick filters / pagination

### المرحلة 6 — Production polish
1. Loading skeletons
2. Empty states
3. Error boundaries
4. Better table UX
5. Form feedback
6. Token expiry handling
7. Responsive design

---

## 6) ملاحظات مهمة جدًا من فحص الـ backend الحالي

### route naming غير موحّد 100%
في المشروع الحالي هناك مسارات versioned مثل:
- `/api/v1/auth/login`
- `/api/v1/products`
- `/api/v1/me/cart`

لكن هناك أيضًا مسارات غير versioned ناتجة عن `[Route("api/[controller]")]` مثل:
- `/api/Categories`
- `/api/ManagerCategories`
- `/api/ProductImages`
- `/api/ManagerProductImages`

لذلك في frontend يجب عمل **api modules دقيقة جدًا** وعدم افتراض أن كل شيء تحت `/api/v1`.

### بعض الـ enums سترجع كأرقام غالبًا
لأن backend لا يضيف `JsonStringEnumConverter` في `Program.cs`، فبعض الـ DTOs التي تحتوي enums مباشرة سترجع numeric values.

بالتالي frontend يجب أن يجهز mapping واضح مثل:
- `PaymentMethod: 0 = CASH, 1 = CARD`
- `OrderStatus: 0 = PROCESSING, 1 = READY, 2 = OUT_FOR_DELIVERY, 3 = DELIVERED`
- `PaymentStatus: 0 = PENDING, 1 = PAID, 2 = FAILED`

### بعض الـ controllers تحتاج tightening على مستوى security في backend
من الكود الحالي:
- `ManagerProductsController`, `ManagerInventoryController`, `ManagerOrdersController`, `AdminInventoryController` فيها Authorize
- لكن `ManagerCategoriesController` و `ManagerProductImagesController` لا يظهر عليها `Authorize`

الـ frontend يجب أن يخفي هذه الصفحات حسب role، لكن الأفضل أيضًا تعديل backend لاحقًا حتى يكون production-ready بالكامل.

---

## 7) قواعد الشغل المطلوبة من أي AI يبني الواجهة

عند استخدام AI للبناء، اجعله يلتزم بهذه القواعد:

1. لا يخترع endpoints غير الموجودة.
2. لا يغيّر أسماء الحقول من نفسه.
3. لا يضع business logic داخل UI components.
4. لا يستخدم Redux إلا إذا طلبت ذلك صراحة.
5. لا يكرر axios logic داخل كل صفحة.
6. كل feature يجب أن يحتوي:
   - `api`
   - `types`
   - `hooks`
   - `pages/components`
7. أي form يجب أن يستخدم:
   - `react-hook-form`
   - `zod`
8. أي call يحتاج auth يجب أن يرسل:
   - `Authorization: Bearer <token>`

---

## 8) أفضل ترتيب عملي للبناء

إذا أردت البناء بسرعة وبدون ضياع:

1. Login + Auth Layouts
2. Products list + Product details
3. Cart
4. Checkout
5. Orders + Payment
6. Manager products
7. Categories + Images
8. Inventory + Orders board
9. Admin inventory pages

---

## 9) النتيجة النهائية المتوقعة

بعد تطبيق هذه الوثائق ستحصل على:
- React frontend واضح ومنظم
- ربط صحيح مع backend الحالي
- بنية قابلة للتوسع لاحقًا
- شغل clean enough للمناقشة والتسليم
- شغل modern standard بدون over-engineering

---

## 10) الملفات المكمّلة

اقرأ الملفات التالية بالترتيب:
1. `01-frontend-architecture.md`
2. `02-backend-api-map.md`
3. `03-screen-specs-and-user-flows.md`
4. `04-frontend-types-and-contracts.md`
5. `05-implementation-roadmap.md`
6. `06-ai-prompts-for-building.md`
