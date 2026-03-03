/* ───────────────────────────────────────────────
   MediFlow Pharmacist Dashboard  –  app.js
─────────────────────────────────────────────── */

// ── Seed Data ──────────────────────────────────
const defaultOrders = [
  { id: 'ORD001', patient: 'Rajesh Kumar', phone: '9876543210', medicines: 'Metformin 500mg x2, Atorvastatin 10mg x1', amount: 450, status: 'new', date: '2026-03-03', prescription: true },
  { id: 'ORD002', patient: 'Priya Sharma', phone: '9871234567', medicines: 'Paracetamol 650mg x3, Azithromycin 500mg x1', amount: 280, status: 'verified', date: '2026-03-03', prescription: true },
  { id: 'ORD003', patient: 'Amit Patel', phone: '9823456789', medicines: 'Amlodipine 5mg x1, Losartan 50mg x1', amount: 620, status: 'packed', date: '2026-03-02', prescription: true },
  { id: 'ORD004', patient: 'Sunita Devi', phone: '9845678901', medicines: 'Insulin Glargine 100IU x1', amount: 1200, status: 'out_for_delivery', date: '2026-03-02', prescription: true },
  { id: 'ORD005', patient: 'Mohan Rao', phone: '9867890123', medicines: 'Aspirin 75mg x30, Clopidogrel 75mg x30', amount: 380, status: 'delivered', date: '2026-03-01', prescription: false },
  { id: 'ORD006', patient: 'Kavita Singh', phone: '9812345678', medicines: 'Pantoprazole 40mg x14', amount: 180, status: 'cancelled', date: '2026-03-01', prescription: false },
  { id: 'ORD007', patient: 'Deepak Mehta', phone: '9890123456', medicines: 'Alprazolam 0.5mg x10', amount: 95, status: 'new', date: '2026-03-03', prescription: true },
];

const defaultInventory = [
  { id: 'INV001', name: 'Metformin 500mg', generic: 'Metformin HCl', batch: 'BTH2024A', expiry: '2026-12-31', mrp: 45, purchase: 28, stock: 150, category: 'Antidiabetic', schedule: 'none' },
  { id: 'INV002', name: 'Atorvastatin 10mg', generic: 'Atorvastatin Calcium', batch: 'BTH2024B', expiry: '2026-08-30', mrp: 120, purchase: 72, stock: 8, category: 'Lipid-lowering', schedule: 'H' },
  { id: 'INV003', name: 'Paracetamol 650mg', generic: 'Acetaminophen', batch: 'BTH2024C', expiry: '2027-03-31', mrp: 25, purchase: 12, stock: 0, category: 'Analgesic', schedule: 'none' },
  { id: 'INV004', name: 'Azithromycin 500mg', generic: 'Azithromycin', batch: 'BTH2024D', expiry: '2026-06-30', mrp: 85, purchase: 52, stock: 45, category: 'Antibiotic', schedule: 'H' },
  { id: 'INV005', name: 'Alprazolam 0.5mg', generic: 'Alprazolam', batch: 'BTH2024E', expiry: '2026-09-30', mrp: 12, purchase: 7, stock: 30, category: 'Anxiolytic', schedule: 'X' },
  { id: 'INV006', name: 'Amlodipine 5mg', generic: 'Amlodipine Besylate', batch: 'BTH2024F', expiry: '2026-04-30', mrp: 60, purchase: 35, stock: 12, category: 'Antihypertensive', schedule: 'H' },
  { id: 'INV007', name: 'Insulin Glargine 100IU', generic: 'Insulin Glargine', batch: 'BTH2024G', expiry: '2026-12-31', mrp: 1100, purchase: 820, stock: 5, category: 'Antidiabetic', schedule: 'H' },
  { id: 'INV008', name: 'Losartan 50mg', generic: 'Losartan Potassium', batch: 'BTH2024H', expiry: '2027-01-31', mrp: 75, purchase: 45, stock: 80, category: 'Antihypertensive', schedule: 'H' },
];

const defaultPrescriptions = [
  { id: 'RX001', patient: 'Rajesh Kumar', doctor: 'Dr. Anjali Mehta', medicines: 'Metformin 500mg BD, Atorvastatin 10mg HS', date: '2026-03-03', status: 'pending', alerts: ['Drug interaction: Metformin + Atorvastatin – Monitor renal function'], schedule: 'H' },
  { id: 'RX002', patient: 'Priya Sharma', doctor: 'Dr. Ramesh Gupta', medicines: 'Paracetamol 650mg TDS, Azithromycin 500mg OD x5', date: '2026-03-03', status: 'pending', alerts: [], schedule: 'H' },
  { id: 'RX003', patient: 'Deepak Mehta', doctor: 'Dr. Suresh Iyer', medicines: 'Alprazolam 0.5mg HS', date: '2026-03-03', status: 'pending', alerts: ['Schedule X: Requires ID verification'], schedule: 'X' },
  { id: 'RX004', patient: 'Sunita Devi', doctor: 'Dr. Priya Reddy', medicines: 'Insulin Glargine 20 units SC HS', date: '2026-03-01', status: 'verified', alerts: [], schedule: 'H' },
];

const defaultPatients = [
  { id: 'PAT001', name: 'Rajesh Kumar', phone: '9876543210', condition: 'Diabetes, Hypertension', medicines: 'Metformin 500mg, Amlodipine 5mg', lastRefill: '2026-02-03', nextDue: '2026-03-03', adherence: 95 },
  { id: 'PAT002', name: 'Sunita Devi', phone: '9845678901', condition: 'Type 1 Diabetes', medicines: 'Insulin Glargine 100IU', lastRefill: '2026-02-10', nextDue: '2026-03-10', adherence: 100 },
  { id: 'PAT003', name: 'Mohan Rao', phone: '9867890123', condition: 'CAD, Hypertension', medicines: 'Aspirin 75mg, Clopidogrel 75mg', lastRefill: '2026-02-01', nextDue: '2026-03-01', adherence: 88 },
];

const defaultSubstitutions = [
  { id: 'SUB001', order: 'ORD002', original: 'Azithromycin 500mg', alternative: 'Clarithromycin 500mg', reason: '', doctorPermission: false, status: 'pending' },
  { id: 'SUB002', order: 'ORD003', original: 'Amlodipine 5mg', alternative: 'Nifedipine SR 30mg', reason: '', doctorPermission: true, status: 'approved' },
];

const defaultReturns = [
  { id: 'RET001', order: 'ORD005', patient: 'Mohan Rao', reason: 'Wrong product', date: '2026-03-02', status: 'pending', refund: 380 },
  { id: 'RET002', order: 'ORD006', patient: 'Kavita Singh', reason: 'Damaged packaging', date: '2026-03-02', status: 'approved', refund: 180 },
];

const defaultDocuments = [
  { id: 'DOC001', type: 'Drug License', filename: null, status: 'pending' },
  { id: 'DOC002', type: 'GST Certificate', filename: null, status: 'pending' },
  { id: 'DOC003', type: 'Store Photos', filename: null, status: 'pending' },
  { id: 'DOC004', type: 'Bank Details', filename: null, status: 'pending' },
];

const defaultSettings = {
  storeName: 'MediFlow Pharmacy',
  pharmacistName: 'Dr. Arjun Nair',
  openTime: '09:00',
  closeTime: '21:00',
  cutoffTime: '18:00',
  holidayMode: false,
  minOrder: 100,
};

const defaultCompliance = [
  { id: 'CMP001', type: 'Schedule X Sale', drug: 'Alprazolam 0.5mg', patient: 'Deepak Mehta', quantity: 10, date: '2026-03-03', idVerified: true },
  { id: 'CMP002', type: 'Controlled Drug Record', drug: 'Morphine 10mg', patient: 'N/A', quantity: 0, date: '2026-03-01', idVerified: false },
];

