import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { ClaimResult } from '../types/claim'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * POST /api/v1/claims/:tagId/confirm 🔒 — claims the product for the signed-in
 * user. Their Clerk-backed userId lands on the ProductClaim row and the CLAIM
 * ledger record. Returns `outcome: 'ALREADY_CLAIMED'` rather than erroring if
 * someone else claimed it first.
 */
export function useConfirmClaim(tagId: string | undefined) {
    const api = useApi()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => api.post<ClaimResult>(CLAIM_ROUTES.confirm(tagId!)),
        onSuccess: () => {
            // Ownership and the provenance chain both changed.
            queryClient.invalidateQueries({ queryKey: claimKeys.all })
        },
    })
}
