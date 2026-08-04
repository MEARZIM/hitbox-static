import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import ClaimScreen from '@/features/nfc-claim/screens/ClaimScreen';
import { normalizeTagId } from '@/lib/nfc';

export default function ClaimRoute() {
    const { tagId } = useLocalSearchParams<{ tagId: string }>();
    return <ClaimScreen tagId={normalizeTagId(String(tagId ?? ''))} />;
}
