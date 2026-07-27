# User Profile — Test Documentation

Jest **unit tests** for the User Profile feature — the read hooks (`useMe`,
`useUser`), the update mutation (`useUpdateMe`), and the shared data-layer
helpers those hooks depend on (`queryKeys`, `retryAuthAware`). 13 tests across
three files.

## Running

```bash
npm test                              # whole project
npx jest src/features/profile         # profile only
npm run test:coverage                 # with coverage (src/features/profile/**)
```

## Setup

| Piece | File | Notes |
|---|---|---|
| Runner / preset | `package.json` → `jest` | `jest-expo` preset, `@/` → `src/` alias, `transformIgnorePatterns` allows RN/expo/nativewind/moti/clerk/lucide |
| Global mocks | `jest.setup.js` | `react-native-reanimated`, `moti`, `lucide-react-native`, `expo-router` |
| Babel | `babel.config.js` | drops the NativeWind babel transform under Jest (detected via `api.caller` = `babel-jest`) |

The hook suites mock `@/lib/api` (`useApi`), `@/lib/queries` (`queryKeys` / `retryAuthAware`) and `@clerk/clerk-expo` (`useAuth`) — no Clerk/token/network — asserting the hook wiring (URL, cache writes, enable-gating). The helpers suite imports the *real* `@/lib/queries` + `@/lib/api` (only `useAuth` stubbed) to test the retry policy against the real `ApiRequestError`.

---

## 1. Read hooks — `api/__tests__/getProfile.test.tsx` (4 tests)

`useApi().get` + `useAuth` mocked; hooks rendered inside a `QueryClientProvider`.

| Hook | Case | Asserts |
|---|---|---|
| `useMe` | signed in | `GET /api/v1/users/me`, returns the `Me` DTO |
| `useMe` | signed out | query disabled (idle), `get` never called |
| `useUser(id)` | id given | `GET /api/v1/users/{id}` |
| `useUser(undefined)` | no id | disabled, `get` never called |

## 2. Update mutation — `api/__tests__/updateProfile.test.tsx` (3 tests)

`useApi().patch` mocked; real `QueryClient` so cache writes can be asserted.

| Case | Asserts |
|---|---|
| mutate | `patch('/api/v1/users/me', { username })` |
| success | updated profile written into the `['users','me']` cache (`setQueryData`) |
| failure | error surfaced (e.g. `USERS_USERNAME_TAKEN`); cache left untouched |

## 3. Data-layer helpers — `api/__tests__/queryHelpers.test.ts` (6 tests)

Real `queryKeys` + `retryAuthAware` from `@/lib/queries`, exercised with the real `ApiRequestError`.

| Target | Cases |
|---|---|
| `queryKeys` | stable `authMe` / `me` keys · `user(id)` builder |
| `retryAuthAware` | `AUTH_ACCOUNT_NOT_FOUND` (post-signup webhook race) retries up to 5× · other 4xx (`409`, `404`) → no retry · unknown/network errors retry up to 2× · 5xx retries up to 2× |

The `AUTH_ACCOUNT_NOT_FOUND` case is why a freshly-registered user's profile still loads: the Clerk webhook may not have created the local `User` row yet, so `useMe` retries with backoff instead of failing.

### What is intentionally *not* covered

- **Screen/component rendering** (`ProfileScreen`, `UserHeroSection`, `StatsCard`, `EditProfileScreen`, `SettingsScreen`) — UI composition over these units; better covered by integration/e2e. `StatsCard` in particular just re-renders `useCollectionStats`, which is unit-tested in the collections suite.
- **The real network / Clerk token** — `useApi` is mocked; token attachment + base URL belong to a `lib/api` test.
- **Sign-out flow** (`useClerk().signOut` + cache clear) — a Clerk-SDK interaction, out of unit scope.
