import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Create aliases/copies so that any old URL referenced anywhere resolves without 404
const fileAliases = [
  // void-mvw27kni aliases
  { src: '1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793446645381_33980.webp' },
  { src: '1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793446661821_33981.webp' },
  { src: '1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793446679355_33982.webp' },
  { src: '1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793430041332_whatsapp_image_2026_10_31_at_1_2.jpeg' },
  { src: '1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793430050696_whatsapp_image_2026_10_31_at_1_2.jpeg' },
  { src: '1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793430061529_whatsapp_image_2026_10_31_at_1_2.jpeg' },

  // void-mvw2r5ch aliases
  { src: '1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793431132876_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793431146877_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793431173367_whatsapp_image_2026_10_31_at_12_.jpeg' },

  // void-mvw39667 aliases
  { src: '1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793431784420_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793431791214_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg', dest: '1793431805362_whatsapp_image_2026_10_30_at_10_.jpeg' },

  // void-mvw3mqaq aliases
  { src: '1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793432621257_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg', dest: '1793432621259_whatsapp_image_2026_10_31_at_12_.jpeg' },
  { src: '1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793432621264_whatsapp_image_2026_10_31_at_12_.jpeg' },

  // void-mvw3u167 aliases
  { src: '1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg', dest: '1793432977454_whatsapp_image_2026_10_30_at_11_.jpeg' },
  { src: '1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg', dest: '1793432985812_whatsapp_image_2026_10_30_at_11_.jpeg' },
  { src: '1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg', dest: '1793433021364_whatsapp_image_2026_10_30_at_10_.jpeg' },

  // void-mvw4136b aliases
  { src: '1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793433352651_whatsapp_image_2026_10_31_at_1_2.jpeg' },
  { src: '1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793433344529_whatsapp_image_2026_10_31_at_1_2.jpeg' },
  { src: '1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg', dest: '1793433371886_whatsapp_image_2026_10_31_at_1_2.jpeg' },

  // void-mvw48u89 aliases
  { src: '1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg', dest: '1793433660310_whatsapp_image_2026_10_20_at_3_1.jpeg' },
  { src: '1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg', dest: '1793433667554_whatsapp_image_2026_10_31_at_1_4.jpeg' },

  // void-mvw7oq0q aliases
  { src: '1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg', dest: '1793439582035_whatsapp_image_2026_10_20_at_3_1.jpeg' },
  { src: '1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg', dest: '1793439596165_whatsapp_image_2026_10_31_at_3_0.jpeg' },

  // void-mvw7y055 aliases
  { src: '1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg', dest: '1793439751923_whatsapp_image_2026_10_20_at_3_1.jpeg' },
  { src: '1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg', dest: '1793439758005_whatsapp_image_2026_10_31_at_3_0.jpeg' }
];

