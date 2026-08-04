# Maestro E2E flows — HitBox mobile

End-to-end flows for the HitBox React Native client, derived from
[`AGENTS.md`](../AGENTS.md). Every flow header names the section it covers, so the
suite doubles as an executable version of that document.

## Requirements

- **Maestro** ≥ 2.7 on `PATH` (`maestro -v`)
- An **Android emulator or device** with the app installed. NFC and SSO cannot run
  in Expo Go (AGENTS.md §12.5) — these flows need a dev or release build.
- A **release build is the recommended target**: a debug build shows LogBox
  warning toasts over the bottom of the screen and depends on a live Metro server.

```bash
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=x86_64
adb install -r app/build/outputs/apk/release/app-release.apk
```

`-PreactNativeArchitectures=x86_64` builds only the emulator ABI; drop it for a
physical device. See AGENTS.md §11 for the JDK-17 / short-path traps.

## Running

```bash
npm run e2e
```

That picks up [`config.yaml`](config.yaml), runs everything under `flows/`, and
skips the tags that need external inputs (below).

## Reports

```bash
npm run e2e:report   # .maestro/reports/report.html  (HTML-DETAILED)
npm run e2e:junit    # .maestro/reports/junit.xml    (JUnit, for CI)
```

Both are `maestro test .maestro --format … --output …` under the hood, so any tag
flags go on the end:

```bash
npm run e2e:report -- --include-tags needs-tag -e TAG_UNCLAIMED=…
```

`.maestro/reports/` is git-ignored — the artifacts are per-run.

Screenshots taken by `takeScreenshot` and the per-command debug artifacts land in
`~/.maestro/tests/<timestamp>/`.

## Tags

The default run only includes flows that pass with **no external input**. The rest
are opt-in because they need something this repo can't supply:

| Tag | Why it is excluded by default | Opt in with |
|---|---|---|
| `signed-in` | needs a real Clerk account | `--include-tags signed-in -e EMAIL=… -e PASSWORD=…` |
| `needs-tag` | needs tag ids registered on the backend | `--include-tags needs-tag -e TAG_UNCLAIMED=… -e TAG_CLAIMED=…` |
| `live` | sends a real email OTP / SMS, or opens an OAuth browser | `--include-tags live -e EMAIL=…` |
| `destructive` | claims a tag, edits the profile, or signs out — mutates backend state | `--include-tags destructive …` |
| `offline` | toggles airplane mode on the device | `--include-tags offline` |
| `smoke` | (included by default) the no-input core | `--include-tags smoke` |

Example — the full NFC claim path against a real unclaimed tag:

```bash
maestro test .maestro --include-tags needs-tag,signed-in,destructive -e EMAIL=you@example.com -e PASSWORD=secret -e TAG_UNCLAIMED=534A70C1610001
```

## Environment variables

Every flow declares defaults in its own `env:` block, and `-e KEY=VALUE`
overrides them.

| Variable | Default | Meaning |
|---|---|---|
| `APP_ID` | `com.subratadasdev1.hitboxstatic` | the `applicationId` in `android/app/build.gradle`. Note `app.json` still says `com.anonymous.hitboxstatic` — override this if your build differs. |
| `APP_SCHEME` | `hitboxstatic` | the `scheme` in `app.json`, used by the deep-link flows |
| `EMAIL` / `PASSWORD` | — | a Clerk account that already exists in the backend |
| `TAG_UNCLAIMED` | — | registered tag whose product is `UNCLAIMED` |
| `TAG_CLAIMED` | `534A70C1610001` | registered tag already owned by someone |
| `TAG_OWNED_BY_ME` | — | registered tag owned by the `EMAIL` account |

The AGENTS.md §8 demo tag `534A70C1610001` is registered on the QA backend, but its
claim state **flips** — it went from CLAIMED (owner + one ledger row) to UNCLAIMED
(no ledger rows) within a single afternoon. That is why every tag-dependent flow is
`needs-tag` and opt-in: verify the tag's current state before deciding whether to
point `TAG_UNCLAIMED` or `TAG_CLAIMED` at it. The quickest check is

```bash
adb shell am force-stop com.subratadasdev1.hitboxstatic
adb shell am start -a android.intent.action.VIEW -d "hitboxstatic://verify/534A70C1610001"
```

which shows Status / Owner / Ledger records straight from the public read.
| `TAG_UNREGISTERED` | `00000000DEAD01` | tag id linked to no product |

## Layout

