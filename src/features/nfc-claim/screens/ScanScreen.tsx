import { router } from 'expo-router';
import { Nfc, ScanLine } from 'lucide-react-native';
import { View as MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getNfcStatus, type NfcStatus, normalizeTagId, promptEnableNfcIfNeeded } from '@/lib/nfc';

/** Navigate to the claim page for a (normalized) tag id. */
export function goToClaim(tagId: string) {
    const id = normalizeTagId(tagId);
    if (!id) return;
    // typedRoutes: cast until expo regenerates route types for the new screen.
    router.push(`/(routes)/claim/${id}` as never);
}

export default function ScanScreen() {
    const [status, setStatus] = useState<NfcStatus | null>(null);
    const [manual, setManual] = useState('');

    useEffect(() => {
        void (async () => {
            const s = await getNfcStatus();
            setStatus(s);
            if (s.supported && !s.enabled) void promptEnableNfcIfNeeded();
        })();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#050507]">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 px-5 pt-3">
                <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="items-center my-2">
                    <Text className="text-white text-3xl font-black tracking-widest uppercase">
                        HIT<Text className="text-primary">B★X</Text>
                    </Text>
                </MotiView>

                {/* Pulsing scan prompt */}
                <View className="flex-1 items-center justify-center -mt-10">
                    <MotiView
                        from={{ opacity: 0.4, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.06 }}
                        transition={{ type: 'timing', duration: 900, loop: true, repeatReverse: true }}
                        className="bg-[#0C1B2E] p-8 rounded-full border"
                        style={{ borderColor: '#208AEF' }}
                    >
                        <Nfc color="#208AEF" size={72} />
                    </MotiView>

                    <Text className="text-white text-2xl font-black tracking-tight mt-8 mb-2">Tap to claim</Text>
                    <Text className="text-[15px] text-neutral-400 text-center font-medium leading-5 px-8">
                        Hold the top-back of your phone against the collectible's NFC tag.
                    </Text>

                    {status && !status.supported && (
                        <Text className="text-amber-400 font-semibold text-[13px] text-center mt-5 px-6">
                            NFC unavailable in this build. Use a dev build ({'npx expo run:android'}) on a real device — Expo Go can't access NFC.
                        </Text>
                    )}
                    {status?.supported && !status.enabled && (
                        <TouchableOpacity onPress={() => void promptEnableNfcIfNeeded()} className="mt-5">
                            <Text className="text-primary font-bold text-[15px]">NFC is off — turn it on</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Manual entry — a fallback for testing without a physical tap */}
                <View className="bg-[#0F0F13] border border-[#1F1F24] rounded-xl p-4 mb-4">
                    <Text className="text-[12px] text-neutral-400 font-medium uppercase tracking-wider mb-2">
                        Or enter a tag id
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <View className="flex-1 flex-row items-center bg-[#08060b] border border-[#26262E] rounded-lg px-3">
                            <ScanLine color="#71717A" size={18} />
                            <TextInput
                                value={manual}
                                onChangeText={setManual}
                                placeholder="534A70C1610001"
                                placeholderTextColor="#52525B"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                className="flex-1 text-white py-3 ml-2"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => goToClaim(manual)}
                            disabled={!normalizeTagId(manual)}
                            activeOpacity={0.85}
                            className={`rounded-lg h-12 px-5 items-center justify-center ${normalizeTagId(manual) ? 'bg-primary' : 'bg-[#1A1A22]'}`}
                        >
                            <Text className="text-white font-bold">Claim</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
