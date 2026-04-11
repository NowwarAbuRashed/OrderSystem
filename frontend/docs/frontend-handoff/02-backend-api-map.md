# Backend API Map (Extracted from Current Project)

هذا الملف مبني من فحص مباشر لكود الـ backend الحالي.

> مهم: استعمل هذه العقود كما هي، ولا تفترض أن كل endpoint موحد naming أو versioning.

---

## 1) Auth

### POST `/api/v1/auth/login`
**Access:** Public

### Request
```json
{
  "email": "customer@local.com",
  "password": "Customer123!"
}
```

### Success Response
```json
{
  "userId": 3,
  "fullName": "Test Customer",
  "email": "customer@local.com",
  "role": "CUSTOMER",
  "token": "<jwt>",
  "expiresAtUtc": "2026-04-11T12:00:00Z"
}
```

### Error
- 401 with `{ "message": "Invalid email or password" }`
- 401 with `{ "message": "This account is inactive" }`

### Development Seed Users
- `admin@local.com / Admin123!`
- `manager@local.com / Manager123!`
- `customer@local.com / Customer123!`

---

## 2) Public Product APIs

### GET `/api/v1/products`
**Access:** Public

### Query params
- `search?: string`
- `categoryId?: number`
- `page?: number` default 1
- `pageSize?: number` default 20

### Response shape
```json
{
  "items": [
    {
      "id": 1,
      "name": "Product A",
      "price": 10.5,
      "quantity": 50,
      "minQuantity": 5,
      "status": "ACTIVE",
      "categoryId": 2,
      "images": []
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1
}
```

### GET `/api/v1/products/{productId}`
**Access:** Public

### Response shape
```json
{
  "id": 1,
  "name": "Product A",
  "description": "...",
  "price": 10.5,
  "quantity": 50,
  "minQuantity": 5,
  "status": "ACTIVE",
  "categoryId": 2,
  "images": [
    {
      "id": 10,
      "imageUrl": "https://..."
    }
  ]
}
```

### GET `/api/v1/products/{productId}/images`
**Access:** Public

Returns only images list.

---

## 3) Public Category APIs

### GET `/api/Categories`
**Access:** Public

### Response
```json
[
  {
    "id": 1,
    "name": "Beverages"
  }
]
```

> ملاحظة: هذا endpoint غير versioned.

---

## 4) Cart APIs

Base route: `/api/v1/me/cart`
**Access:** CUSTOMER

### GET `/api/v1/me/cart`
يرجع السلة الحالية، وإذا لم تكن موجودة backend ينشئ active cart تلقائيًا.

### Response
```json
{
  "id": 11,
  "status": "ACTIVE",
  "items": [
    {
      "id": 99,
      "productId": 1,
      "productName": "Product A",
      "unitPrice": 12.5,
      "quantity": 2,
      "lineTotal": 25.0
    }
  ],
  "subtotal": 25.0
}
```

### POST `/api/v1/me/cart/items`
```json
{
  "productId": 1,
  "quantity": 2
}
```

### PUT `/api/v1/me/cart/items/{itemId}`
```json
{
  "quantity": 3
}
```

### DELETE `/api/v1/me/cart/items/{itemId}`
No body

### DELETE `/api/v1/me/cart/items`
No body

### Common cart errors
- `Quantity must be greater than zero`
- `Product not found`
- `Cart item not found`
- `Cart item does not belong to the active cart`

---

## 5) Checkout / Orders APIs for Customer

Base route: `/api/v1/me/orders`
**Access:** CUSTOMER

### Important enum mapping
Because `PaymentMethod` and `OrderStatus` are C# enums and no JSON enum converter is configured, use numeric values safely in request/response handling:

- `PaymentMethod`
  - `0 = CASH`
  - `1 = CARD`

- `OrderStatus`
  - `0 = PROCESSING`
  - `1 = READY`
  - `2 = OUT_FOR_DELIVERY`
  - `3 = DELIVERED`

- `PaymentStatus`
  - `0 = PENDING`
  - `1 = PAID`
  - `2 = FAILED`

### POST `/api/v1/me/orders`
Checkout

### Request
```json
{
  "notes": "Leave at door",
  "paymentMethod": 1
}
```

