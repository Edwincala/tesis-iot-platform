#!/bin/bash
# ============================================================
# Script de inicio de la plataforma
# ============================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando Plataforma IoT...${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

# Verificar archivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado, creando desde .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Revisa y actualiza el archivo .env con tus configuraciones${NC}"
fi

# Levantar servicios
echo -e "${GREEN}📦 Levantando contenedores...${NC}"
docker-compose up -d

# Esperar a que los servicios estén listos
echo -e "${GREEN}⏳ Esperando que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo -e "${GREEN}📊 Estado de los servicios:${NC}"
docker-compose ps

# Mostrar URLs
echo -e "\n${GREEN}✅ Plataforma disponible en:${NC}"
echo -e "  🌐 Frontend:  http://localhost:3000"
echo -e "  🔧 Backend:   http://localhost:3001"
echo -e "  📡 MQTT:      localhost:1883"
echo -e "  📊 MQTT WS:   localhost:9001"
echo -e "  📈 ML API:    http://localhost:8000"

echo -e "\n${YELLOW}📝 Credenciales por defecto:${NC}"
echo -e "  Admin: admin / admin123"
echo -e "  Demo:  demo / demo123"

echo -e "\n${GREEN}🔍 Para ver logs: docker-compose logs -f${NC}"
echo -e "${GREEN}🛑 Para detener:  docker-compose down${NC}"