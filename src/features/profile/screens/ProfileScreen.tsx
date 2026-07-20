import { useClerk } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
    ChevronRight
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MainHeader from '@/components/mainHeader';
import CollectionSection from '../components/CollectionSection';
import StatsCard from '../components/StatsCard';
import UserHeroSection from '../components/UserHeroSection';
import VipBannerCard from '../components/VipBannerCard';

export default function ProfileScreen() {
    const { signOut } = useClerk();
    const queryClient = useQueryClient();

    const handleSignOut = async () => {
        await signOut();
        queryClient.clear(); // drop cached user data for the next account
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER BAR */}
                <MainHeader 
                title='Profile' className='px-4 py-2' />

                {/* USER HERO SECTION */}
                <UserHeroSection />

                {/* STATS COUNT GRID */}
                <StatsCard />


                {/* VIP BANNER */}
                <VipBannerCard />


                {/* COLLECTION HIGHLIGHTS CONTAINER */}
                <CollectionSection
                    data={collections}
                    onViewCollection={() => console.log("View Collection")}
                />

                {/* ACCOUNT LIST SECTION */}
                {/* <View className="mt-6 mb-10 px-4">
                    <Text className="text-foreground text-lg font-bold mb-3">Account</Text>
                    <View className="bg-card border border-border/30 rounded-2xl overflow-hidden">

                        <AccountRow icon={<User size={20} color="#94a3b8" />} title="Personal Information" subtitle="Update your profile and personal details" />
                        <AccountRow icon={<Lock size={20} color="#94a3b8" />} title="Security" subtitle="Password, 2FA, and account security" />
                        <AccountRow icon={<Wallet size={20} color="#94a3b8" />} title="Connected Wallet" subtitle="Manage your blockchain wallet" />
                        <AccountRow icon={<Bell size={20} color="#94a3b8" />} title="Notifications" subtitle="Manage your notification preferences" />
                        <AccountRow icon={<ShieldAlert size={20} color="#94a3b8" />} title="Privacy & Data" subtitle="Privacy settings and data management" />
                        <AccountRow icon={<HelpCircle size={20} color="#94a3b8" />} title="Help & Support" subtitle="Get help and contact support" />
                        <AccountRow icon={<LogOut size={20} color="#f87171" />} title="Sign Out" subtitle="Log out of your HitBox account" isLast onPress={handleSignOut} />

                    </View>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

function AccountRow({ icon, title, subtitle, isLast = false, onPress }: { icon: React.ReactNode, title: string, subtitle: string, isLast?: boolean, onPress?: () => void }) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-border/30' : ''}`}
        >
            <View className="flex-row items-center gap-4 flex-1 pr-2">
                {icon}
                <View className="gap-0.5 flex-1">
                    <Text className="text-foreground text-sm font-semibold">{title}</Text>
                    <Text className="text-muted-foreground text-xs" numberOfLines={1}>{subtitle}</Text>
                </View>
            </View>
            <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
    )
}

const collections = [
    {
        id: "1",
        title: "Pierce The Veil",
        image:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200",
        count: 18,
    },
    {
        id: "2",
        title: "Warped Tour 2026",
        image:
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200",
        count: 11,
    },
    {
        id: "3",
        title: "PTV Funko Pop!",
        image:
            "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=200",
        count: 3,
    },
    {
        id: "4",
        title: "blink-182",
        image:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=200",
        count: 5,
    },
];