### Response
```json
{
  "orderId": 100,
  "orderStatus": 0,
  "paymentId": 200,
  "paymentStatus": 0,
  "totalAmount": 48.75,
  "message": "Checkout completed successfully"
}
```

### GET `/api/v1/me/orders?page=1&pageSize=10&status=0`

### Response
```json
{
  "items": [
    {
      "orderId": 100,
      "status": 0,
      "paymentMethod": 1,
      "totalAmount": 48.75,
      "createdAt": "2026-04-11T10:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1
}
```

### GET `/api/v1/me/orders/{orderId}`

### Response
```json
{
  "orderId": 100,
  "customerId": 3,
  "status": 0,
  "paymentMethod": 1,
  "totalAmount": 48.75,
  "createdAt": "2026-04-11T10:00:00Z",
  "readyAt": null,
  "outForDeliveryAt": null,
  "deliveredAt": null,
  "notes": "Leave at door",
  "items": [
    {
      "orderItemId": 1,
      "productId": 1,
      "quantity": 2,
      "unitPrice": 24.375,
      "lineTotal": 48.75
    }
  ]
}
```

### Common checkout/order errors
- `Active cart not found`
- `Cart is empty`
- `Product '<name>' is not active`
- `Insufficient stock for product '<name>'`
- `Order not found`

---

## 6) Payment APIs

Base route: `/api/v1/me/orders`
**Access:** CUSTOMER

### GET `/api/v1/me/orders/{orderId}/payment`

### Response
```json
{
  "paymentId": 200,
  "orderId": 100,
  "paymentMethod": 1,
  "status": 0,
  "amount": 48.75,
  "transactionRef": null,
  "paidAt": null,
  "createdAt": "2026-04-11T10:00:00Z"
}
```

### POST `/api/v1/me/orders/{orderId}/pay/card`

### Request
```json
{
  "cardHolderName": "Test User",
  "cardNumber": "4111111111111111",
  "expiryMonth": 12,
  "expiryYear": 2027,
  "cvv": "123"
}
```

### Response
```json
{
  "paymentId": 200,
  "orderId": 100,
  "paymentMethod": 1,
  "status": 1,
  "amount": 48.75,
  "transactionRef": "CARD-...",
  "paidAt": "2026-04-11T10:10:00Z",
  "createdAt": "2026-04-11T10:00:00Z"
}
```

### Common payment errors
- `Order not found`
- `Payment not found`
- `This order is not configured for card payment`
- `Payment is already completed`
- `Invalid card details`

---

## 7) Manager Product APIs

Base route: `/api/v1/manager/products`
**Access:** MANAGER, ADMIN

### POST `/api/v1/manager/products`
```json
{
  "name": "Product A",
  "description": "Description",
  "price": 20,
  "quantity": 100,
  "minQuantity": 10,
  "categoryId": 1
}
```

### Response
```json
{
  "id": 15
}
```

### PATCH `/api/v1/manager/products/{productId}`
```json
{
  "name": "Updated Product",
  "description": "Updated Description",
  "price": 22,
  "minQuantity": 8,
  "categoryId": 2
}
```

### Response
- `204 No Content`

### Common validation errors
- `Product name is required.`
- `Product description is required.`
- `Price cannot be negative.`
- `Quantity cannot be negative.`
- `MinQuantity cannot be negative.`
- `CategoryId must be greater than zero.`
- `Product with id 'x' was not found.`

---

## 8) Manager Category APIs

Base route: `/api/ManagerCategories`
**Current code note:** لا يظهر عليه `[Authorize]` في controller الحالي.

### POST `/api/ManagerCategories`
```json
{
  "name": "Snacks"
}
```

### PUT `/api/ManagerCategories/{categoryId}`
```json
{
  "name": "Updated Snacks"
}
```

### DELETE `/api/ManagerCategories/{categoryId}`

