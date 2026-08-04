#!/bin/bash
# ============================================================
# Script de configuración de autenticación para Mosquitto
# ============================================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔐 Configurando autenticación para Mosquitto...${NC}"

# Crear archivo de contraseñas
PASSWD_FILE="/mosquitto/config/passwd"
ACL_FILE="/mosquitto/config/acl"

# Usuarios a crear
USERS=(
    "backend:iot_backend_pass"
    "simulator:iot_sim_pass"
    "admin:iot_admin_pass"
)

# Crear archivo de contraseñas vacío
touch $PASSWD_FILE

# Agregar usuarios
for user_pass in "${USERS[@]}"; do
    IFS=':' read -r user pass <<< "$user_pass"
    echo -e "${YELLOW}📌 Agregando usuario: $user${NC}"
    
    # Verificar si el usuario ya existe
    if grep -q "^$user:" $PASSWD_FILE; then
        echo -e "${YELLOW}⚠️ Usuario $user ya existe, actualizando...${NC}"
        mosquitto_passwd -b $PASSWD_FILE $user $pass
    else
        mosquitto_passwd -b $PASSWD_FILE $user $pass
    fi
done

# Crear archivo ACL
cat > $ACL_FILE << 'EOF'
# ============================================================
# MOSQUITTO ACL - CONTROL DE ACCESO
# ============================================================

# Usuario backend: puede leer/escribir todo
user backend
topic readwrite #

# Usuario simulator: solo puede publicar en sensores
user simulator
topic write sensor/+/+/data
topic read system/+/ack

# Usuario admin: acceso completo (pero limitado por usuario)
user admin
topic readwrite #

# Usuarios anónimos (si están habilitados): solo lectura de estado
# pattern read $SYS/#

# ============================================================
# ACL POR TÓPICO PARA USUARIOS ESPECÍFICOS
# ============================================================

# Cada usuario solo puede publicar en tópicos con su ID
# (esto se maneja a nivel de aplicación, no en el broker)
EOF

# Cambiar permisos
chmod 600 $PASSWD_FILE
chmod 600 $ACL_FILE

echo -e "${GREEN}✅ Autenticación configurada exitosamente${NC}"
echo -e "${YELLOW}ℹ️ Usuarios creados:${NC}"
echo "  - backend: (contraseña configurada)"
echo "  - simulator: (contraseña configurada)"
echo "  - admin: (contraseña configurada)"