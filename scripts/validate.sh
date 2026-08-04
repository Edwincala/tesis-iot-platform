#!/bin/bash
# ============================================================
# Script de validación del entorno
# ============================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔍 Validando configuración de la plataforma...${NC}"

# 1. Verificar servicios
echo -e "\n${YELLOW}📦 Verificando contenedores...${NC}"
docker-compose ps

# 2. Verificar PostgreSQL
echo -e "\n${YELLOW}🐘 Verificando PostgreSQL...${NC}"
docker exec iot_postgres pg_isready -U iot_user || echo -e "${RED}❌ PostgreSQL no está listo${NC}"

# 3. Verificar Mosquitto
echo -e "\n${YELLOW}📡 Verificando Mosquitto...${NC}"
docker exec iot_mosquitto mosquitto_sub -t test -C 1 -W 1 || echo -e "${RED}❌ Mosquitto no está respondiendo${NC}"

# 4. Verificar Backend
echo -e "\n${YELLOW}⚙️ Verificando Backend...${NC}"
curl -s http://localhost:3001/health || echo -e "${RED}❌ Backend no está respondiendo${NC}"

# 5. Verificar Frontend
echo -e "\n${YELLOW}🌐 Verificando Frontend...${NC}"
curl -s http://localhost:3000 > /dev/null && echo -e "${GREEN}✅ Frontend disponible${NC}" || echo -e "${RED}❌ Frontend no está respondiendo${NC}"

# 6. Verificar Redis
echo -e "\n${YELLOW}💾 Verificando Redis...${NC}"
docker exec iot_redis redis-cli ping || echo -e "${RED}❌ Redis no está respondiendo${NC}"

echo -e "\n${GREEN}✅ Validación completada${NC}"