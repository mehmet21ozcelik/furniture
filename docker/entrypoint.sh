#!/bin/sh
set -e

echo "Veritabanı şeması kontrol ediliyor ve güncelleniyor..."
# Prisma db push komutunu uygulama başlamadan önce çalıştır
npx prisma db push --accept-data-loss

echo "Uygulama başlatılıyor..."
exec node server.js