### Success responses
```json
{ "id": 9, "message": "Category created successfully" }
```
```json
{ "message": "Category updated successfully" }
```
```json
{ "message": "Category deleted successfully" }
```
```

### Not found shape
```json
{ "Message": "Category not found" }
```

---

## 9) Product Images APIs

### Public images endpoint
- `GET /api/ProductImages?productId=1`

### Manager images endpoints
Base route: `/api/ManagerProductImages`
**Current code note:** لا يظهر عليه `[Authorize]` في controller الحالي.

### GET `/api/ManagerProductImages?productId=1`

### POST `/api/ManagerProductImages?productId=1`
```json
{
  "imageUrl": "https://...",
  "altText": "Front view",
  "sortOrder": 1,
  "isPrimary": true
}
```

### PUT `/api/ManagerProductImages/{imageId}?productId=1`
```json
{
  "imageUrl": "https://...",
  "altText": "Updated alt",
  "sortOrder": 2,
  "isPrimary": false
}
```

### DELETE `/api/ManagerProductImages/{imageId}?productId=1`

### Important note from service code
`UpdateImageAsync` في service الحالي يبدو فيه bug محتمل لأنه يعمل update على object جديد بدل الصورة المحمّلة من قاعدة البيانات. لذلك إذا واجهت endpoint الـ update مشكلة، فالمشكلة على الأرجح من backend وليست من frontend.

---

## 10) Manager Inventory APIs

Base route: `/api/v1/manager`
**Access:** MANAGER, ADMIN

### PATCH `/api/v1/manager/products/{productId}/inventory`
```json
{
  "quantityDelta": 5,
  "minQuantity": 10
}
```

### Response
```json
{
  "productId": 1,
  "newQuantity": 45,
  "newMinQuantity": 10,
  "movementId": 300,
  "movementReason": "MANUAL_ADJUSTMENT"
}
```

### GET `/api/v1/manager/inventory/movements?productId=1&page=1&pageSize=20&from=...&to=...`

### Response
```json
{
  "items": [
    {
      "id": 300,
      "productId": 1,
      "productName": "Product A",
      "changeQty": 5,
      "reason": "MANUAL_ADJUSTMENT",
      "refOrderId": null,
      "performedBy": 2,
      "createdAt": "2026-04-11T10:30:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1
}
```

### Common errors
- `Product not found`
- `Inventory cannot be negative`
- `MinQuantity cannot be negative`

---

## 11) Manager Orders APIs

Base route: `/api/v1/manager/orders`
**Access:** MANAGER, ADMIN

### GET `/api/v1/manager/orders?page=1&pageSize=10&status=0`

### GET `/api/v1/manager/orders/{orderId}`

### POST `/api/v1/manager/orders/{orderId}/ready`

### POST `/api/v1/manager/orders/{orderId}/out-for-delivery`

### POST `/api/v1/manager/orders/{orderId}/delivered`

### Status change response
```json
{
  "orderId": 100,
  "status": 1,
  "message": "Order marked as ready successfully"
}
```

### Delivered response
```json
{
  "orderId": 100,
  "status": 3,
  "deliveredAt": "2026-04-11T11:00:00Z",
  "message": "Order marked as delivered successfully"
}
```

### Common workflow errors
- `Only processing orders can be marked as ready`
- `Only ready orders can be marked as out for delivery`
- `Only out for delivery orders can be marked as delivered`

---

## 12) Admin Inventory APIs

Base route: `/api/v1/admin/inventory`
**Access:** ADMIN

### GET `/api/v1/admin/inventory/status?page=1&pageSize=20`

### Response
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Product A",
      "quantity": 45,
      "minQuantity": 10,
      "stockStatus": "NORMAL"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1
}
```

### GET `/api/v1/admin/inventory/low-stock?page=1&pageSize=20`

### Response
```json
{
  "items": [
    {
      "productId": 2,
      "name": "Product B",
      "quantity": 3,
      "minQuantity": 10,
      "stockStatus": "LOW"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1
}
```

---

## 13) Recommended frontend wrapper types

كل paged response استعمل له wrapper موحد:

```ts
export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};
```

---

## 14) Recommended frontend caution list

1. لا تعتمد على enum النصي في كل مكان.
2. لا تعتمد على شكل موحد للـ error response.
3. احترم الـ role لكل route حتى لو backend فيه gap في بعض controllers.
4. عند checkout افترض أن stock يمكن أن يفشل لحظة التنفيذ.
5. عند payment page افحص payment method أولًا.
6. عند order actions افحص current status قبل إظهار الزر.
