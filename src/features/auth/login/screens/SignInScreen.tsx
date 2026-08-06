import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthActionCtx from '../components/AuthActionCtx';
import LoginFooter from '../components/LoginFooter';
import LogoSection from '../components/LogoSection';

export default function SignInScreen() {
    return (
        <View className="flex-1 bg-background ">
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }}
                className="absolute inset-0 opacity-20 justify-end"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1">

                {/* Header */}
                <TouchableOpacity
                    className="p-2 opacity-60"
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: 40,
                        marginTop: 25
                    }}
                >
                    {/* Top LOGO Section */}
                    <LogoSection />

                    {/* Auth Provider Buttons Container */}
                    <AuthActionCtx />

                    {/* Bottom Footer Section */}
                    <LoginFooter />
                </ScrollView>
            </SafeAreaView>

        </View>
    );
}