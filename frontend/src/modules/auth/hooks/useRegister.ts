import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import { useAuth } from '../../../app/store/auth-context';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data);
      if (data.role === 'CUSTOMER') navigate('/products');
      else if (data.role === 'MANAGER') navigate('/manager/orders');
      else if (data.role === 'ADMIN') navigate('/admin/inventory/status');
    },
  });
}
