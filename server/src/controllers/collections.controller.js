import { prisma } from '../lib/prisma.js';

export const listCollections = async (_req, res, next) => {
  try {
    const data = await prisma.collection.findMany({
      select: { id: true, name: true, slug: true, heroImage: true, concept: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { next(e); }
};

export const getCollectionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const data = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: { images: true, variants: true }
        }
      }
    });
    if (!data) return res.status(404).json({ message: 'Collection not found' });
    res.json(data);
  } catch (e) { next(e); }
};
