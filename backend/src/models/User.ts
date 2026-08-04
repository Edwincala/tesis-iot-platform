export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user' | 'viewer';
    full_name?: string;
    company?: string;
    phone?: string;
    preferences?: Record<string, any>;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
    is_active?: boolean;
    email_verified?: boolean;
}

export interface UserCreate extends Omit<User, 'id' | 'created_at' | 'updated_at'> {}
export interface UserUpdate extends Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> {}