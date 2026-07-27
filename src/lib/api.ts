/**
 * Minimal API client for the HitBox backend.
 *
 * Base URL comes from EXPO_PUBLIC_API_URL (the ngrok tunnel in dev). The
 * `ngrok-skip-browser-warning` header stops ngrok-free from returning its HTML
 * interstitial instead of JSON.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/**
 * Bearer-token provider, set once at app start by the Clerk-aware root layout
 * (see registerAuthTokenGetter usage in app/_layout). Keeping it in a module
 * holder lets this plain (non-hook) api client fetch the current session token.
 */
let tokenGetter: (() => Promise<string | null>) | null = null;

export function registerAuthTokenGetter(fn: () => Promise<string | null>): void {
    tokenGetter = fn;
}

/** Returns the current Clerk session token, or null when signed out. */
export async function getAuthToken(): Promise<string | null> {
    try {
        return tokenGetter ? await tokenGetter() : null;
    } catch {
        return null;
    }
}

export interface ApiResponse<T> {
    status: number;
    ok: boolean;
    data?: T;
    error?: { code: string; message: string; details?: unknown };
}

export async function apiFetch<T = unknown>(
    path: string,
    init: RequestInit = {},
): Promise<ApiResponse<T>> {
    const token = await getAuthToken();
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}/api/v1${path}`, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(init.headers ?? {}),
            },
        });
    } catch (err) {
        return {
            status: 0,
            ok: false,
            error: { code: 'NETWORK_ERROR', message: (err as Error)?.message ?? 'Network request failed' },
        };
    }

    const json = (await res.json().catch(() => null)) as { data?: T; error?: ApiResponse<T>['error'] } | null;
    return { status: res.status, ok: res.ok, data: json?.data, error: json?.error };
}
