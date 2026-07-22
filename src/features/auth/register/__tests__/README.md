# Registration — Test Documentation

Jest test suite for the **registration** section. 59 tests across two files.

## Running

```bash
npm test                                 # whole project
npx jest src/features/auth/register      # registration only
npm run test:coverage                    # with coverage (scoped to register/**)
```

## Setup

| Piece | File | Notes |
|---|---|---|
| Runner / preset | `package.json` → `jest` | `jest-expo` preset, `@/` → `src/` alias, `transformIgnorePatterns` allows RN/expo/nativewind/moti/clerk/lucide |
| Global mocks | `jest.setup.js` | `react-native-reanimated`, `moti`, `lucide-react-native`, `expo-router` |
| Babel | `babel.config.js` | drops the NativeWind babel transform when `NODE_ENV=test` (its `_ReactNativeCSSInterop` global trips Jest's sandbox) |

Per-suite mocks (`@clerk/clerk-expo`, `expo-image-picker`, `@/components/ui/checkbox`) live in the component test file.

---

## 1. Schema — `validation/__tests__/registrationFormDetails.test.ts` (48 tests)

Pure unit tests over `userDetailsSchema` (Zod). Every test starts from a valid payload and overrides one field, so failures point at exactly one rule.

| Group | Cases |
|---|---|
| **Happy path** | full valid payload ✓ · omitted `profileImage` (optional) ✓ · country code without `+` ✓ |
| **firstName** | `<2` chars ✗ · empty ✗ · exactly 2 (boundary) ✓ · missing ✗ · non-string ✗ |
| **lastName** | `<2` chars ✗ · exactly 2 (boundary) ✓ · missing ✗ |
| **username** | `<3` chars ✗ · exactly 3 (boundary) ✓ · letters/numbers/`_` ✓ · spaces ✗ · `.` `-` `@` `!` ✗ (parametrised) |
| **email** | invalid: `plainaddress`, `missing@tld`, `@no-local.com`, `spaces in@email.com`, empty ✗ · valid: `a@b.co`, dotted, `+tag`/sub-domain ✓ |
| **password** | `<8` chars ✗ · exactly 8 (boundary) ✓ · missing ✗ |
| **countryCode** | empty ✗ · leading `0` ✗ · non-digit ✗ · `>4` digits ✗ · `+1`/`1`/`+91`/`+1234` ✓ |
| **phoneNumber** | `<10` digits ✗ · exactly 10 (boundary) ✓ · letters ✗ · formatting `-`/space/`+` ✗ |
| **acceptTermsAndConditions** | `false` ✗ · `true` ✓ · non-boolean ✗ |
| **acceptPrivacyPolicy** | `false` ✗ · `true` ✓ |
| **multiple errors** | every invalid field reported together in one parse |

Boundary values (exactly the min length) are asserted explicitly for firstName, lastName, username, password and phoneNumber.

---

## 2. Component — `components/__tests__/RegistrationDetailsForm.test.tsx` (11 tests)

Integration tests with `@testing-library/react-native`. Clerk's `useSignUp`/`useClerk`, the image picker, the router and the checkbox are mocked; the real react-hook-form + Zod resolver run.

| Group | Test | Asserts |
|---|---|---|
| **Rendering** | renders all fields + submit | every placeholder and the `Submit` button are present |
| | masks password by default | password input `secureTextEntry === true` |
| **Validation** | empty submit | field errors shown, `signUp.create` **not** called |
| | agreements unchecked | Terms error shown, `signUp.create` **not** called |
| **Submission** | valid submit | `signUp.create` called with mapped payload (`emailAddress`, `password`, `unsafeMetadata` incl. concatenated `+11234567890`), `prepareEmailAddressVerification({strategy:'email_code'})` called, advances to **Verify your email** |
| | Clerk error | rejected `create` surfaces the message, stays on form |
| | Clerk not loaded | `isLoaded=false` → early return, `create` not called |
| **Verification** | OTP `<6` digits | inline "Enter the 6-digit code…" error, `attempt` not called |
| | valid 6-digit OTP | `attemptEmailAddressVerification({code})`, `setActive({session})`, `router.replace('/(tabs)/profile')` |
| | incomplete status | non-`complete` status → message, no `setActive`/navigation |
| | resend code | re-calls `prepareEmailAddressVerification` |

### What is intentionally *not* covered

- **SSO buttons** (`Step2ActionCtx` — Google/Apple/Facebook) drive Clerk's `useSSO` browser flow; that's an external redirect, better suited to an e2e/Detox test than a unit test.
- **Image upload result mapping** — the picker is mocked to `canceled`; asserting the data-URI branch would test the mock, not the app.
- **Password show/hide toggle press** — the eye toggle has no accessible label; only the default masked state is asserted.
