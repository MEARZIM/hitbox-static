import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import VerifyScreen from '@/features/nfc-claim/screens/VerifyScreen';
import { normalizeTagId } from '@/lib/nfc';

export default function VerifyRoute() {
    const { tagId } = useLocalSearchParams<{ tagId: string }>();
    return <VerifyScreen tagId={normalizeTagId(String(tagId ?? ''))} />;
}
