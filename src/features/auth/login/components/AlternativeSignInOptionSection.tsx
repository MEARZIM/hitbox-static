import { AppleSvg } from '@/components/icons/AppleIcon'
import { GoogleSvg } from '@/components/icons/GoogleIcon'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function AlternativeSignInOptionSection() {
    return (
        <View className="gap-y-3">
            <TouchableOpacity className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <GoogleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Google</Text>
                </View>
                <ChevronRight size={18} color="#A3A3A3" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full">
                <View className="flex-row items-center gap-x-3">
                    <AppleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Apple</Text>
                </View>
                <ChevronRight size={18} color="#A3A3A3" />
            </TouchableOpacity>
        </View>
    )
}