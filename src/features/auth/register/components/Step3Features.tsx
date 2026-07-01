import { BarChart3, Box, Gift, Lock, ShieldCheck } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step3Features() {
    return (
        <View>
            <Text className="text-neutral-400 text-xs font-semibold mb-3">What happens when you claim?</Text>
            <View className="flex-row justify-between mb-5">
                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <Box size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Add to Collection</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">This item will be added to your library</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <Gift size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Unlock Benefits</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Access rewards and exclusive content</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <ShieldCheck size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Prove Ownership</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Your signature is secure & permanent</Text>
                </View>

                <View className="w-[23%] items-center">
                    <View className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-1.5">
                        <BarChart3 size={16} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Track & Manage</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">View item history and metrics</Text>
                </View>
            </View>
            {/* Security Banner Notification */}
            <View className="flex-row items-center gap-x-3 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-4 mb-6">
                <View className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                    <Lock size={18} color="#a1a1aa" />
                </View>
                <View className="flex-1">
                    <Text className="text-white text-xs font-bold">Secure & Permanent</Text>
                    <Text className="text-neutral-500 text-[11px] mt-0.5 leading-4">
                        Once claimed, this item is permanently tied to your account and proof of ownership is immutable.
                    </Text>
                </View>
            </View>
        </View>
    )
}