import { useFocusEffect } from 'expo-router';
import { useCallback, type RefObject } from 'react';
import type { ScrollView } from 'react-native';

/**
 * Sends a tab's scroll position back to the top whenever the tab regains focus.
 *
 * Tab screens stay mounted, so React Navigation hands the ScrollView back with
 * the offset the user left behind and the tab appears to reopen mid-list. The
 * reset runs twice, deliberately:
 *
 *  - on the way **in**, deferred one frame — a scroll dispatched while the tab
 *    is still transitioning gets swallowed (Android especially);
 *  - on the way **out**, where the screen is already off-screen, so the jump
 *    cannot be seen and the offset is back at 0 before focus timing can matter.
 *
 * `onReset` covers transient UI that shouldn't survive a tab switch either —
 * an open filter menu, a stale section highlight. Keep it to state setters;
 * it is intentionally not a dependency, so the effect runs once per focus.
 */
export function useTabScrollReset(
    ref: RefObject<ScrollView | null>,
    onReset?: () => void,
) {
    useFocusEffect(
        useCallback(() => {
            const frame = requestAnimationFrame(() => {
                ref.current?.scrollTo({ y: 0, animated: false });
            });
            onReset?.();

            return () => {
                cancelAnimationFrame(frame);
                ref.current?.scrollTo({ y: 0, animated: false });
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );
}
