/** Shown when a listing has no image yet (imageUrl is null). */
export const MARKETPLACE_PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=60'

/** "89.99" (decimal-as-string from the API) → "$89.99". */
export function formatPrice(priceInDollars: string) {
    const value = Number(priceInDollars)
    if (Number.isNaN(value)) return `$${priceInDollars}`
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function formatRewardPoints(points: number) {
    return `${points.toLocaleString('en-US')} pts`
}
