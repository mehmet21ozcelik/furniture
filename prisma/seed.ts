import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // --- Admin ---
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@admin.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    })
    console.log(`[+] Admin created/verified: ${admin.email}`)

    // --- Categories ---
    const categories = [
        { name: 'Oturma Odası', slug: 'oturma-odasi', description: 'Modern ve şık oturma grupları' },
        { name: 'Yatak Odası', slug: 'yatak-odasi', description: 'Konforlu yatak odası takımları' },
        { name: 'Yemek Odası', slug: 'yemek-odasi', description: 'Şık yemek masaları ve sandalyeler' },
        { name: 'Çalışma Odası', slug: 'calisma-odasi', description: 'Ergonomik çalışma masaları' },
        { name: 'Aksesuar', slug: 'aksesuar', description: 'Ev dekorasyonu için aksesuarlar' },
    ]

    const createdCategories = []
    for (const cat of categories) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                order: categories.indexOf(cat),
            },
        })
        createdCategories.push(createdCat)
        console.log(`[+] Category: ${createdCat.name}`)
    }

    // --- Products ---
    const oturmaOdasiId = createdCategories.find(c => c.slug === 'oturma-odasi')?.id!
    const yatakOdasiId = createdCategories.find(c => c.slug === 'yatak-odasi')?.id!

    const sampleProducts = [
        {
            name: 'Lüx Chester Koltuk',
            slug: 'lux-chester-koltuk',
            shortDescription: 'Hakiki deri kaplama, el isciligi chester koltuk.',
            description: '<p>Evinde klasikten vazgecmeyenler icin ozel olarak uretildi. Hakiki deri kaplama...</p>',
            price: 25000.0,
            categoryId: oturmaOdasiId,
            isFeatured: true,
            images: ['https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800'],
        },
        {
            name: 'Modern Köşe Takımı',
            slug: 'modern-kose-takimi',
            shortDescription: 'Minimalist tasarim, konforlu kose takimi.',
            description: '<p>Dar alanlari degerlendirmek icin mükemmel secim.</p>',
            price: 18000.0,
            categoryId: oturmaOdasiId,
            isFeatured: false,
            images: ['https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800'],
        },
        {
            name: 'Ceviz Masif Karyola',
            slug: 'ceviz-masif-karyola',
            shortDescription: '100% ceviz agacindan uretilmis karyola.',
            description: '<p>Dogalligi yatak odaniza tasiyin. 160x200cm yataklar ile uyumludur.</p>',
            price: null, // Opsiyonel fiyat testi
            categoryId: yatakOdasiId,
            isFeatured: true,
            images: ['https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800'],
        },
    ]

    for (const prd of sampleProducts) {
        await prisma.product.upsert({
            where: { slug: prd.slug },
            update: {},
            create: {
                ...prd,
            },
        })
        console.log(`[+] Product: ${prd.name}`)
    }

    console.log('Seed completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
