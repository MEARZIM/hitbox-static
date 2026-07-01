import { ShieldCheck } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step3Header() {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="items-center mt-2 mb-6"
        >
            <View className="bg-primary/10 p-1.5 rounded-full mb-2">
                <ShieldCheck size={20} color="#a855f7" />
            </View>
            <Text className="text-white text-3xl font-black tracking-tight text-center">
                Claim Your <Text className="text-primary">Item</Text>
            </Text>
            <Text className="text-neutral-400 text-center text-sm mt-2 px-6 leading-5">
                This item is ready to be added to your collection. Once claimed, it's officially yours.
            </Text>
        </MotiView>
    )
}