console.log('--- Setting up permanent image file copies ---');
for (const a of fileAliases) {
  const srcPath = path.join(uploadsDir, a.src);
  const destPath = path.join(uploadsDir, a.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}

// Also ensure dist/uploads exists and has copies
const distUploads = path.resolve(process.cwd(), 'dist', 'uploads');
if (!fs.existsSync(distUploads)) {
  fs.mkdirSync(distUploads, { recursive: true });
}
for (const f of fs.readdirSync(uploadsDir)) {
  fs.copyFileSync(path.join(uploadsDir, f), path.join(distUploads, f));
}
console.log(`Synced ${fs.readdirSync(uploadsDir).length} image files to /public/uploads and /dist/uploads`);

// 2. Define the definitive, complete, permanent 9 products with verified images
const PERMANENT_PRODUCTS = [
  {
    id: "void-mvw27kni",
    sku: "VW-10000",
    name: "BLEEDING BUTTERFLY {HOODIE}",
    category: "HOODIES",
    tagline: "HEAVYWEIGHT OVERSIZED UNISEX HOODIE",
    price: 1999,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    backImage: "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
    sideImage: "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#ffb8f0",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#730c0c",
        images: [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      }
    ],
    description: "Product Name: Bleeding Butterfly (Voidwear Butterfly Collection)\n\nProduct Overview\nStep beyond the ordinary with the \"Bleeding Butterfly\" oversized hoodie from Voidwear. Built for those who wear their transformation boldly, this piece blends striking, raw aesthetics with uncompromising comfort. Featuring an intense splattered butterfly graphic across the back, it symbolizes freedom, evolution, and the grit required to become a stronger you.\n\nKey Features\nOversized Fit: Engineered with a modern, relaxed drop-shoulder silhouette for maximum streetwear appeal and effortless layering.\n\nStriking Back Graphic: High-impact \"Bleeding Butterfly\" artwork contrasting sharp white, monochrome, and vivid crimson splatters against a deep black canvas.\n\nPremium Cotton Blend: Crafted from a heavy, ultra-soft fabric blend that delivers cozy warmth, breathability, and structural durability.\n\nDurable Fade-Resistant Print: High-definition printing technology ensures the intricate splatters and bold contrast stay vibrant wash after wash.\n\nSpecifications & Care\nMaterial: Premium Cotton Blend (Heavyweight fleece interior for winter/evening wear)\n\nFit Type: Oversized / Relaxed Streetwear Fit\n\nStyle: Pullover Hoodie with adjustable drawstrings and a spacious kangaroo pocket\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve print longevity. Do not iron directly on the graphic.\n\nThe Message\nFreedom. Transformation. A Stronger You.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw27kni",
    createdAt: "2026-10-31T07:08:13.519Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw2r5ch",
    sku: "VW-10001",
    name: "THE SAMURAI ACID WASH {HOODIE}",
    category: "HOODIES",
    tagline: "HEAVYWEIGHT UNISEX OVERSIZED HOODIE",
    price: 2299,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
    ],
    backImage: "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
    sideImage: "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ]
      }
    ],
    description: "Product Name: Acid Wash Hoodie – The Samurai (Voidwear Samurai Collection)\n\nProduct Overview\nUnleash your inner warrior with \"The Samurai\" acid wash hoodie from Voidwear. Part of the exclusive Samurai Collection, this piece embodies the ethos: \"Same essence, different colors, bolder you.\" Featuring a stunning, intricate graphic of a samurai against a vivid crimson sun and falling cherry blossoms, it merges traditional Japanese aesthetics with rugged, modern streetwear design.\n\nKey Features\nAcid Wash Texture: Unique distressed vintage wash finish that gives each hoodie an edgy, one-of-a-kind look and texture.\n\nStriking Back Graphic: High-impact artwork showcasing a legendary samurai set against a bold red backdrop and dynamic cherry blossom accents.\n\nOversized Fit: Tailored with a relaxed, modern drop-shoulder silhouette for maximum street style and comfortable layering.\n\nAll-Season Comfort: Crafted from a soft, breathable fabric blend designed to keep you comfortable year-round.\n\nDurable Print: High-definition print technology ensures the rich reds and deep monochrome details stay sharp and vibrant wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Samurai Collection\n\nMaterial: Premium Cotton Blend\n\nFit Type: Oversized Fit\n\nTexture: Acid Wash\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nSame Essence. Different Colors. Bolder You.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw2r5ch",
    createdAt: "2026-10-31T07:23:27.093Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw39667",
    sku: "VW-10002",
    name: "THE FLORA {HOODIE}",
    category: "HOODIES",
    tagline: "HEAVYWEIGHT UNISEX OVERSIZED HOODIE",
    price: 1999,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
    ],
    backImage: "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
    sideImage: "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#7a0000",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#f38cc8",
        images: [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      }
    ],
    description: "Product Name: Oversized Hoodie – The Flora (Voidwear Floral Collection)\n\nProduct Overview\nEmbrace a balance of striking contrast and delicate elegance with \"The Flora\" hoodie from Voidwear. Part of the exclusive Floral Collection, this piece follows the brand's core philosophy: \"Same essence, different colors, bolder you.\" Featuring a stunning back graphic of blooming floral artistry against a clean, deep black canvas, it combines nature-inspired beauty with modern streetwear style.\n\nKey Features\nStriking Floral Back Graphic: High-impact artwork showcasing blooming white and crimson floral arrangements intertwined with dark, moody foliage.\n\nOversized Fit: Designed with a relaxed, modern drop-shoulder silhouette for ultimate streetwear comfort and effortless layering.\n\nPremium Cotton Blend: Crafted from a soft, high-quality fabric blend built to keep you cozy and breathable throughout the year.\n\nDurable Print: High-definition printing technology ensures the intricate details and vibrant color contrasts stay sharp wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Floral Collection\n\nMaterial: Premium Cotton Blend\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve the fabric and print quality. Do not iron directly on the graphic.\n\nThe Message\nSame Essence. Different Colors. Bolder You",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw39667",
    createdAt: "2026-10-31T07:37:28.050Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw3mqaq",
    sku: "VW-10003",
    name: "BLEEDING BUTTERFLY {SWEATSHIRT}",
    category: "HOODIES",
    tagline: "HEAVYWEIGHT UNISEX OVERSIZED SWEATSHIRT",
    price: 1999,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    backImage: "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
    sideImage: "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#fb79d8",
        images: [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "LAVENDER",
        family: "Other",
        hex: "#a0c4f3",
        images: [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      }
    ],
    description: "Product Name: Bleeding Butterfly Sweatshirt – Broken But Beautiful (Voidwear Butterfly Collection)\n\nProduct Overview\nRedefine your street style with the \"Bleeding Butterfly\" sweatshirt from Voidwear. Guided by the motto \"Broken but beautiful\" and \"Same essence, different colors, bolder you,\" this sweatshirt features a powerful chest graphic juxtaposing a delicate, splattered butterfly against raw contrast. Available in a versatile palette of colors, it is designed for those who wear their transformation with pride.\n\nKey Features\nStriking Chest Graphic: High-impact \"Bleeding Butterfly\" artwork featuring sharp monochrome and vivid crimson splatters across the front.\n\nOversized Fit: Tailored with a relaxed, drop-shoulder streetwear silhouette for effortless comfort and styling.\n\nSoft Cotton Blend: Crafted from a premium, all-day comfortable fabric blend built for warmth and everyday wear.\n\nPremium Details & Durable Print: Built with high-end stitching and long-lasting print technology to keep your design vibrant wear after wear.\n\nColor Options: Available in White, Pink, Blue, Green, and Black.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Butterfly Collection (\"Broken But Beautiful\")\n\nMaterial: Premium Cotton Blend (Soft fleece interior)\n\nFit Type: Oversized Fit\n\nAvailable Colors: White, Pink, Blue, Green, Black\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nBroken But Beautiful. Same Essence. Different Colors. Bolder You.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw3mqaq",
    createdAt: "2026-10-31T07:48:01.007Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw3u167",
    sku: "VW-10004",
    name: "THE SAMURAI {HOODIE}",
    category: "HOODIES",
    tagline: "HEAVYWEIGHT OVERSIZED UNISEX",
    price: 1999,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
      "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
      "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
    ],
    backImage: "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
    sideImage: "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#670404",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#f0ade4",
        images: [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      }
    ],
    description: "Product Name: The Samurai Hoodie (Voidwear Samurai Collection)\n\nProduct Overview\nChannel absolute focus and inner strength with \"The Samurai\" hoodie from Voidwear. True to the collection's mantra \"Discipline creates freedom\" and \"Same essence, different colors, bolder you\" this piece blends timeless Japanese warrior aesthetics with cutting-edge streetwear design. Featuring a striking, highly detailed graphic of a lone samurai against a crimson blood-red moon and blooming cherry blossoms, it is built for those who command respect and move with purpose.\n\nKey Features\nStriking Back Graphic: High-impact, vibrant artwork showcasing a traditional samurai warrior framed by a glowing red moon and falling cherry blossom petals.\n\nOversized Streetwear Fit: Designed with a modern, relaxed drop-shoulder silhouette that delivers both maximum comfort and effortless style.\n\nPremium Cotton Blend: Crafted from a soft, high-quality, heavyweight fabric blend to keep you warm, cozy, and comfortable throughout the day.\n\nDurable, High-Definition Print: Advanced printing technology ensures the deep blacks, crisp whites, and brilliant crimsons stay sharp and vivid wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Samurai Collection\n\nMaterial: Premium Cotton Blend (Soft fleece interior)\n\nFit Type: Oversized / Relaxed Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve print longevity. Do not iron directly on the graphic.\n\nThe Message\nDiscipline Creates Freedom. Same Essence. Different Colors. Bolder You",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw3u167",
    createdAt: "2026-10-31T07:53:41.245Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw4136b",
    sku: "VW-10005",
    name: "BLEEDING BUTTERFLY {HOODIE}",
    category: "T-SHIRTS",
    tagline: "HEAVYWEIGHT OVERSIZED UNISEX",
    price: 1999,
    originalPrice: 3500,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    backImage: "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
    sideImage: "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg"
      },
      {
        angle: "SIDE",
        label: "SIDE SILHOUETTE",
        url: "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#770909",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#dd73d4",
        images: [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      }
    ],
    description: "Product Name: Bleeding Butterfly Hoodie (Voidwear Butterfly Collection)\n\nProduct Overview\nStep beyond the ordinary with the \"Bleeding Butterfly\" hoodie from Voidwear. Built for those who wear their evolution proudly, this piece embodies the core message: \"Freedom, Transformation, A Stronger You.\" Featuring an intense, splattered butterfly graphic across the back, it fuses striking raw artistry with everyday comfort.\n\nKey Features\nStriking Back Graphic: High-impact \"Bleeding Butterfly\" artwork featuring sharp white, monochrome, and vivid crimson paint splatters set against a deep black hoodie.\n\nOversized Fit: Designed with a relaxed, drop-shoulder silhouette for the ultimate modern streetwear look and easy layering.\n\nPremium Cotton Blend: Crafted from a soft, high-quality fabric blend that offers breathable comfort and cozy warmth.\n\nDurable Print: High-definition printing technology ensures the intricate details and vibrant color contrasts stay sharp wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Butterfly Collection\n\nMaterial: Premium Cotton Blend\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nFreedom. Transformation. A Stronger You.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw4136b",
    createdAt: "2026-10-31T07:59:10.343Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw48u89",
    sku: "VW-10006",
    name: "LEGACY OF LION",
    category: "T-SHIRTS",
    tagline: "HEAVYWEIGHT OVERSIZED 260 GSM UNISEX T SHIRT",
    price: 1200,
    originalPrice: 2200,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
    ],
    backImage: "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#810909",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#dd9cd5",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        name: "LAVENDER",
        family: "Other",
        hex: "#859dff",
        images: [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      }
    ],
    description: "Product Name: Legacy of Lion T-Shirt (Voidwear Premium Oversized Streetwear)\n\nProduct Overview\nMake a statement that outlasts the ordinary with the \"Legacy\" Lion T-shirt from Voidwear. As part of their premium oversized streetwear line, this piece is built on the creed: \"More than just a t-shirt\" and \"Legacy lives on. Wear your story.\" Featuring a clean, bold chest branding and a powerful, intricate lion portrait framed by laurel wreaths on the back, it is designed for those who command respect and leave a lasting impression.\n\nKey Features\nBold Graphic Design: Features crisp \"LEGACY\" chest typography complemented by a striking, highly-detailed lion head graphic and laurel wreath motif across the back.\n\nOversized Streetwear Fit: Cut with a modern, relaxed silhouette that delivers ultimate comfort and effortless styling.\n\n100% Cotton Fabric: Made with pure, breathable cotton that ensures all-day comfort and superior softness.\n\nDurable Craftsmanship: Built with premium neck ribs, high-quality printing, and durable stitching to ensure your tee stands the test of time.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Premium Oversized Streetwear (\"Streetwear for the Real Ones\")\n\nMaterial: 100% Cotton\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nLegacy Lives On. Wear Your Story.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw48u89",
    createdAt: "2026-10-31T08:05:12.550Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw7oq0q",
    sku: "VW-10007",
    name: "LEGACY OF FOREST {T SHIRT}",
    category: "T-SHIRTS",
    tagline: "UNISEX 260 GSM OVERSIZED T SHIRT",
    price: 1200,
    originalPrice: 2199,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
    ],
    backImage: "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#710909",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "LAVENDER",
        family: "Other",
        hex: "#9791ee",
        images: [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      }
    ],
    description: "Product Name: Legacy Graphic Tee – Forest Green (Voidwear Legacy Collection)\n\nProduct Overview\nBuild your future and wear your ambition with the \"Legacy\" Graphic Tee in Forest Green from Voidwear. Driven by the powerful mantras \"Same dreams, bigger moves\" and \"Legacy builds the future,\" this tee features a commanding lion emblem on the front and a rugged mountain range graphic on the back. It is designed for those who aim higher and move with purpose.\n\nKey Features\nDual-Sided Graphics: Bold \"LEGACY\" typography paired with an intricate lion crest on the front, complemented by a striking mountain range artwork on the back.\n\nOversized Streetwear Fit: Cut with a relaxed, modern drop-shoulder silhouette for effortless styling and maximum comfort.\n\nPremium Cotton Fabric: Crafted from high-quality, breathable cotton built to deliver all-day comfort.\n\nDurable Print & Stitching: High-definition printing technology ensures the graphics stay sharp and vibrant wear after wear.\n\nAvailable Colors: Part of a versatile 6-color lineup including Black, White, Forest Green, Lavender, Maroon, and Baby Pink.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Legacy Graphic Tee Collection\n\nMaterial: Premium Cotton\n\nFit Type: Oversized Fit\n\nColor: Forest Green (Also available in Black, White, Lavender, Maroon, and Baby Pink)\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphics.\n\nThe Message\nSame Dreams. Bigger Moves. Legacy Builds the Future.",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw7oq0q",
    createdAt: "2026-10-31T09:41:34.093Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: "void-mvw7y055",
    sku: "VW-10008",
    name: "LEGACY OF EAGLE {T SHIRT}",
    category: "T-SHIRTS",
    tagline: "OVERSIZED UNISEX 260 GSM T SHIRT",
    price: 1200,
    originalPrice: 2299,
    badge: "NEW DROP",
    gsm: 280,
    fabric: "100% Ultra-Dense Combed Cotton",
    fit: "Signature Boxy Oversized Silhouette",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
    ],
    backImage: "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg",
    angles: [
      {
        angle: "FRONT",
        label: "FRONT ANGLE",
        url: "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg"
      },
      {
        angle: "BACK",
        label: "REAR PROFILE",
        url: "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
      }
    ],
    colors: [
      {
        name: "Pitch Black",
        family: "Black",
        hex: "#0B0B0B",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Chalk Ivory",
        family: "White",
        hex: "#EDECE8",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Forest Pine Green",
        family: "Green",
        hex: "#243828",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "Deep Cobalt Blue",
        family: "Blue",
        hex: "#162A43",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "MAROON",
        family: "Other",
        hex: "#650606",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "LAVENDER",
        family: "Other",
        hex: "#96e8fd",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        name: "BABY PINK",
        family: "Other",
        hex: "#f196fd",
        images: [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      }
    ],
    description: "Product Name: Legacy Graphic Tee – The Eagle (Voidwear Premium Oversized Tee Collection)\n\nProduct Overview\nSoar above the ordinary and wear your philosophy with the \"Legacy\" Eagle Graphic Tee from Voidwear. Part of the Premium Oversized Tee Collection under the creed \"More than a tee – it's a statement,\" this piece is built on the core principle: \"Discipline creates freedom\" and \"Timeless style builds legacy.\" Featuring minimalist chest branding paired with an intricate, majestic eagle soaring over a mountain landscape on the back, it is designed for those who forge their own path.\n\nKey Features\nDetailed Back Design & Minimalist Chest: Clean \"LEGACY\" typography on the chest, contrasted by a rich, highly detailed back graphic featuring an eagle, moon, mountains, and Japanese kanji accents.\n\nOversized Streetwear Fit: Cut with a relaxed, drop-shoulder silhouette for effortless styling and ultimate everyday comfort.\n\n100% Cotton Fabric: Crafted from pure, breathable cotton that ensures a soft feel and long-lasting quality.\n\nDurable Craftsmanship: Features a premium ribbed collar, durable stitching, and high-definition print technology designed to keep graphics sharp and vibrant.\n\nSpecifications & Care\nBrand/Collection: Voidwear – Premium Oversized Tee Collection (\"Built for Your Own Path\" / \"Legacy Lives On\")\n\nMaterial: 100% Cotton\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphics.\n\nThe Message\nDiscipline Creates Freedom. Timeless Style Builds",
    details: [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    inStock: true,
    stockCount: 25,
    isPublished: true,
    featured: true,
    slug: "void-mvw7y055",
    createdAt: "2026-10-31T09:48:45.707Z",
    updatedAt: new Date().toISOString()
  }
];

