import React from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Step2ActionCtx from '../components/Step2ActionCtx';
import Step2Footer from '../components/Step2Footer';
import Step2Header from '../components/Step2Header';
import Step2Perks from '../components/Step2Perks';

export default function Step2Screen() {
    return (
        <View className="flex-1 bg-background">
            {/* Background Graphic pattern for depth */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }}
                className="absolute inset-0 opacity-20 justify-end"
                resizeMode="cover"
            />

            <SafeAreaView className="flex-1">
                {/* Navigation Indicator Header */}
                {/* <StepProgressHeader currentStep={2} onBackPress={() => router.back()} /> */}

                {/* Step 2 Registration Flow */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                >
                    {/* Logo Title Stack */}
                    <Step2Header />

                    {/* Value Perks Grid */}
                    <Step2Perks />

                    {/* Action CTAs Flow */}
                    <Step2ActionCtx />

                    {/* Footer Area */}
                    <Step2Footer />

                </ScrollView>

            </SafeAreaView>
        </View>
    );
}

