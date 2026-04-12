import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileApi, updateProfileApi, changePasswordApi } from '../api/auth.api';
import { UpdateProfileRequest, ChangePasswordRequest } from '../../../shared/types/auth';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfileApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePasswordApi(payload),
  });
}
