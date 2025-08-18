import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IndoVendor API is running',
    timestamp: new Date().toISOString()
  });
});

// TODO: Add route imports here
// import authRoutes from './auth';
// import userRoutes from './users';
// import productRoutes from './products';
// import orderRoutes from './orders';

// TODO: Use routes here
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;