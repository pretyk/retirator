# Retirator

A Hebrew, RTL Israeli early-retirement and bridge-phase planning simulator.
React, Tailwind CSS, Lucide icons, and Vite. All application components, financial
functions, and custom styles live in [`src/App.jsx`](src/App.jsx).

[Project introduction](https://pretyk.github.io/retirator/) ·
[Open the simulator](https://nice-pebble-0150fe203.2.azurestaticapps.net)

**100% client-side. No backend, analytics, accounts, cookies, storage, external
fonts, or financial-data transmission.** Reloading resets the scenario.
The entire site is served as static files. Loading the page and its assets
requires web requests to the storage/hosting service that serves them. None of
the entered data or calculated results is sent to a server or third party by
the app, or included in the page URL or asset requests.

**Anonymity is best effort, not a guarantee of network anonymity.** ISPs and
cloud, hosting, or delivery providers may process, monitor, or log request
metadata available to them under their own policies and applicable law (for
example, network addresses and access times; the serving provider may also see
requested resource paths and browser details). Absence of infrastructure logs
or deletion of records controlled by an independent provider is not guaranteed.
This disclosure does not exclude the service operator's responsibility under law.

The simulator uses **Microsoft Azure Static Web Apps**; the separate introduction
uses **GitHub Pages**. Provider retention, log access, processing locations and
contractual privacy roles have not yet been fully verified. Provider processing
must not automatically be characterized as independent of the operator.
See [Microsoft's privacy statement](https://www.microsoft.com/privacy/privacystatement)
and [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement);
the actual hosting agreements also need review.

**Service contact:** Retirator, [retiratorcom@gmail.com](mailto:retiratorcom@gmail.com),
for accessibility, privacy and terms requests without a GitHub account.
The user supplied this publishable address; it is a service contact, not a
verified legal identity of a person or entity. Email is voluntary and external
to the simulator: sender details and message content are processed by email
providers and received in Gmail to handle the request. Mail retention/access
arrangements still require verification. Do not send financial inputs, identity
documents, or screenshots containing personal information. Requests concerning
personal information can be sent here and assessed under applicable law and
the information actually controlled by the service; deletion of independent
providers' records is not promised.

## License

Licensed under the [MIT License](LICENSE). Copyright (c) 2026 pretyk.
Use, modification, distribution, and commercial use are permitted provided the
copyright and permission notice are retained. The software is provided without
warranty. Third-party dependencies remain under their respective licenses.
The financial disclaimer below explains the simulator's limitations; it does
not impose additional restrictions on the rights granted by the MIT License.

Every production build ships `/LICENSE.txt` (the project's unchanged MIT license)
and `/THIRD_PARTY_NOTICES.txt`, linked from the Hebrew app footer. The notices
use a UTF-8 byte-order mark so Hebrew renders correctly on direct text navigation
without changing hosting headers. They
include the complete LICENSE files from the exact installed, locked React,
React DOM, Scheduler (transitive), Lucide React, Tailwind CSS, and Vite packages.
Tailwind is a development dependency but contributes distributed CSS. Lucide's
packaged ISC text includes its Feather-origin attribution; the upstream Feather
v4.29.2 MIT notice is also included verbatim as a supplementary notice, not as
a separately installed dependency. Its source is recorded in the notice file.
Vite contributes the modulepreload polyfill and CommonJS helpers; its complete
packaged `LICENSE.md` is retained verbatim, including the Rollup CommonJS plugin
notice and additional build-time dependency notices bundled in that upstream file.

The build-only Vite hook in `scripts/production-licenses.mjs` inventories bundled
JavaScript packages and includes Tailwind's license for the emitted stylesheet,
even when minification removes its banner. It fails on an
unreviewed bundled package or virtual runtime helper, changed license text, or installed/locked version
mismatch. Dependency updates that change license wording require reviewing the
new packaged text and updating its SHA-256 fingerprint. No license downloader
or runtime request is added. Build tools without distributed runtime code are
not otherwise included.

## Important disclaimer / הבהרה חשובה

**Simulation only. The author is not a financial advisor. This tool does not
replace professional, individually tailored financial advice. All displayed
numbers are estimates, not promises. Read the full Hebrew terms below before use.**

### מטרת הכלי והיעדר ייעוץ מקצועי

Retirator נועד ללמידה ולהמחשת תרחישים בלבד. מחבר האתר אינו יועץ פיננסי
ואינו מספק במסגרת האתר ייעוץ השקעות, שיווק השקעות, ייעוץ פנסיוני, ייעוץ
מס או ייעוץ משפטי. השימוש אינו יוצר יחסי יועץ–לקוח או חובת נאמנות מקצועית.
אין בתוכן המלצה, הצעה או שידול לקנות, למכור או להחזיק מוצר פיננסי, למשוך
כספים או לפרוש מעבודה. נתוני ברירת המחדל הם דוגמה בלבד, ולא המלצה.

### אומדנים בלבד וסביבה משתנה

כל הסכומים, התחזיות, התשואות, הקצבאות, המקדמים ושיעורי המס הם הערכות
המבוססות על קלט המשתמש ועל הנחות מפושטות. אין התחייבות לדיוק, שלמות,
עדכניות, התאמה לצורך אישי, רווח, קצבה, פטור ממס או יכולת לממן פרישה.
ייתכנו טעויות תוכנה, חישוב או תוכן; תוצאות בפועל עשויות להיות שונות מהותית,
לרבות הפסד הון.

השווקים, האינפלציה, הריבית, דמי הניהול, תוחלת החיים ותנאי המוצרים והקרנות
עשויים להשתנות. גם החוקים, התקנות, הפרשנות, גילי הפרישה, תקרות המס,
הפטורים והזכאות לקצבאות עשויים להשתנות בכל עת. האתר אינו מספק נתוני שוק
בזמן אמת או עדכון אוטומטי של הדין. תשואה קבועה אינה תחזית ואינה משקפת
במלואה סיכון רצף תשואות, תנודתיות, הפסדים ושינויי יוקר מחיה.

שיעורי המס, גילי הפרישה ומקדמי ההמרה באתר הם הנחות להמחשה, ולא חישוב
מס או זכאות אישי. פטורי קרן השתלמות וקיבוע זכויות כפופים לדין ולנתונים
אישיים. תרחיש פנסיה לפני גיל 60 אינו אישור למשיכת קצבה. מגבלות נוספות
והנחות החישוב מפורטות בפרק המודל הפיננסי להלן.

### חובת בדיקה וייעוץ אישי

אין להסתמך על האתר כבסיס יחיד או מכריע להחלטה. לפני השקעה, משיכה,
שינוי חיסכון, תכנון מס או פרישה, יש לפנות לייעוץ פיננסי אישי מאיש מקצוע
מוסמך ובעל רישיון מתאים לפי הדין, ובמידת הצורך ליועץ פנסיוני, יועץ השקעות,
רואה חשבון, יועץ מס או עורך דין. יש לבדוק עצמאית נתונים, זכאות והוראות
דין מול הגופים והרשויות הרלוונטיים.

### אתר סטטי וגבולות האנונימיות

האתר מוגש כקבצים סטטיים משירות אחסון. טעינת העמוד וקובצי היישום מחייבת
בקשות רשת לשירות שמגיש אותם, אך כל חישובי הסימולציה מתבצעים בדפדפן בלבד.
היישום אינו שולח לשרת או לצד שלישי אף אחד מהנתונים שהוזנו או את תוצאות
החישוב, ואינו כולל אותם בכתובת העמוד או בבקשות הטעינה.

האתר נבנה לצמצום איסוף מידע במאמץ סביר, אך אין התחייבות לאנונימיות מוחלטת
ברשת. ספק האינטרנט וספקי הענן, האחסון וההפצה עשויים לעבד, לנטר או לתעד
מידע על בקשות הרשת, לפי המידע הזמין לכל אחד מהם, מדיניותו והדין החל.
מידע זה עשוי לכלול כתובת רשת, זמני גישה, ובשירות שמגיש את הקבצים גם
כתובות משאבים ופרטי דפדפן. אין באתר התחייבות להיעדר תיעוד בתשתיות או
למחיקת רישומים שבשליטת ספק עצמאי. אין בכך כדי לשלול זכויות או לפטור
מאחריות לפי דין. הסימולטור מוגש באמצעות שירות האחסון של מיקרוסופט,
ועמוד ההיכרות באמצעות שירות העמודים של גיטהאב. תקופות השמירה, הרשאות
הגישה, מיקומי העיבוד וחלוקת האחריות טרם אומתו במלואם.

לפניות נגישות, פרטיות ותנאי שימוש לשירות Retirator:
[retiratorcom@gmail.com](mailto:retiratorcom@gmail.com).
זהו ערוץ פנייה לשירות, לא זיהוי משפטי של אדם או תאגיד.
אין לשלוח נתונים פיננסיים, מסמכי זיהוי או צילום מסך עם מידע אישי.
פנייה נשלחת רק ביוזמתך באמצעות ספק הדואר שלך ומתקבלת בתיבת ג׳ימייל.
תוכן הפנייה, כתובת השולח ופרטי ההודעה מעובדים לצורך הטיפול באמצעות ספקי
הדואר; תקופות השמירה והסדרי הטיפול טרם אומתו במלואם.

### אחריות וזכויות לפי דין

הודעת ההבהרה מתארת את מטרת הכלי ואת מגבלותיו; היא אינה פוטרת את מפעילי
השירות מאחריות לפי דין ואינה מגבילה זכות, סעד או פנייה לערכאות.
אין בה פטור מאחריות לנזק גוף, למעשה זדון או לכל אחריות אחרת לפי דין.
האישור בכניסה אינו ויתור על זכויות או על טענות בקשר לשירות.

הסימון בכניסה מבטא הסכמה לתנאי השימוש בלבד. אין בו הצהרה שקראת או הבנת
את כל התוכן, אישור לעובדה אישית או ויתור על זכויות.
אפשר לעיין בעמודי המידע ולפנות לשירות גם ללא הסכמה.
אם אינך מסכים או מסכימה לתנאים, אין להשתמש בסימולטור.

**Maintainer note:** this disclaimer is a draft, not legal advice or a guarantee
of enforceability. Have an Israeli lawyer review it against the actual service,
operator, audience, hosting arrangements, and applicable law before relying on it.
Do not assume a disclaimer excludes liability that the law does not allow to be
excluded. The former blanket liability exclusion and mandatory reading/
understanding declaration have been removed, not certified enforceable.
No server-side consent evidence is collected or retained.

## Accessibility and outstanding legal assessments

The Hebrew [accessibility statement](https://nice-pebble-0150fe203.2.azurestaticapps.net/#accessibility)
is readable before accepting the simulator terms, links from the footer and
entry dialog, and covers both public surfaces. The introduction also has its
own prominent statement/contact section. It describes keyboard controls,
chart inspection and a semantic data table, dialog focus, field labels, zoom,
reduced motion, and the known limits of automated Chromium checks.
No comprehensive manual screen-reader/cross-browser assessment, certification,
exemption or accessibility-coordinator appointment is claimed.

**Assessment record — 28 October 2026:** source/build/browser checks can establish
technical behavior, not professional legal conclusions. The service contact is
confirmed for publication; the operator's legal identity, relevant turnover,
applicable exemptions and need for an accessibility coordinator are unconfirmed.
Do not treat the absence of fees or open-source status as an exemption.
Issues [#18](https://github.com/pretyk/retirator/issues/18),
[#21](https://github.com/pretyk/retirator/issues/21) and
[#22](https://github.com/pretyk/retirator/issues/22) retain the respective
operator-specific accessibility, hosting/privacy and terms-review prerequisites.
Their public UI mitigations are not a substitute for completing those checks.
Have an Israeli adviser assess the actual service and current law; record the
date, factual basis, scope and outcome before marking the assessments complete.

The [regulatory-perimeter assessment in #19](https://github.com/pretyk/retirator/issues/19)
also remains open. Current observable behavior: neutral user-directed arithmetic,
no named-product ranking, transactions, affiliate links or lead collection
identified in the application, and illustrative financial assumptions.
Commercial arrangements, operator licensing status and the legal classification
are not established by source inspection. Income-based colors/feedback are not
a suitability assessment or a safe-withdrawal determination.
Before adding recommendations, optimized withdrawal ages, product selection,
referrals/commissions, lead collection or personal advisory services, obtain a
fresh Israeli regulatory assessment. Do not claim that a disclaimer creates a
licensing exemption, and do not silently change financial assumptions.
Reassess privacy/accessibility obligations when the operator, hosting, data
processing, audience, commercial activity, features or applicable law changes.

## Run locally

Requires Node.js 22.12+ in the 22.x line, 24.x (recommended), or 26+, and npm.

The committed lockfile uses verified public npm tarballs and SHA-512 integrity.
The migration preserves every locked version and the dependency graph. GitHub
Actions selects `https://registry.npmjs.org/` through its test-job environment,
without registry credentials. There is no project registry override: local npm
configuration, including an organization-approved package feed, remains unchanged.
Do not bypass managed-device package protections or silently change locked versions.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To serve the optimized production build:

```sh
npm run build
npm run preview
```

The live site is hosted on Azure Static Web Apps (see [Deployment](#deployment)).
`dist` also works on any static HTTPS host. No environment variables or server are
required. For subdirectory hosting, set Vite's `base` to the deployment path.
Production HTML includes a self-only asset content policy and disables outgoing
connections. It is omitted in development to allow Vite's local hot-reload
runtime. On production hosts, additionally set HTTP headers
`Content-Security-Policy: frame-ancestors 'none'`,
`X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`.
Inline styles are required by the single-file design. Do not add analytics.

## Using the simulator

- On each fresh page load, read the entry disclaimer, check the unchecked
  agreement box, and explicitly accept before using the simulator. The backdrop
  is blurred and the underlying controls are inert. Escape and backdrop clicks
  do not accept or dismiss it. Declining leads to the information page.
- Read the full disclaimer at `/#disclaimer` and the privacy explanation at
  `/#privacy`, and the accessibility statement/contact at `/#accessibility`,
  including before acceptance. These are client-side hash routes,
  so direct links and refresh work on static hosts without routing configuration.
- Acceptance lives in React memory only: no cookies, local/session storage,
  timestamp, user identifier, or consent log. Reloading requires acceptance again.
  Same-page navigation preserves draft inputs and committed results.
- Enter a custom scenario. Every numeric field has a
  comma-formatted input, plus/minus buttons, an RTL slider, and a Hebrew tooltip.
  On phones and touch-capable tablets or laptops, sliders have a 44px-high touch
  area separated from the number-control row by 16px of non-interactive space;
  plus/minus buttons retain at least 44×44px touch targets.
- Typography uses local system fonts only, with a shared mobile/desktop scale:
  16px body text, 18px field labels, 20px numeric inputs, and at least 14px
  secondary text at the default browser font size. Text sizes use `rem` to
  respect browser font preferences; age fields and narrow result cards stack
  instead of reducing the type size. Steppers wrap below the input when needed
  so large amounts stay readable with enlarged browser fonts.
  The chart matches its SVG coordinates to its rendered size so its 16px,
  root-relative labels do not shrink on narrow screens.
- Changes update **draft** values, tax alerts, and monthly delta previews.
  Results, chart, and formula-modal variables stay **committed** until clicking
  **חשב סימולציה**. Invalid inputs and timelines explicitly block that action.
- The chart follows actual monthly end-of-period withdrawals, with an
  independently compounded pension balance. Point at or tap the chart to inspect
  ages, or use the labeled age slider: arrow keys move one month, Home selects
  the first month, and End selects the last. Its accessible value includes the
  selected age and both balances. The expandable Hebrew data table exposes every
  plotted month and both series without requiring slider interaction. All chart
  inspection remains tied to the committed scenario until calculating again.
- The formula button opens a keyboard-accessible native dialog. Celebrations
  and deficit feedback respect reduced-motion preferences.
- Profile shortcuts have been removed; initial balances are illustrative defaults.
- The privacy badge links to the privacy page. Footer links expose both
  information pages and the public GitHub repository for code contributions.
  GitHub is an external service, opened only by an explicit click, without a
  referrer or financial data. Do not include personal financial information in
  issues, contributions, or screenshots.

## Financial model and limitations

This is a deterministic educational scenario tool, **not investment, pension,
or tax advice, a safe-withdrawal guarantee, or a tax-law calculator**.
All amounts are real (today's purchasing power). Returns are assumed net of
inflation and fees, but before withdrawal taxes.

1. Assets before bridge start and pension assets compound annually:
   `balance * (1 + annualReturn / 100) ** years`.
2. During the bridge, `r = annualReturn / 100 / 12` and
   `N = (pensionAge - bridgeStartAge) * 12`.
   End-of-month gross withdrawals:
   `PMT = (PV * (1+r)^N - FV) * r / ((1+r)^N - 1)`.
   At zero return: `(PV - FV) / N`.
   This equals `-PMT(r, N, PV, -FV, 0)` in Excel.
3. Liquid savings' proportional withdrawals have an assumed effective tax of
   15% (25% tax on a hypothetical 60% gain share). Hishtalmut is assumed liquid
   and eligible for exemption. Real tax depends on cost basis, eligible deposits,
   losses, withdrawal rules, and other circumstances.
4. Pension conversion factor: 200 at age 67, plus 4 per earlier year,
   minus 3 per later year. It is not an insurer quotation.
5. Pension net uses **illustrative effective haircuts** of 35% before age 60,
   20% from 60 to the assumed statutory age, and 5% thereafter.
   The pre-60 amount is a **warning scenario, not an available monthly pension**
   or a verified legal tax calculation; 35% is not presented as a minimum penalty.
   These haircuts are not additive, actual tax rates, or determinations of pension
   eligibility. The retirement alert reads "תרחיש בגיל פרישה — מס משוער":
   tax is shown under model assumptions, not as an optimal withdrawal recommendation.
   קיבוע זכויות concerns determining a personal exemption; tax exemption at
   retirement is neither automatic nor necessarily complete.
6. Statutory ages are simplified as 67 for men and 65 for women. Actual women's
   retirement age depends on birth date and phased legislation. Personal
   exemptions, fixing of rights, other income, and tax credits are not modeled.
7. No new contributions, employment income, National Insurance benefit, market
   volatility, sequence-of-returns risk, or future legal changes are modeled.

**Boundary behavior:** pension age may equal bridge start (no bridge income).
It cannot precede bridge start. Increasing current age moves bridge start
forward if needed, without silently changing pension age. The pension-age reserve
target cannot exceed current liquid savings plus Keren Hishtalmut, excluding
pension assets and projected returns. Its slider and steppers use this combined
limit. An excessive target, including after reducing either asset balance, shows
an error and blocks calculation without silently changing the target or committed
results. Zero balances and zero returns are supported.
Liquid savings and Keren Hishtalmut inputs each permit amounts up to ₪10 million.
The pension balance input retains its ₪100 million maximum.

### PRD corrections

The original requirements are preserved as **historical design context, not
current financial or legal guidance**, in
[`docs/retirator_prd_and_design_doc.md`](docs/retirator_prd_and_design_doc.md).
Its marked superseded sections must not be used as current implementation
instructions. The model assumptions and privacy explanation in this README
describe the current application.

- Its absolute-anonymity badge is superseded by the privacy disclosure above:
  entered data stays in the browser, but loading static files requires web
  requests that infrastructure providers may log.
- Its tax-exemption, "optimal withdrawal", and categorical early-withdrawal
  claims are superseded by the illustrative scenarios above. The 35%, 20%, and
  5% reductions are model haircuts, not verified legal rates or eligibility.
- Its numerical benchmark conflicts with its formula. For PV = ₪3,000,000,
  FV = 0, N = 204, and annual return = 4%, the correct gross draw is
  **₪20,291.80465685561/month**, not ₪16,861.
- Its later annuity-factor expression conflicts with the explicit request.
  The app uses **minus 3 per year after 67**, as requested.
- The specified annual pre-bridge vs. nominal-monthly bridge compounding
  conventions differ slightly. This is intentional fidelity to the PRD,
  rather than silently converting to an effective monthly rate.

## Automated checks

```sh
npm test
npx playwright install chromium
npm run check
```

`npm run check` runs financial unit tests, builds production assets, and runs
Playwright against a dedicated production preview on port 4173. The browser
suite covers desktop and mobile Chromium, draft locking, all live tax tiers,
formatted inputs, sliders and steppers, invalid timelines, zero-rate
and zero-duration scenarios, impossible targets, confetti and risk precedence,
modal focus and Escape, overflow, axe accessibility, reduced motion, privacy,
and runtime errors. Additional tests cover explicit agreement, blocked dismissal,
declining, keyboard focus, all three information pages, direct-link refresh, browser history,
draft preservation, acceptance reset, absence of storage or data requests,
GitHub link attributes, and accessibility before acceptance.
The build's `postbuild` check compares both license artifacts byte-for-byte with
the reviewed source notices. Unit tests cover missing, truncated, and SPA-HTML
replacement artifacts and reject unreviewed bundled packages. Browser tests
request both public text URLs, compare their complete bodies with the build
files, and follow the Hebrew footer link on desktop and mobile, ensuring these
URLs serve license text rather than the SPA fallback.
`tests/dependency-portability.test.js` also rejects Microsoft-specific feed URLs
in the committed lockfile and requires public npm tarball URLs without embedded
credentials and with SHA-512 integrity. Package-source migrations must verify
the exact locked versions and downloaded tarball hashes against public npm
metadata, without silently updating versions or regenerating the dependency graph.

`tests/e2e/mobile.spec.js` runs on a Pixel 7 and on a small 360px phone. It
checks for no horizontal overflow on every page, touch targets of at least 44×44px,
18px inputs (avoiding automatic iOS focus zoom), 16px field labels, supporting
text of at least 14px (including legal pages and dialogs), the sticky
calculate bar and its draft preview, scrolling to the results after
calculating, tap-to-open tooltips that stay on screen, touch steppers, tapping
the chart, dialogs that fit the screen, and axe accessibility.

`npm run test:e2e` expects a current `dist` build and a free port 4173.
Use `npx playwright show-report` to inspect the report. GitHub Actions runs
the same checks and retains browser artifacts on failure.

The production app makes no third-party requests. npm and browser installation
do require network access during development.

## Deployment

### Project introduction on GitHub Pages

`docs/index.html` is a separate Hebrew, RTL project introduction, not a second
deployment of the simulator. It uses real desktop and mobile screenshots of
illustrative defaults, a short CSS entrance animation, and a step-line animation.
Both animations stop within 1.2 seconds and are disabled for reduced motion.
There is no JavaScript, autoplay video, embedded player, tracking, external font,
or third-party runtime asset. Images are local and can be opened at full size;
the mobile screenshot is lazy-loaded.

After merging the documentation, configure **Settings → Pages → Deploy from a
branch → main → /docs**. The expected URL is
https://pretyk.github.io/retirator/ (unless a custom Pages domain is configured).
`docs/.nojekyll` keeps publishing static; no new workflow, dependency, Azure
permission, or simulator build change is needed.

The page has its own restrictive HTML content policy, including
`script-src 'none'` and `connect-src 'none'`, and a no-referrer policy.
GitHub Pages does not provide the app's configurable Azure response headers:
in particular, a meta CSP cannot enforce `frame-ancestors`. Keep the simulator
on Azure with its existing response headers. Like other static hosting, Pages
may log page and asset requests; no network-anonymity guarantee is made.

To refresh the committed PNGs after an intentional UI change, run
`npm run build` and then `npm run preview -- --port 4173 --strictPort`.
In a second terminal, run `node scripts/capture-project-page.mjs`.
The script opens fresh browser contexts, uses only illustrative defaults,
accepts the entry disclaimer, and captures desktop and mobile views.
Review both images before committing; never use personal financial information.
The Playwright project-page tests serve `docs` under `/retirator/` and cover
image loading, local-only requests, keyboard navigation, responsive layout,
reduced motion, and axe accessibility. They run as part of `npm run check`.

### Simulator hosting

Production: https://nice-pebble-0150fe203.2.azurestaticapps.net

The site runs on the **Azure Static Web Apps Free tier**, with no API, no
authentication, and no Application Insights.
[`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) deploys it:

1. Every PR and every push to `main` runs `npm run check`. A push to `main`
   keeps the tested `dist` folder as an artifact.
2. After the checks pass on `main`, the deploy job uploads those exact files to
   production. The GitHub `production` environment accepts deployments from
   `main` only.
3. There are no PR preview environments. A Static Web App has a single
   deployment token, and that token can also deploy to production, so only
   `main` may obtain it. Verify PRs locally with `npm run build && npm run preview`.

GitHub signs in to Azure with OIDC through a user-assigned managed identity. Its
only federated credential trusts the `production` environment. No Azure secret
is stored in GitHub. The identity has a custom role that can only read the
Static Web App and its deployment token. The workflow fetches the token at run
time and masks it.

[`public/staticwebapp.config.json`](public/staticwebapp.config.json) serves the
production CSP (`connect-src 'none'`, `frame-ancestors 'none'`) and the
privacy headers as real HTTP headers. It also returns 404 for the built-in
sign-in routes (`/.auth/login/github`, `aad`, and `twitter`). `tests/deploy-config.test.js` keeps the header CSP in sync
with the build-time CSP in `vite.config.js`.

### Infrastructure

The infrastructure is Bicep in [`infra/`](infra), deployed at subscription scope:

```sh
az deployment sub create -l westeurope -n retirator-infra -f infra/main.bicep
```

It creates the `rg-retirator` resource group, the `swa-retirator` Static Web
App (Free tier, staging environments disabled), the `id-retirator-github`
managed identity with a federated credential for the `production` GitHub
environment, and the custom deployer role. Bicep runs in incremental mode,
so removing a resource from the template does not delete it in Azure; delete
it manually. The workflow reads the repository variables `AZURE_CLIENT_ID`,
`AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, and
`AZURE_STATIC_WEB_APP_NAME`; none of them are secrets.

If the deployment token may have been exposed, reset it with
`az staticwebapp secrets reset-api-key -n swa-retirator -g rg-retirator`.
Never deploy manually; every release goes through CI.

## Contributing with AI agents

Rules for every contributor, human or AI, are in [`AGENTS.md`](AGENTS.md).
The repository also includes custom agents in [`.github/agents`](.github/agents)
and skills in [`.github/skills`](.github/skills):

- `code-reviewer`: reviews every PR for bugs, regressions, and missing tests.
- `finance-reviewer`: checks the formulas and the Israeli tax and pension assumptions.
- `rtl-ux-reviewer`: checks Hebrew copy, RTL layout, mobile, and accessibility.
- `privacy-guard`: blocks tracking, storage, network calls, and weaker headers.
- Skills: `code-review-checklist`, `israeli-retirement-rules`,
  `hebrew-copy-style`, and `azure-static-web-apps-deploy` (Azure Static Web
  Apps hosting and CI/CD).
