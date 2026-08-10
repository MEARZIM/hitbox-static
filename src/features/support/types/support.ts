/** Shapes for the Support / Contact Us section. */

/** Decides which icon the card shows and how the value is read out. */
export type SupportChannelKind = 'email' | 'phone'

export interface SupportChannel {
    id: string
    kind: SupportChannelKind
    /** Card heading, e.g. "India Support". */
    title: string
    /** Human-readable address or number, shown as written. */
    value: string
    /**
     * What `Linking.openURL` receives — `mailto:` or `tel:`. Kept separate from
     * `value` because the dialer needs an unformatted number (`tel:+919876543210`)
     * while the card shows the spaced version.
     */
    href: string
    /** Label on the card's action button. */
    actionLabel: string
    /** Screen-reader label for the action button. */
    accessibilityLabel: string
}
