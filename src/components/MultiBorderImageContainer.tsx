import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export const MultiBorderImageContainer = ({ source, size = 96 }: {
    source: {
        uri: string
    }
    size?: number
}) => {
    const outerSize = size + 12;
    const midSize = size + 5;

    return (
        <View
            style={[
                styles.outerBorder,
                { width: outerSize, height: outerSize, borderRadius: outerSize / 2 },
            ]}
        >
            <View
                style={[
                    styles.midBorder,
                    { width: midSize, height: midSize, borderRadius: midSize / 2 },
                ]}
            >
                <Image
                    source={source}
                    style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerBorder: {
        borderWidth: 4,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    midBorder: {
        borderWidth: 4,
        borderColor: '#6d28d9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderWidth: 4,
        borderColor: 'black',
        backgroundColor: 'card',
    },
});