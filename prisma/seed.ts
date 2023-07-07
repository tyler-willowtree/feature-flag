import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const featureFlag = {
  id: 1,
  name: 'a-example-only',
  description: 'Example for different items on server and client sides',
  enabled: false,
  enablePercentage: 100,
  onCount: 10,
  offCount: 0,
  updatedAt: new Date(),
};

const main = async (name: any) => {
  console.log(`Start seeding featureFlag table.`);

  if (prisma['featureFlag']) {
    const { id, ...rest } = name;
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

main(featureFlag)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log('ERROR', error);
    await prisma.$disconnect();
    process.exit();
  });
