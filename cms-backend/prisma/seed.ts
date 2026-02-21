import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .substring(0, 50);
}

async function main() {
  const permissions = [
    'blog.create',
    'blog.update',
    'blog.delete',
    'blog.read',
    'blog.manage',
    'blog.publish',
    'news.create',
    'news.update',
    'news.delete',
    'news.read',
    'news.manage',
    'news.publish',
    'user.create',
    'user.update',
    'user.delete',
    'user.read',
    'user.manage',
    'role.create',
    'role.update',
    'role.delete',
    'role.read',
    'role.manage',
    'permission.create',
    'permission.update',
    'permission.delete',
    'permission.read',
    'permission.manage',
  ];

  const createdPermissions = [];
  for (const key of permissions) {
    const p = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key },
      select: { id: true, key: true },
    });
    createdPermissions.push(p);
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator' },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'EDITOR' },
    update: {},
    create: { name: 'EDITOR', description: 'Editor' },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: { name: 'VIEWER', description: 'Viewer' },
  });

  // assign permissions to ADMIN (all)
  for (const p of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRole.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id },
    });
  }

  // assign read and write permissions to EDITOR
  const editorPerms = createdPermissions.filter(
    (p) => p.key.includes('blog') || p.key.includes('news'),
  );
  for (const p of editorPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: editorRole.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: editorRole.id, permissionId: p.id },
    });
  }

  // assign read permissions to VIEWER
  const readPerms = createdPermissions.filter((p) => p.key.endsWith('.read'));
  for (const p of readPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: viewerRole.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: viewerRole.id, permissionId: p.id },
    });
  }

  // create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'password123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });

  // Create 20 dummy users with different roles
  const createdUsers = [admin];
  const roles = [adminRole, editorRole, viewerRole];

  const firstNames = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Jessica',
    'James',
    'Mary',
    'William',
    'Patricia',
    'Richard',
    'Jennifer',
    'Thomas',
    'Linda',
    'Charles',
    'Barbara',
    'Mark',
    'Susan',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
  ];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = `user${i + 1}@example.com`;
    const pass = `password${i + 1}`;
    const hash = await bcrypt.hash(pass, 10);
    const role = roles[i % 3]; // Distribute across ADMIN, EDITOR, VIEWER

    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hash },
      create: {
        email,
        passwordHash: hash,
        firstName,
        lastName,
        isActive: true,
      },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });

    createdUsers.push(user);
  }

  // Create 20 blogs by different users
  const blogTitles = [
    'Getting Started with React Hooks',
    'Advanced TypeScript Patterns',
    'NestJS Best Practices',
    'Building Scalable APIs',
    'Frontend Performance Optimization',
    'Database Design Principles',
    'Cloud Architecture Guide',
    'DevOps Essentials',
    'Security Best Practices',
    'Unit Testing Strategies',
    'REST API Design',
    'GraphQL Deep Dive',
    'Docker Containerization',
    'Kubernetes Orchestration',
    'Microservices Architecture',
    'Event-Driven Design',
    'SOLID Principles',
    'Design Patterns in JavaScript',
    'Web Accessibility Guide',
    'Progressive Web Apps',
  ];

  for (let i = 0; i < 20; i++) {
    const user = createdUsers[i % createdUsers.length];
    const title = blogTitles[i];
    const slug = generateSlug(title);
    const status = i % 2 === 0 ? 'published' : 'draft';
    const publishedAt =
      status === 'published'
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        : null;

    const blog = await prisma.blog.create({
      data: {
        slug,
        status,
        authorId: user.id,
        publishedAt,
        translations: {
          create: [
            {
              languageCode: 'en',
              title: `${title}`,
              content: `<p>This is an English blog post about ${title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
            },
            {
              languageCode: 'ar',
              title: `${title} - النسخة العربية`,
              content: `<p>هذا منشور مدونة بالعربية عن ${title}. لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسشينج إيليت. سيد دو إيوسمود تيمبور إنسيديدونت يوت لابور إيت دولور ماجنا ألكويا.</p>`,
            },
          ],
        },
      },
    });
  }

  // Create 20 news items by different users
  const newsTitles = [
    'New Framework Release Announced',
    'Industry Standards Update',
    'Technology Conference Highlights',
    'Breaking: Major Security Vulnerability Patched',
    'New Compiler Version Released',
    'Developer Survey Results',
    'Open Source Project Milestone',
    'Partnership Announcement',
    'Product Launch Suite',
    'Team Expansion News',
    'Community Milestone Reached',
    'New Documentation Available',
    'Performance Improvement Released',
    'Bug Fix Round-up',
    'Roadmap Preview',
    'Integration Partnership',
    'Award Recognition',
    'Research Findings Shared',
    'New Training Program',
    'Community Spotlight',
  ];

  for (let i = 0; i < 20; i++) {
    const user = createdUsers[i % createdUsers.length];
    const title = newsTitles[i];
    const slug = generateSlug(title);
    const status = i % 3 === 0 ? 'published' : 'draft';
    const publishedAt =
      status === 'published'
        ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        : null;
    const expiresAt =
      status === 'published'
        ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        : null;

    await prisma.news.create({
      data: {
        slug,
        status,
        authorId: user.id,
        publishedAt,
        expiresAt,
        translations: {
          create: [
            {
              languageCode: 'en',
              title: `${title}`,
              content: `<p>Breaking news: ${title}. This is an important announcement in English. Details are as follows: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
            },
            {
              languageCode: 'ar',
              title: `${title} - الخبر العربي`,
              content: `<p>خبر عاجل: ${title}. هذا إعلان مهم باللغة العربية. التفاصيل كما يلي: لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسشينج إيليت.</p>`,
            },
          ],
        },
      },
    });
  }

  console.log(`Seeding finished!`);
  console.log(`Created:`);
  console.log(`   - 1 Admin user (${adminEmail})`);
  console.log(`   - 20 Dummy users (user1@example.com to user20@example.com)`);
  console.log(`   - 20 Blog posts with EN/AR translations`);
  console.log(`   - 20 News items with EN/AR translations`);
  console.log(`   - 3 Roles: ADMIN, EDITOR, VIEWER`);
  console.log(`   - 26 Permissions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
