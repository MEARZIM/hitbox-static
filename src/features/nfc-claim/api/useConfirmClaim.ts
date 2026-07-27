import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ClaimResult } from '../types/claim'
import { nfcApi } from './client'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * POST /api/v1/claims/:tagId/confirm — claims the product. The owner's userId
 * lands on the ProductClaim row and the CLAIM ledger record.
 * Returns `outcome: 'ALREADY_CLAIMED'` rather than erroring if someone else won.
 */
export function useConfirmClaim(tagId: string | undefined) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => nfcApi.post<ClaimResult>(CLAIM_ROUTES.confirm(tagId!)),
        onSuccess: () => {
            // Ownership and the provenance chain both changed.
            queryClient.invalidateQueries({ queryKey: claimKeys.all })
        },
    })
}
