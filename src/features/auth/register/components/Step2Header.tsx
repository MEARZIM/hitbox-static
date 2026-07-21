import { MotiView } from 'moti'
import React from 'react'
import { Image, Text, View } from 'react-native'

export default function Step2Header() {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="items-center my-6"
        >
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
            <Text className="text-white text-2xl font-bold mt-4 tracking-tight">
                {`Let’s get you in`}
            </Text>
            <Text className="text-neutral-400 text-center text-sm mt-2 px-4 leading-5">
                Create your account to claim your item, track your collection, and unlock exclusive experiences.
            </Text>
        </MotiView>
    )
}