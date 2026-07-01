import React from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Step1ActionCtx from '../components/Step1ActionCtx';
import Step1FeatureGrid from '../components/Step1FeatureGrid';
import Step1Hero from '../components/Step1Hero';
import Step1Nav from '../components/Step1Nav';
import Step1ProductBox from '../components/Step1ProductBox';

export default function Step1Screen() {
  return (
    <View className="flex-1 bg-background">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }}
        className="absolute inset-0 opacity-20 justify-end"
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1">
        {/* Top Sticky Navigation Bar */}
        <Step1Nav />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >
          {/* Main Hero Typography */}
          <Step1Hero />

          {/* Product Box &  Authenticity Certificate Widget*/}
          <Step1ProductBox />


          {/* Action/Features Grid section */}
          <Step1FeatureGrid />


          {/* Interactive Button CTA Actions Stack */}
          <Step1ActionCtx />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}