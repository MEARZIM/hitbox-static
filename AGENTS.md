# HitBox Mobile App — Project Guide

> **Read this file before writing any code.** It describes the whole frontend:
> stack, folder conventions, routing, data layer, and the backend contract.
> Verified against the tree on 2026-07-29.

## ⚠️ Expo HAS CHANGED

This project is on **Expo SDK 56 / React Native 0.85 / React 19**. APIs moved.
Check the exact versioned docs at <https://docs.expo.dev/versions/v56.0.0/>
before using any Expo or React Native API — do not rely on pre-SDK-50 memory.

---

## 1. What this is

`hitbox-static` is the **React Native (Expo) mobile client** for HitBox — a
platform for physical collectibles that carry an **NFC tag**. A user taps a tag
to verify authenticity and **claim** first ownership; claimed items land in their
collection and every claim is written to a provenance ledger.

It talks to a separate backend repo (`hitbox-backend`, a modular-monolith Express
API). **This repo contains no server code and no database.**

| Concern | Owner |
|---|---|
| UI, navigation, client state | this repo |
| Identity, sessions, OAuth, password policy | **Clerk** (`@clerk/clerk-expo`) |
| Products, claims, collections, ledger | **backend** `/api/v1/*` |

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Expo SDK `~56.0.17`, RN `0.85.3`, React `19.2.3` | new architecture enabled |
| Navigation | **expo-router** `~56.2.16` | file-based; `src/app/**` **is** the route table |
| Styling | **NativeWind v4** (Tailwind) | `className` on RN components; `src/global.css` |
| Server state | **TanStack Query v5** | every network read/write goes through it |
| Forms | react-hook-form + **Zod** (`zod` v4) | `zodResolver` |
| Auth | `@clerk/clerk-expo` + `expo-secure-store` token cache | |
| Animation | `moti` + `react-native-reanimated` v4 | |
| Icons | `lucide-react-native` | |
| NFC | `react-native-nfc-manager` `^3.17.2` | **native module — cannot run in Expo Go** |
| UI primitives | `@rn-primitives/*` → `src/components/ui/*` (32 files) | shadcn-style, RN port |
| Tests | Jest + `jest-expo` + `@testing-library/react-native` | |

**Path aliases** (`tsconfig.json`): `@/*` → `./src/*`, `@/assets/*` → `./assets/*`.
Always import with `@/…`, never long relative chains.

---

## 3. Folder structure

```text
hitbox-static/
├── AGENTS.md / CLAUDE.md      # this guide (CLAUDE.md just does `@AGENTS.md`)
├── app.json                   # Expo config: scheme `hitboxstatic`, plugins
├── babel.config.js            # NativeWind preset; skips it under Jest
├── jest.setup.js              # global test mocks (moti, lucide, router, reanimated)
├── metro.config.js            # withNativeWind
├── tailwind.config.js         # design tokens (primary, background, card…)
├── android/                   # prebuilt native project (committed, hand-edited — see §8)
└── src/
    ├── app/                   # ROUTES ONLY — thin wrappers, no business logic
    ├── features/              # all real code, one folder per domain
    ├── components/            # cross-feature shared components
    │   ├── ui/                # 32 design-system primitives
    │   └── icons/             # brand SVGs (Google, Apple, Facebook…)
    ├── lib/                   # app-wide infrastructure (api, nfc, utils)
    ├── hooks/                 # generic hooks (color scheme, theme)
    ├── constants/theme.ts
    └── global.css
```

### The one rule that matters

**`src/app/**` files are route wrappers only.** They read route params and render
a screen from `src/features/*/screens/`. All logic, data fetching, and UI live in
`src/features/`. Example:

```tsx
// src/app/(routes)/claim/[tagId].tsx
export default function ClaimRoute() {
    const { tagId } = useLocalSearchParams<{ tagId: string }>();
    return <ClaimScreen tagId={normalizeTagId(String(tagId ?? ''))} />;
}
```

### Feature folder convention

Every feature in `src/features/<name>/` follows the same shape. Put new code in
the matching slot — do **not** invent new layouts:

```text
features/<name>/
├── api/            # TanStack Query hooks, one file per endpoint
│   ├── routes.ts   # URL builders + query keys (the ONLY place URLs are written)
│   └── getX.ts     # useX() → useQuery / useMutation
├── types/<name>.ts # DTOs mirroring the backend response shapes
├── screens/        # full screens (rendered by src/app wrappers)
├── components/     # presentational pieces for this feature
├── hooks/          # feature-local hooks
├── utils/          # formatters, mappers
├── validation/     # Zod schemas
└── data/           # ⚠️ legacy static mock data — being replaced by api/
```

