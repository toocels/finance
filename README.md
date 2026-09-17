# Finance Website

A SEBI-registered investment adviser (RIA) website — static, accessible, and compliance-ready. Conforms to **WCAG 2.2 Level AA**, **GIGW 3.0**, and **BIS (IS 17802:2021)** standards.

---

## Stack & Architecture

| Layer | Choice | Why |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / JavaScript / Tailwind CSS | Single-file architecture (`index.html`), utility-first styling, <1s load time. |
| **Hosting** | GitHub Pages | Free static hosting, deploys automatically on `git push`. |
| **Domain & DNS** | Cloudflare Registrar + CDN | At-cost domain pricing (~₹800/yr), free edge SSL, DDoS protection. |
| **Contact Form** | Web3Forms | Client-side AJAX submission to email without a backend server (250 free/mo). |
| **Data Tables** | Public Google Sheet (GViz API) | Live dynamic tables, no database or backend required. |

---

## Features & Implementation Checklist

### 1. Security & Static Architecture
- [x] **Zero Server / Database Footprint**: No database, no PHP, and no vulnerable CMS plugins (immune to SQLi, RCE, and database breaches).
- [x] **Static CDN Delivery**: Delivered over Cloudflare Edge SSL and GitHub Pages CDN.
- [x] **Client-Side Configuration**: Centralized `config.js` for quick parameter changes (Sheet ID, email keys).

### 2. Accessibility & Compliance (WCAG 2.2 AA / GIGW 3.0 / IS 17802)
- [x] **Screen Reader Support**: Tested and navigable via NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack (Android).
- [x] **100% Keyboard Navigation**: Logical tab index, no keyboard traps, and visible `:focus-visible` outlines (minimum 2px solid with offset).
- [x] **Skip to Main Content Link**: Hidden anchor link made visible on keyboard focus.
- [x] **Accessibility Toolbar (GIGW 3.0)**:
  - [x] Font size scaling (`A-`, `A`, `A+`) using relative `rem`/`em` typography.
  - [x] High-contrast / Dark theme toggle.
- [x] **Mobile Reflow (WCAG 1.4.10)**: Responsive layout tested down to 320px viewport without 2D horizontal text scrolling at 400% zoom.
- [x] **Touch Target Sizes (WCAG 2.5.8)**: Minimum 44×44px interactive areas for all buttons, tabs, and inputs.
- [x] **Semantic Markup**: Proper landmark tags (`<header>`, `<main>`, `<nav>`, `<footer>`), `<h1>`-`<h6>` hierarchy, and `aria-label` / `aria-live` attributes.

### 3. Interactive Components & Data Sync
- [x] **Dynamic Google Sheet Tables**:
  - [x] Reflects latest live data from Google Sheets.
  - [x] Automatic sheet tab discovery.
  - [x] Accessible table semantics (`<caption>`, `<th scope="col">`, `<th scope="row">`).
- [x] **Contact Form**:
  - [x] Semantic form with explicit `<label for="...">` associations.
  - [x] Web3Forms integration sending submissions directly to adviser email.
  - [x] Accessible error states and submission feedback announced via `aria-live`.

---

## Page Content & Statutory Disclosures

The page incorporates all mandatory sections required for SEBI-registered investment advisers:

### 1. Adviser Identification & Registration
* RIA Registration Number & Validity
* BASL Membership ID & Validity / Renewal Date
* Registered Office Address & Corporate Identification
* Principal Officer & Compliance / Grievance Officer Contact Details
* NISM Certification Numbers — Principal Officer, Compliance Officer, and any persons associated with investment advice

### 2. Mandatory SEBI Risk Disclaimer
> *"Investment in securities market are subject to market risks. Read all the related documents carefully before investing."*

> *"Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors."*
*(Standard SEBI advertisement-code disclaimer — separate from the risk disclaimer above, required alongside it.)*

### 3. Investor Charter for Investment Advisers
* Dedicated section detailing client rights, advisory process, and fee transparency.

### 4. Grievance Redressal & Escalation Matrix
* Multi-tier escalation table for client complaints.
* Stated resolution timelines per tier (verify current SCORES 2.0 turnaround — first response / final resolution windows have changed under recent circulars, confirm before publishing exact day counts).
* Direct links to official regulatory portals:
  * **SEBI SCORES 2.0**: `https://scores.sebi.gov.in/`
  * **SMART ODR Portal**: `https://smartodr.in/`

### 5. Monthly Complaints Redressal Table
* Dynamic table rendered from Google Sheets (categorized by source: SEBI SCORES, Direct, Others; and status: Received, Resolved, Pending).
* Satisfies mandatory SEBI compliance to publish monthly complaint data by the 7th of every month.

### 6. Advisory & Profile Content
* **About the Adviser**: Professional credentials, SEBI registration details, and philosophy.
* **Services & Fee Structure**: Defined advisory scope and fee schedules.
* **Accessibility Statement**: Footer disclosure documenting WCAG 2.2 AA conformance and grievance contacts for disabled users.

