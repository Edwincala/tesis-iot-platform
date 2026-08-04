import { pool } from '../config/database';
import { User, UserCreate, UserUpdate } from '../models/User';

export class UserRepository {
    async findAll(): Promise<User[]> {
        const result = await pool.query(
            `SELECT id, username, email, role, full_name, company, 
                    created_at, updated_at, last_login, is_active
             FROM users ORDER BY created_at DESC`
        );
        return result.rows;
    }

    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            `SELECT id, username, email, role, full_name, company, 
                    created_at, updated_at, last_login, is_active
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        return result.rows[0] || null;
    }

    async create(user: any): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, role, full_name, company)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username, email, role, full_name, company, created_at, is_active`,
            [user.username, user.email, user.password_hash, user.role || 'user', 
             user.full_name || null, user.company || null]
        );
        return result.rows[0];
    }

    async update(id: number, user: any): Promise<User | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (user.full_name !== undefined) {
            fields.push(`full_name = $${paramCount++}`);
            values.push(user.full_name);
        }
        if (user.company !== undefined) {
            fields.push(`company = $${paramCount++}`);
            values.push(user.company);
        }
        if (user.is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(user.is_active);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const query = `
            UPDATE users 
            SET ${fields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING id, username, email, role, full_name, company, created_at, is_active
        `;
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
        return (result.rowCount || 0) > 0;
    }

    async updateLastLogin(id: number): Promise<void> {
        await pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [id]);
    }
}