const defaultChats = {
  doctor: [
    { contact: 'Dr. Anjali Mehta', messages: [
      { text: 'Regarding RX001 – patient Rajesh Kumar needs Atorvastatin refill.', from: 'them', time: '10:30' },
      { text: 'Noted, will process. Any dosage change?', from: 'me', time: '10:35' },
      { text: 'No change, same dosage. Thanks.', from: 'them', time: '10:36' },
    ]},
    { contact: 'Dr. Suresh Iyer', messages: [
      { text: 'Alprazolam Rx for Deepak Mehta – please verify ID before dispensing.', from: 'them', time: '11:00' },
    ]},
  ],
  patient: [
    { contact: 'Rajesh Kumar', messages: [
      { text: 'Hello, is my order ready?', from: 'them', time: '09:00' },
      { text: 'Hi Rajesh, your order ORD001 is being prepared.', from: 'me', time: '09:05' },
    ]},
    { contact: 'Priya Sharma', messages: [
      { text: 'Can I get a substitute for Azithromycin?', from: 'them', time: '12:00' },
      { text: 'We\'re checking with your doctor. Will update soon.', from: 'me', time: '12:10' },
    ]},
  ],
};

// ── Storage Helpers ─────────────────────────────
const KEY = {
  orders: 'mediflow_orders',
  inventory: 'mediflow_inventory',
  prescriptions: 'mediflow_prescriptions',
  patients: 'mediflow_patients',
  substitutions: 'mediflow_substitutions',
  returns: 'mediflow_returns',
  documents: 'mediflow_documents',
  settings: 'mediflow_settings',
  compliance: 'mediflow_compliance',
  chats: 'mediflow_chats',
};

