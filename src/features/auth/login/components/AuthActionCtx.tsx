import { AppleSvg } from '@/components/icons/AppleIcon'
import { GoogleSvg } from '@/components/icons/GoogleIcon'
import { ChevronRight, Mail, Phone } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function AuthActionCtx() {
    return (
        <View className="w-full gap-y-3 my-8">
            <Text className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                Sign In To Your Account
            </Text>

            {/* Google Button */}
            <TouchableOpacity className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <GoogleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Google</Text>
                </View>
                <ChevronRight size={18} color="#A3A3A3" />
            </TouchableOpacity>

            {/* Apple Button */}
            <TouchableOpacity className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <AppleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Apple</Text>
                </View>
                <ChevronRight size={18} color="#A3A3A3" />
            </TouchableOpacity>


            {/* Email Button */}
            <TouchableOpacity className="flex-row items-center justify-between bg-neutral-900/80 border border-neutral-800 h-14 px-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <Mail size={22} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-base">Continue with Email</Text>
                </View>
                <ChevronRight size={18} color="#525252" />
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-neutral-800" />
                <Text className="text-neutral-500 text-xs px-3 font-semibold">OR</Text>
                <View className="flex-1 h-[1px] bg-neutral-800" />
            </View>

            {/* Phone Number Button */}
            <TouchableOpacity className="flex-row items-center justify-between bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <Phone size={22} color="#FFFFFF" />
                    <View>
                        <Text className="text-white font-semibold text-base">Continue with Phone Number</Text>
                        <Text className="text-neutral-500 text-xs">We'll send you a verification code</Text>
                    </View>
                </View>
                <ChevronRight size={18} color="#525252" />
            </TouchableOpacity>
        </View>
    )
}