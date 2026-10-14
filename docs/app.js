// BizDesk CRM 🇰🇪 Interactive Showcase & Documentation Logic

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  initLightbox();
  initInvoiceReconciler();
  initTenantInspector();
  initRBACTester();
  initTaxCalculator();
  initToast();
});

// Toast notification helper
let toastTimeout;
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-msg');
  if (msgSpan) msgSpan.textContent = message;

  toast.style.borderColor = isSuccess ? 'var(--accent-emerald)' : 'var(--accent-rose)';
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function initToast() {
  // ensure toast container exists
  if (!document.getElementById('toast')) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="badge-dot" style="background:#10b981;"></span>
      <span class="toast-msg">Copied to clipboard!</span>
    `;
    document.body.appendChild(toast);
  }
}

// Copy to Clipboard
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Command copied to clipboard!');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<span style="color:#10b981;">✓ Copied</span>`;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 1500);
      }).catch(() => {
        showToast('Failed to copy', false);
      });
    });
  });
}

// Tab Switching
function initTabs() {
  document.querySelectorAll('.tabs-nav').forEach((nav) => {
    const buttons = nav.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        const container = nav.closest('.tab-container') || document;

        // Deactivate siblings
        nav.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle pane
        container.querySelectorAll('.tab-pane').forEach((pane) => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  });
}

// Lightbox
function initLightbox() {
  const trigger = document.getElementById('dashboard-preview-trigger');
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');

  if (trigger && modal) {
    trigger.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// Interactive Invoice Builder & M-Pesa Reconciler
function initInvoiceReconciler() {
  const clientSelect = document.getElementById('rec-client-select');
  const invNumberEl = document.getElementById('rec-inv-number');
  const invDateEl = document.getElementById('rec-inv-date');
  const invDueDateEl = document.getElementById('rec-inv-duedate');
  const invClientNameEl = document.getElementById('rec-preview-client-name');
  const invClientEmailEl = document.getElementById('rec-preview-client-email');
  const invClientPhoneEl = document.getElementById('rec-preview-client-phone');
  const invStatusBadge = document.getElementById('rec-status-badge');
  const invMpesaInput = document.getElementById('rec-mpesa-code');
  const btnReconcile = document.getElementById('rec-btn-reconcile');
  const btnReset = document.getElementById('rec-btn-reset');
  const mpesaBanner = document.getElementById('rec-mpesa-banner');
  const subtotalEl = document.getElementById('rec-subtotal');
  const vatEl = document.getElementById('rec-vat');
  const grandTotalEl = document.getElementById('rec-grandtotal');

  const clients = {
    'safari-logistics': {
      name: 'Safari Logistics Ltd',
      email: 'billing@safarilogistics.co.ke',
      phone: '+254 712 345 678',
      address: 'Industrial Area, Enterprise Road, Nairobi'
    },
    'mombasa-fresh': {
      name: 'Mombasa Fresh Grocers Ltd',
      email: 'accounts@mombasafresh.com',
      phone: '+254 722 334 455',
      address: 'Moi Avenue, Mombasa Port District'
    },
    'kilimani-design': {
      name: 'Kilimani Design Studio',
      email: 'hello@kilimanidesign.ke',
      phone: '+254 733 445 566',
      address: 'Argwings Kodhek Rd, Kilimani, Nairobi'
    },
    'rift-agri': {
      name: 'Rift Valley Agribusiness Co.',
      email: 'finance@riftagri.co.ke',
      phone: '+254 744 556 677',
      address: 'Kenyatta Avenue, Nakuru'
    }
  };

  let currentLines = [
    { desc: 'Cloud ERP & Accounting Retainer (Q4)', qty: 1, rate: 45000 },
    { desc: 'M-Pesa API Integration & Maintenance', qty: 1, rate: 25000 }
  ];

  function renderLines() {
    const tbody = document.getElementById('rec-table-body');
    if (!tbody) return;

    let subtotal = 0;
    tbody.innerHTML = '';

    currentLines.forEach((item, index) => {
      const lineTotal = item.qty * item.rate;
      subtotal += lineTotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${item.desc}</td>
        <td style="text-align: center; font-family: var(--font-mono);">${item.qty}</td>
        <td style="text-align: right; font-family: var(--font-mono);">KES ${item.rate.toLocaleString()}</td>
        <td style="text-align: right; font-weight: 600; font-family: var(--font-mono);">KES ${lineTotal.toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });

    const vat = subtotal * 0.16;
    const grand = subtotal + vat;

    if (subtotalEl) subtotalEl.textContent = `KES ${subtotal.toLocaleString()}`;
    if (vatEl) vatEl.textContent = `KES ${vat.toLocaleString()}`;
    if (grandTotalEl) grandTotalEl.textContent = `KES ${grand.toLocaleString()}`;
  }

  if (clientSelect) {
    clientSelect.addEventListener('change', () => {
      const selected = clients[clientSelect.value];
      if (selected) {
        if (invClientNameEl) invClientNameEl.textContent = selected.name;
        if (invClientEmailEl) invClientEmailEl.textContent = selected.email;
        if (invClientPhoneEl) invClientPhoneEl.textContent = selected.phone;
      }
    });
  }

  if (btnReconcile) {
    btnReconcile.addEventListener('click', () => {
      const code = invMpesaInput ? invMpesaInput.value.trim().toUpperCase() : '';
      if (!code || code.length < 8) {
        showToast('Please enter a valid M-Pesa transaction reference (e.g. QHD829142K)', false);
        return;
      }

      // Mark as paid
      if (invStatusBadge) {
        invStatusBadge.className = 'inv-status-stamp stamp-paid';
        invStatusBadge.textContent = 'PAID IN FULL';
      }

      if (mpesaBanner) {
        mpesaBanner.style.display = 'block';
        mpesaBanner.innerHTML = `
          <div style="background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.8rem; margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong>✓ M-Pesa Confirmed:</strong> Ref <code style="font-weight: 700; font-family: var(--font-mono);">${code}</code>
              <div style="font-size: 0.725rem; color: #15803d; margin-top: 0.15rem;">Reconciled automatically against Safaricom Daraja API webhook. Ledger updated.</div>
            </div>
            <span style="font-size: 0.75rem; background: #22c55e; color: white; padding: 0.2rem 0.5rem; border-radius: 4px;">Audited</span>
          </div>
        `;
      }

      showToast(`Invoice reconciled with M-Pesa ref ${code}!`);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (invStatusBadge) {
        invStatusBadge.className = 'inv-status-stamp stamp-sent';
        invStatusBadge.textContent = 'PENDING PAYMENT';
      }
      if (mpesaBanner) {
        mpesaBanner.style.display = 'none';
      }
      if (invMpesaInput) {
        invMpesaInput.value = '';
      }
      showToast('Invoice reset to Pending status');
    });
  }

  renderLines();
}

// Multi-Tenancy Inspector
function initTenantInspector() {
  const pills = document.querySelectorAll('.tenant-pill');
  const orgNameEl = document.getElementById('tenant-disp-name');
  const orgSlugEl = document.getElementById('tenant-disp-slug');
  const orgPlanEl = document.getElementById('tenant-disp-plan');
  const sqlQueryEl = document.getElementById('tenant-sql-output');
  const breachBtn = document.getElementById('tenant-test-breach-btn');
  const breachResultEl = document.getElementById('tenant-breach-result');

  const orgConfigs = {
    'nairobi-tech-hub': {
      name: 'Nairobi Tech Hub Ltd',
      id: 'org_clx9821a001',
      plan: 'Pro Plan (KES 6,500/mo)',
      clientsCount: 14,
      invoicesTotal: 'KES 4,850,000'
    },
    'mombasa-logistics': {
      name: 'Mombasa Coastal Logistics',
      id: 'org_clx9821b002',
      plan: 'Enterprise (KES 15,000/mo)',
      clientsCount: 42,
      invoicesTotal: 'KES 18,240,000'
    },
    'rift-valley-agri': {
      name: 'Rift Valley Fresh Agri',
      id: 'org_clx9821c003',
      plan: 'Starter (KES 2,500/mo)',
      clientsCount: 6,
      invoicesTotal: 'KES 980,000'
    }
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('selected'));
      pill.classList.add('selected');

      const slug = pill.getAttribute('data-org');
      const data = orgConfigs[slug];
      if (!data) return;

      if (orgNameEl) orgNameEl.textContent = data.name;
      if (orgSlugEl) orgSlugEl.textContent = slug;
      if (orgPlanEl) orgPlanEl.textContent = data.plan;

      if (sqlQueryEl) {
        sqlQueryEl.innerHTML = `
<span class="token-comment">-- Prisma Middleware automatically rewriting query for tenant: ${data.id}</span>
<span class="token-keyword">SELECT</span> i.id, i.number, i.total, i.status, i.mpesa_ref
<span class="token-keyword">FROM</span> <span class="token-string">"Invoice"</span> i
<span class="token-keyword">WHERE</span> i.<span class="token-type">organization_id</span> = <span class="token-string">'${data.id}'</span>
  <span class="token-keyword">AND</span> i.status = <span class="token-string">'paid'</span>
<span class="token-keyword">ORDER BY</span> i.created_at <span class="token-keyword">DESC</span>
<span class="token-keyword">LIMIT</span> <span class="token-number">50</span>;`;
      }

      if (breachResultEl) {
        breachResultEl.style.display = 'none';
      }
    });
  });

  if (breachBtn) {
    breachBtn.addEventListener('click', () => {
      if (!breachResultEl) return;
      breachResultEl.style.display = 'block';
      breachResultEl.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); padding: 1rem; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 700; margin-bottom: 0.35rem;">
            <span>🛡️ Isolation Enforced: Cross-Tenant Access Blocked</span>
          </div>
          <p style="font-size: 0.825rem; color: #cbd5e1; margin-bottom: 0.5rem;">
            Attempt to fetch invoice with foreign primary key <code>inv_other_org_9921</code> was scoped to current <code>organizationId</code>. 
            Prisma returned <code>null</code>. Zero data leakage occurred.
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; background: #000; padding: 0.5rem; border-radius: 4px; color: #f87171;">
            HTTP 404: Record Not Found in Active Tenant Context
          </div>
        </div>
      `;
      showToast('Cross-tenant leak prevention verified!');
    });
  }
}

// Interactive RBAC Tester
function initRBACTester() {
  const roleButtons = document.querySelectorAll('.rbac-role-btn');
  const roleDisplay = document.getElementById('rbac-active-role');
  const codeDisplay = document.getElementById('rbac-guard-code');

  const roleRules = {
    owner: {
      title: 'Owner',
      manageClients: true,
      createInvoice: true,
      reconcileMpesa: true,
      manageTeam: true,
      billingConfig: true,
      deleteOrg: true,
      guardCode: `// Server Action Guard: Full Access Granted
await requireRole(['owner']);
// Allows destructive mutations & billing administration`
    },
    admin: {
      title: 'Admin',
      manageClients: true,
      createInvoice: true,
      reconcileMpesa: true,
      manageTeam: true,
      billingConfig: false,
      deleteOrg: false,
      guardCode: `// Server Action Guard: Operational Administration
await requireRole(['owner', 'admin']);
// Blocked from modifying billing tier or deleting organization`
    },
    member: {
      title: 'Member',
      manageClients: false,
      createInvoice: false,
      reconcileMpesa: false,
      manageTeam: false,
      billingConfig: false,
      deleteOrg: false,
      guardCode: `// Server Action Guard: Read-Only Scoped Member
await requireRole(['owner', 'admin', 'member']);
// Mutations throw UnauthorizedError("Insufficient permissions")`
    }
  };

  roleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const roleKey = btn.getAttribute('data-role');
      const rule = roleRules[roleKey];
      if (!rule) return;

      if (roleDisplay) roleDisplay.textContent = rule.title;
      if (codeDisplay) codeDisplay.textContent = rule.guardCode;

      // Update badge states in matrix
      document.querySelectorAll('[data-perm]').forEach((td) => {
        const perm = td.getAttribute('data-perm');
        const allowed = rule[perm];
        if (allowed !== undefined) {
          td.innerHTML = allowed
            ? `<span class="badge badge-emerald"><span class="badge-dot"></span> Allowed</span>`
            : `<span class="badge badge-rose"><span class="badge-dot" style="background:#ef4444;"></span> Denied</span>`;
        }
      });

      showToast(`Switched active test role to ${rule.title}`);
    });
  });
}

