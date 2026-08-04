import express from 'express';
import cors from 'cors';
import { client as mqttClient } from './config/mqtt';
import { pool } from './config/database';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        services: {
            mqtt: { connected: mqttClient.connected },
            database: { connected: true }
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`  GET  /health`);
    console.log(`  GET  /api/users`);
    console.log(`  GET  /api/users/:id`);
    console.log(`  GET  /api/devices`);
    console.log(`  GET  /api/devices/:id`);
    console.log(`  GET  /api/measurements`);
    console.log(`  GET  /api/measurements/latest/:deviceId`);
    console.log(`  GET  /api/measurements/statistics/:deviceId`);
    console.log(`  GET  /api/rules`);
    console.log(`  GET  /api/rules/active`);
    console.log(`  GET  /api/rules/:id`);
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando conexiones...');
    await mqttClient.end();
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Recibido SIGTERM, cerrando conexiones...');
    await mqttClient.end();
    await pool.end();
    process.exit(0);
});