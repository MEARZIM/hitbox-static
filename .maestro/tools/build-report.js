// Builds the Maestro E2E documentation PDF.
//
// No usable Python on this machine (the `python` on PATH is the Windows Store
// stub), so the document is authored as HTML and printed by headless Chrome.
// Run:  node build-pdf.js <flows-json> <results-json> <out.pdf>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [flowsPath, resultsPath, outPdf] = process.argv.slice(2);
const flows = JSON.parse(fs.readFileSync(flowsPath, 'utf8'));
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
// Narrative sections live in findings.js so the prose isn't trapped in JSON.
Object.assign(results, require('./findings.js'));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const GROUP_TITLES = {
  '01-launch': ['Launch &amp; app shell', '&sect;4 routes, &sect;8 scan FAB'],
  '02-register': ['Registration', '&sect;4 routes, &sect;7 auth'],
  '03-login': ['Sign-in', '&sect;4 routes, &sect;7 auth'],
  '04-discover': ['Discover tab', '&sect;5 features, &sect;9 contract'],
  '05-marketplace': ['Marketplace tab', '&sect;5 features, &sect;9 contract'],
  '06-gated-tabs': ['Protected tabs &amp; sign-in popup', '&sect;4 route protection, &sect;7'],
  '07-nfc-scan': ['NFC scan screen', '&sect;8 claim flow'],
  '08-claim': ['Claim state machine', '&sect;8 claim flow'],
  '09-verify': ['Verify (read-only)', '&sect;8 claim flow, &sect;9 contract'],
  '10-deeplinks': ['Deep links &amp; tap-to-launch', '&sect;7 SSO, &sect;8 tap-to-launch'],
  '11-settings': ['Settings &amp; profile', '&sect;5 features, &sect;9 contract'],
};

const TAG_CLASS = {
  smoke: 'tag-smoke',
  'signed-out': 'tag-neutral',
  'signed-in': 'tag-auth',
  'needs-tag': 'tag-data',
  live: 'tag-live',
  destructive: 'tag-danger',
  offline: 'tag-offline',
};

const byGroup = {};
for (const f of flows) {
  (byGroup[f.group] ||= []).push(f);
}

const statusOf = (file) => results.statuses[file] || null;

