import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const REMOVED_AI_PRODUCT_IDS = new Set([
  'void-sig-tee',
  'distortion-graphic-tee',
  'void-monolith-box-tee',
  'void-core-hoodie',
  'void-essentials-pants',
  'void-eclipse-bomber',
  'void-acid-wash-hoodie',
  'void-metal-buckle-cap',
  'void-tactical-cargo',
  'vw-prod-1792747689787',
  'acidela'
]);

async function main() {
  console.log('--- Cleaning up acidela from Store and Firestore ---');

  // 1. Clean data/voidwear_store.json
  const dbFile = path.resolve(process.cwd(), 'data', 'voidwear_store.json');
  if (fs.existsSync(dbFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      const beforeCount = Array.isArray(data.products) ? data.products.length : 0;
      data.products = (data.products || []).filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id) && !REMOVED_AI_PRODUCT_IDS.has(p.slug));
      console.log(`Local store: Reduced products from ${beforeCount} to ${data.products.length}`);
      console.log('Remaining products in store:', data.products.map(p => `${p.id} (${p.name})`));
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to update local dbFile:', e);
    }
  }

  // 2. Clean Cloud Firestore
  const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(cfgPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
      const app = initializeApp(cfg);
      const db = getFirestore(app, cfg.firestoreDatabaseId);

      console.log('Connected to Cloud Firestore:', cfg.firestoreDatabaseId);
      for (const id of REMOVED_AI_PRODUCT_IDS) {
        try {
          await deleteDoc(doc(db, 'products', id));
          console.log(`Firestore: Deleted product ${id}`);
        } catch (e) {
          console.warn(`Firestore: Could not delete ${id}:`, e.message);
        }
      }

      // Verify Firestore remaining products
      const snap = await getDocs(collection(db, 'products'));
      console.log(`Firestore remaining product documents count: ${snap.docs.length}`);
      snap.docs.forEach(d => console.log(` - ${d.id}:`, d.data().name));
    } catch (e) {
      console.error('Failed to clean Firestore:', e);
    }
  }
}

main().then(() => {
  console.log('Acidela removal cleanup finished.');
  process.exit(0);
}).catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
