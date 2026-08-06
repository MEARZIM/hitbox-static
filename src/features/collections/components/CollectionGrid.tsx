import React from "react";
import { View } from "react-native";
import CollectionCard from "./CollectionCard";

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: { uri: string };
  owned: number;
  total: number;
  featured: boolean;
}

interface CollectionGridProps {
  data: CollectionItem[];
}

export default function CollectionGrid({ data }: CollectionGridProps) {
  // Chunk the data array into rows of exactly 3 items
  const chunkedData: CollectionItem[][] = [];
  for (let i = 0; i < data.length; i += 3) {
    chunkedData.push(data.slice(i, i + 3));
  }

  return (
    <View className="gap-y-3">
      {chunkedData.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-x-3">
          {row.map((item) => (
            <CollectionCard key={item.id} item={item} />
          ))}
        </View>
      ))}
    </View>
  );
}