import { useApi } from '@/lib/api'
import { retryAuthAware } from '@/lib/queries'
import { useAuth } from '@clerk/clerk-expo'
import { useInfiniteQuery } from '@tanstack/react-query'

import { CollectionItem, MyCollectionFilters } from '../types/collection'
import { buildMyCollectionPath, collectionKeys } from './routes'

/**
 * GET /api/v1/collections/me 🔒 with page-by-page accumulation for "load more"
 * lists (All Collections, View Collection). Flatten `data.pages` for the items;
 * `fetchNextPage` / `hasNextPage` drive pagination off the response `meta`.
 */
export function useMyCollectionInfinite(filters: Omit<MyCollectionFilters, 'page'> = {}) {
    const api = useApi()
    const { isSignedIn } = useAuth()
    const limit = filters.limit ?? 20

    return useInfiniteQuery({
        queryKey: [...collectionKeys.me(filters), 'infinite'],
        queryFn: ({ pageParam }) =>
            api.getPage<CollectionItem>(buildMyCollectionPath({ ...filters, limit, page: pageParam })),
        enabled: !!isSignedIn,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
        retry: retryAuthAware,
        staleTime: 1000 * 60 * 2,
    })
}
