import React, { useRef } from 'react';
import { Dimensions, ImageBackground, ScrollView, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import Step4ActionCtx from '../components/Step4ActionCtx';
import Step4Header from '../components/Step4Header';
import Step4ProductBox from '../components/Step4ProductBox';


export default function Step4Screen() {
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
                {/* Navigation Indicator Header */}
                {/* <StepProgressHeader currentStep={4} onBackPress={() => router.back()} /> */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                >

                    {/* Confetti Success Header Section */}
                    <Step4Header />

                    {/* Main Showcase Item Metadata Split Container & Progress Status Bar Widget Box */}
                    <Step4ProductBox />

                    {/* Action CTAs Stack */}
                    <Step4ActionCtx />

                </ScrollView>
            </SafeAreaView>


        </View>
    );
}