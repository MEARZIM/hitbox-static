import {
  CalendarDays,
  LucideIcon,
  Star,
  Ticket,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";

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
  const [activeCategory, setActiveCategory] = React.useState('1');

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isActive = activeCategory === item.id;
        return (
          <CategoryCard
            title={item.title}
            Icon={item.icon}
            active={isActive}
            onPress={() => setActiveCategory(item.id)}
          />
        );
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 6,
        paddingHorizontal: 16,
      }}
    />
  );
};

export default CategoriesSection;