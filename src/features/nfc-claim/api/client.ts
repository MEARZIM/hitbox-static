/**
 * Self-contained fetch client for the NFC claim/verify flow.
 *
 * The NFC section runs WITHOUT sign-in for now, so it deliberately does not use
 * the app's Clerk-authenticated `useApi()` hook. Instead it sends a fixed
 * `X-Demo-User`, which the backend (DEMO_AUTH_ENABLED=true) resolves to a real
 * account — so claims still land on a genuine userId and "you already own this"
 * works. Swap this for `useApi()` to put sign-in back.
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ''

/** The account NFC claims are attributed to while sign-in is disabled. */
const NFC_USER = process.env.EXPO_PUBLIC_NFC_USER ?? 'collector@hitbox.dev'

export interface NfcApiError {
    code: string
    message: string
}

export class NfcRequestError extends Error {
    constructor(public status: number, public error: NfcApiError) {
        super(error.message)
        this.name = 'NfcRequestError'
    }
}

async function request<T>(path: string, method: 'GET' | 'POST'): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            // Skips ngrok's free-tier browser interstitial
            'ngrok-skip-browser-warning': 'true',
            'X-Demo-User': NFC_USER,
        },
        body: method === 'POST' ? JSON.stringify({}) : undefined,
    })

    const body = (await res.json().catch(() => null)) as
        | { data?: T; error?: NfcApiError }
        | null

    if (!res.ok) {
        throw new NfcRequestError(
            res.status,
            body?.error ?? { code: 'INTERNAL_ERROR', message: `Request failed (${res.status})` },
        )
    }
    return body?.data as T
}

export const nfcApi = {
    get: <T>(path: string) => request<T>(path, 'GET'),
    post: <T>(path: string) => request<T>(path, 'POST'),
}
