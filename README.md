# Mobilya Vitrin Sitesi

Modern, seo uyumlu, hızlı mobilya ürün tanıtım ve katalog projesi.

## Özellikler
- **Teknoloji**: Next.js 14 App Router, TypeScript, TailwindCSS
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Authentication**: JWT, custom admin middleware, jose & bcrypt
- **Tasarım**: Minimalist, Google Fonts (Cormorant Garamond, Lato)
- **SEO**: ISR (Revalidate), Dynamic Sitemap & Robots, Canonical Tags, JSON-LD Schema (Organization, Product, BreadcrumbList)
- **Deployment**: Multi-stage Dockerfile ve docker-compose

## Kurulum ve Çalıştırma

### 1. Ortam Değişkenleri
Proje dizininde `.env` dosyanızı oluşturun (`.env.example` içeriğine bakabilirsiniz).

### 2. Docker ile Çalıştırma (Önerilen)
```bash
docker-compose up -d --build
```
Servisler:
- Web Uygulaması: `http://localhost:3000`
- Veritabanı (PostgreSQL): `localhost:5432`
- pgAdmin: `http://localhost:5050` (admin@admin.com / admin)

### 3. Veritabanını Hazırlama
Container'lar calıştıktan sonra veritabanı tablolarını oluşturun ve varsayılan verileri yükleyin:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
**Admin Girişi Bilgileri:**
- **Email:** `admin@admin.com`
- **Şifre:** `admin123`
- Adres: `http://localhost:3000/login`

## Proje Yapısı
- `app/(public)`: Herkese açık sayfalar (Ana sayfa, ürünler, vs.)
- `app/(admin)`: Yönetici paneli korumalı rotalar
- `app/api`: API endpointleri (Login, logout, health vb.)
- `components/`: UI, layout ve admin bileşenleri
- `lib/`: Yardımcı araçlar, SEO ayarları, db instance, auth mantığı
- `prisma/`: Veritabanı modeli ve seed verisi
