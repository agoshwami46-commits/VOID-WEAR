import { Product, ProductVariant, Size, ProductColor } from '../types';

/**
 * Creates a clean URL-friendly slug from a product name or id
 */
export function getProductSlug(product: Partial<Product>): string {
  if (product.slug && product.slug.trim()) {
    return product.slug.trim().toLowerCase();
  }
  if (product.id && product.id.trim()) {
    return product.id.trim().toLowerCase();
  }
  return (product.name || 'piece')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates canonical variant matrix for a product based on its colors and sizes.
 * Format: [Base SKU]-[COLOR_CODE]-[SIZE]
 * Also provides mapped Qikink SKU for on-demand print/fulfillment.
 */
export function generateProductVariants(product: Product): ProductVariant[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants;
  }

  const variants: ProductVariant[] = [];
  const baseSku = product.sku || `VW-${product.id.slice(0, 6).toUpperCase()}`;

  (product.colors || []).forEach((c) => {
    const colorCode = c.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 3) || 'BLK';

    (product.sizes || []).forEach((s) => {
      const variantSku = `${baseSku}-${colorCode}-${s}`;
      const qikinkSku = `QK-${baseSku.replace('VW-', '')}-${colorCode}-${s}`;

      variants.push({
        id: `${product.id}-${colorCode}-${s}`.toLowerCase(),
        colorName: c.name,
        size: s,
        sku: variantSku,
        qikinkSku,
        stock: Math.max(5, Math.floor(product.stockCount / Math.max(1, (product.colors.length * product.sizes.length)))),
        price: product.price,
        compareAtPrice: product.originalPrice
      });
    });
  });

  return variants;
}

/**
 * Resolves stock status label and styling
 */
export function getStockStatus(product: Product, selectedVariant?: ProductVariant | null): {
  status: 'IN STOCK' | 'LOW STOCK' | 'SOLD OUT';
  colorClass: string;
  isPurchasable: boolean;
  count: number;
} {
  const stock = selectedVariant ? selectedVariant.stock : product.stockCount;
  const inStock = product.inStock && stock > 0;

  if (!inStock || stock <= 0) {
    return {
      status: 'SOLD OUT',
      colorClass: 'text-red-400 bg-red-950/60 border-red-800',
      isPurchasable: false,
      count: 0
    };
  }

  if (stock <= 5) {
    return {
      status: 'LOW STOCK',
      colorClass: 'text-amber-400 bg-amber-950/60 border-amber-800',
      isPurchasable: true,
      count: stock
    };
  }

  return {
    status: 'IN STOCK',
    colorClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
    isPurchasable: true,
    count: stock
  };
}

/**
 * Format currency in Indian Rupees
 */
export function formatPriceINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
