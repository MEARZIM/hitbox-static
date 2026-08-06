import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { DiscoverProductFilters, DiscoverProductItem } from '../types/discover'
import { buildDiscoverProductsPath, discoverKeys } from './routes'

/**
 * GET /api/v1/discover/products — paginated list backing "See All" and the
 * search bar. Returns { data, meta } for pagination. Public, no auth.
 *
 * `keepPreviousData` holds the current page on screen while the next page
 * (or a narrower search) loads, so lists don't flash empty.
 */
export function useDiscoverProducts(filters: DiscoverProductFilters = {}, options?: { enabled?: boolean }) {
    const api = useApi()

    return useQuery({
        queryKey: discoverKeys.products(filters),
        queryFn: () => api.getPage<DiscoverProductItem>(buildDiscoverProductsPath(filters)),
        placeholderData: keepPreviousData,
        enabled: options?.enabled ?? true,
    })
}
