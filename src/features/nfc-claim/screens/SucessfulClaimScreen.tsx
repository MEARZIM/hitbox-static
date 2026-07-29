import React, { useRef } from 'react';
import { Dimensions, ImageBackground, ScrollView, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import Step4ActionCtx from '../components/Step4ActionCtx';
import Step4Header from '../components/Step4Header';
import Step4Nav from '../components/Step4Nav';
import Step4ProductBox from '../components/Step4ProductBox';
import { ClaimResult } from '../types/claim';

/**
 * Shown **only** after a successful claim — i.e. `POST /claims/:tagId/confirm`
 * returned `outcome: 'CLAIMED'`. Renders the real claim result (claim code,
 * owner, claimed-at) so nothing here is invented.
 */
export default function SucessfulClaimScreen({ result }: { result?: ClaimResult }) {
    const confettiRef = useRef(null);
    const { width: SCREEN_WIDTH } = Dimensions.get('window');

    return (
        <View className="flex-1 bg-background">
            <ConfettiCannon
                ref={confettiRef}
                count={80}
                origin={{ x: SCREEN_WIDTH / 2, y: -150 }}
                autoStart={true}
                fadeOut={true}
                fallSpeed={2800}
                explosionSpeed={20}
                colors={['#a855f7', '#c084fc', '#e879f9', '#ffffff']}
            />
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
                    <Step4Nav />

                    {/* Confetti Success Header Section */}
                    <Step4Header message={result?.message} />

                    {/* Main Showcase Item Metadata Split Container */}
                    <Step4ProductBox result={result} />

                    {/* Action CTAs Stack */}
                    <Step4ActionCtx />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
