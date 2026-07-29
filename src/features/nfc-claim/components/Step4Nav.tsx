import { HelpCircle } from 'lucide-react-native'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Step4Nav() {
    return (
        <View className="px-2 py-3 flex-row items-center justify-between">

            <Image
                source={require("@/assets/images/HitBoxLogo.png")}
                resizeMode="contain"
                style={{
                    width: 40,
                    height: 40,
                }}
            />

            <TouchableOpacity className="hidden items-center gap-x-1.5 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
                <HelpCircle size={16} color="#a1a1aa" />
                <Text className="text-neutral-300 text-xs font-semibold">Help</Text>
            </TouchableOpacity>
        </View>
    )
}