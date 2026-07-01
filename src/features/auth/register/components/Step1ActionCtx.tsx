import { router } from 'expo-router'
import { Keyboard, Nfc } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { AnimatedButton } from './AnimatedButton'

export default function Step1ActionCtx() {
    return (
        <View className="gap-y-3">
            {/* Primary Action Button (Continue with Scan) */}
            <AnimatedButton
                className="bg-primary h-14 rounded-2xl px-5 flex-row items-center justify-between shadow-lg shadow-primary/20"
                onPress={() => router.push('/(auth)/register/step2')}
            >
                <View className="flex-row items-center gap-x-3">
                    <Nfc size={22} color="#fff" />
                    <View>
                        <Text className="text-white font-bold text-[15px]">Continue with Tap</Text>
                        <Text className="text-white/70 text-[11px] mt-0.5">Verify and view item details</Text>
                    </View>
                </View>
            </AnimatedButton>

            {/* Secondary Action Button (Enter Code Manually) */}
            <AnimatedButton className="bg-neutral-900/80 border border-neutral-800 h-14 rounded-2xl px-5 flex-row items-center">
                <View className="flex-row items-center gap-x-3">
                    <Keyboard size={22} color="#fff" />
                    <View>
                        <Text className="text-white font-bold text-[15px]">Enter Code Manually</Text>
                        <Text className="text-neutral-500 text-[11px] mt-0.5">Have a code? Enter it here</Text>
                    </View>
                </View>
            </AnimatedButton>
        </View>
    )
}