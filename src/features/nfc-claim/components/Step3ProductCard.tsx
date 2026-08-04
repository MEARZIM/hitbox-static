import { Award, Hash, Layers, ShieldCheck, Star, Tag } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

import { VerifiedProductView } from '../types/claim'

const PLACEHOLDER =
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop'

/** The verified, unclaimed product — rendered from the live verify + product reads. */
export default function Step3ProductCard({ product }: { product: VerifiedProductView }) {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 150 }}
            className="flex-row bg-neutral-950/40 border border-neutral-900 rounded-3xl p-4 mb-6 backdrop-blur-md"
        >
            {/* Left side: Product Image Box */}
            <View className="w-[42%] aspect-[9/16] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden justify-end items-center relative">
                <ImageBackground
                    source={{ uri: product.imageUrl ?? PLACEHOLDER }}
                    className="absolute inset-0 justify-end p-3"
                    imageStyle={{ opacity: product.imageUrl ? 1 : 0.5 }}
                    resizeMode="cover"
                />
                <View className="absolute top-2 left-2 flex-row justify-between w-full pr-4">
                    <Text className="text-[7px] font-black text-white tracking-widest">HITBOX</Text>
                    <View className="w-2 h-2 bg-white/20 rounded-sm" />
                </View>

                <View className="items-center pb-4 z-15 px-2">
                    <Text
                        className="text-white text-sm font-black italic tracking-tighter text-center leading-4"
                        numberOfLines={3}
                    >
                        {product.name.toUpperCase()}
                    </Text>
                </View>

                <View className="absolute bottom-1.5 items-center w-full px-2">
                    <Text
                        className="text-neutral-400 text-[6px] font-bold uppercase tracking-widest"
                        numberOfLines={1}
                    >
                        {product.productCode}
                    </Text>
                </View>
            </View>

            {/* Right side: Detailed Metadata Parameters */}
            <View className="flex-1 pl-4 justify-between py-1">
                <View className="mt-1">
                    <Text
                        className="text-white text-lg font-black tracking-tight leading-5"
                        numberOfLines={2}
                    >
                        {product.name}
                    </Text>
                    {product.priceInDollars && (
                        <Text className="text-primary text-xs font-bold mt-0.5">
                            ${product.priceInDollars}
                        </Text>
                    )}
                </View>

                {/* Specs Table List */}
                <View className="gap-y-2 mt-3">
                    <Spec icon={<Tag size={12} color="#737373" />} label="Product Code">
                        <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                            {product.productCode}
                        </Text>
                    </Spec>

                    <Spec icon={<Hash size={12} color="#737373" />} label="NFC Tag">
                        <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                            {product.tagId}
                        </Text>
                    </Spec>

                    {product.rarity && (
                        <Spec icon={<Star size={12} color="#737373" />} label="Rarity">
                            <Text className="text-primary text-xs font-bold">{product.rarity}</Text>
                        </Spec>
                    )}

                    {product.rewardPoints != null && product.rewardPoints > 0 && (
                        <Spec icon={<Award size={12} color="#737373" />} label="Reward Points">
                            <Text className="text-primary text-xs font-bold">
                                +{product.rewardPoints.toLocaleString('en-US')}
                            </Text>
                        </Spec>
                    )}

                    <Spec icon={<ShieldCheck size={12} color="#737373" />} label="Verification">
                        <Text className="text-emerald-500 text-xs font-bold">Authentic</Text>
                    </Spec>

                    {product.ledgerLength != null && (
                        <Spec icon={<Layers size={12} color="#737373" />} label="Ledger">
                            <Text className="text-white text-xs font-semibold">
                                {product.ledgerLength} record{product.ledgerLength === 1 ? '' : 's'}
                            </Text>
                        </Spec>
                    )}
                </View>
            </View>
        </MotiView>
    )
}

function Spec({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode
    label: string
    children: React.ReactNode
}) {
    return (
        <View className="flex-row justify-between items-center gap-x-2">
            <View className="flex-row items-center gap-x-1.5 shrink-0">
                {icon}
                <Text className="text-neutral-400 text-xs">{label}</Text>
            </View>
            <View className="flex-1 items-end">{children}</View>
        </View>
    )
}
