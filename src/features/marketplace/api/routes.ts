import { MarketplaceListingFilters } from '../types/marketplace'

/** Marketplace module endpoints (browse routes are public). */
export const MARKETPLACE_ROUTES = {
    /** GET — featured + new listings in one round-trip. */
    feed: '/api/v1/marketplace',
    /** GET — paginated listings behind category tabs, search and "See All". */
    listings: '/api/v1/marketplace/listings',
} as const

/** TanStack Query keys for the marketplace feature. */
export const marketplaceKeys = {
    all: ['marketplace'] as const,
    feed: ['marketplace', 'feed'] as const,
    listings: (filters: MarketplaceListingFilters = {}) => ['marketplace', 'listings', filters] as const,
}

export function buildMarketplaceListingsPath(filters: MarketplaceListingFilters) {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))
    const qs = params.toString()
    return qs ? `${MARKETPLACE_ROUTES.listings}?${qs}` : MARKETPLACE_ROUTES.listings
}
