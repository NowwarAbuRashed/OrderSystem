import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth-context';
import { AppRole } from '../../shared/types/auth';

function getHomePath(role: AppRole) {
  switch (role) {
    case 'CUSTOMER': return '/products';
    case 'MANAGER': return '/manager/orders';
    case 'ADMIN': return '/admin/inventory/status';
  }
}

export function GuestGuard() {
  const { isAuthenticated, isInitializing, user } = useAuth();
  if (isInitializing) return null;
  if (isAuthenticated && user) return <Navigate to={getHomePath(user.role)} replace />;
  return <Outlet />;
}

export function AuthGuard() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RoleGuard({ allowedRoles }: { allowedRoles: AppRole[] }) {
  const { user, isInitializing } = useAuth();
  if (isInitializing) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={getHomePath(user.role)} replace />;
  return <Outlet />;
}
