import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { MarketplaceFeed } from '../types/marketplace'
import { MARKETPLACE_ROUTES, marketplaceKeys } from './routes'

/**
 * GET /api/v1/marketplace — featured + new listings, queried by the backend
 * in parallel. Public, no auth.
 */
export function useMarketplaceFeed() {
    const api = useApi()

    return useQuery({
        queryKey: marketplaceKeys.feed,
        queryFn: () => api.get<MarketplaceFeed>(MARKETPLACE_ROUTES.feed),
        staleTime: 1000 * 60 * 2,
    })
}
