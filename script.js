/**
 * Jeeves Investment Advisors — Client-Side Logic
 * Features:
 *  1. Accessibility Toolbar (Font size scaling, High-contrast, Dark theme)
 *  2. Mobile Navigation Toggle with ARIA state
 *  3. Web3Forms AJAX Contact Submission
 *  4. Public Google Sheet GViz Dynamic Complaint Data Tables
 *  5. Site Data (data.json) — populates name/phone/address/etc.
 */

// Resolved relative to script.js's own URL, not the page that loaded it, so
// this works whether the page is at the site root or one folder deep (e.g.
// grievance/index.html loading via "../script.js").
const SCRIPT_SRC = document.currentScript && document.currentScript.src;
const DATA_URL = SCRIPT_SRC ? new URL('data.json', SCRIPT_SRC).href : 'data.json';

async function fetchDataJsonWithRetry(attempts = 3, delayMs = 600) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`data.json fetch attempt ${i}/${attempts} failed:`, err);
      if (i < attempts) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return null;
}

// Fetched once, as soon as the script loads (not gated on DOMContentLoaded),
// and shared by both the DOM-population step and anything else that needs
// a config value (e.g. the Google Sheet ID) before it can run.
const SITE_DATA_PROMISE = fetchDataJsonWithRetry();

document.addEventListener('DOMContentLoaded', () => {
  initAccessibilityToolbar();
  initMobileNav();
  initContactForm();
  initSheetTables();
  initSiteData();
});

/* ──────────────────────────────────────────────────────────────────────────
   1. Accessibility Toolbar (WCAG / GIGW 3.0 Compliance)
   ────────────────────────────────────────────────────────────────────────── */
