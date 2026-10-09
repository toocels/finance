# Finance Website

A website for a SEBI-registered investment adviser (RIA), implementing the applicable SEBI website-disclosure requirements and achieving **WCAG 2.2 Level AA**, **GIGW 3.0**, and **BIS (IS 17802:2021)** accessibility standards.

## Current Pre-Launch Status (Updated October 2026)

- [x] **Regulatory Credentials & Disclosures**: SEBI Registration Number and BASL/BSE Enlistment Number configured in `data.json`.
- [x] **Registration Validity**: Both SEBI registration and BSE/IAASB enlistment marked as **Perpetual** (coterminous with active SEBI registration per SEBI Circular `SEBI/HO/MIRSD/MIRSD-POD-1/P/CIR/2024/101`).
- [x] **Zero Pending Placeholders**: All `⚠ PENDING` labels resolved across all 12 pages.
- [x] **Automated Accessibility Audit**: 100/100 Accessibility, 100/100 Best Practices, and 100/100 SEO on Google Lighthouse (v13.5.0) across all 12 pages. Zero failing Axe-core violations.
- [x] **Dynamic Google Sheet Tables**: Live GViz integration active and public (read-only) for monthly complaint snapshot, monthly/annual trend logs, and annual compliance audit log.
- [x] **Regulatory Portals**: All statutory external links (SEBI SCORES 2.0, SMART ODR, SEBI Portal, NISM) live, verified (200 OK), and accessible.

## Scope of Compliance Responsibility

This project implements the SEBI-mandated disclosure and website requirements identified and approved by the client/compliance professional. It is **not** a guarantee that the adviser's overall business is SEBI-compliant — compliance sign-off on content, figures, and regulatory interpretation rests with the client and their compliance professional, not the developer. The developer's responsibility is limited to accurately building and displaying the content and disclosures the client/compliance professional approves.

---

## Stack & Architecture

| Layer            | Choice                         | Why                                                                                                                                     |
| :--------------- | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**     | HTML5 / JavaScript / CSS3      | Clean semantic architecture, zero heavy frameworks, sub-second load times.                                                              |
| **Hosting**      | GitHub Pages                   | Static hosting, deploys automatically on `git push`.                                                                                    |
| **Domain & DNS** | Dynadot Registrar              | At-cost domain pricing, DNS management. GitHub Pages serves directly over its own TLS cert.                                             |
| **Contact Form** | Web3Forms                      | Client-side AJAX submission directly to adviser inbox without a backend server.                                                         |
| **Data Tables**  | Public Google Sheet (GViz API) | Live dynamic tables for complaint redressal, no database or backend required.                                                           |
| **Site Data**    | `data.json` (root)             | Central source of truth for adviser identity, phone, address, and credentials. Auto-populates all elements carrying `data-field="..."`. |

---

## Site Structure

The site is a homepage (`index.html`) plus 11 standalone sub-pages (folder + `index.html`, clean URLs, GitHub-Pages-friendly), each sharing the same header/toolbar/footer and pulling from the same `data.json` / `script.js`:

| Page                                      | URL                     | Relationship to the homepage                                                                                                                                                                                                                    |
| :---------------------------------------- | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contact                                   | `/contact/`             | Full duplicate of the homepage's `#contact` section — both are kept in full, by request.                                                                                                                                                        |
| Complaints Data                           | `/complaints/`          | Full version (snapshot + monthly/annual trend + audit log). Homepage `#complaints` shows only the current-month snapshot, linking here for the rest.                                                                                            |
| Investor Charter & Regulatory Disclosures | `/investor-charter/`    | Full A–F SEBI charter text plus adviser registration/identification details, structured like the reference site's charter page. Not duplicated on the homepage — `#compliance` was removed; nav/footer "Disclosures" links point straight here. |
| Grievance Escalation Matrix               | `/grievance/`           | Full Tier 1–3 escalation table, linked from the Investor Charter page's grievance section.                                                                                                                                                      |
| Privacy Policy (incl. Cookie Disclosure)  | `/privacy-policy/`      | GIGW 3.0 mandatory policy page.                                                                                                                                                                                                                 |
| Terms of Use                              | `/terms-of-use/`        | GIGW 3.0 mandatory policy page.                                                                                                                                                                                                                 |
| Hyperlinking Policy                       | `/hyperlinking-policy/` | GIGW 3.0 mandatory policy page.                                                                                                                                                                                                                 |
| Copyright Policy                          | `/copyright-policy/`    | GIGW 3.0 mandatory policy page.                                                                                                                                                                                                                 |
| Sitemap (human-readable)                  | `/sitemap/`             | Distinct from the machine-readable `/sitemap.xml` at the root.                                                                                                                                                                                  |
| FAQ / Help                                | `/faq/`                 | GIGW 3.0 mandatory policy page.                                                                                                                                                                                                                 |
| Website Feedback                          | `/feedback/`            | General UX/content feedback — distinct from the Grievance Escalation Matrix.                                                                                                                                                                    |

