#!/bin/bash
# ============================================================
# Script de pruebas de base de datos
# ============================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🧪 Probando conexión y esquema de base de datos...${NC}"

# 1. Verificar conexión
echo -e "\n${YELLOW}📡 Verificando conexión...${NC}"
docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT 1" > /dev/null
echo -e "${GREEN}✅ Conexión exitosa${NC}"

# 2. Verificar tablas
echo -e "\n${YELLOW}📋 Verificando tablas...${NC}"
TABLES=("users" "devices" "measurements" "rules" "alerts" "audit_log" "notifications" "sessions")

for table in "${TABLES[@]}"; do
    COUNT=$(docker exec iot_postgres psql -U iot_user -d iot_platform -t -c "SELECT COUNT(*) FROM $table")
    echo -e "  📊 Tabla $table: $COUNT registros"
done

# 3. Verificar vistas
echo -e "\n${YELLOW}👁️ Verificando vistas...${NC}"
VIEWS=("v_devices_with_owner" "v_latest_measurements" "v_device_statistics" "v_pending_alerts")

for view in "${VIEWS[@]}"; do
    docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT 1 FROM $view LIMIT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "  ✅ Vista $view existe"
    else
        echo -e "  ❌ Vista $view no existe"
    fi
done

# 4. Verificar índices
echo -e "\n${YELLOW}🔍 Verificando índices...${NC}"
INDEX_COUNT=$(docker exec iot_postgres psql -U iot_user -d iot_platform -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'")
echo -e "  📊 Total de índices: $INDEX_COUNT"

# 5. Verificar usuarios
echo -e "\n${YELLOW}👤 Verificando usuarios...${NC}"
docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT username, role, is_active FROM users WHERE username IN ('admin', 'demo')"

# 6. Verificar dispositivos
echo -e "\n${YELLOW}📱 Verificando dispositivos...${NC}"
docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT device_id, name, device_type, is_active FROM devices LIMIT 5"

# 7. Verificar particiones
echo -e "\n${YELLOW}📦 Verificando particiones...${NC}"
docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT tablename FROM pg_tables WHERE tablename LIKE 'measurements_%'"

# 8. Probar consulta de último dato
echo -e "\n${YELLOW}📊 Probando consulta de último dato...${NC}"
docker exec iot_postgres psql -U iot_user -d iot_platform -c "SELECT * FROM v_latest_measurements LIMIT 3"

echo -e "\n${GREEN}✅ Pruebas completadas exitosamente${NC}"