import { MyCollectionFilters } from '../types/collection'

/** Collections module endpoints. `me` routes require auth (🔒). */
export const COLLECTION_ROUTES = {
    /** GET — the authenticated user's own shelf (private items included). */
    me: '/api/v1/collections/me',
    /** GET — aggregated stats (item count, collections, progress) for the shelf. */
    meStats: '/api/v1/collections/me/stats',
    /** PATCH — toggle one owned item's visibility; :productId is the product's id. */
    meItem: (productId: string) => `/api/v1/collections/me/${productId}`,
} as const

/** TanStack Query keys for the collections feature. */
export const collectionKeys = {
    all: ['collections'] as const,
    me: (filters: MyCollectionFilters = {}) => ['collections', 'me', filters] as const,
    stats: ['collections', 'me', 'stats'] as const,
}

export function buildMyCollectionPath(filters: MyCollectionFilters) {
    const params = new URLSearchParams()
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.visibility) params.append('visibility', filters.visibility)
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))
    const qs = params.toString()
    return qs ? `${COLLECTION_ROUTES.me}?${qs}` : COLLECTION_ROUTES.me
}
