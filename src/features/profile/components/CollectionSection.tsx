import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CollectionItem = {
    id: string;
    title: string;
    image: string;
    count: number;
};

type CollectionSectionProps = {
    title?: string;
    buttonText?: string;
    data: CollectionItem[];
    onViewCollection?: () => void;
};

export default function CollectionSection({
    title = "My Collection Highlights",
    buttonText = "View Collection",
    data,
    onViewCollection,
}: CollectionSectionProps) {
    return (
        <View className="mt-6 ">
            <View className="flex-row justify-between items-center px-4 mb-3">
                <Text className="text-foreground text-lg font-bold">{title}</Text>

                <TouchableOpacity
                    className="flex-row items-center gap-0.5"
                    onPress={onViewCollection}
                >
                    <Text className="text-primary text-sm font-semibold">
                        {buttonText}
                    </Text>
                    <ChevronRight size={14} color="#6d28d9" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                snapToInterval={140}
                decelerationRate="fast"
            >
                {data.map((item) => (
                    <View
                        key={item.id}
                        className="w-32 mr-3 shrink-0 bg-card border border-primary rounded-xl overflow-hidden p-1.5"
                    >
                        <View className="relative">
                            <Image
                                source={{ uri: item.image }}
                                className="w-full h-32 rounded-lg"
                                style={{ width: "100%", height: 128 }}
                            />

                            <View className="absolute top-1 right-1 bg-primary px-1.5 py-0.5 rounded-md">
                                <Text className="text-white text-[10px] font-bold">
                                    {item.count}
                                </Text>
                            </View>
                        </View>

                        <Text
                            className="text-foreground text-center text-xs font-semibold mt-2 px-1"
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}