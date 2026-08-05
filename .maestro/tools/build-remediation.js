// Builds the remediation plan PDF — how to fix each defect the E2E suite found.
//
// Self-contained on purpose: content, styling and the print step all live here, so
// regenerating it is one command with no inputs to keep in sync.
//   node .maestro/tools/build-remediation.js .maestro/E2E-remediation-plan.pdf
//
// Printed through headless Chrome because there is no usable Python on this machine
// (the `python` on PATH is the Windows Store stub).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const outPdf = process.argv[2] || 'E2E-remediation-plan.pdf';

const CSS = `
  @page { size: A4; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.5 "Segoe UI", system-ui, sans-serif; color: #18181b; margin: 0; }
  h1 { font-size: 22pt; margin: 0 0 2mm; letter-spacing: -0.4pt; }
  h2 { font-size: 13pt; margin: 9mm 0 3mm; padding-bottom: 1.5mm;
       border-bottom: 1.6pt solid #6C5CE7; letter-spacing: -0.2pt; }
  h3 { font-size: 11pt; margin: 6mm 0 2mm; }
  h4 { font-size: 9.5pt; margin: 4mm 0 1.5mm; color: #3f3f46;
       text-transform: uppercase; letter-spacing: 0.5pt; }
  p, li { margin: 0 0 2.5mm; }
  ul, ol { margin: 0 0 3mm; padding-left: 6mm; }
  li { margin-bottom: 1.5mm; }
  .lede { color: #52525b; font-size: 11pt; }
  .meta { color: #71717a; font-size: 8.5pt; margin-bottom: 6mm; }
  code, .mono { font-family: Consolas, "Cascadia Mono", monospace; font-size: 8.5pt; }
  code { background: #f4f4f5; padding: 0.4mm 1mm; border-radius: 1mm; }
  pre { background: #18181b; color: #e4e4e7; padding: 3mm 4mm; border-radius: 2mm;
        font-family: Consolas, monospace; font-size: 8pt; line-height: 1.45;
        white-space: pre-wrap; margin: 0 0 4mm; }
  pre .c { color: #a1a1aa; }
  pre .add { color: #86efac; }
  pre .del { color: #fca5a5; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 4mm; }
  th, td { text-align: left; padding: 1.6mm 2mm; border-bottom: 0.4pt solid #e4e4e7;
           vertical-align: top; font-size: 9pt; }
  th { background: #fafafa; font-size: 8pt; text-transform: uppercase;
       letter-spacing: 0.4pt; color: #52525b; border-bottom: 0.8pt solid #d4d4d8; }
  .pill { display: inline-block; font-size: 7.5pt; padding: 0.4mm 1.6mm; border-radius: 1mm;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.3pt; }
  .p-block { background: #fee2e2; color: #b91c1c; }
  .p-high { background: #fed7aa; color: #c2410c; }
  .p-med { background: #fef3c7; color: #a16207; }
  .p-low { background: #e4e4e7; color: #52525b; }
  .fix { border: 0.6pt solid #e4e4e7; border-left: 2.4pt solid #6C5CE7;
         border-radius: 0 2mm 2mm 0; padding: 3mm 3.5mm; margin: 0 0 5mm; }
  .fix > h3 { margin-top: 0; }
  .fix.rec { border-left-color: #16a34a; background: #f0fdf4; }
  .fix.alt { border-left-color: #a1a1aa; background: #fafafa; }
  .tick { color: #16a34a; font-weight: 700; }
  .cross { color: #dc2626; font-weight: 700; }
  .note { background: #eff6ff; border-left: 2.4pt solid #2563eb; padding: 2.5mm 3mm;
          border-radius: 0 1.5mm 1.5mm 0; margin: 0 0 4mm; }
  .warn { background: #fffbeb; border-left: 2.4pt solid #d97706; padding: 2.5mm 3mm;
          border-radius: 0 1.5mm 1.5mm 0; margin: 0 0 4mm; }
  .note p:last-child, .warn p:last-child, .fix p:last-child { margin-bottom: 0; }
  .page-break { page-break-before: always; }
  .keep { page-break-inside: avoid; }
`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>HitBox — E2E remediation plan</title>
<style>${CSS}</style></head>
<body>

