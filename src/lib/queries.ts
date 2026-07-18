import { useAuth } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'

import {
    ApiRequestError,
    AuthPrincipal,
    useApi
} from './api'

// Shared, cross-feature query keys (feature-specific keys live in each
// feature's api/routes.ts — e.g. discoverKeys, marketplaceKeys, productKeys).
export const queryKeys = {
    authMe: ['auth', 'me'] as const,
    me: ['users', 'me'] as const,
    user: (id: string) => ['users', id] as const,
}

/**
 * Right after sign-up the Clerk webhook may not have created the local user
 * row yet, so the backend answers 401 AUTH_ACCOUNT_NOT_FOUND for a valid
 * token. Retry those; fail fast on anything else that's 4xx.
 */
export function retryAuthAware(failureCount: number, error: unknown) {
    if (error instanceof ApiRequestError) {
        if (error.error.code === 'AUTH_ACCOUNT_NOT_FOUND') return failureCount < 5
        if (error.status >= 400 && error.status < 500) return false
    }
    return failureCount < 2
}

/** GET /api/v1/auth/me — the authenticated principal. */
export function useAuthMe() {
    const api = useApi()
    const { isSignedIn } = useAuth()

    return useQuery({
        queryKey: queryKeys.authMe,
        queryFn: () => api.get<AuthPrincipal>('/api/v1/auth/me'),
        enabled: !!isSignedIn,
        retry: retryAuthAware,
    })
}
