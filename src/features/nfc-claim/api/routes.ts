/** Claims module endpoints. Claim steps are 🔒; verify/ledger reads are public. */
export const CLAIM_ROUTES = {
    /** 🔒 validate the tag — returns product + which screen to show (no mutation). */
    validate: (tagId: string) => `/api/v1/claims/${encodeURIComponent(tagId)}`,
    /** 🔒 perform the claim. */
    confirm: (tagId: string) => `/api/v1/claims/${encodeURIComponent(tagId)}/confirm`,
    /** Public — authenticity + current owner. */
    verify: (tagId: string) => `/api/v1/verify/${encodeURIComponent(tagId)}`,
    /** Public — full provenance chain. */
    ledger: (tagId: string) => `/api/v1/ledger/${encodeURIComponent(tagId)}`,
} as const

/** TanStack Query keys for the NFC claim feature. */
export const claimKeys = {
    all: ['claims'] as const,
    validate: (tagId: string) => ['claims', 'validate', tagId] as const,
    ledger: (tagId: string) => ['claims', 'ledger', tagId] as const,
}
