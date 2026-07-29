import { useAuth } from '@clerk/clerk-expo';
import { router, usePathname } from 'expo-router';
import { ScanLine } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * Routes where the button would be pointless or in the way. `usePathname()`
 * drops group segments, so `/(routes)/scan` arrives here as `/scan`.
 */
const HIDDEN_ON = [
    '/scan',            // already scanning
    '/claim',           // mid-claim — the screen owns its own actions
    '/verify',
    '/login',
    '/register',
    '/forget-password',
    '/sso-callback',
];

/**
 * Floating scan button — the app-wide entry point into `/(routes)/scan`.
 *
 * Rendered once in `src/app/_layout.tsx` as a sibling of the navigator, so it
 * survives every route change instead of being re-mounted per screen. It sits
 * clear of the 80px tab bar and is hidden on the routes listed above.
 *
 * Tapping only *navigates*: scanning itself stays scoped to the scan screen —
 * there is deliberately no app-wide tag listener (see AGENTS.md §8).
 */
export default function ScanFab() {
    const pathname = usePathname();
    // The navigator shows a spinner until Clerk restores the session; a button
    // floating over that reads as a glitch.
    const { isLoaded } = useAuth();

    if (!isLoaded) return null;
    if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null;

    return (
        <View pointerEvents="box-none" className="absolute bottom-24 right-5 items-center">
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Scan an NFC tag"
                activeOpacity={0.85}
                onPress={() => router.push('/(routes)/scan')}
                className="h-16 w-16 rounded-full bg-primary items-center justify-center border-2 border-white/50 shadow-lg shadow-primary/40"
            >
                <ScanLine color="#FFFFFF" size={28} />
            </TouchableOpacity>

            <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                Scan
            </Text>
        </View>
    );
}
