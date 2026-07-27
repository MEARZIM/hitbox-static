import { useQuery } from '@tanstack/react-query'

import { LedgerEntry } from '../types/claim'
import { nfcApi } from './client'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * GET /api/v1/ledger/:tagId — provenance chain for the product on this tag,
 * oldest first: MINT (owner HitBox) then a CLAIM row per claim.
 */
export function useLedger(tagId: string | undefined, enabled = true) {
    return useQuery({
        queryKey: claimKeys.ledger(tagId ?? ''),
        queryFn: () => nfcApi.get<LedgerEntry[]>(CLAIM_ROUTES.ledger(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0,
        retry: false,
    })
}
