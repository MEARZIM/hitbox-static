import { ShieldCheck } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step2Hero() {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            className="items-center mt-4 mb-6"
        >
            <View className="bg-primary/10 p-2 rounded-full mb-3 border border-primary/20">
                <ShieldCheck size={20} color="#a855f7" />
            </View>
            <Text className="text-white text-base font-bold uppercase tracking-wider text-center">
                You found something
            </Text>
            <Text className="text-primary text-4xl font-black tracking-tighter uppercase text-center mt-1">
                EXTRAORDINARY
            </Text>
            <Text className="text-neutral-400 text-center text-sm mt-3 px-2 leading-5 font-medium">
                This item is part of the HitBox ecosystem. Scan to verify, claim ownership, unlock exclusive experiences, and more.
            </Text>
        </MotiView>
    )
}