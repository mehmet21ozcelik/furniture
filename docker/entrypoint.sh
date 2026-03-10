#!/bin/sh

echo "--- STARTING ENTRYPOINT ---"

# Veritabanının hazır olmasını bekle (Max 30 saniye)
echo "Veritabanı bağlantısı kontrol ediliyor..."
timer=0
until npx prisma db push --accept-data-loss || [ $timer -eq 30 ]; do
  echo "Veritabanı henüz hazır değil, bekleniyor ($timer/30)..."
  sleep 2
  timer=$((timer + 2))
done

if [ $timer -eq 30 ]; then
  echo "⚠️ UYARI: Veritabanına 30 saniye içinde ulaşılamadı. Uygulama yine de başlatılıyor..."
else
  echo "✓ Veritabanı başarıyla güncellendi."
fi

echo "Uygulama başlatılıyor (server.js)..."
# Uygulamayı başlat, hata alsa bile entrypoint'i durdurma
exec node server.js
