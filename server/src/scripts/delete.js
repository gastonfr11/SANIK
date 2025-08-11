// src/scripts/delete.js
import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

/**
 * Uso:
 *   node src/scripts/delete.js <slug>
 *   node src/scripts/delete.js <slug> --product
 *   node src/scripts/delete.js <slug> --collection
 *   node src/scripts/delete.js <slug> --dry-run
 */

function parseArgs() {
  const [, , slug, ...rest] = process.argv;
  const flags = new Set(rest);
  if (!slug) {
    console.log('Uso: node src/scripts/delete.js <slug> [--product|--collection] [--dry-run]');
    process.exit(1);
  }
  return { slug, flags };
}

async function dryCountsForProduct(productId) {
  const [imgs, vars] = await Promise.all([
    prisma.productImage.count({ where: { productId } }),
    prisma.variant.count({ where: { productId } }),
  ]);
  return { imgs, vars };
}

async function deleteProductBySlug(slug, { dryRun = false } = {}) {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
  if (!product) return { ok: false, reason: `No existe producto con slug "${slug}"` };

  const counts = await dryCountsForProduct(product.id);

  if (dryRun) {
    return {
      ok: true,
      dry: true,
      info: {
        product: product.slug,
        toDelete: { images: counts.imgs, variants: counts.vars, product: 1 },
      },
    };
  }

  // Transacción: primero dependientes, luego producto
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: product.id } }),
    prisma.variant.deleteMany({ where: { productId: product.id } }),
    prisma.product.delete({ where: { id: product.id } }),
  ]);

  return {
    ok: true,
    dry: false,
    info: {
      product: product.slug,
      deleted: { images: counts.imgs, variants: counts.vars, product: 1 },
    },
  };
}

async function deleteCollectionBySlug(slug, { dryRun = false } = {}) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
  if (!collection) return { ok: false, reason: `No existe colección con slug "${slug}"` };

  // Buscar todos los productos de la colección
  const products = await prisma.product.findMany({
    where: { collectionId: collection.id },
    select: { id: true, slug: true },
  });

  // Contar dependientes
  const [imgCount, varCount] = await Promise.all([
    prisma.productImage.count({ where: { product: { collectionId: collection.id } } }),
    prisma.variant.count({ where: { product: { collectionId: collection.id } } }),
  ]);

  if (dryRun) {
    return {
      ok: true,
      dry: true,
      info: {
        collection: collection.slug,
        toDelete: {
          products: products.length,
          images: imgCount,
          variants: varCount,
          collection: 1,
        },
      },
    };
  }

  // Transacción en varias etapas
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { product: { collectionId: collection.id } } }),
    prisma.variant.deleteMany({ where: { product: { collectionId: collection.id } } }),
    prisma.product.deleteMany({ where: { collectionId: collection.id } }),
    prisma.collection.delete({ where: { id: collection.id } }),
  ]);

  return {
    ok: true,
    dry: false,
    info: {
      collection: collection.slug,
      deleted: {
        products: products.length,
        images: imgCount,
        variants: varCount,
        collection: 1,
      },
    },
  };
}

async function main() {
  const { slug, flags } = parseArgs();
  const wantProduct = flags.has('--product');
  const wantCollection = flags.has('--collection');
  const dryRun = flags.has('--dry-run');

  // Auto-detección si no se especifica tipo
  let type = null;
  if (!wantProduct && !wantCollection) {
    const [asProduct, asCollection] = await Promise.all([
      prisma.product.findUnique({ where: { slug }, select: { id: true } }),
      prisma.collection.findUnique({ where: { slug }, select: { id: true } }),
    ]);
    if (asProduct && asCollection) {
      console.error(`El slug "${slug}" existe como producto y colección. Usá --product o --collection.`);
      process.exit(1);
    }
    if (asProduct) type = 'product';
    if (asCollection) type = 'collection';
    if (!type) {
      console.error(`No existe producto ni colección con slug "${slug}".`);
      process.exit(1);
    }
  } else {
    type = wantProduct ? 'product' : 'collection';
  }

  const res =
    type === 'product'
      ? await deleteProductBySlug(slug, { dryRun })
      : await deleteCollectionBySlug(slug, { dryRun });

  if (!res.ok) {
    console.error('❌', res.reason);
    process.exit(1);
  }

  if (res.dry) {
    console.log('🔎 DRY RUN — No se borró nada. Resumen:');
    console.dir(res.info, { depth: null });
  } else {
    console.log('✅ Borrado exitoso:');
    console.dir(res.info, { depth: null });
  }
}

main()
  .catch((err) => {
    console.error('❌ Error al borrar:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
