import axios from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Check standard problem details message
    const data = error.response?.data;
    const status = error.response?.status;

    if (data?.message) return data.message;
    if (data?.Message) return data.Message;
    if (data?.title) return data.title; // For .NET ProblemDetails

    // HTTP Status Fallbacks
    if (status === 400) return 'Invalid request. Please check your inputs.';
    if (status === 401) return 'Unauthorized. Please log in again.';
    if (status === 403) return 'Forbidden. You do not have permission.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 409) return 'Conflict. This operation could not be completed.';
    if (status === 422) return 'Unprocessable Entity. Validation failed.';
    if (status && status >= 500) return 'Server error. Please try again later.';

    return error.message || 'An unexpected network error occurred';
  }
  return 'Something went wrong';
}

/**
 * Extracts field-level validation errors from a .NET ValidationProblemDetails response.
 * Expects `error.response.data.errors` to be a dictionary like: { "Email": ["Err1", "Err2"] }
 * Returns a lowercased-key map for easy React-Hook-Form mapping.
 */
export function getApiErrorMap(error: unknown): Record<string, string> {
  const map: Record<string, string> = {};
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      for (const [key, val] of Object.entries(errors)) {
        // Lowercase the first letter to match RHF field names (e.g. "Email" -> "email")
        const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
        if (Array.isArray(val) && val.length > 0) {
          map[fieldName] = val[0];
        } else if (typeof val === 'string') {
          map[fieldName] = val;
        }
      }
    }
  }
  return map;
}
