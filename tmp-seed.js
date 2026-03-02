const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
    console.log('[*] Starting user creation/upsert...');
    const passwordHash = await bcrypt.hash('admin123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: { passwordHash: passwordHash },
        create: {
            name: 'Admin',
            email: 'admin@admin.com',
            passwordHash: passwordHash,
            role: 'ADMIN'
        }
    });
    console.log('[+] Admin user ensured:', user.email);
}
main()
    .catch((err) => {
        console.error('[!] Error creating user:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
