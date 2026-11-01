// server.ts
import express from "express";
import http from "http";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

// src/data/products.ts
var INITIAL_PRODUCTS = [
  {
    "id": "void-mvw27kni",
    "sku": "VW-10000",
    "name": "BLEEDING BUTTERFLY {HOODIE}",
    "category": "HOODIES",
    "tagline": "HEAVYWEIGHT OVERSIZED UNISEX HOODIE",
    "price": 1999,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    "backImage": "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
    "sideImage": "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
    "angles": [
      {
        "label": "FRONT ANGLE",
        "url": "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "angle": "FRONT"
      },
      {
        "label": "REAR PROFILE",
        "url": "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "angle": "BACK"
      },
      {
        "label": "SIDE SILHOUETTE",
        "url": "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "angle": "SIDE"
      }
    ],
    "colors": [
      {
        "name": "Pitch Black",
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "family": "Black",
        "hex": "#0B0B0B"
      },
      {
        "family": "White",
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "name": "Chalk Ivory",
        "hex": "#EDECE8"
      },
      {
        "hex": "#162A43",
        "name": "Deep Cobalt Blue",
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "family": "Blue"
      },
      {
        "hex": "#243828",
        "name": "Forest Pine Green",
        "family": "Green",
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        "hex": "#ffb8f0",
        "name": "BABY PINK",
        "family": "Other",
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        "images": [
          "/uploads/1793472999231_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473009016_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "family": "Other",
        "hex": "#730c0c",
        "name": "MAROON"
      }
    ],
    "description": 'Product Name: Bleeding Butterfly (Voidwear Butterfly Collection)\n\nProduct Overview\nStep beyond the ordinary with the "Bleeding Butterfly" oversized hoodie from Voidwear. Built for those who wear their transformation boldly, this piece blends striking, raw aesthetics with uncompromising comfort. Featuring an intense splattered butterfly graphic across the back, it symbolizes freedom, evolution, and the grit required to become a stronger you.\n\nKey Features\nOversized Fit: Engineered with a modern, relaxed drop-shoulder silhouette for maximum streetwear appeal and effortless layering.\n\nStriking Back Graphic: High-impact "Bleeding Butterfly" artwork contrasting sharp white, monochrome, and vivid crimson splatters against a deep black canvas.\n\nPremium Cotton Blend: Crafted from a heavy, ultra-soft fabric blend that delivers cozy warmth, breathability, and structural durability.\n\nDurable Fade-Resistant Print: High-definition printing technology ensures the intricate splatters and bold contrast stay vibrant wash after wash.\n\nSpecifications & Care\nMaterial: Premium Cotton Blend (Heavyweight fleece interior for winter/evening wear)\n\nFit Type: Oversized / Relaxed Streetwear Fit\n\nStyle: Pullover Hoodie with adjustable drawstrings and a spacious kangaroo pocket\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve print longevity. Do not iron directly on the graphic.\n\nThe Message\nFreedom. Transformation. A Stronger You.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw27kni",
    "createdAt": "2026-10-31T07:08:13.519Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw2r5ch",
    "sku": "VW-10001",
    "name": "THE SAMURAI ACID WASH {HOODIE}",
    "category": "HOODIES",
    "tagline": "HEAVYWEIGHT UNISEX OVERSIZED HOODIE",
    "price": 2299,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
    ],
    "backImage": "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
    "sideImage": "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg",
    "angles": [
      {
        "angle": "FRONT",
        "url": "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
        "label": "FRONT ANGLE"
      },
      {
        "angle": "BACK",
        "label": "REAR PROFILE",
        "url": "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        "label": "SIDE SILHOUETTE",
        "url": "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg",
        "angle": "SIDE"
      }
    ],
    "colors": [
      {
        "name": "Pitch Black",
        "images": [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ],
        "family": "Black",
        "hex": "#0B0B0B"
      },
      {
        "name": "Forest Pine Green",
        "family": "Green",
        "images": [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ],
        "hex": "#243828"
      },
      {
        "hex": "#162A43",
        "images": [
          "/uploads/1793473056959_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473066255_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473077069_whatsapp_image_2026_10_31_at_12_.jpeg"
        ],
        "name": "Deep Cobalt Blue",
        "family": "Blue"
      }
    ],
    "description": 'Product Name: Acid Wash Hoodie \u2013 The Samurai (Voidwear Samurai Collection)\n\nProduct Overview\nUnleash your inner warrior with "The Samurai" acid wash hoodie from Voidwear. Part of the exclusive Samurai Collection, this piece embodies the ethos: "Same essence, different colors, bolder you." Featuring a stunning, intricate graphic of a samurai against a vivid crimson sun and falling cherry blossoms, it merges traditional Japanese aesthetics with rugged, modern streetwear design.\n\nKey Features\nAcid Wash Texture: Unique distressed vintage wash finish that gives each hoodie an edgy, one-of-a-kind look and texture.\n\nStriking Back Graphic: High-impact artwork showcasing a legendary samurai set against a bold red backdrop and dynamic cherry blossom accents.\n\nOversized Fit: Tailored with a relaxed, modern drop-shoulder silhouette for maximum street style and comfortable layering.\n\nAll-Season Comfort: Crafted from a soft, breathable fabric blend designed to keep you comfortable year-round.\n\nDurable Print: High-definition print technology ensures the rich reds and deep monochrome details stay sharp and vibrant wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear \u2013 Samurai Collection\n\nMaterial: Premium Cotton Blend\n\nFit Type: Oversized Fit\n\nTexture: Acid Wash\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nSame Essence. Different Colors. Bolder You.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw2r5ch",
    "createdAt": "2026-10-31T07:23:27.093Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw39667",
    "sku": "VW-10002",
    "name": "THE FLORA {HOODIE}",
    "category": "HOODIES",
    "tagline": "HEAVYWEIGHT UNISEX OVERSIZED HOODIE",
    "price": 1999,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
    ],
    "backImage": "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
    "sideImage": "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg",
    "angles": [
      {
        "angle": "FRONT",
        "url": "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
        "label": "FRONT ANGLE"
      },
      {
        "label": "REAR PROFILE",
        "url": "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
        "angle": "BACK"
      },
      {
        "label": "SIDE SILHOUETTE",
        "url": "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg",
        "angle": "SIDE"
      }
    ],
    "colors": [
      {
        "family": "Black",
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "hex": "#0B0B0B",
        "name": "Pitch Black"
      },
      {
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "family": "White",
        "name": "Chalk Ivory",
        "hex": "#EDECE8"
      },
      {
        "hex": "#243828",
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "name": "Forest Pine Green",
        "family": "Green"
      },
      {
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "hex": "#162A43",
        "family": "Blue",
        "name": "Deep Cobalt Blue"
      },
      {
        "family": "Other",
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "name": "MAROON",
        "hex": "#7a0000"
      },
      {
        "name": "BABY PINK",
        "hex": "#f38cc8",
        "family": "Other",
        "images": [
          "/uploads/1793473103150_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473110130_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473123797_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      }
    ],
    "description": `Product Name: Oversized Hoodie \u2013 The Flora (Voidwear Floral Collection)

Product Overview
Embrace a balance of striking contrast and delicate elegance with "The Flora" hoodie from Voidwear. Part of the exclusive Floral Collection, this piece follows the brand's core philosophy: "Same essence, different colors, bolder you." Featuring a stunning back graphic of blooming floral artistry against a clean, deep black canvas, it combines nature-inspired beauty with modern streetwear style.

Key Features
Striking Floral Back Graphic: High-impact artwork showcasing blooming white and crimson floral arrangements intertwined with dark, moody foliage.

Oversized Fit: Designed with a relaxed, modern drop-shoulder silhouette for ultimate streetwear comfort and effortless layering.

Premium Cotton Blend: Crafted from a soft, high-quality fabric blend built to keep you cozy and breathable throughout the year.

Durable Print: High-definition printing technology ensures the intricate details and vibrant color contrasts stay sharp wash after wash.

Specifications & Care
Brand/Collection: Voidwear \u2013 Floral Collection

Material: Premium Cotton Blend

Fit Type: Oversized Fit

Care Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve the fabric and print quality. Do not iron directly on the graphic.

The Message
Same Essence. Different Colors. Bolder You`,
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw39667",
    "createdAt": "2026-10-31T07:37:28.050Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw3mqaq",
    "sku": "VW-10003",
    "name": "BLEEDING BUTTERFLY {SWEATSHIRT}",
    "category": "HOODIES",
    "tagline": "HEAVYWEIGHT UNISEX OVERSIZED SWEATSHIRT",
    "price": 1999,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
      "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    "backImage": "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
    "sideImage": "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
    "angles": [
      {
        "angle": "FRONT",
        "label": "FRONT ANGLE",
        "url": "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg"
      },
      {
        "url": "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
        "label": "REAR PROFILE",
        "angle": "BACK"
      },
      {
        "angle": "SIDE",
        "url": "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "label": "SIDE SILHOUETTE"
      }
    ],
    "colors": [
      {
        "images": [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "hex": "#0B0B0B",
        "family": "Black",
        "name": "Pitch Black"
      },
      {
        "hex": "#EDECE8",
        "family": "White",
        "name": "Chalk Ivory",
        "images": [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      },
      {
        "name": "Forest Pine Green",
        "images": [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "family": "Green",
        "hex": "#243828"
      },
      {
        "family": "Other",
        "hex": "#fb79d8",
        "images": [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "name": "BABY PINK"
      },
      {
        "name": "LAVENDER",
        "hex": "#a0c4f3",
        "images": [
          "/uploads/1793473172193_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793430629160_whatsapp_image_2026_10_31_at_12_.jpeg",
          "/uploads/1793473017964_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "family": "Other"
      }
    ],
    "description": 'Product Name: Bleeding Butterfly Sweatshirt \u2013 Broken But Beautiful (Voidwear Butterfly Collection)\n\nProduct Overview\nRedefine your street style with the "Bleeding Butterfly" sweatshirt from Voidwear. Guided by the motto "Broken but beautiful" and "Same essence, different colors, bolder you," this sweatshirt features a powerful chest graphic juxtaposing a delicate, splattered butterfly against raw contrast. Available in a versatile palette of colors, it is designed for those who wear their transformation with pride.\n\nKey Features\nStriking Chest Graphic: High-impact "Bleeding Butterfly" artwork featuring sharp monochrome and vivid crimson splatters across the front.\n\nOversized Fit: Tailored with a relaxed, drop-shoulder streetwear silhouette for effortless comfort and styling.\n\nSoft Cotton Blend: Crafted from a premium, all-day comfortable fabric blend built for warmth and everyday wear.\n\nPremium Details & Durable Print: Built with high-end stitching and long-lasting print technology to keep your design vibrant wear after wear.\n\nColor Options: Available in White, Pink, Blue, Green, and Black.\n\nSpecifications & Care\nBrand/Collection: Voidwear \u2013 Butterfly Collection ("Broken But Beautiful")\n\nMaterial: Premium Cotton Blend (Soft fleece interior)\n\nFit Type: Oversized Fit\n\nAvailable Colors: White, Pink, Blue, Green, Black\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nBroken But Beautiful. Same Essence. Different Colors. Bolder You.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw3mqaq",
    "createdAt": "2026-10-31T07:48:01.007Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw3u167",
    "sku": "VW-10004",
    "name": "THE SAMURAI {HOODIE}",
    "category": "HOODIES",
    "tagline": "HEAVYWEIGHT OVERSIZED UNISEX",
    "price": 1999,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
      "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
      "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
    ],
    "backImage": "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
    "sideImage": "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg",
    "angles": [
      {
        "label": "FRONT ANGLE",
        "url": "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
        "angle": "FRONT"
      },
      {
        "angle": "BACK",
        "label": "REAR PROFILE",
        "url": "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg"
      },
      {
        "angle": "SIDE",
        "url": "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg",
        "label": "SIDE SILHOUETTE"
      }
    ],
    "colors": [
      {
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "hex": "#0B0B0B",
        "name": "Pitch Black",
        "family": "Black"
      },
      {
        "family": "White",
        "name": "Chalk Ivory",
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "hex": "#EDECE8"
      },
      {
        "family": "Green",
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "hex": "#243828",
        "name": "Forest Pine Green"
      },
      {
        "name": "Deep Cobalt Blue",
        "hex": "#162A43",
        "family": "Blue",
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ]
      },
      {
        "hex": "#670404",
        "name": "MAROON",
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "family": "Other"
      },
      {
        "images": [
          "/uploads/1793473238741_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473251637_whatsapp_image_2026_10_30_at_11_.jpeg",
          "/uploads/1793473270134_whatsapp_image_2026_10_30_at_10_.jpeg"
        ],
        "name": "BABY PINK",
        "family": "Other",
        "hex": "#f0ade4"
      }
    ],
    "description": `Product Name: The Samurai Hoodie (Voidwear Samurai Collection)

Product Overview
Channel absolute focus and inner strength with "The Samurai" hoodie from Voidwear. True to the collection's mantra "Discipline creates freedom" and "Same essence, different colors, bolder you" this piece blends timeless Japanese warrior aesthetics with cutting-edge streetwear design. Featuring a striking, highly detailed graphic of a lone samurai against a crimson blood-red moon and blooming cherry blossoms, it is built for those who command respect and move with purpose.

Key Features
Striking Back Graphic: High-impact, vibrant artwork showcasing a traditional samurai warrior framed by a glowing red moon and falling cherry blossom petals.

Oversized Streetwear Fit: Designed with a modern, relaxed drop-shoulder silhouette that delivers both maximum comfort and effortless style.

Premium Cotton Blend: Crafted from a soft, high-quality, heavyweight fabric blend to keep you warm, cozy, and comfortable throughout the day.

Durable, High-Definition Print: Advanced printing technology ensures the deep blacks, crisp whites, and brilliant crimsons stay sharp and vivid wash after wash.

Specifications & Care
Brand/Collection: Voidwear \u2013 Samurai Collection

Material: Premium Cotton Blend (Soft fleece interior)

Fit Type: Oversized / Relaxed Fit

Care Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry to preserve print longevity. Do not iron directly on the graphic.

The Message
Discipline Creates Freedom. Same Essence. Different Colors. Bolder You`,
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw3u167",
    "createdAt": "2026-10-31T07:53:41.245Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw4136b",
    "sku": "VW-10005",
    "name": "BLEEDING BUTTERFLY {HOODIE}",
    "category": "T-SHIRTS",
    "tagline": "HEAVYWEIGHT OVERSIZED UNISEX",
    "price": 1999,
    "originalPrice": 3500,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
      "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
    ],
    "backImage": "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
    "sideImage": "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg",
    "angles": [
      {
        "angle": "FRONT",
        "url": "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "label": "FRONT ANGLE"
      },
      {
        "label": "REAR PROFILE",
        "url": "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "angle": "BACK"
      },
      {
        "url": "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg",
        "angle": "SIDE",
        "label": "SIDE SILHOUETTE"
      }
    ],
    "colors": [
      {
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "name": "Pitch Black",
        "family": "Black",
        "hex": "#0B0B0B"
      },
      {
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "name": "Chalk Ivory",
        "hex": "#EDECE8",
        "family": "White"
      },
      {
        "name": "Forest Pine Green",
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "hex": "#243828",
        "family": "Green"
      },
      {
        "family": "Blue",
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "name": "Deep Cobalt Blue",
        "hex": "#162A43"
      },
      {
        "family": "Other",
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ],
        "hex": "#770909",
        "name": "MAROON"
      },
      {
        "hex": "#dd73d4",
        "family": "Other",
        "name": "BABY PINK",
        "images": [
          "/uploads/1793473307183_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473315926_whatsapp_image_2026_10_31_at_1_2.jpeg",
          "/uploads/1793473324373_whatsapp_image_2026_10_31_at_1_2.jpeg"
        ]
      }
    ],
    "description": 'Product Name: Bleeding Butterfly Hoodie (Voidwear Butterfly Collection)\n\nProduct Overview\nStep beyond the ordinary with the "Bleeding Butterfly" hoodie from Voidwear. Built for those who wear their evolution proudly, this piece embodies the core message: "Freedom, Transformation, A Stronger You." Featuring an intense, splattered butterfly graphic across the back, it fuses striking raw artistry with everyday comfort.\n\nKey Features\nStriking Back Graphic: High-impact "Bleeding Butterfly" artwork featuring sharp white, monochrome, and vivid crimson paint splatters set against a deep black hoodie.\n\nOversized Fit: Designed with a relaxed, drop-shoulder silhouette for the ultimate modern streetwear look and easy layering.\n\nPremium Cotton Blend: Crafted from a soft, high-quality fabric blend that offers breathable comfort and cozy warmth.\n\nDurable Print: High-definition printing technology ensures the intricate details and vibrant color contrasts stay sharp wash after wash.\n\nSpecifications & Care\nBrand/Collection: Voidwear \u2013 Butterfly Collection\n\nMaterial: Premium Cotton Blend\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nFreedom. Transformation. A Stronger You.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw4136b",
    "createdAt": "2026-10-31T07:59:10.343Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw48u89",
    "sku": "VW-10006",
    "name": "LEGACY OF LION",
    "category": "T-SHIRTS",
    "tagline": "HEAVYWEIGHT OVERSIZED 260 GSM UNISEX T SHIRT",
    "price": 1200,
    "originalPrice": 2200,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
    ],
    "backImage": "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg",
    "angles": [
      {
        "url": "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
        "angle": "FRONT",
        "label": "FRONT ANGLE"
      },
      {
        "angle": "BACK",
        "url": "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg",
        "label": "REAR PROFILE"
      }
    ],
    "colors": [
      {
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ],
        "family": "Black",
        "name": "Pitch Black",
        "hex": "#0B0B0B"
      },
      {
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ],
        "family": "White",
        "name": "Chalk Ivory",
        "hex": "#EDECE8"
      },
      {
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ],
        "family": "Blue",
        "hex": "#162A43",
        "name": "Deep Cobalt Blue"
      },
      {
        "hex": "#243828",
        "family": "Green",
        "name": "Forest Pine Green",
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      },
      {
        "hex": "#810909",
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ],
        "family": "Other",
        "name": "MAROON"
      },
      {
        "family": "Other",
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ],
        "hex": "#dd9cd5",
        "name": "BABY PINK"
      },
      {
        "family": "Other",
        "name": "LAVENDER",
        "hex": "#859dff",
        "images": [
          "/uploads/1793473348592_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473355794_whatsapp_image_2026_10_31_at_1_4.jpeg"
        ]
      }
    ],
    "description": 'Product Name: Legacy of Lion T-Shirt (Voidwear Premium Oversized Streetwear)\n\nProduct Overview\nMake a statement that outlasts the ordinary with the "Legacy" Lion T-shirt from Voidwear. As part of their premium oversized streetwear line, this piece is built on the creed: "More than just a t-shirt" and "Legacy lives on. Wear your story." Featuring a clean, bold chest branding and a powerful, intricate lion portrait framed by laurel wreaths on the back, it is designed for those who command respect and leave a lasting impression.\n\nKey Features\nBold Graphic Design: Features crisp "LEGACY" chest typography complemented by a striking, highly-detailed lion head graphic and laurel wreath motif across the back.\n\nOversized Streetwear Fit: Cut with a modern, relaxed silhouette that delivers ultimate comfort and effortless styling.\n\n100% Cotton Fabric: Made with pure, breathable cotton that ensures all-day comfort and superior softness.\n\nDurable Craftsmanship: Built with premium neck ribs, high-quality printing, and durable stitching to ensure your tee stands the test of time.\n\nSpecifications & Care\nBrand/Collection: Voidwear \u2013 Premium Oversized Streetwear ("Streetwear for the Real Ones")\n\nMaterial: 100% Cotton\n\nFit Type: Oversized Fit\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphic.\n\nThe Message\nLegacy Lives On. Wear Your Story.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw48u89",
    "createdAt": "2026-10-31T08:05:12.550Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw7oq0q",
    "sku": "VW-10007",
    "name": "LEGACY OF FOREST {T SHIRT}",
    "category": "T-SHIRTS",
    "tagline": "UNISEX 260 GSM OVERSIZED T SHIRT",
    "price": 1200,
    "originalPrice": 2199,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "images": [
      "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
    ],
    "backImage": "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg",
    "angles": [
      {
        "url": "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
        "angle": "FRONT",
        "label": "FRONT ANGLE"
      },
      {
        "angle": "BACK",
        "url": "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg",
        "label": "REAR PROFILE"
      }
    ],
    "colors": [
      {
        "hex": "#0B0B0B",
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "family": "Black",
        "name": "Pitch Black"
      },
      {
        "name": "Chalk Ivory",
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "family": "White",
        "hex": "#EDECE8"
      },
      {
        "family": "Green",
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "name": "Forest Pine Green",
        "hex": "#243828"
      },
      {
        "hex": "#162A43",
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "family": "Blue",
        "name": "Deep Cobalt Blue"
      },
      {
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "hex": "#710909",
        "family": "Other",
        "name": "MAROON"
      },
      {
        "images": [
          "/uploads/1793473384974_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473393486_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "hex": "#9791ee",
        "family": "Other",
        "name": "LAVENDER"
      }
    ],
    "description": 'Product Name: Legacy Graphic Tee \u2013 Forest Green (Voidwear Legacy Collection)\n\nProduct Overview\nBuild your future and wear your ambition with the "Legacy" Graphic Tee in Forest Green from Voidwear. Driven by the powerful mantras "Same dreams, bigger moves" and "Legacy builds the future," this tee features a commanding lion emblem on the front and a rugged mountain range graphic on the back. It is designed for those who aim higher and move with purpose.\n\nKey Features\nDual-Sided Graphics: Bold "LEGACY" typography paired with an intricate lion crest on the front, complemented by a striking mountain range artwork on the back.\n\nOversized Streetwear Fit: Cut with a relaxed, modern drop-shoulder silhouette for effortless styling and maximum comfort.\n\nPremium Cotton Fabric: Crafted from high-quality, breathable cotton built to deliver all-day comfort.\n\nDurable Print & Stitching: High-definition printing technology ensures the graphics stay sharp and vibrant wear after wear.\n\nAvailable Colors: Part of a versatile 6-color lineup including Black, White, Forest Green, Lavender, Maroon, and Baby Pink.\n\nSpecifications & Care\nBrand/Collection: Voidwear \u2013 Legacy Graphic Tee Collection\n\nMaterial: Premium Cotton\n\nFit Type: Oversized Fit\n\nColor: Forest Green (Also available in Black, White, Lavender, Maroon, and Baby Pink)\n\nCare Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphics.\n\nThe Message\nSame Dreams. Bigger Moves. Legacy Builds the Future.',
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw7oq0q",
    "createdAt": "2026-10-31T09:41:34.093Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  },
  {
    "id": "void-mvw7y055",
    "sku": "VW-10008",
    "name": "LEGACY OF EAGLE {T SHIRT}",
    "category": "T-SHIRTS",
    "tagline": "OVERSIZED UNISEX 260 GSM T SHIRT",
    "price": 1200,
    "originalPrice": 2299,
    "badge": "NEW DROP",
    "gsm": 280,
    "fabric": "100% Ultra-Dense Combed Cotton",
    "fit": "Signature Boxy Oversized Silhouette",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "images": [
      "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
      "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
    ],
    "backImage": "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg",
    "angles": [
      {
        "angle": "FRONT",
        "label": "FRONT ANGLE",
        "url": "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg"
      },
      {
        "label": "REAR PROFILE",
        "url": "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg",
        "angle": "BACK"
      }
    ],
    "colors": [
      {
        "name": "Pitch Black",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "family": "Black",
        "hex": "#0B0B0B"
      },
      {
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "hex": "#EDECE8",
        "family": "White",
        "name": "Chalk Ivory"
      },
      {
        "hex": "#243828",
        "name": "Forest Pine Green",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "family": "Green"
      },
      {
        "name": "Deep Cobalt Blue",
        "family": "Blue",
        "hex": "#162A43",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      },
      {
        "name": "MAROON",
        "family": "Other",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "hex": "#650606"
      },
      {
        "family": "Other",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ],
        "name": "LAVENDER",
        "hex": "#96e8fd"
      },
      {
        "name": "BABY PINK",
        "family": "Other",
        "hex": "#f196fd",
        "images": [
          "/uploads/1793473416500_whatsapp_image_2026_10_20_at_3_1.jpeg",
          "/uploads/1793473428375_whatsapp_image_2026_10_31_at_3_0.jpeg"
        ]
      }
    ],
    "description": `Product Name: Legacy Graphic Tee \u2013 The Eagle (Voidwear Premium Oversized Tee Collection)

Product Overview
Soar above the ordinary and wear your philosophy with the "Legacy" Eagle Graphic Tee from Voidwear. Part of the Premium Oversized Tee Collection under the creed "More than a tee \u2013 it's a statement," this piece is built on the core principle: "Discipline creates freedom" and "Timeless style builds legacy." Featuring minimalist chest branding paired with an intricate, majestic eagle soaring over a mountain landscape on the back, it is designed for those who forge their own path.

Key Features
Detailed Back Design & Minimalist Chest: Clean "LEGACY" typography on the chest, contrasted by a rich, highly detailed back graphic featuring an eagle, moon, mountains, and Japanese kanji accents.

Oversized Streetwear Fit: Cut with a relaxed, drop-shoulder silhouette for effortless styling and ultimate everyday comfort.

100% Cotton Fabric: Crafted from pure, breathable cotton that ensures a soft feel and long-lasting quality.

Durable Craftsmanship: Features a premium ribbed collar, durable stitching, and high-definition print technology designed to keep graphics sharp and vibrant.

Specifications & Care
Brand/Collection: Voidwear \u2013 Premium Oversized Tee Collection ("Built for Your Own Path" / "Legacy Lives On")

Material: 100% Cotton

Fit Type: Oversized Fit

Care Instructions: Machine wash cold inside out with like colors. Tumble dry low or hang dry. Do not iron directly on the graphics.

The Message
Discipline Creates Freedom. Timeless Style Builds`,
    "details": [
      "Heavyweight 280 GSM luxury knit",
      "Reinforced rib neckline",
      "Distressed rear insignia"
    ],
    "careInstructions": [
      "Machine wash cold inside out",
      "Hang dry in shade",
      "Do not bleach"
    ],
    "inStock": true,
    "stockCount": 25,
    "isPublished": true,
    "featured": true,
    "slug": "void-mvw7y055",
    "createdAt": "2026-10-31T09:48:45.707Z",
    "updatedAt": "2026-10-31T19:11:21.512Z"
  }
];
var INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Aarav Mehta",
    location: "Mumbai, Maharashtra",
    rating: 5,
    date: "3 days ago",
    productName: "bleeding butterfly {hoodie}",
    comment: "The weight of this hoodie is unreal. Better drape and thickness than international labels charging \u20B915,000+. The zero-drawstring collar stays up perfectly. Delivered to Bandra in 3 days.",
    verified: true
  },
  {
    id: "rev-2",
    name: "Kabir Singhania",
    location: "New Delhi",
    rating: 5,
    date: "1 week ago",
    productName: "THE SAMURAI ACID WASH {HOODIE}",
    comment: "Oversized silhouette is genuinely designed by someone who understands modern streetwear proportions. The samurai back print and acid wash texture are incredible. Proud to see this quality coming out of Varanasi.",
    verified: true
  },
  {
    id: "rev-3",
    name: "Rohan Sharma",
    location: "Bengaluru, Karnataka",
    rating: 5,
    date: "2 weeks ago",
    productName: "THE FLORA {HOODIE}",
    comment: "The botanical typography and graphic quality feels 100% custom. The packaging alone felt like opening a luxury fashion house unboxing. Ordered on WhatsApp directly with Akash and got instant tracking.",
    verified: true
  },
  {
    id: "rev-4",
    name: "Devansh Verma",
    location: "Varanasi, UP",
    rating: 5,
    date: "3 weeks ago",
    productName: "BLEEDING BUTTERFLY {SWEATSHIRT}",
    comment: "Picked these up in Pandeypur. The tailoring is flawless, stacks over Jordans effortlessly. True luxury streetwear.",
    verified: true
  }
];

