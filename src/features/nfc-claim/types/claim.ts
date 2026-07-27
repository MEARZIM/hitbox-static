/** Shapes returned by the claims module (see docs/nfc-claim-verify-api.md). */

export interface ClaimOwner {
    id: string
    username: string | null
    displayName: string | null
}

/** GET /api/v1/verify/:tagId — public authenticity + ownership check (no claim). */
export interface VerifyResult {
    valid: boolean
    productId: string
    productCode: string
    name: string
    claimed: boolean
    claimedStatus: 'CLAIMED' | 'UNCLAIMED'
    state: string
    owner: ClaimOwner | null
    /** Number of records on the provenance chain. */
    ledgerLength: number
    verifiedAt: string
}

/** POST /api/v1/claims/:tagId — validate step; tells the app which screen to show. */
export interface ValidateResult {
    tagId: string
    screen: 'CLAIMABLE' | 'ALREADY_CLAIMED_BY_YOU' | 'ALREADY_CLAIMED'
    claimedByYou: boolean
    product: {
        id: string
        productCode: string
        name: string
        tagId: string | null
        priceInDollars: string
        rewardPoints: number
        state: string
        imageUrl: string | null
    }
    owner: ClaimOwner | null
    claimedAt: string | null
}

/** POST /api/v1/claims/:tagId/confirm — the actual claim. */
export interface ClaimResult {
    outcome: 'CLAIMED' | 'ALREADY_CLAIMED'
    claimedByYou: boolean
    message: string
    owner: ClaimOwner
    product: {
        id: string
        productCode: string
        name: string
        tagId: string | null
        claimedStatus: string
    }
    claimedAt: string | null
    claim: { id: string; claimCode: string; claimedNo: number } | null
}

/**
 * One record of the blockchain ledger:
 * Product Id · Tag # · Owner Id · DateTime · Hash # · Claim History · P2P.
 */
export interface LedgerEntry {
    sequenceNo: number
    txType: 'MINT' | 'CLAIM' | 'TRANSFER'
    productId: string
    tag: string | null
    ownerId: string
    dateTime: string
    hash: string
    previousHash: string | null
    claimHistory: boolean
    peerToPeerTrading: boolean
}
