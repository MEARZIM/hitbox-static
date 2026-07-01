import { MotiView } from 'moti'
import React from 'react'
import { Text } from 'react-native'

export default function Step2Header() {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="items-center my-6"
        >
            <Text className="text-white text-3xl font-black tracking-widest uppercase">
                HIT<Text className="text-primary">B★X</Text>
            </Text>
            <Text className="text-white text-2xl font-bold mt-4 tracking-tight">
                {`Let’s get you in`}
            </Text>
            <Text className="text-neutral-400 text-center text-sm mt-2 px-4 leading-5">
                Create your account to claim your item, track your collection, and unlock exclusive experiences.
            </Text>
        </MotiView>
    )
}