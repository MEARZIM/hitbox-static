import { useApi } from '@/lib/api'
import { retryAuthAware } from '@/lib/queries'
import { useAuth } from '@clerk/clerk-expo'
import { useQuery } from '@tanstack/react-query'

import { CollectionStats } from '../types/collection'
import { COLLECTION_ROUTES, collectionKeys } from './routes'

/**
 * GET /api/v1/collections/me/stats 🔒 — item count, distinct artist
 * collections, and collection-progress for the signed-in user's shelf.
 * Backs the progress card at the top of the Collections screen.
 */
export function useCollectionStats() {
    const api = useApi()
    const { isSignedIn } = useAuth()

    return useQuery({
        queryKey: collectionKeys.stats,
        queryFn: () => api.get<CollectionStats>(COLLECTION_ROUTES.meStats),
        enabled: !!isSignedIn,
        retry: retryAuthAware,
        staleTime: 1000 * 60 * 2,
    })
}
