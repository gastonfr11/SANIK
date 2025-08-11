import { prisma } from '../lib/prisma.js';

export const listProducts = async (req, res, next) => {
  try {
    const { collection, q, take = 20, skip = 0 } = req.query;

    const where = {
      ...(collection ? { collection: { slug: collection } } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {})
    };

    const products = await prisma.product.findMany({
      where,
      include: { images: true, variants: true, collection: true },
      take: Number(take),
      skip: Number(skip),
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (e) { next(e); }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true, variants: true, collection: true }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
};
