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

## Compliance Requirements

Platforms must conform to:
- **WCAG 2.1** (Level AA baseline)
- **India's IS 17802:2021** specifications
- **GIGW 3.0** guidelines

### Reference Links

**Accessibility guidelines**
- https://www.digitala11y.com/sebi-mandates-digital-accessibility-across-all-regulated-platforms-for-financial-industry/
- https://www.deque.com/blog/sebi-sets-a-new-standard-for-digital-accessibility-in-finance-in-india/
- https://www.w3.org/TR/WCAG21/
- https://guidelines.gov.in/
- https://www.bis.gov.in/know-your-standard/?lang=en

**Automated compliance testing tools**
- https://www.deque.com/axe/devtools/
- https://wave.webaim.org/
- Chrome DevTools Lighthouse
- https://www.w3.org/WAI/test-evaluate/tools/list/

**SEBI circulars**
- https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html
- https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1754651443956.pdf

**IAAP audit**
- https://iaapaudit.com/contact