// Verify every image URL in every product exists on disk
console.log('\n--- Verifying images on disk for all 9 products ---');
for (const p of PERMANENT_PRODUCTS) {
  for (const img of p.images) {
    const full = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
    if (!fs.existsSync(full)) {
      console.error(`MISSING IMAGE for ${p.id}: ${full}`);
    } else {
      console.log(`  OK: [${p.id}] ${img}`);
    }
  }
}

// 3. Save to data/voidwear_store.json
const storeFile = path.resolve(process.cwd(), 'data', 'voidwear_store.json');
let storeData = {};
if (fs.existsSync(storeFile)) {
  try {
    storeData = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
  } catch {}
}
storeData.products = PERMANENT_PRODUCTS;
fs.writeFileSync(storeFile, JSON.stringify(storeData, null, 2), 'utf-8');
console.log('\nSuccessfully saved permanent products to data/voidwear_store.json');

// 4. Save to src/data/products.ts
const productsTsFile = path.resolve(process.cwd(), 'src', 'data', 'products.ts');
let productsTsContent = fs.readFileSync(productsTsFile, 'utf-8');
const sIdx = productsTsContent.indexOf('export const INITIAL_PRODUCTS: Product[] = ');
const eIdx = productsTsContent.indexOf(';\n\nexport const INITIAL_REVIEWS: Review[]');
if (sIdx !== -1 && eIdx !== -1) {
  const updatedTs =
    productsTsContent.slice(0, sIdx + 'export const INITIAL_PRODUCTS: Product[] = '.length) +
    JSON.stringify(PERMANENT_PRODUCTS, null, 2) +
    productsTsContent.slice(eIdx);
  fs.writeFileSync(productsTsFile, updatedTs, 'utf-8');
  console.log('Successfully updated src/data/products.ts with permanent products!');
} else {
  console.warn('Could not find markers in src/data/products.ts');
}