function load(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function initStorage() {
  if (!localStorage.getItem(KEY.orders)) save(KEY.orders, defaultOrders);
  if (!localStorage.getItem(KEY.inventory)) save(KEY.inventory, defaultInventory);
  if (!localStorage.getItem(KEY.prescriptions)) save(KEY.prescriptions, defaultPrescriptions);
  if (!localStorage.getItem(KEY.patients)) save(KEY.patients, defaultPatients);
  if (!localStorage.getItem(KEY.substitutions)) save(KEY.substitutions, defaultSubstitutions);
  if (!localStorage.getItem(KEY.returns)) save(KEY.returns, defaultReturns);
  if (!localStorage.getItem(KEY.documents)) save(KEY.documents, defaultDocuments);
  if (!localStorage.getItem(KEY.settings)) save(KEY.settings, defaultSettings);
  if (!localStorage.getItem(KEY.compliance)) save(KEY.compliance, defaultCompliance);
  if (!localStorage.getItem(KEY.chats)) save(KEY.chats, defaultChats);
}

// ── Toast ───────────────────────────────────────
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast toast-${type} show`;
  setTimeout(() => { t.className = 'toast'; }, 3000);
}

// ── Modal ───────────────────────────────────────
function openModal(titleHTML, bodyHTML, footerHTML) {
  document.getElementById('modal-title').innerHTML = titleHTML;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ── Navigation ──────────────────────────────────
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.page-section');
const pageTitle = document.getElementById('page-title');

const titleMap = {
  dashboard: '🏥 Dashboard',
  orders: '📦 Order Management',
  prescriptions: '🧾 Prescription Verification',
  inventory: '💊 Inventory Management',
  substitution: '🔄 Substitution Control',
  analytics: '📊 Sales & Analytics',
  delivery: '🚚 Delivery Coordination',
  chronic: '🧠 Chronic Refill Management',
  communication: '📩 Communication',
  payment: '💰 Payment & Settlement',
  compliance: '🛡️ Compliance & Legal',
  returns: '🔁 Return & Refund Management',
  documents: '📁 Document Storage',
  settings: '⚙️ Settings',
};

function navigateTo(sectionId) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.section === sectionId));
  sections.forEach(s => s.classList.toggle('active', s.id === `section-${sectionId}`));
  pageTitle.textContent = titleMap[sectionId] || sectionId;
  renderSection(sectionId);
  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  }
}

function renderSection(id) {
  switch (id) {
    case 'dashboard': renderDashboard(); break;
    case 'orders': renderOrders(); break;
    case 'prescriptions': renderPrescriptions(); break;
    case 'inventory': renderInventory(); break;
    case 'substitution': renderSubstitution(); break;
    case 'analytics': renderAnalytics(); break;
    case 'delivery': renderDelivery(); break;
    case 'chronic': renderChronic(); break;
    case 'communication': renderCommunication(); break;
    case 'payment': renderPayment(); break;
    case 'compliance': renderCompliance(); break;
    case 'returns': renderReturns(); break;
    case 'documents': renderDocuments(); break;
    case 'settings': renderSettings(); break;
  }
}

// ── Utility Helpers ──────────────────────────────
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase(); }

function statusBadge(status) {
  const labels = { new:'New', verified:'Verified', packed:'Packed', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled', returned:'Returned', pending:'Pending', approved:'Approved', rejected:'Rejected' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

function stockBadge(stock) {
  if (stock === 0) return '<span class="badge badge-out">Out of Stock</span>';
  if (stock < 10) return '<span class="badge badge-low">Low Stock</span>';
  return '<span class="badge badge-in">In Stock</span>';
}

function expiryAlert(dateStr) {
  const d = new Date(dateStr), now = new Date();
  const diff = Math.floor((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '<span class="badge badge-danger">Expired</span>';
  if (diff <= 30) return '<span class="badge badge-danger">Expiry &lt; 30d</span>';
  if (diff <= 90) return '<span class="badge badge-warning">Expiry &lt; 90d</span>';
  return '';
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── 1. DASHBOARD ─────────────────────────────────
function renderDashboard() {
  const orders = load(KEY.orders, []);
  const inv = load(KEY.inventory, []);
  const pres = load(KEY.prescriptions, []);

  const count = (s) => orders.filter(o => o.status === s).length;
  const lowStock = inv.filter(i => i.stock > 0 && i.stock < 10);
  const outOfStock = inv.filter(i => i.stock === 0);
  const highRisk = inv.filter(i => i.schedule === 'X');
  const dailySales = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.amount, 0);

  const el = document.getElementById('section-dashboard');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Dashboard</h2><p>Welcome back, ${escHtml(load(KEY.settings, defaultSettings).pharmacistName)}</p></div>
    </div>
    <div class="stat-grid">
      ${statCard('🆕', count('new'), 'New Orders')}
      ${statCard('📋', pres.filter(p => p.status === 'pending').length, 'Pending Prescriptions')}
      ${statCard('📦', count('packed'), 'Ready for Dispatch')}
      ${statCard('🚚', count('out_for_delivery'), 'Out for Delivery')}
      ${statCard('↩️', count('returned'), 'Returned Orders')}
      ${statCard('💰', '₹' + dailySales.toLocaleString('en-IN'), 'Daily Sales', 'success-card')}
      ${statCard('⚠️', lowStock.length + outOfStock.length, 'Low Stock Alerts', 'alert-card')}
      ${statCard('🔴', highRisk.length, 'High-Risk Drug Alerts', 'alert-card')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex-wrap:wrap">
      <div class="card" style="min-width:0">
        <div class="card-title">📋 Recent Orders</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Patient</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              ${orders.slice(0, 5).map(o => `<tr>
                <td><strong>${escHtml(o.id)}</strong></td>
                <td>${escHtml(o.patient)}</td>
                <td><strong>₹${o.amount}</strong></td>
                <td>${statusBadge(o.status)}</td>
                <td class="text-muted">${formatDate(o.date)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="card">
          <div class="card-title">⚠️ Low Stock Alerts</div>
          <div class="alert-list">
            ${lowStock.concat(outOfStock).slice(0, 4).map(i => `
              <div class="alert-card ${i.stock === 0 ? 'danger' : 'warning'}">
                <span class="alert-icon">${i.stock === 0 ? '🚫' : '⚠️'}</span>
                <div><strong>${escHtml(i.name)}</strong><br><span style="font-size:12px">${i.stock === 0 ? 'Out of Stock' : `Only ${i.stock} left`}</span></div>
              </div>
            `).join('') || '<p class="text-muted">All items stocked adequately.</p>'}
          </div>
        </div>
        <div class="card">
          <div class="card-title">🔴 High-Risk Drug Alerts</div>
          <div class="alert-list">
            ${highRisk.map(i => `
              <div class="alert-card danger">
                <span class="alert-icon">🔴</span>
                <div><strong>${escHtml(i.name)}</strong><br><span style="font-size:12px">Schedule X – Requires ID verification & record keeping</span></div>
              </div>
            `).join('') || '<p class="text-muted">No Schedule X drugs in inventory.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function statCard(icon, value, label, extra = '') {
  return `<div class="stat-card ${extra}">
    <span class="stat-icon">${icon}</span>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}

// ── 2. ORDERS ─────────────────────────────────────
let orderFilter = 'all';
let orderSearch = '';

function renderOrders() {
  const el = document.getElementById('section-orders');
  const orders = load(KEY.orders, []);
  const filters = ['all', 'new', 'verified', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
  const filterLabels = { all: 'All', new: 'New', verified: 'Verified', packed: 'Packed', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned' };

  let filtered = orders;
  if (orderFilter !== 'all') filtered = filtered.filter(o => o.status === orderFilter);
  if (orderSearch) filtered = filtered.filter(o => o.patient.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()));

  el.innerHTML = `
    <div class="section-header">
      <div><h2>Order Management</h2><p>${orders.length} total orders</p></div>
      <button class="btn btn-primary" onclick="openAddOrderModal()">➕ New Order</button>
    </div>
    <div class="filter-bar">
      ${filters.map(f => `<button class="filter-pill ${orderFilter === f ? 'active' : ''}" onclick="setOrderFilter('${f}')">${filterLabels[f]}</button>`).join('')}
    </div>
    <div class="search-bar mb-3">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Search by patient or order ID…" value="${escHtml(orderSearch)}" oninput="setOrderSearch(this.value)">
    </div>
    <div class="order-grid">
      ${filtered.length ? filtered.map(o => orderCard(o)).join('') : '<div class="empty-state"><div class="empty-icon">📦</div><p>No orders found.</p></div>'}
    </div>
  `;
}

function orderCard(o) {
  const actions = getOrderActions(o.status);
  return `<div class="order-card">
    <div class="order-card-header">
      <div>
        <div class="order-id">${escHtml(o.id)} · ${formatDate(o.date)}</div>
        <div class="patient-name">${escHtml(o.patient)}</div>
        <div class="patient-phone">📞 ${escHtml(o.phone)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        ${statusBadge(o.status)}
        ${o.prescription ? '<span class="badge badge-info">Rx</span>' : ''}
      </div>
    </div>
    <div class="order-medicines">💊 ${escHtml(o.medicines)}</div>
    <div class="order-footer">
      <span class="order-amount">₹${o.amount}</span>
      <div class="order-actions">
        ${actions}
        <button class="btn btn-danger btn-sm" onclick="deleteOrder('${o.id}')">🗑 Delete</button>
      </div>
    </div>
  </div>`;
}

function getOrderActions(status) {
  const map = {
    new: `<button class="btn btn-success btn-sm" onclick="updateOrderStatus(this,'verified')">✔ Approve</button>
          <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(this,'cancelled')">✖ Reject</button>
          <button class="btn btn-secondary btn-sm" onclick="updateOrderStatus(this,'verified')">⚠ Clarify</button>`,
    verified: `<button class="btn btn-primary btn-sm" onclick="updateOrderStatus(this,'packed')">📦 Pack</button>`,
    packed: `<button class="btn btn-primary btn-sm" onclick="updateOrderStatus(this,'out_for_delivery')">🚚 Assign Delivery</button>`,
    out_for_delivery: `<button class="btn btn-success btn-sm" onclick="updateOrderStatus(this,'delivered')">✅ Delivered</button>`,
    delivered: '', cancelled: '', returned: '',
  };
  return map[status] || '';
}

function setOrderFilter(f) { orderFilter = f; renderOrders(); }
function setOrderSearch(v) { orderSearch = v; renderOrders(); }

function updateOrderStatus(btn, newStatus) {
  const card = btn.closest('.order-card');
  const idEl = card.querySelector('.order-id');
  const id = idEl.textContent.split('·')[0].trim();
  const orders = load(KEY.orders, []);
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) { orders[idx].status = newStatus; save(KEY.orders, orders); renderOrders(); showToast(`Order ${id} updated to ${newStatus}`, 'success'); }
}

function deleteOrder(id) {
  if (!confirm(`Delete order ${id}?`)) return;
  const orders = load(KEY.orders, []).filter(o => o.id !== id);
  save(KEY.orders, orders);
  renderOrders();
  showToast('Order deleted', 'error');
}

function openAddOrderModal() {
  openModal('➕ New Order',
    `<div class="form-row">
      <div class="form-group"><label>Patient Name</label><input type="text" id="new-ord-patient" placeholder="Full name"></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="new-ord-phone" placeholder="10-digit number"></div>
    </div>
    <div class="form-group"><label>Medicines</label><input type="text" id="new-ord-meds" placeholder="e.g. Paracetamol 500mg x2"></div>
    <div class="form-row">
      <div class="form-group"><label>Amount (₹)</label><input type="number" id="new-ord-amount" placeholder="0"></div>
      <div class="form-group"><label>Date</label><input type="date" id="new-ord-date" value="${new Date().toISOString().split('T')[0]}"></div>
    </div>
    <div class="form-group"><label><input type="checkbox" id="new-ord-rx"> Requires Prescription</label></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveNewOrder()">💾 Save Order</button>`
  );
}

function saveNewOrder() {
  const patient = document.getElementById('new-ord-patient').value.trim();
  const phone = document.getElementById('new-ord-phone').value.trim();
  const medicines = document.getElementById('new-ord-meds').value.trim();
  const amount = parseFloat(document.getElementById('new-ord-amount').value) || 0;
  const date = document.getElementById('new-ord-date').value;
  const prescription = document.getElementById('new-ord-rx').checked;
  if (!patient || !medicines) { showToast('Patient name and medicines are required', 'error'); return; }
  const orders = load(KEY.orders, []);
  const id = 'ORD' + String(orders.length + 1).padStart(3, '0');
  orders.unshift({ id, patient, phone, medicines, amount, status: 'new', date, prescription });
  save(KEY.orders, orders);
  closeModal();
  renderOrders();
  showToast('Order created', 'success');
}

// ── 3. PRESCRIPTIONS ─────────────────────────────
function renderPrescriptions() {
  const pres = load(KEY.prescriptions, []);
  const el = document.getElementById('section-prescriptions');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Prescription Verification</h2><p>${pres.filter(p => p.status === 'pending').length} pending verification</p></div>
    </div>
    ${pres.map(p => rxCard(p)).join('')}
  `;
}

function rxCard(p) {
  const schedBadge = p.schedule === 'X' ? '<span class="badge badge-x">Schedule X</span>' : p.schedule === 'H' ? '<span class="badge badge-h">Schedule H</span>' : '';
  const expired = new Date(p.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return `<div class="rx-card">
    <div class="rx-header">
      <div>
        <div class="rx-id">🧾 ${escHtml(p.id)}</div>
        <div class="rx-patient">${escHtml(p.patient)}</div>
        <div class="rx-doctor">👨‍⚕️ ${escHtml(p.doctor)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        ${statusBadge(p.status)}
        ${schedBadge}
        ${expired ? '<span class="badge badge-danger">Expired Rx</span>' : ''}
      </div>
    </div>
    <div class="rx-medicines">💊 ${escHtml(p.medicines)}</div>
    <div class="rx-alerts">
      ${p.alerts.map(a => `<div class="alert-item ${a.includes('Schedule X') ? 'alert-danger' : 'alert-warning'}">⚠️ ${escHtml(a)}</div>`).join('')}
    </div>
    <div style="font-size:12px;color:var(--gray-text)">📅 ${formatDate(p.date)}</div>
    ${p.status === 'pending' ? `<div class="rx-actions">
      <button class="btn btn-success btn-sm" onclick="updateRx('${p.id}','verified')">✔ Verify</button>
      <button class="btn btn-danger btn-sm" onclick="updateRx('${p.id}','rejected')">✖ Reject</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Clarification request sent','info')">⚠ Clarification</button>
    </div>` : `<div class="rx-actions"><p class="text-muted">Action taken: ${p.status}</p></div>`}
  </div>`;
}

function updateRx(id, status) {
  const pres = load(KEY.prescriptions, []);
  const idx = pres.findIndex(p => p.id === id);
  if (idx !== -1) { pres[idx].status = status; save(KEY.prescriptions, pres); renderPrescriptions(); showToast(`Prescription ${id} ${status}`, 'success'); }
}

// ── 4. INVENTORY ───────────────────────────────────
let invFilter = 'all';

function renderInventory() {
  const inv = load(KEY.inventory, []);
  const filters = ['all', 'low', 'expiring', 'out'];
  const filterLabels = { all: 'All', low: 'Low Stock', expiring: 'Expiring Soon', out: 'Out of Stock' };

  let filtered = inv;
  if (invFilter === 'low') filtered = filtered.filter(i => i.stock > 0 && i.stock < 10);
  else if (invFilter === 'out') filtered = filtered.filter(i => i.stock === 0);
  else if (invFilter === 'expiring') {
    const soon = new Date(); soon.setDate(soon.getDate() + 90);
    filtered = filtered.filter(i => new Date(i.expiry) <= soon);
  }

  const el = document.getElementById('section-inventory');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Inventory Management</h2><p>${inv.length} medicines registered</p></div>
      <button class="btn btn-primary" onclick="openAddInvModal()">➕ Add Medicine</button>
    </div>
    <div class="filter-bar">
      ${filters.map(f => `<button class="filter-pill ${invFilter === f ? 'active' : ''}" onclick="setInvFilter('${f}')">${filterLabels[f]}</button>`).join('')}
    </div>
    <div class="inv-grid">
      ${filtered.length ? filtered.map(i => invCard(i)).join('') : '<div class="empty-state"><div class="empty-icon">💊</div><p>No medicines found.</p></div>'}
    </div>
  `;
}

function invCard(i) {
  const schedBadge = i.schedule === 'X' ? '<span class="badge badge-x">Schedule X</span>' : i.schedule === 'H' ? '<span class="badge badge-h">Schedule H</span>' : '';
  const exp = expiryAlert(i.expiry);
  return `<div class="inv-card">
    <div class="inv-card-top">
      <div><div class="inv-name">${escHtml(i.name)}</div><div class="inv-generic">${escHtml(i.generic)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">${stockBadge(i.stock)} ${schedBadge}</div>
    </div>
    <div class="inv-detail-row"><span>Batch</span><span>${escHtml(i.batch)}</span></div>
    <div class="inv-detail-row"><span>Expiry</span><span>${formatDate(i.expiry)} ${exp}</span></div>
    <div class="inv-detail-row"><span>MRP</span><span>₹${i.mrp}</span></div>
    <div class="inv-detail-row"><span>Purchase</span><span>₹${i.purchase}</span></div>
    <div class="inv-detail-row"><span>Stock</span><span>${i.stock} units</span></div>
    <div class="inv-detail-row"><span>Category</span><span>${escHtml(i.category)}</span></div>
    <div class="inv-footer">
      <span class="text-muted" style="font-size:12px">ID: ${escHtml(i.id)}</span>
      <button class="btn btn-danger btn-sm" onclick="deleteInv('${i.id}')">🗑 Delete</button>
    </div>
  </div>`;
}

function setInvFilter(f) { invFilter = f; renderInventory(); }

function deleteInv(id) {
  if (!confirm('Delete this medicine?')) return;
  save(KEY.inventory, load(KEY.inventory, []).filter(i => i.id !== id));
  renderInventory();
  showToast('Medicine deleted', 'error');
}

function openAddInvModal() {
  openModal('💊 Add Medicine',
    `<div class="form-row">
      <div class="form-group"><label>Medicine Name</label><input type="text" id="inv-name" placeholder="Brand name"></div>
      <div class="form-group"><label>Generic Name</label><input type="text" id="inv-generic" placeholder="Generic / INN name"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Batch Number</label><input type="text" id="inv-batch" placeholder="e.g. BTH2024A"></div>
      <div class="form-group"><label>Expiry Date</label><input type="date" id="inv-expiry"></div>
    </div>
    <div class="form-row-3">
      <div class="form-group"><label>MRP (₹)</label><input type="number" id="inv-mrp" placeholder="0"></div>
      <div class="form-group"><label>Purchase Price (₹)</label><input type="number" id="inv-purchase" placeholder="0"></div>
      <div class="form-group"><label>Current Stock</label><input type="number" id="inv-stock" placeholder="0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Category</label><input type="text" id="inv-category" placeholder="e.g. Antibiotic"></div>
      <div class="form-group"><label>Schedule</label>
        <select id="inv-schedule">
          <option value="none">None</option>
          <option value="H">Schedule H</option>
          <option value="X">Schedule X</option>
        </select>
      </div>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveNewInv()">💾 Add Medicine</button>`
  );
}

function saveNewInv() {
  const name = document.getElementById('inv-name').value.trim();
  if (!name) { showToast('Medicine name is required', 'error'); return; }
  const inv = load(KEY.inventory, []);
  inv.push({
    id: 'INV' + uid(),
    name,
    generic: document.getElementById('inv-generic').value.trim(),
    batch: document.getElementById('inv-batch').value.trim(),
    expiry: document.getElementById('inv-expiry').value,
    mrp: parseFloat(document.getElementById('inv-mrp').value) || 0,
    purchase: parseFloat(document.getElementById('inv-purchase').value) || 0,
    stock: parseInt(document.getElementById('inv-stock').value) || 0,
    category: document.getElementById('inv-category').value.trim(),
    schedule: document.getElementById('inv-schedule').value,
  });
  save(KEY.inventory, inv);
  closeModal();
  renderInventory();
  showToast('Medicine added to inventory', 'success');
}

// ── 5. SUBSTITUTION ────────────────────────────────
function renderSubstitution() {
  const subs = load(KEY.substitutions, []);
  const el = document.getElementById('section-substitution');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Substitution Control</h2><p>Manage medicine substitution requests</p></div>
    </div>
    ${subs.length ? subs.map(s => subCard(s)).join('') : '<div class="empty-state"><div class="empty-icon">🔄</div><p>No substitution requests.</p></div>'}
  `;
}

function subCard(s) {
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--c4);font-weight:700">${escHtml(s.id)} · Order: ${escHtml(s.order)}</div>
        <div style="font-size:15px;font-weight:600;margin-top:4px">Original: ${escHtml(s.original)}</div>
        <div style="font-size:14px;color:var(--gray-text);margin-top:2px">Suggested: <strong>${escHtml(s.alternative)}</strong></div>
        <div style="margin-top:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          ${s.doctorPermission ? '<span class="badge badge-success">Doctor Approved</span>' : '<span class="badge badge-warning">Awaiting Doctor</span>'}
          ${statusBadge(s.status)}
        </div>
      </div>
      ${s.status === 'pending' ? `<div style="display:flex;flex-direction:column;gap:8px;min-width:200px">
        <input type="text" placeholder="Enter reason…" id="sub-reason-${s.id}" value="${escHtml(s.reason)}" class="">
        <div style="display:flex;gap:8px">
          <button class="btn btn-success btn-sm" onclick="updateSub('${s.id}','approved')">✔ Approve</button>
          <button class="btn btn-danger btn-sm" onclick="updateSub('${s.id}','rejected')">✖ Reject</button>
        </div>
        ${!s.doctorPermission ? '<button class="btn btn-secondary btn-sm" onclick="showToast(\'Doctor notification sent\',\'info\')">📨 Notify Doctor</button>' : ''}
      </div>` : `<button class="btn btn-danger btn-sm" onclick="deleteSub('${s.id}')">🗑 Delete</button>`}
    </div>
  </div>`;
}

function updateSub(id, status) {
  const subs = load(KEY.substitutions, []);
  const idx = subs.findIndex(s => s.id === id);
  if (idx !== -1) {
    subs[idx].status = status;
    const r = document.getElementById(`sub-reason-${id}`);
    if (r) subs[idx].reason = r.value;
    save(KEY.substitutions, subs);
    renderSubstitution();
    showToast(`Substitution ${status}`, 'success');
  }
}

function deleteSub(id) {
  save(KEY.substitutions, load(KEY.substitutions, []).filter(s => s.id !== id));
  renderSubstitution();
  showToast('Substitution request deleted', 'error');
}

// ── 6. ANALYTICS ──────────────────────────────────
function renderAnalytics() {
  const orders = load(KEY.orders, []);
  const inv = load(KEY.inventory, []);
  const delivered = orders.filter(o => o.status === 'delivered');
  const daily = delivered.reduce((s, o) => s + o.amount, 0);
  const monthly = daily * 22;
  const totalCost = inv.reduce((s, i) => s + i.purchase * i.stock, 0);
  const totalMrp = inv.reduce((s, i) => s + i.mrp * i.stock, 0);
  const margin = totalMrp > 0 ? Math.round(((totalMrp - totalCost) / totalMrp) * 100) : 0;

  const topMeds = [
    { name: 'Metformin 500mg', qty: 230, revenue: 10350 },
    { name: 'Amlodipine 5mg', qty: 180, revenue: 10800 },
    { name: 'Atorvastatin 10mg', qty: 145, revenue: 17400 },
    { name: 'Insulin Glargine', qty: 60, revenue: 66000 },
    { name: 'Azithromycin 500mg', qty: 95, revenue: 8075 },
  ];
  const maxRev = Math.max(...topMeds.map(m => m.revenue));

  const el = document.getElementById('section-analytics');
  el.innerHTML = `
    <div class="section-header"><div><h2>Sales & Analytics</h2><p>Performance overview</p></div></div>
    <div class="stat-grid">
      ${statCard('💰', '₹' + daily.toLocaleString('en-IN'), 'Daily Revenue', 'success-card')}
      ${statCard('📈', '₹' + monthly.toLocaleString('en-IN'), 'Monthly Revenue (est.)', 'success-card')}
      ${statCard('📊', margin + '%', 'Gross Margin', '')}
      ${statCard('🔁', '68%', 'Repeat Patients', '')}
      ${statCard('💊', '12', 'Chronic Refills', '')}
      ${statCard('⭐', '5', 'High-Margin Items', '')}
    </div>
    <div class="card">
      <div class="card-title">📊 Top Selling Medicines (Monthly Revenue)</div>
      <div class="bar-chart">
        ${topMeds.map(m => `<div class="bar-row">
          <div class="bar-label">${escHtml(m.name)}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((m.revenue / maxRev) * 100)}%"></div></div>
          <div class="bar-value">₹${m.revenue.toLocaleString('en-IN')}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="card" style="margin-top:20px">
      <div class="card-title">📋 Top Medicines by Quantity Sold</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Medicine</th><th>Qty Sold</th><th>Revenue</th><th>Margin</th></tr></thead>
          <tbody>
            ${topMeds.map(m => `<tr>
              <td><strong>${escHtml(m.name)}</strong></td>
              <td>${m.qty} units</td>
              <td>₹${m.revenue.toLocaleString('en-IN')}</td>
              <td><span class="badge badge-success">${Math.round(20 + Math.random() * 20)}%</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── 7. DELIVERY ────────────────────────────────────
function renderDelivery() {
  const orders = load(KEY.orders, []);
  const readyOrders = orders.filter(o => o.status === 'packed' || o.status === 'out_for_delivery');
  const partners = ['Ravi (Bike)', 'Suresh (Cycle)', 'Mohan (Bike)', 'Third-party Courier'];

  const el = document.getElementById('section-delivery');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Delivery Coordination</h2><p>${readyOrders.length} orders ready / in transit</p></div>
    </div>
    ${readyOrders.length ? readyOrders.map(o => `
      <div class="delivery-card">
        <div style="font-size:28px">📦</div>
        <div class="delivery-info">
          <div class="delivery-id">${escHtml(o.id)}</div>
          <div class="delivery-patient">${escHtml(o.patient)}</div>
          <div class="delivery-address">📞 ${escHtml(o.phone)} · ${escHtml(o.medicines)}</div>
          <div style="margin-top:6px">${statusBadge(o.status)}</div>
        </div>
        <div class="delivery-actions">
          ${o.status === 'packed' ? `
            <select id="dp-${o.id}" style="padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit">
              <option value="">Select partner…</option>
              ${partners.map(p => `<option>${p}</option>`).join('')}
            </select>
            <button class="btn btn-primary btn-sm" onclick="assignDelivery('${o.id}')">🚚 Assign</button>
          ` : `
            <span class="badge badge-out_for_delivery">In Transit</span>
            <button class="btn btn-success btn-sm" onclick="markDelivered('${o.id}')">✅ Delivered</button>
          `}
          <button class="btn btn-danger btn-sm" onclick="markIssue('${o.id}')">⚠ Issue</button>
        </div>
      </div>
    `).join('') : '<div class="empty-state"><div class="empty-icon">🚚</div><p>No orders pending delivery.</p></div>'}
  `;
}

function assignDelivery(id) {
  const sel = document.getElementById(`dp-${id}`);
  if (!sel || !sel.value) { showToast('Select a delivery partner first', 'error'); return; }
  const orders = load(KEY.orders, []);
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) { orders[idx].status = 'out_for_delivery'; save(KEY.orders, orders); renderDelivery(); showToast(`Order ${id} assigned to ${sel.value}`, 'success'); }
}

function markDelivered(id) {
  const orders = load(KEY.orders, []);
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) { orders[idx].status = 'delivered'; save(KEY.orders, orders); renderDelivery(); showToast(`Order ${id} marked delivered`, 'success'); }
}

function markIssue(id) { showToast(`Issue logged for order ${id}`, 'info'); }

// ── 8. CHRONIC REFILL ──────────────────────────────
function renderChronic() {
  const patients = load(KEY.patients, []);
  const el = document.getElementById('section-chronic');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Chronic Refill Management</h2><p>${patients.length} chronic patients enrolled</p></div>
      <button class="btn btn-primary" onclick="openAddPatientModal()">➕ Add Patient</button>
    </div>
    ${patients.map(p => patientCard(p)).join('')}
  `;
}

function patientCard(p) {
  const adherenceColor = p.adherence >= 90 ? 'var(--success)' : p.adherence >= 70 ? '#F59E0B' : 'var(--error)';
  const today = new Date(), due = new Date(p.nextDue);
  const overdue = due < today;
  return `<div class="patient-card">
    <div class="patient-avatar">👤</div>
    <div class="patient-info">
      <div class="patient-name">${escHtml(p.name)} <span class="badge badge-info" style="font-size:10px">${escHtml(p.id)}</span></div>
      <div class="patient-condition">🏥 ${escHtml(p.condition)}</div>
      <div class="patient-meds">💊 ${escHtml(p.medicines)}</div>
      <div class="adherence-bar">
        <div class="adherence-track"><div class="adherence-fill" style="width:${p.adherence}%;background:${adherenceColor}"></div></div>
        <span class="adherence-label" style="color:${adherenceColor}">${p.adherence}%</span>
        <span class="text-muted" style="font-size:12px">adherence</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;min-width:180px;align-items:flex-end">
      <div style="font-size:13px;color:var(--gray-text)">Last: ${formatDate(p.lastRefill)}</div>
      <div style="font-size:13px">Next: <strong class="${overdue ? 'text-danger' : 'text-primary'}">${formatDate(p.nextDue)}</strong></div>
      ${overdue ? '<span class="badge badge-danger">Overdue</span>' : ''}
      <div style="display:flex;gap:6px">
        <button class="btn btn-success btn-sm" onclick="triggerRefill('${p.id}')">🔔 Remind</button>
        <button class="btn btn-secondary btn-sm" onclick="suggestReorder('${p.id}')">🔁 Reorder</button>
        <button class="btn btn-danger btn-sm" onclick="deletePatient('${p.id}')">🗑</button>
      </div>
    </div>
  </div>`;
}

function triggerRefill(id) { showToast(`Refill reminder sent to patient ${id}`, 'info'); }
function suggestReorder(id) { showToast(`Auto-reorder suggestion created for patient ${id}`, 'success'); }

function deletePatient(id) {
  if (!confirm('Remove patient from chronic list?')) return;
  save(KEY.patients, load(KEY.patients, []).filter(p => p.id !== id));
  renderChronic();
  showToast('Patient removed', 'error');
}

function openAddPatientModal() {
  openModal('➕ Add Chronic Patient',
    `<div class="form-row">
      <div class="form-group"><label>Patient Name</label><input type="text" id="pat-name" placeholder="Full name"></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="pat-phone" placeholder="10-digit"></div>
    </div>
    <div class="form-group"><label>Chronic Condition(s)</label><input type="text" id="pat-cond" placeholder="e.g. Diabetes, Hypertension"></div>
    <div class="form-group"><label>Medicines</label><input type="text" id="pat-meds" placeholder="e.g. Metformin 500mg, Amlodipine 5mg"></div>
    <div class="form-row">
      <div class="form-group"><label>Last Refill</label><input type="date" id="pat-last"></div>
      <div class="form-group"><label>Next Due</label><input type="date" id="pat-next"></div>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveNewPatient()">💾 Add Patient</button>`
  );
}

function saveNewPatient() {
  const name = document.getElementById('pat-name').value.trim();
  if (!name) { showToast('Patient name required', 'error'); return; }
  const patients = load(KEY.patients, []);
  patients.push({
    id: 'PAT' + uid(),
    name,
    phone: document.getElementById('pat-phone').value.trim(),
    condition: document.getElementById('pat-cond').value.trim(),
    medicines: document.getElementById('pat-meds').value.trim(),
    lastRefill: document.getElementById('pat-last').value,
    nextDue: document.getElementById('pat-next').value,
    adherence: 100,
  });
  save(KEY.patients, patients);
  closeModal();
  renderChronic();
  showToast('Patient added', 'success');
}

// ── 9. COMMUNICATION ───────────────────────────────
let chatTab = 'doctor';
let activeContact = 0;

function renderCommunication() {
  const chats = load(KEY.chats, defaultChats);
  const contacts = chats[chatTab];
  const conv = contacts[activeContact] || contacts[0];

  const el = document.getElementById('section-communication');
  el.innerHTML = `
    <div class="section-header"><div><h2>Communication</h2><p>Chat with doctors and patients</p></div></div>
    <div class="chat-layout">
      <div class="chat-sidebar">
        <div class="chat-tabs">
          <div class="chat-tab ${chatTab === 'doctor' ? 'active' : ''}" onclick="setChatTab('doctor')">👨‍⚕️ Doctor</div>
          <div class="chat-tab ${chatTab === 'patient' ? 'active' : ''}" onclick="setChatTab('patient')">👤 Patient</div>
        </div>
        ${contacts.map((c, i) => `
          <div class="chat-contact ${i === activeContact ? 'active' : ''}" onclick="setActiveContact(${i})">
            <div class="cname">${escHtml(c.contact)}</div>
            <div class="clast">${c.messages.length ? escHtml(c.messages[c.messages.length - 1].text.slice(0, 40)) + '…' : 'No messages'}</div>
          </div>
        `).join('')}
      </div>
      <div class="chat-main">
        <div class="chat-header">
          <span style="font-size:20px">${chatTab === 'doctor' ? '👨‍⚕️' : '👤'}</span>
          <span>${conv ? escHtml(conv.contact) : 'Select a contact'}</span>
          ${chatTab === 'doctor' ? '<button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="showToast(\'Prescription request sent\',\'info\')">📋 Request Rx</button>' : ''}
        </div>
        <div class="chat-messages" id="chat-msgs">
          ${conv ? conv.messages.map(m => `
            <div class="chat-bubble ${m.from === 'me' ? 'sent' : 'recv'}">
              ${escHtml(m.text)}
              <div class="ts">${escHtml(m.time)}</div>
            </div>
          `).join('') : '<p class="text-muted" style="margin:auto">Select a contact to start chatting</p>'}
        </div>
        <div class="chat-input-row">
          <input type="text" id="chat-input" placeholder="Type a message…" onkeydown="if(event.key==='Enter')sendChatMsg()">
          <button class="btn btn-primary" onclick="sendChatMsg()">Send ➤</button>
        </div>
      </div>
    </div>
  `;
  const msgs = document.getElementById('chat-msgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function setChatTab(tab) { chatTab = tab; activeContact = 0; renderCommunication(); }
function setActiveContact(i) { activeContact = i; renderCommunication(); }

function sendChatMsg() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const chats = load(KEY.chats, defaultChats);
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  chats[chatTab][activeContact].messages.push({ text, from: 'me', time });
  save(KEY.chats, chats);
  renderCommunication();
}

// ── 10. PAYMENT ────────────────────────────────────
function renderPayment() {
  const orders = load(KEY.orders, []);
  const delivered = orders.filter(o => o.status === 'delivered');
  const total = delivered.reduce((s, o) => s + o.amount, 0);
  const commission = Math.round(total * 0.05);
  const net = total - commission;
  const returns = load(KEY.returns, []).filter(r => r.status === 'approved').reduce((s, r) => s + r.refund, 0);

  const settlements = delivered.map(o => ({
    id: o.id,
    value: o.amount,
    commission: Math.round(o.amount * 0.05),
    net: Math.round(o.amount * 0.95),
    status: 'settled',
  }));

  const el = document.getElementById('section-payment');
  el.innerHTML = `
    <div class="section-header"><div><h2>Payment & Settlement</h2><p>Settlement cycle: Monthly</p></div></div>
    <div class="settlement-summary">
      ${settleCard('💰', '₹' + total.toLocaleString('en-IN'), 'Total Order Value')}
      ${settleCard('📉', '₹' + commission.toLocaleString('en-IN'), 'Platform Commission (5%)')}
      ${settleCard('✅', '₹' + net.toLocaleString('en-IN'), 'Net Payable')}
      ${settleCard('↩️', '₹' + returns.toLocaleString('en-IN'), 'Refund Deductions')}
      ${settleCard('💵', '₹' + (net - returns).toLocaleString('en-IN'), 'Final Settlement')}
    </div>
    <div class="card">
      <div class="card-title">📋 Settlement Ledger</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Order Value</th><th>Commission</th><th>Net Payable</th><th>Status</th></tr></thead>
          <tbody>
            ${settlements.map(s => `<tr>
              <td><strong>${escHtml(s.id)}</strong></td>
              <td>₹${s.value}</td>
              <td class="text-danger">−₹${s.commission}</td>
              <td class="text-success fw-bold">₹${s.net}</td>
              <td><span class="badge badge-success">Settled</span></td>
            </tr>`).join('') || '<tr><td colspan="5" class="text-muted" style="text-align:center;padding:20px">No settlements yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function settleCard(icon, val, lbl) {
  return `<div class="settle-card"><div style="font-size:22px">${icon}</div><div class="val">${val}</div><div class="lbl">${lbl}</div></div>`;
}

// ── 11. COMPLIANCE ─────────────────────────────────
function renderCompliance() {
  const records = load(KEY.compliance, []);
  const inv = load(KEY.inventory, []);
  const schedX = inv.filter(i => i.schedule === 'X');

  const el = document.getElementById('section-compliance');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Compliance & Legal</h2><p>Regulatory compliance records</p></div>
      <button class="btn btn-primary" onclick="openAddComplianceModal()">➕ Add Record</button>
    </div>
    <div class="compliance-section">
      <h3>🔴 Schedule X Blocked Drugs</h3>
      ${schedX.length ? schedX.map(i => `
        <div class="alert-card danger" style="margin-bottom:8px">
          <span class="alert-icon">🔴</span>
          <div><strong>${escHtml(i.name)}</strong> – ${escHtml(i.generic)} (Batch: ${escHtml(i.batch)})<br>
          <span style="font-size:12px">Stock: ${i.stock} units | Requires written Rx + ID proof</span></div>
        </div>
      `).join('') : '<p class="text-muted">No Schedule X drugs in inventory.</p>'}
    </div>
    <div class="compliance-section">
      <h3>📋 Sale & Compliance Register</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Record ID</th><th>Type</th><th>Drug</th><th>Patient</th><th>Qty</th><th>Date</th><th>ID Verified</th><th>Action</th></tr></thead>
          <tbody>
            ${records.map(r => `<tr>
              <td><strong>${escHtml(r.id)}</strong></td>
              <td>${escHtml(r.type)}</td>
              <td>${escHtml(r.drug)}</td>
              <td>${escHtml(r.patient)}</td>
              <td>${r.quantity}</td>
              <td>${formatDate(r.date)}</td>
              <td>${r.idVerified ? '<span class="badge badge-success">✔ Yes</span>' : '<span class="badge badge-warning">✖ No</span>'}</td>
              <td><button class="btn btn-danger btn-sm" onclick="deleteCompliance('${r.id}')">🗑</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="compliance-section">
      <h3>🔍 Audit Logs</h3>
      <div class="alert-list">
        <div class="alert-card info"><span class="alert-icon">🔍</span><div><strong>System Login</strong> – Pharmacist logged in · Today 09:00</div></div>
        <div class="alert-card info"><span class="alert-icon">📋</span><div><strong>Prescription Verified</strong> – RX004 for Sunita Devi · Today 09:30</div></div>
        <div class="alert-card warning"><span class="alert-icon">⚠️</span><div><strong>Schedule X Sale</strong> – Alprazolam 0.5mg · Deepak Mehta · Today 10:15</div></div>
      </div>
    </div>
  `;
}

function deleteCompliance(id) {
  if (!confirm('Delete this compliance record?')) return;
  save(KEY.compliance, load(KEY.compliance, []).filter(r => r.id !== id));
  renderCompliance();
  showToast('Record deleted', 'error');
}

function openAddComplianceModal() {
  openModal('➕ Add Compliance Record',
    `<div class="form-row">
      <div class="form-group"><label>Record Type</label>
        <select id="cmp-type">
          <option>Schedule X Sale</option>
          <option>Controlled Drug Record</option>
          <option>Audit Entry</option>
          <option>Batch Tracking</option>
        </select>
      </div>
      <div class="form-group"><label>Drug Name</label><input type="text" id="cmp-drug" placeholder="Medicine name"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Patient</label><input type="text" id="cmp-patient" placeholder="Patient name"></div>
      <div class="form-group"><label>Quantity</label><input type="number" id="cmp-qty" placeholder="0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Date</label><input type="date" id="cmp-date" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label><input type="checkbox" id="cmp-id"> ID Verified</label></div>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveCompliance()">💾 Save Record</button>`
  );
}

function saveCompliance() {
  const records = load(KEY.compliance, []);
  records.push({
    id: 'CMP' + uid(),
    type: document.getElementById('cmp-type').value,
    drug: document.getElementById('cmp-drug').value.trim(),
    patient: document.getElementById('cmp-patient').value.trim(),
    quantity: parseInt(document.getElementById('cmp-qty').value) || 0,
    date: document.getElementById('cmp-date').value,
    idVerified: document.getElementById('cmp-id').checked,
  });
  save(KEY.compliance, records);
  closeModal();
  renderCompliance();
  showToast('Record saved', 'success');
}

// ── 12. RETURNS ────────────────────────────────────
function renderReturns() {
  const returns = load(KEY.returns, []);
  const el = document.getElementById('section-returns');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Return & Refund Management</h2><p>${returns.filter(r => r.status === 'pending').length} pending approvals</p></div>
      <button class="btn btn-primary" onclick="openAddReturnModal()">➕ Add Return</button>
    </div>
    ${returns.length ? returns.map(r => returnCard(r)).join('') : '<div class="empty-state"><div class="empty-icon">↩️</div><p>No return requests.</p></div>'}
  `;
}

function returnCard(r) {
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--c4);font-weight:700">${escHtml(r.id)} · Order: ${escHtml(r.order)}</div>
        <div style="font-size:15px;font-weight:600;margin-top:4px">${escHtml(r.patient)}</div>
        <div style="font-size:13px;color:var(--gray-text);margin-top:2px">Reason: ${escHtml(r.reason)}</div>
        <div style="font-size:13px;margin-top:4px">Refund: <strong class="text-primary">₹${r.refund}</strong> · ${formatDate(r.date)}</div>
        <div style="margin-top:8px">${statusBadge(r.status)}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        ${r.status === 'pending' ? `
          <button class="btn btn-success btn-sm" onclick="updateReturn('${r.id}','approved')">✔ Approve</button>
          <button class="btn btn-danger btn-sm" onclick="updateReturn('${r.id}','rejected')">✖ Reject</button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" onclick="showToast('Replacement tracked for ${r.order}','info')">🔄 Track</button>
        <button class="btn btn-danger btn-sm" onclick="deleteReturn('${r.id}')">🗑</button>
      </div>
    </div>
  </div>`;
}

function updateReturn(id, status) {
  const returns = load(KEY.returns, []);
  const idx = returns.findIndex(r => r.id === id);
  if (idx !== -1) { returns[idx].status = status; save(KEY.returns, returns); renderReturns(); showToast(`Return ${status}`, 'success'); }
}

function deleteReturn(id) {
  save(KEY.returns, load(KEY.returns, []).filter(r => r.id !== id));
  renderReturns();
  showToast('Return deleted', 'error');
}

function openAddReturnModal() {
  openModal('➕ Add Return Request',
    `<div class="form-row">
      <div class="form-group"><label>Order ID</label><input type="text" id="ret-order" placeholder="e.g. ORD001"></div>
      <div class="form-group"><label>Patient Name</label><input type="text" id="ret-patient" placeholder="Full name"></div>
    </div>
    <div class="form-group"><label>Reason</label>
      <select id="ret-reason">
        <option>Wrong product</option>
        <option>Damaged packaging</option>
        <option>Expired medicine</option>
        <option>Delivery failure</option>
        <option>Other</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Refund Amount (₹)</label><input type="number" id="ret-refund" placeholder="0"></div>
      <div class="form-group"><label>Date</label><input type="date" id="ret-date" value="${new Date().toISOString().split('T')[0]}"></div>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveReturn()">💾 Submit Return</button>`
  );
}

function saveReturn() {
  const order = document.getElementById('ret-order').value.trim();
  if (!order) { showToast('Order ID required', 'error'); return; }
  const returns = load(KEY.returns, []);
  returns.push({
    id: 'RET' + uid(),
    order,
    patient: document.getElementById('ret-patient').value.trim(),
    reason: document.getElementById('ret-reason').value,
    date: document.getElementById('ret-date').value,
    status: 'pending',
    refund: parseFloat(document.getElementById('ret-refund').value) || 0,
  });
  save(KEY.returns, returns);
  closeModal();
  renderReturns();
  showToast('Return request submitted', 'success');
}

// ── 13. DOCUMENTS ──────────────────────────────────
function renderDocuments() {
  const docs = load(KEY.documents, defaultDocuments);
  const el = document.getElementById('section-documents');
  el.innerHTML = `
    <div class="section-header"><div><h2>Document Storage</h2><p>Upload and manage store documents</p></div></div>
    <div class="doc-grid">
      ${docs.map(d => docCard(d)).join('')}
    </div>
    <button class="btn btn-primary mt-4" onclick="openAddDocModal()">➕ Add Document Type</button>
  `;
}

function docCard(d) {
  return `<div class="doc-card ${d.filename ? 'uploaded' : ''}">
    <div class="doc-name">📄 ${escHtml(d.type)}</div>
    ${d.filename ? `<div class="doc-filename">📎 ${escHtml(d.filename)}</div>` : '<div class="text-muted" style="font-size:12px">No file uploaded</div>'}
    <div style="margin-top:4px">
      ${d.status === 'verified' ? '<span class="badge badge-success">✔ Verified</span>' : '<span class="badge badge-warning">⏳ Pending</span>'}
    </div>
    <div class="doc-actions mt-2">
      <label class="btn btn-secondary btn-sm" style="cursor:pointer">
        📤 Upload
        <input type="file" style="display:none" onchange="uploadDoc('${d.id}', this)">
      </label>
      ${d.filename ? `<button class="btn btn-danger btn-sm" onclick="deleteDoc('${d.id}')">🗑</button>` : ''}
    </div>
  </div>`;
}

function uploadDoc(id, input) {
  if (!input.files[0]) return;
  const docs = load(KEY.documents, defaultDocuments);
  const idx = docs.findIndex(d => d.id === id);
  if (idx !== -1) { docs[idx].filename = input.files[0].name; docs[idx].status = 'pending'; save(KEY.documents, docs); renderDocuments(); showToast('Document uploaded', 'success'); }
}

function deleteDoc(id) {
  const docs = load(KEY.documents, defaultDocuments);
  const idx = docs.findIndex(d => d.id === id);
  if (idx !== -1) { docs[idx].filename = null; docs[idx].status = 'pending'; save(KEY.documents, docs); renderDocuments(); showToast('Document removed', 'error'); }
}

function openAddDocModal() {
  openModal('➕ Add Document Type',
    `<div class="form-group"><label>Document Type</label><input type="text" id="doc-type" placeholder="e.g. FSSAI License"></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="saveDocType()">Add</button>`
  );
}

function saveDocType() {
  const type = document.getElementById('doc-type').value.trim();
  if (!type) { showToast('Document type required', 'error'); return; }
  const docs = load(KEY.documents, defaultDocuments);
  docs.push({ id: 'DOC' + uid(), type, filename: null, status: 'pending' });
  save(KEY.documents, docs);
  closeModal();
  renderDocuments();
  showToast('Document type added', 'success');
}

// ── 14. SETTINGS ───────────────────────────────────
function renderSettings() {
  const s = load(KEY.settings, defaultSettings);
  const el = document.getElementById('section-settings');
  el.innerHTML = `
    <div class="section-header"><div><h2>Settings</h2><p>Configure your pharmacy preferences</p></div></div>
    <div class="card">
      <div class="card-title">🏥 Store Information</div>
      <div class="form-row">
        <div class="form-group"><label>Store Name</label><input type="text" id="set-store" value="${escHtml(s.storeName)}"></div>
        <div class="form-group"><label>Pharmacist Name</label><input type="text" id="set-pharm" value="${escHtml(s.pharmacistName)}"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">🕐 Working Hours</div>
      <div class="form-row">
        <div class="form-group"><label>Opening Time</label><input type="time" id="set-open" value="${escHtml(s.openTime)}"></div>
        <div class="form-group"><label>Closing Time</label><input type="time" id="set-close" value="${escHtml(s.closeTime)}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Same-Day Delivery Cutoff</label><input type="time" id="set-cutoff" value="${escHtml(s.cutoffTime)}"></div>
        <div class="form-group"><label>Minimum Order Value (₹)</label><input type="number" id="set-minorder" value="${s.minOrder}"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">⚙️ Preferences</div>
      <div class="toggle-row">
        <div class="toggle-info">
          <div class="label">🏖️ Holiday Mode</div>
          <div class="desc">Pause all new orders when enabled</div>
        </div>
        <label class="toggle">
          <input type="checkbox" id="set-holiday" ${s.holidayMode ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
    <div style="margin-top:20px">
      <button class="btn btn-primary" onclick="saveSettings()">💾 Save Settings</button>
      <button class="btn btn-secondary" style="margin-left:10px" onclick="resetAllData()">🔄 Reset All Data</button>
    </div>
  `;
}

function saveSettings() {
  const s = {
    storeName: document.getElementById('set-store').value.trim(),
    pharmacistName: document.getElementById('set-pharm').value.trim(),
    openTime: document.getElementById('set-open').value,
    closeTime: document.getElementById('set-close').value,
    cutoffTime: document.getElementById('set-cutoff').value,
    minOrder: parseFloat(document.getElementById('set-minorder').value) || 0,
    holidayMode: document.getElementById('set-holiday').checked,
  };
  save(KEY.settings, s);
  showToast('Settings saved', 'success');
  // Update sidebar profile name
  const nameEl = document.querySelector('.sidebar-profile-info .name');
  if (nameEl) nameEl.textContent = s.pharmacistName;
}

function resetAllData() {
  if (!confirm('Reset ALL data to defaults? This cannot be undone.')) return;
  Object.values(KEY).forEach(k => localStorage.removeItem(k));
  initStorage();
  navigateTo('dashboard');
  showToast('All data reset to defaults', 'info');
}

// ── Sidebar / Mobile ────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
});

document.getElementById('sidebar-overlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
});

// ── Nav Click Bindings ─────────────────────────────
navItems.forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.section));
});

// ── Modal Close ────────────────────────────────────
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ── Init ───────────────────────────────────────────
initStorage();

// Populate sidebar profile
const settings = load(KEY.settings, defaultSettings);
document.querySelector('.sidebar-profile-info .name').textContent = settings.pharmacistName;

// Start on dashboard
navigateTo('dashboard');
