import fs from 'fs';
import path from 'path';

const storeFile = path.resolve(process.cwd(), 'data', 'voidwear_store.json');
const productsTsFile = path.resolve(process.cwd(), 'src', 'data', 'products.ts');

const storeData = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
const products = storeData.products || [];

console.log(`Found ${products.length} products to permanently bake into products.ts:`);
products.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] ${p.name} (${p.category}) - ₹${p.price} (SKU: ${p.sku})`);
});

const fileHeader = `import { Product, Review } from '../types';

export const OFFICIAL_LOGO_URL = '/void-logo.jpg';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aarav Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '3 days ago',
    productName: 'bleeding butterfly {hoodie}',
    comment: 'The weight of this hoodie is unreal. Better drape and thickness than international labels charging ₹15,000+. The zero-drawstring collar stays up perfectly. Delivered to Bandra in 3 days.',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Kabir Singhania',
    location: 'New Delhi',
    rating: 5,
    date: '1 week ago',
    productName: 'THE SAMURAI ACID WASH {HOODIE}',
    comment: 'Oversized silhouette is genuinely designed by someone who understands modern streetwear proportions. The samurai back print and acid wash texture are incredible. Proud to see this quality coming out of Varanasi.',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Rohan Sharma',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '2 weeks ago',
    productName: 'THE FLORA {HOODIE}',
    comment: 'The botanical typography and graphic quality feels 100% custom. The packaging alone felt like opening a luxury fashion house unboxing. Ordered on WhatsApp directly with Akash and got instant tracking.',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Devansh Verma',
    location: 'Varanasi, UP',
    rating: 5,
    date: '3 weeks ago',
    productName: 'BLEEDING BUTTERFLY {SWEATSHIRT}',
    comment: 'Picked these up in Pandeypur. The tailoring is flawless, stacks over Jordans effortlessly. True luxury streetwear.',
    verified: true
  }
];

export const BRAND_INFO = {
  name: 'VOID WEAR',
  tagline: 'BEYOND ORDINARY',
  motto: 'ENTER THE VOID.',
  statement: 'NOT MADE FOR EVERYONE.',
  description: 'VOID WEAR is a premium streetwear label built around individuality, confidence and self-expression. Designed for those who refuse to blend in.',
  founder: 'Akash Goshwami',
  founderTitle: 'Founder & Creative Director',
  coFounder: 'Shivam Giri',
  coFounderTitle: 'Co-Founder & Managing Director',
  shivamPhone: '+917985986280',
  shivamPhoneDisplay: '+91 7985986280',
  location: 'Pandeypur, Varanasi, Uttar Pradesh, India',
  whatsappNumber: '+918114150537',
  whatsappDisplay: '+91 8114150537',
  phone: '+91 8114150537',
  email: 'voidwear1010@gmail.com',
  instagram: '@void__wear__',
  instagramUrl: 'https://instagram.com/void__wear__',
  businessHours: 'Open 7 days a week',
  currency: '₹',
  freeShippingThreshold: 1999
};
`;

fs.writeFileSync(productsTsFile, fileHeader, 'utf-8');
console.log('Successfully updated src/data/products.ts with all 7 published products!');
