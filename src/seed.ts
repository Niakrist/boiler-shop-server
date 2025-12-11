import { faker } from '@faker-js/faker';
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'NorthWest',
];

const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensory',
  'Lesly',
  'Radien',
  'Gasoline',
  'Croatia',
];

async function main() {
  const NUM_BOILER_PARTS = 200;
  for (let i = 0; i < NUM_BOILER_PARTS; i++) {
    const price = faker.number.int({ min: 1000, max: 50000 });
    const boilerManufacturer =
      boilerManufacturers[
        Math.floor(Math.random() * boilerManufacturers.length)
      ];
    const name = `${boilerManufacturer} ${faker.lorem.sentence(2)}`;
    const description = `${boilerManufacturer} ${faker.lorem.sentence(10)}`;
    const partsManufacturer =
      partsManufacturers[Math.floor(Math.random() * partsManufacturers.length)];
    const venderCode = faker.string.alphanumeric(10).toUpperCase();
    const images = Array.from({ length: 3 }, () =>
      faker.image.url({
        width: 640,
        height: 480,
      }),
    );
    const inStock = faker.number.int({ min: 0, max: 100 });
    const bestseller = faker.datatype.boolean({ probability: 0.2 });
    const newBoilerPart = faker.datatype.boolean({ probability: 0.1 });
    const popularity = faker.number.int({ min: 0, max: 100 });
    const compatibility = faker.lorem.sentence(7);

    await prisma.boilerPart.create({
      data: {
        price,
        boilerManufacturer,
        name,
        description,
        partsManufacturer,
        venderCode,
        images,
        inStock,
        bestseller,
        newBoilerPart,
        popularity,
        compatibility,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