---

## Features & Implementation Checklist

### 1. Security & Static Architecture

- [x] **Zero Server / Database Footprint**: No database, no PHP, and no vulnerable CMS plugins (immune to SQLi, RCE, and database breaches).
- [x] **Static CDN Delivery**: Delivered over GitHub Pages' CDN and TLS (no Cloudflare proxy in front).
- [x] **Client-Side Configuration**: Centralized `data.json` at root for quick parameter changes (Sheet ID, access keys, credentials).
- [x] **Google Sheet Publish Scope**: Published as **View-only to anyone with the link** — confirmed no edit access is open.
- [x] **Contact Form Integration**: Web3Forms AJAX submission with accessible `aria-live` status messages and input validation.

### 2. Accessibility & Compliance (WCAG 2.2 AA / GIGW 3.0 / IS 17802)

- [x] **Screen Reader Support**: Semantic markup, ARIA labels, `aria-hidden` on icons, `.sr-only` descriptions, tested across automated accessibility trees.
- [x] **100% Keyboard Navigation**: Logical tab index, no keyboard traps, and visible `:focus-visible` outlines (minimum 2px solid with offset).
- [x] **Skip to Main Content Link**: Hidden anchor link made visible on keyboard focus (`#main-content`).
- [x] **Accessibility Toolbar (GIGW 3.0)**:
  - [x] Font size scaling (`A-`, `A`, `A+`) using relative `rem`/`em` typography.
  - [x] High-contrast / Dark theme toggle persisted in `localStorage`.
- [x] **Mobile Reflow (WCAG 1.4.10)**: Responsive layout tested down to 320px viewport without 2D horizontal text scrolling at 400% zoom.
- [x] **Touch Target Sizes (WCAG 2.5.8)**: Minimum 44×44px interactive areas for all buttons, tabs, and inputs.
- [x] **Semantic Markup**: Proper landmark tags (`<header>`, `<main>`, `<nav>`, `<footer>`), `<h1>`-`<h6>` hierarchy, and `aria-label` / `aria-live` attributes.

### 3. Interactive Components & Data Sync

- [x] **Dynamic Google Sheet Tables**:
  - [x] Reflects latest live data from Google Sheets via GViz API.
  - [x] Automatic sheet tab discovery and error fallbacks.
  - [x] Accessible table semantics (`<caption>`, `<th scope="col">`, `<th scope="row">`, `role="region"` wrapper).
- [x] **Contact Form**:
  - [x] Semantic form with explicit `<label for="...">` associations.
  - [x] Web3Forms integration sending submissions directly to adviser email.
  - [x] Accessible error states and submission feedback announced via `aria-live`.

### 3.5. GIGW 3.0 Mandatory Policy Pages

- [x] **Privacy Policy** (`/privacy-policy/`) — includes Cookie Disclosure.
- [x] **Terms of Use / Website Disclaimer** (`/terms-of-use/`).
- [x] **Hyperlinking Policy** (`/hyperlinking-policy/`).
- [x] **Copyright Policy** (`/copyright-policy/`).
- [x] **Sitemap page** (`/sitemap/`, human-readable — distinct from `/sitemap.xml`).
- [x] **FAQ / Help** (`/faq/`).
- [x] **Website Feedback mechanism** (`/feedback/`, distinct from grievance redressal).

### 4. SEO & Analytics

- [x] **`robots.txt`**: Allows crawling, points to `/sitemap.xml`.
- [x] **Sitemap** (`sitemap.xml`): Up-to-date XML catalog of all 12 published pages.
- [x] **Meta Tags**: Title, meta description, and Open Graph tags configured.

---

## Page Content & Statutory Disclosures

The site incorporates all mandatory sections required for SEBI-registered investment advisers:

### 1. Adviser Identification & Registration

