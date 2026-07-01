import { Gift, ShieldCheck, Users } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step2Perks() {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-row bg-neutral-900/60 border border-neutral-800 rounded-3xl p-4 mb-8 justify-between items-start backdrop-blur-md"
        >
            <View className="flex-1 items-center px-1">
                <View className="p-2 bg-primary/10 rounded-full mb-2">
                    <ShieldCheck size={25} color="#a855f7" />
                </View>
                <Text className="text-white text-[12px] font-bold text-center">100% Verified</Text>
                <Text className="text-neutral-500 text-[10px] text-center mt-1 leading-3">Authentic ownership you can trust</Text>
            </View>

            <View className="w-[1px] h-12 bg-neutral-800 self-center" />

            <View className="flex-1 items-center px-1">
                <View className="p-2 bg-primary/10 rounded-full mb-2">
                    <Gift size={25} color="#a855f7" />
                </View>
                <Text className="text-white text-[12px] font-bold text-center">Unlock Rewards</Text>
                <Text className="text-neutral-500 text-[10px] text-center mt-1 leading-3">Access exclusive rewards & drops</Text>
            </View>

            <View className="w-[1px] h-12 bg-neutral-800 self-center" />

            <View className="flex-1 items-center px-1">
                <View className="p-2 bg-primary/10 rounded-full mb-2">
                    <Users size={25} color="#a855f7" />
                </View>
                <Text className="text-white text-[12px] font-bold text-center">Join Community</Text>
                <Text className="text-neutral-500 text-[10px] text-center mt-1 leading-3">Connect with creators & collectors</Text>
            </View>
        </MotiView>
    )
}