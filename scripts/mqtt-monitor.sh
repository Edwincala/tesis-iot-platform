#!/bin/bash
# ============================================================
# Dashboard de monitoreo MQTT en tiempo real
# ============================================================

BROKER="localhost"
PORT="1883"

echo "📊 Dashboard MQTT - Monitoreo en tiempo real"
echo "============================================="
echo ""

# Monitorear estadísticas del broker
mosquitto_sub -h $BROKER -p $PORT -t '$SYS/#' -v | while read line; do
    clear
    echo "📊 Dashboard MQTT - $(date)"
    echo "============================================="
    
    # Mostrar estadísticas principales
    echo "$line" | grep -E "clients|messages|bytes|publish|subscriptions" | while read stat; do
        topic=$(echo $stat | cut -d' ' -f1)
        value=$(echo $stat | cut -d' ' -f2)
        
        case $topic in
            *clients/connected) echo "  🟢 Clientes conectados: $value" ;;
            *clients/total) echo "  👥 Clientes totales: $value" ;;
            *messages/sent) echo "  📤 Mensajes enviados: $value" ;;
            *messages/received) echo "  📥 Mensajes recibidos: $value" ;;
            *bytes/sent) echo "  ⬆️ Bytes enviados: $value" ;;
            *bytes/received) echo "  ⬇️ Bytes recibidos: $value" ;;
            *publish/sent) echo "  📨 Publicaciones enviadas: $value" ;;
            *subscriptions/count) echo "  📋 Suscripciones: $value" ;;
        esac
    done
    
    echo ""
    echo "🔄 Actualizando cada 2 segundos..."
    sleep 2
done