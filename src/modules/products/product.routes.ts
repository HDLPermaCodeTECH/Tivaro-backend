import { Router } from 'express';
import * as productController from './product.controller';
import { authenticate } from '../../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.use(authenticate);

router.get('/', productController.getProducts);
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error during create:', err);
      return res.status(500).json({ error: 'Failed to upload image', details: err.message });
    }
    next();
  });
}, productController.createProduct);

router.put('/:id', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error during update:', err);
      return res.status(500).json({ error: 'Failed to upload image', details: err.message });
    }
    next();
  });
}, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