---

## 4. Routes (`src/app`)

```text
_layout.tsx                 ClerkProvider → QueryClientProvider → Stack → PortalHost
index.tsx                   dev launcher (buttons into each section)
sso-callback.tsx            Clerk OAuth landing — WAITS for the session (see §7)

(auth)/                     login / registration — navigable in any auth state
  login/index.tsx
  register/index.tsx        step 1
  register/step2.tsx        social + email choice
  register/details.tsx      full form → Clerk sign-up + email OTP
  forget-password/index.tsx
  item-not-authenticated.tsx

(tabs)/                     bottom tab bar
  discover/index.tsx        public feed
  marketplace/index.tsx     public listings
  marketplace/[tourId]/     product detail (carries a product id despite the name)
  collections/index.tsx     🔒 protected — the user's shelf
  collections/view-collection/
  profile/index.tsx         🔒 protected

(routes)/                   pushed full-screen routes
  scan.tsx                  NFC scan entry point — the ONLY place scanning runs
  claim/[tagId].tsx         tap outcome state machine
  verify/[tagId].tsx        read-only authenticity check
  edit-profile/index.tsx
  settings/index.tsx
  artists/[artistId]/
```

**Route protection** lives in `src/app/(tabs)/_layout.tsx` using
`<Tabs.Protected guard={!!isSignedIn}>` around **collections** and **profile**.
The `(auth)` group is intentionally *not* guarded, so those screens stay
reachable while signed in. `_layout.tsx` waits for Clerk's `isLoaded` before
rendering the navigator, so a signed-in user is never bounced on cold start.

