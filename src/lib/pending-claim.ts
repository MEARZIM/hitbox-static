/**
 * Remembers the tag a user was trying to claim when they got sent to sign in,
 * so the OAuth redirect (which loses route params) can return to it.
 */
let pendingTag: string | null = null;

export function setPendingClaim(tagId: string | null): void {
    pendingTag = tagId || null;
}

export function takePendingClaim(): string | null {
    const t = pendingTag;
    pendingTag = null;
    return t;
}
