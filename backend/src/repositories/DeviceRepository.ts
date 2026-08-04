import { pool } from '../config/database';
import { Device, DeviceCreate, DeviceUpdate } from '../models/Device';

export class DeviceRepository {
    async findAll(userId?: number): Promise<Device[]> {
        let query = `
            SELECT d.id, d.device_id, d.user_id, d.name, d.device_type, d.variable,
                   d.unit, d.location, d.mqtt_topic, d.metadata, d.is_active,
                   d.created_at, d.updated_at, d.last_reading, d.last_value,
                   u.username as owner_username
            FROM devices d
            JOIN users u ON d.user_id = u.id
        `;
        const params: any[] = [];
        if (userId) {
            query += ` WHERE d.user_id = $1`;
            params.push(userId);
        }
        query += ` ORDER BY d.created_at DESC`;
        const result = await pool.query(query, params);
        return result.rows;
    }

    async findById(id: number): Promise<Device | null> {
        const result = await pool.query(
            `SELECT d.*, u.username as owner_username
             FROM devices d
             JOIN users u ON d.user_id = u.id
             WHERE d.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async create(device: any): Promise<Device> {
        const result = await pool.query(
            `INSERT INTO devices (device_id, user_id, name, device_type, variable, unit, location, mqtt_topic)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [device.device_id, device.user_id, device.name, device.device_type,
             device.variable, device.unit || null, device.location || null, device.mqtt_topic]
        );
        return result.rows[0];
    }

    async update(id: number, device: any): Promise<Device | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (device.name !== undefined) { fields.push(`name = $${paramCount++}`); values.push(device.name); }
        if (device.location !== undefined) { fields.push(`location = $${paramCount++}`); values.push(device.location); }
        if (device.is_active !== undefined) { fields.push(`is_active = $${paramCount++}`); values.push(device.is_active); }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const query = `
            UPDATE devices 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM devices WHERE id = $1 RETURNING id`, [id]);
        return (result.rowCount || 0) > 0;
    }

    async updateReading(id: number, value: number): Promise<void> {
        await pool.query(
            `UPDATE devices 
             SET last_reading = NOW(), last_value = $1,
                 reading_count = reading_count + 1
             WHERE id = $2`,
            [value, id]
        );
    }
}