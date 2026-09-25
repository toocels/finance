/**
 * Jeeves Investment Advisors — Client-Side Logic
 * Features:
 *  1. Accessibility Toolbar (Font size scaling, High-contrast, Dark theme)
 *  2. Mobile Navigation Toggle with ARIA state
 *  3. Web3Forms AJAX Contact Submission
 *  4. Public Google Sheet GViz Dynamic Complaint Data Tables
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibilityToolbar();
  initMobileNav();
  initContactForm();
  initSheetTables();
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
    if (btnFontSm) btnFontSm.classList.toggle('active', activeClass === 'font-scale-sm');
    if (btnFontMd) btnFontMd.classList.toggle('active', activeClass === 'font-scale-md');
    if (btnFontLg) btnFontLg.classList.toggle('active', activeClass === 'font-scale-lg');
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
    if (btnThemeDefault) btnThemeDefault.classList.toggle('active', activeTheme === 'default');
    if (btnThemeContrast) btnThemeContrast.classList.toggle('active', activeTheme === 'high-contrast');
    if (btnThemeDark) btnThemeDark.classList.toggle('active', activeTheme === 'dark');
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
   4. Google Sheet Data Tables (GViz API — Public / No Backend)
   ────────────────────────────────────────────────────────────────────────── */
const SHEET_ID = '1zl0Bigjsfs22mPySj9F1HBiuSPlg6zwvgZclODPGSyM';

async function initSheetTables() {
  const app = document.getElementById('complaints-app');
  if (!app) return;

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
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not load data for "${name}" (HTTP ${res.status}).`);
    }
    const text = await res.text();

    const jsonStr = text.replace(/^[\s\S]*?google\.visualization\.Query\.setResponse\(/, '').replace(/\);?\s*$/, '');
    const table = JSON.parse(jsonStr).table;

    const headers = table.cols.map(c => c.label || c.id);
    const rows = (table.rows || []).map(r =>
      (r.c || []).map(cell => {
        if (!cell) return '';
        return cell.f ?? (cell.v !== null && cell.v !== undefined ? String(cell.v) : '');
      })
    );

    return { name, headers, rows };
  }

  function renderTable(name, headers, rows) {
    const nonEmpty = rows.filter(r => r.some(c => c !== ''));
    const block = document.createElement('div');
    block.className = 'sheet-block';

    block.innerHTML = `
      <div class="sheet-header">
        <h3 class="sheet-title">📊 ${esc(name)}</h3>
        <span class="sheet-badge">${nonEmpty.length} row${nonEmpty.length !== 1 ? 's' : ''}</span>
      </div>`;

    if (!nonEmpty.length) {
      block.innerHTML += `
        <div class="state-box">
          <span class="state-icon" aria-hidden="true">🗂️</span>
          <p>No complaint records in this period.</p>
        </div>`;
      app.appendChild(block);
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', `Data table for ${name}`);

    const table = document.createElement('table');
    table.className = 'compliance-table';

    // Caption for accessibility (WCAG 1.3.1)
    const caption = document.createElement('caption');
    caption.className = 'sr-only';
    caption.textContent = `SEBI Complaint Redressal Data for ${name}`;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    nonEmpty.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach((_, i) => {
        const td = document.createElement('td');
        td.textContent = row[i] ?? '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrap.appendChild(table);
    block.appendChild(wrap);
    app.appendChild(block);
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

  try {
    const tabs = await listTabs(SHEET_ID);
    app.innerHTML = '';
    await Promise.all(tabs.map(async t => {
      try {
        const { name, headers, rows } = await fetchSheetData(SHEET_ID, t);
        renderTable(name, headers, rows);
      } catch (err) {
        console.error(err);
        renderTableError(t.name, err.message);
      }
    }));
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
}
