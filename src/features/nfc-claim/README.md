# NFC tap-to-claim (frontend)

Tap an NFC tag → read its UID → open the claim page → claim the product (or see
who already owns it).

## Flow

1. **App open** ([`src/app/_layout.tsx`](../../app/_layout.tsx)) starts the NFC
   stack, prompts to enable NFC if it's off (Android), and registers a global
   tag listener.
2. **Tap** — on any tag discovery the UID is normalized and the app routes to
   `/(routes)/claim/<tagId>`. There's also a **Scan** screen
   (`/(routes)/scan`) with a manual-entry fallback for testing without a tap.
3. **Claim page** ([`ClaimScreen`](screens/ClaimScreen.tsx)) shows the tag data,
   calls `POST /claim/:tagId`, and renders the outcome:
   - `CLAIMED` → "Claimed! You now own it."
   - `ALREADY_CLAIMED` → "Already claimed by &lt;name&gt;."

## Tag id normalization

The UID is normalized before every API call: **separators stripped, upper-cased**
(`normalizeTagId` in [`src/lib/nfc.ts`](../../lib/nfc.ts)). So a tag read as
`53:4A:70:C1:61:00:01` is sent as **`534A70C1610001`**, which must match
`Product.tagId` in the backend exactly.

## Files

| File | Purpose |
|------|---------|
| `src/lib/nfc.ts` | NFC init, normalize, enable-check/prompt, tag listener |
| `src/lib/api.ts` | fetch wrapper (adds `ngrok-skip-browser-warning`), **auth-token seam** |
| `src/features/nfc-claim/api.ts` | `claimTag` / `verifyTag` + response types |
| `src/features/nfc-claim/screens/ScanScreen.tsx` | "hold near tag" + manual entry |
| `src/features/nfc-claim/screens/ClaimScreen.tsx` | claim page (data + outcome) |
| `src/app/(routes)/scan.tsx`, `.../claim/[tagId].tsx` | route wrappers |

## ⚠️ Not wired yet: authentication

`POST /claim/:tagId` requires a signed-in user. `getAuthToken()` in
[`src/lib/api.ts`](../../lib/api.ts) is a **stub that returns `null`**, so the
claim call will get **401 UNAUTHENTICATED** until Clerk (or a dev-auth header) is
added. The claim screen shows a friendly "Sign-in required" state for that case.
To finish: install `@clerk/clerk-expo`, wrap the app in `ClerkProvider`, and
return `await getToken()` from `getAuthToken()`.

## Running it (physical Android device required)

`react-native-nfc-manager` is a **native module** — it does **not** run in Expo
Go, and NFC needs real hardware (not an emulator). Build a dev client:

```bash
npx expo run:android    # builds + installs the dev build (autolinks NFC)
```

The Android NFC permission is already in `android/.../AndroidManifest.xml`, and
the `react-native-nfc-manager` config plugin is in `app.json` (used if you
re-run `npx expo prebuild`). Then: open the app → home → **"Scan NFC & Claim"** →
tap your tag.

`EXPO_PUBLIC_API_URL` (the ngrok URL) must point at the running backend.
