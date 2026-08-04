#!/bin/bash
# ============================================================
# Benchmark de rendimiento MQTT
# ============================================================

BROKER="localhost"
PORT="1883"
MESSAGES=1000
SIZE=256

echo "🚀 Iniciando benchmark MQTT..."
echo "📊 Mensajes: $MESSAGES"
echo "📦 Tamaño: $SIZE bytes"

# Crear mensaje de prueba
MESSAGE=$(head -c $SIZE < /dev/zero | tr '\0' 'A')

# Medir tiempo de publicación
START=$(date +%s%N)

for i in $(seq 1 $MESSAGES); do
    mosquitto_pub -h $BROKER -p $PORT -t "benchmark" -m "$MESSAGE" -q 1 &
done

wait
END=$(date +%s%N)

# Calcular resultados
DURATION=$((($END - $START) / 1000000))  # Milisegundos
RATE=$(echo "$MESSAGES / ($DURATION / 1000)" | bc -l)

echo ""
echo "📊 Resultados:"
echo "  ⏱️ Tiempo total: $DURATION ms"
echo "  📈 Tasa: $RATE mensajes/segundo"
echo "  📉 Latencia promedio: $((DURATION / $MESSAGES)) ms/mensaje"