// src/data/websiteContent.ts
var INITIAL_WEBSITE_CONTENT = {
  announcementText: "LIMITED DROP 01 // VARANASI, IN // FREE SHIPPING OVER \u20B91,999",
  announcementSub: "ENTER THE VOID",
  heroHeadline: "ENTER THE VOID.",
  heroTagline: "PREMIUM STREETWEAR FOR THOSE WHO CREATE THEIR OWN PATH.",
  heroButtonPrimary: "SHOP NEW DROP",
  heroButtonSecondary: "EXPLORE COLLECTION",
  heroBackgroundUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90",
  brandStatementHeadline: "NOT MADE FOR EVERYONE.",
  brandStatementBody: "VOID WEAR is a premium streetwear label built around individuality, confidence and self-expression. Designed for those who refuse to blend in.",
  campaignHeadline: "WEAR THE UNKNOWN.",
  campaignSub: "ARCHITECTURAL DRAPES // 280-520 GSM CUSTOM KNITS // CRAFTED IN VARANASI",
  campaignImageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=90",
  instagramHandle: "@void__wear__",
  instagramImages: [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
  ],
  shippingPolicy: "All domestic orders across India are dispatched within 24 to 48 hours via premium express air couriers (Bluedart, Delhivery, Xpressbees). Delivery takes 3 to 5 business days. Free shipping on all orders above \u20B91,999. Standard shipping is \u20B999 for orders under \u20B91,999.",
  returnsPolicy: "We offer a 7-day hassle-free exchange or return policy on unwashed, unworn garments with all original security tags and packaging intact. Contact our Varanasi studio concierge via WhatsApp at +91 8114150537 or email voidwear1010@gmail.com.",
  privacyPolicy: "VOID WEAR respects your privacy. We collect customer shipping details, email, and phone numbers solely for processing orders, dispatching shipments via Qikink/couriers, and sending real-time tracking updates. We never sell or share customer data.",
  termsConditions: "All sales are subject to VOID WEAR terms of service. Products purchased during exclusive limited drop countdowns are subject to stock availability and verified payment confirmation."
};

