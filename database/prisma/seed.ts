import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('[seed] Starting database seed...');

  // ----- Languages -----
  const hebrew = await prisma.language.upsert({
    where: { code: 'he' },
    update: {},
    create: { code: 'he', name: 'Hebrew', isDefault: true, isActive: true },
  });

  const english = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English', isDefault: false, isActive: true },
  });

  console.warn(`[seed] Languages: ${hebrew.name}, ${english.name}`);

  // ----- Roles -----
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Full access to all features and settings' },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: { name: 'editor', description: 'Content management: scenarios, translations, media' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'App user: read content, journal, anchors' },
  });

  console.warn(`[seed] Roles: ${adminRole.name}, ${editorRole.name}, ${userRole.name}`);

  // ----- Permissions -----
  const permissionKeys = [
    // Scenarios
    { key: 'scenarios.create', description: 'Create scenarios' },
    { key: 'scenarios.read', description: 'Read scenarios' },
    { key: 'scenarios.update', description: 'Update scenarios' },
    { key: 'scenarios.delete', description: 'Delete scenarios' },
    // Translations
    { key: 'translations.read', description: 'Read translations' },
    { key: 'translations.edit', description: 'Edit translations' },
    // Media
    { key: 'media.upload', description: 'Upload media files' },
    { key: 'media.read', description: 'Read/list media files' },
    { key: 'media.delete', description: 'Delete media files' },
    // Home buttons
    { key: 'home-buttons.create', description: 'Create home buttons' },
    { key: 'home-buttons.read', description: 'Read home buttons' },
    { key: 'home-buttons.update', description: 'Update home buttons' },
    { key: 'home-buttons.delete', description: 'Delete home buttons' },
    // Users
    { key: 'users.read', description: 'Read user list' },
    { key: 'users.manage', description: 'Manage users and roles' },
    // Settings
    { key: 'settings.manage', description: 'Manage system settings' },
  ];

  for (const perm of permissionKeys) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm,
    });
  }

  console.warn(`[seed] Permissions: ${permissionKeys.length} created`);

  // ----- Role-Permission assignments -----
  const allPermissions = await prisma.permission.findMany();

  // Admin gets ALL permissions
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // Editor gets content-related permissions
  const editorPermKeys = [
    'scenarios.create', 'scenarios.read', 'scenarios.update', 'scenarios.delete',
    'translations.read', 'translations.edit',
    'media.upload', 'media.read',
    'home-buttons.read', 'home-buttons.update',
  ];
  const editorPerms = allPermissions.filter((p) => editorPermKeys.includes(p.key));
  for (const perm of editorPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: editorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: editorRole.id, permissionId: perm.id },
    });
  }

  // User role gets read-only content permissions
  const userPermKeys = ['scenarios.read', 'translations.read', 'media.read', 'home-buttons.read'];
  const userPerms = allPermissions.filter((p) => userPermKeys.includes(p.key));
  for (const perm of userPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: userRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: userRole.id, permissionId: perm.id },
    });
  }

  console.warn('[seed] Role-Permission assignments complete');
  console.warn('[seed] ✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('[seed] ❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
