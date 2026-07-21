import React from 'react'
import { Image, View } from 'react-native'

export default function Step1Nav() {
    return (
        <View className="px-6 py-3 flex-row items-center justify-between">
            <View className="flex items-center justify-center w-full">

                <Image
                    source={require("@/assets/images/HitBoxLogo.png")}
                    resizeMode="contain"
                    style={{
                        width: 40,
                        height: 40,
                    }}
                />

            </View>
            {/* <TouchableOpacity className="flex-row items-center gap-x-1.5 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
                <HelpCircle size={16} color="#a1a1aa" />
                <Text className="text-neutral-300 text-xs font-semibold">Help</Text>
            </TouchableOpacity> */}
        </View>
    )
}