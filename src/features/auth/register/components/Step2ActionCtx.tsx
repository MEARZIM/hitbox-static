import { useSSO } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { ChevronRight, Mail, Phone } from 'lucide-react-native'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { AppleSvg } from '@/components/icons/AppleIcon'
import { FacebookSvg } from '@/components/icons/FacebookIcon'
import { GoogleSvg } from '@/components/icons/GoogleIcon'
import PhoneNumberLogin from '../../login/components/PhoneNumberLogin'
import { getClerkErrorMessage, useWarmUpBrowser } from '../../utils/clerk'
import { AnimatedButton } from './AnimatedButton'

WebBrowser.maybeCompleteAuthSession()

type SSOStrategy = 'oauth_google' | 'oauth_apple' | 'oauth_facebook'

export default function Step2ActionCtx() {
    useWarmUpBrowser()

    const { startSSOFlow } = useSSO()
    const [pendingStrategy, setPendingStrategy] = useState<SSOStrategy | null>(null)
    const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // SSO covers both sign-up and sign-in: new users get an account created
    // by Clerk, and the user.created webhook projects it onto the backend.
    const handleSSO = async (strategy: SSOStrategy) => {
        if (pendingStrategy) return
        setPendingStrategy(strategy)
        setError(null)

        try {
            const redirectUrl = Linking.createURL('/')
            // console.log('SSO redirectUrl:', redirectUrl)

            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                // No hardcoded scheme: resolves to exp://<host> in Expo Go and
                // hitboxstatic:// in dev/production builds.
                redirectUrl,
            })

            // console.log(createdSessionId)

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
                router.replace('/(tabs)/discover')
            }
            // No createdSessionId → user cancelled or extra steps are required.
        } catch (err) {
            console.log(getClerkErrorMessage(err))
            setError(getClerkErrorMessage(err))
        } finally {
            setPendingStrategy(null)
        }
    }

    return (
        <View className="space-y-3 flex gap-2">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Create Your Account
            </Text>

            {/* Google Button */}
            <AnimatedButton
                onPress={() => handleSSO('oauth_google')}
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
                {pendingStrategy === 'oauth_google'
                    ? <ActivityIndicator size="small" color="#000" />
                    : <ChevronRight size={18} color="#000" opacity={0.3} />}
            </AnimatedButton>

            {/* Apple Button */}
            <AnimatedButton
                onPress={() => handleSSO('oauth_apple')}
                className="flex-row items-center bg-foreground h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><AppleSvg /></View>
                <Text className="flex-1 text-black font-semibold text-center text-[15px]">Continue with Apple</Text>
                {pendingStrategy === 'oauth_apple'
                    ? <ActivityIndicator size="small" color="#000" />
                    : <ChevronRight size={18} color="#000" opacity={0.3} />}
            </AnimatedButton>

            {/* Facebook Button */}
            <AnimatedButton
                onPress={() => handleSSO('oauth_facebook')}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><FacebookSvg /></View>
                <Text className="flex-1 text-white font-semibold text-center text-[15px]">Continue with Facebook</Text>
                {pendingStrategy === 'oauth_facebook'
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <ChevronRight size={18} color="#fff" opacity={0.3} />}
            </AnimatedButton>

            {/* Email Button → details form (Clerk email-code sign-up) */}
            <AnimatedButton
                onPress={() => router.push('/(auth)/register/details')}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 h-12 rounded-2xl px-4"
            >
                <View className="w-6 items-center"><Mail size={20} color="#fff" /></View>
                <Text className="flex-1 text-white font-semibold text-center text-[15px]">Continue with Email</Text>
                <ChevronRight size={18} color="#fff" opacity={0.3} />
            </AnimatedButton>

            {error && (
                <Text className="text-red-500 text-xs font-medium text-center">{error}</Text>
            )}

            {/* Divider text markup */}
            <View className="flex-row items-center my-4 space-x-3">
                <View className="flex-1 h-[1px] bg-neutral-800" />
                <Text className="text-neutral-500 text-xs font-bold uppercase tracking-widest">OR</Text>
                <View className="flex-1 h-[1px] bg-neutral-800" />
            </View>

            {/* Phone Button → shared Clerk SMS dialog (signs up new numbers) */}
            <AnimatedButton
                onPress={() => setIsPhoneDialogOpen(true)}
                className="flex-row items-center bg-neutral-900/80 border border-neutral-800 py-3.5 rounded-2xl px-4 h-14"
            >
                <View className="w-6 items-center"><Phone size={20} color="#fff" /></View>
                <View className="flex-1 items-center">
                    <Text className="text-white font-semibold text-[15px]">Continue with Phone Number</Text>
                    <Text className="text-neutral-500 text-[11px] mt-0.5">We'll send you a verification code</Text>
                </View>
                <ChevronRight size={18} color="#fff" opacity={0.3} />
            </AnimatedButton>

            <PhoneNumberLogin
                isPhoneDialogOpen={isPhoneDialogOpen}
                setIsPhoneDialogOpen={setIsPhoneDialogOpen}
                showTrigger={false}
            />
        </View>
    )
}
