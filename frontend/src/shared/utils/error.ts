import axios from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      'Something went wrong'
    );
  }
  return 'Something went wrong';
}
