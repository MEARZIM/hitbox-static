import { apiFetch, type ApiResponse } from '@/lib/api';

export interface Owner {
    id: string;
    username: string | null;
    displayName: string | null;
}

/** POST /claims/:tagId — validate step (which screen to show). */
export interface ValidateResult {
    tagId: string;
    screen: 'CLAIMABLE' | 'ALREADY_CLAIMED_BY_YOU' | 'ALREADY_CLAIMED';
    claimedByYou: boolean;
    product: {
        id: string;
        productCode: string;
        name: string;
        tagId: string | null;
        priceInDollars: string;
        rewardPoints: number;
        state: string;
        imageUrl: string | null;
    };
    owner: Owner | null;
    claimedAt: string | null;
}

/** POST /claims/:tagId/confirm — the claim result. */
export interface ClaimResult {
    outcome: 'CLAIMED' | 'ALREADY_CLAIMED';
    claimedByYou: boolean;
    message: string;
    owner: Owner;
    product: { id: string; productCode: string; name: string; tagId: string | null; claimedStatus: string };
    claimedAt: string | null;
    claim: { id: string; claimCode: string; claimedNo: number } | null;
}

/** One row of the provenance ledger (GET /ledger/:tagId). */
export interface LedgerEntry {
    sequenceNo: number;
    txType: 'MINT' | 'CLAIM' | 'TRANSFER';
    productId: string;
    tag: string | null;
    ownerId: string;
    dateTime: string;
    hash: string;
    previousHash: string | null;
    claimHistory: boolean;
    peerToPeerTrading: boolean;
}

/** Public — the product's full provenance chain. */
export function fetchLedger(tagId: string): Promise<ApiResponse<LedgerEntry[]>> {
    return apiFetch<LedgerEntry[]>(`/ledger/${encodeURIComponent(tagId)}`, { method: 'GET' });
}

/** Step 1 — validate the tag; returns which screen to show. */
export function validateTag(tagId: string): Promise<ApiResponse<ValidateResult>> {
    return apiFetch<ValidateResult>(`/claims/${encodeURIComponent(tagId)}`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
}

/** Step 2 — confirm (actually claim) the tag. */
export function confirmClaim(tagId: string): Promise<ApiResponse<ClaimResult>> {
    return apiFetch<ClaimResult>(`/claims/${encodeURIComponent(tagId)}/confirm`, {
        method: 'POST',
        body: JSON.stringify({ visibility: 'PUBLIC' }),
    });
}
