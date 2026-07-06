import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

import { Button } from '@/components/ui/button'

export default function LoginFooter() {
    return (
        <View className="items-center gap-y-4">
            <View className="flex-row items-center gap-x-1">
                <Text className="text-neutral-400 text-sm">Don't have an account?</Text>
                <Button
                    variant="link"
                    onPress={() => router.push('/(auth)/register')}
                    className="p-0 h-auto"
                >
                    <Text className="text-primary font-semibold text-sm">Sign Up</Text>
                </Button>
            </View>

            <Text className="text-center text-neutral-600 text-[11px] leading-relaxed px-6">
                By continuing, you agree to HitBox’s{'\n'}
                <Text className="text-neutral-500 underline">Terms of Service</Text> and{' '}
                <Text className="text-neutral-500 underline">Privacy Policy</Text>.
            </Text>
        </View>
    )
}