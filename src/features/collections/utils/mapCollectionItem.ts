import { CollectionItem } from "../types/collection";

/** Shown when a collection item's product has no image. */
export const COLLECTION_PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=60";

/** "LEGENDARY" → "Legendary", "MUSIC" → "Music". */
export function titleCase(value: string) {
    return value.charAt(0) + value.slice(1).toLowerCase();
}

/** CollectionItemDto → the set-style card shape (CollectionGrid / CollectionCard). */
export function toCollectionCard(item: CollectionItem) {
    return {
        id: item.id,
        title: item.product.name,
        subtitle: item.genre ? titleCase(item.genre) : titleCase(item.product.rarity),
        image: { uri: item.product.imageUrl ?? COLLECTION_PLACEHOLDER_IMAGE },
        // Owned collectibles — bar reads full; kept for the shared card interface.
        owned: item.totalClaimedNo,
        total: item.totalClaimedNo,
        // Highlight the rarest pieces with the FEATURED ribbon.
        featured: item.product.rarity === "LEGENDARY" || item.product.rarity === "EXCLUSIVE",
    };
}

/** CollectionItemDto → CollectibleItem for GlobalCollectionSection. */
export function toCollectibleItem(item: CollectionItem) {
    return {
        id: item.id,
        title: item.product.name,
        subtitle: item.genre ? titleCase(item.genre) : titleCase(item.product.rarity),
        image: { uri: item.product.imageUrl ?? COLLECTION_PLACEHOLDER_IMAGE },
        // rarityStyles() keys on "Epic" / "Rare" / "Uncommon"; others fall to default.
        rarity: titleCase(item.product.rarity),
        isNew: false,
        // Everything on the shelf is owned.
        owned: true,
    };
}
