import { useQuery } from '@tanstack/react-query';
import { SYSTEM_USER_ID } from '@shared/utils/uuid';

/**
 * Hook to consistently resolve the current user ID for attribution.
 * Order of precedence:
 * 1. /api/auth/me endpoint returning { id }
 * 2. X-User-Id header (future enhancement; currently unused client-side)
 * 3. SYSTEM_USER_ID fallback constant
 */
export function useUserId() {
  const { data } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error('not-auth');
        const json = await res.json();
        if (json && typeof json.id === 'string' && json.id.length > 0) {
          return json.id as string;
        }
      } catch (_e) {
        // swallow
      }
      return SYSTEM_USER_ID;
    },
    staleTime: 5 * 60 * 1000,
  });
  return data || SYSTEM_USER_ID;
}
