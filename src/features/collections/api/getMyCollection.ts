import { useApi } from '@/lib/api'
import { retryAuthAware } from '@/lib/queries'
import { useAuth } from '@clerk/clerk-expo'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { CollectionItem, MyCollectionFilters } from '../types/collection'
import { buildMyCollectionPath, collectionKeys } from './routes'

/**
 * GET /api/v1/collections/me 🔒 — the signed-in user's own shelf, newest
 * first, private items included. Returns { data, meta } for pagination.
 *
 * `keepPreviousData` holds the current list while a new page or filter loads.
 * `retryAuthAware` rides out the post-sign-up webhook race (AUTH_ACCOUNT_NOT_FOUND).
 */
export function useMyCollection(filters: MyCollectionFilters = {}) {
    const api = useApi()
    const { isSignedIn } = useAuth()

    return useQuery({
        queryKey: collectionKeys.me(filters),
        queryFn: () => api.getPage<CollectionItem>(buildMyCollectionPath(filters)),
        enabled: !!isSignedIn,
        placeholderData: keepPreviousData,
        retry: retryAuthAware,
        staleTime: 1000 * 60 * 2,
    })
}
