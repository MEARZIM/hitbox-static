import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { TaggedProduct } from '../types/claim'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * GET /api/v1/products/tag/:tagId — the product carrying this NFC tag.
 * **Public**, and complements `/verify`: verify proves authenticity + ownership,
 * this supplies the images / price / rarity the verified screen shows.
 */
export function useProductByTag(tagId: string | undefined, enabled = true) {
    const api = useApi()

    return useQuery({
        queryKey: claimKeys.productByTag(tagId ?? ''),
        queryFn: () => api.get<TaggedProduct>(CLAIM_ROUTES.productByTag(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0,
        retry: false,
    })
}
