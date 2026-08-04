import { pool } from '../config/database';
import { Rule, RuleCreate, RuleUpdate } from '../models/Rule';

export class RuleRepository {
    async findAll(userId?: number): Promise<any[]> {
        let query = `
            SELECT r.*, d.name as device_name, d.variable, d.unit
            FROM rules r
            JOIN devices d ON r.device_id = d.id
        `;
        const params: any[] = [];
        if (userId) {
            query += ` WHERE r.user_id = $1`;
            params.push(userId);
        }
        query += ` ORDER BY r.created_at DESC`;
        const result = await pool.query(query, params);
        return result.rows;
    }

    async findById(id: number): Promise<any | null> {
        const result = await pool.query(
            `SELECT r.*, d.name as device_name, d.variable, d.unit
             FROM rules r
             JOIN devices d ON r.device_id = d.id
             WHERE r.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async create(rule: any): Promise<any> {
        const result = await pool.query(
            `INSERT INTO rules (user_id, device_id, name, condition_type, value_min, value_max, action_type, action_target)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [rule.user_id, rule.device_id, rule.name, rule.condition_type,
             rule.value_min || null, rule.value_max || null,
             rule.action_type, rule.action_target || null]
        );
        return result.rows[0];
    }

    async update(id: number, rule: any): Promise<any | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (rule.name !== undefined) { fields.push(`name = $${paramCount++}`); values.push(rule.name); }
        if (rule.is_active !== undefined) { fields.push(`is_active = $${paramCount++}`); values.push(rule.is_active); }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const query = `
            UPDATE rules 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING *
        `;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM rules WHERE id = $1 RETURNING id`, [id]);
        return (result.rowCount || 0) > 0;
    }

    async findActiveRules(): Promise<any[]> {
        const result = await pool.query(
            `SELECT r.*, d.name as device_name, d.variable, d.unit
             FROM rules r
             JOIN devices d ON r.device_id = d.id
             WHERE r.is_active = true`
        );
        return result.rows;
    }
}