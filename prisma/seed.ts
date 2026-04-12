// at least 2 users (admin + editor)
// at least 3 categories
// at least 5 tags
// at least 5 articles with different statuses/categories/tags
// at least 3 comments

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'generated/prisma/client';
import { Role, Status } from 'generated/prisma/enums';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: '1122',
      role: Role.ADMIN,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: 'Technology',
      description: 'All about tech',
    },
  });

  await prisma.article.create({
    data: {
      title: 'Docker & Prisma Guide',
      content: 'This is a long content about Docker...',
      status: Status.PUBLISHED,
      authorId: admin.id,
      categoryId: category.id,
      tags: {
        create: [{ name: 'docker' }, { name: 'nestjs' }],
      },
    },
  });

  console.log('🌱 Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
