import { router } from 'expo-router'
import { Lock } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { AnimatedButton } from '../../auth/register/components/AnimatedButton'

interface Step3ActionCtxProps {
    /** Fires the claim (POST /claims/:tagId/confirm) — nothing is claimed before this. */
    onClaim: () => void
    isClaiming?: boolean
    /** False when signed out — the button asks for sign-in first. */
    signedIn?: boolean
}

export default function Step3ActionCtx({
    onClaim,
    isClaiming = false,
    signedIn = true,
}: Step3ActionCtxProps) {
    return (
        <View className="gap-y-4 items-center">
            <AnimatedButton
                className="bg-primary h-14 w-full rounded-2xl items-center justify-center flex-row gap-x-2.5 shadow-lg shadow-primary/20"
                onPress={isClaiming ? undefined : onClaim}
            >
                {isClaiming ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Lock size={28} color="#fff" />
                        <View className="items-center">
                            <Text className="text-white font-bold text-[15px]">Claim My Item</Text>
                            <Text className="text-white/70 text-[10px] mt-0.5">
                                {signedIn ? 'Add this item to my collection' : 'Sign in to claim this item'}
                            </Text>
                        </View>
                    </>
                )}
            </AnimatedButton>

            <TouchableOpacity
                className="py-2 active:opacity-70"
                onPress={() => router.replace('/(tabs)/collections')}
            >
                <Text className="text-primary font-semibold text-sm">I&apos;ll do this later</Text>
            </TouchableOpacity>
        </View>
    )
}
