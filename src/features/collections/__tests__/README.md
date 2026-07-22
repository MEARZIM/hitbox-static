# Collections — Test Documentation

Jest **unit tests** for the Collections feature (mappers, route/query-key builders,
and the four React Query hooks). 37 tests across six files.

## Running

```bash
npm test                                # whole project
npx jest src/features/collections       # collections only
npm run test:coverage                   # with coverage (src/features/collections/**)
```

## Setup

| Piece | File | Notes |
|---|---|---|
| Runner / preset | `package.json` → `jest` | `jest-expo` preset, `@/` → `src/` alias, `transformIgnorePatterns` allows RN/expo/nativewind/moti/clerk/lucide |
| Global mocks | `jest.setup.js` | `react-native-reanimated`, `moti`, `lucide-react-native`, `expo-router` |
| Babel | `babel.config.js` | drops the NativeWind babel transform under Jest (detected via `api.caller` = `babel-jest`) |

The hook suites mock `@/lib/api` (`useApi`), `@/lib/queries` (`retryAuthAware`) and `@clerk/clerk-expo` (`useAuth`), so no Clerk/token/network is involved — they assert the hook wiring (URL, query key, enable-gating, pagination) not the transport.

---

## 1. Mappers — `utils/__tests__/mapCollectionItem.test.ts` (12 tests)

| Target | Cases |
|---|---|
| `titleCase` | `LEGENDARY→Legendary`, `MUSIC→Music`, `RARE→Rare` (lowercases the tail, expects UPPER_CASE enums) |
| `toCollectionCard` | maps name + image · genre subtitle · rarity fallback when genre null · placeholder when `imageUrl` null · `owned`=`total`=`totalClaimedNo` · `featured` true for LEGENDARY/EXCLUSIVE, false otherwise |
| `toCollectibleItem` | title-cased rarity, `owned:true`, `isNew:false` · genre/rarity subtitle · placeholder fallback |

## 2. Routes & keys — `api/__tests__/routes.test.ts` (9 tests)

| Target | Cases |
|---|---|
| `COLLECTION_ROUTES` | `me`, `meStats` paths · `meItem(id)` interpolation |
| `collectionKeys` | stable `all`/`stats` · `me(filters)` embeds filters, defaults `{}` · `stats` sits under the `collections` prefix (so invalidating `all` clears it) |
| `buildMyCollectionPath` | bare path · `genre` · `visibility` · `page`+`limit` · all combined (stable order) · falsy `page:0` omitted |

## 3. `useMyCollection` — `api/__tests__/getMyCollection.test.tsx` (3 tests)

| Case | Asserts |
|---|---|
| no filters | `getPage('/api/v1/collections/me')`, returns `{data,meta}` |
| with filters | builds `?genre=MUSIC&visibility=PUBLIC` |
| signed out | query disabled (idle), `getPage` never called |

## 4. `useCollectionStats` — `api/__tests__/getCollectionStats.test.tsx` (2 tests)

| Case | Asserts |
|---|---|
| success | `get('/api/v1/collections/me/stats')`, returns the aggregates |
| signed out | disabled, no fetch |

## 5. `useUpdateCollectionVisibility` — `api/__tests__/updateCollectionVisibility.test.tsx` (3 tests)

| Case | Asserts |
|---|---|
| mutate | `patch('/api/v1/collections/me/p_1', { visibility })` |
| success | invalidates `{ queryKey: ['collections'] }` |
| failure | error surfaced, cache **not** invalidated |

## 6. `useMyCollectionInfinite` — `api/__tests__/getMyCollectionInfinite.test.tsx` (3 tests)

| Case | Asserts |
|---|---|
| page 1 | `getPage('…/me?page=1&limit=20')`, `hasNextPage` true when `totalPages>1` |
| single page | `hasNextPage` false |
| fetchNextPage | requests `?page=2&limit=12`, accumulates items across pages |

### What is intentionally *not* covered

- **Screen/component rendering** (`CollectionScreen`, `AllCollectionScreen`, `ViewCollectionScreen`, `GlobalCollectionSection`) — UI composition over the units here; better covered by integration/e2e.
- **The real network / Clerk token** — `useApi` is mocked; token attachment + base URL belong to a `lib/api` test.
- **`GlobalCollectionSection` client-side "See All" / Owned-Missing filter** — component-level behaviour, out of unit scope.
