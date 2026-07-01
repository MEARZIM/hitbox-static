import { HelpCircle } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Step1Nav() {
    return (
        <View className="px-6 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <Text className="text-white text-2xl font-black tracking-widest uppercase">
                    HIT<Text className="text-primary">B★X</Text>
                </Text>
            </View>
            <TouchableOpacity className="flex-row items-center gap-x-1.5 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
                <HelpCircle size={16} color="#a1a1aa" />
                <Text className="text-neutral-300 text-xs font-semibold">Help</Text>
            </TouchableOpacity>
        </View>
    )
}