import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';

export default function SingleTour() {
    const { tourId } = useLocalSearchParams();
    return (
        <View className="flex-1 w-screen h-screen items-center justify-center">
            <Text>SingleTour: {tourId}</Text>
        </View>
    )
}