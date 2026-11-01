import { Product, ProductColor } from '../types';

export interface ColorFilterOption {
  family: string;       // e.g. 'All' | 'Black' | 'White' | 'Green' | 'Beige' | 'Grey' | 'Blue'
  label: string;        // Display label, e.g. 'ALL COLOURS', 'BLACK', 'WHITE', etc.
  hex: string;          // Representative color code for swatch dot
  count: number;        // Number of matching products
  shades: string[];     // All matching exact shade names in catalog
}

// Canonical color family mappings
export const CANONICAL_COLOR_FAMILIES = [
  { family: 'Black', hex: '#0B0B0B', border: '#333333' },
  { family: 'White', hex: '#EDECE8', border: '#D4AF37' },
  { family: 'Green', hex: '#26382B', border: '#3E5544' },
  { family: 'Beige', hex: '#D2C4B2', border: '#B8A892' },
  { family: 'Grey', hex: '#373A3E', border: '#696E78' },
  { family: 'Blue', hex: '#162C45', border: '#2B4666' }
];

/**
 * Normalizes any streetwear shade name or hex to its canonical color family.
 * e.g., 'Pitch Black' -> 'Black', 'Chalk Ivory' -> 'White', 'Military Olive' -> 'Green'
 */
export function normalizeColorFamily(
  colorName?: string,
  hex?: string,
  explicitFamily?: string
): string {
  if (explicitFamily && explicitFamily.trim()) {
    return capitalize(explicitFamily.trim());
  }
  if (!colorName) return 'Other';

  const n = colorName.toLowerCase().trim();

  if (
    n.includes('black') ||
    n.includes('onyx') ||
    n.includes('jet') ||
    n.includes('obsidian') ||
    n.includes('stealth') ||
    n.includes('monolith')
  ) {
    return 'Black';
  }
  if (
    n.includes('white') ||
    n.includes('ivory') ||
    n.includes('chalk') ||
    n.includes('bone') ||
    n.includes('snow') ||
    n.includes('cream') ||
    n.includes('bleached') ||
    n.includes('alpine')
  ) {
    return 'White';
  }
  if (
    n.includes('green') ||
    n.includes('olive') ||
    n.includes('sage') ||
    n.includes('forest') ||
    n.includes('pine') ||
    n.includes('moss') ||
    n.includes('military') ||
    n.includes('ranger') ||
    n.includes('drab') ||
    n.includes('khaki green')
  ) {
    return 'Green';
  }
  if (
    n.includes('beige') ||
    n.includes('sand') ||
    n.includes('dune') ||
    n.includes('khaki') ||
    n.includes('tan') ||
    n.includes('camel') ||
    n.includes('oat') ||
    n.includes('desert')
  ) {
    return 'Beige';
  }
  if (
    n.includes('grey') ||
    n.includes('gray') ||
    n.includes('slate') ||
    n.includes('charcoal') ||
    n.includes('smoke') ||
    n.includes('mineral') ||
    n.includes('ashen') ||
    n.includes('stone') ||
    n.includes('titanium') ||
    n.includes('cement') ||
    n.includes('acid')
  ) {
    return 'Grey';
  }
  if (
    n.includes('blue') ||
    n.includes('navy') ||
    n.includes('cobalt') ||
    n.includes('indigo') ||
    n.includes('ocean') ||
    n.includes('azure') ||
    n.includes('cyber') ||
    n.includes('electric')
  ) {
    return 'Blue';
  }

  // Hex fallback
  if (hex) {
    const h = hex.toLowerCase().replace('#', '');
    if (['000000', '050505', '080808', '0a0a0a', '0b0b0b', '0c0c0c', '111111'].includes(h)) return 'Black';
    if (['ffffff', 'edece8', 'f4f3ef', 'f5f5f5', 'ece9e2'].includes(h)) return 'White';
  }

  return capitalize(colorName.split(' ')[0]);
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Extracts all available color options dynamically from a list of products.
 * Includes accurate counts of matching published products.
 */
export function extractAvailableColors(
  products: Product[],
  currentCategory: string = 'ALL'
): ColorFilterOption[] {
  // Only evaluate published products in the active category
  const pool = products.filter(
    (p) => p.isPublished !== false && (currentCategory === 'ALL' || p.category === currentCategory)
  );

  const familyMap = new Map<string, { count: number; shades: Set<string>; hex: string }>();

  // Initialize primary canonical color families
  CANONICAL_COLOR_FAMILIES.forEach(({ family, hex }) => {
    familyMap.set(family, { count: 0, shades: new Set<string>(), hex });
  });

  pool.forEach((prod) => {
    const productFamilies = new Set<string>();
    prod.colors?.forEach((c) => {
      const fam = normalizeColorFamily(c.name, c.hex, c.family);
      productFamilies.add(fam);
      if (!familyMap.has(fam)) {
        familyMap.set(fam, { count: 0, shades: new Set<string>(), hex: c.hex });
      }
      familyMap.get(fam)?.shades.add(c.name);
    });

    productFamilies.forEach((fam) => {
      const entry = familyMap.get(fam);
      if (entry) entry.count += 1;
    });
  });

  const options: ColorFilterOption[] = [
    {
      family: 'All',
      label: 'ALL COLOURS',
      hex: '#D4AF37',
      count: pool.length,
      shades: []
    }
  ];

  // Primary ordered families first (Black, White, Green, Beige, Grey, Blue)
  ['Black', 'White', 'Green', 'Beige', 'Grey', 'Blue'].forEach((fam) => {
    const data = familyMap.get(fam);
    if (data) {
      options.push({
        family: fam,
        label: fam.toUpperCase(),
        hex: data.hex,
        count: data.count,
        shades: Array.from(data.shades)
      });
      familyMap.delete(fam);
    }
  });

  // Any remaining custom color families that exist in catalog
  familyMap.forEach((data, fam) => {
    if (data.count > 0) {
      options.push({
        family: fam,
        label: fam.toUpperCase(),
        hex: data.hex,
        count: data.count,
        shades: Array.from(data.shades)
      });
    }
  });

  return options;
}

/**
 * Checks whether a product matches a selected color filter.
 */
export function productMatchesColor(product: Product, selectedColor: string | null): boolean {
  if (!selectedColor || selectedColor === 'All') return true;
  const target = selectedColor.toLowerCase().trim();

  return (product.colors || []).some((c) => {
    const fam = normalizeColorFamily(c.name, c.hex, c.family).toLowerCase();
    const name = c.name.toLowerCase();
    return fam === target || name.includes(target) || (c.family && c.family.toLowerCase() === target);
  });
}

/**
 * Returns the exact color variant matching the selected filter,
 * ensuring the card displays the chosen color variant photography.
 */
export function getMatchingColorVariant(product: Product, selectedColor: string | null): ProductColor {
  if (!product.colors || product.colors.length === 0) {
    return { name: 'Pitch Black', hex: '#0B0B0B' };
  }
  if (!selectedColor || selectedColor === 'All') {
    return product.colors[0];
  }
  const target = selectedColor.toLowerCase().trim();
  const match = product.colors.find((c) => {
    const fam = normalizeColorFamily(c.name, c.hex, c.family).toLowerCase();
    const name = c.name.toLowerCase();
    return fam === target || name.includes(target) || (c.family && c.family.toLowerCase() === target);
  });
  return match || product.colors[0];
}
