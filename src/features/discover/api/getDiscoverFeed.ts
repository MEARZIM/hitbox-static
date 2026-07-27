import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { DiscoverFeed } from '../types/discover'
import { DISCOVER_ROUTES, discoverKeys } from './routes'

/**
 * GET /api/v1/discover — featured carousel + trending / new releases /
 * top creators, queried by the backend in parallel. Public, no auth.
 */
export function useDiscoverFeed() {
    const api = useApi()
    // console.log(process.env.EXPO_PUBLIC_API_URL + DISCOVER_ROUTES.feed)
    return useQuery({
        queryKey: discoverKeys.feed,
        queryFn: () => api.get<DiscoverFeed>(DISCOVER_ROUTES.feed),
        staleTime: 1000 * 60 * 2,
    })
}