// KRA VAT & Withholding Tax Calculator
function initTaxCalculator() {
  const amountInput = document.getElementById('tax-amount');
  const vatRateSelect = document.getElementById('tax-vat-rate');
  const whtRateSelect = document.getElementById('tax-wht-rate');
  const outSubtotal = document.getElementById('tax-out-subtotal');
  const outVat = document.getElementById('tax-out-vat');
  const outGross = document.getElementById('tax-out-gross');
  const outWht = document.getElementById('tax-out-wht');
  const outNet = document.getElementById('tax-out-net');

  function calculate() {
    if (!amountInput) return;
    const base = parseFloat(amountInput.value) || 0;
    const vatRate = parseFloat(vatRateSelect ? vatRateSelect.value : 0.16);
    const whtRate = parseFloat(whtRateSelect ? whtRateSelect.value : 0.05);

    const vatAmount = base * vatRate;
    const grossTotal = base + vatAmount;
    const whtAmount = base * whtRate;
    const netReceivable = grossTotal - whtAmount;

    if (outSubtotal) outSubtotal.textContent = `KES ${base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outVat) outVat.textContent = `KES ${vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outGross) outGross.textContent = `KES ${grossTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outWht) outWht.textContent = `- KES ${whtAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (outNet) outNet.textContent = `KES ${netReceivable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (amountInput) amountInput.addEventListener('input', calculate);
  if (vatRateSelect) vatRateSelect.addEventListener('change', calculate);
  if (whtRateSelect) whtRateSelect.addEventListener('change', calculate);

  calculate();
}
