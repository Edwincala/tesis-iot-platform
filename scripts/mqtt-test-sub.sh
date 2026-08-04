#!/bin/bash
# ============================================================
# Script para suscribirse a todos los tópicos MQTT
# ============================================================

# Configuración
BROKER="localhost"
PORT="1883"
TOPIC="#"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}📡 Suscribiéndose a todos los tópicos...${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para salir${NC}"
echo ""

# Suscribirse usando mosquitto_sub
mosquitto_sub \
    -h $BROKER \
    -p $PORT \
    -t $TOPIC \
    -v \
    --pretty

# El flag -v muestra el tópico y el mensaje
# --pretty formatea la salida JSON