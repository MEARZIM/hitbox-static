import { useAuth } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'

import {
    ApiRequestError,
    AuthPrincipal,
    Product,
    ProductFilters,
    useApi
} from './api'

export const queryKeys = {
    authMe: ['auth', 'me'] as const,
    me: ['users', 'me'] as const,
    user: (id: string) => ['users', id] as const,
    products: (filters: ProductFilters = {}) => ['products', filters] as const,
    product: (id: string) => ['products', 'byId', id] as const,
    productByCode: (code: string) => ['products', 'byCode', code] as const,
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

// ── Auth ────────────────────────────────────────────────────────────────────

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

// ── Users ───────────────────────────────────────────────────────────────────



// ── Products ────────────────────────────────────────────────────────────────

function toQueryString(filters: ProductFilters) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
        }
    }
    const qs = params.toString()
    return qs ? `?${qs}` : ''
}

/** GET /api/v1/products — public catalog; returns { data, meta } for pagination. */
export function useProducts(filters: ProductFilters = {}) {
    const api = useApi()

    return useQuery({
        queryKey: queryKeys.products(filters),
        queryFn: () => api.getPage<Product>(`/api/v1/products${toQueryString(filters)}`),
    })
}

/** GET /api/v1/products/:id */
export function useProduct(id: string | undefined) {
    const api = useApi()

    return useQuery({
        queryKey: queryKeys.product(id ?? ''),
        queryFn: () => api.get<Product>(`/api/v1/products/${id}`),
        enabled: !!id,
    })
}

/** GET /api/v1/products/code/:productCode — e.g. after an NFC scan. */
export function useProductByCode(productCode: string | undefined) {
    const api = useApi()

    return useQuery({
        queryKey: queryKeys.productByCode(productCode ?? ''),
        queryFn: () => api.get<Product>(`/api/v1/products/code/${productCode}`),
        enabled: !!productCode,
    })
}