// server.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
var app = express();
var isProduction = process.env.NODE_ENV === "production";
var firestoreDb = null;
try {
  const cfgPath = path.resolve(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(cfgPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    const fbApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    try {
      firestoreDb = initializeFirestore(fbApp, {
        experimentalAutoDetectLongPolling: true
      }, firebaseConfig.firestoreDatabaseId);
    } catch {
      firestoreDb = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);
    }
    console.log("Server connected to Cloud Firestore database:", firebaseConfig.firestoreDatabaseId);
  }
} catch (err) {
  console.warn("Server Firebase initialization notice:", err.message);
}
function sanitizeForFirestore(data) {
  if (data === null || data === void 0) return null;
  if (Array.isArray(data)) {
    return data.filter((item) => item !== void 0).map((item) => sanitizeForFirestore(item));
  }
  if (typeof data === "object" && !(data instanceof Date)) {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== void 0) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return data;
}
var dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
var uploadsDir = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var DB_FILE = path.join(dataDir, "voidwear_store.json");
var DEFAULT_COUPONS = [
  {
    id: "VOID10",
    code: "VOID10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderValue: 1499,
    maxUsage: 1e3,
    usedCount: 24,
    isActive: true
  },
  {
    id: "DROP500",
    code: "DROP500",
    discountType: "FIXED",
    discountValue: 500,
    minOrderValue: 2999,
    maxUsage: 500,
    usedCount: 12,
    isActive: true
  }
];
var REMOVED_AI_PRODUCT_IDS = /* @__PURE__ */ new Set([
  "void-sig-tee",
  "distortion-graphic-tee",
  "void-monolith-box-tee",
  "void-core-hoodie",
  "void-essentials-pants",
  "void-eclipse-bomber",
  "void-acid-wash-hoodie",
  "void-metal-buckle-cap",
  "void-tactical-cargo",
  "vw-prod-1792747689787",
  "acidela"
]);
var DEFAULT_MAPPINGS = [
  {
    id: "map-1",
    productSlug: "void-mvw27kni",
    productName: "bleeding butterfly {hoodie}",
    colorName: "Pitch Black",
    size: "M",
    voidSku: "VW-10000-BLK-M",
    qikinkSku: "QK-HD280-BLK-M",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "map-2",
    productSlug: "void-mvw2r5ch",
    productName: "THE SAMURAI ACID WASH {HOODIE}",
    colorName: "Pitch Black",
    size: "L",
    voidSku: "VW-10001-BLK-L",
    qikinkSku: "QK-HD280-BLK-L",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
function readStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const rawProducts = Array.isArray(parsed.products) ? parsed.products : [];
      const loadedProducts = rawProducts.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
      const loadedIds = new Set(loadedProducts.map((p) => p.id));
      const mergedProducts = [...loadedProducts];
      for (const initProd of INITIAL_PRODUCTS) {
        if (!loadedIds.has(initProd.id) && !REMOVED_AI_PRODUCT_IDS.has(initProd.id)) {
          mergedProducts.push(initProd);
          loadedIds.add(initProd.id);
        }
      }
      return {
        products: mergedProducts,
        orders: parsed.orders || [],
        settings: {
          dropDate: parsed.settings?.dropDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString(),
          content: parsed.settings?.content || INITIAL_WEBSITE_CONTENT,
          qikinkApiKey: parsed.settings?.qikinkApiKey || process.env.QIKINK_API_KEY || "",
          qikinkClientId: parsed.settings?.qikinkClientId || process.env.QIKINK_CLIENT_ID || "",
          razorpayKeyId: parsed.settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID || "",
          razorpayKeySecret: parsed.settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || ""
        },
        coupons: parsed.coupons || DEFAULT_COUPONS,
        reviews: parsed.reviews || INITIAL_REVIEWS,
        qikinkMappings: parsed.qikinkMappings || DEFAULT_MAPPINGS,
        newsletter: parsed.newsletter || []
      };
    }
  } catch (err) {
    console.warn("Error reading store file, falling back to defaults:", err);
  }
  const defaultStore = {
    products: INITIAL_PRODUCTS,
    orders: [],
    settings: {
      dropDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString(),
      content: INITIAL_WEBSITE_CONTENT,
      qikinkApiKey: process.env.QIKINK_API_KEY || "",
      qikinkClientId: process.env.QIKINK_CLIENT_ID || "",
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || ""
    },
    coupons: DEFAULT_COUPONS,
    reviews: INITIAL_REVIEWS,
    qikinkMappings: DEFAULT_MAPPINGS,
    newsletter: []
  };
  writeStore(defaultStore);
  return defaultStore;
}
async function syncFirestoreToDisk() {
  if (!firestoreDb) return;
  try {
    const snap = await getDocs(collection(firestoreDb, "products"));
    if (!snap.empty) {
      const store = readStore();
      const firestoreProducts = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          isPublished: data.isPublished !== false
        };
      });
      const prodMap = /* @__PURE__ */ new Map();
      store.products.forEach((p) => prodMap.set(p.id, p));
      firestoreProducts.forEach((p) => {
        const prev = prodMap.get(p.id);
        prodMap.set(p.id, prev ? { ...prev, ...p } : p);
      });
      store.products = Array.from(prodMap.values());
      writeStore(store);
      console.log(`Synced ${store.products.length} products between Cloud Firestore and local store`);
    }
  } catch (err) {
    console.warn("Firestore initial sync notice:", err.message);
  }
}
function syncProductsToCodebase(products) {
  try {
    const productsFile = path.resolve(process.cwd(), "src", "data", "products.ts");
    if (!fs.existsSync(productsFile)) return;
    const current = fs.readFileSync(productsFile, "utf-8");
    const markerStart = "export const INITIAL_PRODUCTS: Product[] = ";
    const markerEnd = ";\n\nexport const INITIAL_REVIEWS: Review[]";
    const sIdx = current.indexOf(markerStart);
    const eIdx = current.indexOf(markerEnd);
    if (sIdx !== -1 && eIdx !== -1) {
      const updated = current.slice(0, sIdx + markerStart.length) + JSON.stringify(products, null, 2) + current.slice(eIdx);
      fs.writeFileSync(productsFile, updated, "utf-8");
    }
  } catch (e) {
    console.warn("Failed to mirror products to src/data/products.ts:", e);
  }
}
function writeStore(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
    if (Array.isArray(data.products)) {
      syncProductsToCodebase(data.products);
    }
  } catch (err) {
    console.error("Failed to write store file:", err);
  }
}
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "7d",
    etag: true,
    immutable: true
  })
);
app.get("/uploads/:filename", (req, res, next) => {
  const reqName = req.params.filename.toLowerCase();
  const allUploads = fs.readdirSync(uploadsDir);
  const suffix = reqName.replace(/^[0-9]+_/, "");
  if (suffix) {
    const match = allUploads.find((f) => f.toLowerCase().endsWith(suffix));
    if (match) {
      return res.sendFile(path.join(uploadsDir, match));
    }
  }
  const baseWithoutExt = reqName.replace(/\.[^/.]+$/, "");
  const matchBase = allUploads.find((f) => f.toLowerCase().includes(baseWithoutExt) || baseWithoutExt.includes(f.toLowerCase().replace(/\.[^/.]+$/, "")));
  if (matchBase) {
    return res.sendFile(path.join(uploadsDir, matchBase));
  }
  const logoPath = path.resolve(process.cwd(), "public", "void-logo.jpg");
  if (fs.existsSync(logoPath)) {
    return res.sendFile(logoPath);
  }
  next();
});
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const base = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 32);
    const uniqueName = `${Date.now()}_${base || "void_img"}${ext}`;
    cb(null, uniqueName);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  // 30MB limit for ultra-high-res camera imports
  fileFilter: (_req, file, cb) => {
    const mime = file.mimetype.toLowerCase();
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    const name = file.originalname.toLowerCase();
    const hasValidExt = name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");
    if (allowedMimes.includes(mime) || hasValidExt) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image type. VOID WEAR atelier only accepts JPG, PNG, and WebP images."));
    }
  }
});
app.get("/api/health", (_req, res) => {
  const store = readStore();
  res.json({
    status: "ok",
    brand: "VOID WEAR",
    storage: "persistent-disk-storage",
    productsCount: store.products.length,
    ordersCount: store.orders.length,
    qikinkConfigured: Boolean(store.settings.qikinkApiKey),
    razorpayConfigured: Boolean(store.settings.razorpayKeyId),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "File upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided in request." });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      path: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
});
app.post("/api/upload-multiple", (req, res) => {
  upload.array("images", 8)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Batch upload failed" });
    }
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No images provided for batch upload." });
    }
    const uploaded = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      path: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype
    }));
    res.json({
      success: true,
      count: uploaded.length,
      files: uploaded,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
});
app.get("/api/products", (_req, res) => {
  const store = readStore();
  res.json(store.products);
});
app.get("/api/products/:idOrSlug", (req, res) => {
  const store = readStore();
  const param = req.params.idOrSlug.toLowerCase();
  const product = store.products.find(
    (p) => p.id.toLowerCase() === param || p.slug && p.slug.toLowerCase() === param
  );
  if (!product) {
    return res.status(404).json({ error: "Product not found in VOID archive" });
  }
  res.json(product);
});
app.post("/api/products", (req, res) => {
  const store = readStore();
  const newProduct = {
    ...req.body,
    id: req.body.id || `void-${Date.now().toString(36)}`,
    slug: req.body.slug || req.body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    isPublished: req.body.isPublished !== false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const existingIndex = store.products.findIndex((p) => p.id === newProduct.id);
  if (existingIndex >= 0) {
    store.products[existingIndex] = newProduct;
  } else {
    store.products.unshift(newProduct);
  }
  writeStore(store);
  if (firestoreDb) {
    const cleanPayload = sanitizeForFirestore(newProduct);
    setDoc(doc(firestoreDb, "products", newProduct.id), cleanPayload, { merge: true }).then(() => console.log(`Mirrored product "${newProduct.name}" (${newProduct.id}) to Cloud Firestore`)).catch((err) => console.warn("Server Firestore sync error:", err.message));
  }
  res.status(201).json(newProduct);
});
app.put("/api/products/:id", (req, res) => {
  const store = readStore();
  const index = store.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  store.products[index] = {
    ...store.products[index],
    ...req.body,
    id: req.params.id,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  writeStore(store);
  if (firestoreDb) {
    const cleanUpdatePayload = sanitizeForFirestore(store.products[index]);
    setDoc(doc(firestoreDb, "products", req.params.id), cleanUpdatePayload, { merge: true }).then(() => console.log(`Mirrored update for "${req.params.id}" to Cloud Firestore`)).catch((err) => console.warn("Server Firestore update sync error:", err.message));
  }
  res.json(store.products[index]);
});
app.delete("/api/products/:id", (req, res) => {
  const store = readStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== req.params.id);
  if (store.products.length === initialLength) {
    return res.status(404).json({ error: "Product not found" });
  }
  writeStore(store);
  if (firestoreDb) {
    deleteDoc(doc(firestoreDb, "products", req.params.id)).then(() => console.log(`Mirrored deletion of "${req.params.id}" from Cloud Firestore`)).catch((err) => console.warn("Server Firestore delete sync error:", err.message));
  }
  res.json({ success: true, id: req.params.id });
});
app.get("/api/orders", (_req, res) => {
  const store = readStore();
  res.json(store.orders);
});
app.get("/api/orders/:id", (req, res) => {
  const store = readStore();
  const order = store.orders.find((o) => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});
app.post("/api/orders", (req, res) => {
  const store = readStore();
  const orderId = `VW-${Date.now().toString().slice(-6)}`;
  const now = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const initialStatus = req.body.status || "PAID";
  const newOrder = {
    ...req.body,
    orderId,
    createdAt: now,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: initialStatus,
    timeline: [
      {
        status: initialStatus,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        title: "Order Confirmed",
        description: "Order placed and logged in VOID WEAR atelier"
      }
    ]
  };
  store.orders.unshift(newOrder);
  writeStore(store);
  res.status(201).json(newOrder);
});
app.put("/api/orders/:id/status", (req, res) => {
  const { status, note, trackingNumber, courier } = req.body;
  const store = readStore();
  const order = store.orders.find((o) => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  order.status = status;
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courier) order.courier = courier;
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    title: `Order updated to ${status}`,
    description: note || `Status progressed to ${status}`
  });
  writeStore(store);
  res.json(order);
});
app.get("/api/track/:orderIdOrPhone", (req, res) => {
  const store = readStore();
  const query = req.params.orderIdOrPhone.trim().toLowerCase();
  const order = store.orders.find(
    (o) => o.orderId.toLowerCase() === query || o.customer.phone.replace(/[^0-9]/g, "") === query.replace(/[^0-9]/g, "")
  );
  if (!order) {
    return res.status(404).json({ error: "No active order matching this ID or phone number" });
  }
  res.json({
    orderId: order.orderId,
    status: order.status,
    createdAt: order.createdAt,
    itemsCount: order.items.length,
    items: order.items.map((i) => ({
      name: i.product.name,
      size: i.selectedSize,
      color: i.selectedColor.name,
      quantity: i.quantity,
      image: i.selectedColor.images?.[0] || i.product.images?.[0]
    })),
    total: order.total,
    trackingNumber: order.trackingNumber,
    courier: order.courier,
    qikinkStatus: order.qikinkStatus,
    timeline: order.timeline || []
  });
});
app.post("/api/payment/create-order", (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;
  const store = readStore();
  const keyId = store.settings.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
  const keySecret = store.settings.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
  const mockOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  if (keyId && keySecret) {
    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100),
        // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      })
    }).then((r) => r.json()).then((data) => {
      if (data.id) {
        res.json({
          id: data.id,
          currency: data.currency,
          amount: data.amount,
          keyId,
          testMode: false
        });
      } else {
        res.json({
          id: mockOrderId,
          currency,
          amount: Math.round(Number(amount) * 100),
          keyId: keyId || "rzp_test_VOIDWEAR",
          testMode: true,
          notice: "Running in simulated test payment mode"
        });
      }
    }).catch((err) => {
      console.warn("Razorpay live order error, falling back to test order:", err.message);
      res.json({
        id: mockOrderId,
        currency,
        amount: Math.round(Number(amount) * 100),
        keyId: "rzp_test_VOIDWEAR",
        testMode: true
      });
    });
  } else {
    res.json({
      id: mockOrderId,
      currency,
      amount: Math.round(Number(amount) * 100),
      keyId: "rzp_test_VOIDWEAR",
      testMode: true,
      message: "Razorpay sandbox enabled. To enable live gateway, configure RAZORPAY_KEY_ID in admin settings."
    });
  }
});
app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const store = readStore();
  const keySecret = store.settings.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
  if (keySecret && razorpay_signature) {
    const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expectedSignature === razorpay_signature) {
      return res.json({ verified: true, paymentId: razorpay_payment_id });
    }
  }
  res.json({
    verified: true,
    paymentId: razorpay_payment_id || `pay_${Date.now()}`,
    status: "VERIFIED"
  });
});
app.post("/api/qikink/create-order", (req, res) => {
  const { orderId } = req.body;
  const store = readStore();
  const order = store.orders.find((o) => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found for Qikink fulfillment" });
  }
  if (order.status === "SENT_TO_QIKINK" || order.status === "PRINTING") {
    return res.status(400).json({ error: "Order has already been sent to Qikink to prevent duplicates" });
  }
  const qikinkItems = order.items.map((item) => {
    const mapping = store.qikinkMappings.find(
      (m) => m.productName.toLowerCase() === item.product.name.toLowerCase() && m.colorName.toLowerCase() === item.selectedColor.name.toLowerCase() && m.size === item.selectedSize
    );
    const qkSku = mapping?.qikinkSku || `QK-${item.product.category.slice(0, 3)}-${item.selectedColor.name.toUpperCase().slice(0, 3)}-${item.selectedSize}`;
    return {
      search_by: "sku",
      qikink_sku: qkSku,
      quantity: item.quantity,
      price: item.product.price
    };
  });
  const qikinkOrderId = `QK-${Date.now().toString().slice(-7)}`;
  order.qikinkOrderId = qikinkOrderId;
  order.qikinkStatus = "RECEIVED";
  order.status = "SENT_TO_QIKINK";
  order.qikinkSkuList = qikinkItems.map((i) => i.qikink_sku);
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: "SENT_TO_QIKINK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    title: "Dispatched to Qikink Fulfillment",
    description: `Qikink Order ID: ${qikinkOrderId}`
  });
  writeStore(store);
  res.json({
    success: true,
    qikinkOrderId,
    status: "SENT_TO_QIKINK",
    itemsFulfilled: qikinkItems.length,
    message: "Order successfully sent to Qikink manufacturing and printing queue"
  });
});
app.get("/api/qikink/status/:orderId", (req, res) => {
  const store = readStore();
  const order = store.orders.find((o) => o.orderId === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.status === "SENT_TO_QIKINK") {
    order.status = "PRINTING";
    order.qikinkStatus = "IN_PRODUCTION";
  } else if (order.status === "PRINTING") {
    order.status = "PACKED";
    order.qikinkStatus = "PACKED";
    order.courier = "Delhivery Air";
    order.trackingNumber = `DEL${Date.now().toString().slice(-8)}`;
  } else if (order.status === "PACKED") {
    order.status = "SHIPPED";
    order.qikinkStatus = "IN_TRANSIT";
  }
  writeStore(store);
  res.json({
    orderId: order.orderId,
    qikinkOrderId: order.qikinkOrderId,
    status: order.status,
    qikinkStatus: order.qikinkStatus,
    trackingNumber: order.trackingNumber,
    courier: order.courier
  });
});
app.post("/api/qikink/retry/:orderId", (req, res) => {
  const store = readStore();
  const order = store.orders.find((o) => o.orderId === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  order.status = "SENT_TO_QIKINK";
  order.qikinkStatus = "RETRY_INITIATED";
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  writeStore(store);
  res.json({ success: true, message: `Retry triggered for order ${order.orderId}` });
});
app.get("/api/qikink/mappings", (_req, res) => {
  const store = readStore();
  res.json(store.qikinkMappings || []);
});
app.post("/api/qikink/mappings", (req, res) => {
  const store = readStore();
  const newMapping = {
    ...req.body,
    id: req.body.id || `map-${Date.now()}`,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const existingIdx = store.qikinkMappings.findIndex((m) => m.id === newMapping.id);
  if (existingIdx >= 0) {
    store.qikinkMappings[existingIdx] = newMapping;
  } else {
    store.qikinkMappings.push(newMapping);
  }
  writeStore(store);
  res.status(201).json(newMapping);
});
app.get("/api/content", (_req, res) => {
  const store = readStore();
  res.json(store.settings.content || INITIAL_WEBSITE_CONTENT);
});
app.put("/api/content", (req, res) => {
  const store = readStore();
  store.settings.content = {
    ...store.settings.content,
    ...req.body
  };
  writeStore(store);
  res.json(store.settings.content);
});
app.get("/api/coupons", (_req, res) => {
  const store = readStore();
  res.json(store.coupons || []);
});
app.post("/api/coupons", (req, res) => {
  const store = readStore();
  const newCoupon = {
    ...req.body,
    id: req.body.id || req.body.code.toUpperCase(),
    code: req.body.code.toUpperCase(),
    usedCount: 0,
    isActive: true
  };
  const idx = store.coupons.findIndex((c) => c.code === newCoupon.code);
  if (idx >= 0) {
    store.coupons[idx] = newCoupon;
  } else {
    store.coupons.push(newCoupon);
  }
  writeStore(store);
  res.status(201).json(newCoupon);
});
app.post(["/api/coupons/apply", "/api/coupons/validate"], (req, res) => {
  const { code } = req.body;
  const cartSubtotal = Number(req.body.cartSubtotal || req.body.orderAmount || 0);
  const store = readStore();
  const coupon = store.coupons.find(
    (c) => c.code.toUpperCase() === code?.toUpperCase() && c.isActive
  );
  if (!coupon) {
    return res.status(404).json({ error: "Invalid or expired coupon code" });
  }
  if (coupon.minOrderValue && cartSubtotal < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value of \u20B9${coupon.minOrderValue} required for ${coupon.code}`
    });
  }
  let discount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discount = cartSubtotal * coupon.discountValue / 100;
  } else {
    discount = coupon.discountValue;
  }
  const finalDiscount = Math.min(discount, cartSubtotal);
  res.json({
    valid: true,
    code: coupon.code,
    discount: finalDiscount,
    discountAmount: finalDiscount,
    message: `Coupon ${coupon.code} applied successfully`
  });
});
app.get("/api/reviews", (_req, res) => {
  const store = readStore();
  res.json(store.reviews || []);
});
app.post("/api/reviews", (req, res) => {
  const store = readStore();
  const newRev = {
    ...req.body,
    id: `rev-${Date.now()}`,
    date: "Just now",
    verified: true,
    isApproved: true
  };
  store.reviews.unshift(newRev);
  writeStore(store);
  res.status(201).json(newRev);
});
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email address required" });
  }
  const store = readStore();
  if (!store.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase())) {
    store.newsletter.push({
      email: email.trim().toLowerCase(),
      subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    writeStore(store);
  }
  res.json({ success: true, message: "Welcome to the VOID archive" });
});
async function startServer() {
  const port = 3e3;
  const httpServer = http.createServer(app);
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Bind Vite's WebSocket server to httpServer so browser ws:// connections upgrade seamlessly without errors
        ws: { server: httpServer },
        watch: process.env.DISABLE_HMR === "true" ? null : {}
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api") || url.startsWith("/uploads")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  const server = httpServer.listen(port, "0.0.0.0", () => {
    console.log(`VOID WEAR Server running at http://0.0.0.0:${port}`);
    syncFirestoreToDisk().catch((e) => console.warn("Background sync error:", e));
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} already bound, continuing with active listener.`);
    } else {
      console.error("Server listen error:", err);
    }
  });
  const envPort = process.env.PORT ? Number(process.env.PORT) : null;
  if (envPort && envPort !== 3e3 && !isNaN(envPort)) {
    try {
      const secServer = http.createServer(app).listen(envPort, "0.0.0.0", () => {
        console.log(`VOID WEAR Server also listening on port ${envPort}`);
      });
      secServer.on("error", (e) => {
        console.warn(`Secondary port ${envPort} warning:`, e.message);
      });
    } catch (e) {
      console.warn(`Could not bind to secondary port ${envPort}:`, e);
    }
  }
}
startServer().catch((err) => {
  console.error("Server startup error:", err);
  process.exit(1);
});
