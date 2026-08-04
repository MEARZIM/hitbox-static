import { Check } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step4Header({ message }: { message?: string }) {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="items-center mt-2 mb-6"
        >
            <View className="bg-primary p-3 rounded-full mb-3 border-4 border-primary/20 shadow-lg shadow-primary/50">
                <Check size={26} color="#fff" strokeWidth={3} />
            </View>
            <Text className="text-white text-3xl font-black tracking-tight text-center">
                You Did It!{'\n'}Item <Text className="text-primary">Claimed</Text>
            </Text>
            <Text className="text-neutral-400 text-center text-xs mt-2 px-6 leading-5">
                {message ?? 'This item is now part of your HitBox collection.'}
            </Text>
        </MotiView>
    )
}