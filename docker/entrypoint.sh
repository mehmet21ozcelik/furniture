#!/bin/sh

echo "--- STARTING ENTRYPOINT ---"

# Veritabanının hazır olmasını bekle
echo "Veritabanı senkronizasyonu başlatılıyor..."
timer=0

# npx'in prisma'yı bulduğundan emin olalım
echo "Prisma versiyonu kontrol ediliyor..."
./node_modules/.bin/prisma -v || npx prisma -v

until ./node_modules/.bin/prisma db push --accept-data-loss || npx prisma db push --accept-data-loss || [ $timer -eq 20 ]; do
  echo "Veritabanına bağlanılamadı veya tablo oluşturulamadı, bekleniyor ($timer/20)..."
  sleep 4
  timer=$((timer + 4))
done

if [ $timer -ge 20 ]; then
  echo "⚠️ UYARI: Veritabanı senkronizasyonu tamamlanamamış olabilir."
else
  echo "✓ Veritabanı başarıyla senkronize edildi."
fi

echo "Uygulama başlatılıyor (node server.js)..."
exec node server.js