function initAccessibilityToolbar() {
  const html = document.documentElement;

  // Font Size Scaling
  const btnFontSm = document.getElementById('btn-font-sm');
  const btnFontMd = document.getElementById('btn-font-md');
  const btnFontLg = document.getElementById('btn-font-lg');

  const savedFontSize = localStorage.getItem('jeeves_font_scale') || 'font-scale-md';
  html.classList.add(savedFontSize);
  updateActiveFontButton(savedFontSize);

  function setFontSize(scaleClass) {
    html.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    html.classList.add(scaleClass);
    localStorage.setItem('jeeves_font_scale', scaleClass);
    updateActiveFontButton(scaleClass);
  }

  function updateActiveFontButton(activeClass) {
    [
      [btnFontSm, 'font-scale-sm'],
      [btnFontMd, 'font-scale-md'],
      [btnFontLg, 'font-scale-lg'],
    ].forEach(([btn, cls]) => {
      if (!btn) return;
      const isActive = activeClass === cls;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  if (btnFontSm) btnFontSm.addEventListener('click', () => setFontSize('font-scale-sm'));
  if (btnFontMd) btnFontMd.addEventListener('click', () => setFontSize('font-scale-md'));
  if (btnFontLg) btnFontLg.addEventListener('click', () => setFontSize('font-scale-lg'));

  // Theme / High Contrast
  const btnThemeContrast = document.getElementById('btn-theme-contrast');
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const btnThemeDefault = document.getElementById('btn-theme-default');

  const savedTheme = localStorage.getItem('jeeves_theme') || 'default';
  if (savedTheme !== 'default') {
    html.setAttribute('data-theme', savedTheme);
  }
  updateActiveThemeButton(savedTheme);

  function setTheme(theme) {
    if (theme === 'default') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    localStorage.setItem('jeeves_theme', theme);
    updateActiveThemeButton(theme);
  }

  function updateActiveThemeButton(activeTheme) {
    [
      [btnThemeDefault, 'default'],
      [btnThemeContrast, 'high-contrast'],
      [btnThemeDark, 'dark'],
    ].forEach(([btn, theme]) => {
      if (!btn) return;
      const isActive = activeTheme === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  if (btnThemeDefault) btnThemeDefault.addEventListener('click', () => setTheme('default'));
  if (btnThemeContrast) btnThemeContrast.addEventListener('click', () => setTheme(html.getAttribute('data-theme') === 'high-contrast' ? 'default' : 'high-contrast'));
  if (btnThemeDark) btnThemeDark.addEventListener('click', () => setTheme(html.getAttribute('data-theme') === 'dark' ? 'default' : 'dark'));
}

/* ──────────────────────────────────────────────────────────────────────────
   2. Mobile Navigation Toggle
   ────────────────────────────────────────────────────────────────────────── */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('mainNav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('is-open', !isExpanded);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
  });

  // Close menu when clicking navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   3. Web3Forms Contact Form Handling
   ────────────────────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btn.disabled = true;
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span> Sending message…';

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    const formData = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.focus();
        }
        form.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.focus();
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnContent;
    }
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   4. Site Data (data.json)

   Populates every element carrying data-field="dot.path.into.json" with
   that value's textContent, data-field-href="dot.path" with that value as
   the element's href, and data-field-value="dot.path" as the element's
   value (form inputs, e.g. the Web3Forms access key). The real values
   already sit in the HTML as fallback content, so a failed fetch (or a
   still-unconfirmed null field, e.g. BASL ID before it's known) just leaves
   the existing text/value in place instead of blanking it out.
   ────────────────────────────────────────────────────────────────────────── */
function getDataPath(obj, path) {
  return path.split('.').reduce((v, k) => (v && v[k] !== undefined ? v[k] : undefined), obj);
}

async function initSiteData() {
  const data = await SITE_DATA_PROMISE;
  if (!data) return;

  // Derived formats — kept out of data.json itself so the phone/email each
  // have exactly one source of truth instead of a display copy and an href
  // copy going stale independently.
  if (data.contact) {
    if (data.contact.phone) {
      const digits = data.contact.phone.match(/^(\+\d{2})(\d{5})(\d{5})$/);
      data.contact.phoneDisplay = digits ? `${digits[1]} ${digits[2]} ${digits[3]}` : data.contact.phone;
      data.contact.phoneTelHref = `tel:${data.contact.phone}`;
    }
    if (data.contact.email) {
      data.contact.emailHref = `mailto:${data.contact.email}`;
    }
  }

  document.querySelectorAll('[data-field]').forEach(el => {
    const value = getDataPath(data, el.getAttribute('data-field'));
    if (value !== undefined && value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-field-href]').forEach(el => {
    const value = getDataPath(data, el.getAttribute('data-field-href'));
    if (value !== undefined && value !== null) el.setAttribute('href', value);
  });

  document.querySelectorAll('[data-field-value]').forEach(el => {
    const value = getDataPath(data, el.getAttribute('data-field-value'));
    if (value !== undefined && value !== null) el.value = value;
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   5. Google Sheet Data Tables (GViz API — Public / No Backend)

   The sheet must have exactly 3 tabs, matched by name (case-insensitive
   substring, order doesn't matter):
     - name containing "snapshot" → current-month complaint snapshot
     - name containing "trend"    → rolling monthly disposal log (one row
       per month, e.g. "Sep-2026"); rendered as one table per financial
       year (Apr–Mar), and also used to derive the annual disposal table
     - name containing "audit"    → annual compliance-audit status log
   ────────────────────────────────────────────────────────────────────────── */
async function initSheetTables() {
  const app = document.getElementById('complaints-app');
  if (!app) return;

  const siteData = await SITE_DATA_PROMISE;
  const SHEET_ID = getDataPath(siteData, 'config.googleSheetId');

  if (!SHEET_ID) {
    showError('Could not load site configuration (data.json) after 3 attempts.');
    return;
  }

  const TAB_CACHE_KEY = `sheet-tabs:${SHEET_ID}`;
  const TAB_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  async function listTabs(id) {
    try {
      const cached = JSON.parse(localStorage.getItem(TAB_CACHE_KEY));
      if (cached && (Date.now() - cached.at < TAB_CACHE_TTL_MS)) {
        return cached.tabs;
      }
    } catch { }

    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/htmlview`);
    if (!res.ok) {
      throw new Error(`Could not connect to the Google Sheet (HTTP ${res.status}). Ensure the sheet is shared as "Anyone with the link can view".`);
    }
    const html = await res.text();

    const tabs = [];
    const re = /name:\s*"([^"]*)"[\s\S]{0,200}?gid:\s*"(\d+)"/g;
    let m;
    while ((m = re.exec(html))) {
      tabs.push({ name: m[1], gid: m[2] });
    }

    if (!tabs.length) {
      throw new Error('No tabs discovered. Make sure the spreadsheet has at least one visible sheet tab.');
    }

    try {
      localStorage.setItem(TAB_CACHE_KEY, JSON.stringify({ at: Date.now(), tabs }));
    } catch { }

    return tabs;
  }

  async function fetchSheetData(id, { name, gid }) {
    // headers=1 forces row 1 to be treated as the header row. Without it,
    // GViz guesses based on a numeric/text type mismatch between row 1 and
    // the data — a sheet where every column is text (e.g. the audit log:
    // Financial Year / Status / Remarks) fools that heuristic and GViz
    // silently returns blank column labels with the header row leaking into
    // the data instead.
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}&headers=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not load data for "${name}" (HTTP ${res.status}).`);
    }
    const text = await res.text();

    const jsonStr = text.replace(/^[\s\S]*?google\.visualization\.Query\.setResponse\(/, '').replace(/\);?\s*$/, '');
    const table = JSON.parse(jsonStr).table;

    const rawCols = table.cols || [];
    const rawRows = (table.rows || []).map(r =>
      (r.c || []).map(cell => {
        if (!cell) return '';
        return String(cell.f ?? (cell.v !== null && cell.v !== undefined ? cell.v : '')).trim();
      })
    );

    // Filter out trailing empty columns generated by Excel / Google Sheets (like G..Z)
    const validColIndices = [];
    rawCols.forEach((c, idx) => {
      const colLabel = (c.label || '').trim();
      const hasData = rawRows.some(r => r[idx] && r[idx] !== '');
      if (colLabel !== '' || hasData) {
        if (colLabel !== '' || (idx < 10 && hasData)) {
          validColIndices.push(idx);
        }
      }
    });

    const headers = validColIndices.map((i, colOrder) => (rawCols[i].label || '').trim() || `Column ${colOrder + 1}`);
    const rows = rawRows.map(r => validColIndices.map(i => r[i] ?? '')).filter(r => r.some(c => c !== ''));

    return { name, headers, rows };
  }

  // Builds one <div class="sheet-block"> containing a fully-marked-up
  // accessible table. Shared by every table type below so the DOM/ARIA
  // wiring only exists once. Pass totals: null to omit the tfoot entirely
  // (e.g. a plain status log where summing columns makes no sense).
  function buildTableBlock({ icon, title, badge, headers, bodyRows, totals, totalLabel, totalColspan, captionText, ariaLabel }) {
    const block = document.createElement('div');
    block.className = 'sheet-block';
    block.innerHTML = `
      <div class="sheet-header">
        <h3 class="sheet-title">${icon} ${esc(title)}</h3>
        ${badge ? `<span class="sheet-badge">${esc(badge)}</span>` : ''}
      </div>`;

    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', ariaLabel || title);

    const table = document.createElement('table');
    table.className = 'compliance-table';

    const caption = document.createElement('caption');
    caption.className = 'sr-only';
    caption.textContent = captionText || title;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    bodyRows.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach((_, i) => {
        const cell = row[i] ?? '';
        if (i === 0) {
          const th = document.createElement('th');
          th.setAttribute('scope', 'row');
          th.textContent = cell;
          tr.appendChild(th);
        } else {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        }
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    if (totals) {
      const tfoot = document.createElement('tfoot');
      const tfootTr = document.createElement('tr');
      const totalTh = document.createElement('th');
      totalTh.setAttribute('scope', 'row');
      if (totalColspan > 1) totalTh.setAttribute('colspan', String(totalColspan));
      totalTh.textContent = totalLabel || 'Grand Total';
      tfootTr.appendChild(totalTh);
      totals.forEach(tot => {
        const td = document.createElement('td');
        td.textContent = tot;
        tfootTr.appendChild(td);
      });
      tfoot.appendChild(tfootTr);
      table.appendChild(tfoot);
    }

    wrap.appendChild(table);
    block.appendChild(wrap);
    return block;
  }

  function buildEmptyBlock(icon, title, message) {
    const block = document.createElement('div');
    block.className = 'sheet-block';
    block.innerHTML = `
      <div class="sheet-header">
        <h3 class="sheet-title">${icon} ${esc(title)}</h3>
      </div>
      <div class="state-box">
        <span class="state-icon" aria-hidden="true">🗂️</span>
        <p>${esc(message)}</p>
      </div>`;
    return block;
  }

  // Some sheets include a leading "Sr. No." column before the category
  // label (2 label columns before the numeric data starts), some don't
  // (just the category label, 1 column). Detect it instead of assuming a
  // fixed count, so the Grand Total sums the right columns either way.
  function firstDataColIndex(headers, bodyRows) {
    for (let c = 1; c < headers.length; c++) {
      const isDataCol = bodyRows.some(r => {
        const v = (r[c] || '').trim();
        if (v === '') return false;
        return !isNaN(v.replace(/,/g, '')) || v.toUpperCase() === 'NA';
      });
      if (isDataCol) return c;
    }
    return headers.length;
  }

  // Renders Sheet 1 — "Data for the Month Ending <current month>" (Annexure C).
  // Title always reflects the real current month, independent of the tab name.
  function renderSnapshotTable(name, headers, rows) {
    if (!rows.length) {
      app.appendChild(buildEmptyBlock('📊', 'Data for the Month Ending', 'No complaint records found in this sheet.'));
      return;
    }
    const now = new Date();
    const title = `Data for the Month Ending ${MONTH_NAMES_FULL[now.getMonth()]} ${now.getFullYear()}`;
    const bodyRows = splitBodyAndTotals(rows);
    const labelCols = firstDataColIndex(headers, bodyRows);
    const totals = computeTotals(headers, bodyRows, labelCols);
    app.appendChild(buildTableBlock({
      icon: '📊',
      title,
      badge: `${bodyRows.length} categor${bodyRows.length !== 1 ? 'ies' : 'y'}`,
      headers,
      bodyRows,
      totals,
      totalColspan: labelCols,
      captionText: `SEBI complaint redressal data — ${title}`,
      ariaLabel: title,
    }));
  }

  // Parses a month label in pretty much any common shape — "Jan-2024",
  // "January 2024", "2024-01", "01/2024", or a Sheets auto-formatted date
  // like "2026-10-2" — into a {year, month} pair. Returns null if unparseable.
  const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function parseMonthParts(label) {
    const s = (label || '').trim().toLowerCase();

    let m = s.match(/^([a-z]{3,})[\s-]?(\d{4})$/);
    if (m) {
      const idx = MONTH_NAMES.indexOf(m[1].slice(0, 3));
      if (idx !== -1) return { year: Number(m[2]), month: idx };
    }

    m = s.match(/^(\d{4})[\s-](\d{1,2})(?:[\s-]\d{1,2})?$/);
    if (m) return { year: Number(m[1]), month: Number(m[2]) - 1 };

    m = s.match(/^(\d{1,2})[\s/-](\d{4})$/);
    if (m) return { year: Number(m[2]), month: Number(m[1]) - 1 };

    const parsed = Date.parse(label);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return { year: d.getFullYear(), month: d.getMonth() };
    }

    return null;
  }

  function splitBodyAndTotals(rows) {
    const bodyRows = [];
    rows.forEach((r, idx) => {
      const isLast = idx === rows.length - 1;
      const firstTwo = ((r[0] || '') + ' ' + (r[1] || '')).toLowerCase();
      const isTotalRow = firstTwo.includes('total') || (isLast && r[0] === '' && (r[1] === '' || firstTwo.includes('total')));
      if (!isTotalRow) bodyRows.push(r);
    });
    return bodyRows;
  }

  function computeTotals(headers, bodyRows, startCol) {
    const totals = [];
    for (let c = startCol; c < headers.length; c++) {
      const colValues = bodyRows.map(r => (r[c] || '').trim());
      const nums = [];
      colValues.forEach(v => {
        const cleanV = v.replace(/,/g, '');
        if (cleanV !== '' && !isNaN(cleanV)) nums.push(Number(cleanV));
      });
      if (nums.length > 0) {
        const sum = nums.reduce((acc, curr) => acc + curr, 0);
        totals.push(Number.isInteger(sum) ? String(sum) : sum.toFixed(2));
      } else {
        const isAllNA = colValues.every(v => v.toUpperCase() === 'NA' || v === '');
        totals.push(isAllNA ? 'NA' : '-');
      }
    }
    return totals;
  }

  // Indian financial year (Apr–Mar) helpers. "FY start year" identifies a
  // financial year by the calendar year its April falls in (e.g. Apr 2025
  // through Mar 2026 is FY start year 2025).
  function fyStartYearOf(year, month) {
    return month >= 3 ? year : year - 1;
  }
  function fyLabel(fyStartYear) {
    return `FY ${fyStartYear}-${String(fyStartYear + 1).slice(-2)}`;
  }

  // Normalizes any reasonable financial-year label — "2026-27", "2026-2027",
  // "FY2026-27", "FY 2026", "2026/27", or a bare "2026" — to "2026-27" for
  // display. Falls back to the original text if no 4-digit year is found.
  function formatFYLabel(label) {
    const m = (label || '').trim().match(/(\d{4})/);
    if (!m) return label;
    const startYear = Number(m[1]);
    return `${startYear}-${String(startYear + 1).slice(-2)}`;
  }

  function findColIndex(headers, pattern, fallback) {
    const i = headers.findIndex(h => pattern.test(h));
    return i !== -1 ? i : fallback;
  }
  function toNumberOrNull(v) {
    const cleaned = (v || '').replace(/,/g, '').trim();
    if (cleaned === '' || isNaN(cleaned) || cleaned.toUpperCase() === 'NA') return null;
    return Number(cleaned);
  }

  // Builds the 12 {key, year, month, label} slots of one financial year,
  // April through March.
  function fyMonthSlots(fyStartYear) {
    const slots = [];
    for (let i = 0; i < 12; i++) {
      const month = (3 + i) % 12;
      const year = fyStartYear + (month < 3 ? 1 : 0);
      slots.push({ key: year * 12 + month, year, month, label: `${MONTH_NAMES_FULL[month]} ${year}` });
    }
    return slots;
  }

  // Renders Sheet 2 — one "Trend of Monthly Disposal of Complaints" table
  // per financial year (Annexure C is structured per-FY, not as a rolling
  // window). Any month with no matching sheet row — missing at the start,
  // a gap in the middle, or not yet entered — gets a synthesized "NA" row
  // instead of being silently skipped. Also derives and renders the annual
  // disposal table from this same monthly data (no separate sheet needed).
  function renderMonthlyAndAnnualTrend(name, headers, rows) {
    if (!rows.length) {
      app.appendChild(buildEmptyBlock('📈', 'Trend of Monthly Disposal of Complaints', 'No trend records found in this sheet.'));
      return;
    }

    const rowByMonthKey = new Map();
    splitBodyAndTotals(rows).forEach(r => {
      const parts = parseMonthParts(r[0]);
      if (parts) rowByMonthKey.set(parts.year * 12 + parts.month, r);
    });

    const now = new Date();
    const currentFY = fyStartYearOf(now.getFullYear(), now.getMonth());
    let minFY = currentFY;
    let maxFY = currentFY;
    rowByMonthKey.forEach((_, key) => {
      const fy = fyStartYearOf(Math.floor(key / 12), key % 12);
      if (fy < minFY) minFY = fy;
      if (fy > maxFY) maxFY = fy;
    });

    const idxReceived = findColIndex(headers, /received/i, 2);
    const idxResolved = findColIndex(headers, /resolved/i, 3);
    const idxPending = findColIndex(headers, /pending/i, 4);

    // The full monthly detail table is only shown for the current financial
    // year — older years would otherwise pile up indefinitely as the log
    // grows (they're still summarized in the compact annual table below).
    const MONTHLY_DETAIL_FY_WINDOW = 1;
    const oldestDetailFY = maxFY - (MONTHLY_DETAIL_FY_WINDOW - 1);

    const annualRows = [];
    const nowKey = now.getFullYear() * 12 + now.getMonth();

    let carriedForward = 0;
    for (let fy = minFY; fy <= maxFY; fy++) {
      // For the FY containing the current month, don't pre-render months
      // that haven't happened yet — the table just grows by one row each
      // month instead of showing a wall of future "NA" rows. Past/present
      // gaps still show as NA (handled below via rowByMonthKey lookup).
      const slots = fyMonthSlots(fy).filter(s => s.key <= nowKey);
      const bodyRows = slots.map(({ key, label }) => {
        const existing = rowByMonthKey.get(key);
        if (existing) {
          const r = existing.slice();
          r[0] = label;
          return r;
        }
        return [label, ...Array(headers.length - 1).fill('NA')];
      });

      if (fy >= oldestDetailFY) {
        const totals = computeTotals(headers, bodyRows, 1);
        app.appendChild(buildTableBlock({
          icon: '📈',
          title: `Trend of Monthly Disposal of Complaints (${fyLabel(fy)})`,
          badge: '12 months',
          headers,
          bodyRows,
          totals,
          totalColspan: 1,
          captionText: `SEBI complaint disposal trend, ${fyLabel(fy)}`,
        }));
      }

      // Derive this FY's annual row from the same monthly data.
      let received = 0;
      let resolved = 0;
      let anyData = false;
      let closingPending = null;
      bodyRows.forEach(r => {
        const recv = toNumberOrNull(r[idxReceived]);
        const res = toNumberOrNull(r[idxResolved]);
        const pend = toNumberOrNull(r[idxPending]);
        if (recv !== null) { received += recv; anyData = true; }
        if (res !== null) { resolved += res; anyData = true; }
        if (pend !== null) closingPending = pend;
      });

      annualRows.push(anyData
        ? [fyLabel(fy).replace('FY ', ''), String(carriedForward), String(received), String(resolved), String(closingPending ?? (carriedForward + received - resolved))]
        : [fyLabel(fy).replace('FY ', ''), 'NA', 'NA', 'NA', 'NA']);

      if (anyData) carriedForward = closingPending ?? (carriedForward + received - resolved);
    }

    // Only display the last 3 years — carriedForward above is still chained
    // across the full history first, so the oldest displayed year's
    // "carried forward" figure stays accurate even though earlier years
    // aren't shown.
    const ANNUAL_DISPLAY_YEARS = 3;
    const displayedAnnualRows = annualRows.length > ANNUAL_DISPLAY_YEARS
      ? annualRows.slice(-ANNUAL_DISPLAY_YEARS)
      : annualRows;

    renderAnnualTrend(displayedAnnualRows);
  }

  function renderAnnualTrend(annualRows) {
    const headers = ['Year', 'Carried forward from previous year', 'Received', 'Resolved*', 'Pending#'];
    const totals = computeTotals(headers, annualRows, 1);
    app.appendChild(buildTableBlock({
      icon: '📅',
      title: 'Trend of Annual Disposal of Complaints',
      badge: `${annualRows.length} year${annualRows.length !== 1 ? 's' : ''}`,
      headers,
      bodyRows: annualRows,
      totals,
      totalColspan: 1,
      captionText: 'SEBI complaint disposal trend, by financial year',
    }));
  }

  // Renders Sheet 3 — compliance-audit status disclosure (Regulation 19(3)).
  // This is a statement of *current* audit standing, not a historical
  // ledger like the complaints trend tables — only the most recent
  // financial year's row is shown, regardless of how many years of history
  // have accumulated in the sheet. Plain status table: no totals row, since
  // summing text statuses is meaningless.
  function renderAuditTable(name, headers, rows) {
    if (!rows.length) {
      app.appendChild(buildEmptyBlock('📋', 'Compliance Audit Disclosure', 'No audit records found in this sheet.'));
      return;
    }
    const idxFY = findColIndex(headers, /financial\s*year|^year$/i, 1);
    const allRows = splitBodyAndTotals(rows);

    let latest = allRows[0];
    let latestYear = -Infinity;
    allRows.forEach(r => {
      const m = (r[idxFY] || '').match(/(\d{4})/);
      const y = m ? Number(m[1]) : -Infinity;
      if (y > latestYear) { latestYear = y; latest = r; }
    });

    const bodyRows = [latest.slice()];
    bodyRows[0][idxFY] = formatFYLabel(bodyRows[0][idxFY]);

    app.appendChild(buildTableBlock({
      icon: '📋',
      title: 'Compliance Audit Disclosure',
      headers,
      bodyRows,
      totals: null,
      captionText: 'Current compliance audit status, Regulation 19(3) of SEBI (Investment Advisers) Regulations, 2013',
    }));
  }

  function renderTableError(name, msg) {
    const block = document.createElement('div');
    block.className = 'sheet-block';
    block.innerHTML = `
      <div class="sheet-header">
        <h3 class="sheet-title">📊 ${esc(name)}</h3>
      </div>
      <div class="state-box error" role="alert">
        <span class="state-icon" aria-hidden="true">❌</span>
        <p>${esc(msg)}</p>
      </div>`;
    app.appendChild(block);
  }

  function showError(msg) {
    app.innerHTML = `
      <div class="sheet-block">
        <div class="state-box error" role="alert">
          <span class="state-icon" aria-hidden="true">❌</span>
          <p><strong>Unable to load live SEBI complaint tables</strong><br><br>${esc(msg)}</p>
        </div>
      </div>`;
  }

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // The sheet must have exactly 3 tabs: a rolling monthly trend log and an
  // annual compliance-audit log, matched by name (case-insensitive
  // substring) since those two need unambiguous keywords ("trend"/"audit").
  // The snapshot tab is whichever one is left over — no naming rule needed,
  // since "current month" data can reasonably be named all sorts of things.
  function pickTab(tabs, pattern) {
    return tabs.find(t => pattern.test(t.name));
  }

  try {
    const tabs = await listTabs(SHEET_ID);
    app.innerHTML = '';

    const trendTab = pickTab(tabs, /trend/i);
    const auditTab = pickTab(tabs, /audit/i);
    const snapshotTab = tabs.find(t => t !== trendTab && t !== auditTab);

    if (!snapshotTab || !trendTab || !auditTab) {
      const missing = [!snapshotTab && 'a snapshot tab', !trendTab && 'a "trend" tab', !auditTab && 'an "audit" tab'].filter(Boolean).join(', ');
      showError(`Expected 3 tabs in the sheet (missing: ${missing}). Found: ` +
        `${tabs.map(t => t.name).join(', ') || 'none'}.`);
      return;
    }

    // Fetch concurrently (speed), but render in a fixed order regardless of
    // which fetch resolves first.
    const [snapshotResult, trendResult, auditResult] = await Promise.allSettled([
      fetchSheetData(SHEET_ID, snapshotTab),
      fetchSheetData(SHEET_ID, trendTab),
      fetchSheetData(SHEET_ID, auditTab),
    ]);

    if (snapshotResult.status === 'fulfilled') {
      const { name, headers, rows } = snapshotResult.value;
      renderSnapshotTable(name, headers, rows);
    } else {
      console.error(snapshotResult.reason);
      renderTableError(snapshotTab.name, snapshotResult.reason.message);
    }

    if (trendResult.status === 'fulfilled') {
      const { name, headers, rows } = trendResult.value;
      renderMonthlyAndAnnualTrend(name, headers, rows);
    } else {
      console.error(trendResult.reason);
      renderTableError(trendTab.name, trendResult.reason.message);
    }

    if (auditResult.status === 'fulfilled') {
      const { name, headers, rows } = auditResult.value;
      renderAuditTable(name, headers, rows);
    } else {
      console.error(auditResult.reason);
      renderTableError(auditTab.name, auditResult.reason.message);
    }
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
}
