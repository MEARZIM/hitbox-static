import { CreditCard, LayoutGrid, Shirt, Ticket, ToyBrick } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainHeader from '@/components/mainHeader';
import MainSearchBar from '@/components/mainsearch';
import CategorySection from '../components/CategorySection';
import ListingsSection from '../components/ListingsSection';
import PromoBannerSection from '../components/PromoBannerSection';



// --- Mock Data ---
const CATEGORIES = [
    { id: 'all', icon: LayoutGrid, label: 'All Items' },
    { id: 'cards', icon: CreditCard, label: 'Cards' },
    { id: 'figures', icon: ToyBrick, label: 'Figures' },
    { id: 'apparel', icon: Shirt, label: 'Apparel' },
    { id: 'tickets', icon: Ticket, label: 'Tickets' },
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
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdNk8gPXVHoh_q6lkzrCnuwYSoDzrZ3n9QybD3xMjksBqgbV3g3mEcuAiK&s=10',
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

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 24,
                }}
            >
                {/* --- HEADER --- */}
                <MainHeader
                    title='Marketplace'
                    subtitle={" Buy, sell and trade with collectors worldwide."}
                    classname='px-4 py-2'
                />

                {/* --- SEARCH BAR --- */}
                <MainSearchBar />

                {/* --- PROMO BANNER --- */}
                <PromoBannerSection />

                {/* --- CATEGORIES --- */}
                <CategorySection CATEGORIES={CATEGORIES} />

                {/* --- FEATURED LISTINGS --- */}
                <ListingsSection FEATURED_LISTINGS={FEATURED_LISTINGS} />

                {/* --- LIVE AUCTIONS --- */}
                {/* <LiveAuctionSection LIVE_AUCTIONS={LIVE_AUCTIONS} /> */}

            </ScrollView>
        </SafeAreaView>
    );
};

export default MarketPlaceScreen;