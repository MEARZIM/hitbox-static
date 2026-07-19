import CategoryCard from '@/features/discover/components/CategoryCard';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { MarketplaceCategory } from '../types/marketplace';

/** 'all' is a screen-only tab — it maps to omitting `category` in the API call. */
export type CategoryTabId = MarketplaceCategory | 'all'

interface CategoriesProps {
    CATEGORIES: {
        id: CategoryTabId
        icon: React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
        label: string
    }[]
    activeCategory: CategoryTabId
    onCategoryChange: (id: CategoryTabId) => void
}

export default function CategorySection({ CATEGORIES, activeCategory, onCategoryChange }: CategoriesProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4 mb-6"
            contentContainerStyle={{ paddingRight: 24 }}
        >
            {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <CategoryCard
                        key={cat.id}
                        title={cat.label}
                        Icon={cat.icon}
                        active={isActive}
                        onPress={() => onCategoryChange(cat.id)}
                    />
                );
            })}
        </ScrollView>
    )
}
