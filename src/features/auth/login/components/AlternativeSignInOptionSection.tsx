import { useSSO } from '@clerk/clerk-expo';
import { AppleSvg } from '@/components/icons/AppleIcon';
import { FacebookSvg } from '@/components/icons/FacebookIcon';
import { GoogleSvg } from '@/components/icons/GoogleIcon';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { setPendingClaim } from '@/lib/pending-claim';

// Completes the OAuth session when the browser redirects back to the app.
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = 'oauth_google' | 'oauth_facebook' | 'oauth_apple';

export default function AlternativeSignInOptionSection() {
    const { startSSOFlow } = useSSO();
    const { claimTag } = useLocalSearchParams<{ claimTag?: string }>();
    const [busy, setBusy] = useState<OAuthStrategy | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Warm up the Android browser for a faster OAuth hand-off.
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);

    const signInWith = async (strategy: OAuthStrategy) => {
        if (busy) return;
        setBusy(strategy);
        setError(null);
        // Preserve the tag across the OAuth redirect (route params are lost).
        setPendingClaim(claimTag ?? null);
        try {
            // NOTE: do NOT pass a custom redirectUrl. Clerk derives it internally
            // with AuthSession.makeRedirectUri({ path: 'sso-callback' }) and uses
            // the SAME string for openAuthSessionAsync. Supplying our own
            // (e.g. Linking.createURL) can produce a different string, so the
            // browser redirect never matches and the session is never created.
            const { createdSessionId, setActive, signIn, authSessionResult } = await startSSOFlow({ strategy });

            const sessionId = createdSessionId ?? signIn?.createdSessionId ?? null;
            if (sessionId && setActive) {
                await setActive({ session: sessionId });
                router.replace(
                    (claimTag ? `/(routes)/claim/${claimTag}` : '/(tabs)/discover') as never,
                );
            } else {
                // Surface what actually happened so failures are diagnosable.
                const type = (authSessionResult as { type?: string } | null)?.type ?? 'unknown';
                setError(
                    type === 'cancel' || type === 'dismiss'
                        ? 'Sign-in was cancelled.'
                        : `Sign-in did not complete (${type}). Please try again.`,
                );
            }
        } catch (err) {
            const msg = (err as { errors?: { message?: string }[] })?.errors?.[0]?.message;
            setError(msg ?? (err as Error)?.message ?? 'Social sign-in failed. Try email instead.');
        } finally {
            setBusy(null);
        }
    };

    return (
        <View className="gap-y-3">
            <TouchableOpacity
                className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full"
                onPress={() => signInWith('oauth_google')}
                disabled={busy !== null}
                activeOpacity={0.85}
            >
                <View className="flex-row items-center gap-x-3">
                    <GoogleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Google</Text>
                </View>
                {busy === 'oauth_google' ? <ActivityIndicator size="small" color="#000" /> : <ChevronRight size={18} color="#A3A3A3" />}
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full"
                onPress={() => signInWith('oauth_facebook')}
                disabled={busy !== null}
                activeOpacity={0.85}
            >
                <View className="flex-row items-center gap-x-3">
                    <FacebookSvg />
                    <Text className="text-black font-semibold text-base">Continue with Facebook</Text>
                </View>
                {busy === 'oauth_facebook' ? <ActivityIndicator size="small" color="#000" /> : <ChevronRight size={18} color="#A3A3A3" />}
            </TouchableOpacity>

            <TouchableOpacity
                className="flex-row items-center justify-between bg-white h-14 px-4 rounded-2xl w-full"
                onPress={() => signInWith('oauth_apple')}
                disabled={busy !== null}
                activeOpacity={0.85}
            >
                <View className="flex-row items-center gap-x-3">
                    <AppleSvg />
                    <Text className="text-black font-semibold text-base">Continue with Apple</Text>
                </View>
                {busy === 'oauth_apple' ? <ActivityIndicator size="small" color="#000" /> : <ChevronRight size={18} color="#A3A3A3" />}
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-xs font-medium ml-1">{error}</Text>}
        </View>
    );
}
