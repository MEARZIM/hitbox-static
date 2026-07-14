import {
    ArrowRight,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MainHeader from "@/components/mainHeader";
import MainSearchBar from "@/components/mainsearch";
import ReleaseCard from "../../../features/discover/components/ReleaseCard";
import TrendingCard from "../../../features/discover/components/TrendingCard";
import CategoriesSection from "../components/CategoriesSection";
import HeroBanner from "../components/HeroBanner";
import CreatorsCard from "../components/SingleCreatorCard";
import { creatorsData } from "../data/creatorsData";
import { releaseData } from "../data/releaseData";
import { trendingData } from "../data/trendingData";


export default function DiscoverScreen() {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState("");


    return (
        <View className="flex-1 bg-black ">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom + 24,
                }}
            >
                <MainHeader
                    title="Discover"
                    subtitle="Explore collections, creators and exclusive experiences."
                    notificationCount={3}
                    onNotificationPress={() => console.log("Notifications")}
                    classname='py-2 mx-4'
                />

                {/* Search Bar */}
                <MainSearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search artists, albums..."
                    onVoicePress={() => console.log("Voice")}
                    classname="my-2"
                />

                <View className="mt-5 mx-4 flex-row items-center justify-between">
                    <CategoriesSection />
                </View>

                {/* HERO SECTION */}
                <HeroBanner />


                <View className="mt-8 flex-row items-center justify-between mx-4">
                    <Text className="text-2xl font-bold text-white">
                        Trending Now
                    </Text>

                    <TouchableOpacity className="flex-row items-center">
                        <Text className="mr-1 font-semibold text-violet-500">
                            See All
                        </Text>

                        <ArrowRight
                            size={18}
                            color="#8B5CF6"
                        />
                    </TouchableOpacity>
                </View>
                <View className="mt-4 mx-4">
                    <FlatList
                        horizontal
                        data={trendingData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <TrendingCard
                                item={item}
                                index={index + 1}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View className="mt-8 flex-row items-center justify-between mx-4">
                    <Text className="text-2xl font-bold text-white">
                        Top Creators
                    </Text>

                    <TouchableOpacity className="flex-row items-center">
                        <Text className="mr-1 font-semibold text-violet-500">
                            See All
                        </Text>

                        <ArrowRight
                            size={18}
                            color="#8B5CF6"
                        />
                    </TouchableOpacity>
                </View>
                {/* Categories */}
                {/* <CategoryList /> */}

                {/* Trending */}
                {/* <TrendingSection /> */}

                <View className="mt-4 mx-4">
                    <FlatList
                        horizontal
                        data={creatorsData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CreatorsCard item={item} />
                        )}
                        ItemSeparatorComponent={() => <View className="w-4" />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View className="mt-8 flex-row items-center justify-between mx-4">
                    <Text className="text-2xl font-bold text-white">
                        Latest Releases
                    </Text>

                    <TouchableOpacity className="flex-row items-center">
                        <Text className="mr-1 font-semibold text-violet-500">
                            See All
                        </Text>

                        <ArrowRight
                            size={18}
                            color="#8B5CF6"
                        />
                    </TouchableOpacity>
                </View>

                <View className="mt-8 mx-4">
                    <FlatList
                        horizontal
                        data={releaseData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ReleaseCard item={item} />
                        )}
                        ItemSeparatorComponent={() => <View className="w-4" />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

            </ScrollView>

        </View>
    );
}