Adding a route: create the file under `src/app/`, then **restart the dev server**
so expo-router regenerates `.expo/types/router.d.ts` (typed routes are on —
`router.push('/new/route')` won't typecheck until it does).

---

## 5. Features

| Feature | Backend module | State |
|---|---|---|
| `discover` | `/api/v1/discover` | ✅ fully wired |
| `marketplace` | `/api/v1/marketplace` | ✅ fully wired |
| `collections` | `/api/v1/collections` | ✅ wired (some legacy `data/` remains) |
| `products` | `/api/v1/products` | ✅ detail screen wired |
| `profile` | `/api/v1/users` | ✅ wired incl. avatar upload |
| `nfc-claim` | `/api/v1/claims`, `/verify`, `/ledger` | ✅ wired |
| `auth` | Clerk + `/api/v1/auth` | ✅ email, phone OTP, Google/Apple/Facebook SSO |
| `settings` | — | UI only |
| `artists` | — | UI only (no backend endpoint yet) |

---

## 6. Data layer

### `src/lib/api.ts` — the only fetch wrapper

`useApi()` returns `{ get, getPage, post, patch, delete }`. It:

- prefixes `EXPO_PUBLIC_API_URL`
- attaches the Clerk session JWT as `Authorization: Bearer <token>`
- sends `ngrok-skip-browser-warning: true` (harmless on non-ngrok hosts)
- unwraps the backend's `{ data }` envelope — **`get` returns `data` directly**
- `getPage<T>()` keeps `{ data, meta }` for paginated lists
- throws **`ApiRequestError`** carrying `{ status, error: { code, message } }`

```ts
const api = useApi();
const me   = await api.get<Me>('/api/v1/users/me');             // → data
const page = await api.getPage<Item>('/api/v1/collections/me');  // → { data, meta }
```

### Pattern for a new endpoint

1. Add the URL builder + query key to `features/<name>/api/routes.ts`.
2. Add the DTO to `features/<name>/types/<name>.ts` (mirror the backend exactly).
3. Add a hook in `features/<name>/api/getX.ts` using `useApi()` + `useQuery`.
4. Consume it in a screen. Never call `fetch` directly in a component.

### Error handling

The backend always returns `{ error: { code, message, details } }`. Branch on
**`code`**, never on message text:

```ts
if (err instanceof ApiRequestError && err.error.code === 'USERS_USERNAME_TAKEN') { … }
```

`src/lib/queries.ts` exports `retryAuthAware` — retries `AUTH_ACCOUNT_NOT_FOUND`
up to 5× (the Clerk webhook may not have created the local user row yet), fails
fast on other 4xx. Use it on authed queries.

---

## 7. Auth (Clerk)

- `ClerkProvider` wraps everything in `src/app/_layout.tsx` with the SecureStore
  token cache. Publishable key: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Sign-in paths:** email+password, phone SMS OTP (auto-signs-up unknown
  numbers), and Google / Apple / Facebook via `useSSO`.
- **Registration** (`features/auth/register`) → `signUp.create` + email OTP.
  Because the Clerk instance has username/name attributes disabled, those fields
  travel in **`unsafeMetadata`**; several profile components read them as a
  fallback.
- **SSO redirect:** use `Linking.createURL('/')` with **no hardcoded scheme** —
  it resolves to `exp://…` in Expo Go and `hitboxstatic://` in a real build.
  Hardcoding the scheme breaks Expo Go.
- **`sso-callback.tsx` must not redirect to login.** Clerk finishes the session
  *after* the browser returns, so `isSignedIn` is false on first render — the
  route polls for the session instead. Bouncing to login here caused a loop.
- `src/lib/pending-claim.ts` remembers the tag being claimed across an OAuth
  round-trip (route params are lost in the redirect).
- Post-login return path: pass `?returnTo=<path>`; the login components honour it.

### Backend user rows

A Clerk user only exists in the backend once its `user.created` webhook is
processed. Until then authed calls return **401 `AUTH_ACCOUNT_NOT_FOUND`** — this
is expected, not a bug; that's what `retryAuthAware` absorbs.

---

## 8. NFC claim flow (the core feature)

**Scanning is scoped to `/(routes)/scan` only** — there is deliberately **no**
app-wide tag listener. The user presses a button, lands on the scan screen, and
taps there.

```text
button → /(routes)/scan → tap → /(routes)/claim/<tagId>
                                   │
                    ClaimScreen verifies (PUBLIC, works signed out)
                    GET /verify/:tagId  +  GET /products/tag/:tagId
                                   │
   ┌───────────────────────────────┼─────────────────────────────┐
verified & UNCLAIMED         already claimed            not registered / error
   │                               │                             │
ProductVerifiedScreen         owned card                  error cards
   │
[Claim My Item] → POST /claims/:tagId/confirm → SucessfulClaimScreen
```

- **`ClaimScreen`** is the state machine and owns every error state
  (`NotRegisteredCard`, `OwnedCard`, `ErrorCard`, `LedgerCard`). It adapts the
  public reads into a `ValidateResult` shape so those cards need no rewrite.
- **`ProductVerifiedScreen`** renders **only** when verified **and** unclaimed.
  Purely presentational — takes `product`, `onClaim`, `isClaiming`, `signedIn`.
- **`SucessfulClaimScreen`** renders **only** after `confirm` returns
  `outcome: 'CLAIMED'`. An `ALREADY_CLAIMED` response stays on the owned card.
- **Nothing is claimed until the Claim button is pressed.** Verification is
  read-only. Sign-in is requested at claim time, not on entry.

### Tag id normalization

`normalizeTagId()` in `src/lib/nfc.ts` strips separators and upper-cases, so a
chip read as `53:4A:70:C1:61:00:01` becomes **`534A70C1610001`**. That must match
`Product.tagId` on the backend exactly. **Normalize on every path** — route
params included.

### Tap-to-launch (app closed)

Requires an NDEF URI record on the chip: `hitboxstatic://claim/<TAGID>`.
Android dispatches **`ACTION_NDEF_DISCOVERED`** (not `ACTION_VIEW`) for an NDEF
URI, so a plain `hitboxstatic://` VIEW filter does **not** match. The needed
filter is currently **hand-added** to
`android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <data android:scheme="hitboxstatic"/>
</intent-filter>
```

⚠️ **This edit is lost on `npx expo prebuild --clean`.** It cannot be expressed
through `app.json` — Expo's `android.intentFilters` hardcodes the
`android.intent.action.` prefix, and `react-native-nfc-manager`'s plugin only
adds the NFC *permission*. Making it durable needs a small local config plugin
using `withAndroidManifest`. Re-add the block by hand if prebuild wipes it.

---

## 9. Backend contract

Base URL from **`EXPO_PUBLIC_API_URL`**; all routes under `/api/v1`.
🔒 = needs a Clerk session JWT.

| Endpoint | Auth | Used by |
|---|---|---|
| `GET /discover`, `/discover/products` | public | discover |
| `GET /marketplace`, `/marketplace/listings` | public | marketplace |
| `GET /products/:id`, `/products/code/:code`, `/products/tag/:tagId` | public | products, nfc-claim |
| `GET /verify/:tagId`, `GET /ledger/:tagId` | public | nfc-claim |
| `POST /claims/:tagId` | 🔒 | validate step |
| `POST /claims/:tagId/confirm` | 🔒 | **the claim + ledger write** |
| `GET /users/me`, `PATCH /users/me` | 🔒 | profile |
| `GET /collections/me`, `/collections/me/stats` | 🔒 | collections |
| `PATCH /collections/me/:productId` | 🔒 | visibility toggle |
| `GET /auth/me` | 🔒 | session probe |

### Known doc drift (verified against the live API)

- `hitbox-backend/docs/nfc-claim-verify-api.md` documents `POST /claim/:tagId`
  (singular). **That route returns 404.** The real endpoints are the plural
  `/claims/:tagId` and `/claims/:tagId/confirm`. Trust the app code here.
- Every `/api/v1/*` route is **rate limited to 100 req / 60 s per IP** → `429
  RATE_LIMITED`. Not specially handled in the client yet.

---

## 10. Environment

`.env` at the repo root (git-ignored). Only `EXPO_PUBLIC_*` vars reach the app.

```dotenv
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…
EXPO_PUBLIC_API_URL=https://hitbox-backend-qa.up.railway.app
```

- Must be **publicly reachable from the phone** — `localhost` / `127.0.0.1` point
  at the *device*, not your PC, and always fail.
- **Baked in at build time.** Changing `.env` requires a restart (dev) or a full
  rebuild (release). You cannot patch it on-device.
- Do **not** set `NODE_ENV=test` in `.env` — it makes `expo start` skip the
  NativeWind babel transform and every style silently disappears.

---

## 11. Commands

```bash
npm start                  # dev server
npm run start:tunnel       # dev server over a public tunnel (phone off-LAN)
npm run android            # build + install a dev build (required for NFC)
npm test                   # jest
npx tsc --noEmit           # typecheck — run before finishing any change
```

### Release APK (Android, from Windows)

```bash
cd android
JAVA_HOME="C:/Program Files/Microsoft/jdk-17.0.20.8-hotspot" \
ANDROID_HOME="C:/Users/<you>/AppData/Local/Android/Sdk" \
./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

Three traps, all verified the hard way:

1. **Gradle must run on JDK 17** — not 21, not 25. RN 0.85's Gradle plugin
   declares `kotlin { jvmToolchain(17) }`; on any other JDK, Gradle resolves a
   toolchain through the foojay resolver that RN pins at `0.5.0`, which
   references `JvmVendorSpec.IBM_SEMERU` — removed in Gradle 9. Symptom:
   `Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field …`.
   Installing JDK 17 is not enough; `JAVA_HOME` must point at it.
2. **The repo path must be short.** Reanimated's generated object files already
   reach ~248 of Windows' 260-char limit from
   `C:\Users\…\OneDrive\Desktop\hitbox\hitbox-static`. The compiler then appends
   more, writes fail silently, CMake regenerates, and ninja aborts with
   `manifest 'build.ninja' still dirty after 100 tries`. Cleaning `.cxx` does
   **not** help — build from a short path such as `C:\dev\hitbox-static`.
   (Being outside OneDrive also stops sync from touching build files mid-compile.)
3. **First build downloads the NDK (~3 GB)** and takes 20–40 minutes.

The release build type is signed with the **debug keystore**, so the APK installs
for testing but Play Store will reject it. `android.package` is also still the
placeholder `com.anonymous.hitboxstatic`.

---

## 12. Conventions & gotchas

1. **Typecheck before finishing.** `npx tsc --noEmit`. Test files may report
   pre-existing jest-type errors; source must be clean.
2. **Never hardcode a URL in a component.** URLs live in `api/routes.ts`.
3. **Match the surrounding style** — comment density, naming, formatting. This
   codebase uses explanatory comments for *why*, not *what*.
4. **`flex-1` all the way down.** A screen missing it on `SafeAreaView` or its
   container renders blank — a plain `View` has no intrinsic height.
5. **NFC and SSO cannot be tested in Expo Go.** Both need a dev/release build;
   Expo Go has no NFC native module and doesn't own the `hitboxstatic://` scheme.
6. **Decimals arrive as strings** (`priceInDollars: "89.99"`). Format, don't
   assume `number`.
7. **Legacy `data/*.js` mock files** still exist in some features. They are being
   replaced by `api/` hooks — don't add new ones.
8. Some names are historical: `marketplace/[tourId]` carries a *product* id, and
   `nfc-claim` components are still `Step3*` / `Step4*`. Don't rename without
   being asked.
