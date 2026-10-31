import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

async function main() {
  console.log('=== Checking Current Published Products ===');

  // 1. Cloud Firestore
  const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(cfgPath)) {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
    const app = !getApps().length ? initializeApp(cfg) : getApps()[0];
    const db = getFirestore(app, cfg.firestoreDatabaseId);
    const snap = await getDocs(collection(db, 'products'));
    console.log(`Firestore has ${snap.docs.length} products:`);
    snap.docs.forEach((d) => {
      const data = d.data();
      console.log(` - ID: "${d.id}", Name: "${data.name}", SKU: "${data.sku}", isPublished: ${data.isPublished}, Images: ${data.images?.length || 0}`);
    });
  }

  // 2. data/voidwear_store.json
  const dbFile = path.resolve(process.cwd(), 'data', 'voidwear_store.json');
  if (fs.existsSync(dbFile)) {
    const store = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    console.log(`voidwear_store.json has ${store.products?.length || 0} products:`);
    (store.products || []).forEach((p) => {
      console.log(` - ID: "${p.id}", Name: "${p.name}", SKU: "${p.sku}", isPublished: ${p.isPublished}`);
    });
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
