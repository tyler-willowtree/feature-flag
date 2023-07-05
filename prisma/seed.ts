import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = {
  id: 1,
  name: 'a-example-only',
  description: 'Example header for server side pages',
  enabled: false,
  enablePercentage: 100,
  onCount: 10,
  offCount: 0,
  updatedAt: new Date(),
};

const main = async () => {
  console.log(`Start seeding featureFlag table.`);

  if (prisma['featureFlag']) {
    const { id, ...rest } = data;
    const done = await prisma.featureFlag.upsert({
      where: { id },
      update: rest,
      create: rest,
    });

    console.log(`\tSeeded featureFlag table with id: ${done.id}`);
  } else {
    console.log(`\tNo such table: featureFlag`);
  }

  console.log(`Populated featureFlag table.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log('ERROR', error);
    await prisma.$disconnect();
    process.exit();
  });
