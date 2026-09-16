Financial advisor website — SEBI registered investment adviser.

## Stack Decision

| Layer | Choice | Why |
|-------|--------|-----|
| **Hosting** | Cloudflare Pages | Free, unlimited requests, commercial use allowed |
| **Backend** | Cloudflare Workers | 100k req/day free, handles contact form + email |
| **Email** | Resend API | Free tier 3,000 emails/mo, simple API |
| **Domain** | Cloudflare Registrar | At-cost pricing, auto DNS integration |

Everything lives in one Cloudflare dashboard. No monthly hosting cost — only domain (~₹800/yr for `.com`).

Sample website
https://vireshpatel.com/

Platforms must conform to recognized benchmarks, including WCAG 2.1 (Level AA baseline), India's IS 17802:2021 specifications, and GIGW 3.0 guidelines.
https://www.digitala11y.com/sebi-mandates-digital-accessibility-across-all-regulated-platforms-for-financial-industry/
https://www.deque.com/blog/sebi-sets-a-new-standard-for-digital-accessibility-in-finance-in-india/



Automated compliance testing
https://www.deque.com/axe/devtools/
https://wave.webaim.org/
Chrome dev tools lighthouse
https://www.w3.org/WAI/test-evaluate/tools/list/


From SEBI
https://www.sebi.gov.in/legal/circulars/jul-2025/rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities_95745.html
https://www.sebi.gov.in/sebi_data/attachdocs/aug-2025/1754651443956.pdf
https://www.w3.org/TR/WCAG21/
https://guidelines.gov.in/
https://www.bis.gov.in/know-your-standard/?lang=en


IAAP audit
https://iaapaudit.com/contact
