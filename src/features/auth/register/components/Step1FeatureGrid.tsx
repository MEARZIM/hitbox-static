import { BarChart3, Box, Gift, Ticket } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

export default function Step1FeatureGrid() {
    return (
        <View>
            <Text className="text-neutral-400 text-xs font-semibold mb-3">What you can do:</Text>

            <View className="flex-row flex-wrap justify-between mb-8">
                {/* Feature 1 */}
                <View className="w-[23%] items-center mb-4">
                    <View className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl mb-1.5">
                        <Box size={18} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Claim Ownership</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Make this item uniquely yours</Text>
                </View>

                {/* Feature 2 */}
                <View className="w-[23%] items-center mb-4">
                    <View className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl mb-1.5">
                        <Gift size={18} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Unlock Rewards</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Access exclusive rewards & drops</Text>
                </View>

                {/* Feature 3 */}
                <View className="w-[23%] items-center mb-4">
                    <View className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl mb-1.5">
                        <Ticket size={18} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Exclusive Access</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Get access to events & presales</Text>
                </View>

                {/* Feature 4 */}
                <View className="w-[23%] items-center mb-4">
                    <View className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl mb-1.5">
                        <BarChart3 size={18} color="#a855f7" />
                    </View>
                    <Text className="text-white text-[10px] font-bold text-center leading-3">Track & Manage</Text>
                    <Text className="text-neutral-500 text-[8px] text-center mt-1 leading-3">Manage your collection & history</Text>
                </View>
            </View>
        </View>
    )
}