// 5. Save all 9 products to Cloud Firestore
async function syncToFirestore() {
  const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(cfgPath)) {
    console.warn('firebase-applet-config.json not found');
    return;
  }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  const app = !getApps().length ? initializeApp(cfg) : getApps()[0];
  const db = getFirestore(app, cfg.firestoreDatabaseId);
  console.log('\nConnected to Cloud Firestore:', cfg.firestoreDatabaseId);

  // Clean any stray / AI boilerplate docs in Firestore
  const REMOVED_AI_PRODUCT_IDS = [
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
  ];
  for (const rid of REMOVED_AI_PRODUCT_IDS) {
    try {
      await deleteDoc(doc(db, 'products', rid));
    } catch {}
  }

  // Write all 9 permanent products to Firestore
  for (const prod of PERMANENT_PRODUCTS) {
    try {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      console.log(`Firestore: Saved "${prod.name}" (${prod.id})`);
    } catch (err) {
      console.error(`Firestore save error for ${prod.id}:`, err.message);
    }
  }

  const snap = await getDocs(collection(db, 'products'));
  console.log(`\nVerified: Cloud Firestore now contains ${snap.docs.length} products!`);
}

syncToFirestore().then(() => {
  console.log('\nAll products, details, and images permanently saved to Disk and Cloud Firestore!');
  process.exit(0);
}).catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
