import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER || 'iot_user',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'iot_platform',
    password: process.env.DB_PASSWORD || 'iot_pass',
    port: parseInt(process.env.DB_PORT || '5432'),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export { pool };