# Finance Website

A website for a SEBI-registered investment adviser (RIA), implementing the applicable SEBI website-disclosure requirements and targeting **WCAG 2.2 Level AA**, **GIGW 3.0**, and **BIS (IS 17802:2021)** accessibility standards.

## Scope of Compliance Responsibility

This project implements the SEBI-mandated disclosure and website requirements identified and approved by the client/compliance professional. It is **not** a guarantee that the adviser's overall business is SEBI-compliant — compliance sign-off on content, figures, and regulatory interpretation rests with the client and their compliance professional, not the developer. The developer's responsibility is limited to accurately building and displaying the content and disclosures the client/compliance professional approves.

---

## Stack & Architecture

| Layer            | Choice                            | Why                                                                            |
| :--------------- | :-------------------------------- | :----------------------------------------------------------------------------- |
| **Frontend**     | HTML5 / JavaScript / Tailwind CSS | Single-file architecture (`index.html`), utility-first styling, <1s load time. |
| **Hosting**      | GitHub Pages                      | Free static hosting, deploys automatically on `git push`.                      |
| **Domain & DNS** | Cloudflare Registrar + CDN        | At-cost domain pricing (~₹800/yr), free edge SSL, DDoS protection.             |
| **Contact Form** | Web3Forms                         | Client-side AJAX submission to email without a backend server (250 free/mo).   |
| **Data Tables**  | Public Google Sheet (GViz API)    | Live dynamic tables, no database or backend required.                          |
| **Site Data**    | `data.json` (root)                | Name/phone/address/reg-numbers etc., fetched client-side at load and populated into elements tagged `data-field="..."` — one edit updates every page. |

---

## Features & Implementation Checklist

### 1. Security & Static Architecture

- [ ] **Zero Server / Database Footprint**: No database, no PHP, and no vulnerable CMS plugins (immune to SQLi, RCE, and database breaches).
- [ ] **Static CDN Delivery**: Delivered over Cloudflare Edge SSL and GitHub Pages CDN.
- [ ] **Client-Side Configuration**: Centralized `config.js` for quick parameter changes (Sheet ID, email keys).
- [ ] **Google Sheet Publish Scope**: Publish as **View-only to anyone with the link** — confirm no edit access is open, and only the intended tab/range is published (not the whole spreadsheet).
- [ ] **Contact Form Spam Protection**: Web3Forms access key is public in client-side JS by design (expected for this service) — add a honeypot field or Web3Forms' built-in hCaptcha to block bot submissions.

### 2. Accessibility & Compliance (WCAG 2.2 AA / GIGW 3.0 / IS 17802)

- [ ] **Screen Reader Support**: Tested and navigable via NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack (Android).
- [ ] **100% Keyboard Navigation**: Logical tab index, no keyboard traps, and visible `:focus-visible` outlines (minimum 2px solid with offset).
- [ ] **Skip to Main Content Link**: Hidden anchor link made visible on keyboard focus.
- [ ] **Accessibility Toolbar (GIGW 3.0)**:
  - [ ] Font size scaling (`A-`, `A`, `A+`) using relative `rem`/`em` typography.
  - [ ] High-contrast / Dark theme toggle.
- [ ] **Mobile Reflow (WCAG 1.4.10)**: Responsive layout tested down to 320px viewport without 2D horizontal text scrolling at 400% zoom.
- [ ] **Touch Target Sizes (WCAG 2.5.8)**: Minimum 44×44px interactive areas for all buttons, tabs, and inputs.
- [ ] **Semantic Markup**: Proper landmark tags (`<header>`, `<main>`, `<nav>`, `<footer>`), `<h1>`-`<h6>` hierarchy, and `aria-label` / `aria-live` attributes.

### 3. Interactive Components & Data Sync

- [ ] **Dynamic Google Sheet Tables**:
  - [ ] Reflects latest live data from Google Sheets.
  - [ ] Automatic sheet tab discovery.
  - [ ] Accessible table semantics (`<caption>`, `<th scope="col">`, `<th scope="row">`).
- [ ] **Contact Form**:
  - [ ] Semantic form with explicit `<label for="...">` associations.
  - [ ] Web3Forms integration sending submissions directly to adviser email.
  - [ ] Accessible error states and submission feedback announced via `aria-live`.

### 4. SEO & Analytics

