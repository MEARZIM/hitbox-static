import { Calendar, CheckCircle2, ChevronRight, Gem } from 'lucide-react-native'
import { MotiText, MotiView } from 'moti'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Text } from '@/components/ui/text'

export default function UserHeroSection() {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 450 }}
            className="grid grid-cols-3 items-center gap-2 px-4 py-3 bg-background w-full"
        >
            {/* LEFT SIDE: AVATAR & USER INFO (Occupies 2 out of 3 columns) */}
            <View className="col-span-2 flex-row items-center gap-4">
                <MotiView
                    from={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="p-[3px] rounded-full border-2 border-primary shadow-lg shadow-primary/30"
                >
                    <Avatar className="w-20 h-20 border border-black/40" alt={'Profile'}>
                        <AvatarImage
                            source={{ uri: 'https://github.com/leerob.png' }}
                            className='w-full h-full'
                        />
                        <AvatarFallback>
                            <Text className="text-white font-bold text-lg">AM</Text>
                        </AvatarFallback>
                    </Avatar>
                </MotiView>

                {/* TEXT DETAILS */}
                <View className="gap-1 flex-1">
                    <View className="flex-row items-center gap-1.5 flex-wrap">
                        <Text className="text-foreground text-xl font-bold tracking-tight">
                            Alex Mercer
                        </Text>
                        <CheckCircle2 size={18} color="#ffffff" fill="#6d28d9" className="mt-0.5" />
                    </View>

                    <Text className="text-muted-foreground text-sm font-medium">
                        @alexmercer
                    </Text>

                    {/* Comment out Collector Level Badge for Demo */}
                    {/* <Badge
                        variant="secondary"
                        className="flex-row items-center gap-1.5 bg-secondary border border-border/10 px-2.5 py-1 rounded-lg self-start mt-0.5"
                    >
                        <ShieldCheck size={14} color="#6d28d9" />
                        <Text className="text-foreground text-xs font-semibold">
                            Collector Level 4
                        </Text>
                    </Badge> */}

                    {/* Join Date Row */}
                    <View className="flex-row items-center gap-1 mt-1">
                        <Calendar size={12} color="#94a3b8" />
                        <Text className="text-muted-foreground text-[11px] font-medium">
                            Member since May 18, 2024
                        </Text>
                    </View>
                </View>
            </View>

            {/* RIGHT SIDE: HIT POINTS BOX (Occupies 1 out of 3 columns) */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 150 }}
                className='col-span-1'
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="bg-card border border-border/30 p-3 rounded-xl flex-row items-center justify-between gap-1 w-full shadow-sm shadow-black/50"
                >
                    <View className="items-start gap-0.5">
                        <View className="flex-row items-center gap-1">
                            <Gem size={12} color="#6d28d9" />
                            <Text className="text-muted-foreground text-xs font-bold tracking-wider uppercase" numberOfLines={1}>
                                HIT Points
                            </Text>
                        </View>
                        <MotiText
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 350 }}
                            className="text-foreground text-lg font-black tracking-tight"
                        >
                            2,450
                        </MotiText>
                    </View>
                    <ChevronRight size={14} color="#475569" className="mt-3" />
                </TouchableOpacity>
            </MotiView>
        </MotiView>
    )
}