import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await (prisma as any).subscription.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalRevenue = await (prisma as any).subscription.aggregate({
      _sum: {
        amount: true
      }
    });

    // Monthly revenue (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRevenue = await (prisma as any).subscription.aggregate({
      where: {
        created_at: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });

    // Plan distribution
    const plans = await (prisma as any).subscription.groupBy({
      by: ['plan'],
      _count: {
        id: true
      }
    });

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        planDistribution: plans
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createMockSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, plan, amount } = req.body;
    
    const subscription = await (prisma as any).subscription.create({
      data: {
        user_id,
        plan,
        amount: parseFloat(amount),
        created_at: new Date()
      }
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
