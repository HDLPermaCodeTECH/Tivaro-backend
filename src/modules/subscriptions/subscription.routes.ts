import { Router } from 'express';
import { getSubscriptions, getSubscriptionStats, createMockSubscription } from './subscription.controller';

const router = Router();

router.get('/', getSubscriptions);
router.get('/stats', getSubscriptionStats);
router.post('/mock', createMockSubscription);

export default router;
