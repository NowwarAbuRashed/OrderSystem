import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { ManagerLayout } from '../../layouts/ManagerLayout';
import { AdminLayout } from '../../layouts/AdminLayout';
import { GuestGuard, AuthGuard, RoleGuard } from './guards';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/customer/pages/RegisterPage';
import { ProductsListPage } from '../../modules/catalog/pages/ProductsListPage';
import { ProductDetailsPage } from '../../modules/catalog/pages/ProductDetailsPage';
import { CartPage } from '../../modules/cart/pages/CartPage';
import { CheckoutPage } from '../../modules/customer/pages/CheckoutPage';
import { PaymentPage } from '../../modules/customer/pages/PaymentPage';
import { CustomerOrdersListPage } from '../../modules/customer/pages/CustomerOrdersListPage';
import { CustomerOrderDetailsPage } from '../../modules/customer/pages/CustomerOrderDetailsPage';
import { ManagerOrdersPage } from '../../modules/manager/pages/OrdersPage';
import { ManagerOrderDetailsPage } from '../../modules/manager/pages/OrderDetailsPage';
import { ManagerCategoriesPage } from '../../modules/manager/pages/CategoriesPage';
import { ManagerProductsPage } from '../../modules/manager/pages/ProductsPage';
import { ManagerProductEditPage } from '../../modules/manager/pages/ProductEditPage';
import { ManagerInventoryListPage } from '../../modules/manager/pages/InventoryListPage';
import { ManagerInventoryManagePage } from '../../modules/manager/pages/InventoryManagePage';
import { AdminInventoryStatusPage } from '../../modules/admin/pages/InventoryStatusPage';
import { AdminLowStockPage } from '../../modules/admin/pages/LowStockPage';
import { SettingsPage } from '../../modules/auth/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/', element: <Navigate to="/login" replace /> }
        ]
      }
    ]
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['CUSTOMER']} />,
        children: [
          {
            element: <CustomerLayout />,
            children: [
              { path: '/products', element: <ProductsListPage /> },
              { path: '/products/:productId', element: <ProductDetailsPage /> },
              { path: '/me/cart', element: <CartPage /> },
              { path: '/me/checkout', element: <CheckoutPage /> },
              { path: '/me/orders', element: <CustomerOrdersListPage /> },
              { path: '/me/orders/:orderId', element: <CustomerOrderDetailsPage /> },
              { path: '/me/orders/:orderId/payment', element: <PaymentPage /> },
              { path: '/me/settings', element: <SettingsPage /> },
            ]
          }
        ]
      },
      {
        path: '/manager',
        element: <RoleGuard allowedRoles={['MANAGER', 'ADMIN']} />,
        children: [
          {
            element: <ManagerLayout />,
            children: [
              { path: 'orders', element: <ManagerOrdersPage /> },
              { path: 'orders/:orderId', element: <ManagerOrderDetailsPage /> },
              { path: 'products', element: <ManagerProductsPage /> },
              { path: 'products/:productId', element: <ManagerProductEditPage /> },
              { path: 'categories', element: <ManagerCategoriesPage /> },
              { path: 'inventory', element: <ManagerInventoryListPage /> },
              { path: 'inventory/:productId', element: <ManagerInventoryManagePage /> },
              { path: 'settings', element: <SettingsPage /> },
            ]
          }
        ]
      },
      {
        path: '/admin',
        element: <RoleGuard allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'inventory/status', element: <AdminInventoryStatusPage /> },
              { path: 'inventory/low-stock', element: <AdminLowStockPage /> },
              { path: 'settings', element: <SettingsPage /> },
            ]
          }
        ]
      }
    ]
  }
]);