- [ ] **`robots.txt`**: Allow crawling, point to sitemap.
- [ ] **Sitemap** (`sitemap.xml`): pairs with the GIGW sitemap page already listed under statutory pages.
- [ ] **Meta Tags**: title, meta description, Open Graph tags (for link-share previews).
- [ ] **Structured Data** (optional): `schema.org` `FinancialService` / `Organization` markup.
- [ ] **Analytics**: privacy-friendly option — e.g. Cloudflare Web Analytics (free, no cookie/consent banner needed since it's cookieless).

---

## Page Content & Statutory Disclosures

The page incorporates all mandatory sections required for SEBI-registered investment advisers:

### 1. Adviser Identification & Registration

- RIA Registration Number & Validity
- BASL Membership ID & Validity / Renewal Date
- Registered Office Address & Corporate Identification
- Principal Officer & Compliance / Grievance Officer Contact Details
- NISM Certification Numbers — Principal Officer, Compliance Officer, and any persons associated with investment advice

### 2. Mandatory SEBI Risk Disclaimer

> _"Investment in securities market are subject to market risks. Read all the related documents carefully before investing."_

> _"Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."_
> _(Standard SEBI advertisement-code disclaimer — separate from the risk disclaimer above, required alongside it.)_

### 3. Investor Charter for Investment Advisers

- Must be the **current SEBI-prescribed Investor Charter for Investment Advisers**, as circulated by SEBI — reproduced as prescribed, not a custom paraphrased summary written for this site.
- Displayed prominently (own page or a clearly linked, easy-to-find section) — SEBI requires prominent display, not just presence somewhere on the site.

### 4. Grievance Redressal & Escalation Matrix

- Multi-tier escalation table for client complaints.
- **Resolution timelines per tier — pre-launch gate**: site does not go live with placeholder day-counts. Client/compliance professional confirms the current first-response and final-resolution windows from the latest SEBI/SCORES 2.0 circular before launch (these windows have changed across circulars), and the escalation table ships with those confirmed numbers.
- Direct links to official regulatory portals:
  - **SEBI SCORES 2.0**: `https://scores.sebi.gov.in/`
  - **SMART ODR Portal**: `https://smartodr.in/`

### 5. Monthly Complaints Redressal Table

- Dynamic table rendered from Google Sheets (categorized by source: SEBI SCORES, Direct, Others; and status: Received, Resolved, Pending).
- Satisfies mandatory SEBI compliance to publish monthly complaint data by the 7th of every month.
- **Public data must be aggregate counts only** — numbers per category/status. No client names, phone numbers, emails, complaint descriptions, or KYC/identifying information in the published sheet or tab.

### 6. Advisory & Profile Content

- **About the Adviser**: Professional credentials, SEBI registration details, and philosophy.
- **Services & Fee Structure**: Defined advisory scope and fee schedules.
- **Accessibility Statement**: Footer disclosure documenting WCAG 2.2 AA conformance and grievance contacts for disabled users.

### 7. Fee & Conflict-of-Interest Disclosures

- **Fee cap disclosure — pre-launch gate**: site does not go live with an unconfirmed figure. Reference ceiling as of last check: fixed-fee mode ₹1,51,000/annum/family, AUA mode 2.5% of AUA. Client/compliance professional confirms this is still current and matches the adviser's actual fee model (fixed-fee vs. AUA-based) before launch — this ceiling has been revised before, so the confirmed figure, not the reference number above, is what ships to the Services & Fee Structure section.
- Fee collection via banking channels only (no cash), and any advance-fee period limits.
- Refund / termination clause for the advisory agreement.
- Conflict-of-interest disclosure: associate entities, referral arrangements, if any.

### 8. GIGW 3.0 Mandatory Policy Pages — Required Deliverables

_Required alongside the WCAG/GIGW conformance claim. In scope for delivery, not deferred to a later phase:_

- **Privacy Policy** — see §9 below for the detailed content requirements, not just a generic page.
- **Terms of Use / Website Disclaimer**: site content ≠ investment advice, no-guarantee-of-returns language, governing law/jurisdiction.
- **Hyperlinking Policy**: disclaimer covering outbound links to SEBI SCORES / SMART ODR / other external sites.
- **Copyright Policy**.
- **Sitemap** page.
- **FAQ / Help** section.
- **Website Feedback** mechanism (general UX/content feedback — distinct from the grievance redressal channel).
- **Cookie Disclosure** (Cloudflare edge cookies) — can fold into Privacy Policy.

### 9. Privacy Policy & DPDP Implementation (Contact Form)

Not a generic policy page — the Privacy Policy content must explicitly answer:

- **What is collected**: name, email, phone, message (contact form fields — confirm exact field list against the built form).
- **Where it's stored**: submissions route through Web3Forms to the adviser's email; any data also logged/stored in Google Sheets should be stated if applicable.
- **Who processes it**: Web3Forms (form relay) and Google (Sheets), named explicitly as third-party processors.
- **Retention period**: how long submissions are kept, and where (inbox, sheet, or both).
- **Correction / deletion request process**: a named contact/channel for a person to request their data be corrected or deleted.
- **Consent notice at the point of collection**: a checkbox or notice directly on the contact form itself (not just referenced in a separate policy page) — e.g. "By submitting, you consent to your data being processed as per our Privacy Policy."
- **Third-party disclosure**: explicit statement that submitted data is sent to Web3Forms/Google, since it leaves the site's own infrastructure.

### 10. Advertisement Code Compliance (Content Review)

SEBI's advertisement code applies to the website itself, not just to separate ads — disclaimers elsewhere on the site don't cure misleading content. Before publishing any page copy, check it does **not** contain:

- "Guaranteed returns" or similar return-certainty language.
- "Best investment advisor" / superlative or unsubstantiated ranking claims.
- Misleading or cherry-picked past-performance figures.
- Promises or projections of future performance.
- Testimonials that create a prohibited or misleading impression.
- "SEBI approved" or similar phrasing implying SEBI endorses the adviser's services (registration ≠ endorsement — this is why the disclaimer in §2 exists, but the base copy still needs to avoid implying it).

---

## Ownership & Access

| Account / Asset    | Holds                              | Owner       |
| :----------------- | :--------------------------------- | :---------- |
| GitHub Repo / Org  | Source code, deploy pipeline       | _(fill in)_ |
| Cloudflare Account | Domain registration, DNS, edge SSL | _(fill in)_ |
| Web3Forms Account  | Contact form access key            | _(fill in)_ |
| Google Sheet       | Complaint data source              | _(fill in)_ |

- Admin credentials for each account above should be handed over (or shared) with the client, with 2FA enabled on all of them.
- Whoever owns the Google Sheet and Web3Forms account controls the live data/contact pipeline — keep this with whoever will maintain the site day-to-day.

---

## Maintenance & Operating Costs

### 1. Annual Cost Breakdown

| Item                   | Service                                   | Cost                      |
| :--------------------- | :---------------------------------------- | :------------------------ |
| **Hosting**            | GitHub Pages                              | ₹0                        |
| **Domain & DNS**       | Cloudflare Registrar (`.com` / `.in`)     | ~₹800 – ₹1,000 / year     |
| **Contact Form**       | Web3Forms (Free Tier: 250 submissions/mo) | ₹0                        |
| **Data Sync**          | Google Sheets GViz API                    | ₹0                        |
| **Total Running Cost** |                                           | **~₹800 – ₹1,000 / year** |

### 2. Routine Maintenance Operations

- **Monthly Complaint Data Updates**: Update figures directly in the shared Google Sheet. Changes propagate to the live site on next page load.
- **Domain & DNS**: Annual domain renewal via Cloudflare Registrar (SSL auto-renewed).
- **Content Freshness (GIGW, soft requirement)**: "Last updated" date stamp on statutory/disclosure pages.

---

## Standards & Audit Passing Timeline/Plan

Claiming conformance to WCAG 2.2 AA / GIGW 3.0 / IS 17802 requires evidence, not just a statement. Before the site (or this README) states the site **conforms to** these standards rather than **targets** them, it needs a passing result from §2's automated tools (Axe, Lighthouse, WAVE) plus a manual screen-reader pass, at minimum — ideally a written test report/summary of what was checked and what passed. Until that evidence exists, keep the wording as "targeting" these standards.

### 1. Standards & Regulations

- **W3C WCAG 2.2 Level AA**: [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/) & [Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- **GIGW 3.0 (MeitY / NIC)**: [GIGW Portal](https://guidelines.india.gov.in/) & [GIGW 3.0 Handbook (PDF)](https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2023/12/2023122166.pdf)
- **Bureau of Indian Standards**: [IS 17802:2021 Portal](https://www.bis.gov.in/know-your-standard/?lang=en)
- **SEBI Accessibility Mandates**: [SEBI RPwD Act Circular (Jul 2025)](https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html)

### 2. Developer Audit Tools

- **Axe DevTools**: Automated WCAG 2.2 AA rule scanning.
- **Google Lighthouse**: Target score 95–100 in Accessibility and Best Practices.
- **WAVE**: Visual inspection of ARIA landmarks, label bindings, and contrast.
- **Color Contrast Analyser (CCA)**: Verification of 4.5:1 text and 3:1 graphical element contrast ratios.
- **Manual Screen Readers**: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android).

### 3. Certification Bodies (Official Audits)

- **STQC Directorate (MeitY)**: Issues the **Certified Quality Website (CQW)** seal for GIGW / IS 17802.
- **CERT-In Empaneled Auditors**: Conducts VAPT for **Safe-to-Host** certification.
- **IAAP-Certified Auditors**: Independent third-party audit firms (BarrierBreak, Deque) for formal Accessibility Conformance Reports (ACRs).

---

## For Future Plans and Development

### 1. Content Updates & Minor Additions

- **Turnaround**: Minutes to a few hours depending on complexity.
- **Process**: Simple code edit in `index.html` (or `config.js`) followed by a `git push`. Automatically deployed to GitHub Pages.

* [ ] **Content Additions & Copy Updates**: Updating advisory bio, services, fee structure, disclosures, or adding new static sub-pages.

### 2. Feature Additions & Expansion

- **Architecture**: The existing single-file / static architecture is modular and fully expandable. New capabilities can be built right into this application without any need to rework or rebuild from scratch.
- **Effort**: Requires dedicated implementation/integration coding, but reuses the existing design system and deployment pipeline.

* [ ] **Appointment Scheduling**: Drop-in embed for Cal.com or Calendly via lightweight script.
* [ ] **Live Chat / WhatsApp Support**: Modular widget integration (e.g. Crisp, Tawk.to, WhatsApp API link).
* [ ] **AI Assistant / Chatbot**: Integration of an automated assistant for investor FAQs.
