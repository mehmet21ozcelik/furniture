#!/bin/sh

echo "--- STARTING ENTRYPOINT ---"

# Veritabanı bağlantısı beklemeye gerek yok çünkü docker-compose depends_on healthcheck kullanıyor
# ama yine de kontrol edelim

echo "Veritabanı şeması kontrol ediliyor ve güncelleniyor..."
# Prisma db push komutunu çalıştır
# Eğer başarısız olursa log bırak ama uygulamayı başlatmayı dene (veya hata ver)
if npx prisma db push --accept-data-loss; then
    echo "✓ Veritabanı başarıyla güncellendi."
else
    echo "✗ Veritabanı güncellenirken HATA oluştu!"
    # Buradaki hata kritik olabilir ama server.js'in çalışmasını tamamen engelleyip engellemeyeceğine bakabiliriz
    # Şimdilik durmasını istiyoruz çünkü tablo yoksa uygulama çalışmaz
    exit 1
fi

echo "Uygulama başlatılıyor (server.js)..."
exec node server.js
