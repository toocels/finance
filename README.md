# Finance Website

A SEBI-registered investment adviser website — static, accessible, compliance-ready.

## Stack Decision

| Layer | Choice | Why |
|-------|--------|-----|
| **Hosting** | GitHub Pages | Free, static, commercial use allowed, deploys from Git |
| **Contact Form** | Web3Forms | No backend needed, free 250/mo, just HTML |
| **Data Tables** | Public Google Sheet (GViz API) | Live data, no backend, no API key |
| **Domain** | Cloudflare Registrar | At-cost pricing (~₹800/yr), point DNS to GitHub Pages |

No backend or server needed. Only cost is the domain. Entire site is one file: `index.html`.

### Data Tables

`index.html` fetches a public Google Sheet client-side and renders one table per tab:

- Sheet must be shared **Anyone with the link → Viewer**.
- Sheet ID is hardcoded in the `<script>` at the bottom of `index.html` (from `.env`'s `GOOGLE_SHEET_URL`) — no API key.
- Tabs (names, columns, rows) are discovered automatically at load time; add/remove/rename a tab in the sheet, page picks it up.
- Tab list is cached in `localStorage` for 10 min to skip the discovery request on repeat visits.

---

## Reference / Inspiration

- https://vireshpatel.com/

---

## Compliance Plan

A 3-stage plan to build, validate, and officially certify the website for WCAG 2.2 AA (and 2.1 baseline), GIGW 3.0, and SEBI compliance.

### 1. Build Sources & Specifications
- **GIGW 3.0 Manual (NIC / MeitY)**: [GIGW 3.0 Handbook (PDF)](https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2023/12/2023122166.pdf) & [Official GIGW Portal](https://guidelines.india.gov.in/)
- **W3C WCAG 2.2 Level AA**: [WCAG 2.2 Full Specification](https://www.w3.org/TR/WCAG22/) & [W3C Quick Reference Guide](https://www.w3.org/WAI/WCAG22/quickref/)
- **Bureau of Indian Standards (IS 17802:2021)**: [BIS Standards Portal](https://www.bis.gov.in/know-your-standard/?lang=en)
- **SEBI Accessibility Mandates**:
  - [SEBI RPwD Act Mandatory Compliance Circular (Jul 2025)](https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html)
  - [SEBI Implementation Attached Guidelines (Aug 2025 PDF)](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1754651443956.pdf)

### 2. In-House Validation (Developer Tools)
- **Axe DevTools**: [Deque Axe Browser Extension](https://www.deque.com/axe/devtools/) (Automated rule scans and issue detection)
- **WAVE**: [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/) (Visual feedback on contrast, structural headings, and ARIA)
- **Google Lighthouse**: Built into Chrome DevTools (Accessibility and Web Best Practices score)
- **Color Contrast Analyser**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) / [TPGi CCA](https://www.tpgi.com/color-contrast-checker/) (Verifying 4.5:1 text and 3:1 UI contrast ratios)
- **Screen Reader Verification (Manual)**: NVDA (Windows), VoiceOver (macOS / iOS), TalkBack (Android)
- **W3C Evaluation Directory**: [W3C Complete Tools List](https://www.w3.org/WAI/test-evaluate/tools/list/)

### 3. Certification & Auditors (Seal of Approval)
- **STQC Directorate (Govt of India / MeitY)**: [STQC Website Quality Certification](https://stqc.gov.in/) — Official body issuing the **Certified Quality Website (CQW)** seal for GIGW and IS 17802 compliance.
- **CERT-In Empaneled Auditors**: [CERT-In Empaneled Security Auditors](https://www.cert-in.org.in/) — Mandatory for Vulnerability Assessment & Penetration Testing (VAPT) to obtain the **Safe-to-Host** security certificate.
- **Independent Accessibility Auditors**: [IAAP Accessibility Audit](https://iaapaudit.com/contact) / Deque / BarrierBreak — Third-party audit firms providing formal accessibility compliance reports.

