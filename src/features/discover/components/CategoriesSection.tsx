import React from "react";
import { FlatList } from "react-native";
import {
  TrendingUp,
  Star,
  Ticket,
  CalendarDays,
  LucideIcon,
} from "lucide-react-native";

import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  active?: boolean;
}

const categories: Category[] = [
  {
    id: "1",
    title: "Trending",
    icon: TrendingUp,
    active: true,
  },
  {
    id: "2",
    title: "New Releases",
    icon: Star,
  },
  {
    id: "3",
    title: "Top Creators",
    icon: Star,
  },
  {
    id: "4",
    title: "Experiences",
    icon: Ticket,
  },
  {
    id: "5",
    title: "On Tour",
    icon: CalendarDays,
  },
];

const CategoriesSection: React.FC = () => {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryCard
          title={item.title}
          Icon={item.icon}
          active={item.active}
        />
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 6,
        paddingRight: 20,
      }}
    />
  );
};

export default CategoriesSection;