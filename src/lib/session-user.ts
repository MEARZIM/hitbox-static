import * as SecureStore from 'expo-secure-store';

/**
 * Lightweight "who am I" for the NFC claim flow — the user enters their email
 * once, we persist it, and send it as the X-Demo-User header so the backend
 * records their real userId in product_claim. No Clerk, no login loop.
 */
const KEY = 'hitbox_user_email';
let cache: string | null = null;

export async function getUserEmail(): Promise<string | null> {
    if (cache) return cache;
    try {
        cache = await SecureStore.getItemAsync(KEY);
    } catch {
        cache = null;
    }
    return cache;
}

export async function setUserEmail(email: string): Promise<void> {
    const clean = email.trim().toLowerCase();
    cache = clean;
    try {
        await SecureStore.setItemAsync(KEY, clean);
    } catch {
        /* keep in-memory cache even if secure storage fails */
    }
}

export async function clearUserEmail(): Promise<void> {
    cache = null;
    try {
        await SecureStore.deleteItemAsync(KEY);
    } catch {
        /* ignore */
    }
}
