import React from "react";

import GlobalCollectionSection, {
  CollectibleItem,
  CollectionDetail,
} from "@/components/GlobalCollectionSection";
import { useCollectionStats } from "../api/getCollectionStats";
import { useMyCollectionInfinite } from "../api/getMyCollectionInfinite";
import { COLLECTION_PLACEHOLDER_IMAGE, toCollectibleItem } from "../utils/mapCollectionItem";

export default function ViewCollectionScreen() {
  const stats = useCollectionStats();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyCollectionInfinite({ limit: 12 });

  const rawItems = data?.pages.flatMap((page) => page.data) ?? [];
  const items: CollectibleItem[] = rawItems.map(toCollectibleItem);
  const total = data?.pages[0]?.meta.total ?? 0;

  const collection: CollectionDetail | null =
    isLoading && rawItems.length === 0
      ? null
      : {
        id: "my-collection",
        title: "My Collection",
        subtitle: `${total} collectible${total === 1 ? "" : "s"}`,
        image: rawItems[0]?.product.imageUrl ?? COLLECTION_PLACEHOLDER_IMAGE,
        featured: false,
        owned: stats.data?.collectionProgress.owned ?? 0,
        total: stats.data?.collectionProgress.total ?? 0,
        progress: stats.data?.collectionProgress.percentage ?? 0,
        category: "Collection",
      };

  return (
    <GlobalCollectionSection
      collection={collection}
      items={items}
      loading={isLoading}
      error={isError}
      onRetry={refetch}
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      loadingMore={isFetchingNextPage}
    />
  );
}
