# Screen Specs and User Flows

هذا الملف يحدد ماذا ستبني شاشة بشاشة.

---

## 1) Login Page

### الهدف
تسجيل الدخول وحفظ session وتوجيه المستخدم حسب role.

### الحقول
- Email
- Password

### الأزرار
- Login

### السلوك
- عند success:
  - خزّن token
  - خزّن user
  - إذا role = CUSTOMER → `/products`
  - إذا role = MANAGER → `/manager/orders`
  - إذا role = ADMIN → `/admin/inventory/status`

### حالات الواجهة
- loading
- invalid credentials
- inactive account

---

## 2) Products List Page

### الهدف
عرض المنتجات للعميل.

### العناصر
- Search input
- Category filter
- Product cards/grid
- Pagination
- Add to cart button

### كل card يعرض
- Primary image
- Product name
- Price
- Stock hint
- View details
- Add to cart

### حالات خاصة
- no products
- loading
- API error

---

## 3) Product Details Page

### الهدف
عرض تفاصيل منتج واحد.

### العناصر
- Image gallery
- Name
- Description
- Price
- Quantity available
- Add to cart

### ملاحظات
- إذا quantity = 0 أو status = inactive → عطّل add to cart
- اعرض رسالة stock واضحة

---

## 4) Cart Page

### الهدف
إدارة السلة.

### العناصر
- Items table/list
- Quantity stepper
- Remove item
- Clear cart
- Subtotal
- Continue to checkout

### السلوك
- quantity update مباشرة
- remove مباشر
- clear with confirm dialog

### حالات خاصة
- empty cart state

---

## 5) Checkout Page

### الهدف
إنشاء order من cart.

### الحقول
- Notes
- Payment method selector
  - CASH
  - CARD

### الأزرار
- Confirm checkout

### السلوك
- بعد success:
  - إذا payment method = CARD → حوله payment page
  - إذا CASH → حوله order details أو orders list

---

## 6) Orders List Page (Customer)

### الهدف
عرض طلبات المستخدم.

### العناصر
- Status filter
- Orders table/cards
- Pagination

### كل عنصر يعرض
- Order ID
- Status badge
- Payment method
- Total
- Created date
- View details

---

## 7) Order Details Page (Customer)

### الهدف
عرض تفاصيل الطلب.

### العناصر
- Order header
- Current status timeline
- Payment info summary
- Notes
- Items table
- Total amount
- إذا payment method = CARD و payment status != PAID → زر Go to payment

### timeline
- PROCESSING
- READY
- OUT_FOR_DELIVERY
- DELIVERED

---

## 8) Payment Page

### الهدف
تنفيذ card payment لطلب واحد.

### أول خطوة
نفّذ:
- get payment by order id

### إذا payment status = PAID
- اعرض success state
- لا تعرض form

### إذا payment method != CARD
- اعرض info state
- لا تعرض form

### الحقول
- Card holder name
- Card number
- Expiry month
- Expiry year
- CVV

### بعد success
- success toast
- refresh payment
- refresh order
- redirect to order details

---

## 9) Manager Orders Page

### الهدف
لوحة لإدارة الطلبات.

### العناصر
- Status filter tabs/select
- Orders table
- View details action
- Quick action buttons based on status

### rules
- if `PROCESSING` → show `Mark Ready`
- if `READY` → show `Out for delivery`
- if `OUT_FOR_DELIVERY` → show `Delivered`
- if `DELIVERED` → no action

---

## 10) Manager Order Details Page

### العناصر
- order summary
- customer id
- payment method
- items
- timestamps
- contextual action buttons

---

## 11) Manager Products Page

### الهدف
إدارة المنتجات.

### العناصر
- Products table
- Search
- Category filter
- Create product button
- Edit action
- Manage images action
- Adjust inventory action

### الأعمدة
- Name
- Price
- Quantity
- Min quantity
- Status
- CategoryId

---

## 12) Create/Edit Product Page

### الحقول
- Name
- Description
- Price
- Quantity (create only)
- Min quantity
- CategoryId

### ملاحظة
في update endpoint لا يوجد quantity update من نفس endpoint. تعديل الكمية يتم من inventory endpoint.

---

## 13) Manager Categories Page

### العناصر
- categories list
- create category form/modal
- edit category
- delete category

### الأفضل
اعمل CRUD بسيط جدًا في صفحة واحدة.

---

## 14) Product Images Management Page

### الهدف
إدارة صور منتج محدد.

### العناصر
- images list
- primary badge
- add image form
- update image form/modal
- delete image

### الحقول
- imageUrl
- altText
- sortOrder
- isPrimary

---

## 15) Inventory Movements Page

### الهدف
عرض تاريخ الحركات.

### الفلاتر
- productId
- from
- to
- page
- pageSize

### الأعمدة
- movement id
- product name
- change qty
- reason
- ref order id
- performed by
- created at

---

## 16) Adjust Inventory Dialog

### يستخدم endpoint:
`PATCH /api/v1/manager/products/{productId}/inventory`

### الحقول
- quantityDelta
- minQuantity

### السلوك
- يمكن تعديل واحد فقط أو الاثنين معًا
- quantityDelta ممكن يكون موجب أو سالب

---

## 17) Admin Inventory Status Page

### العناصر
- table
- pagination
- stock badge
- optional quick search client-side

### الأعمدة
- product id
- name
- quantity
- min quantity
- stock status

---

## 18) Admin Low Stock Page

### العناصر
- نفس جدول inventory لكن مخصص للعناصر low/out-of-stock

### المفيد
أضف badge color واضح:
- LOW
- OUT_OF_STOCK
- NORMAL

---

## 19) Reusable UX patterns

### Status badges
#### Order
- PROCESSING
- READY
- OUT_FOR_DELIVERY
- DELIVERED

### Payment
- PENDING
- PAID
- FAILED

### Stock
- NORMAL
- LOW
- OUT_OF_STOCK

### Common states
- loading skeleton
- empty state
- retry state
- toast success/error

---

## 20) Responsive strategy

### Mobile first enough, but not overdone
- customer pages must be mobile-friendly
- manager/admin tables can become horizontal scroll on smaller screens
- avoid overbuilding complex mobile admin UI
