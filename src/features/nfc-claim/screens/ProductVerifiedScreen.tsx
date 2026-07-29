import React from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Step3ActionCtx from '../components/Step3ActionCtx';
import Step3Features from '../components/Step3Features';
import Step3Header from '../components/Step3Header';
import Step3ProductCard from '../components/Step3ProductCard';
import { VerifiedProductView } from '../types/claim';

interface ProductVerifiedScreenProps {
    product: VerifiedProductView;
    /** Fires POST /claims/:tagId/confirm — the claim + ledger write. */
    onClaim: () => void;
    isClaiming?: boolean;
    signedIn?: boolean;
    /** Message from a failed claim attempt. */
    claimError?: string | null;
}

/**
 * Shown **only** when the tapped tag verified successfully AND the product is
 * still UNCLAIMED. Every other outcome (unregistered tag, already claimed,
 * server error) is handled by `ClaimScreen`, which owns those states.
 *
 * Purely presentational: nothing is claimed until `onClaim` is pressed.
 */
export default function ProductVerifiedScreen({
    product,
    onClaim,
    isClaiming = false,
    signedIn = true,
    claimError = null,
}: ProductVerifiedScreenProps) {
    return (
        <View className="flex-1 bg-background">
            {/* Background Graphic pattern for depth */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }}
                className="absolute inset-0 opacity-20 justify-end"
                resizeMode="cover"
            />

            <SafeAreaView className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                >
                    {/* Hero Header Section */}
                    <Step3Header />

                    {/* Main Showcase Product Card Layout */}
                    <Step3ProductCard product={product} />

                    {/* Core Feature Matrix Grid */}
                    <Step3Features />

                    {claimError && (
                        <Text className="text-red-400 text-sm text-center mb-4">{claimError}</Text>
                    )}

                    {/* Primary Call to Actions Area */}
                    <Step3ActionCtx
                        onClaim={onClaim}
                        isClaiming={isClaiming}
                        signedIn={signedIn}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
