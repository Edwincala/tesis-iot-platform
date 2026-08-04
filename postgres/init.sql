-- ============================================================
-- CONFIGURACIÓN INICIAL
-- ============================================================
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================
-- EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLAS
-- ============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    full_name VARCHAR(100),
    company VARCHAR(100),
    phone VARCHAR(20),
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- Tabla de dispositivos
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    device_type VARCHAR(20) NOT NULL,
    variable VARCHAR(50) NOT NULL,
    unit VARCHAR(20),
    location VARCHAR(100),
    mqtt_topic VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_reading TIMESTAMPTZ,
    last_value DECIMAL(10, 3),
    reading_count INTEGER DEFAULT 0
);

-- Tabla de mediciones (sin particiones para simplificar)
CREATE TABLE IF NOT EXISTS measurements (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    value DECIMAL(10, 3) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    quality SMALLINT DEFAULT 100,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_anomaly BOOLEAN DEFAULT FALSE,
    predicted_value DECIMAL(10, 3)
);

-- Tabla de reglas
CREATE TABLE IF NOT EXISTS rules (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    condition_type VARCHAR(20) NOT NULL,
    value_min DECIMAL(10, 3),
    value_max DECIMAL(10, 3),
    action_type VARCHAR(20) NOT NULL,
    action_target VARCHAR(255),
    action_payload JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_triggered TIMESTAMPTZ,
    trigger_count INTEGER DEFAULT 0
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_variable ON devices(variable);
CREATE INDEX IF NOT EXISTS idx_measurements_device_id ON measurements(device_id);
CREATE INDEX IF NOT EXISTS idx_measurements_timestamp ON measurements(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rules_user_id ON rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rules_device_id ON rules(device_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_rules_updated_at
    BEFORE UPDATE ON rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

-- Usuarios (contraseña: admin123 / demo123)
INSERT INTO users (username, email, password_hash, role, full_name, email_verified) 
VALUES 
    ('admin', 'admin@iot.local', '$2b$10$ZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5', 'admin', 'Administrador', true),
    ('demo', 'demo@iot.local', '$2b$10$ZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5kzZkZ5', 'user', 'Usuario Demo', true)
ON CONFLICT (username) DO NOTHING;

-- Dispositivos
INSERT INTO devices (device_id, user_id, name, device_type, variable, unit, location, mqtt_topic) 
VALUES 
    ('sensor_temp_001', (SELECT id FROM users WHERE username = 'demo'), 'Sensor Temperatura Oficina', 'sensor', 'temperatura', '°C', 'Oficina 301', 'sensor/temperatura/001'),
    ('sensor_hum_001', (SELECT id FROM users WHERE username = 'demo'), 'Sensor Humedad Laboratorio', 'sensor', 'humedad', '%', 'Laboratorio 2', 'sensor/humedad/001'),
    ('sensor_pres_001', (SELECT id FROM users WHERE username = 'demo'), 'Sensor Presión Sala', 'sensor', 'presion', 'hPa', 'Sala Servidores', 'sensor/presion/001'),
    ('sensor_luz_001', (SELECT id FROM users WHERE username = 'demo'), 'Sensor Luz Pasillo', 'sensor', 'luz', 'lux', 'Pasillo', 'sensor/luz/001'),
    ('actuator_fan_001', (SELECT id FROM users WHERE username = 'demo'), 'Ventilador Principal', 'actuator', 'ventilador', 'boolean', 'Sala Servidores', 'actuator/ventilador/001')
ON CONFLICT (device_id) DO NOTHING;

-- Reglas de ejemplo
INSERT INTO rules (user_id, device_id, name, description, condition_type, value_max, action_type, action_target) 
SELECT 
    u.id,
    d.id,
    'Alerta Temperatura Alta',
    'Dispara alerta cuando temperatura > 30°C',
    'gt',
    30,
    'notification',
    'demo@iot.local'
FROM users u
JOIN devices d ON d.device_id = 'sensor_temp_001' AND d.user_id = u.id
WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

-- Algunas mediciones de ejemplo
INSERT INTO measurements (device_id, user_id, value, timestamp)
SELECT 
    d.id,
    u.id,
    20 + random() * 10,
    NOW() - (interval '5 minutes' * generate_series(1, 50))
FROM devices d
JOIN users u ON d.user_id = u.id
WHERE d.device_type = 'sensor' AND d.variable = 'temperatura'
ON CONFLICT DO NOTHING;

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista de últimas mediciones
CREATE OR REPLACE VIEW v_latest_measurements AS
SELECT DISTINCT ON (device_id)
    m.device_id,
    d.name AS device_name,
    d.variable,
    d.unit,
    m.value,
    m.timestamp AS last_reading_time
FROM measurements m
JOIN devices d ON m.device_id = d.id
ORDER BY device_id, m.timestamp DESC;

-- Vista de dispositivos con propietario
CREATE OR REPLACE VIEW v_devices_with_owner AS
SELECT 
    d.id,
    d.device_id,
    d.name,
    d.device_type,
    d.variable,
    d.unit,
    d.location,
    d.is_active,
    u.username AS owner_username,
    u.full_name AS owner_name
FROM devices d
JOIN users u ON d.user_id = u.id;

-- ============================================================
-- FUNCIONES DE UTILIDAD
-- ============================================================

-- Función para obtener estadísticas de un dispositivo
CREATE OR REPLACE FUNCTION get_device_stats(p_device_id INTEGER)
RETURNS TABLE(
    total_readings BIGINT,
    avg_value DECIMAL,
    min_value DECIMAL,
    max_value DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        AVG(value),
        MIN(value),
        MAX(value)
    FROM measurements
    WHERE device_id = p_device_id
        AND timestamp >= NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;