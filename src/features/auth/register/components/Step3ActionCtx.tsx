import { router } from 'expo-router'
import { Lock } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { AnimatedButton } from './AnimatedButton'


export default function Step3ActionCtx() {
    return (

        <View className="gap-y-4 items-center">
            <AnimatedButton
                className="bg-primary h-14 w-full rounded-2xl items-center justify-center flex-row gap-x-2.5 shadow-lg shadow-primary/20"
                onPress={() => router.push('/(auth)/register/step4')}
            >
                <Lock size={28} color="#fff" />
                <View className="items-center">
                    <Text className="text-white font-bold text-[15px]">Claim My Item</Text>
                    <Text className="text-white/70 text-[10px] mt-0.5">Add this item to my collection</Text>
                </View>
            </AnimatedButton>

            <TouchableOpacity className="py-2 active:opacity-70" onPress={() => router.push('/(tabs)/collections')}>
                <Text className="text-primary font-semibold text-sm">I'll do this later</Text>
            </TouchableOpacity>
        </View>
    )
}