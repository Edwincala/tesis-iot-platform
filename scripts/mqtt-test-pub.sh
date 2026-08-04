#!/bin/bash
# ============================================================
# Script para publicar mensaje de prueba en MQTT
# ============================================================

# Configuración
BROKER="localhost"
PORT="1883"
TOPIC="sensor/temperatura/001/data"
MESSAGE='{"variable":"temperatura","value":25.5,"unit":"°C","timestamp":"2026-08-02T12:00:00Z"}'

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📤 Publicando mensaje de prueba...${NC}"
echo -e "${YELLOW}Tópico:${NC} $TOPIC"
echo -e "${YELLOW}Mensaje:${NC} $MESSAGE"

# Publicar usando mosquitto_pub
mosquitto_pub \
    -h $BROKER \
    -p $PORT \
    -t $TOPIC \
    -m "$MESSAGE" \
    -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Mensaje publicado exitosamente${NC}"
else
    echo -e "${RED}❌ Error publicando mensaje${NC}"
    exit 1
fi