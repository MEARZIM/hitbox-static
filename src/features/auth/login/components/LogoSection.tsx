import React from 'react'
import { Text, View } from 'react-native'

export default function LogoSection() {
    return (
        <View className="items-center mt-6">
            <Text className="text-white text-3xl font-black tracking-widest uppercase">
                HIT<Text className="text-primary">B★X</Text>
            </Text>

            <Text className="text-white text-2xl font-bold mt-6 text-center">
                Welcome back
            </Text>

            <Text className="text-neutral-400 text-sm mt-2 text-center px-4">
                Sign in to your account to access your collection, track items, and explore exclusive experiences.
            </Text>
        </View>
    )
}