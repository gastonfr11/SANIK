// src/scripts/bulk_import.js
import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

/**
 * ============================
 * 🧩 DATA: editá desde acá
 * ============================
 * - Podés duplicar objetos dentro de DATA para más productos.
 * - priceUYU: admitir "3.195,00", "3195.00" o número 3195 (UYU).
 * - Las imágenes/variantes son opcionales.
 */
const DATA = [
  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'cow-babe-set',
      name: 'COW BABE SET',
      priceUYU: '5.090,00', // ← también puede ser 3195 o "3195.00"
      description: 'un look que evoca personalidad junto con la fuerza del estampado cow.',
      coverImage: 'assets/imagenes/COW1.JPG',
      images: [
        { url: 'assets/imagenes/COW2.jpg', alt: 'cover' },
        { url: 'assets/imagenes/COW3.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW4.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW5.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW6.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW7.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW8.jpg', alt: 'hover', isHover: true },
        { url: 'assets/imagenes/COW9.jpg', alt: 'hover', isHover: true }
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'winter-line-set',
      name: 'WINTER LINE SET',
      priceUYU: '4.990,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/COW1.JPG',
      images: [
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'coco-coat',
      name: 'ABRIGO COCÓ COAT',
      priceUYU: '4.790,00', 
      description: '',
      coverImage: 'assets/imagenes/COW1.JPG',
      images: [
      ],
      variants: [
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'm-u-pant',
      name: 'M-U PANT',
      priceUYU: '3.790,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/M-U1.JPG',
      images: [
        { url: 'assets/imagenes/M-U2.jpg', alt: 'cover' },
        { url: 'assets/imagenes/M-U3.jpg', alt: 'cover' },
        { url: 'assets/imagenes/M-U4.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'greek-dress',
      name: 'GREEK DRESS',
      priceUYU: '3.090,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/GREEK1.JPG',
      images: [
        { url: 'assets/imagenes/GREEK2.jpg', alt: 'cover' },
        { url: 'assets/imagenes/GREEK3.jpg', alt: 'cover' },
        { url: 'assets/imagenes/GREEK4.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'stormi-dress',
      name: 'STORMI DRESS',
      priceUYU: '2.790,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/COW1.JPG',
      images: [
      ],
      variants: [
        { size: 'XS', color: 'Black', stock: 0 },
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'me-t',
      name: 'CARDIGAN ME-T',
      priceUYU: '2.690,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/ME-T1.JPG',
      images: [
        { url: 'assets/imagenes/ME-T2.jpg', alt: 'cover' },
        { url: 'assets/imagenes/ME-T3.jpg', alt: 'cover' },
        { url: 'assets/imagenes/ME-T4.jpg', alt: 'cover' },
        { url: 'assets/imagenes/ME-T5.jpg', alt: 'cover' },
        { url: 'assets/imagenes/ME-T6.jpg', alt: 'cover' },
        { url: 'assets/imagenes/ME-T7.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'XS', color: 'Black', stock: 0 },
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'pant-channel',
      name: 'PANT CHANNEL',
      priceUYU: '2.690,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/CHANNEL1.JPG',
      images: [
        { url: 'assets/imagenes/CHANNEL2.jpg', alt: 'cover' },
        { url: 'assets/imagenes/CHANNEL3.jpg', alt: 'cover' },
        { url: 'assets/imagenes/CHANNEL4.jpg', alt: 'cover' },
        { url: 'assets/imagenes/CHANNEL5.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'M', color: 'Black', stock: 0 },
        { size: 'L', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'cross-out-top',
      name: 'CROSS OUT TOP',
      priceUYU: '1.890,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/CROSS1.JPG',
      images: [
        { url: 'assets/imagenes/CROSS2.jpg', alt: 'hover' },
        { url: 'assets/imagenes/CROSS3.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'XS', color: 'Black', stock: 0 },
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 }
      ]
    }
  },

  {
    collection: {
      slug: 'SC-G-COLLECTION',
      name: 'SC-G COLLECTION',
      heroImage: '',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    },
    product: {
      slug: 'star-mood-top',
      name: 'STAR MOOD TOP',
      priceUYU: '1.890,00', 
      description: 'un look que evoca personalidad junto con lafuerza del estampado cow.',
      coverImage: 'assets/imagenes/STAR1.JPG',
      images: [
        { url: 'assets/imagenes/STAR2.jpg', alt: 'hover' },
        { url: 'assets/imagenes/STAR3.jpg', alt: 'cover' },
        { url: 'assets/imagenes/STAR4.jpg', alt: 'cover' },
        { url: 'assets/imagenes/STAR5.jpg', alt: 'cover' },
      ],
      variants: [
        { size: 'XS', color: 'Black', stock: 0 },
        { size: 'S', color: 'Black', stock: 0 },
        { size: 'M', color: 'Black', stock: 0 }
      ]
    }
  },


];

/* ============================
 * ⚙️ Helpers
 * ============================ */
function parsePriceToCents(input) {
  if (typeof input === 'number') return Math.round(input * 100);
  if (!input) return 0;
  const normalized = String(input).trim().replace(/\./g, '').replace(',', '.');
  const val = Number(normalized);
  if (Number.isNaN(val)) throw new Error(`Precio inválido: "${input}"`);
  return Math.round(val * 100);
}

function assertRequired(obj, keys, ctx) {
  for (const k of keys) {
    if (obj[k] === undefined || obj[k] === null || obj[k] === '') {
      throw new Error(`Falta "${k}" en ${ctx}`);
    }
  }
}

/* ============================
 * 🚚 Importador
 * ============================ */
async function upsertEntry(entry) {
  const { collection, product } = entry;

  // Validaciones mínimas
  assertRequired(collection ?? {}, ['slug'], 'collection');
  assertRequired(product ?? {}, ['slug', 'name', 'priceUYU', 'coverImage'], 'product');

  // 1) Upsert de colección
  const col = await prisma.collection.upsert({
    where: { slug: collection.slug },
    update: {
      ...(collection.name ? { name: collection.name } : {}),
      ...(collection.heroImage ? { heroImage: collection.heroImage } : {}),
      ...(collection.concept ? { concept: collection.concept } : {}),
    },
    create: {
      slug: collection.slug,
      name: collection.name ?? collection.slug,
      heroImage: collection.heroImage ?? null,
      concept: collection.concept ?? null,
    },
    select: { id: true, slug: true }
  });

  // 2) Normalizar precio
  const priceCents = parsePriceToCents(product.priceUYU);

  // 3) Si el producto ya existe, limpiar imágenes/variantes para reimportar fresco
  const existing = await prisma.product.findUnique({
    where: { slug: product.slug },
    select: { id: true }
  });
  if (existing) {
    await prisma.productImage.deleteMany({ where: { productId: existing.id } });
    await prisma.variant.deleteMany({ where: { productId: existing.id } });
  }

  // 4) Upsert de producto
  const prod = await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      name: product.name,
      priceUYU: priceCents,
      description: product.description ?? null,
      coverImage: product.coverImage,
      collectionId: col.id,
    },
    create: {
      slug: product.slug,
      name: product.name,
      priceUYU: priceCents,
      description: product.description ?? null,
      coverImage: product.coverImage,
      collectionId: col.id,
    },
    select: { id: true, slug: true }
  });

  // 5) Re-crear imágenes y variantes (si hay)
  if (product.images?.length) {
    await prisma.productImage.createMany({
      data: product.images.map(img => ({
        url: img.url,
        alt: img.alt ?? null,
        isHover: Boolean(img.isHover),
        productId: prod.id
      }))
    });
  }
  if (product.variants?.length) {
    await prisma.variant.createMany({
      data: product.variants.map(v => ({
        size: v.size ?? null,
        color: v.color ?? null,
        stock: v.stock ?? 0,
        productId: prod.id
      }))
    });
  }

  return prod.slug;
}

async function main() {
  for (const entry of DATA) {
    const slug = await upsertEntry(entry);
    console.log(`✅ OK: ${slug}`);
  }
  console.log('🎉 Importación completada');
}

main()
  .catch(err => {
    console.error('❌ Error en importación:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