### 7. Fee & Conflict-of-Interest Disclosures
* Fee cap disclosure (verify current SEBI-prescribed limit before publishing a figure — it has been revised before).
* Fee collection via banking channels only (no cash), and any advance-fee period limits.
* Refund / termination clause for the advisory agreement.
* Conflict-of-interest disclosure: associate entities, referral arrangements, if any.

### 8. GIGW 3.0 Mandatory Policy Pages
*Required alongside the WCAG/GIGW conformance claim — currently missing from scope:*
* **Privacy Policy**: data collected via Contact Form and stored in Google Sheets; third-party processors (Web3Forms, Google); DPDP Act 2023 consent notice.
* **Terms of Use / Website Disclaimer**: site content ≠ investment advice, no-guarantee-of-returns language, governing law/jurisdiction.
* **Hyperlinking Policy**: disclaimer covering outbound links to SEBI SCORES / SMART ODR / other external sites.
* **Copyright Policy**.
* **Sitemap** page.
* **FAQ / Help** section.
* **Website Feedback** mechanism (general UX/content feedback — distinct from the grievance redressal channel).
* **Cookie Disclosure** (Cloudflare edge cookies) — can fold into Privacy Policy.

---

## Maintenance & Operating Costs

### 1. Annual Cost Breakdown

| Item | Service | Cost |
| :--- | :--- | :--- |
| **Hosting** | GitHub Pages | ₹0 |
| **Domain & DNS** | Cloudflare Registrar (`.com` / `.in`) | ~₹800 – ₹1,000 / year |
| **Contact Form** | Web3Forms (Free Tier: 250 submissions/mo) | ₹0 |
| **Data Sync** | Google Sheets GViz API | ₹0 |
| **Total Running Cost** | | **~₹800 – ₹1,000 / year** |

### 2. Routine Maintenance Operations

* **Monthly Complaint Data Updates**: Update figures directly in the shared Google Sheet. Changes propagate to the live site on next page load.
* **Domain & DNS**: Annual domain renewal via Cloudflare Registrar (SSL auto-renewed).
* **Content Freshness (GIGW, soft requirement)**: "Last updated" date stamp on statutory/disclosure pages.

---

## Standards & Audit Passing Timeline/Plan

### 1. Standards & Regulations
* **W3C WCAG 2.2 Level AA**: [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/) & [Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
* **GIGW 3.0 (MeitY / NIC)**: [GIGW Portal](https://guidelines.india.gov.in/) & [GIGW 3.0 Handbook (PDF)](https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2023/12/2023122166.pdf)
* **Bureau of Indian Standards**: [IS 17802:2021 Portal](https://www.bis.gov.in/know-your-standard/?lang=en)
* **SEBI Accessibility Mandates**: [SEBI RPwD Act Circular (Jul 2025)](https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html)

### 2. Developer Audit Tools
* **Axe DevTools**: Automated WCAG 2.2 AA rule scanning.
* **Google Lighthouse**: Target score 95–100 in Accessibility and Best Practices.
* **WAVE**: Visual inspection of ARIA landmarks, label bindings, and contrast.
* **Color Contrast Analyser (CCA)**: Verification of 4.5:1 text and 3:1 graphical element contrast ratios.
* **Manual Screen Readers**: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android).

### 3. Certification Bodies (Official Audits)
* **STQC Directorate (MeitY)**: Issues the **Certified Quality Website (CQW)** seal for GIGW / IS 17802.
* **CERT-In Empaneled Auditors**: Conducts VAPT for **Safe-to-Host** certification.
* **IAAP-Certified Auditors**: Independent third-party audit firms (BarrierBreak, Deque) for formal Accessibility Conformance Reports (ACRs).

---

## For Future Plans and Development

### 1. Content Updates & Minor Additions
* **Turnaround**: Minutes to a few hours depending on complexity.
* **Process**: Simple code edit in `index.html` (or `config.js`) followed by a `git push`. Automatically deployed to GitHub Pages.
- [ ] **Content Additions & Copy Updates**: Updating advisory bio, services, fee structure, disclosures, or adding new static sub-pages.

### 2. Feature Additions & Expansion
* **Architecture**: The existing single-file / static architecture is modular and fully expandable. New capabilities can be built right into this application without any need to rework or rebuild from scratch.
* **Effort**: Requires dedicated implementation/integration coding, but reuses the existing design system and deployment pipeline.
- [ ] **Appointment Scheduling**: Drop-in embed for Cal.com or Calendly via lightweight script.
- [ ] **Live Chat / WhatsApp Support**: Modular widget integration (e.g. Crisp, Tawk.to, WhatsApp API link).
- [ ] **AI Assistant / Chatbot**: Integration of an automated assistant for investor FAQs.