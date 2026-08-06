import React from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ForgetPasswordSection from '../components/ForgetPasswordSection';

export default function ForgetPasswordScreen() {
    return (
        <View className="flex-1 bg-background">
            {/* Background Image Overlay */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }}
                className="absolute inset-0 opacity-20"
                resizeMode="cover"
            />

            <SafeAreaView className="flex-1">


                <TouchableOpacity
                    className="p-2 opacity-60"
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>


                <View className="flex-1 justify-center items-center px-6w gap-5">
                    <ForgetPasswordSection />
                </View>
            </SafeAreaView>
        </View>
    );
}