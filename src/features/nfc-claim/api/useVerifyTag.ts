import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { VerifyResult } from '../types/claim'
import { CLAIM_ROUTES } from './routes'

/**
 * GET /api/v1/verify/:tagId — public authenticity check. Confirms a product is
 * registered to the tag and reports whether it's claimed and by whom. Needs no
 * session (anyone can verify an item) and never mutates anything.
 * 404 CLAIMS_TAG_NOT_FOUND when the tag isn't registered.
 */
export function useVerifyTag(tagId: string | undefined, enabled = true) {
    const api = useApi()

    return useQuery({
        queryKey: ['claims', 'verify', tagId ?? ''],
        queryFn: () => api.get<VerifyResult>(CLAIM_ROUTES.verify(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0,
        retry: false,
    })
}
