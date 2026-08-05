// Failure register: every failure observed while bringing the suite up, with root
// cause, fix and current status. Consumed by build-pdf.js.
module.exports = {
  summaryHtml: `
<p>The <strong>33-flow default suite passes end to end</strong>. Four further
<span class="tag tag-data">needs-tag</span> flows were unlocked by sourcing a live
tag id from the public API, and the <span class="tag tag-offline">offline</span>
flow was run directly &mdash; <strong>38 flows executed, 38 green</strong>.</p>
<p>The remaining <strong>18</strong> are blocked on inputs this repo cannot hold:
11 need a real Clerk account (<span class="tag tag-auth">signed-in</span>), 5 send a
real email OTP / SMS / OAuth browser (<span class="tag tag-live">live</span>), and 2
need a tag that is genuinely CLAIMED &mdash; currently impossible on QA because of
<strong>A1</strong> below.</p>
<p>Nothing was silently skipped: every flow's status is listed in the inventory.</p>`,

  findingsHtml: `
<p>Two classes of finding came out of this work. <strong>Application defects</strong>
(A&hellip;) are real problems in the product or its data. <strong>Suite defects</strong>
(S&hellip;) are mistakes in the flows themselves &mdash; every one is fixed, and each is
recorded because the failure mode was non-obvious and will recur.</p>

<h3>Application defects &mdash; open</h3>

<div class="finding">
  <h4>A1 &nbsp;·&nbsp; <code>normalizeTagId()</code> makes 5 of 6 registered tags unverifiable</h4>
  <p><strong>Symptom.</strong> Verifying or claiming <code>nfc-ptv-001</code> shows
  <em>"Product is not registered"</em>. Every one of the four products that are actually
  CLAIMED on QA is affected, so the owned-card and ledger paths cannot be reached from
  the app at all.</p>
  <p><strong>Root cause.</strong> <code>normalizeTagId()</code> (<code>src/lib/nfc.ts</code>)
  strips separators and upper-cases every id, so <code>nfc-ptv-001</code> &rarr;
  <code>NFCPTV001</code>. Confirmed against the live API:
  <code>GET /api/v1/verify/nfc-ptv-001</code> &rarr; 200 but
  <code>GET /api/v1/verify/NFCPTV001</code> &rarr; 404 (same for
  <code>/products/tag/:tagId</code>). AGENTS.md §8 requires the normalized value to match
  <code>Product.tagId</code> exactly; the seeded data does not satisfy that. Only the demo
  tag <code>534A70C1610001</code> is already in normalized form.</p>
  <p><strong>Reproduce.</strong>
  <code>adb shell am start -a android.intent.action.VIEW -d "hitboxstatic://verify/nfc-ptv-001"</code>
  &rarr; the screen shows <em>SCANNED TAG = NFCPTV001</em> and the not-registered card.</p>
  <p><strong>Fix (needs a product decision).</strong> Either (1) treat tag ids as opaque and
  normalize only when the input looks like a raw NFC UID (hex with separators), passing
  slug-style ids through unchanged; or (2) re-seed the backend so every
  <code>Product.tagId</code> is already normalized. Add unit tests for
  <code>normalizeTagId()</code> covering a separator-delimited hex UID, an
  already-normalized id, and a lowercase-hyphenated slug, then correct the AGENTS.md §8
  note. <em>Blocks:</em> <code>claim-already-claimed</code>,
  <code>verify-genuine-and-ledger</code>.</p>
</div>

<div class="finding">
  <h4>A2 &nbsp;·&nbsp; The NFC <code>NDEF_DISCOVERED</code> intent filter is missing</h4>
  <p><strong>Symptom.</strong> Tapping a physical chip will not launch the app.</p>
  <p><strong>Root cause.</strong> <code>android/app/src/main/AndroidManifest.xml</code>
  declares only an <code>ACTION_VIEW</code> filter for the <code>hitboxstatic</code> scheme.
  Android dispatches <code>ACTION_NDEF_DISCOVERED</code> &mdash; not
  <code>ACTION_VIEW</code> &mdash; for an NDEF URI record. AGENTS.md §8 documents the needed
  block as a hand edit that <code>expo prebuild --clean</code> wipes; it is currently wiped.</p>
  <p><strong>Fix.</strong> Add a local config plugin using <code>withAndroidManifest</code>
  so the filter is generated rather than hand-added (<code>app.json</code>'s
  <code>android.intentFilters</code> cannot express it &mdash; Expo hardcodes the
  <code>android.intent.action.</code> prefix), and re-add the block to the committed manifest.</p>
  <p><strong>Coverage note.</strong> <code>deeplink-claim-cold-start</code> exercises the
  <code>ACTION_VIEW</code> path only, so its passing does <em>not</em> prove tap-to-launch works.
  The flow header says so.</p>
</div>

<div class="finding warn">
  <h4>A3 &nbsp;·&nbsp; Registration step 1 is unreachable dead code</h4>
  <p><strong>Root cause.</strong> <code>src/app/(auth)/register/index.tsx</code> renders
  <code>Step2Screen</code> &mdash; the <code>Step1Screen</code> import is commented out. So
  <code>/register</code> and <code>/register/step2</code> render the same screen and
  <code>Step1Screen</code> (the "EXTRAORDINARY" hero with <em>Continue with Tap</em> /
  <em>Enter Code Manually</em>) can never be seen. AGENTS.md §4 still describes
  <code>index.tsx</code> as step 1.</p>
  <p><strong>Fix.</strong> Decide whether step 1 is being retired &mdash; then either delete
  <code>Step1Screen</code> and its components, or restore the import &mdash; and correct
  AGENTS.md §4 either way. Pinned meanwhile by
  <code>flows/02-register/register-entry.yaml</code>, which fails loudly if it is rewired.</p>
</div>

<div class="finding info">
  <h4>A4 &nbsp;·&nbsp; QA tag state is not stable enough to assert against</h4>
  <p><strong>Observation.</strong> The demo tag <code>534A70C1610001</code> went from
  CLAIMED (owner "Subrata Das", 1 ledger row) to UNCLAIMED (no owner, 0 rows) within one
  afternoon, which failed two flows mid-run and cost a debugging cycle chasing a
  non-existent app bug.</p>
  <p><strong>Consequence for the suite.</strong> Every tag-dependent flow is
  <span class="tag tag-data">needs-tag</span> and opt-in rather than part of the default run,
  and the README documents a one-line check of the tag's live state before choosing which
  variable to point at it. A dedicated, non-shared seed tag per state would let these flows
  join the default suite.</p>
</div>

<h3>Suite defects &mdash; all fixed</h3>

<div class="finding">
  <h4>S1 &nbsp;·&nbsp; A declared <code>env:</code> default silently beats <code>-e</code></h4>
  <p><strong>Symptom.</strong> <code>maestro test -e TAG_UNCLAIMED=&hellip;</code> had no
  effect: flows typed nothing into the tag field and failed much later on an unrelated
  assertion. Cost the longest debugging cycle of the exercise.</p>
  <p><strong>Root cause.</strong> A flow header's <code>env:</code> block is an assignment
  executed at flow start, so it overwrites the value passed by <code>runFlow: env:</code>
  <em>and</em> the value from the command line. Flows declaring <code>TAG_UNCLAIMED: ""</code>
  as a "documentation placeholder" could therefore never be parameterised. Proven by a
  two-line flow: <code>env: FOO: "declared"</code> + <code>assertTrue: \${FOO == 'cli'}</code>
  fails under <code>-e FOO=cli</code>.</p>
  <p><strong>Fix.</strong> Removed all 31 placeholder defaults; a required parameter is now
  undeclared, so omitting it leaves <code>\${VAR}</code> unresolved and fails loudly. Same rule
  applied to subflows (<code>common/scan-manual-tag.yaml</code>). Documented as pitfall #3.</p>
</div>

<div class="finding">
  <h4>S2 &nbsp;·&nbsp; A <code>"</code> in a flow <code>name:</code> aborts the whole run on Windows</h4>
  <p><strong>Symptom.</strong> Batches silently stopped after two flows; the remaining flows
  never ran and were not reported as skipped.</p>
  <p><strong>Root cause.</strong> Maestro names each flow's artifact directory after
  <code>name:</code>. <code>Claim screen "do this later" leaves without claiming</code> produced
  <code>java.nio.file.InvalidPathException: Illegal char &lt;"&gt; at index 13</code>, which took
  down the suite runner rather than that one flow. <code>/</code> is sanitised to <code>_</code>;
  <code>"</code> is not.</p>
  <p><strong>Fix.</strong> Renamed the two affected flows. Keep flow names free of
  <code>" &lt; &gt; : | ? *</code> on Windows.</p>
</div>

<div class="finding">
  <h4>S3 &nbsp;·&nbsp; <code>hideKeyboard</code> presses BACK on Android</h4>
  <p><strong>Symptom.</strong> Seven flows failed on assertions far below the keyboard step
  &mdash; "element not found: Sign In", a search that never restored the feed, taps that did
  nothing.</p>
  <p><strong>Root cause.</strong> <code>hideKeyboard</code> sends a back press, which popped
  the scan route and dismissed the sign-in dialog. Caught by dumping the hierarchy right after
  the step and finding the app back on the discover tab.</p>
  <p><strong>Fix.</strong> Replaced every use with <code>- pressKey: Enter</code>, which closes
  the keyboard and navigates nowhere. Documented as pitfall #2.</p>
</div>

<div class="finding">
  <h4>S4 &nbsp;·&nbsp; Text selectors are full-string regexes</h4>
  <p><strong>Symptom.</strong> 8 of the first 12 flows failed on assertions whose copy was
  visibly on screen.</p>
  <p><strong>Root cause.</strong> Maestro matches the <em>entire</em> node text as a regex, and
  <code>?</code> is a quantifier &mdash; so <code>"Already have an account"</code> never matches
  the node <code>"Already have an account?"</code>. Nested <code>&lt;Text&gt;</code> spans arrive
  as one concatenated node, so <code>"Terms of Service"</code> could not match
  <em>"By continuing, you agree to HitBox's&hellip;Terms of Service and Privacy Policy."</em></p>
  <p><strong>Fix.</strong> Partial matches written as <code>".*fragment.*"</code>. Matching is
  case-insensitive, which is why <code>"Or enter a tag id"</code> matches the uppercased
  <code>OR ENTER A TAG ID</code>. Documented as pitfall #1.</p>
</div>

<div class="finding">
  <h4>S5 &nbsp;·&nbsp; <code>scrollUntilVisible</code> is swallowed by horizontal lists</h4>
  <p><strong>Symptom.</strong> <em>"No visible element found: Latest Releases"</em> &mdash;
  intermittently, and it passed in isolation, which is the signature of a genuine flake.</p>
  <p><strong>Root cause.</strong> <code>scrollUntilVisible</code> swipes down the middle of the
  screen, landing on one of the feed's horizontal <code>FlatList</code>s, which consumes the pan
  so the page never moves. Whether it hits depends on where the card rows sit. Reducing
  <code>speed</code> did not help; explicit swipes at <code>x=5%</code> reached the section every
  time.</p>
  <p><strong>Fix.</strong> Added <code>common/scroll-to.yaml</code> &mdash; a bounded
  <code>repeat&nbsp;while notVisible</code> loop swiping the left edge &mdash; and used it on
  every long screen. Documented as pitfall #0.</p>
</div>

<div class="finding">
  <h4>S6 &nbsp;·&nbsp; A deep link delivered to a starting app is lost</h4>
  <p><strong>Symptom.</strong> Four deep-link flows failed; the app sat on the registration
  screen as if <code>openLink</code> had done nothing.</p>
  <p><strong>Root cause.</strong> <code>launchApp</code> immediately followed by
  <code>openLink</code> races the <code>index.tsx</code> redirect, which wins and replaces the
  route. Force-stopping first made the same URL resolve every time.</p>
  <p><strong>Fix.</strong> <code>- stopApp</code> between the two, which is also the honest
  reproduction of tap-to-launch with the app closed. Documented as pitfall #4.</p>
</div>

<div class="finding">
  <h4>S7 &nbsp;·&nbsp; Duplicate labels made taps hit the wrong control</h4>
  <p><strong>Symptom.</strong> <code>signin-popup-navigation</code> tapped "Sign Up" and nothing
  happened (5m of retries). The scan screen's Claim/Verify taps hit the mode toggle instead of
  the manual-entry buttons.</p>
  <p><strong>Root cause.</strong> <code>MainHeader</code> renders a "Sign Up" button while signed
  out, so the label existed twice &mdash; once behind the modal overlay, where a tap is
  swallowed. <code>rightOf</code> did not disambiguate (it compares one axis only). The scan
  screen has two "Claim" and two "Verify" labels.</p>
  <p><strong>Fix.</strong> Scoped with <code>below: "OR CONTINUE WITH"</code> for the popup and
  <code>index: 0/1</code> on the scan screen; tabs are only tapped from a different tab, since a
  tab label collides with the header heading of the same name. Documented as pitfall #5/#6.</p>
</div>

<div class="finding">
  <h4>S8 &nbsp;·&nbsp; Assertions on content below the fold</h4>
  <p><strong>Symptom.</strong> <em>"Claim My Item" is not visible</em> on a claim screen that had
  clearly rendered &mdash; the header, product card and ledger count were all present.</p>
  <p><strong>Root cause.</strong> Maestro only matches <em>visible</em> elements. The Claim button
  sits below <code>Step3Features</code>, off the first screenful. Same for the register form's
  Submit button and the ledger rows.</p>
  <p><strong>Fix.</strong> Assert something above the fold first, then
  <code>scroll-to.yaml</code> to the control before touching it.</p>
</div>

<div class="finding info">
  <h4>S9 &nbsp;·&nbsp; Environment: the pre-existing debug APK could not run the current JS</h4>
  <p><strong>Symptom.</strong> Black screen; <code>Cannot find native module 'ExpoCrypto'</code>,
  then <code>TypeError: Cannot read property 'ErrorBoundary' of undefined</code>.</p>
  <p><strong>Root cause.</strong> The committed <code>app-debug.apk</code> predated the
  <code>expo-crypto</code> dependency, and the dev client already installed on the emulator
  (<code>app.hitbox.mobile</code>) was built from a different configuration
  (<code>Worklets 0.8.3 JS vs 0.10.0 native</code>, no <code>ExponentImagePicker</code>).</p>
  <p><strong>Fix.</strong> Rebuilt from this tree with
  <code>./gradlew assembleRelease -PreactNativeArchitectures=x86_64</code> (~3.5&nbsp;min warm).
  A release build is now the documented target: no LogBox toasts over the bottom of the screen
  and no Metro dependency.</p>
</div>`,
};
