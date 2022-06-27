import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(
    await prisma.userRole.upsert({
      where: { name: 'user' },
      create: { name: 'user' },
      update: {},
    }),
  );
  console.log(
    await prisma.userRole.upsert({
      where: { name: 'administrator' },
      create: { name: 'administrator' },
      update: {},
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
