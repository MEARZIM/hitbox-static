/**
 * Types for the Collections module — mirrors `/api/v1/collections` in the
 * backend API reference. Backs the "My Collection" tab: a user's shelf of
 * owned/claimed collectibles (BuyerCollection). Items are added via the
 * claims flow — there is no "add to collection" endpoint.
 */

export type CollectionVisibility = 'PUBLIC' | 'PRIVATE'

export type CollectionGenre =
    | 'MUSIC' | 'SPORTS' | 'FILM' | 'GAMING' | 'PUBLICATION' | 'ART' | 'ANIME' | 'OTHER'

export type CollectionRarity =
    | 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'EXCLUSIVE'

/** Product card embedded in a collection row — tap → GET /products/:id for full detail. */
export interface CollectionProductCard {
    id: string
    name: string
    /** First product image; null if none. */
    imageUrl: string | null
    rarity: CollectionRarity
    rewardPoints: number
    claimedStatus: 'UNCLAIMED' | 'CLAIMED'
}

/** CollectionItemDto — a collection row plus its embedded product card. */
export interface CollectionItem {
    /** Collection-item id (distinct from product id). */
    id: string
    visibility: CollectionVisibility
    totalClaimedNo: number
    /** Nullable. */
    genre: CollectionGenre | null
    addedAt: string
    product: CollectionProductCard
}

/** Query params for GET /api/v1/collections/me. */
export interface MyCollectionFilters {
    genre?: CollectionGenre
    visibility?: CollectionVisibility
    /** int ≥ 1, default 1. */
    page?: number
    /** int 1–50, default 20. */
    limit?: number
}

/** Body for PATCH /api/v1/collections/me/:productId. */
export interface UpdateVisibilityInput {
    visibility: CollectionVisibility
}

/** GET /api/v1/collections/me/stats — aggregated stats for the Collections screen. */
export interface CollectionStats {
    /** Count of the user's collection items (rows). */
    totalClaimedItems: number
    /** Distinct ArtistCollections the user has ≥ 1 product from. */
    totalArtistCollections: number
    collectionProgress: {
        /** The user's items that belong to an ArtistCollection. */
        owned: number
        /** Σ maximumLimit of those collections. */
        total: number
        /** round(owned / total × 100), clamped 0–100. */
        percentage: number
    }
}
