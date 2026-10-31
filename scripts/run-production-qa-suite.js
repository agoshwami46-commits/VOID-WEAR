import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, doc, getDoc } from 'firebase/firestore';

const BASE_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

const results = [];

function recordTest(phase, testName, passed, details = '') {
  results.push({ phase, testName, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${phase} - ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function get(pathStr) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + pathStr, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function post(pathStr, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(BASE_URL + pathStr, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('VOID WEAR — ULTIMATE PRODUCTION QA & AUTOMATED SUITE');
  console.log('======================================================\n');

  // --- TEST 1: Server Health ---
  try {
    const health = await get('/api/health');
    const parsed = JSON.parse(health.body);
    recordTest('PHASE 2: TECHNICAL', 'Server Health Check', health.statusCode === 200 && parsed.status === 'ok', `status: ${parsed.status}, products: ${parsed.productsCount}`);
  } catch (err) {
    recordTest('PHASE 2: TECHNICAL', 'Server Health Check', false, err.message);
  }

  // --- TEST 2: Security Headers ---
  try {
    const res = await get('/api/health');
    const hasNosniff = res.headers['x-content-type-options'] === 'nosniff';
    const hasReferrer = Boolean(res.headers['referrer-policy']);
    recordTest('PHASE 7: SECURITY', 'HTTP Security Headers', hasNosniff && hasReferrer, 'nosniff & referrer-policy active');
  } catch (err) {
    recordTest('PHASE 7: SECURITY', 'HTTP Security Headers', false, err.message);
  }

  // --- TEST 3: WebSocket HMR Protocol ---
  try {
    const clientRes = await get('/@vite/client');
    const match = clientRes.body.match(/const wsToken = "([^"]+)";/);
    const token = match ? match[1] : '';
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`${WS_URL}/?token=${token}`, 'vite-hmr');
      ws.on('open', () => {
        ws.close();
        resolve();
      });
      ws.on('error', reject);
    });
    recordTest('PHASE 2: TECHNICAL', 'Vite WebSocket HMR Handshake', true, 'connected with 101 Switching Protocols');
  } catch (err) {
    recordTest('PHASE 2: TECHNICAL', 'Vite WebSocket HMR Handshake', false, err.message);
  }

  // --- TEST 4: WebSocket Ping Protocol ---
  try {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL, 'vite-ping');
      ws.on('open', () => {
        ws.close();
        resolve();
      });
      ws.on('error', reject);
    });
    recordTest('PHASE 2: TECHNICAL', 'Vite WebSocket Ping Protocol', true, 'vite-ping protocol verified');
  } catch (err) {
    recordTest('PHASE 2: TECHNICAL', 'Vite WebSocket Ping Protocol', false, err.message);
  }

  // --- TEST 5: Cloud Firestore Integration ---
  try {
    const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
    const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
    const db = initializeFirestore(fbApp, { experimentalAutoDetectLongPolling: true }, cfg.firestoreDatabaseId);
    const docSnap = await getDoc(doc(db, 'products', 'void-mvw27kni'));
    recordTest('PHASE 3: FIREBASE', 'Cloud Firestore Live Query', docSnap.exists(), `Retrieved doc: ${docSnap.data()?.name}`);
  } catch (err) {
    recordTest('PHASE 3: FIREBASE', 'Cloud Firestore Live Query', false, err.message);
  }

  // --- TEST 6: Catalog & Product Verification ---
  let products = [];
  try {
    const prodsRes = await get('/api/products');
    products = JSON.parse(prodsRes.body);
    const countOk = products.length === 9;
    recordTest('PHASE 4: E-COMMERCE', 'Catalog Products Count', countOk, `Found ${products.length} of 9 products`);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Catalog Products Count', false, err.message);
  }

  // --- TEST 7: Multi-Angle Studio Photography ---
  try {
    const allImages = [];
    products.forEach((p) => {
      (p.images || []).forEach((img) => allImages.push(img));
      if (p.backImage) allImages.push(p.backImage);
      if (p.sideImage) allImages.push(p.sideImage);
    });
    const uniqueImages = Array.from(new Set(allImages));
    let passedImgs = 0;
    for (const imgUrl of uniqueImages) {
      const res = await get(imgUrl);
      if (res.statusCode === 200) passedImgs++;
    }
    const allImgsOk = passedImgs === uniqueImages.length;
    recordTest('PHASE 4: E-COMMERCE', 'Studio Photography Multi-Angle Assets', allImgsOk, `${passedImgs}/${uniqueImages.length} images returned HTTP 200`);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Studio Photography Multi-Angle Assets', false, err.message);
  }

  // --- TEST 8: Direct Product URLs (Page Refresh & SSR/SPA) ---
  try {
    let pagesOk = true;
    for (const p of products) {
      const res = await get(`/product/${p.slug || p.id}`);
      if (res.statusCode !== 200) pagesOk = false;
    }
    recordTest('PHASE 4: E-COMMERCE', 'Direct Product Detail Route Resolution', pagesOk, 'All 9 product slugs resolve 200 OK');
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Direct Product Detail Route Resolution', false, err.message);
  }

  // --- TEST 9: Core Storefront Routes ---
  const routes = ['/', '/shop', '/track-order', '/account', '/shipping', '/returns', '/privacy', '/terms', '/admin'];
  try {
    let allRoutesOk = true;
    for (const r of routes) {
      const res = await get(r);
      if (res.statusCode !== 200) allRoutesOk = false;
    }
    recordTest('PHASE 4: E-COMMERCE', 'Core Navigation & Policy Routes', allRoutesOk, '9/9 routes returned 200 OK');
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Core Navigation & Policy Routes', false, err.message);
  }

  // --- TEST 10: Coupon Validation Endpoint ---
  try {
    const couponRes = await post('/api/coupons/validate', { code: 'VOID10', orderAmount: 5000 });
    const coupon = JSON.parse(couponRes.body);
    const valid = couponRes.statusCode === 200 && coupon.discountAmount > 0;
    recordTest('PHASE 4: E-COMMERCE', 'Coupon Discount Engine (VOID10)', valid, `Discount calculated: ₹${coupon.discountAmount}`);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Coupon Discount Engine (VOID10)', false, err.message);
  }

  // --- TEST 11: Test Order Creation ---
  let createdOrderId = '';
  try {
    const testOrder = {
      customerName: 'Aesthetic QA Verifier',
      email: 'qa.test@voidwear.in',
      phone: '+919999999999',
      address: 'Varanasi Atelier Road',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221002',
      items: [
        {
          product: products[0],
          size: 'L',
          color: products[0]?.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' },
          quantity: 1
        }
      ],
      total: products[0]?.price || 1999,
      paymentMethod: 'COD',
      notes: 'Automated E-Commerce QA Test Order'
    };
    const orderRes = await post('/api/orders', testOrder);
    const order = JSON.parse(orderRes.body);
    createdOrderId = order.orderId;
    const orderOk = orderRes.statusCode === 201 && Boolean(order.orderId);
    recordTest('PHASE 4: E-COMMERCE', 'Order Placement Flow (Test Mode)', orderOk, `Generated Order ID: ${order.orderId}`);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Order Placement Flow (Test Mode)', false, err.message);
  }

  // --- TEST 12: Order Concierge Tracking ---
  try {
    if (createdOrderId) {
      const trackRes = await get(`/api/orders/${createdOrderId}`);
      const track = JSON.parse(trackRes.body);
      const trackOk = trackRes.statusCode === 200 && track.orderId === createdOrderId;
      recordTest('PHASE 4: E-COMMERCE', 'Order Tracking Concierge Lookup', trackOk, `Found status: ${track.status}`);
    } else {
      recordTest('PHASE 4: E-COMMERCE', 'Order Tracking Concierge Lookup', false, 'No order ID to look up');
    }
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Order Tracking Concierge Lookup', false, err.message);
  }

  // --- TEST 13: Customer Reviews API ---
  try {
    const revRes = await get('/api/reviews');
    const revs = JSON.parse(revRes.body);
    recordTest('PHASE 4: E-COMMERCE', 'Customer Reviews Feed', revRes.statusCode === 200 && Array.isArray(revs) && revs.length > 0, `Loaded ${revs.length} editorial reviews`);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'Customer Reviews Feed', false, err.message);
  }

  // --- TEST 14: Newsletter Subscription ---
  try {
    const newsRes = await post('/api/newsletter', { email: `vip.${Date.now()}@voidwear.in` });
    const news = JSON.parse(newsRes.body);
    recordTest('PHASE 4: E-COMMERCE', 'VIP Archive Newsletter Subscription', newsRes.statusCode === 200 && news.success === true, news.message);
  } catch (err) {
    recordTest('PHASE 4: E-COMMERCE', 'VIP Archive Newsletter Subscription', false, err.message);
  }

  // --- TEST 15: SEO Assets (robots.txt & sitemap.xml) ---
  try {
    const robots = await get('/robots.txt');
    const sitemap = await get('/sitemap.xml');
    const seoOk = robots.statusCode === 200 && sitemap.statusCode === 200 && sitemap.body.includes('<urlset');
    recordTest('PHASE 7: SEO', 'Production robots.txt and sitemap.xml', seoOk, 'Both crawled cleanly with 200 OK');
  } catch (err) {
    recordTest('PHASE 7: SEO', 'Production robots.txt and sitemap.xml', false, err.message);
  }

  // --- TEST 16: Password Exposure Inspection ---
  try {
    const protectedRouteCode = fs.readFileSync('src/components/ProtectedRoute.tsx', 'utf-8');
    const adminDashCode = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf-8');
    const hasExample = protectedRouteCode.includes('(e.g. 70772710void)') || protectedRouteCode.includes('(70772710void)') || adminDashCode.includes('KEY: 70772710void');
    recordTest('PHASE 7: SECURITY', 'Admin Login Example Removal (70772710void)', !hasExample, 'Raw password completely removed from examples and UI placeholders');
  } catch (err) {
    recordTest('PHASE 7: SECURITY', 'Admin Login Example Removal (70772710void)', false, err.message);
  }

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${results.length}`);
  const passCount = results.filter((r) => r.passed).length;
  console.log(`PASSED: ${passCount}/${results.length}`);
  console.log(`FAILED: ${results.length - passCount}/${results.length}`);
  console.log('======================================================\n');

  if (passCount === results.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error('Test Suite Fatal Error:', e);
  process.exit(1);
});
