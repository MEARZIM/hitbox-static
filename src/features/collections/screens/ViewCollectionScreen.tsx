import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import GlobalCollectionSection, {
  CollectibleItem,
  CollectionDetail,
} from "@/components/GlobalCollectionSection";
import { collectionData } from "../data/CollectionData";
import recentCollections from "../data/Recentsection";

export default function ViewCollectionScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [items, setItems] = useState<CollectibleItem[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (!id) {
        // Fetch the whole recently added collection
        const totalItems = recentCollections.length;
        const ownedItems = recentCollections.filter((item) => item.owned).length;
        const progressPercent = Math.round((ownedItems / totalItems) * 100);

        setCollection({
          id: "recently-added",
          title: "Recently Added",
          subtitle: "Latest collectibles in your library",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
          featured: false,
          owned: ownedItems,
          total: totalItems,
          progress: progressPercent,
          category: "Library",
        });
        setItems(recentCollections as CollectibleItem[]);
      } else {
        // Find collection by ID, default to collection with ID "1" if not found
        const collectionId = typeof id === "string" ? id : "1";
        const foundCollection = collectionData.find((c) => c.id === collectionId) || collectionData[0];
        setCollection(foundCollection);

        // Fetch or generate items matching the collection's subtitle/title
        const filtered = recentCollections.filter(
          (item) =>
            item.subtitle.toLowerCase().includes(foundCollection.title.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(foundCollection.subtitle.toLowerCase()) ||
            foundCollection.title.toLowerCase().includes(item.subtitle.toLowerCase())
        );

        if (filtered.length === 0) {
          const generatedItems: CollectibleItem[] = Array.from({ length: foundCollection.total }).map((_, index) => {
            const isOwned = index < foundCollection.owned;
            const rarities = ["Common", "Uncommon", "Rare", "Epic"];
            const rarity = rarities[index % rarities.length];
            return {
              id: `gen-${index}`,
              title: `${foundCollection.title} #${String(index + 1).padStart(2, "0")}`,
              subtitle: foundCollection.subtitle,
              image: { uri: `https://picsum.photos/400/600?random=${index + 10}` },
              rarity,
              isNew: index === 0,
              owned: isOwned,
            };
          });
          setItems(generatedItems);
        } else {
          const finalItems = filtered.map((item, index) => ({
            ...item,
            owned: index < foundCollection.owned,
          }));
          setItems(finalItems as CollectibleItem[]);
        }
      }

      setLoading(false);
    }, 850);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <GlobalCollectionSection
      collection={collection}
      items={items}
      loading={loading}
    />
  );
}
