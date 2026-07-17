import { useAuth } from '@clerk/clerk-expo'
import { useCallback } from 'react'

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export interface ApiError {
    code: string
    message: string
    details?: unknown
}

export class ApiRequestError extends Error {
    constructor(
        public status: number,
        public error: ApiError,
    ) {
        super(error.message)
        this.name = 'ApiRequestError'
    }
}



/** Matches PATCH /api/v1/users/me body. */
export interface UpdateMeInput {
    username?: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
}

/** Matches GET /api/v1/auth/me (req.auth). */
export interface AuthPrincipal {
    accountId: string
    clerkUserId: string
    email: string
    role: 'USER'
    sessionId: string
}


export type ProductCategory =
    | 'TRADING_CARD' | 'FIGURE' | 'POSTER' | 'BOOK' | 'AUTOGRAPH' | 'JERSEY'
    | 'DIGITAL_ASSET' | 'ACCESSORY' | 'GAME_BOX' | 'CARD_PACK' | 'OTHER'
export type ProductGenre =
    | 'MUSIC' | 'SPORTS' | 'FILM' | 'GAMING' | 'PUBLICATION' | 'ART' | 'ANIME' | 'OTHER'
export type ProductType = 'GROUP' | 'INDIVIDUAL'
export type ProductRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'EXCLUSIVE'
export type MarketplaceStatus = 'TRENDING_NOW' | 'NEW_RELEASE' | 'TOP_CREATORS'

export interface ProductImage {
    id: string
    title: string | null
    description: string | null
    url: string
}

export interface Artist {
    id: string
    name: string
    slug: string
    bio: string | null
    imageUrl: string | null
    genre: ProductGenre | null
    isVerified: boolean
}

export interface Product {
    id: string
    productCode: string
    name: string
    type: ProductType
    category: ProductCategory
    genre: ProductGenre
    description: string | null
    rewardPoints: number
    state: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    marketplaceStatus: MarketplaceStatus | null
    rarity: ProductRarity
    priceInDollars: string | number
    inventoryUnit: number
    unitsSold: number
    tagId: string | null
    claimedStatus: 'UNCLAIMED' | 'CLAIMED'
    releaseDate: string | null
    createdAt: string
    images: ProductImage[]
    collection: { id: string; name: string; artist: Artist } | null
}

/** Matches GET /api/v1/products query params. */
export interface ProductFilters {
    page?: number
    limit?: number
    category?: ProductCategory
    genre?: ProductGenre
    type?: ProductType
    rarity?: ProductRarity
    marketplaceStatus?: MarketplaceStatus
    collectionId?: string
    search?: string
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
}

export interface PageMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface Paginated<T> {
    data: T[]
    meta: PageMeta
}

/**
 * Authenticated fetch against the HitBox backend. Attaches the Clerk session
 * JWT as `Authorization: Bearer <token>` — required by all 🔒 endpoints.
 *
 * const api = useApi()
 * const me = await api.get<Me>('/api/v1/users/me')
 * await api.patch<Me>('/api/v1/users/me', { username: 'ayan_2' })
 */
export function useApi() {
    const { getToken } = useAuth()

    const request = useCallback(
        async <T>(path: string, options: RequestInit = {}): Promise<T> => {
            const token = await getToken()

            const res = await fetch(`${API_URL}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    // Skips ngrok's free-tier browser interstitial page
                    'ngrok-skip-browser-warning': 'true',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...options.headers,
                },
            })

            if (res.status === 204) return undefined as T

            const body = await res.json().catch(() => null)

            if (!res.ok) {
                throw new ApiRequestError(
                    res.status,
                    body?.error ?? { code: 'INTERNAL_ERROR', message: `Request failed (${res.status})` },
                )
            }

            return body as T
        },
        [getToken],
    )

    return {
        get: async <T>(path: string) => (await request<{ data: T }>(path)).data,
        /** For list endpoints — preserves the pagination `meta` envelope. */
        getPage: <T>(path: string) => request<Paginated<T>>(path),
        post: async <T>(path: string, body?: unknown) =>
            (await request<{ data: T }>(path, { method: 'POST', body: body != null ? JSON.stringify(body) : undefined })).data,
        patch: async <T>(path: string, body: unknown) =>
            (await request<{ data: T }>(path, { method: 'PATCH', body: JSON.stringify(body) })).data,
        delete: async (path: string) => { await request<undefined>(path, { method: 'DELETE' }) },
    }
}
