import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { ValidateResult } from '../types/claim'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * POST /api/v1/claims/:tagId 🔒 — validates the scanned tag and returns the
 * product plus which screen to show (CLAIMABLE / ALREADY_CLAIMED_BY_YOU /
 * ALREADY_CLAIMED). Reads only; the claim happens on confirm.
 * 404 CLAIMS_TAG_NOT_FOUND when no product carries the tag.
 *
 * Pass `enabled: false` until Clerk reports a session, otherwise this 401s.
 */
export function useValidateTag(tagId: string | undefined, enabled = true) {
    const api = useApi()

    return useQuery({
        queryKey: claimKeys.validate(tagId ?? ''),
        queryFn: () => api.post<ValidateResult>(CLAIM_ROUTES.validate(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0, // ownership can change under us
        retry: false, // surface 404 / 401 immediately
    })
}
