import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log(`All Users:`, users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
