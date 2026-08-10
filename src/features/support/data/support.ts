import type { SupportChannel } from '../types/support'

/**
 * The support channels rendered by `SupportScreen`.
 *
 * ⚠️ The two phone numbers are **placeholders**, not live support lines:
 * `+91 98765 43210` and `+1 (555) 123-4567` are the conventional dummy numbers
 * for India and the US (555-01xx is reserved for fiction). The screen says so
 * on-screen via `SUPPORT_PLACEHOLDER_NOTICE` so nobody mistakes them for real
 * contacts. Replace both — the display `value` and the dialable `href` — with
 * the real lines before release. The email address is real.
 */
export const SUPPORT_EMAIL = 'Hitboxcollectibles.admin@gmail.com'

export const SUPPORT_CHANNELS: SupportChannel[] = [
    {
        id: 'email',
        kind: 'email',
        title: 'Email Support',
        value: SUPPORT_EMAIL,
        href: `mailto:${SUPPORT_EMAIL}`,
        actionLabel: 'Send Email',
        accessibilityLabel: `Send an email to ${SUPPORT_EMAIL}`,
    },
    {
        id: 'india',
        kind: 'phone',
        title: 'India Support',
        value: '+91 98765 43210',
        // Dialers reject spaces — the href carries the bare E.164 number.
        href: 'tel:+919876543210',
        actionLabel: 'Call Support',
        accessibilityLabel: 'Call India support on plus 91 98765 43210',
    },
    {
        id: 'us',
        kind: 'phone',
        title: 'US Support',
        value: '+1 (555) 123-4567',
        href: 'tel:+15551234567',
        actionLabel: 'Call Support',
        accessibilityLabel: 'Call US support on plus 1 555 123 4567',
    },
]

export const SUPPORT_HEADING = 'Need Help?'

export const SUPPORT_SUBHEADING =
    "Our support team is here to help. Contact us through email or phone and we'll get back to you as soon as possible."

/** Shown above the cards so the dummy numbers are never read as production lines. */
export const SUPPORT_PLACEHOLDER_NOTICE =
    'The phone numbers below are placeholders for testing and are not yet connected. Email is the reliable way to reach us.'
