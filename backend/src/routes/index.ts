import { Router } from 'express';
import { checkDatabaseHealth } from '@/utils/db-test';
import authRoutes from './auth';
import profileRoutes from './profile';
import categoryRoutes from './category';
import vendorRoutes from './vendor';
import productRoutes from './product';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IndoVendor API is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check route
router.get('/health/database', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    res.json({
      success: dbHealth.status === 'healthy',
      message: `Database is ${dbHealth.status}`,
      data: dbHealth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Use route modules
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/categories', categoryRoutes);
router.use('/vendor', vendorRoutes);
router.use('/products', productRoutes);

// TODO: Add more route imports and usage here
// import userRoutes from './users';
// import orderRoutes from './orders';
// router.use('/users', userRoutes);
// router.use('/orders', orderRoutes);

export default router;