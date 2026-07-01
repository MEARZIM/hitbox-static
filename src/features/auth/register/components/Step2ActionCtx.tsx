import { ChevronRight, Mail, Phone } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Text, View } from 'react-native'

import { AppleSvg } from '@/components/icons/AppleIcon'
import { FacebookSvg } from '@/components/icons/FacebookIcon'
import { GoogleSvg } from '@/components/icons/GoogleIcon'
import { AnimatedButton } from './AnimatedButton'

export default function Step2ActionCtx() {
    return (
        <View className="space-y-3 flex gap-2">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Create Your Account
            </Text>

            {/* Google Button */}
            <AnimatedButton
                onPress={() => console.log('Google Press')}
                className="flex-row items-center bg-foreground h-12 rounded-2xl px-4"
            >
                <MotiView
                    from={{ rotate: '0deg' }}
                    animate={{ rotate: '0deg' }}
                    className="w-6 items-center"
                >
                    <GoogleSvg />
                </MotiView>
                <Text className="flex-1 text-black font-semibold text-center text-[15px]">Continue with Google</Text>
                <ChevronRight size={18} color="#000" opacity={0.3} />
            </AnimatedButton>

            {/* Apple Button */}
            <AnimatedButton
                onPress={() => console.log('Apple Press')}
                className="flex-row items-center bg-foreground h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><AppleSvg /></View>
                <Text className="flex-1 text-black font-semibold text-center text-[15px]">Continue with Apple</Text>
                <ChevronRight size={18} color="#000" opacity={0.3} />
            </AnimatedButton>

            {/* Facebook Button */}
            <AnimatedButton
                onPress={() => console.log('Facebook Press')}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><FacebookSvg /></View>
                <Text className="flex-1 text-white font-semibold text-center text-[15px]">Continue with Facebook</Text>
                <ChevronRight size={18} color="#fff" opacity={0.3} />
            </AnimatedButton>

            {/* Email Button */}
            <AnimatedButton
                onPress={() => console.log('Email Press')}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><Mail size={20} color="#fff" /></View>
                <Text className="flex-1 text-white font-semibold text-center text-[15px]">Continue with Email</Text>
                <ChevronRight size={18} color="#fff" opacity={0.3} />
            </AnimatedButton>

            {/* Divider text markup */}
            <View className="flex-row items-center my-4 space-x-3">
                <View className="flex-1 h-[1px] bg-neutral-800" />
                <Text className="text-neutral-500 text-xs font-bold uppercase tracking-widest">OR</Text>
                <View className="flex-1 h-[1px] bg-neutral-800" />
            </View>

            {/* Phone Button */}
            <AnimatedButton
                onPress={() => console.log('Phone Press')}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 py-3.5 rounded-2xl px-4 h-14"
            >
                <View className="w-6 items-center"><Phone size={20} color="#fff" /></View>
                <View className="flex-1 items-center">
                    <Text className="text-white font-semibold text-[15px]">Continue with Phone Number</Text>
                    <Text className="text-neutral-500 text-[11px] mt-0.5">We'll send you a verification code</Text>
                </View>
                <ChevronRight size={18} color="#fff" opacity={0.3} />
            </AnimatedButton>
        </View>
    )
}