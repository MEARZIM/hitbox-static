import CategoryCard from '@/features/discover/components/CategoryCard';
import { LucideProps } from 'lucide-react-native';
import React from 'react';
import { ScrollView, } from 'react-native';

interface CategoriesProps {
    CATEGORIES: {
        id: string
        icon: React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
        label: string
    }[]
}

export default function CategorySection({ CATEGORIES }: CategoriesProps) {
    const [activeCategory, setActiveCategory] = React.useState('all');

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
                        onPress={() => setActiveCategory(cat.id)}
                    />
                );
            })}
        </ScrollView>
    )
}
