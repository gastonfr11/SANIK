import 'dotenv/config';
import { prisma } from './prisma.js';

async function main() {
  // limpiar (orden por FKs)
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  const street = await prisma.collection.create({
    data: {
      slug: 'street-aw24',
      name: 'STREET AW24',
      heroImage: 'assets/imagenes/collections/street-hero.jpg',
      concept: 'Siluetas urbanas, materiales técnicos y actitud.'
    }
  });

  await prisma.product.create({
    data: {
      slug: 'soul-jacket-black',
      name: 'Soul Jacket Black',
      priceUYU: 319500, // $3.195,00 (usa centésimos)
      description: 'Corte oversized, cierres metal, interior forrado.',
      coverImage: 'assets/imagenes/conjunto1.jpg',
      collectionId: street.id,
      images: {
        create: [
          { url: 'assets/imagenes/conjunto1.jpg', alt: 'cover' },
          { url: 'assets/imagenes/conjunto1_hover.jpg', alt: 'hover', isHover: true }
        ]
      },
      variants: {
        create: [
          { size: 'S', color: 'Black', stock: 8 },
          { size: 'M', color: 'Black', stock: 12 },
          { size: 'L', color: 'Black', stock: 6 }
        ]
      }
    }
  });

  console.log('Seed OK ✅');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
