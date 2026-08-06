import { isClerkAPIResponseError } from '@clerk/clerk-expo'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

/** Preloads the in-app browser on Android so SSO opens faster. */
export function useWarmUpBrowser() {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

/** Extracts a human-readable message from a Clerk API error. */
export function getClerkErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
    if (isClerkAPIResponseError(err)) {
        return err.errors[0]?.longMessage ?? err.errors[0]?.message ?? fallback
    }
    if (err instanceof Error) return err.message
    return fallback
}

/** True when the identifier (email/phone) has no Clerk account yet. */
export function isAccountNotFound(err: unknown) {
    return isClerkAPIResponseError(err) && err.errors.some((e) => e.code === 'form_identifier_not_found')
}
