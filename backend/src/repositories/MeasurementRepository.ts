import { pool } from '../config/database';

export class MeasurementRepository {
    async findAll(query: any = {}): Promise<any[]> {
        try {
            let sql = `
                SELECT m.id, m.device_id, m.user_id, m.value, m.timestamp, 
                       m.quality, m.metadata,
                       d.name as device_name, d.variable, d.unit
                FROM measurements m
                JOIN devices d ON m.device_id = d.id
                WHERE 1=1
            `;
            const params: any[] = [];
            let paramCount = 1;

            if (query.device_id) {
                sql += ` AND m.device_id = $${paramCount++}`;
                params.push(query.device_id);
            }
            if (query.user_id) {
                sql += ` AND m.user_id = $${paramCount++}`;
                params.push(query.user_id);
            }
            
            // Ordenar y limitar
            sql += ` ORDER BY m.timestamp DESC`;
            
            if (query.limit) {
                sql += ` LIMIT $${paramCount++}`;
                params.push(query.limit);
            }

            const result = await pool.query(sql, params);
            return result.rows;
        } catch (error) {
            console.error('Error en MeasurementRepository.findAll:', error);
            throw error;
        }
    }

    async create(measurement: any): Promise<any> {
        try {
            const result = await pool.query(
                `INSERT INTO measurements (device_id, user_id, value, timestamp, quality)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [measurement.device_id, measurement.user_id, measurement.value,
                 measurement.timestamp || new Date(), measurement.quality || 100]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error en MeasurementRepository.create:', error);
            throw error;
        }
    }

    async findLatestByDevice(deviceId: number, limit: number = 1): Promise<any[]> {
        try {
            const result = await pool.query(
                `SELECT * FROM measurements
                 WHERE device_id = $1
                 ORDER BY timestamp DESC
                 LIMIT $2`,
                [deviceId, limit]
            );
            return result.rows;
        } catch (error) {
            console.error('Error en MeasurementRepository.findLatestByDevice:', error);
            throw error;
        }
    }

    async getStatistics(deviceId: number, hours: number = 24): Promise<any> {
        try {
            const result = await pool.query(
                `SELECT 
                    COUNT(*) as total_readings,
                    AVG(value) as avg_value,
                    MIN(value) as min_value,
                    MAX(value) as max_value
                 FROM measurements
                 WHERE device_id = $1 
                 AND timestamp >= NOW() - INTERVAL '${hours} hours'`,
                [deviceId]
            );
            return result.rows[0] || { total_readings: 0, avg_value: null, min_value: null, max_value: null };
        } catch (error) {
            console.error('Error en MeasurementRepository.getStatistics:', error);
            throw error;
        }
    }
}