<h1>HitBox mobile — remediation plan</h1>
<p class="lede">How to fix each defect the Maestro E2E suite surfaced, and how to unblock
the 18 flows that cannot run yet. Companion to
<code>.maestro/E2E-suite-and-findings.pdf</code>, which describes the defects; this
document is only about resolving them.</p>
<p class="meta">Prepared 2026-08-04 &middot; every code sample below is against the current tree
and every verification command was run on the Pixel_7 emulator used for the suite.</p>

<h2>Order of work</h2>
<table>
  <thead><tr><th>#</th><th>Item</th><th>Priority</th><th>Owner</th><th>Effort</th><th>Unblocks</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Tag-id lookup mismatch (A1)</td><td><span class="pill p-block">blocker</span></td><td>backend, then client</td><td>~1&nbsp;h + ~1&nbsp;h</td><td>4 claimed products become usable; 2 E2E flows</td></tr>
    <tr><td>2</td><td>E2E test account (T1)</td><td><span class="pill p-high">high</span></td><td>whoever owns the Clerk dev instance</td><td>~15&nbsp;min</td><td>11 E2E flows</td></tr>
    <tr><td>3</td><td><code>NDEF_DISCOVERED</code> filter (A2)</td><td><span class="pill p-high">high</span></td><td>mobile</td><td>~1&nbsp;h</td><td>real tap-to-launch; 1 new flow</td></tr>
    <tr><td>4</td><td>Dedicated E2E seed tags (A4)</td><td><span class="pill p-med">medium</span></td><td>backend</td><td>~30&nbsp;min</td><td>6 flows join the default suite</td></tr>
    <tr><td>5</td><td>Deterministic OTP for <code>live</code> flows (T2)</td><td><span class="pill p-med">medium</span></td><td>mobile + Clerk config</td><td>~1&nbsp;h</td><td>5 E2E flows</td></tr>
    <tr><td>6</td><td>Registration step 1 dead code (A3)</td><td><span class="pill p-low">low</span></td><td>mobile</td><td>~30&nbsp;min</td><td>&mdash; (hygiene, doc accuracy)</td></tr>
    <tr><td>7</td><td><code>testID</code>s on two controls (H1)</td><td><span class="pill p-low">low</span></td><td>mobile</td><td>~20&nbsp;min</td><td>removes the suite's only geometric selector</td></tr>
  </tbody>
</table>
<p>Items 1&ndash;2 are worth doing before anything else: together they take the suite from 38
executed flows to 51, and item 1 is a live product defect, not just a test problem.</p>

<h2>1 &nbsp;·&nbsp; A1 — tag-id lookup mismatch</h2>
<p><strong>What is broken.</strong> <code>normalizeTagId()</code> upper-cases and strips
every non-alphanumeric character, so the printed id <code>nfc-ptv-001</code> is sent as
<code>NFCPTV001</code>, which the backend does not have. All four products that are actually
CLAIMED on QA use that id style, so the app shows <em>"Product is not registered"</em> for
every one of them. Confirmed:</p>
<pre>GET /api/v1/verify/nfc-ptv-001   <span class="c">→ 200</span>
GET /api/v1/verify/NFCPTV001     <span class="c">→ 404</span>
<span class="c"># same for /api/v1/products/tag/:tagId</span></pre>

<div class="fix rec">
  <h3>Fix 1 &nbsp;<span class="tick">&check; recommended, do this first</span> &nbsp;<span class="pill p-block">backend</span></h3>
  <p><strong>Make the lookup normalization-insensitive on the server.</strong> Resolve a tag by
  comparing <em>normalized forms</em> rather than raw strings, in both
  <code>GET /verify/:tagId</code> and <code>GET /products/tag/:tagId</code> (and the
  <code>POST /claims/:tagId</code> pair, which take the same id).</p>
  <p>Conceptually: store or index a normalized column and match on it.</p>