- **SEBI Registration Number**: Configured via `data.json` (Validity: Perpetual).
- **BASL / BSE Enlistment Details**: Configured via `data.json` (Validity: Perpetual — coterminous with SEBI registration).
- **Registered Office Address**: Displayed on `/investor-charter/`, contact page, and footer.
- **Principal Officer Contact**: Displayed alongside jurisdictional SEBI regional office details.
- Lives on `/investor-charter/` (folded into the charter page, reference-site style) — not a homepage section.

### 2. Mandatory SEBI Risk Disclaimer

> _"Investment in securities market are subject to market risks. Read all the related documents carefully before investing."_

> _"Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."_  
> _(Standard SEBI advertisement-code disclaimer — separate from the risk disclaimer above, required alongside it.)_

### 3. Investor Charter for Investment Advisers

- Current SEBI-prescribed Investor Charter for Investment Advisers, reproduced as circulated by SEBI.
- Built as a dedicated page, `/investor-charter/`, holding the full A–F prescribed text as static HTML plus the adviser's registration/identification details (via `data-field`, sourced from `data.json`).

### 4. Grievance Redressal & Escalation Matrix

- Multi-tier escalation table for client complaints on `/grievance/`.
- Direct links to official regulatory portals:
  - **SEBI SCORES 2.0**: `https://scores.sebi.gov.in/`
  - **SMART ODR Portal**: `https://smartodr.in/`
  - **SEBI Official Portal**: `https://www.sebi.gov.in/`
  - **NISM Portal**: `https://www.nism.ac.in/`

### 5. Monthly Complaints Redressal Table

- Dynamic table rendered from Google Sheets (categorized by source: SEBI SCORES, Direct, Others; and status: Received, Resolved, Pending).
- Satisfies mandatory SEBI compliance to publish monthly complaint data by the 7th of every month.
- Homepage `#complaints` section shows the current-month snapshot only; the full monthly/annual trend and compliance audit log live on the dedicated `/complaints/` page, linked from the homepage.
- **Public data is aggregate counts only** — numbers per category/status. Zero PII.

---

## Ownership & Access

| Account / Asset   | Holds                        | Owner      |
| :---------------- | :--------------------------- | :--------- |
| GitHub Repo / Org | Source code, deploy pipeline | _(client)_ |
| Dynadot Account   | Domain registration, DNS     | _(client)_ |
| Web3Forms Account | Contact form access key      | _(client)_ |
| Google Sheet      | Complaint data source        | _(client)_ |

---

## Maintenance & Operating Costs

### 1. Annual Cost Breakdown

| Item                   | Service                                   | Annual Cost               |
| :--------------------- | :---------------------------------------- | :------------------------ |
| **Hosting**            | GitHub Pages                              | ₹0                        |
| **Domain & DNS**       | Dynadot Registrar (`.in` / `.com`)        | ~₹800 – ₹1,000 / year     |
| **Contact Form**       | Web3Forms (Free Tier: 250 submissions/mo) | ₹0                        |
| **Data Sync**          | Google Sheets GViz API                    | ₹0                        |
| **Total Running Cost** |                                           | **~₹800 – ₹1,000 / year** |

### 2. Routine Maintenance Operations

- **Monthly Complaint Data Updates**: Update figures directly in the shared Google Sheet by the 7th of every month. Changes propagate to the live site on next page load.
- **General Fact Changes**: Update [`data.json`](data.json) (phone, address, credentials) at root and push to GitHub. All 12 pages update automatically.
- **Domain & DNS**: Annual domain renewal via Dynadot (TLS cert auto-renewed by GitHub Pages).

---

## Standards & Audit Verification

### 1. Standards & Regulations

- **W3C WCAG 2.2 Level AA**: [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/) & [Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- **GIGW 3.0 (MeitY / NIC)**: [GIGW Portal](https://guidelines.india.gov.in/) & [GIGW 3.0 Handbook (PDF)](https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2023/12/2023122166.pdf)
- **Bureau of Indian Standards**: [IS 17802:2021 Portal](https://www.bis.gov.in/know-your-standard/?lang=en)
- **SEBI Accessibility Mandates**: [SEBI RPwD Act Circular (Jul 2025)](https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html)

### 2. Developer Audit Results

- **Axe DevTools / pa11y**: Passing, zero automated WCAG 2.2 AA violations.
- **Google Lighthouse**: 100/100 Accessibility, 100/100 Best Practices, and 100/100 SEO across all 12 pages.
- **Color Contrast Analyser (CCA)**: Verification of header gradient (5.57:1 against white text, exceeding 4.5:1 AA threshold).
