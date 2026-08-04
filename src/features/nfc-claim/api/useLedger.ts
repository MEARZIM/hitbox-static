import { useQuery } from '@tanstack/react-query'

import { useApi } from '@/lib/api'
import { LedgerEntry } from '../types/claim'
import { CLAIM_ROUTES, claimKeys } from './routes'

/**
 * GET /api/v1/ledger/:tagId — public provenance chain for the product on this
 * tag, oldest first: MINT (owner HitBox) then a CLAIM row per claim.
 * Works signed out; the token is simply omitted when there's no session.
 */
export function useLedger(tagId: string | undefined, enabled = true) {
    const api = useApi()

    return useQuery({
        queryKey: claimKeys.ledger(tagId ?? ''),
        queryFn: () => api.get<LedgerEntry[]>(CLAIM_ROUTES.ledger(tagId!)),
        enabled: !!tagId && enabled,
        staleTime: 0,
        retry: false,
    })
}