const flowRows = Object.keys(byGroup)
  .sort()
  .map((g) => {
    const [title, sect] = GROUP_TITLES[g] || [g, ''];
    const rows = byGroup[g]
      .map((f) => {
        const st = statusOf(f.file);
        const badge = st
          ? `<span class="res res-${st}">${st === 'pass' ? 'PASS' : st === 'fail' ? 'FAIL' : 'not run'}</span>`
          : '<span class="res res-skip">not run</span>';
        const tags = f.tags
          .map((t) => `<span class="tag ${TAG_CLASS[t] || 'tag-neutral'}">${esc(t)}</span>`)
          .join(' ');
        return `<tr>
          <td class="mono">${esc(f.base)}</td>
          <td>${esc(f.name)}</td>
          <td class="nowrap">${tags}</td>
          <td class="center">${badge}</td>
        </tr>`;
      })
      .join('\n');
    return `<h3>${title} <span class="sect">${sect}</span></h3>
      <table class="flows">
        <thead><tr><th>File</th><th>What it asserts</th><th>Tags</th><th>Result</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  })
  .join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>HitBox — Maestro E2E Suite</title>
<style>
  @page { size: A4; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.5 "Segoe UI", system-ui, sans-serif; color: #18181b; margin: 0; }
  h1 { font-size: 22pt; margin: 0 0 2mm; letter-spacing: -0.4pt; }
  h2 { font-size: 13pt; margin: 9mm 0 3mm; padding-bottom: 1.5mm;
       border-bottom: 1.6pt solid #6C5CE7; letter-spacing: -0.2pt; }
  h3 { font-size: 10.5pt; margin: 6mm 0 2mm; }
  h3 .sect { font-weight: 400; color: #71717a; font-size: 9pt; margin-left: 2mm; }
  p, li { margin: 0 0 2.5mm; }
  ul { margin: 0 0 3mm; padding-left: 6mm; }
  .lede { color: #52525b; font-size: 11pt; }
  .meta { color: #71717a; font-size: 8.5pt; margin-bottom: 6mm; }
  code, .mono { font-family: Consolas, "Cascadia Mono", monospace; font-size: 8.5pt; }
  code { background: #f4f4f5; padding: 0.4mm 1mm; border-radius: 1mm; }
  pre { background: #18181b; color: #e4e4e7; padding: 3mm 4mm; border-radius: 2mm;
        font-family: Consolas, monospace; font-size: 8.5pt; line-height: 1.45;
        white-space: pre-wrap; margin: 0 0 4mm; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 4mm; }
  th, td { text-align: left; padding: 1.4mm 2mm; border-bottom: 0.4pt solid #e4e4e7;
           vertical-align: top; font-size: 9pt; }
  th { background: #fafafa; font-size: 8pt; text-transform: uppercase;
       letter-spacing: 0.4pt; color: #52525b; border-bottom: 0.8pt solid #d4d4d8; }
  table.flows td:first-child { width: 34%; }
  table.flows td:nth-child(3) { width: 17%; }
  table.flows td:last-child { width: 12%; }
  .center { text-align: center; }
  .nowrap { white-space: nowrap; }
  .tag { display: inline-block; font-size: 7pt; padding: 0.3mm 1.4mm; border-radius: 1mm;
         font-weight: 600; text-transform: uppercase; letter-spacing: 0.3pt; }
  .tag-smoke { background: #dcfce7; color: #15803d; }
  .tag-neutral { background: #f4f4f5; color: #52525b; }
  .tag-auth { background: #dbeafe; color: #1d4ed8; }
  .tag-data { background: #fef3c7; color: #a16207; }
  .tag-live { background: #fae8ff; color: #a21caf; }
  .tag-danger { background: #fee2e2; color: #b91c1c; }
  .tag-offline { background: #e0e7ff; color: #4338ca; }
  .res { font-size: 7.5pt; font-weight: 700; padding: 0.4mm 1.6mm; border-radius: 1mm; }
  .res-pass { background: #16a34a; color: #fff; }
  .res-fail { background: #dc2626; color: #fff; }
  .res-skip { background: #e4e4e7; color: #71717a; }
  .cards { display: flex; gap: 3mm; margin: 0 0 5mm; }
  .card { flex: 1; border: 0.6pt solid #e4e4e7; border-radius: 2mm; padding: 3mm; }
  .card .n { font-size: 19pt; font-weight: 700; line-height: 1; letter-spacing: -0.6pt; }
  .card .l { font-size: 8pt; color: #71717a; text-transform: uppercase; letter-spacing: 0.4pt; margin-top: 1.5mm; }
  .card.ok .n { color: #16a34a; }
  .card.bad .n { color: #dc2626; }
  .card.pend .n { color: #a16207; }
  .finding { border-left: 2.4pt solid #dc2626; background: #fef2f2; padding: 2.5mm 3mm;
             border-radius: 0 1.5mm 1.5mm 0; margin: 0 0 3.5mm; }
  .finding.warn { border-left-color: #d97706; background: #fffbeb; }
  .finding.info { border-left-color: #2563eb; background: #eff6ff; }
  .finding h4 { margin: 0 0 1.5mm; font-size: 10pt; }
  .finding p:last-child { margin-bottom: 0; }
  .page-break { page-break-before: always; }
  footer { position: fixed; bottom: -12mm; left: 0; right: 0; text-align: center;
           font-size: 7.5pt; color: #a1a1aa; }
</style></head>
<body>

<h1>HitBox mobile — Maestro E2E suite</h1>
<p class="lede">End-to-end coverage for the <code>hitbox-static</code> React&nbsp;Native client, derived
flow-by-flow from <code>AGENTS.md</code>. Every flow header cites the section it covers, so the suite
reads as an executable version of that document.</p>
<p class="meta">${esc(results.meta)}</p>

<h2>Result summary</h2>
<div class="cards">
  <div class="card ok"><div class="n">${results.counts.pass}</div><div class="l">passed</div></div>
  <div class="card bad"><div class="n">${results.counts.fail}</div><div class="l">failed</div></div>
  <div class="card pend"><div class="n">${results.counts.notrun}</div><div class="l">not run (need input)</div></div>
  <div class="card"><div class="n">${flows.length}</div><div class="l">flows total</div></div>
</div>
${results.summaryHtml}

<h2>Running the suite</h2>
<pre>npm run e2e           # default suite, skips the opt-in tags below
npm run e2e:report    # + .maestro/reports/report.html  (HTML-DETAILED)
npm run e2e:junit     # + .maestro/reports/junit.xml    (CI)</pre>
<p>The app must be installed on a connected emulator or device. A <strong>release</strong> build is the
right target: a debug build floats LogBox warning toasts over the bottom of the screen and needs a
live Metro server.</p>
<pre>cd android &amp;&amp; ./gradlew assembleRelease -PreactNativeArchitectures=x86_64
adb install -r app/build/outputs/apk/release/app-release.apk</pre>
<p>Drop <code>-PreactNativeArchitectures</code> for a physical device. See AGENTS.md &sect;11 for the
JDK-17 and short-path traps.</p>

<h2>Tags — why some flows are opt-in</h2>
<p>The default run includes only flows that pass with <strong>no external input</strong>. The rest are
excluded in <code>.maestro/config.yaml</code> because each needs something the repo cannot supply.</p>
<table>
  <thead><tr><th>Tag</th><th>Needs</th><th>Opt in with</th></tr></thead>
  <tbody>
    <tr><td><span class="tag tag-auth">signed-in</span></td><td>a real Clerk account that already has a backend user row</td><td class="mono">--include-tags signed-in -e EMAIL=… -e PASSWORD=…</td></tr>
    <tr><td><span class="tag tag-data">needs-tag</span></td><td>a tag id registered on the QA backend</td><td class="mono">--include-tags needs-tag -e TAG_UNCLAIMED=…</td></tr>
    <tr><td><span class="tag tag-live">live</span></td><td>a real email OTP / SMS, or an OAuth browser</td><td class="mono">--include-tags live -e EMAIL=…</td></tr>
    <tr><td><span class="tag tag-danger">destructive</span></td><td>mutates backend state — claims a tag, edits the profile, signs out</td><td class="mono">--include-tags destructive</td></tr>
    <tr><td><span class="tag tag-offline">offline</span></td><td>toggles airplane mode on the device</td><td class="mono">run the flow file directly</td></tr>
  </tbody>
</table>

<h2>Environment variables</h2>
<p>Each flow declares defaults in its own <code>env:</code> block; <code>-e KEY=VALUE</code> overrides them.</p>
<table>
  <thead><tr><th>Variable</th><th>Default</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td class="mono">APP_ID</td><td class="mono">com.subratadasdev1.hitboxstatic</td><td>the <code>applicationId</code> in <code>android/app/build.gradle</code>. Note <code>app.json</code> still says <code>com.anonymous.hitboxstatic</code>.</td></tr>
    <tr><td class="mono">APP_SCHEME</td><td class="mono">hitboxstatic</td><td>the <code>scheme</code> in <code>app.json</code>, used by the deep-link flows</td></tr>
    <tr><td class="mono">EMAIL / PASSWORD</td><td>—</td><td>a Clerk account that exists in the backend</td></tr>
    <tr><td class="mono">TAG_UNCLAIMED</td><td>—</td><td>registered tag whose product is still <code>UNCLAIMED</code></td></tr>
    <tr><td class="mono">TAG_CLAIMED</td><td class="mono">534A70C1610001</td><td>registered tag already owned</td></tr>
    <tr><td class="mono">TAG_OWNED_BY_ME</td><td>—</td><td>registered tag owned by the <code>EMAIL</code> account</td></tr>
    <tr><td class="mono">TAG_UNREGISTERED</td><td class="mono">00000000DEAD01</td><td>tag id linked to no product</td></tr>
  </tbody>
</table>

<h2 class="page-break">Flow inventory</h2>
<p>56 flows in 11 groups, plus 10 reusable subflows under <code>.maestro/common/</code> that are only
ever called by name.</p>
${flowRows}

<h2 class="page-break">Findings</h2>
${results.findingsHtml}

<h2>Maestro pitfalls encoded in this suite</h2>
<p>All six were found the hard way; each one produced a confusing failure somewhere far from its cause.</p>
<table>
  <thead><tr><th>Pitfall</th><th>What actually happens</th><th>What the suite does</th></tr></thead>
  <tbody>
    <tr><td>Text matching</td><td>Selectors are <em>full-string</em> regexes, not substring matches, and <code>?</code> is a quantifier — so <code>"Already have an account"</code> never matches the node <code>"Already have an account?"</code>. Nested <code>&lt;Text&gt;</code> spans arrive as one concatenated node. Matching is case-insensitive.</td><td>partial matches are written <code>".*have an account.*"</code></td></tr>
    <tr><td><code>hideKeyboard</code></td><td>presses BACK on Android, popping the route or dismissing the open dialog</td><td>never used; <code>- pressKey: Enter</code> instead</td></tr>
    <tr><td>Subflow <code>env:</code></td><td>a default declared inside a subflow <strong>overrides</strong> the value the caller passes via <code>runFlow: env:</code>, silently ignoring the caller</td><td>required params are left undeclared in subflow headers</td></tr>
    <tr><td>Deep links</td><td><code>launchApp</code> then <code>openLink</code> loses the URL — the <code>index.tsx</code> redirect races it and wins</td><td><code>- stopApp</code> in between, which is also the honest reproduction of tap-to-launch</td></tr>
    <tr><td><code>scrollUntilVisible</code></td><td>swipes down the middle of the screen, landing on a horizontal <code>FlatList</code> that swallows the pan, so the page never moves</td><td><code>common/scroll-to.yaml</code> swipes the left edge</td></tr>
    <tr><td>Duplicate labels</td><td><code>MainHeader</code> renders the screen name as a heading, so a tab label collides with it; the scan screen's mode toggle shares labels with its manual-entry buttons</td><td><code>index:</code> / <code>below:</code> scoping, and tabs are only tapped from another tab</td></tr>
  </tbody>
</table>

<h2>Selector strategy</h2>
<p>The app declares <strong>no</strong> <code>testID</code>s, so every selector is visible copy or an
<code>accessibilityLabel</code>. Changing user-facing strings will break flows — that is intentional,
but two controls would benefit most from a <code>testID</code>:</p>
<ul>
  <li><strong><code>MainHeader</code>'s settings button</strong> — icon-only with no label, so the
      <span class="tag tag-auth">signed-in</span> flows reach it with <code>tapOn: point: 92%, 9%</code>.
      That is the only geometric selector in the suite and the one thing a header layout change breaks.</li>
  <li><strong>The tab bar</strong>, for the label/heading collision above.</li>
</ul>

<h2>Layout</h2>
<pre>.maestro/
├── config.yaml     workspace config — flow discovery + default tag exclusions
├── README.md       the same guidance as this document, in-repo
├── common/         10 reusable subflows, called by name (never run standalone)
├── reports/        generated artifacts (git-ignored)
└── flows/
    ├── 01-launch/       cold start, tab bar, scan FAB visibility
    ├── 02-register/     registration entry, methods, skip, email + phone
    ├── 03-login/        sign-in options, errors, forgot password, SSO
    ├── 04-discover/     public feed, search, pull-to-refresh, detail
    ├── 05-marketplace/  feed sections, category/search switch, detail
    ├── 06-gated-tabs/   collections/profile gating + SignInPopup
    ├── 07-nfc-scan/     scan screen, toggle, guards, tag normalization
    ├── 08-claim/        the claim state machine, every outcome
    ├── 09-verify/       read-only authenticity + ledger
    ├── 10-deeplinks/    tap-to-launch URLs, sso-callback, error screens
    └── 11-settings/     settings, edit profile, sign out</pre>

</body></html>`;

const htmlPath = path.join(path.dirname(outPdf), 'e2e-doc.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outPdf}`,
  'file:///' + htmlPath.replace(/\\/g, '/'),
], { stdio: 'inherit' });

console.log('wrote', outPdf, fs.statSync(outPdf).size, 'bytes');
