import { router } from 'expo-router';
import { MotiView, useAnimationState } from 'moti';
import React from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Step3ActionCtx from '../components/Step3ActionCtx';
import Step3Features from '../components/Step3Features';
import Step3Header from '../components/Step3Header';
import Step3ProductCard from '../components/Step3ProductCard';
import StepProgressHeader from '../components/StepProgressHeader';

const PremiumButton = ({
  children,
  onPress,
  className = ""
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}) => {
  const pressState = useAnimationState({
    from: { scale: 1 },
    pressed: { scale: 0.96 },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => pressState.transitionTo('pressed')}
      onPressOut={() => pressState.transitionTo('from')}
      style={{ width: '100%' }}
    >
      <MotiView
        state={pressState}
        transition={{ type: 'timing', duration: 100 }}
        className={className}
      >
        {children}
      </MotiView>
    </Pressable>
  );
};

export default function Step3Screen() {
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
        <StepProgressHeader currentStep={3} onBackPress={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >

          {/* Hero Header Section */}
          <Step3Header />

          {/* Main Showcase Product Card Layout */}
          <Step3ProductCard />

          {/* Core Feature Matrix Grid */}
          <Step3Features />

          {/* Primary Call to Actions Area */}
          <Step3ActionCtx />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}