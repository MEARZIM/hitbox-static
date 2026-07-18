import { DiscoverProductFilters } from '../types/discover'

/** Discover module endpoints (public — no auth). */
export const DISCOVER_ROUTES = {
    /** GET — featured carousel + every section in one round-trip. */
    feed: '/api/v1/discover',
    /** GET — paginated list backing "See All" and the search bar. */
    products: '/api/v1/discover/products',
} as const

/** TanStack Query keys for the discover feature. */
export const discoverKeys = {
    all: ['discover'] as const,
    feed: ['discover', 'feed'] as const,
    products: (filters: DiscoverProductFilters = {}) => ['discover', 'products', filters] as const,
}

export function buildDiscoverProductsPath(filters: DiscoverProductFilters) {
    const params = new URLSearchParams()
    if (filters.section) params.append('section', filters.section)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))
    const qs = params.toString()
    return qs ? `${DISCOVER_ROUTES.products}?${qs}` : DISCOVER_ROUTES.products
}
