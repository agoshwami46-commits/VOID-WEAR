import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';

const API_BASE = '/api/products';
const PRODUCTS_COLLECTION = 'products';

/**
 * Subscribes to live products directly from Cloud Firestore with real-time updates.
 * Falls back seamlessly to the Express local store API if offline.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: any) => void
): () => void {
  let isMounted = true;
  let hasReceivedFirestoreData = false;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let unsubscribeFirestore = () => {};

  const fetchLocalFallback = async () => {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        const items = await res.json();
        if (isMounted && Array.isArray(items) && items.length > 0) {
          onData(items);
        }
      }
    } catch {
      // Ignore network noise during fallback
    }
  };

  // 1. Initial immediate hydration from verified local API
  fetchLocalFallback();

  // 2. Setup real-time listener from Cloud Firestore with auto-reconnect on stream drop
  const attachListener = () => {
    if (!isMounted) return () => {};
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      return onSnapshot(
        productsRef,
        (snapshot) => {
          if (!isMounted) return;
          if (!snapshot.empty) {
            hasReceivedFirestoreData = true;
            const items: Product[] = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                ...data,
                isPublished: data.isPublished !== false
              } as Product;
            });
            onData(items);
          } else if (!hasReceivedFirestoreData) {
            seedProductsIfEmpty();
          }
        },
        (err: any) => {
          // Gracefully absorb WebChannelConnection stream transport drops & offline blips
          console.warn('Firestore real-time transport notice (reconnecting with local store fallback):', err?.message || err);
          fetchLocalFallback();
          if (onError) onError(err);

          // If listener stream is terminated by proxy or network blip, auto-reconnect after 4s
          if (isMounted) {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
              if (isMounted) {
                try {
                  unsubscribeFirestore();
                } catch {}
                unsubscribeFirestore = attachListener();
              }
            }, 4000);
          }
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore onSnapshot, fallback active:', err);
      return () => {};
    }
  };

  unsubscribeFirestore = attachListener();

  return () => {
    isMounted = false;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    try {
      unsubscribeFirestore();
    } catch {}
  };
}

/**
 * Recursively strips undefined fields from an object or array to ensure strict compatibility with Firestore.
 * Prevents Firestore "Function setDoc() called with invalid data. Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Ensures all catalog products exist in Cloud Firestore.
 */
export async function seedProductsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const existingIds = new Set(snap.docs.map((d) => d.id));
    for (const p of INITIAL_PRODUCTS) {
      if (!existingIds.has(p.id)) {
        const cleanSeedPayload = sanitizeForFirestore({
          ...p,
          isPublished: p.isPublished !== false,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, PRODUCTS_COLLECTION, p.id), cleanSeedPayload, { merge: true });
        console.log(`Auto-seeded missing piece ${p.name} (${p.id}) to Cloud Firestore`);
      }
    }
  } catch (err: any) {
    console.warn('Firestore seeding check notice:', err.message);
  }
}

/**
 * Create a new product.
 * Saves simultaneously to Cloud Firestore and the server's persistent disk storage.
 */
export async function createProduct(productData: Omit<Product, 'id'>, customId?: string): Promise<string> {
  const cleanId = (
    customId ||
    productData.sku?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
    `void-${Date.now().toString(36)}`
  ).trim();

  const payload: Product = {
    ...productData,
    id: cleanId,
    slug: productData.slug || cleanId,
    isPublished: productData.isPublished !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Strip any undefined keys (e.g. undefined originalPrice or optional images) before Firestore write
  const firestoreSafePayload = sanitizeForFirestore(payload);

  // 1. Save directly to Cloud Firestore
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, cleanId), firestoreSafePayload, { merge: true });
    console.log(`Product "${payload.name}" (${cleanId}) saved to Cloud Firestore`);
  } catch (err: any) {
    console.error('Firestore save product notice:', err.message);
  }

  // 2. Save to local server persistent disk storage
  try {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err: any) {
    console.warn('Local API save notice:', err.message);
  }

  return cleanId;
}

/**
 * Update an existing product.
 * Updates simultaneously in Cloud Firestore and local server storage.
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const cleanId = id.trim();
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // Strip any undefined keys before Firestore write
  const firestoreSafePayload = sanitizeForFirestore(payload);

  // 1. Update in Cloud Firestore
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, cleanId), firestoreSafePayload, { merge: true });
    console.log(`Product "${cleanId}" updated in Cloud Firestore`);
  } catch (err: any) {
    console.error('Firestore update notice:', err.message);
  }

  // 2. Update in local server storage
  try {
    await fetch(`${API_BASE}/${cleanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err: any) {
    console.warn('Local API update notice:', err.message);
  }
}

/**
 * Delete a product from the catalog.
 * Removes from Cloud Firestore and local server storage.
 */
export async function deleteProduct(id: string): Promise<void> {
  const cleanId = id.trim();

  // 1. Delete from Cloud Firestore
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, cleanId));
    console.log(`Product "${cleanId}" deleted from Cloud Firestore`);
  } catch (err: any) {
    console.error('Firestore delete notice:', err.message);
  }

  // 2. Delete from local server storage
  try {
    await fetch(`${API_BASE}/${cleanId}`, {
      method: 'DELETE'
    });
  } catch (err: any) {
    console.warn('Local API delete notice:', err.message);
  }
}
