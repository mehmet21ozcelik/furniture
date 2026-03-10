#!/bin/sh

echo "--- STARTING ENTRYPOINT ---"

# Veritabanı senkronizasyonu
echo "Veritabanı senkronizasyon araçları hazırlandı..."
timer=0

# Artık prisma her yerde çalışmalı (Global kurulu)
until prisma db push --accept-data-loss || [ $timer -eq 20 ]; do
  echo "Veritabanına bağlanılamadı veya tablo oluşturulamadı, bekleniyor ($timer/20)..."
  sleep 4
  timer=$((timer + 4))
done

if [ $timer -ge 20 ]; then
  echo "⚠️ UYARI: Veritabanı senkronizasyonu tamamlanamamış olabilir. Uygulama başlatılıyor..."
else
  echo "✓ Veritabanı başarıyla senkronize edildi (site_settings hazır)."
fi

echo "Uygulama başlatılıyor (node server.js)..."
exec node server.js
