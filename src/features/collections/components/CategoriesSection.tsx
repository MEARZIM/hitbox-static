import React, { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

import CategoryChips from "./CategoryChips";

interface Category {
  id: string;
  title: string;
}

const CATEGORIES: Category[] = [
  { id: "all", title: "All" },
  { id: "cards", title: "Cards" },
  { id: "figures", title: "Figures" },
  { id: "apparel", title: "Apparel" },
  { id: "tickets", title: "Tickets" },
  { id: "accessories", title: "Accessories" },
  { id: "other", title: "Other" },
];

export default function CategoriesSection() {
  const [selectedId, setSelectedId] = useState("all");

  const renderItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryChips
        title={item.title}
        active={selectedId === item.id}
        onPress={() => setSelectedId(item.id)}
      />
    ),
    [selectedId]
  );

  return (
    <FlatList
      horizontal
      data={CATEGORIES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 4,
        paddingRight: 16,
      }}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      windowSize={7}
    />
  );
}