/** Shown when a product has no image yet (imageUrl is null). */
export const DISCOVER_PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=60'

export function formatRewardPoints(points: number) {
    return `${points.toLocaleString('en-US')} pts`
}
