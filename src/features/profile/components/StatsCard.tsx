import { Box, Gem, Layers, Ticket } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

export default function StatsCard() {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 100 }}
            className="mx-4 mt-6 bg-card rounded-2xl p-4 flex-row justify-around border border-border/30"
        >
            <View className="items-center flex-1 border-r border-border/40">
                <Box size={20} color="#94a3b8" />
                <Text className="text-foreground text-xl font-bold mt-2">42</Text>
                <Text className="text-muted-foreground text-[11px] mt-0.5">Items Owned</Text>
            </View>
            <View className="items-center flex-1 border-r border-border/40">
                <Layers size={20} color="#94a3b8" />
                <Text className="text-foreground text-xl font-bold mt-2">8</Text>
                <Text className="text-muted-foreground text-[11px] mt-0.5">Collections</Text>
            </View>
            <View className="items-center flex-1 border-r border-border/40">
                <Ticket size={20} color="#94a3b8" />
                <Text className="text-foreground text-xl font-bold mt-2">5</Text>
                <Text className="text-muted-foreground text-[11px] mt-0.5">Experiences</Text>
            </View>
            <View className="items-center flex-1">
                <Gem size={20} color="#94a3b8" />
                <Text className="text-foreground text-xl font-bold mt-2">650</Text>
                <Text className="text-muted-foreground text-[11px] mt-0.5">Rewards Earned</Text>
            </View>
        </MotiView>
    )
}