<pre><span class="c">-- one-off: add the canonical column + index</span>
ALTER TABLE products ADD COLUMN tag_id_normalized text
  GENERATED ALWAYS AS (upper(regexp_replace(tag_id, '[^0-9A-Za-z]', '', 'g'))) STORED;
CREATE UNIQUE INDEX products_tag_id_normalized_key ON products (tag_id_normalized);</pre>
<pre><span class="c">// lookup, in the products/claims repository</span>
const canonical = tagId.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
return db.product.findFirst({ where: { tagIdNormalized: canonical } });</pre>
  <p><strong>Why this one.</strong> It fixes every row already in the database, needs
  <em>no app release</em>, and makes both id styles work forever &mdash; a printed
  <code>nfc-ptv-001</code>, a chip UID <code>53:4A:70:C1:61:00:01</code> and a hand-typed
  <code>534a70c1610001</code> all resolve to the same product. It also removes the standing
  trap that AGENTS.md §8 warns about ("that normalized string must match
  <code>Product.tagId</code> exactly"), because exact matching is no longer required.</p>
  <p><strong>Watch for.</strong> The unique index will reject two products whose ids differ
  only by case or separators. Check for collisions before adding it:</p>
<pre>SELECT upper(regexp_replace(tag_id,'[^0-9A-Za-z]','','g')) AS n, count(*)
FROM products WHERE tag_id IS NOT NULL GROUP BY n HAVING count(*) &gt; 1;</pre>
</div>

<div class="fix">
  <h3>Fix 2 &nbsp;<span class="tick">&check; do as well</span> &nbsp;<span class="pill p-high">client</span></h3>
  <p><strong>Only normalize what actually looks like a chip UID.</strong> Defence in depth: even
  with Fix 1 shipped, the client should stop rewriting ids it has no business rewriting, so a
  future id style (say one that is case-sensitive) is not silently mangled.</p>
  <p><code>src/lib/nfc.ts</code>:</p>
<pre><span class="c">/** Chip UIDs are hex byte pairs, optionally separated by ':', '-' or spaces. */</span>
<span class="add">+const HEX_UID = /^[0-9a-fA-F]{2}([:\\-\\s]?[0-9a-fA-F]{2})+$/;</span>

<span class="c">/**
  * Canonical tag id.
  *
  * A chip UID arrives as separator-delimited hex ("53:4A:70:C1:61:00:01") while the
  * backend stores it stripped and upper-cased ("534A70C1610001"), so that shape is
  * normalized. Anything else — a printed slug such as "nfc-ptv-001" — is an id the
  * backend stores verbatim, and rewriting it produced a 404, so it is only trimmed.
  */</span>
 export function normalizeTagId(raw?: string | null): string {
<span class="del">-    return (raw ?? '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase();</span>
<span class="add">+    const value = (raw ?? '').trim();</span>
<span class="add">+    if (!value) return '';</span>
<span class="add">+    if (HEX_UID.test(value)) return value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();</span>
<span class="add">+    return value;</span>
 }</pre>
  <p>No call-site changes are needed &mdash; the four callers
  (<code>(routes)/claim/[tagId].tsx</code>, <code>(routes)/verify/[tagId].tsx</code> and two
  in <code>ScanScreen.tsx</code>) keep working as-is, which is exactly why the whole rule
  belongs in this one function.</p>
  <div class="warn">
    <p><strong>Known limit of the heuristic.</strong> A slug that happens to be all hex
    (<code>abc123</code>) still gets upper-cased, because it is indistinguishable from a short
    UID. That is precisely why Fix 1 is the primary change and this is the secondary one.</p>
  </div>
</div>

<div class="fix alt">
  <h3>Alternative &nbsp;<span class="cross">&cross; not recommended</span></h3>
  <p><strong>Re-seed the backend so every <code>tag_id</code> is already normalized</strong>
  (<code>NFCPTV001</code> instead of <code>nfc-ptv-001</code>). It needs no code change, but it
  invalidates anything already printed or encoded on a physical chip, has to be repeated for
  every future seed, and leaves the underlying fragility in place. Reasonable only if no
  <code>nfc-*</code> id has ever been printed.</p>
</div>

<h4>Tests to add</h4>
<p>New file <code>src/lib/__tests__/nfc.test.ts</code> &mdash; <code>normalizeTagId</code> is pure,
so it needs no native mocks:</p>
<pre>import { normalizeTagId } from '../nfc';

describe('normalizeTagId', () =&gt; {
  it('normalizes a separator-delimited chip UID', () =&gt; {
    expect(normalizeTagId('53:4A:70:C1:61:00:01')).toBe('534A70C1610001');
    expect(normalizeTagId('53-4a-70-c1-61-00-01')).toBe('534A70C1610001');
  });

  it('leaves an already-canonical id alone', () =&gt; {
    expect(normalizeTagId('534A70C1610001')).toBe('534A70C1610001');
  });

  <span class="c">// The regression: this id exists verbatim on the backend, and rewriting it 404s.</span>
  it('passes a printed slug id through untouched', () =&gt; {
    expect(normalizeTagId('nfc-ptv-001')).toBe('nfc-ptv-001');
  });

  it('handles empty input', () =&gt; {
    expect(normalizeTagId(undefined)).toBe('');
    expect(normalizeTagId('  ')).toBe('');
  });
});</pre>

<h4>How to verify</h4>
<pre><span class="c"># 1. unit</span>
npm test -- nfc

<span class="c"># 2. API, after Fix 1 — both spellings must resolve</span>
curl -s -o /dev/null -w "%{http_code}\\n" "$API/api/v1/verify/nfc-ptv-001"
curl -s -o /dev/null -w "%{http_code}\\n" "$API/api/v1/verify/NFCPTV001"

<span class="c"># 3. on device — must show the owned card, not "Product is not registered"</span>
adb shell am force-stop com.subratadasdev1.hitboxstatic
adb shell am start -a android.intent.action.VIEW -d "hitboxstatic://verify/nfc-ptv-001"

<span class="c"># 4. the two blocked flows, with a genuinely claimed tag</span>
maestro test -e TAG_CLAIMED=nfc-ptv-001 \\
  .maestro/flows/08-claim/claim-already-claimed.yaml \\
  .maestro/flows/09-verify/verify-genuine-and-ledger.yaml</pre>
<p>Then drop the <code>needs-tag</code> tag from those two flows so they join the default
suite, and correct the "Tag id normalization" paragraph in AGENTS.md §8 plus the
<em>Known gaps</em> entry in <code>.maestro/README.md</code>.</p>

<h2 class="page-break">2 &nbsp;·&nbsp; T1 — E2E test account (unblocks 11 flows)</h2>
<p>Eleven <code>signed-in</code> flows (collections, profile, settings, edit-profile,
view-all, owned-tag) need a Clerk account that already has a backend user row. Nothing in
the repo can hold one, which is the only reason they have not run.</p>
<ol>
  <li><strong>Create a dedicated account</strong> in the Clerk <em>development</em> instance —
      e.g. <code>hitbox-e2e@yourdomain.test</code>. Do not reuse a personal account: the
      <code>destructive</code> flows edit the profile and sign out.</li>
  <li><strong>Confirm the backend row exists</strong> before relying on it. A brand-new Clerk
      user returns <code>401 AUTH_ACCOUNT_NOT_FOUND</code> until the <code>user.created</code>
      webhook is processed (AGENTS.md §7). Sign in once by hand, then check
      <code>GET /api/v1/users/me</code>.</li>
  <li><strong>Run the group:</strong></li>
</ol>
<pre>maestro test .maestro --include-tags signed-in \\
  -e EMAIL="$E2E_EMAIL" -e PASSWORD="$E2E_PASSWORD"</pre>
<div class="warn">
  <p><strong>Do not add <code>EMAIL: ""</code> back into a flow header.</strong> A declared
  <code>env:</code> default overrides the value from <code>-e</code>, so the flow would silently
  receive an empty string and fail much later. This is finding S1 in the companion document and
  the reason those placeholders were removed.</p>
</div>
<p><strong>In CI</strong>, keep the values in the runner's secret store and pass them exactly as
above. Never commit them, and never put them in <code>.env</code> — that file is baked into the
build and only <code>EXPO_PUBLIC_*</code> keys belong there.</p>

<h2>3 &nbsp;·&nbsp; A2 — restore the <code>NDEF_DISCOVERED</code> intent filter</h2>
<p>Tap-to-launch is dead: Android dispatches <code>ACTION_NDEF_DISCOVERED</code> for an NDEF URI
record, and the manifest only declares <code>ACTION_VIEW</code>. AGENTS.md §8 documents the
needed block as a hand edit that <code>expo prebuild --clean</code> wipes; it is currently wiped.
Add it as a config plugin so it cannot be lost again.</p>
<p>New file <code>plugins/withNfcNdefIntentFilter.js</code>:</p>
<pre>const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

const SCHEME = 'hitboxstatic';
const ACTION = 'android.nfc.action.NDEF_DISCOVERED';

<span class="c">/**
 * Adds the intent filter that tap-to-launch needs.
 *
 * app.json's android.intentFilters cannot express this — Expo hardcodes the
 * "android.intent.action." prefix — and react-native-nfc-manager's plugin only
 * adds the NFC permission. Without it a chip tap does not open the app.
 */</span>
module.exports = function withNfcNdefIntentFilter(config) {
  return withAndroidManifest(config, (cfg) =&gt; {
    const activity = AndroidConfig.Manifest.getMainActivityOrThrow(cfg.modResults);
    activity['intent-filter'] = activity['intent-filter'] ?? [];

    <span class="c">// Idempotent: prebuild may run against an already-patched manifest.</span>
    const present = activity['intent-filter'].some((f) =&gt;
      f.action?.some((a) =&gt; a.$['android:name'] === ACTION),
    );
    if (present) return cfg;

    activity['intent-filter'].push({
      action: [{ $: { 'android:name': ACTION } }],
      category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      data: [{ $: { 'android:scheme': SCHEME } }],
    });
    return cfg;
  });
};</pre>
<p>Register it in <code>app.json</code>, after the NFC plugin:</p>
<pre> "plugins": [
   "expo-router",
   [ "expo-splash-screen", { … } ],
   [ "react-native-nfc-manager", { "nfcPermission": "…" } ],
<span class="add">+  "./plugins/withNfcNdefIntentFilter",</span>
   "expo-secure-store"
 ]</pre>
<h4>How to verify</h4>
<pre><span class="c"># the filter survives a clean prebuild</span>
npx expo prebuild --platform android --no-install
grep -A3 NDEF_DISCOVERED android/app/src/main/AndroidManifest.xml

<span class="c"># the NDEF path itself — this is the intent a real chip sends,</span>
<span class="c"># and it fails today while the ACTION_VIEW equivalent succeeds</span>
adb shell am force-stop com.subratadasdev1.hitboxstatic
adb shell am start -a android.nfc.action.NDEF_DISCOVERED \\
  -d "hitboxstatic://claim/534A70C1610001"</pre>
<div class="note">
  <p><strong>Add a flow once this lands.</strong> That second command makes the NDEF path
  testable, which it is not today. Copy
  <code>flows/10-deeplinks/deeplink-claim-cold-start.yaml</code> to
  <code>deeplink-claim-ndef.yaml</code> and drive it with an <code>evalScript</code>/shell step
  firing the <code>NDEF_DISCOVERED</code> intent, then remove the caveat from the existing
  flow's header — it currently states that passing does <em>not</em> prove tap-to-launch works.</p>
</div>

<h2 class="page-break">4 &nbsp;·&nbsp; A4 — dedicated E2E seed tags</h2>
<p>The shared demo tag <code>534A70C1610001</code> flipped from CLAIMED to UNCLAIMED inside one
afternoon, which failed two flows mid-run and cost a debugging cycle chasing a non-existent app
bug. Any flow asserting a specific ownership state cannot depend on data someone else demos with.</p>
<p>Seed three products on QA that are reserved for automation and documented as such:</p>
<table>
  <thead><tr><th>Suggested <code>tag_id</code></th><th>Required state</th><th>Used by</th></tr></thead>
  <tbody>
    <tr><td class="mono">E2EUNCLAIMED0001</td><td>UNCLAIMED, no owner</td><td><code>claim-verified-unclaimed</code>, <code>claim-signed-out-asks-signin</code>, <code>claim-later-link</code>, <code>verify-unclaimed-offers-claim</code></td></tr>
    <tr><td class="mono">E2ECLAIMED0001</td><td>CLAIMED by any other user, ≥1 ledger row</td><td><code>claim-already-claimed</code>, <code>verify-genuine-and-ledger</code></td></tr>
    <tr><td class="mono">E2EOWNED0001</td><td>CLAIMED by the T1 test account</td><td><code>claim-owned-by-you</code></td></tr>
  </tbody>
</table>
<p>Ids in canonical form (upper-case, no separators) so they are unaffected by A1 either way.
Then in the suite: point the <code>TAG_*</code> variables at them, drop <code>needs-tag</code>
from the six flows, and remove the <em>"check the tag's live state first"</em> note from
<code>.maestro/README.md</code>.</p>
<div class="note">
  <p><strong>One exception stays destructive.</strong> <code>claim-success</code> consumes its
  tag — claiming is one-way, so a second run lands on the owned card. Either reset
  <code>E2EUNCLAIMED0001</code> as part of the E2E job (a small backend fixture endpoint or a SQL
  reset), or keep that single flow manual. Everything else in the list is read-only and can run
  on every commit.</p>
</div>

<h2>5 &nbsp;·&nbsp; T2 — deterministic OTP for the <code>live</code> flows</h2>
<p>Five flows send a real email OTP or SMS, or open an OAuth consent page, so they cannot run
unattended. Clerk <em>development</em> instances support test identifiers that skip real delivery
and accept a fixed verification code, which turns three of the five into ordinary automated
flows.</p>
<ol>
  <li><strong>Confirm the current contract</strong> in the Clerk dashboard/docs for your instance —
      the test-identifier format (an address containing <code>+clerk_test</code>, and a reserved
      test phone range) and the fixed code. Treat the exact strings as configuration, not
      folklore.</li>
  <li><strong>Parameterise the flows</strong> so the code is injected rather than hardcoded:
      add <code>-e OTP_CODE=…</code> and replace the OTP <code>inputText</code> step. Remember not
      to give <code>OTP_CODE</code> a default in the flow header (S1).</li>
  <li><strong>Retag</strong> <code>details-email-signup</code>, <code>phone-otp-request</code> and
      <code>forgot-password-send-code</code> from <code>live</code> to <code>signed-out</code>
      once they pass repeatably.</li>
</ol>
<p>The remaining two stay manual by nature: <code>sso-opens-browser</code> hands off to Google's
consent page (assert the hand-off only — never automate a third-party login), and
<code>phone-sign-in-request</code> is redundant once the sign-up phone path is covered.</p>

<h2>6 &nbsp;·&nbsp; A3 — registration step 1 dead code</h2>
<p><code>src/app/(auth)/register/index.tsx</code> renders <code>Step2Screen</code> with the
<code>Step1Screen</code> import commented out, so <code>/register</code> and
<code>/register/step2</code> are the same screen and <code>Step1Screen</code> is unreachable.
Pick one:</p>
<h4>If step 1 is retired</h4>
<pre>git rm src/features/auth/register/screens/Step1Screen.tsx \\
       src/features/auth/register/components/Step1ActionCtx.tsx \\
       src/features/auth/register/components/Step1FeatureGrid.tsx \\
       src/features/auth/register/components/Step1Hero.tsx \\
       src/features/auth/register/components/Step1Nav.tsx \\
       src/features/auth/register/components/Step1ProductBox.tsx</pre>
<p>Then delete the commented import in <code>register/index.tsx</code>, and consider collapsing
<code>register/step2.tsx</code> into <code>register/index.tsx</code> so one route renders one
screen. <em>Note:</em> <code>Step1Hero.tsx</code> exports a component named
<code>Step2Hero</code> — a leftover worth not carrying forward.</p>
<h4>If step 1 is coming back</h4>
<p>Restore the import in <code>register/index.tsx</code> and keep <code>step2.tsx</code> as the
second route.</p>
<p><strong>Either way:</strong> correct AGENTS.md §4, which still calls
<code>register/index.tsx</code> "step 1", and update
<code>flows/02-register/register-entry.yaml</code> — it deliberately pins today's behaviour and
will fail the moment this changes, which is the signal to rewrite it.</p>

<h2>7 &nbsp;·&nbsp; H1 — two <code>testID</code>s worth adding</h2>
<p>The app declares no <code>testID</code>s, so every selector in the suite is visible copy or an
<code>accessibilityLabel</code>. That is mostly a feature — it means the tests break when the UI
copy changes. Two controls are the exception, because they have no text at all:</p>
<h4>MainHeader's settings button</h4>
<p>Icon-only and unlabelled, so the eleven <code>signed-in</code> flows reach it with
<code>tapOn: point: 92%, 9%</code> &mdash; the suite's only geometric selector and the one thing a
header layout change silently breaks. In <code>src/components/mainHeader.tsx</code>:</p>
<pre> &lt;TouchableOpacity
     activeOpacity={0.8}
     onPress={handleSettingsPress}
<span class="add">+    testID="header-settings-button"</span>
<span class="add">+    accessibilityRole="button"</span>
<span class="add">+    accessibilityLabel="Open settings"</span>
     style={{ … }}
 &gt;</pre>
<p>Then replace the point tap in the five settings/profile flows with
<code>- tapOn: { id: "header-settings-button" }</code>. The notification bell next to it deserves
the same treatment for the same reason.</p>
<h4>Tab bar items</h4>
<p><code>MainHeader</code> renders the screen name as a heading, so a tab label collides with it
&mdash; on the discover tab, <code>"Discover"</code> matches both. The suite works around it by
only tapping a tab from a different tab. Adding
<code>tabBarButtonTestID</code> per <code>Tabs.Screen</code> in
<code>src/app/(tabs)/_layout.tsx</code> would remove the constraint.</p>
<p>Both are accessibility improvements as much as test ones: an icon-only button with no
<code>accessibilityLabel</code> is unusable with a screen reader.</p>

<h2>Definition of done</h2>
<ul>
  <li><code>npm test</code> green, including the new <code>normalizeTagId</code> cases.</li>
  <li><code>npx tsc --noEmit</code> clean (AGENTS.md §12.1).</li>
  <li><code>npm run e2e</code> green, with the six previously <code>needs-tag</code> flows now in
      the default suite &mdash; 39 flows rather than 33.</li>
  <li><code>maestro test .maestro --include-tags signed-in -e EMAIL=… -e PASSWORD=…</code> green
      &mdash; 11 flows.</li>
  <li>A chip tap opens the app on a physical device (A2 cannot be fully proven on an emulator,
      which has no NFC radio).</li>
  <li>AGENTS.md §4 and §8 updated; <em>Known gaps</em> in <code>.maestro/README.md</code> trimmed
      to whatever genuinely remains.</li>
</ul>

</body></html>`;

const htmlPath = path.join(path.dirname(path.resolve(outPdf)), 'remediation-doc.html');
fs.writeFileSync(htmlPath, html, 'utf8');

execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${path.resolve(outPdf)}`,
  'file:///' + htmlPath.replace(/\\/g, '/'),
], { stdio: 'inherit' });

fs.unlinkSync(htmlPath);
console.log('wrote', outPdf, fs.statSync(path.resolve(outPdf)).size, 'bytes');
