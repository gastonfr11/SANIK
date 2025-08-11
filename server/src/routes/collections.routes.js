import { Router } from 'express';
import { listCollections, getCollectionBySlug } from '../controllers/collections.controller.js';

const router = Router();
router.get('/', listCollections);
router.get('/:slug', getCollectionBySlug); // incluye productos
export default router;
