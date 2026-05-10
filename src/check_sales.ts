import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const salesCount = await prisma.sale.count();
    const salesSum = await prisma.sale.aggregate({
      _sum: {
        total_amount: true
      }
    });
    console.log(`Sales Count:`, salesCount);
    console.log(`Sales Sum:`, salesSum);
  } catch (error) {
    console.error('Failed to fetch sales:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
