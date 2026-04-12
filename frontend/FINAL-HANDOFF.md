# Order Management System - Final Handoff

This document guarantees the overall integration states of the React Frontend and the ASP.NET Core Backend APIs.

## 1. Frontend Run Steps
To run the frontend application:
1. Ensure you have Node.js installed.
2. Open a terminal in the `frontend` folder.
3. Run `npm install` (if dependencies are not yet installed).
4. Run `npm run dev` to start the Vite development server.
The frontend should be accessible at `http://localhost:5174/` (or `5173`).

## 2. Backend Base URL
The frontend is currently configured via `.env` (and fallback `env.ts`) to resolve backend endpoints via local HTTP:
- **Base API URL:** `http://localhost:5034`
- The backend configuration natively includes a relaxed CORS policy handling cross-origin traffic from development ports `5173` and `5174` seamlessly.

## 3. Seeded Test Accounts
The database automatically seeds development users covering the core application tiers:

| Role       | Email                | Password      |
|------------|----------------------|---------------|
| **Admin**  | admin@local.com      | Admin123!     |
| **Manager**| manager@local.com    | Manager123!   |
| **Customer**| customer@local.com  | Customer123!  |
| **Customer**| customer2@local.com | Customer456!  |
| **Customer**| customer3@local.com | Customer789!  |

## 4. Known Backend Inconsistencies (Fixed/Mapped)
- **Inventory Adjustment Pattern:** The frontend had initially speculated two granular `POST` methods (`/add` & `/remove`) inside a generic `/manager/inventory` controller. The backend code was discovered using a generic `PATCH` path located under `/api/v1/manager/products/{productId}/inventory`. The frontend `inventory.api` has been fully refactored to conform to the single uniform backend PATCH format seamlessly.
- **Categories Domain Separation:** Manager category operations write through a dynamic `[Route]` via `ManagerCategoriesController` (`/api/ManagerCategories`). Reading items, conversely, leverages standard Customer endpoint routes mapping generically to `/api/Categories`. Both frontend mapping strategies resolve correctly.

## 5. Remaining Manual QA Scenarios
While schema mismatches, guards, endpoints, payload formats, and login E2E states have been fully verified automatically via DOM capture scripts, some manual visual reviews persist: 
- **Completing E2E Cart Checkout:** Verify adding inventory payload bounds locally across to the mock payment APIs, tracking state persistence reliably between carts and orders tables.
- **Image Layout Resolution:** Visual verification in browser confirming that product thumbnail URLs retrieved across `ProductsController` load precisely into the React images array configurations and fallback gracefully.
- **Auth Hard-refresh States:** Emulating token lifespan completions to guarantee the router `http.interceptors.response` handler elegantly evicts storage states triggering smooth auto-logout redirects back to generic `GuestGuards`.
