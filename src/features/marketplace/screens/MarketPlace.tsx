import { Search, ShoppingCart, SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategorySection from '../components/CategorySection';
import ListingsSection from '../components/ListingsSection';
import LiveAuctionSection from '../components/LiveAuctionsSection';
import PromoBannerSection from '../components/PromoBannerSection';



// --- Mock Data ---
const CATEGORIES = [
    { id: 'all', label: 'All Items' },
    { id: 'cards', label: 'Cards' },
    { id: 'figures', label: 'Figures' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'tickets', label: 'Tickets' },
];

const FEATURED_LISTINGS = [
    {
        id: '1',
        tag: 'HOT',
        title: 'Warped Tour 2026',
        subtitle: 'VIP Laminate',
        price: '1,250',
        bids: '12 bids',
        time: '2h 15m',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60',
    },
    {
        id: '2',
        tag: 'NEW',
        title: 'PTV Funko Pop! #02',
        subtitle: 'Pierce The Veil',
        price: '850',
        bids: '7 bids',
        time: '5h 32m',
        image: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400&auto=format&fit=crop&q=60',
    },
    {
        id: '3',
        tag: 'RARE',
        title: 'Pierce The Veil',
        subtitle: 'Signature Series Card',
        price: '3,200',
        bids: '18 bids',
        time: '1d 6h',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=60',
    }
];

const LIVE_AUCTIONS = [
    {
        id: '1',
        title: 'Sleeping With Sirens',
        subtitle: 'Complete Collection',
        price: '1,450',
        bids: '12 bids',
        timeLeft: '02h\n21m\nLeft',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=60',
    },
    {
        id: '2',
        title: 'Warped Tour 2026',
        subtitle: 'Backstage Pass',
        price: '750',
        bids: '8 bids',
        timeLeft: '05h\n47m\nLeft',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=60',
    }
];

const MarketPlaceScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            className="bg-background flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
        >
            {/* --- HEADER --- */}
            <View className="px-4 flex-row justify-between items-start mb-1">
                <View>
                    <Text className="text-foreground text-3xl font-black tracking-tight">Marketplace</Text>
                    <Text className="text-muted-foreground text-sm mt-0.5">Buy, sell, and trade with collectors worldwide.</Text>
                </View>

                <View className="flex-row gap-2">
                    <Pressable className="w-11 h-11 bg-secondary border border-border rounded-full justify-center items-center relative active:opacity-70">
                        <ShoppingCart color="white" size={20} />
                        <View className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full justify-center items-center border-2 border-background">
                            <Text className="text-[10px] text-primary-foreground font-bold">2</Text>
                        </View>
                    </Pressable>
                    <Pressable className="w-11 h-11 bg-secondary border border-border rounded-full justify-center items-center active:opacity-70">
                        <SlidersHorizontal color="white" size={18} />
                    </Pressable>
                </View>
            </View>

            {/* --- SEARCH BAR --- */}
            <View className="px-4 my-4">
                <View className="bg-input border border-border rounded-xl flex-row items-center px-3.5 h-12">
                    <Search color="#94a3b8" size={18} className="mr-2" />
                    <TextInput
                        placeholder="Search items, collections, or users"
                        placeholderTextColor="#94a3b8"
                        className="text-foreground flex-1 text-sm h-full"
                    />
                </View>
            </View>

            {/* --- PROMO BANNER --- */}
            <PromoBannerSection />

            {/* --- CATEGORIES --- */}
            <CategorySection CATEGORIES={CATEGORIES} />

            {/* --- FEATURED LISTINGS --- */}
            <ListingsSection FEATURED_LISTINGS={FEATURED_LISTINGS} />

            {/* --- LIVE AUCTIONS --- */}
            <LiveAuctionSection LIVE_AUCTIONS={LIVE_AUCTIONS} />

        </ScrollView>
    );
};

export default MarketPlaceScreen;