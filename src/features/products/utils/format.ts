import { MarketplaceStatus, ProductCategory, ProductRarity } from '../types/product'

/** Shown when a product has no images. */
export const PRODUCT_PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=60'

/** "149.99" (decimal-as-string from the API) → "$149.99". */
export function formatPrice(priceInDollars: string) {
    const value = Number(priceInDollars)
    if (Number.isNaN(value)) return `$${priceInDollars}`
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function formatRewardPoints(points: number) {
    return `${points.toLocaleString('en-US')} pts`
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
    TRADING_CARD: 'Trading Card',
    FIGURE: 'Figure',
    POSTER: 'Poster',
    BOOK: 'Book',
    AUTOGRAPH: 'Autograph',
    JERSEY: 'Jersey',
    DIGITAL_ASSET: 'Digital Asset',
    ACCESSORY: 'Accessory',
    GAME_BOX: 'Game Box',
    CARD_PACK: 'Card Pack',
    OTHER: 'Collectible',
}

export function formatCategory(category: ProductCategory) {
    return CATEGORY_LABELS[category] ?? category
}

/** "LEGENDARY" → "Legendary". */
export function formatRarity(rarity: ProductRarity) {
    return rarity.charAt(0) + rarity.slice(1).toLowerCase()
}

/**
 * The card badge for a product's curation status — the same mapping the
 * marketplace feed applies server-side (`TRENDING_NOW` → HOT,
 * `NEW_RELEASE` → NEW), so a product carries the same label wherever it appears.
 *
 * The detail screen has to derive it rather than receive it: discover and
 * marketplace cards are handed a badge by their feed, but `GET /products/:id`
 * returns the raw `marketplaceStatus`.
 */
export function formatMarketplaceBadge(status: MarketplaceStatus | null): string | null {
    if (status === 'NEW_RELEASE') return 'NEW'
    if (status === 'TRENDING_NOW') return 'HOT'
    return null
}

export function formatDate(iso: string | null | undefined) {
    if (!iso) return null
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