```text
.maestro/
├── config.yaml     workspace config — flow discovery + default tag exclusions
├── common/         reusable subflows, called by name (never run standalone)
└── flows/
    ├── 01-launch/       cold start, tab bar, scan FAB visibility (§4, §8)
    ├── 02-register/     registration entry, methods, skip, email + phone (§4, §7)
    ├── 03-login/        sign-in options, errors, forgot password (§4, §7)
    ├── 04-discover/     public feed, search, pull-to-refresh, detail (§5, §9)
    ├── 05-marketplace/  feed sections, category/search switch, detail (§5, §9)
    ├── 06-gated-tabs/   collections/profile gating + SignInPopup (§4, §7)
    ├── 07-nfc-scan/     scan screen, toggle, guards, tag normalization (§8)
    ├── 08-claim/        the claim state machine, every outcome (§8)
    ├── 09-verify/       read-only authenticity + ledger (§8, §9)
    ├── 10-deeplinks/    tap-to-launch URLs, sso-callback, error screens (§7, §8)
    └── 11-settings/     settings, edit profile, sign out (§5, §9)
```

## Writing new flows — six things that will bite you

All six were found the hard way while building this suite.

0. **Don't use `scrollUntilVisible` on the feed screens.** It swipes down the middle
   of the screen, which lands on a horizontal `FlatList` of cards; that list
   swallows the pan and the page never moves, so the search fails intermittently
   depending on where the card rows happen to sit. Use
   `common/scroll-to.yaml`, which swipes along the left edge instead.

1. **Text matching is a full-string regex, not a substring match.** `"Already have
   an account"` does not match the node `"Already have an account?"`, and `?`
   inside a selector is a regex quantifier, not a literal. Use
   `".*have an account.*"`. Nested `<Text>` spans arrive as one node, so the whole
   concatenated string has to match. Matching *is* case-insensitive, which is why
   `"Or enter a tag id"` matches the uppercased `OR ENTER A TAG ID`.
2. **Never use `hideKeyboard`.** On Android it presses BACK, which pops the current
   route or dismisses the open dialog — the flow then fails somewhere further down
   with a confusing "element not found". Use `- pressKey: Enter`, which closes the
   keyboard and navigates nowhere.
3. **A subflow's own `env:` default overrides the value the caller passes** through
   `runFlow: env:`. Parameters a subflow *requires* must therefore be left
   undeclared in its header (see `common/scan-manual-tag.yaml`); only genuinely
   global values like `APP_ID` get a default there.
4. **A deep link has to BE the launch intent.** `launchApp` immediately followed by
   `openLink` loses the URL: the `index.tsx` redirect races it and wins. Insert
   `- stopApp` between them, which is also the honest reproduction of tap-to-launch
   with the app closed.
5. **Tab labels collide with header titles.** `MainHeader` renders the screen name
   as a heading, so on the discover tab `"Discover"` matches both the heading and
   the tab button. Tapping a tab is only unambiguous when you are not already on
   it; otherwise pass an `index`. Same for the scan screen, where the Claim/Verify
   mode toggle (`index: 0`) and the manual-entry buttons (`index: 1`) share labels.

The app declares no `testID`s, so every selector here is visible copy or an
`accessibilityLabel`. Changing user-facing strings will break flows — that is
intentional, but adding `testID`s to the key controls would make this suite
considerably more stable. Two places where it would help most:

- **`MainHeader`'s settings button** is icon-only with no label, so the
  `signed-in` flows reach it with `tapOn: point: 92%, 9%` — the one geometric
  selector in the suite, and the one thing a header layout change will break.
- **The tab bar**, for the label/heading collision described above.

## Known gaps found while writing these flows

- **`register/index.tsx` renders `Step2Screen`.** AGENTS.md §4 calls it "step 1",
  but the `Step1Screen` import is commented out, so `Step1Screen` (the
  "EXTRAORDINARY" hero with *Continue with Tap* / *Enter Code Manually*) is
  unreachable dead code and both `/register` and `/register/step2` render the same
  screen. Pinned by `flows/02-register/register-entry.yaml`.
- **The `NDEF_DISCOVERED` intent filter is missing** from
  `android/app/src/main/AndroidManifest.xml`. AGENTS.md §8 documents it as a hand
  edit that `expo prebuild --clean` wipes — it is currently wiped, so a real chip
  tap will not launch the app. Only the `ACTION_VIEW` path is testable here, which
  is what `flows/10-deeplinks/deeplink-claim-cold-start.yaml` exercises.
- **Emulators have no NFC radio**, so no flow can drive a physical tap. The scan
  screen's manual tag-id entry runs the same `normalizeTagId()` → route path a tap
  would, which is what these flows use.
