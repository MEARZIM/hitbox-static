import { useApi } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CollectionItem, UpdateVisibilityInput } from '../types/collection'
import { COLLECTION_ROUTES, collectionKeys } from './routes'

/**
 * PATCH /api/v1/collections/me/:productId 🔒 — toggle one owned item between
 * showcase (PUBLIC) and private. `productId` is the product's id, not the
 * collection-item id. 404 COLLECTIONS_ITEM_NOT_FOUND if it isn't yours.
 */
export function useUpdateCollectionVisibility() {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, visibility }: UpdateVisibilityInput & { productId: string }) =>
            api.patch<CollectionItem>(COLLECTION_ROUTES.meItem(productId), { visibility }),
        onSuccess: () => {
            // Refetch every "my collection" query — filtered views may gain/lose the item
            queryClient.invalidateQueries({ queryKey: collectionKeys.all })
        },
    })
}
