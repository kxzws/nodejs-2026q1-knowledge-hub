import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';
import { Role, Status } from '../generated/prisma/enums';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: '11223344',
      role: Role.ADMIN,
    },
  });
  const editor = await prisma.user.create({
    data: {
      login: 'user',
      password: '11223344',
      role: Role.EDITOR,
    },
  });

  const categoryTech = await prisma.category.create({
    data: {
      name: 'Technology',
      description: 'All about tech',
    },
  });
  const categoryBio = await prisma.category.create({
    data: {
      name: 'Biology',
      description: 'Nature is everywhere',
    },
  });
  const categoryMath = await prisma.category.create({
    data: {
      name: 'Math',
      description: 'Complex expressions are the truth',
    },
  });

  await prisma.article.create({
    data: {
      title: 'Docker & Prisma Guide',
      content: 'This is a long content about Docker...',
      status: Status.PUBLISHED,
      authorId: admin.id,
      categoryId: categoryTech.id,
      tags: {
        create: [{ name: 'docker' }, { name: 'nestjs' }],
      },
      comments: {
        create: [
          {
            authorId: editor.id,
            content: 'That is interesting',
          },
          {
            authorId: editor.id,
            content: 'Explaing me the 2nd point please',
          },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Nature & Us',
      content: 'Nature is important for all of us...',
      status: Status.DRAFT,
      authorId: admin.id,
      categoryId: categoryBio.id,
      tags: {
        create: [
          { name: 'nature' },
          { name: 'ecology' },
          { name: 'environment' },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Today is math',
      content: 'Math is not that obvious as you think...',
      status: Status.ARCHIVED,
      authorId: editor.id,
      categoryId: categoryMath.id,
      tags: {
        create: [{ name: 'math' }, { name: 'expression' }],
      },
      comments: {
        create: [
          {
            authorId: admin.id,
            content: 'I did not saw thats coming',
          },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Im new here',
      content: 'Please tell how you all are doing here...',
      status: Status.PUBLISHED,
      authorId: editor.id,
      tags: {
        create: [{ name: 'freshman' }],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'JavaScript end?',
      content: 'Looks like the dot...',
      status: Status.ARCHIVED,
      authorId: admin.id,
      categoryId: categoryTech.id,
      tags: {
        create: [{ name: 'javascript' }, { name: 'programming' }],
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
