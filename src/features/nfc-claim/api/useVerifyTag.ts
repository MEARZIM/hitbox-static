import { useQuery } from '@tanstack/react-query'

import { VerifyResult } from '../types/claim'
import { nfcApi } from './client'
import { CLAIM_ROUTES } from './routes'

/**
 * GET /api/v1/verify/:tagId — authenticity check. Confirms a product is
 * registered to the tag and reports whether it's claimed and by whom. Never
 * mutates anything. 404 CLAIMS_TAG_NOT_FOUND when the tag isn't registered.
 */
export function useVerifyTag(tagId: string | undefined, enabled = true) {
    return useQuery({
        queryKey: ['claims', 'verify', tagId ?? ''],
        queryFn: () => nfcApi.get<VerifyResult>(CLAIM_ROUTES.verify(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0,
        retry: false,
    })
}
