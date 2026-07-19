import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { MarketplaceListingFilters, MarketplaceListingItem } from '../types/marketplace'
import { buildMarketplaceListingsPath, marketplaceKeys } from './routes'

/**
 * GET /api/v1/marketplace/listings — paginated listings behind the category
 * tabs, search bar and "See All". Returns { data, meta } for pagination.
 *
 * `keepPreviousData` holds the current results on screen while a new page,
 * tab or search term loads, so the list doesn't flash empty.
 */
export function useMarketplaceListings(
    filters: MarketplaceListingFilters = {},
    options?: { enabled?: boolean },
) {
    const api = useApi()

    return useQuery({
        queryKey: marketplaceKeys.listings(filters),
        queryFn: () => api.getPage<MarketplaceListingItem>(buildMarketplaceListingsPath(filters)),
        placeholderData: keepPreviousData,
        enabled: options?.enabled ?? true,
    })
}
