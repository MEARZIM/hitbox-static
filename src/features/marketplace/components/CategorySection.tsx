import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

interface CategoriesProps {
    CATEGORIES: {
        id: string
        label: string
    }[]
}

export default function CategorySection(CATEGORIES: CategoriesProps) {
    const [activeCategory, setActiveCategory] = React.useState('all');

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4 mb-6"
            contentContainerStyle={{ paddingRight: 24 }}
        >
            {CATEGORIES.CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <Pressable
                        key={cat.id}
                        onPress={() => setActiveCategory(cat.id)}
                        className={`mr-2.5 px-4 h-9 rounded-full flex-row items-center border ${isActive
                            ? 'bg-primary border-primary'
                            : 'bg-secondary border-border'
                            }`}
                    >
                        <Text className={`text-xs font-semibold ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                            {cat.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    )
}
